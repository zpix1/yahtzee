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
              <td v-on:click="setScore(0, comb.id)">{{ scores[0][comb.id] }}</td>
              <td v-on:click="setScore(1, comb.id)">{{ scores[1][comb.id] }}</td>
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
        <input v-on:click="roll" type="button" id="roll-dice" v-bind:value="rollButtonMessage"></input>
      </div>
      <!-- <div class="two">Two</div>
      <div class="three">Three</div>
      <div class="four">Four</div>
      <div class="five">Five</div>
      <div class="six">Six</div> -->
    </div>
  </div>
</template>

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
      rollButtonMessage: 'Кинуть!',
      dice: defaultDice,
      combinations: combinations,
      scores: [{}, {}]
    }
  },
  methods: {
    roll: function (event) {
      if (this.rollsLeft === 1) {
        this.rollButtonMessage = 'Ход завершен'
        this.rolled = false
      } else {
        this.rolled = true

        for (var i = 0; i < this.dice.length; i++) {
          var d = this.dice[i]
          if (!d.used) {
            d.type = getRandomInt(1, 5)
          }
        }
        this.rollButtonMessage = 'Осталось ' + --this.rollsLeft
      }
    },
    setScore: function (player, combId) {
      if (player === this.playerTurn) {
        if (!this.scores[player].hasOwnProperty(combId)) {
          this.$set(this.scores[player], combId, 1)
        }
      }
    }
  }
}
</script>

<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}

.block {
  background-color: #35495E;
  color: white;
  height: 100%;
  width: 100%;
}

.wrapper {
  display: grid;
  grid-template-areas:
    'scores scores'
    'scores scores'
    'scores scores'
    'dice dice';
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
}

.dice-panel {
  width: 100%;
  display: flex;
}

.dice-element {
  margin: 5px;
  text-align: center;
  width: 20%;
  position: relative; 
  border: 1px black solid;
  border-radius: 4px;
}

.dice-element.used {
  border: 1px green solid;
}

.dice-element:before {  /* to make 1:1 aspect ratio; */
    content:'';
    padding-top:100%;
    float:left;
}

.scores {
  grid-area: scores;
}

.dice {
  grid-area: dice;
}

.scores-table {
  border-collapse: collapse;
  width: 100%;
  height: 100%;

}

.scores-table table, th, td {
  border: 1px solid black;
}



</style>
