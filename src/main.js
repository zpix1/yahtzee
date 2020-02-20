// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import './assets/style.scss'

import Vue from 'vue'
import App from './App'
import VModal from 'vue-js-modal'
 
Vue.use(VModal, { dialog: true })
import VuePersist from 'vue-persist'
var longpress = require('vue-long-press-directive')

Vue.use(longpress, { duration: 1000 })
Vue.use(VuePersist)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
