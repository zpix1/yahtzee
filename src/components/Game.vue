<template>
  <div class="main">
    <div class="wrapper">
      <div class="scores block">
        <table class="scores-table">
          <thead>
            <tr>
              <th>Co</th>
              <th>1</th>
              <th>2</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="comb in combinations">
              <td>{{ comb.name }}</td>
              <td class="" v-bind:class="{ setscore: scores[0][comb.id] }" v-on:click="setScore(0, comb.id)">{{ scores[0][comb.id] }} {{ rolled && playerTurn == 0 && !scores[0][comb.id] ? comb.calc(dice) : ''}}</td>
              <td class="" v-bind:class="{ setscore: scores[1][comb.id] }" v-on:click="setScore(1, comb.id)">{{ scores[1][comb.id] }} {{ rolled && playerTurn == 1 && !scores[1][comb.id] ? comb.calc(dice) : ''}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="dice block">
        Dices
        <div class="dice-panel">
          <div class="dice-element" v-for="d in dice" v-bind:class="{ used: d.used }"
 v-on:click="d.type != 0 ? d.used = !d.used : ''" >{{ d.type }}</div>
        </div>
        <a href="#" v-on:click="roll" type="button" id="roll-dice" class="button" v-bind:class="{ unclickable: rollsLeft === 0, red: rollsLeft === 0, blue: rollsLeft > 0 }" > {{rollButtonMessage}}</a>
      </div>
      <!-- <div class="two">Two</div>
      <div class="three">Three</div>
      <div class="four">Four</div>
      <div class="five">Five</div>
      <div class="six">Six</div> -->
    </div>
  </div>
</template>

<style src="../assets/style.css"></style>

<script>
import {defaultDice, combinations} from '../Constants'

function getRandomInt (min, max) {
  var byteArray = new Uint8Array(1)
  window.crypto.getRandomValues(byteArray)

  var range = max - min + 1
  var maxRange = 256
  if (byteArray[0] >= Math.floor(maxRange / range) * range) {
    return getRandomInt(min, max)
  }
  return min + (byteArray[0] % range)
}

export default {
  name: 'game',
  data () {
    return {
      playerTurn: 0,
      rollsLeft: 3,
      rolled: false,
      rollButtonMessage: 'Ход игрока 1',
      dice: defaultDice(),
      combinations: combinations,
      scores: [{}, {}]
    }
  },
  methods: {
    roll: function (event) {
      if (this.rollsLeft === 0) {
        return false
      }

      this.rolled = true

      for (var i = 0; i < this.dice.length; i++) {
        var d = this.dice[i]
        if (!d.used) {
          d.type = getRandomInt(1, 5)
        }
      }
      this.rollButtonMessage = 'Осталось ' + --this.rollsLeft

      if (this.rollsLeft === 0) {
        this.rollButtonMessage = 'Ход завершен'
      }
      return true
    },
    setScore: function (player, combId) {
      if ((this.rolled) && (player === this.playerTurn) && (!this.scores[player].hasOwnProperty(combId))) {
        var comb = this.combinations.find(e => e.id === combId)

        var ans = comb.calc(this.dice)
        this.$set(this.scores[player], combId, ans)

        this.rolled = false
        this.playerTurn = (this.playerTurn + 1) % 2
        this.rollButtonMessage = 'Ход игрока ' + (this.playerTurn + 1)
        this.dice = defaultDice()
        this.rollsLeft = 3
      }
    }
  }
}
</script>
