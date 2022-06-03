# Project 1 Proposal: Wardle

### Overview

Wardle is a Wordle clone with a turn-based twist. The player will race against a CPU to guess a 5-letter word in 6 tries or fewer.

![Wardle Figma](/Wardle.png)

#### Technical Requirements

- Vanilla HTML, CSS, JS
  - JS: DOM manipulation via browser events
  - JSON instead of API for word list
- Aiming to have the game be playable on pc browser for initial version
  - mobile browser version: might require UI re-design, will keep it simple for now.

#### Motivations

- Understanding & experimenting with CSS animations & DOM manipulation
- Designing "dumb AI" system that can "learn" from player behaviour to make decisions

---

### Game Mechanics and Summary of Components

#### Mechanics & Terminology:

**Rules -**

1. A 5-letter target word is set when the game starts, guessing this word is the goal of **Wardle**
2. Player and CPU will take turns to submit guesses, aiming to match the target word. Player starts first.
3. Player and CPU will each have 6 guesses. The first to guess the target word wins.
4. If neither Player nor CPU guess the word within 6 attempts, the game ends.

**Game terms -**

- "Target word": the word that player/cpu are trying to guess (aka win condition)
- "Guess word": words input by player/cpu in attempt to match target word
  - Guess words must be in `words.json`
  - Player & CPU each submit up to 6 guess words per game
- "Placed Letter": submitted letter that is in the same letter slot as target word - tile will turn green
- "Valid letter": submitted letter that is in the target word, but in the wrong letter slot - tile will turn yellow
- "Bad letter": submitted letter that is not in the target word - tile will turn grey
- "Turn": consists of submission of guess, evaluation check, animation of tiles flipping/ changing color
- "Evaluation state":
  - `completed evaluation`: evaluation engine has checked letters and finished triggering change of tile appearance
  - `incomplete evaluation`: any state prior to completed evaluation

#### Components:

**UI/UX considerations**

- Word Grid component UI

  - 5 x 5 grid
  - Color palette [source](https://www.color-hex.com/color-palette/1012607): white (#ffffff), black (#000000), green (#6ca965), yellow (#c8b653), grey (#787c7f)
  - font: Helvetica Neue (included font file in repo)

- Keyboard component UI (below grid, not shown in mockup)

  - Display all letter keys in QWERTY format

- Interactivity

  - Player inputs guess words through keyboard, guesses submitted on enter keypress
  - Grid must display input word with 1 letter per tile in the row
  - Player can key in but not submit guess before CPU's turn ends
  - Letters in tiles & keyboard must persist guess word & evaluation state from previous guesses

- Animation
  - Grid tiles should flip one by one to reveal the evaluated state ([Reference](https://tobiasahlin.com/spinkit/))
  - Keyboard keys should update to display evaluated state (if any)
  - Show some sort of spinner whilst the CPU is sorting & randomly choosing a word so the user knows to wait

**Logic Engines**

1. Selection & Evaluation engine

   - Initialise a game instance
   - Choose a target word from `words.json`
   - Receive player & cpu guess words and check against target words
   - Communicate with UI components to update display based on evaluation outcome

2. CPU engine: 2 levels of difficulty

   - **MVP difficulty:** Is blind to player's choices/ outcome info, essentially a vanilla Wordle bot

     - Step 1: chooses a random word from `words.json` -> submits to evaluation engine
     - Subsequent steps:
       1. filters a longList (no bad letters)
       2. then a shortList (match placed letters, has valid letters)
       3. then a finalList, where a random word will be chosen from & repeat Step 1

   - **Stretch Goal difficulty:** Optimise 1st word choice, can see info from player input, more selective about shortList valid letter placement

     - first guess: will only use words with all unique letters
     - can see player input: will include bad & placed letters into filtering conditions
     - more selective valid letter placement: only add words where valid letters are BOTH present && NOT IN previous yellow slots

   - Anticipated challenges:
     - Sorting algo may be very slow, will need to consider how to optimise or manage this if the wait becomes considerably long

---

### Story Points & Task List

#### Monday: build basic Wordle

- [ ] Logic Engine I

  - [ ] Complete Selection & Evaluation engine

- [ ] UI Components I

  - [ ] Complete Grid & Keyboard components, Interactivity (keyboard input, persistent display), Animations (flip on evaluation status change)

  **Expected Story Points: Functioning Wordle game**

  1. Player can key in a word: should display in correct row, 1 letter to a tile
  2. Player can submit word:

     - Eval engine must return evaluation results
     - Tile flip animation & correct styling should be displayed
     - Keyboard letter keys should also update display to show bad, placed, valid letters

  3. Player guesses word within 6 turns: all tiles should be green
  4. Player fails to guess word within 6 turns: display fail statement (through alert for now) & refresh game instance

#### Tuesday: cpu logic

- [ ] Logic Engine II

  - [ ] Complete CPU engine

  **Expected Story Points: CPU engine can log to console**

  - on CPU engine trigger, it can:
    - choose a word
    - pass that word to evaluation engine
    - retrieve evaluation engine results
    - complete it's list filtering tasks & return a next word
    - ^ finish a game of Wordle by itself with these behaviours

#### Wednesday: connecting cpu to UI & ironing out player-cpu interaction (MVP completion)

- [ ] UI Components II

  - [ ] Ensure CPU words & evaluation results can be displayed on CPU grid, similar to player's

- [ ] Logic Engine III

  - [ ] CPU should wait for player to finish their turn before triggering
  - [ ] Player should not be able to submit guess before CPU's turn is finished

  **Expected Story Points: MVP completion**

#### Thursday: stretch goals

- [ ] Logic Engine IV

  - [ ] Implement Level 2 difficulty for CPU engine

- [ ] UI Components III

  - [ ] Create a theme toggle for the page: dark/light mode + maybe other funky color themes

---

### Daily Retrospective

#### Monday:

#### Tuesday:

#### Wednesday:

#### Thursday:

#### Presentation & Afterthoughts:
