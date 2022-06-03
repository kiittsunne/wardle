# Project 1 Proposal: Wardle

## Overview

Wardle is a Wordle clone with a turn-based twist. The player will race against a CPU to guess a 5-letter word in 6 tries or fewer.

![Wardle Figma](/Wardle.png)

**Technical Requirements**

- Vanilla HTML, CSS, JS
  - JS: DOM manipulation via browser events
  - JSON instead of API for word list
- Aiming to have the game be playable on pc browser for initial version
  - mobile browser version: might require UI re-design, will keep it simple for now.

**Motivations**

- Understanding & experimenting with CSS animations & DOM manipulation
- Designing "dumb AI" system that can "learn" from player behaviour to make decisions

## Task List

- [ ] MVP

  - [ ] Choose a 5 letter word from words.json as the target word
  - [ ] Accept user input of 5 letter word & evaluate each letter (placed, valid, bad)
  - [ ] Modify UI to assign css classes to letters

    - [ ] Stretch: CSS animations to "flip" the tiles

  - [ ] On user input, CPU to select a 5 letter word and input for evaluation as well

    - [ ] In subsequent tries, CPU should "learn" to do the following:
      - [ ] Avoid words with bad letters
      - [ ] Prioritise words with placed & valid letters
    - [ ] Stretch: CPU to consider info from player's attempts to refine word choice

  - [ ] Once player or CPU has determined the target word to display win statement
  - [ ] Log points earned by Player vs CPU
