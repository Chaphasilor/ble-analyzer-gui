import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import PacketDetails from '../views/PacketDetails.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: "/packet/:packetId",
    name: "PacketDetails",
    component: PacketDetails,
    meta: {
      title: 'Packet Details',
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
