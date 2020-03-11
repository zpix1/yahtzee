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

export function combRep(arr, l) {
  if(l === void 0) l = arr.length; // Length of the combinations
  var data = Array(l),             // Used to store state
      results = [];                // Array of results
  (function f(pos, start) {        // Recursive function
    if(pos === l) {                // End reached
      results.push(data.slice());  // Add a copy of data to results
      return;
    }
    for(var i=start; i<arr.length; ++i) {
      data[pos] = arr[i];          // Update data
      f(pos+1, i);                 // Call f recursively
    }
  })(0, 0);                        // Start at index 0
  return results;                  // Return results
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
made by @zpix1 2018-2020<br>

click triangle for settings, try playing vs AI and more than 1 player<br>

rules: <a href="http://www.yahtzee.org.uk/rules.html">www.yahtzee.org.uk/rules.html</a><br>

btw what adjustments actually are?
`}


export function ScoringPage () { return `
<br>
If you score in the upper section of the table, your score is the total
of the specified die face.<br>
So if you roll:<br>
5 - 2 - 5 - 6 - 5 and score in the Fives category, your total for the
category would be 15, because there are three fives, which are added
together.<br>
If the One, Three or Four Categories were selected for scoring with
this roll, you would score a zero.<br>
If placed in the Two or Six category, you would score 2 and 6
respectively.<br>
<br>
Bonus If the total of Upper scores is 63 or more, add a bonus of 35.
Note that 63 is the total of three each of 1s, 2s, 3s, 4s, 5s and 6s.
Did you know there are now some <a href=https://www.bestusaonlinecasinos.com/>US Casino</a> sites offering electronic Yahtzee-themed slots? Yahtzee is one of the interesting games you could try.<br>
<br>
<span style="font-weight: bold; text-decoration: underline;">Lower
Section Scoring</span><br>
<br>
In the lower scores, you score either a set amount, or zero if you
don't satisfy the category requirements.<br>
<br>
<span style="text-decoration: underline;">3 and 4 of
a kind</span>
For 3 of a kind you must have at least 3 of the same die faces. You
score the total of all the dice. For 4 of a kind you would need 4 die
faces the same.<br>
<br>
<span style="text-decoration: underline;">Small and
Large Straight</span>
A Straight is a sequence of consecutive die faces, where a small
straight is 4 consecutive faces, and a large straight 5 consecutive
faces.<br>
Small straights score 30 and a large 40 points.<br>
So if you rolled:<br>
2 - 3 - 2 - 5 - 4<br>
you could score 30 in small straight or 0 in large straight.<br>
<br>
<span style="text-decoration: underline;">Full House</span>
A
Full House is where you have 3 of a kind and 2 of a kind. Full houses
score 25 points.<br>
i.e.:<br>
3 - 3 - 2 - 3 - 2<br>
would score 25 in the Full House category.<br>
<br>
<span style="text-decoration: underline;">First
Yahtzee</span> A
Yahtzee is 5 of a kind and scores 50 points, although you may elect NOT
to score it as a yahtzee, instead choosing to take it as a top row
score and safegaurd you bonus.

<big><span style="text-decoration: underline; color: rgb(0, 102, 0);"><br><br>Additional
Yahtzees</span></big>.
If you roll a second Yahtzee in a game, and you scored your first
yahtzee in the Yahtzee box, you would score a further bonus 100 points
in the yahtzee box. You must also put this roll into another category,
as follows;<br>
-If the corresponding Upper section category is not filled then you
must score there.<br>
ie if you rolled 4 - 4 - 4 - 4 - 4 and the Fours Category is not
filled, you must put the score in the Fours category.<br>
<br>
-If the corresponding Upper section category is filled you may then put
the score anywhere on the Upper Section (scoring zero). In 3 of a Kind,
4 of a Kind, and Chance categories you would score the total of the die
faces. For the Small Straight, Large Straight, and Full House
categories, you would score 30, 40 and 25 points respectively.<br>
<br>
<span style="text-decoration: underline;">Chance</span>
You can
roll anything and be able to put it in the Chance category. You score
the total of the die faces.<br>
<br>
<span style="font-weight: bold; text-decoration: underline;">Scratch
or Dump scores.</span> <br>
<br>
You can score any roll in any category at any time, even if the
resulting score is zero. Eg, you<br>
can take 2-3-3-4-6 in the 5's category. It will score 0. This could be
used near the end of a game to lose a poor roll against a
difficult-to-get category that you've failed to fill (eg, long straight
or yahtzee).<br><br>
`}