webpackJsonp([1],{

/***/ 13:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Game__ = __webpack_require__(35);
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'app',
  components: {
    Game: __WEBPACK_IMPORTED_MODULE_0__components_Game__["a" /* default */]
  }
});

/***/ }),

/***/ 14:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utility__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Dice__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_socket_io_client__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_socket_io_client___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_socket_io_client__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






const SOCKET_IO_ADDR = 'https://yahtzee-online-mode-server.herokuapp.com:80';
var socket = null;

String.prototype.count = function (s1) {
  return (this.length - this.replace(new RegExp(s1, "g"), '').length) / s1.length;
};

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'game',
  components: {
    Dice: __WEBPACK_IMPORTED_MODULE_2__Dice__["a" /* default */]
  },
  data() {
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
      dice: Object(__WEBPACK_IMPORTED_MODULE_0__constants__["b" /* defaultDice */])(),
      combinations: __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* combinations */],
      scores: Object(__WEBPACK_IMPORTED_MODULE_0__constants__["c" /* defaultScores */])(),
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
    };
  },
  mounted: function () {
    // this.onlineMode = null;
  },
  computed: {
    isNotYourTurn: function () {
      if (this.onlineMode) return this.onlineModePlayerTurn != this.playerTurn;
      return false;
    }
  },
  persist: ['history', 'AIvsAI', 'scores', 'playerTurn', 'rollsLeft', 'rolled', 'dice', 'rollButtonMessage', 'adjustments', 'playersCount', 'resetted', 'isVsAI', 'isAITurn'],
  methods: {
    enablePyro: function () {
      this.pyroEnabled = true;
      setTimeout(x => this.pyroEnabled = false, 3000);
    },
    toggleModal: function (x) {
      let textHTML = x == 'about' ? Object(__WEBPACK_IMPORTED_MODULE_1__utility__["a" /* AboutPage */])() : x == 'rules' ? Object(__WEBPACK_IMPORTED_MODULE_1__utility__["b" /* RulesPage */])() : x == 'scores' ? Object(__WEBPACK_IMPORTED_MODULE_1__utility__["c" /* ScoringPage */])() : '';
      textHTML = `<div>${textHTML}<br>you played ${this.history.length} games<br>you won ${this.history.filter(x => x.winner === 'P1').length} times<br>last five games:<br>`;
      const maxEntries = 5;
      let sliced = this.history.slice(Math.max(this.history.length - maxEntries, 0));
      for (let i = sliced.length - 1; i >= 0; i--) {
        let current_datetime = new Date(sliced[i].date);
        let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
        textHTML += `d:${formatted_date} winner: ${sliced[i].winner}, scores: ${(sliced[i].scores || [sliced[i].winscore]).join(', ')}<br>`;
      }
      textHTML += '</div>';
      this.$modal.show('dialog', {
        text: textHTML,
        title: x
      });
    },
    playerName: function (playerID) {
      if (this.AIvsAI) {
        return `AI${playerID}`;
      } else if (this.isVsAI && playerID === 2) {
        return 'AI';
      } else {
        return `P${playerID}`;
      }
    },
    calcCell: function (player, comb) {
      return this.rolled && this.playerTurn === player && this.scores[player][comb.id] === undefined ? comb.calc(this.dice) : undefined;
    },
    adsRoll: function (event) {
      if (this.isAITurn) return;
      if (this.isNotYourTurn) return;
      this.resetted = false;
      var gx = event.clientX - event.target.getClientRects()[0].x;
      if (gx < 8 && this.adjustments) {
        this.roll(true);
      } else {
        this.roll(false);
      }
    },
    roll: function (activate) {
      this.resetted = false;
      if (this.rollsLeft === 0) {
        return;
      }

      this.rolled = true;
      this.willRoll = true;

      setTimeout(() => {
        this.willRoll = false;
      }, 500);

      if (activate) {
        var combs = this.combinations.filter(c => this.scores[this.playerTurn][c.id] === undefined); // No chance pls
        var newDices = Array(this.dice.length);
        var allDices = [];

        for (var i = 0; i < this.dice.length; i++) {
          newDices[i] = Object.assign({}, this.dice[i]);
        }

        for (var j = 0; j < 100; j++) {
          var tempDices = newDices.map(e => Object.assign({}, e)).slice();
          for (i = 0; i < tempDices.length; i++) {
            if (!tempDices[i].used) {
              tempDices[i].type = Object(__WEBPACK_IMPORTED_MODULE_1__utility__["e" /* getRandomInt */])(1, 6);
            }
          }
          allDices.push(tempDices);
        }

        var ans = { dice: null, val: -1, comb: null };
        for (j = 0; j < combs.length; j++) {
          var comb = combs[j];
          for (i = 0; i < allDices.length; i++) {
            if (comb.calc(allDices[i]) >= ans.val) {
              ans.dice = allDices[i];
              ans.val = comb.calc(allDices[i]);
              ans.comb = comb;
            }
          }
        }

        for (i = 0; i < this.dice.length; i++) {
          var d = this.dice[i];
          if (!d.used) {
            d.type = ans.dice[i].type;
          }
        }
      } else {
        for (i = 0; i < this.dice.length; i++) {
          d = this.dice[i];
          if (!d.used) {
            d.type = Object(__WEBPACK_IMPORTED_MODULE_1__utility__["e" /* getRandomInt */])(1, 6);
          }
        }
      }
      if (this.getCombById(12).calc(this.dice) > 0) {
        this.enablePyro();
      }
      const throwsLeft = --this.rollsLeft;
      this.rollButtonMessage = (throwsLeft === 1 ? '1 roll left' : `${throwsLeft} rolls left`) + ` ${this.isAITurn ? "(AI)" : ""}`;

      if (this.rollsLeft === 0) {
        this.rollButtonMessage = 'no rolls left' + ` ${this.isAITurn ? "(AI)" : ""}`;
      }

      if (this.onlineMode) {
        this.emitUpdate();
      }
    },
    AITurn: async function () {
      const combRelativeCalc = (comb, dice) => {
        return comb.calc(dice) / comb.maxValue;
      };
      const maxCombScore = dice => {
        let maxS = 0;
        let maxC = null;
        for (let i = 0; i < this.combinations.length; i++) {
          let comb = this.combinations[i];
          if (combRelativeCalc(comb, dice) >= maxS && this.scores[player][comb.id] === undefined) {
            maxS = combRelativeCalc(comb, dice);
            maxC = comb;
          }
        }
        return maxS;
      };
      const player = this.playerTurn;
      const bestCombinations = [12, 11, 10, 9];
      for (let rollID = 0; rollID < 3; rollID++) {
        this.roll(this.adjustments);
        await Object(__WEBPACK_IMPORTED_MODULE_1__utility__["f" /* sleep */])(this.aispeed);
        // Check for the evidently best combinations
        for (let i = 0; i < bestCombinations.length; i++) {
          let comb = this.getCombById(bestCombinations[i]);
          if (combRelativeCalc(comb, this.dice) != 0 && this.scores[player][comb.id] === undefined) {
            console.log("AI found the best comb: ", comb.name);

            await Object(__WEBPACK_IMPORTED_MODULE_1__utility__["f" /* sleep */])(this.aispeed);
            this.setScore(player, comb.id);
            this.isAITurn = false;
            return;
          }
        }
        // Bruteforce the best approach
        var actions = [[], [1], [2], [3], [4], [5], [1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5], [1, 2, 3], [1, 2, 4], [1, 2, 5], [1, 3, 4], [1, 3, 5], [1, 4, 5], [2, 3, 4], [2, 3, 5], [2, 4, 5], [3, 4, 5], [1, 2, 3, 4], [1, 2, 3, 5], [1, 2, 4, 5], [1, 3, 4, 5], [2, 3, 4, 5], [1, 2, 3, 4, 5]];
        let maxAverage = 0;
        let maxAction = null;
        for (let i = 0; i < actions.length; i++) {
          let allSum = 0;
          let allNumber = 0;
          let outcomes = Object(__WEBPACK_IMPORTED_MODULE_1__utility__["d" /* combRep */])([1, 2, 3, 4, 5], 5 - actions[i].length);
          for (let ouI = 0; ouI < outcomes.length; ouI++) {
            let newDice = JSON.parse(JSON.stringify(this.dice));
            let usedOut = 0;
            for (let di = 0; di < 5; di++) {
              if (!actions[i].includes(di + 1)) {
                newDice[di].type = outcomes[ouI][usedOut];
                usedOut++;
              }
            }
            allNumber++;
            allSum += maxCombScore(newDice);
          }

          let cAverage = allSum / allNumber;
          if (cAverage >= maxAverage) {
            maxAverage = cAverage;
            maxAction = actions[i];
          }
        }
        if (maxAction.length == 5) {
          break;
        }
        if (rollID != 2) {
          for (let i = 0; i < 5; i++) {
            if (!maxAction.includes(i + 1)) this.dice[i].used = false;
          }
          for (let i = 0; i < maxAction.length; i++) {
            await Object(__WEBPACK_IMPORTED_MODULE_1__utility__["f" /* sleep */])(this.aispeed / 2);
            if (!this.dice[maxAction[i] - 1].used) this.dice[maxAction[i] - 1].used = true;
          }
        }
        await Object(__WEBPACK_IMPORTED_MODULE_1__utility__["f" /* sleep */])(this.aispeed);
      }

      let maxS = 0;
      let maxC = null;
      for (let i = 0; i < this.combinations.length; i++) {
        let comb = this.combinations[i];
        if (combRelativeCalc(comb, this.dice) >= maxS && this.scores[player][comb.id] === undefined) {
          maxS = combRelativeCalc(comb, this.dice);
          maxC = comb;
        }
      }
      this.setScore(player, maxC.id);

      this.isAITurn = false;
    },
    setScoreUser: async function (player, combId) {
      if (!this.isAITurn) {
        this.setScore(player, combId);
      }
    },
    setScore: async function (player, combId) {
      if (this.rolled && player === this.playerTurn && !this.scores[player].hasOwnProperty(combId) && !this.isNotYourTurn) {
        var comb = this.combinations.find(e => e.id === combId);

        var ans = comb.calc(this.dice);
        this.$set(this.scores[player], combId, ans);

        this.rolled = false;
        this.playerTurn = (this.playerTurn + 1) % this.playersCount;

        this.rollButtonMessage = this.playerName(this.playerTurn + 1) + ' turn';
        this.dice = Object(__WEBPACK_IMPORTED_MODULE_0__constants__["b" /* defaultDice */])();
        this.rollsLeft = 3;

        this.emitUpdate();
        this.winner();

        if (this.isVsAI && this.playerTurn == 1 || this.AIvsAI) {
          this.isAITurn = true;
          this.AITurn();
        }
        this.emitUpdate();
      }
    },
    partSum: function (obj) {
      var ans = 0;
      for (var i = 0; i < this.combinations.length; i++) {
        if (this.combinations[i].group === 0) {
          ans += obj[this.combinations[i].id] || 0;
        }
      }
      return ans;
    },
    finalSum: function (obj) {
      var ans = 0;
      var partSum = this.partSum(obj);
      if (partSum >= this.bonusRequire) {
        ans += this.bonusSize;
      }
      for (var i = 0; i < this.combinations.length; i++) {
        ans += obj[this.combinations[i].id] || 0;
      }
      return ans;
    },
    reset: function () {
      this.AIvsAI = false;
      this.willRoll = false;
      this.playerTurn = 0;
      this.rollsLeft = 3;
      this.resetted = true;
      this.isAITurn = false;
      this.adjustments = false;
      this.rolled = false;
      this.rollButtonMessage = 'P1 turn';
      this.dice = Object(__WEBPACK_IMPORTED_MODULE_0__constants__["b" /* defaultDice */])();
      this.scores = Object(__WEBPACK_IMPORTED_MODULE_0__constants__["c" /* defaultScores */])();

      this.emitUpdate();
    },
    confirmReset: function () {
      if (confirm('Are you sure you want to reset the game?')) {
        this.reset();
      }
    },
    askForReset: function () {
      if (!this.resetted) {
        if (confirm('You have to reset score before change. Reset & continue?')) {
          this.reset();
        } else {
          return false;
        }
      }
      return true;
    },
    startAIvsAI() {
      if (this.askForReset()) {
        this.playersCount = 2;
        this.AIvsAI = true;
        this.isVsAI = true;
        this.AITurn();
      }
    },
    incPlayersCount() {
      if (this.askForReset()) {
        if (this.playersCount == this.maxPlayersCount) {
          this.playersCount = 2;
          this.isVsAI = true;
        } else if (this.playersCount === 2 && this.isVsAI) {
          this.playersCount = 2;
          this.isVsAI = false;
        } else {
          this.playersCount += 1;
          this.isVsAI = false;
        }
      }
    },
    winner: function () {
      var ended = true;
      for (var i = 0; i < this.combinations.length; i++) {
        for (var playerID = 0; playerID < this.playersCount; playerID++) {
          if (this.scores[playerID][this.combinations[i].id] === undefined) {
            ended = false;
          }
        }
      }
      if (ended) {
        var sums = this.scores.map(a => this.finalSum(a));
        var maxScore = 0;
        var maxPlayer = 0;
        for (i = 0; i < this.playersCount; i++) {
          if (sums[i] > maxScore) {
            maxScore = sums[i];
            maxPlayer = i;
          }
        }
        this.history.push({ date: new Date(), winner: this.playerName(maxPlayer + 1), scores: sums.slice(0, this.playersCount) });
        alert(`${this.playerName(maxPlayer + 1)} won with a score of ${maxScore}!`);
        this.reset();
      }
    },
    getCombById: function (id) {
      for (let i = 0; i < this.combinations.length; i++) {
        if (this.combinations[i].id == id) {
          return this.combinations[i];
        }
      }
    },
    emitUpdate: function () {
      if (this.onlineMode) {
        socket.emit('message', { action: 'done', state: { scores: this.scores, dice: this.dice, rollsLeft: this.rollsLeft, scores: this.scores, rollButtonMessage: this.rollButtonMessage, playerTurn: this.playerTurn, rolled: this.rolled } });
      }
    },
    initSocketIo: function () {

      if (socket == null) {
        socket = __WEBPACK_IMPORTED_MODULE_3_socket_io_client___default()(SOCKET_IO_ADDR);
      }
      socket.on('error', err => {
        console.log(err);
        socket = null;
        this.exitFromOnlineMode();
      });

      socket.on('message', message => {
        // console.log(message)
        if (message.action === 'conn_ok') {
          this.onlineMode = message.sessionCode;
        } else if (message.action === 'update') {
          this.scores = message.state.scores;
          this.rollsLeft = message.state.rollsLeft;
          this.playerTurn = message.state.playerTurn;
          this.dice = message.state.dice;
          this.rollButtonMessage = message.state.rollButtonMessage;
          this.playerTurn = message.state.playerTurn;
          this.rolled = message.state.rolled;
          this.winner();
        } else if (message.action === 'error' || message.action === 'alert') {
          alert(message.message);
        } else if (message.action === 'start') {
          this.reset();
          this.onlineModePlayerTurn = message.playerID;
        }
      });
    },
    onlineModeHost: function () {
      if (!this.askForReset()) {
        return;
      }

      this.exitFromOnlineMode();

      this.playerTurn = 2;
      this.isVsAI = false;

      this.initSocketIo();
      socket.emit('message', { action: 'host' });
    },
    onlineModeJoin: function () {
      if (!this.askForReset()) {
        return;
      }

      this.exitFromOnlineMode();

      this.playerTurn = 2;
      this.isVsAI = false;

      let sessionCode = prompt('enter session code (XXXX)') || '';
      if (!sessionCode.match(/^\d{4}$/)) {
        return;
      }

      this.initSocketIo();
      socket.emit('message', { action: 'join', sessionCode: sessionCode });
    },
    exitFromOnlineMode: function () {
      this.onlineMode = false;
      this.onlineModePlayerTurn = null;
      if (socket != null) {
        socket.disconnect();
      }
      socket = null;
    }
  }
});

/***/ }),

/***/ 15:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'dice',
  props: ['dice', 'willRoll', 'disabled', 'onclick']
});

/***/ }),

/***/ 28:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__assets_style_scss__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__assets_style_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__assets_style_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__App__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_js_modal__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_js_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_vue_js_modal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vue_persist__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vue_persist___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_vue_persist__);
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.







__WEBPACK_IMPORTED_MODULE_1_vue__["a" /* default */].use(__WEBPACK_IMPORTED_MODULE_3_vue_js_modal___default.a, { dialog: true });

var longpress = __webpack_require__(73);

__WEBPACK_IMPORTED_MODULE_1_vue__["a" /* default */].use(longpress, { duration: 1000 });
__WEBPACK_IMPORTED_MODULE_1_vue__["a" /* default */].use(__WEBPACK_IMPORTED_MODULE_4_vue_persist___default.a);

__WEBPACK_IMPORTED_MODULE_1_vue__["a" /* default */].config.productionTip = false;

/* eslint-disable no-new */
new __WEBPACK_IMPORTED_MODULE_1_vue__["a" /* default */]({
  el: '#app',
  template: '<App/>',
  components: { App: __WEBPACK_IMPORTED_MODULE_2__App__["a" /* default */] }
});

/***/ }),

/***/ 29:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 34:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__ = __webpack_require__(13);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8b26aa58_hasScoped_false_transformToRequire_video_src_poster_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__ = __webpack_require__(70);
var normalizeComponent = __webpack_require__(8)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8b26aa58_hasScoped_false_transformToRequire_video_src_poster_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 35:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Game_vue__ = __webpack_require__(14);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_9bdcfcc6_hasScoped_false_transformToRequire_video_src_poster_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Game_vue__ = __webpack_require__(69);
var normalizeComponent = __webpack_require__(8)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Game_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_9bdcfcc6_hasScoped_false_transformToRequire_video_src_poster_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Game_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 36:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = defaultDice;
/* harmony export (immutable) */ __webpack_exports__["c"] = defaultScores;
function defaultDice() {
  return [{ used: false, type: 0, id: 0 }, { used: false, type: 0, id: 1 }, { used: false, type: 0, id: 2 }, { used: false, type: 0, id: 3 }, { used: false, type: 0, id: 4 }];
}

function defaultScores() {
  return [{}, {}, {}, {}, {}, {}, {}, {}, {}];
}

function sumOfType(dice, type) {
  var ans = 0;
  for (var i = 0; i < dice.length; i++) {
    if (dice[i].type === type) {
      ans += dice[i].type;
    }
  }
  return ans;
}

function sumOfAll(dice) {
  var ans = 0;
  for (var i = 0; i < dice.length; i++) {
    ans += dice[i].type;
  }
  return ans;
}

function getMap(dice) {
  var map = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  for (var i = 0; i < dice.length; i++) {
    map[dice[i].type] += 1;
  }
  return map;
}

function arraysEqual(a, b) {
  if (a instanceof Array && b instanceof Array) {
    if (a.length !== b.length) {
      return false;
    }
    for (var i = 0; i < a.length; i++) {
      if (!arraysEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  } else {
    return a === b;
  }
}

const combinations = [{
  group: 0,
  id: 1,
  name: 'ones',
  maxValue: 3,
  calc: function (dice) {
    return sumOfType(dice, 1);
  }
}, {
  group: 0,
  id: 2,
  name: 'twos',
  maxValue: 6,
  calc: function (dice) {
    return sumOfType(dice, 2);
  }
}, {
  group: 0,
  id: 3,
  name: 'threes',
  maxValue: 9,
  calc: function (dice) {
    return sumOfType(dice, 3);
  }
}, {
  group: 0,
  id: 4,
  name: 'fours',
  maxValue: 12,
  calc: function (dice) {
    return sumOfType(dice, 4);
  }
}, {
  group: 0,
  id: 5,
  name: 'fives',
  maxValue: 15,
  calc: function (dice) {
    return sumOfType(dice, 5);
  }
}, {
  group: 0,
  id: 6,
  name: 'sixes',
  maxValue: 20,
  calc: function (dice) {
    return sumOfType(dice, 6);
  }
}, {
  group: 1,
  id: 7,
  name: 'x3',
  maxValue: 20,
  calc: function (dice) {
    let arr = Object.values(getMap(dice));
    if (Math.max(...arr) >= 3) {
      return sumOfAll(dice);
    } else {
      return 0;
    }
  }
}, {
  group: 1,
  id: 8,
  name: 'x4',
  maxValue: 20,
  calc: function (dice) {
    let arr = Object.values(getMap(dice));
    if (Math.max(...arr) >= 4) {
      return sumOfAll(dice);
    } else {
      return 0;
    }
  }
}, {
  group: 1,
  id: 9,
  name: 'full house',
  maxValue: 15,
  calc: function (dice) {
    let arr = Object.values(getMap(dice)).filter(Number);

    if (arraysEqual(arr, [2, 3]) || arraysEqual(arr, [3, 2])) {
      return 25;
    } else {
      return 0;
    }
  }
}, {
  group: 1,
  id: 10,
  name: 'small straight',
  maxValue: 25,
  calc: function (dice) {
    let possibleCombs = [{ 1: 1, 2: 1, 3: 1, 4: 1 }, { 5: 1, 2: 1, 3: 1, 4: 1 }, { 6: 1, 5: 1, 3: 1, 4: 1 }];
    let map = getMap(dice);
    var done = true;
    for (var i = 0; i < possibleCombs.length; i++) {
      for (var type in possibleCombs[i]) {
        if (map[type] < possibleCombs[i][type]) {
          done = false;
        }
      }
      if (done) {
        return 30;
      }
      done = true;
    }
    return 0;
  }
}, {
  group: 1,
  id: 11,
  name: 'long straight',
  maxValue: 30,
  calc: function (dice) {
    let possibleCombs = [{ 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 }, { 5: 1, 2: 1, 3: 1, 4: 1, 6: 1 }];
    let map = getMap(dice);
    var done = true;
    for (var i = 0; i < possibleCombs.length; i++) {
      for (var type in possibleCombs[i]) {
        if (map[type] < possibleCombs[i][type]) {
          done = false;
        }
      }
      if (done) {
        return 40;
      }
      done = true;
    }
    return 0;
  }
}, {
  group: 1,
  id: 12,
  name: 'yahtzee',
  maxValue: 30,
  calc: function (dice) {
    let arr = Object.values(getMap(dice));
    if (Math.max(...arr) >= 5) {
      return 50;
    } else {
      return 0;
    }
  }
}, {
  group: 1,
  id: 13,
  maxValue: 25,
  name: 'chance',
  calc: sumOfAll
}];
/* harmony export (immutable) */ __webpack_exports__["a"] = combinations;


/***/ }),

/***/ 37:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["e"] = getRandomInt;
/* harmony export (immutable) */ __webpack_exports__["d"] = combRep;
/* harmony export (immutable) */ __webpack_exports__["f"] = sleep;
/* harmony export (immutable) */ __webpack_exports__["b"] = RulesPage;
/* harmony export (immutable) */ __webpack_exports__["a"] = AboutPage;
/* harmony export (immutable) */ __webpack_exports__["c"] = ScoringPage;
function getRandomInt(min, max) {
  var byteArray = new Uint8Array(1);
  window.crypto.getRandomValues(byteArray);

  var range = max - min + 1;
  var maxRange = 256;
  if (byteArray[0] >= Math.floor(maxRange / range) * range) {
    return getRandomInt(min, max);
  }
  return min + byteArray[0] % range;
}

function combRep(arr, l) {
  if (l === void 0) l = arr.length; // Length of the combinations
  var data = Array(l),
      // Used to store state
  results = []; // Array of results
  (function f(pos, start) {
    // Recursive function
    if (pos === l) {
      // End reached
      results.push(data.slice()); // Add a copy of data to results
      return;
    }
    for (var i = start; i < arr.length; ++i) {
      data[pos] = arr[i]; // Update data
      f(pos + 1, i); // Call f recursively
    }
  })(0, 0); // Start at index 0
  return results; // Return results
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function RulesPage() {
  return `
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
`;
}

function AboutPage() {
  return `
made by @zpix1 2018-2020<br>

click triangle for settings, try playing vs AI and more than 1 player<br>

rules: <a href="http://www.yahtzee.org.uk/rules.html">www.yahtzee.org.uk/rules.html</a><br>

btw what adjustments actually are?
`;
}

function ScoringPage() {
  return `
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
`;
}

/***/ }),

/***/ 38:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Dice_vue__ = __webpack_require__(15);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1a3b27fa_hasScoped_false_transformToRequire_video_src_poster_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Dice_vue__ = __webpack_require__(39);
var normalizeComponent = __webpack_require__(8)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Dice_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1a3b27fa_hasScoped_false_transformToRequire_video_src_poster_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Dice_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 39:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"dice-panel"},_vm._l((_vm.dice),function(d){return _c('div',{key:d.id,staticClass:"dice-element",class:[{ used: d.used, 'spin-animation': !d.used && _vm.willRoll },'diceN'+d.type, 'diceN'],on:{"click":function($event){_vm.disabled ? null : d.type != 0 ? d.used = !d.used : ''; if(!_vm.disabled){ _vm.onclick() }}}})}))}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 66:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 69:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"main"},[(_vm.pyroEnabled)?_c('div',{staticClass:"pyro"},[_c('div',{staticClass:"before"}),_vm._v(" "),_c('div',{staticClass:"after"})]):_vm._e(),_vm._v(" "),_c('h1',{staticClass:"header"},[_vm._v("yahtzee "),_c('a',{on:{"click":function($event){_vm.toggleModal('about')}}},[_vm._v("info")])]),_vm._v(" "),_c('div',{staticClass:"wrapper card"},[_c('div',{staticClass:"scores block"},[_c('table',{staticClass:"scores-table"},[_c('colgroup',[_c('col',{staticStyle:{"width":"20%"}}),_vm._v(" "),_vm._l((_vm.playersCount),function(playerID){return _c('col',{style:({width: 30/_vm.playersCount + '%'})})}),_vm._v(" "),_c('col',{staticStyle:{"width":"20%"}}),_vm._v(" "),_vm._l((_vm.playersCount),function(playerID){return _c('col',{style:({width: 30/_vm.playersCount + '%'})})})],2),_vm._v(" "),_c('thead',[_c('tr',[_c('th',[_vm._v("co")]),_vm._v(" "),_vm._l((_vm.playersCount),function(playerID){return _c('th',[_vm._v("\n                "+_vm._s(_vm.playerName(playerID))+"\n              ")])}),_vm._v(" "),_c('th',[_vm._v("co")]),_vm._v(" "),_vm._l((_vm.playersCount),function(playerID){return _c('th',[_vm._v("\n                "+_vm._s(_vm.playerName(playerID))+"\n              ")])})],2)]),_vm._v(" "),_c('tbody',[_vm._l((_vm.combinations.slice(0, 12).map(function (e, i, a) { return i < a.length/2  ? [e, a[i + a.length / 2]] : ''; }).slice(0,_vm.combinations.length/2)),function(doubleComb){return _c('tr',{key:doubleComb[0].id},[_vm._l((doubleComb),function(comb){return [_c('td',[_vm._v(_vm._s(comb.name))]),_vm._v(" "),_vm._l(((_vm.playersCount)),function(_,playerID){return _c('td',{key:playerID+'_'+comb.id,class:{ 
                      setscore: _vm.scores[playerID][comb.id] !== undefined, 
                      scorecell: (_vm.rolled && _vm.playerTurn === playerID && _vm.scores[playerID][comb.id] === undefined ? true : false) 
                    },on:{"click":function($event){_vm.setScoreUser(playerID, comb.id)}}},[_vm._v("\n                    "+_vm._s(_vm.calcCell(playerID, comb))+"\n                    "+_vm._s(_vm.scores[playerID][comb.id])+" \n                ")])})]})],2)}),_vm._v(" "),_c('tr',[_c('td',[_vm._v("bonus")]),_vm._v(" "),_vm._l(((_vm.playersCount)),function(_,playerID){return _c('td',{staticClass:"bonuscell",class:{ setscore: _vm.partSum(_vm.scores[playerID]) >= _vm.bonusRequire }},[_vm._v(_vm._s(_vm.partSum(_vm.scores[playerID]))+"/"+_vm._s(_vm.bonusRequire))])}),_vm._v(" "),_c('td',[_vm._v(_vm._s(_vm.combinations[12].name))]),_vm._v(" "),_vm._l((_vm.playersCount),function(_,playerID){return _c('td',{key:playerID+'_'+_vm.combinations[12].id,class:{ 
                    setscore: _vm.scores[playerID][_vm.combinations[12].id] !== undefined, 
                    scorecell: (_vm.rolled && _vm.playerTurn === playerID && _vm.scores[playerID][_vm.combinations[12].id] === undefined ? true : false) 
                  },on:{"click":function($event){_vm.setScoreUser(playerID, _vm.combinations[12].id)}}},[_vm._v("\n                  "+_vm._s(_vm.calcCell(playerID, _vm.combinations[12]))+"\n                  "+_vm._s(_vm.scores[playerID][_vm.combinations[12].id])+" \n              ")])})],2),_vm._v(" "),_c('tr',[_c('td'),_vm._v(" "),_vm._l((_vm.playersCount),function(playerID){return _c('td',[_vm._v("\n                "+_vm._s(_vm.partSum(_vm.scores[playerID]) >= _vm.bonusRequire ? _vm.bonusSize: 0)+"\n              ")])}),_vm._v(" "),_c('td',[_vm._v("total")]),_vm._v(" "),_vm._l((_vm.playersCount),function(playerID){return _c('td',[_vm._v("\n                "+_vm._s(_vm.finalSum(_vm.scores[playerID-1]))+"\n              ")])})],2)],2)])]),_vm._v(" "),_c('div',{staticClass:"dice block"},[_vm._v("\n        dice\n        "),_c('Dice',{attrs:{"dice":_vm.dice,"willRoll":_vm.willRoll,"disabled":_vm.isAITurn || _vm.isNotYourTurn,"onclick":_vm.emitUpdate}})],1),_vm._v(" "),_c('div',{staticClass:"buttons block"},[_c('div',{staticClass:"settings-icon",class:{ on: _vm.showSettings },on:{"click":function($event){_vm.showSettings = !_vm.showSettings}}}),_vm._v(" "),_c('button',{staticClass:"button",class:{ unclickable: (_vm.rollsLeft === 0 || _vm.isNotYourTurn) || _vm.isAITurn, red: (_vm.rollsLeft === 0), blue: (_vm.rollsLeft > 0) },attrs:{"type":"button","id":"roll-dice"},on:{"mousedown":_vm.adsRoll}},[_vm._v("\n          "+_vm._s(!_vm.isNotYourTurn ? _vm.rollButtonMessage : _vm.rollButtonMessage + ' (not your turn)')+"\n        ")])]),_vm._v(" "),_c('div',{staticClass:"settings block",class:{'hidden': !_vm.showSettings}},[_c('div',[_vm._v("\n          reset game "),_c('button',{staticClass:"danger",on:{"click":_vm.confirmReset}},[_vm._v("RESET")])]),_vm._v(" "),_c('div',[_vm._v("\n          adjustments "),_c('button',{class:{success: _vm.adjustments, info: !_vm.adjustments},on:{"click":function($event){_vm.askForReset() ? _vm.adjustments = !_vm.adjustments : null}}},[_vm._v(_vm._s(_vm.adjustments ? 'ON' : 'OFF'))])]),_vm._v(" "),_c('div',[_vm._v("\n          players count "),_c('button',{staticClass:"info",on:{"click":_vm.incPlayersCount}},[_vm._v(_vm._s(_vm.isVsAI ? 'AI' : _vm.playersCount))])]),_vm._v(" "),_c('div',[_vm._v("\n          AIvsAI "),_c('button',{staticClass:"info",on:{"click":_vm.startAIvsAI}},[_vm._v("fight")])]),_vm._v(" "),_c('div',[_vm._v("\n          online-mode \n          "),(!_vm.onlineMode)?_c('span',[_c('button',{staticClass:"info",on:{"click":function($event){_vm.onlineModeHost()}}},[_vm._v("host")]),_vm._v(" "),_c('button',{staticClass:"info",staticStyle:{"margin-right":"10px"},on:{"click":function($event){_vm.onlineModeJoin()}}},[_vm._v("join")])]):_c('span',[_c('button',{staticClass:"info",on:{"click":function($event){_vm.exitFromOnlineMode()}}},[_vm._v("exit from "+_vm._s(_vm.onlineMode))]),_vm._v(" "),_c('button',{staticClass:"info",staticStyle:{"margin-right":"10px"},on:{"click":function($event){_vm.onlineModeJoin()}}},[_vm._v("join")])])]),_vm._v(" "),_c('div',[_vm._v("\n          about "),_c('button',{staticClass:"info",on:{"click":function($event){_vm.toggleModal('about')}}},[_vm._v("about")])])])]),_c('v-dialog')],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 70:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"app"}},[_c('main',[_c('Game')],1)])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })

},[28]);
//# sourceMappingURL=app.98fa12e866012a1643b1.js.map