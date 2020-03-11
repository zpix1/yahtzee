export function defaultDice () {
  return [
    {used: false, type: 0, id: 0},
    {used: false, type: 0, id: 1},
    {used: false, type: 0, id: 2},
    {used: false, type: 0, id: 3},
    {used: false, type: 0, id: 4}
  ]
}

export function defaultScores () {
  return [{}, {}, {}, {}, {}, {}, {}, {}, {}]
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

function sumOfAll (dice) {
  var ans = 0
  for (var i = 0; i < dice.length; i++) {
    ans += dice[i].type
  }
  return ans
}

function getMap (dice) {
  var map = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}

  for (var i = 0; i < dice.length; i++) {
    map[dice[i].type] += 1
  }
  return map
}

function arraysEqual (a, b) {
  if (a instanceof Array && b instanceof Array) {
    if (a.length !== b.length) {
      return false
    }
    for (var i = 0; i < a.length; i++) {
      if (!arraysEqual(a[i], b[i])) {
        return false
      }
    }
    return true
  } else {
    return a === b
  }
}

export const combinations = [
  {
    group: 0,
    id: 1,
    name: 'ones',
    maxValue: 3,
    calc: function (dice) {
      return sumOfType(dice, 1)
    }
  }, {
    group: 0,
    id: 2,
    name: 'twos',
    maxValue: 6,
    calc: function (dice) {
      return sumOfType(dice, 2)
    }
  }, {
    group: 0,
    id: 3,
    name: 'threes',
    maxValue: 9,
    calc: function (dice) {
      return sumOfType(dice, 3)
    }
  }, {
    group: 0,
    id: 4,
    name: 'fours',
    maxValue: 12,
    calc: function (dice) {
      return sumOfType(dice, 4)
    }
  }, {
    group: 0,
    id: 5,
    name: 'fives',
    maxValue: 15,
    calc: function (dice) {
      return sumOfType(dice, 5)
    }
  }, {
    group: 0,
    id: 6,
    name: 'sixes',
    maxValue: 20,
    calc: function (dice) {
      return sumOfType(dice, 6)
    }
  }, {
    group: 1,
    id: 7,
    name: 'x3',
    maxValue: 20,
    calc: function (dice) {
      let arr = Object.values(getMap(dice))
      if (Math.max(...arr) >= 3) {
        return sumOfAll(dice)
      } else {
        return 0
      }
    }
  }, {
    group: 1,
    id: 8,
    name: 'x4',
    maxValue: 20,
    calc: function (dice) {
      let arr = Object.values(getMap(dice))
      if (Math.max(...arr) >= 4) {
        return sumOfAll(dice)
      } else {
        return 0
      }
    }
  }, {
    group: 1,
    id: 9,
    name: 'full house',
    maxValue: 15,
    calc: function (dice) {
      let arr = Object.values(getMap(dice)).filter(Number)

      if (arraysEqual(arr, [2, 3]) || arraysEqual(arr, [3, 2])) {
        return 25
      } else {
        return 0
      }
    }
  }, {
    group: 1,
    id: 10,
    name: 'small straight',
    maxValue: 25,
    calc: function (dice) {
      let possibleCombs = [
        {1: 1, 2: 1, 3: 1, 4: 1},
        {5: 1, 2: 1, 3: 1, 4: 1},
        {6: 1, 5: 1, 3: 1, 4: 1}
      ]
      let map = getMap(dice)
      var done = true
      for (var i = 0; i < possibleCombs.length; i++) {
        for (var type in possibleCombs[i]) {
          if (map[type] < possibleCombs[i][type]) {
            done = false
          }
        }
        if (done) {
          return 30
        }
        done = true
      }
      return 0
    }
  }, {
    group: 1,
    id: 11,
    name: 'long straight',
    maxValue: 30,
    calc: function (dice) {
      let possibleCombs = [
        {1: 1, 2: 1, 3: 1, 4: 1, 5: 1},
        {5: 1, 2: 1, 3: 1, 4: 1, 6: 1}
      ]
      let map = getMap(dice)
      var done = true
      for (var i = 0; i < possibleCombs.length; i++) {
        for (var type in possibleCombs[i]) {
          if (map[type] < possibleCombs[i][type]) {
            done = false
          }
        }
        if (done) {
          return 40
        }
        done = true
      }
      return 0
    }
  }, {
    group: 1,
    id: 12,
    name: 'yahtzee',
    maxValue: 30,
    calc: function (dice) {
      let arr = Object.values(getMap(dice))
      if (Math.max(...arr) >= 5) {
        return 50
      } else {
        return 0
      }
    }
  }, {
    group: 1,
    id: 13,
    maxValue: 25,
    name: 'chance',
    calc: sumOfAll
  }
]
