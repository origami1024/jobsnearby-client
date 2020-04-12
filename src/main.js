import Vue from 'vue'
import App from './App.vue'
import router from './router'
//import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

// import Buefy from 'buefy'
// import 'buefy/dist/buefy.css'
// Vue.use(Buefy)

import './quasar'

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)


import loc from './localization/locals.js'


const i18n = new VueI18n({
  locale: 'ru', // set locale
  messages: loc.loc, // set locale messages
})

Vue.config.productionTip = false


new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')




