///////////////////////////////////////////////
//// CONSTANTS
///////////////////////////////////////////////
const TOTAL_WORDS = 5757; // total number of words in words.json
const WORD_LENGTH = 5; // each guess word is 5 letters long
const FLIP_ANIMATION_DURATION = 300; // total animation duration for tile flips
const DANCE_ANIMATION_DURATION = 300; // total animation duration for tile dance

///////////////////////////////////////////////
//// ELEMENT NAMES
///////////////////////////////////////////////
const playerGrid = document.querySelector("[data-player-grid]");
const cpuGrid = document.querySelector("[data-cpu-grid]");
const playerKeyboard = document.querySelector("[data-player-keyboard]");
const cpuKeyboard = document.querySelector("[data-cpu-keyboard]");
const alertContainer = document.querySelector("[data-alert-container");
const playerGuess = [];

///////////////////////////////////////////////
//// FETCH BLOCK: RETRIEVE WORDS.JSON DATA
///////////////////////////////////////////////
fetch("words.json")
  .then((res) => res.json())
  .then((data) => {
    ///////////////////////////////////
    // SELECTION ENGINE
    ///////////////////////////////////
    const targetWord = data[Math.floor(Math.random() * TOTAL_WORDS)]; // target word needs to be declared inside fetch block
    console.log(targetWord); // left in only for demo, will be removed in production

    ///////////////////////////////////
    // EVALUATION ENGINE
    ///////////////////////////////////
    // checks guess word against target word letter-by-letter and assigns grid tiles bad/valid/placed classes
    function evaluateGuess(tile, index, array, guessWord) {
      const letter = tile.dataset.letter;
      let key;
      if (tile.dataset.owner === "cpu") {
        key = cpuKeyboard.querySelector(`[data-cpu-key="${letter}"i]`);
      } else if (tile.dataset.owner === "player") {
        key = playerKeyboard.querySelector(`[data-player-key="${letter}"i]`);
      }

      setTimeout(() => {
        tile.classList.add("flip");
      }, (index * FLIP_ANIMATION_DURATION) / 2);

      tile.addEventListener("transitionend", () => {
        tile.classList.remove("flip");
        if (targetWord[index] === letter) {
          tile.dataset.state = "placed";
          key.classList.add("placed");
        } else if (targetWord.includes(letter)) {
          tile.dataset.state = "valid";
          key.classList.add("valid");
        } else {
          tile.dataset.state = "bad";
          key.classList.add("bad");
        }

        if (array[0].dataset.owner === "cpu") {
          if (index === array.length - 1) {
            tile.addEventListener(
              "transitionend",
              () => {
                checkWinCondition(guessWord, array);
                handlePlayerInput();
                storeCpuMemory(array);
              },
              { once: true }
            );
          }
        }

        if (array[0].dataset.owner === "player") {
          if (index === array.length - 1) {
            tile.addEventListener(
              "transitionend",
              () => {
                checkWinCondition(guessWord, array);
                handleCpuInput();
                storeCpuMemory(array);
                generateCpuGuess();
              },
              { once: true }
            );
          }
        }
      });
    }

    // triggers win condition animation if player guesses the word within 6 attempts, otherwise reveals the word and ends the round
    function checkWinCondition(guessWord, tiles) {
      if (guessWord === targetWord) {
        showAlert("Great Job!", 5000);
        danceTiles(tiles);
        blockPlayerInput();
        blockCpuInput();
        return;
      }
      const checkGuessesLeft = cpuGrid.querySelectorAll(":not([data-letter])");
      if (checkGuessesLeft.length === 0) {
        showAlert(`The Word was ${targetWord.toUpperCase()}`, null);
        blockPlayerInput();
      }
    }

    ///////////////////////////////////
    // PLAYER INTERACTIONS
    ///////////////////////////////////
    // listens for player input either through onscreen/ device keyboard
    function handleCpuInput() {
      document
        .querySelector("[data-cpu-keyboard]")
        .addEventListener("click", handleOnscreenKeyboard);
    }
    handleCpuInput();

    function blockCpuInput() {
      document
        .querySelector("#cpuSide")
        .removeEventListener("click", handleOnscreenKeyboard);
    }

    function handlePlayerInput() {
      document
        .querySelector("[data-player-keyboard]")
        .addEventListener("click", handleOnscreenKeyboard);
      document.addEventListener("keydown", handleDeviceKeyboard);
    }
    handlePlayerInput();

    // blocks player from inputting a guess word
    function blockPlayerInput() {
      document
        .querySelector("#playerSide")
        .removeEventListener("click", handleOnscreenKeyboard);
      document.removeEventListener("keydown", handleDeviceKeyboard);
    }

    // passes letters/ guess words input through onscreen keyboard to other relevant functions
    function handleOnscreenKeyboard(event) {
      // watches input by player
      if (event.target.matches("[data-player-delete]")) {
        deleteLetter();
        return;
      }
      if (event.target.matches("[data-player-key]")) {
        setLetter({ playerKey: event.target.dataset.playerKey });
        return;
      }
      if (event.target.matches("[data-player-enter]")) {
        submitGuess([...getActivePlayerTiles()]);
        return;
      }
      // watches input by cpu
      if (event.target.dataset.cpuKey.match(/^[A-Z]$/)) {
        setLetter(event.target.dataset);
      } else {
        submitGuess([...getActiveCpuTiles()]);
      }
    }

    // passes letters/ guess words input through onscreen keyboard to other relevant functions
    function handleDeviceKeyboard(event) {
      if (event.key === "Enter") {
        submitGuess([...getActivePlayerTiles()]);
        return;
      }
      if (event.key === "Backspace" || event.key === "Delete") {
        deleteLetter();
        return;
      }
      if (event.key.match(/^[a-z]$/)) {
        setLetter({ playerKey: event.key });
        return;
      }
    }

    // let lettersArr = ["G", "L", "E", "A", "M"];
    function submitCpuInput(lettersArr) {
      lettersArr.push("GO");
      let interval = 200;
      let increment = 1;
      let clickEvent = new Event("click", { bubbles: true });
      // sauce: https://stackoverflow.com/questions/25256535/javascript-set-interval-for-each-array-value-setinterval-array-foreach/37215055#37215055
      for (let i = 0; i <= WORD_LENGTH; i++) {
        let runner = setTimeout(() => {
          document
            .querySelector(`[data-cpu-key="${lettersArr[i]}"]`)
            .dispatchEvent(clickEvent);
          clearTimeout(runner);
        }, interval * increment);
        increment++;
      }
    }

    // returns array of tiles (html elements) where player has keyed in some letter
    function getActivePlayerTiles() {
      return playerGrid.querySelectorAll('[data-state="active"]');
    }

    function getActiveCpuTiles() {
      return cpuGrid.querySelectorAll('[data-state="active"]');
    }

    // fills 1 letter per tile only
    function setLetter(key) {
      console.log(key.playerKey);
      if (Object.keys(key)[0] === "playerKey") {
        const activePlayerTile = getActivePlayerTiles();
        if (activePlayerTile.length >= WORD_LENGTH) return;
        const nextPlayerTileToFill = playerGrid.querySelector(
          ":not([data-letter])"
        );
        nextPlayerTileToFill.dataset.letter = key.playerKey.toLowerCase();
        nextPlayerTileToFill.innerHTML = key.playerKey;
        nextPlayerTileToFill.dataset.state = "active";
        nextPlayerTileToFill.dataset.owner = "player";
      }
      if (Object.keys(key)[0] === "cpuKey") {
        const nextCpuTileToFill = cpuGrid.querySelector(":not([data-letter])");
        nextCpuTileToFill.dataset.letter = key.cpuKey.toLowerCase();
        nextCpuTileToFill.innerHTML = key.cpuKey;
        nextCpuTileToFill.dataset.state = "active";
        nextCpuTileToFill.dataset.owner = "cpu";
      }
    }

    // allows onscreen/device keyboard backspace to remove letters from guess input
    function deleteLetter() {
      const activeTiles = getActivePlayerTiles();
      const lastTile = activeTiles[activeTiles.length - 1];
      if (lastTile === undefined) return;
      lastTile.innerHTML = "";
      delete lastTile.dataset.state;
      delete lastTile.dataset.letter;
    }

    // onscreen/device keyboard enter will send guess word to evaluation engine, function has 3 responsibilities
    function submitGuess(activeTiles) {
      // stringifies guessword for validation & submission to evaluation engine
      let guessWord = "";
      for (let i = 0; i < activeTiles.length; i++) {
        guessWord += activeTiles[i].dataset.letter;
      }

      if (activeTiles.length < WORD_LENGTH) {
        // validates that submitted guess word is at least 5 letters long, sets `shake` class for error animation/alert
        showAlert("Not Enough Letters");
        shakeTiles(activeTiles);
        return;
      } else if (
        // validates that submitted word is in words.json, sets `shake` class for error animation/ alert
        activeTiles.length == WORD_LENGTH &&
        data.includes(guessWord) === false
      ) {
        showAlert("Not a Wardle Word");
        shakeTiles(activeTiles);
        return;
      } else {
        // once validated, player is blocked from submitting another guess word until evaluation engine is done
        blockCpuInput();
        blockPlayerInput;
      }

      // submit validated cpu/player input to evaluation engine
      activeTiles.forEach((...params) => {
        // passes validated guessword to evaluation engine letter by letter
        evaluateGuess(...params, guessWord);
      });
    }

    // error message for validation checks in submitGuess()
    function showAlert(message, duration = 200) {
      const alert = document.createElement("div");
      alert.innerHTML = message;
      alert.classList.add("alert");
      alertContainer.prepend(alert);
      if (duration == null) return;

      setTimeout(() => {
        alert.classList.add("hide");
        alert.addEventListener("transitionend", () => {
          alert.remove();
        });
      }, duration);
    }

    // error animation for validation checks in submitGuess()
    function shakeTiles(tiles) {
      tiles.forEach((tile) => {
        tile.classList.add("shake");
        tile.addEventListener(
          "animationend",
          () => {
            tile.classList.remove("shake");
          },
          { once: true }
        );
      });
    }

    // win condition met animation trigger
    function danceTiles(tiles) {
      tiles.forEach((tile, index) => {
        setTimeout(() => {
          tile.classList.add("dance");
          tile.addEventListener(
            "animationend",
            () => {
              tile.classList.remove("dance");
            },
            { once: true }
          );
        }, (index * DANCE_ANIMATION_DURATION) / 5);
      });
    }

    ///////////////////////////////////
    // CPU ENGINE
    ///////////////////////////////////
    const previousGuess = [];
    const previousPlayerGuess = [];

    function storeCpuMemory(array) {
      let wordConstructor = [];
      if (array[0].dataset.owner == "player") {
        for (let i = 0; i < array.length; i++) {
          wordConstructor.push(array[i].dataset.letter);
        }
        previousPlayerGuess.push(wordConstructor.join(""));
      }
    }

    function generateCpuGuess() {
      let selectedWord = "";
      selectedWord = data[Math.floor(Math.random() * TOTAL_WORDS - 1)];
      lettersArr = Array.from(selectedWord.toUpperCase());
      previousGuess.push(selectedWord);
      submitCpuInput(lettersArr);
      // console.log(previousPlayerGuess);
    }
  });
