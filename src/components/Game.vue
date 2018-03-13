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
              <th>Co</th>
              <th>1</th>
              <th>2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>data</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="dice block">
        Dices
        <div class="dice-panel">
          <div class="dice-element">1</div>
          <div class="dice-element">2</div>
          <div class="dice-element">3</div>
          <div class="dice-element">4</div>
          <div class="dice-element">5</div>
          <input type="button" id="roll-dice" value="Roll"></input>
        </div>

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
export default {
  name: 'game',
  data () {
    return {
      msg: 'Welcome to Your Vue.js PWA'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
    'dice scores scores'
    'dice scores scores'
    'dice scores scores';
  grid-gap: 20px;
  grid-auto-rows: minmax(100px, auto);
}

.dice-panel {
  width: 100%;
  height: 100%;
  border-width: 2px;
  display: table;
}

.dice-element {
  float: left;
  background-color: black;
  width: 20%;
  padding-bottom: 10%;
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
