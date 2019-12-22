<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Главная</router-link> |
      <router-link to="/jobslist">Вакансии</router-link> |
      <router-link to="/uploads">Публикация вакансий</router-link> |
      <router-link to="/about">Контакты</router-link>
    </div>
    <div id="authmenu">
      <button v-show="user_id === -1" @click="modalShown = modalShown === 'login' ? 'none' : 'login'">Войти</button>
      <button v-show="user_id === -1" @click="modalShown = modalShown === 'reg' ? 'none' : 'reg'">Регистрация</button>
      <button v-show="user_id !== -1" @click="logout">Выйти</button>
      <span> Статус: {{status}} </span>
      <span> Пользователь: {{user}} ({{user_id}})</span>
    </div>
    <hr>
    <router-view :jobslist="jobslist" @refresh="refreshjobs" :uid="user_id" :authed="user_id !== -1" />
    <!-- <footer>Origami1024, Dec 2019</footer> -->
    <LoginModal @authed="authIt" @loginclosed="modalShown = 'none'" :isShown="modalShown === 'login'"></LoginModal>
    <RegisterModal @regclosed="modalShown = 'none'" :isShown="modalShown === 'reg'"></RegisterModal>
  </div>
</template>

<script>
import LoginModal from './components/organisms/LoginModal'
import RegisterModal from './components/organisms/RegisterModal'
import axios from 'axios'
const config = require('./configs/main_config')

export default {
  name: 'App',
  data: ()=>{return {
    modalShown: 'none',
    status: 'Вход не выполнен',
    user: 'Гость',
    token: undefined,
    user_id: -2,
    jobslist: []
  }},
  components: {
    LoginModal,
    RegisterModal
  },
  created() {
    
  },
  mounted() {
    //this.$on('loginclosed', this.showLogin = false)
    //this.$on('regclosed', this.showReg = false)
    console.log('app mounted')
    //send auth by cookies request
    axios
      .post(config.jobsUrl + '/auth', [], {withCredentials: true,})
      .then(response => {
        console.log('auth resp: ', response.data)
        if (response.data === 'fail') {
          this.status = 'Вход не выполнен'
          this.token = undefined
          this.user = 'Гость'
          this.user_id = -1
        } else if (response.data && response.data[0] && response.data[1]) {
          this.authIt(response.data)
        }
      })
    //get all jobs
    this.refreshjobs()
  },
  methods: {
    authIt: function(token) {
      this.status = 'Вход выполнен'//имя пользователя?
      this.user = token[0]
      this.user_id = token[1]
      this.modalShown = 'none'
    },
    logout: function() {
      if (this.user_id !== -1) {
        this.status = 'Выход...'//имя пользователя?
        this.user = 'Гость'
        this.user_id = -1
        axios
          .post(config.jobsUrl + '/out', [], {withCredentials: true})
          .then(response => {
            this.status = 'Вход не выполнен'
          })
      }
    },
    refreshjobs: function () {
      console.log('refresh jobs app level')
      axios
        .get(config.jobsUrl + '/jobs.json', null, {headers: {'Content-Type' : 'application/json' }})
        .then(response => {this.jobslist = response.data; console.log('cp1')})
    }
  }
}
</script>

<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 20px
  font-size 13px
  line-height 11px
</style>
