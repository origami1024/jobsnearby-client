<template>
  <div id="app">
    <header>
      <q-btn class="logo" @click="refreshjobs" round glossy to="/" size="16px">
        <q-avatar size="40px">
          <img src="https://cdn.quasar.dev/app-icons/icon-128x128.png" />
        </q-avatar>
      </q-btn>
      
      <div id="nav" shrink stretch>
        <!-- <router-link class="r-link" to="/">
          <q-btn flat label="Главная"/>
        </router-link> -->
        <!-- <router-link class="r-link" @click.native="regState='reg'" v-if="role === 'guest'" to="/registration">
          <q-btn flat label="Регистрация"/>
        </router-link> -->
        <!-- <router-link class="r-link" @click.native="regState='login'" v-if="role === 'guest'" to="/registration">
          <q-btn flat label="Вход"/>
        </router-link> -->
        <!-- <router-link to="/jobslist">Вакансии</router-link> | -->
        <router-link @click.native="getOwnJobs" class="r-link" v-if="role === 'company'" to="/uploads">
          <q-btn flat label="Публикация вакансий"/>
        </router-link>
        <!-- <router-link to="/about">Контакты</router-link> | -->
        
      </div>
      <div id="authmenu">
        <!-- <button v-show="user_id === -1" @click="modalShown = modalShown === 'login' ? 'none' : 'login'">Войти</button> -->
        <!-- <button v-show="user_id === -1" @click="modalShown = modalShown === 'reg' ? 'none' : 'reg'">Регистрация</button> -->
        <!-- <button v-show="user_id !== -1" @click="logout">Выйти</button> -->
        <div class="colx user-status-bar">
          <div> {{status}} </div>
          <div> {{user}} ({{user_id}})</div>
          <q-btn-group>
            <q-btn push glossy no-caps v-if="role === 'guest'" @click.native="regState='login'" label="Вход" to="/registration"/>
            <q-btn push glossy no-caps v-if="user_id !== -1" @click="logout" label="Выйти"/>
            <q-btn push glossy no-caps label="Личный кабинет" v-if="role === 'subscriber'" to="/subprofile"/>
            <q-btn push glossy no-caps label="Профиль" v-if="role === 'company'" to="/entprofile"/>
          </q-btn-group>
          
        </div>
      </div>
      <div>Язык: рус
      </div>
      <button @click="getOwnJobs">debug ownJobs</button>
      <!-- <button @click="refreshjobs">refresh jobs debug</button> -->
      <!-- <q-btn :loading="ajaxLoading" dense size="sm" color="primary" @click="refreshjobs" icon="refresh">debug</q-btn> -->
      <q-ajax-bar
        position="bottom"
        color="accent"
        size="10px"
      />
    </header>
    <keep-alive> <!-- @stepChange="stepChange" :step="step" -->
      <router-view  @getOwnJobs="getOwnJobs" :ownJobs="ownJobs" @authed="authIt" @regStateUpd="regStateUpd" :regState="regState" class="r-view" :jobsFullcount="jobsFullcount" :page_current="page_current" :pages="pages_count" :featuredJobslist="featuredJobslist" :pending="ajaxLoading" @updQue="updQue" :role="role" :username="username" :surname="surname" :insearch="insearch" :company="company" :isagency="isagency" :jobslist="jobslist" @refresh="refreshjobs" :uid="user_id" :authed="user_id !== -1" />
    </keep-alive>
    <!-- <footer>Origami1024, Dec 2019</footer> -->
    <!-- <LoginModal @authed="authIt" @loginclosed="modalShown = 'none'" :isShown="modalShown === 'login'"></LoginModal> -->
    <!-- <RegisterModal @regclosed="modalShown = 'none'" :isShown="modalShown === 'reg'"></RegisterModal> -->
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
    regState: 'reg',
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
    ajaxLoading: false,
    ownJobs: [],
    //step: 1, //для uploads
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
        //console.log('auth resp: ', response.data)
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
    // stepChange(n) {
    //   this.step += n
    // },
    regStateUpd(val){
      //console.log('cpvalm ', val)
      this.regState = val
    },
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
      //console.log('refresh jobs app level', param2)
      let jobslistUrl = config.jobsUrl + '/jobs.json'
      if (param !== 'init') {
        jobslistUrl += this.query
        if (param === 'page') {
          jobslistUrl += this.query.length > 0 ? '&page=' : '?page='
          jobslistUrl += param2
        }
      }
      //console.log(jobslistUrl)
      this.ajaxLoading = true
      axios
        .get(jobslistUrl, null, {headers: {'Content-Type' : 'application/json' }})
        .then(response => {
          this.jobslist = response.data.rows
          this.jobsFullcount = Number(response.data.full_count)
          this.perpage = Number(response.data.perpage)
          this.page_current = Number(response.data.page)
          //console.log('cppage: ', response.data.page)
          if (param === 'init') this.featuredJobslist = response.data.rows
          this.ajaxLoading = false
          
        })
    },
    getOwnJobs() {
      console.log('getOwnJobs app level')
      let jobslistUrl = config.jobsUrl + '/getOwnJobs.json'
      this.ajaxLoading = true
      axios
        .post(jobslistUrl, [], {withCredentials: true,})
        .then(response => {
          //console.log('getOwnJobs response cp61: ', response.data)
          if (response.data && response.data.rows) {
            this.ownJobs = response.data.rows
            this.ownJobs.forEach(job => {
              console.log('cpppp: ', job.salary_min)
              console.log('cpppp: ', job.salary_max)
            })
            
          }
          this.ajaxLoading = false
        })
    },
    updQue(params) {
      this.query = params
    },
    perPageUpd(e) {
      //console.log('cpcp111 ', e)
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
  font-size 13px
  line-height 14px
  header
    display flex
    align-items center
    justify-content space-between
    margin 15px 10px
    margin-bottom 5px
    padding 5px 15px
    box-sizing border-box
    box-shadow 0 0 3px 0px #a0a9
    background-color #f7f7f7
    #nav
      display flex
  .r-link
    margin-right 10px
    display block
    border-radius 4px
    color purple
  h1,h2,h3,h4,h5,h6
    font-size 14px
    line-height 1
  a 
    &:visited
      color purple
  .router-link-exact-active
    color white
    background-color purple
    &:visited
      color white
      background-color purple
  .searched
    background-color yellow
  .r-view
    width 80%
    margin auto
  .logo
    margin-right 10px
  .user-status-bar
    text-align left
    align-items flex-start
    
</style>