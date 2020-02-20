export function getRandomInt (min, max) {
  var byteArray = new Uint8Array(1)
  window.crypto.getRandomValues(byteArray)

  var range = max - min + 1
  var maxRange = 256
  if (byteArray[0] >= Math.floor(maxRange / range) * range) {
    return getRandomInt(min, max)
  }
  return min + (byteArray[0] % range)
}

export function RulesPage () { return `
<h1>How to play Yahtzee</h1>
<h3>Object of the game</h3>

The object of Yahtzee is to obtain the highest score from throwing 5 dice.
The game consists of 13 rounds. In each round, you roll the dice and then score the roll in one of 13 categories. You must score once in each category. The score is determined by a different rule for each category.
The game ends once all 13 categories have been scored.

<h3>Game Start</h3>

To start with, roll all the dice. After rolling you can either score the current roll (see below), or re-roll any or all of the dice.

You may only roll the dice a total of 3 times. After rolling 3 times you must choose a category to score.

You may score the dice at any point in the round, i.e. it doesn't have to be after the 3rd roll.

<h3>Scoring</h3>

To score your combination of 5 dice, you click one of the 13 boxes. There are two sections to the score table - the Upper Section and the Lower Section.

Once a box has been scored, it cannot be scored again for the rest of the game, so choose wisely.
`}


export function AboutPage () { return `
<h1>How to play Yahtzee</h1>
<h3>Object of the game</h3>

The object of Yahtzee is to obtain the highest score from throwing 5 dice.
The game consists of 13 rounds. In each round, you roll the dice and then score the roll in one of 13 categories. You must score once in each category. The score is determined by a different rule for each category.
The game ends once all 13 categories have been scored.

<h3>Game Start</h3>

To start with, roll all the dice. After rolling you can either score the current roll (see below), or re-roll any or all of the dice.

You may only roll the dice a total of 3 times. After rolling 3 times you must choose a category to score.

You may score the dice at any point in the round, i.e. it doesn't have to be after the 3rd roll.

<h3>Scoring</h3>

To score your combination of 5 dice, you click one of the 13 boxes. There are two sections to the score table - the Upper Section and the Lower Section.

Once a box has been scored, it cannot be scored again for the rest of the game, so choose wisely.
`}


export function ScoringPage () { return `
<h1>How to play Yahtzee</h1>
<h3>Object of the game</h3>

The object of Yahtzee is to obtain the highest score from throwing 5 dice.
The game consists of 13 rounds. In each round, you roll the dice and then score the roll in one of 13 categories. You must score once in each category. The score is determined by a different rule for each category.
The game ends once all 13 categories have been scored.

<h3>Game Start</h3>

To start with, roll all the dice. After rolling you can either score the current roll (see below), or re-roll any or all of the dice.

You may only roll the dice a total of 3 times. After rolling 3 times you must choose a category to score.

You may score the dice at any point in the round, i.e. it doesn't have to be after the 3rd roll.

<h3>Scoring</h3>

To score your combination of 5 dice, you click one of the 13 boxes. There are two sections to the score table - the Upper Section and the Lower Section.

Once a box has been scored, it cannot be scored again for the rest of the game, so choose wisely.
`}