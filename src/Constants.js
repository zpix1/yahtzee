export function defaultDice () {
  return [
    {used: false, type: 0},
    {used: false, type: 0},
    {used: false, type: 0},
    {used: false, type: 0},
    {used: false, type: 0}
  ]
}

function sumOfType (dice, type) {
  var ans = 0
  for (var i = 0; i < dice.length; i++) {
    if (dice[i].type === type) {
      ans += dice[i].type
    }
  }
  return ans
}

export const combinations = [
  {
    id: 1,
    name: 'ones',
    calc: function (dice) {
      return sumOfType(dice, 1)
    }
  }, {
    id: 2,
    name: 'twos',
    calc: function (dice) {
      return sumOfType(dice, 2)
    }
  }, {
    id: 3,
    name: 'threes',
    calc: function (dice) {
      return sumOfType(dice, 3)
    }
  }, {
    id: 4,
    name: 'fours',
    calc: function (dice) {
      return sumOfType(dice, 4)
    }
  }, {
    id: 5,
    name: 'fives',
    calc: function (dice) {
      return sumOfType(dice, 5)
    }
  }, {
    id: 6,
    name: 'sixes',
    calc: function (dice) {
      return sumOfType(dice, 6)
    }
  }
]
