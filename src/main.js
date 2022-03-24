import Vue from 'vue'
import app from './App.vue'
import router from "./js/router.js";

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

import $ from 'jquery'


import './css/index.css'
import './css/catalog.css'
import './css/content.css'
import './css/header.css'
import './css/toc.css'
import './css/allFileSearch.css'
import './css/highlight.css'
import "./css/githubDark.css"

var vm = new Vue({
  el: "#app",
  render: c => c(app),
  router
})
