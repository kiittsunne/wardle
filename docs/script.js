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
const keyboard = document.querySelector("[data-keyboard]");
const alertContainer = document.querySelector("[data-alert-container");

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
      const key = keyboard.querySelector(`[data-key="${letter}"i]`);
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

        if (index === array.length - 1) {
          tile.addEventListener(
            "transitionend",
            () => {
              handlePlayerInput();
              checkWinCondition(guessWord, array);
            },
            { once: true }
          );
        }
      });
    }

    // triggers win condition animation if player guesses the word within 6 attempts, otherwise reveals the word and ends the round
    function checkWinCondition(guessWord, tiles) {
      if (guessWord === targetWord) {
        showAlert("Great Job!", 5000);
        danceTiles(tiles);
        blockPlayerInput();
        return;
      }
      const checkGuessesLeft = playerGrid.querySelectorAll(
        ":not([data-letter])"
      );
      if (checkGuessesLeft.length === 0) {
        showAlert(`The Word was ${targetWord.toUpperCase()}`, null);
        blockPlayerInput();
      }
    }

    ///////////////////////////////////
    // PLAYER GRID INTERACTIONS
    ///////////////////////////////////
    // listens for player input either through onscreen/ device keyboard
    function handlePlayerInput() {
      document.addEventListener("click", handleOnscreenKeyboard);
      document.addEventListener("keydown", handleDeviceKeyboard);
    }
    handlePlayerInput();

    // blocks player from inputting a guess word
    function blockPlayerInput() {
      document.removeEventListener("click", handleOnscreenKeyboard);
      document.removeEventListener("keydown", handleDeviceKeyboard);
    }

    // passes letters/ guess words input through onscreen keyboard to other relevant functions
    function handleOnscreenKeyboard(event) {
      if (event.target.matches("[data-key]")) {
        setLetter(event.target.dataset.key);
        return;
      }
      if (event.target.matches("[data-enter]")) {
        submitGuess();
        return;
      }
      if (event.target.matches("[data-delete]")) {
        deleteLetter();
        return;
      }
    }

    // passes letters/ guess words input through onscreen keyboard to other relevant functions
    function handleDeviceKeyboard(event) {
      if (event.key === "Enter") {
        submitGuess();
        return;
      }
      if (event.key === "Backspace" || event.key === "Delete") {
        deleteLetter();
        return;
      }
      if (event.key.match(/^[a-z]$/)) {
        setLetter(event.key);
        return;
      }
    }

    // returns array of tiles (html elements) where player has keyed in some letter
    function getActiveTiles() {
      return playerGrid.querySelectorAll('[data-state="active"]');
    }

    // fills 1 letter per tile only
    function setLetter(key) {
      const activeTile = getActiveTiles();
      if (activeTile.length >= WORD_LENGTH) return;
      const nextTileToFill = playerGrid.querySelector(":not([data-letter])");
      nextTileToFill.dataset.letter = key.toLowerCase();
      nextTileToFill.innerHTML = key;
      nextTileToFill.dataset.state = "active";
    }

    // allows onscreen/device keyboard backspace to remove letters from guess input
    function deleteLetter() {
      const activeTiles = getActiveTiles();
      const lastTile = activeTiles[activeTiles.length - 1];
      if (lastTile === undefined) return;
      lastTile.innerHTML = "";
      delete lastTile.dataset.state;
      delete lastTile.dataset.letter;
    }

    // onscreen/device keyboard enter will send guess word to evaluation engine, function has 3 responsibilities
    function submitGuess() {
      const activeTiles = [...getActiveTiles()];

      // stringifies guessword for validation & submission to evaluation engine
      let guessWord = "";
      for (let i = 0; i < activeTiles.length; i++) {
        guessWord += activeTiles[i].dataset.letter;
      }

      // validates that submitted guess word is at least 5 letters long, sets `shake` class for error animation/alert
      if (activeTiles.length < WORD_LENGTH) {
        showAlert("Not Enough Letters");
        shakeTiles(activeTiles);
        return;
      }

      // validates that submitted word is in words.json, sets `shake` class for error animation/ alert
      if (
        activeTiles.length == WORD_LENGTH &&
        data.includes(guessWord) === false
      ) {
        showAlert("Not a Wardle Word");
        shakeTiles(activeTiles);
        return;
      }

      // once validated, player is blocked from submitting another guess word until evaluation engine is done
      blockPlayerInput();
      activeTiles.forEach((...params) => {
        // passes validated guessword to evaluation engine
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
  });
