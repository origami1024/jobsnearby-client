import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

// import Buefy from 'buefy'
// import 'buefy/dist/buefy.css'
// Vue.use(Buefy)

import './quasar'


// import Throttle from 'vue-throttle'
// Vue.use(Throttle)




Vue.config.productionTip = false


new Vue({
  router,

  //vuetify,
  render: h => h(App)
}).$mount('#app')
