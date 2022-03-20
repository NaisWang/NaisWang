import Vue from 'vue'
import app from './App.vue'
import router from "./js/router.js";

import VueRouter from 'vue-router'
Vue.use(VueRouter)


import './css/index.css'
import './css/highlight.css'
import './css/atom-one-dark.min.css'

var vm = new Vue({
  el: "#app",
  render: c => c(app),
  router
})
