<template>
  <div id="app">
    <q-btn v-if="$route.path == '/'" class="scrollTopBtn" icon="keyboard_arrow_up" glossy color="primary" round @click="scrollTop"/>
    <header>
      <q-btn
        class="logo"
        :text-color="$route.path == '/' ? 'white' : 'purple'"
        :color="$route.path == '/' ? 'purple' : 'gray'"
        @click="refreshjobs" round glossy to="/" size="16px" label="ussat" style="padding: 6px;">
        <!-- <q-avatar size="46px">
          <img src="https://cdn.quasar.dev/app-icons/icon-128x128.png" />  
        </q-avatar> -->
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
          <q-btn label="Публикация вакансий(xls)"/>
        </router-link>
        <router-link class="r-link" v-if="role === 'company'" to="/addJob">
          <q-btn label="Добавить вакансию"/>
        </router-link>
        <!-- <router-link to="/about">Контакты</router-link> | -->
        
      </div>
      <div id="authmenu">
        <div class="colx user-status-bar">
          <!-- <div> {{status}} </div>
          <div> {{user}} ({{user_id}})</div> -->
          <q-btn-group>
            <q-btn push glossy :color="$route.path == '/registration' ? 'purple' : 'gray'" :text-color="$route.path == '/registration' ? 'white' : 'black'" no-caps v-if="role === 'guest'" @click.native="regState='login'" label="Вход" to="/registration"/>
            <q-btn push glossy no-caps v-if="user_id !== -1" @click="logout" label="Выйти"/>
            <q-btn push glossy @click="getFavedFull" :color="$route.path == '/subprofile' ? 'purple' : 'gray'" :text-color="$route.path == '/subprofile' ? 'white' : 'black'" no-caps label="Личный кабинет" v-if="role === 'subscriber'" to="/subprofile"/>
            <q-btn push glossy @click.native="getOwnJobs" no-caps label="Профиль" v-if="role === 'company'" to="/entprofile"/>
          </q-btn-group>
          
        </div>
      </div>
      <div>
        <!-- Язык -->
        <!-- <p style="margin: 0; margin-bottom: 5px;">Язык</p>
        <select v-model="app_lng" style="width: 40px">
          <option value="tm">tm</option>
          <option value="ru">ru</option>
          <option value="en">en</option>
        </select> -->
        <button class="langLink">{{app_lng}}
          <q-menu>
            <q-item :style="{color: app_lng == 'TN' ? 'purple' : 'black'}" clickable v-close-popup @click="app_lng = 'TN'">
              TN
            </q-item>
            <q-item :style="{color: app_lng == 'RU' ? 'purple' : 'black'}" clickable v-close-popup @click="app_lng = 'RU'">
              RU
            </q-item>
            <q-item :style="{color: app_lng == 'EN' ? 'purple' : 'black'}" clickable v-close-popup @click="app_lng = 'EN'">
              EN
            </q-item>
          </q-menu>
        </button>
      </div>
      <!-- <button @click="getOwnJobs">debug ownJobs</button>
      <button @click="getLikedJobs">debug getLiked</button> -->
      <!-- <button @click="refreshjobs">refresh jobs debug</button> -->
      <!-- <q-btn :loading="ajaxLoading" dense size="sm" color="primary" @click="refreshjobs" icon="refresh">debug</q-btn> -->
      <q-ajax-bar
        position="bottom"
        color="accent"
        size="10px"
      />
    </header>
    <keep-alive> <!-- @stepChange="stepChange" :step="step" -->
      <router-view :likedJobsList="likedJobsList" :likedJobs="likedJobs" @favOne="favOne" @getOwnJobs="getOwnJobs" :ownJobs="ownJobs" @authed="authIt" @regStateUpd="regStateUpd" :regState="regState" class="r-view" :jobsFullcount="jobsFullcount" :page_current="page_current" :pages="pages_count" :featuredJobslist="featuredJobslist" :pending="ajaxLoading" @updQue="updQue" :role="role" :username="username" :surname="surname" :insearch="insearch" :company="company" :isagency="isagency" :jobslist="jobslist" @refresh="refreshjobs" :uid="user_id" :authed="user_id !== -1" />
    </keep-alive>
    <footer class="main__footer">
      <q-btn push color="primary" label="Написать нам" to="/Feedback"/>
    </footer>
    <!-- <LoginModal @authed="authIt" @loginclosed="modalShown = 'none'" :isShown="modalShown === 'login'"></LoginModal> -->
    <!-- <RegisterModal @regclosed="modalShown = 'none'" :isShown="modalShown === 'reg'"></RegisterModal> -->  
  </div>
</template>

<script>
// import LoginModal from './components/organisms/LoginModal'
// import RegisterModal from './components/organisms/RegisterModal'

import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll

import axios from 'axios'
const config = require('./configs/main_config')
export default {
  name: 'App',
  data: ()=>{return {
    app_lng: 'RU',
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
    likedJobs: [],
    likedJobsList: []
    //step: 1, //для uploads
  }},
  computed: {
    pages_count() {
      return Math.ceil(this.jobsFullcount / this.perpage)
    }
  },
  components: {
    // LoginModal,
    // RegisterModal
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
          console.log('auth failed')
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
          this.likedJobs = []
          this.likedJobsList = []
          this.ownJobs = []
        } else if (response.data && response.data[0] && response.data[1] && response.data[2]) {
          this.authIt(response.data)
        }
      })
    //get all jobs
    this.refreshjobs('init')
    this.getFavedFull()
  },
  methods: {
    scrollTop() {
      let el = document.documentElement
      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 250
      setScrollPosition(target, offset, duration)
    },
    getFavedFull() {
      let url = config.jobsUrl + '/getFavedFull.json'
      this.ajaxLoading = true
      axios
        .post(url, [], {withCredentials: true,})
        .then(response => {
          //console.log('getLikedJobs response cp72: ', response.data)
          if (response.data) {
            if (Array.isArray(response.data)) {
              this.likedJobsList = response.data
            } else {
              this.likedJobsList = []
            }
            
            //console.log(this.likedJobsList)
            //console.log(this.likedJobs)
          }
          this.ajaxLoading = false
        })
    },
    getLikedJobs() {
      let jobsLikedUrl = config.jobsUrl + '/getFaved.json'
      this.ajaxLoading = true
      axios
        .post(jobsLikedUrl, [], {withCredentials: true,})
        .then(response => {
          //console.log('getLikedJobs response cp72: ', response.data)
          if (response.data) {
            if (Array.isArray(response.data)) {
              this.likedJobs = response.data
            } else {
              this.likedJobs = []
            }
            
            //console.log(this.likedJobs)
          }
          this.ajaxLoading = false
        })
    },
    favOne(id) {
      console.log('app favOne1', this.likedJobs)
      let favOneUrl
      if (!this.likedJobs.includes(id)) {
        this.likedJobs.push(id)
        console.log('app favOne2')
        favOneUrl = config.jobsUrl + '/favOne.json?jid=' + id
      } else {
        let index = this.likedJobs.indexOf(id);
        if (index !== -1) this.likedJobs.splice(index, 1);
        favOneUrl = config.jobsUrl + '/delFavOne.json?jid=' + id
        console.log('app favOne3')
      }
      this.ajaxLoading = true
      axios
        .post(favOneUrl, [], {withCredentials: true,})
        .then(response => {
          //console.log('getOwnJobs response cp61: ', response.status, response.data)
          this.ajaxLoading = false
        })
    
    },
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
      this.ownJobs = []
      if (token[2] === 'subscriber') {
        this.username = token[3]
        this.surname = token[4]
        this.insearch = token[5]
        this.likedJobs = token[6]
      } else
      if (token[2] === 'company') {
        this.company = token[3]
        this.isagency = token[4]
        this.likedJobs = []
      }
      //console.log('cp111')
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
      console.log('refresh jobs app level')
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
          }
          this.ajaxLoading = false
        })
    },
    updQue(params) {
      this.query = params
      console.log(this.query)
    },
    perPageUpd(e) {
      //console.log('cpcp111 ', e)
      //this.perpage = e
    }
  },
  watch:{
    // $route (to, from){
    //   console.log(to)
    //   if (to === '/usbprofile') {
    //     this.getFavedFull()
    //   }
    // }
  }
}
</script>

<style lang="stylus">
*
  font-family 'Varela Round', 'Nunito', sans-serif
#app
  // font-family 'Avenir', Helvetica, Arial, sans-serif
  --maxW 1000px
  font-family 'Varela Round', 'Nunito', sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  font-size 13px
  line-height 14px
  max-width var(--maxW)
  margin auto
  margin-bottom 75px
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
    text-decoration none
  h1,h2,h3,h5,h6
    font-size 14px
    line-height 1
  h4
    line-height 1
  // a 
  //   &:visited
  //     color purple
  .router-link-exact-active
    color white
    background-color purple
    &:visited
      color white
      background-color purple
  .searched
    background-color yellow
  .r-view
    //width 90%
    max-width var(--maxW)
    margin auto
  .logo
    margin-right 10px
    font-weight 700
    
  .user-status-bar
    text-align left
    align-items flex-start
  .scrollTopBtn
    position fixed
    bottom 12px
    left 40px
    opacity 0.7
    z-index 3
  .main__footer
    display flex
    justify-content flex-end
    background-color #eee
    box-shadow 0 0 3px 0px #a0a9
    position fixed
    bottom 0
    padding 12px 10px
    box-sizing border-box
    width 100%
    max-width var(--maxW)
  .langLink
    border 0
    background-color transparent
    color purple
    cursor pointer
    font-size 18px
    &:hover
      color blue

</style>