<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Главная</router-link> |
      <router-link to="/jobslist">Вакансии</router-link> |
      <router-link v-if="role === 'company'" to="/uploads">Публикация вакансий</router-link> |
      <router-link to="/about">Контакты</router-link> |
      <router-link to="/registration">Регистрация</router-link> |
      <router-link v-if="role === 'subscriber'" to="/subprofile">Личный кабинет</router-link>
    </div>
    <div id="authmenu">
      <button v-show="user_id === -1" @click="modalShown = modalShown === 'login' ? 'none' : 'login'">Войти</button>
      <button v-show="user_id === -1" @click="modalShown = modalShown === 'reg' ? 'none' : 'reg'">Регистрация</button>
      <button v-show="user_id !== -1" @click="logout">Выйти</button>
      <span> Статус: {{status}} </span>
      <span> Пользователь: {{user}} ({{user_id}})</span>
    </div>
    <!-- <button @click="refreshjobs">refresh jobs debug</button> -->
    <q-btn :loading="ajaxLoading" dense size="sm" color="primary" @click="refreshjobs">refresh jobs debug</q-btn>
     <q-ajax-bar
      position="bottom"
      color="accent"
      size="10px"
    />
    <hr>
    <keep-alive>
      <router-view :page_current="page_current" :pages="pages_count" :featuredJobslist="featuredJobslist" :pending="ajaxLoading" @updQue="updQue" :role="role" :username="username" :surname="surname" :insearch="insearch" :company="company" :isagency="isagency" :jobslist="jobslist" @refresh="refreshjobs" :uid="user_id" :authed="user_id !== -1" />
    </keep-alive>
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
    username: 'abc',
    surname: 'def',
    insearch: false,
    role: 'guest',
    user: 'Гость',
    token: undefined,
    user_id: -1,
    company: '',
    isagency: false,
    jobslist: [],
    jobsFullcount: 0,
    perpage: 25,
    page_current: 1,
    featuredJobslist: [],
    query: '',
    ajaxLoading: false
  }},
  computed: {
    pages_count() {
      return Math.ceil(this.jobsFullcount / this.perpage)
    }
  },
  components: {
    LoginModal,
    RegisterModal
  },
  created() {
    
  },
  mounted() {
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
          this.role = 'guest'
          this.surname = ''
          this.username = ''
          this.company = ''
          this.isagency = false
          this.insearch = false
        } else if (response.data && response.data[0] && response.data[1] && response.data[2]) {
          this.authIt(response.data)
        }
      })
    //get all jobs
    this.refreshjobs('init')
  },
  methods: {
    authIt: function(token) {
      this.status = 'Вход выполнен'//имя пользователя?
      this.user = token[0]
      this.user_id = token[1]
      this.role = token[2]
      this.modalShown = 'none'
      if (token[2] === 'subscriber') {
        this.username = token[3]
        this.surname = token[4]
        this.insearch = token[5]
      } else
      if (token[2] === 'company') {
        this.company = token[3]
        this.isagency = token[4]
      }
    },
    logout: function() {
      if (this.user_id !== -1) {
        this.status = 'Выход...'//имя пользователя?
        this.user = 'Гость'
        this.user_id = -1
        this.role = 'guest'
        axios
          .post(config.jobsUrl + '/out', [], {withCredentials: true})
          .then(response => {
            this.status = 'Вход не выполнен'
          })
      }
    },
    refreshjobs: function (param, param2) {
      console.log('refresh jobs app level', param2)
      let jobslistUrl = config.jobsUrl + '/jobs.json'
      if (param !== 'init') {
        jobslistUrl += this.query
        if (param === 'page') {
          jobslistUrl += this.query.length > 0 ? '&page=' : '?page='
          jobslistUrl += param2
        }
      }
      
      console.log(jobslistUrl)
      this.ajaxLoading = true
      axios
        .get(jobslistUrl, null, {headers: {'Content-Type' : 'application/json' }})
        .then(response => {
          this.jobslist = response.data.rows
          this.jobsFullcount = response.data.full_count
          this.perpage = Number(response.data.perpage)
          this.page_current = Number(response.data.page)
          console.log('cppage: ', response.data.page)
          if (param === 'init') this.featuredJobslist = response.data.rows
          this.ajaxLoading = false
        })
    },
    updQue(params) {
      this.query = params
    },
    perPageUpd(e) {
      console.log('cpcp111 ', e)
      //this.perpage = e
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
  h1,h2,h3,h4,h5,h6
    font-size 14px
    line-height 1
  a
    color blue
    &:visited
      color blue
  .router-link-exact-active
    color orange
    &:visited
      color orange
  .searched
    background-color yellow
</style>