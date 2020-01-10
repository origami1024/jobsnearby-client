import Vue from 'vue'
import VueRouter from 'vue-router'
import Registration from '../views/Registration.vue'
import Jobs from '../views/Jobs.vue'
import SubProfile from '../views/SubProfile.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Jobs //Home
  },
  {
    path: '/subprofile',
    name: 'subprofile',
    component: SubProfile
  },
  {
    path: '/Feedback',
    name: 'Feedback',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Feedback.vue')
  },
  {
    path: '/registration',
    name: 'registration',
    component: Registration
  },
  {
    path: '/uploads',
    name: 'uploads',
    component: () => import(/* webpackChunkName: "about" */ '../views/Uploads.vue')
  },
  {
    path: '/addJob',
    name: 'addJob',
    component: () => import(/* webpackChunkName: "about" */ '../views/addJob.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
