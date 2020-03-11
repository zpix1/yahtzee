<template>
  <div class="dice-panel">
    <div v-bind:key="d.id" class="dice-element" v-for="d in dice" v-bind:class="[{ used: d.used, 'spin-animation': !d.used && willRoll },'diceN'+d.type, 'diceN']"
v-on:click="disabled ? null : d.type != 0 ? d.used = !d.used : ''; onclick()" ></div>
  </div>
</template>


<script>
export default {
  name: 'dice',
  props: ['dice', 'willRoll', 'disabled', 'onclick']
}
</script>
