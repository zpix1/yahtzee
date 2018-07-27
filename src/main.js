// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import './assets/style.scss'

import Vue from 'vue'
import App from './App'

import VuePersist from 'vue-persist'
import VuePressure from 'vue-pressure'

Vue.use(VuePressure)
Vue.use(VuePersist)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
