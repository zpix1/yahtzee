<template>
  <div class="main">
    <div class="pyro" v-if="pyroEnabled">
  <div class="before"></div>
  <div class="after"></div>
</div>
    <h1 class="header">yahtzee <a @click="toggleModal('about')">info</a></h1>
  <!-- <v-dialog/> -->
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
              <th>co</th>
              <th v-for="playerID in playersCount">
                {{ playerName(playerID) }}
              </th>

              <th>co</th>
              <th v-for="playerID in playersCount">
                {{ playerName(playerID) }}
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
                    v-on:click="setScoreUser(playerID, comb.id)">
                    {{ calcCell(playerID, comb) }}
                    {{ scores[playerID][comb.id] }} 
                </td>
              </template>
            </tr>

            <tr>
              <td>bonus</td>
              <td class="bonuscell" v-for="(_, playerID) in (playersCount)" v-bind:class="{ setscore: partSum(scores[playerID]) >= bonusRequire }">{{ partSum(scores[playerID]) }}/{{ bonusRequire }}</td>
              <td>{{ combinations[12].name }}</td>
              <td v-for="(_, playerID) in playersCount" 
                  v-bind:key="playerID+'_'+combinations[12].id" 
                  v-bind:class="{ 
                    setscore: scores[playerID][combinations[12].id] !== undefined, 
                    scorecell: (rolled && playerTurn === playerID && scores[playerID][combinations[12].id] === undefined ? true : false) 
                  }" 
                  v-on:click="setScoreUser(playerID, combinations[12].id)">
                  {{ calcCell(playerID, combinations[12]) }}
                  {{ scores[playerID][combinations[12].id] }} 
              </td>
            </tr>

            <tr>
              <td></td>
              <td v-for="playerID in playersCount">
                {{  partSum(scores[playerID]) >= bonusRequire ? bonusSize: 0 }}
              </td>
              <td>total</td>
              <td v-for="playerID in playersCount">
                {{ finalSum(scores[playerID-1]) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="dice block">
        dice
        <Dice :dice="dice" :willRoll="willRoll" :disabled="isAITurn || isNotYourTurn" :onclick="emitUpdate"/>
      </div>
      
      <div class="buttons block">
        <div class="settings-icon"
          @click="showSettings = !showSettings"
          v-bind:class="{ on: showSettings }"
        ></div>
        <button @mousedown="adsRoll" type="button" id="roll-dice" class="button" v-bind:class="{ unclickable: (rollsLeft === 0 || isNotYourTurn) || isAITurn, red: (rollsLeft === 0), blue: (rollsLeft > 0) }">
          {{ !isNotYourTurn ? rollButtonMessage : rollButtonMessage + ' (not your turn)'}}
        </button>
      </div>
      <div v-bind:class="{'hidden': !showSettings}" class="settings block">
        <div>
          reset game <button class="danger" @click="confirmReset">RESET</button>
        </div>
        <div>
          adjustments <button v-bind:class="{success: adjustments, info: !adjustments}" @click="askForReset() ? adjustments = !adjustments : null">{{ adjustments ? 'ON' : 'OFF' }}</button>
        </div>
        <div>
          players count <button class="info" @click="incPlayersCount">{{ isVsAI ? 'AI' : playersCount }}</button>
        </div>
        <div>
          AIvsAI <button class="info" @click="startAIvsAI">fight</button>
        </div>
        <div>
          online-mode 
          <span v-if="!onlineMode">
            <button class="info" @click="onlineModeHost()">host</button> <button class="info" style="margin-right: 10px" @click="onlineModeJoin()">join</button>
          </span>
          <span v-else>
            <button class="info" @click="exitFromOnlineMode()">exit from {{ onlineMode }}</button> <button class="info" style="margin-right: 10px" @click="onlineModeJoin()">join</button>
          </span>
        </div>
        <div>
          about <button class="info" @click="toggleModal('about')">about</button>
        </div>
      </div>
    </div><v-dialog/>
  </div>
</template>

<script>
import { defaultDice, defaultScores, combinations } from '../constants'
import { getRandomInt, combRep, sleep,  AboutPage, RulesPage, ScoringPage } from '../utility'
import Dice from './Dice'

import io from 'socket.io-client'
const SOCKET_IO_ADDR = 'http://yahtzee-online-mode-server.herokuapp.com:80'
var socket = null;

String.prototype.count = function(s1) { 
    return (this.length - this.replace(new RegExp(s1,"g"), '').length) / s1.length;
}

export default {
  name: 'game',
  components: {
    Dice
  },
  data () {
    return {
      aispeed: localStorage.getItem('aispeed') || 500,
      willRoll: false,
      bonusRequire: 63,
      bonusSize: 35,
      playerTurn: 0,
      playersCount: 2,
      maxPlayersCount: 4,
      rollsLeft: 3,
      rolled: false,
      rollButtonMessage: 'P1 turn',
      dice: defaultDice(),
      combinations: combinations,
      scores: defaultScores(),
      adjustments: false,
      showSettings: false,
      resetted: true,
      isVsAI: false,
      isAITurn: false,
      infoModal: false,
      AIvsAI: false,
      pyroEnabled: false,
      history: [],
      onlineMode: null,
      onlineModePlayerTurn: null,
      io: null
    }
  },
  mounted: function () {
    // this.onlineMode = null;
  },
  computed: {
    isNotYourTurn: function() {
      if (this.onlineMode)
      return this.onlineModePlayerTurn != this.playerTurn;
      return false;
    }
  },
  persist: ['history', 'AIvsAI', 'scores', 'playerTurn', 'rollsLeft', 'rolled', 'dice', 'rollButtonMessage', 'adjustments', 'playersCount', 'resetted', 'isVsAI', 'isAITurn'],
  methods: {
    enablePyro: function () {
      this.pyroEnabled = true;
      setTimeout(x => this.pyroEnabled = false, 3000);
    },
    toggleModal: function(x) {
      let textHTML = x == 'about' ? AboutPage() : x == 'rules' ? RulesPage() : x == 'scores' ? ScoringPage() : ''
      textHTML = `<div>${textHTML}<br>you played ${this.history.length} games<br>you won ${this.history.filter(x => x.winner === 'P1').length} times<br>last five games:<br>`
      const maxEntries = 5;
      let sliced = this.history.slice(Math.max(this.history.length - maxEntries, 0))
      for (let i = sliced.length - 1; i >= 0; i--) {
        let current_datetime = new Date(sliced[i].date);
        let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds() 
        textHTML += `d:${formatted_date} winner: ${sliced[i].winner}, scores: ${(sliced[i].scores || [sliced[i].winscore]).join(', ')}<br>`
      }
      textHTML += '</div>'
      this.$modal.show('dialog',{
        text: textHTML,
        title: x
      })
    },
    playerName: function(playerID) {
      if (this.AIvsAI) {
        return `AI${playerID}`
      } else if (this.isVsAI && playerID === 2) {
        return 'AI'
      } else {
        return `P${playerID}`
      }
    },
    calcCell: function (player, comb) {
      return this.rolled && this.playerTurn === player && this.scores[player][comb.id] === undefined ? comb.calc(this.dice) : undefined
    },
    adsRoll: function (event) {
      if (this.isAITurn)
        return
      if (this.isNotYourTurn)
        return
      this.resetted = false
      var gx = event.clientX - event.target.getClientRects()[0].x
      if (gx < 8 && this.adjustments) {
        this.roll(true)
      } else {
        this.roll(false)
      }
    },
    roll: function (activate) {
      this.resetted = false
      if (this.rollsLeft === 0) {
        return
      }

      this.rolled = true
      this.willRoll = true

      setTimeout(() => { this.willRoll = false }, 500)

      if (activate) {
        var combs = this.combinations.filter((c) => this.scores[this.playerTurn][c.id] === undefined) // No chance pls
        var newDices = Array(this.dice.length)
        var allDices = []

        for (var i = 0; i < this.dice.length; i++) {
          newDices[i] = Object.assign({}, this.dice[i])
        }

        for (var j = 0; j < 100; j++) {
          var tempDices = newDices.map(e => Object.assign({}, e)).slice()
          for (i = 0; i < tempDices.length; i++) {
            if (!tempDices[i].used) {
              tempDices[i].type = getRandomInt(1, 6)
            }
          }
          allDices.push(tempDices)
        }

        var ans = {dice: null, val: -1, comb: null}
        for (j = 0; j < combs.length; j++) {
          var comb = combs[j]
          for (i = 0; i < allDices.length; i++) {
            if (comb.calc(allDices[i]) >= ans.val) {
              ans.dice = allDices[i]
              ans.val = comb.calc(allDices[i])
              ans.comb = comb
            }
          }
        }

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
      if (this.getCombById(12).calc(this.dice) > 0) {
        this.enablePyro();
      }
      const throwsLeft = --this.rollsLeft
      this.rollButtonMessage = (throwsLeft === 1 ? '1 roll left' : `${throwsLeft} rolls left`) + ` ${this.isAITurn ? "(AI)" : ""}`

      if (this.rollsLeft === 0) {
        this.rollButtonMessage = 'no rolls left' + ` ${this.isAITurn ? "(AI)" : ""}`
      }

      
      if (this.onlineMode) {
        this.emitUpdate()
      }
    },
    AITurn: async function () {
      const combRelativeCalc = (comb, dice) => {
        return comb.calc(dice) / comb.maxValue
      }
      const maxCombScore = (dice) => {
        let maxS = 0
        let maxC = null
        for (let i = 0; i < this.combinations.length; i++) {
          let comb = this.combinations[i]
          if (combRelativeCalc(comb, dice) >= maxS && this.scores[player][comb.id] === undefined) {
            maxS = combRelativeCalc(comb, dice)
            maxC = comb
          }
        }
        return maxS
      }
      const player = this.playerTurn;
      const bestCombinations = [12, 11, 10, 9];
      for (let rollID = 0; rollID < 3; rollID++) {
        this.roll(this.adjustments);
        await sleep(this.aispeed);
        // Check for the evidently best combinations
        for (let i = 0; i < bestCombinations.length; i++) {
          let comb = this.getCombById(bestCombinations[i])
          if (combRelativeCalc(comb, this.dice) != 0 && this.scores[player][comb.id] === undefined) {
            console.log("AI found the best comb: ", comb.name)
            
            await sleep(this.aispeed)
            this.setScore(player, comb.id)
            this.isAITurn = false
            return
          }
        }
        // Bruteforce the best approach
        var actions = [[], [1], [2], [3], [4], [5], [1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5], [1, 2, 3], [1, 2, 4], [1, 2, 5], [1, 3, 4], [1, 3, 5], [1, 4, 5], [2, 3, 4], [2, 3, 5], [2, 4, 5], [3, 4, 5], [1, 2, 3, 4], [1, 2, 3, 5], [1, 2, 4, 5], [1, 3, 4, 5], [2, 3, 4, 5], [1, 2, 3, 4, 5]]
        let maxAverage = 0;
        let maxAction = null;
        for (let i = 0; i < actions.length; i++) {
          let allSum = 0;
          let allNumber = 0;
          let outcomes = combRep([1,2,3,4,5], 5 - actions[i].length)
          for (let ouI = 0; ouI < outcomes.length; ouI++) {
            let newDice = JSON.parse(JSON.stringify(this.dice))
            let usedOut = 0;
            for (let di = 0; di < 5; di++) {
              if (!actions[i].includes(di+1)) {
                newDice[di].type = outcomes[ouI][usedOut];
                usedOut++;
              }
            }
            allNumber++;
            allSum += maxCombScore(newDice)
          }
          
          let cAverage = allSum / allNumber
          if (cAverage >= maxAverage) {
            maxAverage = cAverage
            maxAction = actions[i]
          }
        }
        if (maxAction.length == 5) {
          break
        }
        if (rollID != 2) {
          for (let i = 0; i < 5; i++) {
            if (!maxAction.includes(i + 1))
              this.dice[i].used = false
          }
          for (let i = 0; i < maxAction.length; i++) {
            await sleep(this.aispeed / 2);
            if (!this.dice[maxAction[i]-1].used)
              this.dice[maxAction[i]-1].used = true
          }
        }
        await sleep(this.aispeed);
      }

      let maxS = 0
      let maxC = null
      for (let i = 0; i < this.combinations.length; i++) {
        let comb = this.combinations[i]
        if (combRelativeCalc(comb, this.dice) >= maxS && this.scores[player][comb.id] === undefined) {
          maxS = combRelativeCalc(comb, this.dice)
          maxC = comb
        }
      }
      this.setScore(player, maxC.id)

      this.isAITurn = false;
    },
    setScoreUser: async function (player, combId) {
      if (!this.isAITurn) {
        this.setScore(player, combId)
      }
    },
    setScore: async function (player, combId) {
      if ((this.rolled) && (player === this.playerTurn) && (!this.scores[player].hasOwnProperty(combId)) && (!this.isNotYourTurn)) {
        var comb = this.combinations.find(e => e.id === combId)

        var ans = comb.calc(this.dice)
        this.$set(this.scores[player], combId, ans)

        this.rolled = false
        this.playerTurn = (this.playerTurn + 1) % this.playersCount

        this.rollButtonMessage = this.playerName(this.playerTurn + 1) + ' turn'
        this.dice = defaultDice()
        this.rollsLeft = 3

        this.emitUpdate()
        this.winner()

        if ((this.isVsAI && this.playerTurn == 1) || (this.AIvsAI)) {
          this.isAITurn = true
          this.AITurn()
        }
        this.emitUpdate()
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
      this.AIvsAI = false
      this.willRoll = false
      this.playerTurn = 0
      this.rollsLeft = 3
      this.resetted = true
      this.isAITurn = false
      this.adjustments = false
      this.rolled = false
      this.rollButtonMessage = 'P1 turn'
      this.dice = defaultDice()
      this.scores = defaultScores()

      this.emitUpdate()
    },
    confirmReset: function () {
      if (confirm('Are you sure you want to reset the game?')) {
        this.reset()
      }
    },
    askForReset: function () {
      if (!this.resetted) {
        if (confirm('You have to reset score before change. Reset & continue?')) {
          this.reset()
        } else {
          return false
        }
      }
      return true
    },
    startAIvsAI(){
      if (this.askForReset()) {
        this.playersCount = 2;
        this.AIvsAI = true;
        this.isVsAI = true;
        this.AITurn();
      }
    },
    incPlayersCount () {
      if (this.askForReset()) {
        if (this.playersCount == this.maxPlayersCount) {
          this.playersCount = 2
          this.isVsAI = true
        } else if (this.playersCount === 2 && this.isVsAI) {
          this.playersCount = 2
          this.isVsAI = false
        } else {
          this.playersCount += 1
          this.isVsAI = false
        }
      }
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
        this.history.push({date: new Date(), winner: this.playerName(maxPlayer + 1), scores: sums.slice(0, this.playersCount)})
        alert(`${this.playerName(maxPlayer + 1)} won with a score of ${maxScore}!`)
        this.reset()
      }
    },
    getCombById: function(id) {
      for (let i = 0; i < this.combinations.length; i++) {
        if (this.combinations[i].id == id) {
          return this.combinations[i]
        }
      }
    },
    emitUpdate: function() {
      if (this.onlineMode) {
        socket.emit('message', {action: 'done', state: { scores: this.scores, dice: this.dice, rollsLeft: this.rollsLeft, scores: this.scores, rollButtonMessage: this.rollButtonMessage, playerTurn: this.playerTurn, rolled: this.rolled} })
      }
    },
    initSocketIo: function() {

      if (socket == null) {
        socket = io(SOCKET_IO_ADDR)
      }
      socket.on('error', (err) => {
        console.log(err)
        socket = null
        this.exitFromOnlineMode()
      })

      socket.on('message', (message) => {
        // console.log(message)
        if (message.action === 'conn_ok') {
          this.onlineMode = message.sessionCode
        } else if (message.action === 'update') {
          this.scores = message.state.scores
          this.rollsLeft = message.state.rollsLeft
          this.playerTurn = message.state.playerTurn
          this.dice = message.state.dice
          this.rollButtonMessage = message.state.rollButtonMessage
          this.playerTurn = message.state.playerTurn
          this.rolled = message.state.rolled
          this.winner()
        } else if (message.action === 'error' || message.action === 'alert') {
          alert(message.message)
        } else if (message.action === 'start') {
          this.reset()
          this.onlineModePlayerTurn = message.playerID
        }
      })
    },
    onlineModeHost: function() {
      if (!this.askForReset()) {
        return
      }

      this.exitFromOnlineMode()

      this.playerTurn = 2
      this.isVsAI = false

      this.initSocketIo()
      socket.emit('message', {action: 'host'})
    },
    onlineModeJoin: function() {
      if (!this.askForReset()) {
        return
      }

      this.exitFromOnlineMode()

      this.playerTurn = 2;
      this.isVsAI = false;

      let sessionCode = prompt('enter session code (XXXX)') || ''
      if (!sessionCode.match(/^\d{4}$/)) {
        return
      }

      this.initSocketIo()
      socket.emit('message', {action: 'join', sessionCode: sessionCode})
    },
    exitFromOnlineMode: function() {
      this.onlineMode = false
      this.onlineModePlayerTurn = null
      if (socket != null) {
        socket.disconnect()
      }
      socket = null
    }
  }
}
</script>
