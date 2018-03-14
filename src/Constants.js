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
    id: 1,
    name: 'Единицы',
    calc: function (dice) {
      return sumOfType(dice, 1)
    }
  }, {
    id: 2,
    name: 'Двойки',
    calc: function (dice) {
      return sumOfType(dice, 2)
    }
  }, {
    id: 3,
    name: 'Тройки',
    calc: function (dice) {
      return sumOfType(dice, 3)
    }
  }, {
    id: 4,
    name: 'Четверки',
    calc: function (dice) {
      return sumOfType(dice, 4)
    }
  }, {
    id: 5,
    name: 'Пятерки',
    calc: function (dice) {
      return sumOfType(dice, 5)
    }
  }, {
    id: 6,
    name: 'Шестерки',
    calc: function (dice) {
      return sumOfType(dice, 6)
    }
  }, {
    id: 7,
    name: 'x3',
    calc: function (dice) {
      let arr = Object.values(getMap(dice))
      if (Math.max(...arr) >= 3) {
        return sumOfAll(dice)
      } else {
        return 0
      }
    }
  }, {
    id: 8,
    name: 'x4',
    calc: function (dice) {
      let arr = Object.values(getMap(dice))
      if (Math.max(...arr) >= 4) {
        return sumOfAll(dice)
      } else {
        return 0
      }
    }
  }, {
    id: 9,
    name: 'Фулл Хаус',
    calc: function (dice) {
      let arr = Object.values(getMap(dice)).filter(Number)

      if (arraysEqual(arr, [2, 3]) || arraysEqual(arr, [3, 2])) {
        return 25
      } else {
        return 0
      }
    }
  }, {
    id: 10,
    name: 'Малая',
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
    id: 11,
    name: 'Большая',
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
    id: 12,
    name: 'Yahtzee',
    calc: function (dice) {
      let arr = Object.values(getMap(dice))
      if (Math.max(...arr) >= 5) {
        return 50
      } else {
        return 0
      }
    }
  }
]
