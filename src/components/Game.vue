<template>
  <div class="main">
    <h1 class="header">Yahtzee</h1>
    
    <div class="wrapper card">
      <div class="scores block">
        <table class="scores-table">
          <colgroup>
            <col style="width:20%">
            <col v-for="playerID in playersCount" v-bind:style="{width: 30/playersCount + '%'}">
            </col>
            <col style="width:20%">
            <col v-for="playerID in playersCount" v-bind:style="{width: 30/playersCount + '%'}">
            </col>
          </colgroup>
          <thead>
            <tr>
              <th>Co</th>
              <th v-for="playerID in playersCount">
                {{ playerID }}
              </th>

              <th>Co</th>
              <th v-for="playerID in playersCount">
                {{ playerID }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-bind:key="doubleComb[0].id" v-for="doubleComb in combinations.slice(0, 12).map((e, i, a) => i < a.length/2  ? [e, a[i + a.length / 2]] : '').slice(0,combinations.length/2)">
              <template v-for="comb in doubleComb">
                <td>{{ comb.name }}</td>
                <td v-for="(_, playerID) in (playersCount)" 
                    v-bind:key="playerID+'_'+comb.id" 
                    v-bind:class="{ 
                      setscore: scores[playerID][comb.id] !== undefined, 
                      scorecell: (rolled && playerTurn === playerID && scores[playerID][comb.id] === undefined ? true : false) 
                    }" 
                    v-on:click="setScore(playerID, comb.id)">
                    {{ calcCell(playerID, comb) }}
                    {{ scores[playerID][comb.id] }} 
                </td>
              </template>
            </tr>

            <tr>
              <td>Bonus</td>
              <td class="bonuscell" v-for="(_, playerID) in (playersCount)" v-bind:class="{ setscore: partSum(scores[playerID]) >= bonusRequire }">{{ partSum(scores[playerID]) }}/{{ bonusRequire }}</td>
              <td>{{ combinations[12].name }}</td>
              <td v-for="(_, playerID) in playersCount" 
                  v-bind:key="playerID+'_'+combinations[12].id" 
                  v-bind:class="{ 
                    setscore: scores[playerID][combinations[12].id] !== undefined, 
                    scorecell: (rolled && playerTurn === playerID && scores[playerID][combinations[12].id] === undefined ? true : false) 
                  }" 
                  v-on:click="setScore(playerID, combinations[12].id)">
                  {{ calcCell(playerID, combinations[12]) }}
                  {{ scores[playerID][combinations[12].id] }} 
              </td>
            </tr>

            <tr>
              <td v-for="playerID in playersCount-2">
              </td>
              <td></td><td></td><td></td>
              <td>Total</td>
              <td v-for="playerID in playersCount">
                {{ finalSum(scores[playerID-1]) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="dice block">
        Dice
        <Dice :dice="dice" :willRoll="willRoll"/>
      </div>
      
      <div class="buttons block">
        <img class="settings-icon"
          src="https://png.icons8.com/metro/1600/settings.png"
          @click="settings"
        />
        <button @mousedown="adsRoll" type="button" id="roll-dice" class="button" v-bind:class="{ unclickable: rollsLeft === 0, red: rollsLeft === 0, blue: rollsLeft > 0 }">
          {{ rollButtonMessage }}
        </button>
      </div>
      <div v-bind:class="{'hidden': !showSettings}" class="settings block">
        <div>
          Reset game <button class="danger" @click="confirmReset">RESET</button>
        </div>
        <div>
          Adjustments <button v-bind:class="{success: adjustments, info: !adjustments}" @click="adjustments = !adjustments">{{ adjustments ? 'ON' : 'OFF' }}</button>
        </div>
        <div>
          Players count <button class="info" @click="playersCount = playersCount === maxPlayersCount ? 2 : playersCount + 1">{{ playersCount }}</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { defaultDice, combinations } from '../constants'
import { getRandomInt } from '../utility'
import Dice from './Dice'

export default {
  name: 'game',
  components: {
    Dice
  },
  data () {
    return {
      willRoll: false,
      bonusRequire: 63,
      bonusSize: 35,
      playerTurn: 0,
      playersCount: 2,
      maxPlayersCount: 4,
      rollsLeft: 3,
      rolled: false,
      rollButtonMessage: 'Player 1 turn',
      dice: defaultDice(),
      combinations: combinations,
      scores: [{}, {}, {}, {}, {}, {}, {}, {}],
      adjustments: false,
      showSettings: false
    }
  },
  persist: ['scores', 'playerTurn', 'rollsLeft', 'rolled', 'dice', 'rollButtonMessage', 'adjustments', 'playersCount'],
  methods: {
    calcCell: function (player, comb) {
      return this.rolled && this.playerTurn === player && this.scores[player][comb.id] === undefined ? comb.calc(this.dice) : undefined
    },
    adsRoll: function (event) {
      var gx = event.clientX - event.target.getClientRects()[0].x
      // var gy = event.clientY - event.target.getClientRects()[0].y
      if (gx < 8 && this.adjustments) {
        this.roll(true)
      } else {
        this.roll(false)
      }
    },
    roll: function (activate) {
      if (this.rollsLeft === 0) {
        return
      }

      this.rolled = true
      this.willRoll = true

      setTimeout(() => { this.willRoll = false }, 500)

      if (activate) {
        var combs = this.combinations.filter((c) => this.scores[this.playerTurn][c.id] === undefined && c.id !== 13) // No chance pls
        var newDices = Array(this.dice.length)
        var allDices = []

        for (var i = 0; i < this.dice.length; i++) {
          newDices[i] = Object.assign({}, this.dice[i])
        }

        // console.log(newDices.map((e) => e.type))

        for (var j = 0; j < 100; j++) {
          var tempDices = newDices.map(e => Object.assign({}, e)).slice()
          for (i = 0; i < tempDices.length; i++) {
            if (!tempDices[i].used) {
              tempDices[i].type = getRandomInt(1, 6)
            }
          }
          // console.log(tempDices.map((e) => e.type))
          allDices.push(tempDices)
        }

        var ans = {dice: null, val: -1, comb: null}
        for (j = 0; j < combs.length; j++) {
          var comb = combs[j]
          for (i = 0; i < allDices.length; i++) {
            if (comb.calc(allDices[i]) > ans.val) {
              ans.dice = allDices[i]
              ans.val = comb.calc(allDices[i])
              ans.comb = comb
            }
          }
        }

        // console.log(ans)
        for (i = 0; i < this.dice.length; i++) {
          var d = this.dice[i]
          if (!d.used) {
            d.type = ans.dice[i].type
          }
        }
      } else {
        for (i = 0; i < this.dice.length; i++) {
          d = this.dice[i]
          if (!d.used) {
            d.type = getRandomInt(1, 6)
          }
        }
      }
      const throwsLeft = --this.rollsLeft
      this.rollButtonMessage = throwsLeft === 1 ? '1 throw left' : `${throwsLeft} throws left`

      if (this.rollsLeft === 0) {
        this.rollButtonMessage = 'No throws left'
      }
    },
    setScore: function (player, combId) {
      if ((this.rolled) && (player === this.playerTurn) && (!this.scores[player].hasOwnProperty(combId))) {
        var comb = this.combinations.find(e => e.id === combId)

        var ans = comb.calc(this.dice)
        this.$set(this.scores[player], combId, ans)

        this.rolled = false
        this.playerTurn = (this.playerTurn + 1) % this.playersCount
        console.log(this.playerTurn)
        this.rollButtonMessage = 'Player ' + (this.playerTurn + 1) + ' turn'
        this.dice = defaultDice()
        this.rollsLeft = 3

        this.winner()
      }
    },
    partSum: function (obj) {
      var ans = 0
      for (var i = 0; i < this.combinations.length; i++) {
        if (this.combinations[i].group === 0) {
          ans += obj[this.combinations[i].id] || 0
        }
      }
      return ans
    },
    finalSum: function (obj) {
      var ans = 0
      var partSum = this.partSum(obj)
      if (partSum >= this.bonusRequire) {
        ans += this.bonusSize
      }
      for (var i = 0; i < this.combinations.length; i++) {
        ans += obj[this.combinations[i].id] || 0
      }
      return ans
    },
    reset: function () {
      this.willRoll = false
      this.playerTurn = 0
      this.rollsLeft = 3
      // this.playersCount = 2

      this.rolled = false
      this.rollButtonMessage = 'Player 1 turn'
      this.dice = defaultDice()
      this.scores = [{}, {}, {}, {}, {}, {}]
    },
    confirmReset: function () {
      if (confirm('Are you sure you want to reset the game?')) {
        this.reset()
      }
    },
    settings: function () {
      this.showSettings = !this.showSettings
    },
    winner: function () {
      var ended = true
      for (var i = 0; i < this.combinations.length; i++) {
        for (var playerID = 0; playerID < this.playersCount; playerID++) {
          if (this.scores[playerID][this.combinations[i].id] === undefined) {
            ended = false
          }
        }
      }
      if (ended) {
        var sums = this.scores.map((a) => this.finalSum(a))
        var maxScore = 0
        var maxPlayer = 0
        for (i = 0; i < this.playersCount; i++) {
          if (sums[i] > maxScore) {
            maxScore = sums[i]
            maxPlayer = i
          }
        }
        alert(`Player ${maxPlayer + 1} won with a score of ${maxScore}!`)
        this.reset()
      }
    }
  }
}
</script>
