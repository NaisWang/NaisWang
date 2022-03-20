import VueRouter from "vue-router";
import ContentShow from "../../Components/ContentShow.vue";
import app from "../App.vue"

let router = new VueRouter({
  routes: [
    {path: '/notes/**', component: ContentShow}
  ]
})

export default router
