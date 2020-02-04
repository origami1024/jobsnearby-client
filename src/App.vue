<template>
  <div id="app">
    <q-btn v-if="$route.path == '/'" class="scrollTopBtn" icon="keyboard_arrow_up" glossy color="primary" round @click="scrollTop"/>
    <header>
      <q-btn
        class="logo"
        :text-color="$route.path == '/' ? 'white' : 'purple'"
        :color="$route.path == '/' ? 'purple' : 'gray'"
        @click="refreshjobs('logoclick')" round glossy to="/" size="16px" label="ussat" style="padding: 6px;">
        <!-- <q-avatar size="46px">
          <img src="https://cdn.quasar.dev/app-icons/icon-128x128.png" />  
        </q-avatar> -->
        <q-tooltip>
            <p style="font-size: 15px; margin: 0">Главная</p>
          </q-tooltip>
      </q-btn>
      <div class="separator" style="width: 150px"></div>
      <div id="nav" shrink stretch>
        <router-link @click.native="newJobInit" class="r-link" v-if="role === 'company'" to="/addJob">
          <!-- <q-btn round icon="add_circle_outline"/> -->
          <q-icon round glossy name="add_circle_outline" size="40px"></q-icon>
          <q-tooltip>
            <p style="font-size: 15px; margin: 0">{{$t('App.newJobHint')}}</p>
          </q-tooltip>
        </router-link>
        <!-- <router-link to="/about">Контакты</router-link> | -->
        
      </div>
      <div class="separator" style="width: 150px"></div>
      <div id="authmenu" style="alignSelf: flex-end;">
        <div class="colx user-status-bar">
          <!-- <div> {{status}} </div>
          <div> {{user}} ({{user_id}})</div> -->
          <q-btn-group>
            
            <q-btn push glossy :color="$route.path == '/registration' ? 'purple' : 'gray'" :text-color="$route.path == '/registration' ? 'white' : 'black'" no-caps v-if="role && role.startsWith('guest')" @click.native="regState='login'" :label="$t('App.login')" to="/registration"/>
            
            <q-btn push glossy @click="getFavedFull" :color="$route.path == '/subprofile' ? 'purple' : 'gray'" :text-color="$route.path == '/subprofile' ? 'white' : 'black'" no-caps icon="person" v-if="role === 'subscriber'" to="/subprofile"/>
            <q-btn push glossy no-caps icon="person" @click.native="getOwnJobs" v-if="role === 'company'" to="/entprofile"/>
            <q-btn push glossy no-caps v-if="user_id != -1" @click="logout" icon="logout">
              <q-tooltip>
                <p style="font-size: 15px; margin: 0">{{$t('App.logoutHint')}}</p>
              </q-tooltip>
            </q-btn>
            <!-- @click.native="getOwnJobs" -->
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
          <q-menu dense>
            <q-item style="lineHeight: 2.2" dense :style="{color: app_lng == 'TM' ? 'purple' : 'black'}" clickable v-close-popup @click="app_lng = 'TM'; $i18n.locale = 'tm'">
              TM
            </q-item>
            <q-item style="lineHeight: 2.2" dense :style="{color: app_lng == 'RU' ? 'purple' : 'black'}" clickable v-close-popup @click="app_lng = 'RU'; $i18n.locale = 'ru'">
              RU
            </q-item>
            <q-item style="lineHeight: 2.2" dense :style="{color: app_lng == 'EN' ? 'purple' : 'black'}" clickable v-close-popup @click="app_lng = 'EN'">
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
      <router-view
        :ownCVs="ownCVs"
        @cvupd="cvupd"
        @changeUDataSub="uDataChangeFromSubProfile"
        @setSentState="setSentState" :sent="newJobSentState" @newJobInit="newJobInit" :jobEditedObj="jobEditedObj" :jobEditId="jobEditId" :newJobsPageType="newJobsPageType" @editJob="editJob"
        @scrollTo="scrollTo"
        @delJob="deleteJobById"
        @closeJob="closeJobById"
        :likedJobsList="likedJobsList" :likedJobs="likedJobs"
        @logoutAndRetry="logoutAndRetry"
        @favOne="favOne"
        @hitcv="hitcv"
        @getOwnJobs="getOwnJobs" :ownJobs="ownJobs"
        @authed="authIt" @regStateUpd="regStateUpd" :regState="regState"
        class="r-view"
        :jobsFullcount="jobsFullcount"
        :page_current="page_current" :pages="pages_count"
        :pending="ajaxLoading" @updQue="updQue"
        :cvurl="cvurl" :role="role" :username="username" :surname="surname" :insearch="insearch" :company="company" :isagency="isagency" :jobslist="jobslist" @refresh="refreshjobs" :uid="user_id" :authed="user_id !== -1"
      />
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
    newJobSentState: 'none',
    newJobsPageType: 'new',
    jobEditId : -1,
    jobEditedObj: {},
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
    cvurl: '',
    jobslist: [],
    jobsFullcount: 0,
    perpage: 25,
    page_current: 1,
    query: '',
    ajaxLoading: false,
    ownJobs: [],
    likedJobs: [],
    likedJobsList: [],
    ownCVs: [],
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
  beforeDestroy() {
    window.removeEventListener("storage", this.onStorageUpdate);
  },
  mounted() {
    if (localStorage.user) {
      this.user = localStorage.user
    }
    if (localStorage.user_id) {
      this.user_id = localStorage.user_id
    }
    if (localStorage.role) {
      this.role = localStorage.role
    }
    if (localStorage.username) {
      this.username = localStorage.username
    }
    if (localStorage.surname) {
      this.surname = localStorage.surname
    }
    if (localStorage.company) {
      this.company = localStorage.company
    }
    if (localStorage.isagency) {
      this.isagency = localStorage.isagency
    }
    if (localStorage.insearch) {
      this.insearch = Boolean(localStorage.insearch)
    }
    if (localStorage.likedJobs) {
      this.likedJobs = Array(localStorage.likedJobs)
    }
    window.addEventListener("storage", this.onStorageUpdate)

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
          this.role = 'guestUnau'
          this.surname = ''
          this.username = ''
          this.company = ''
          this.isagency = false
          this.insearch = false
          this.likedJobs = []
          this.cvurl = ''
          this.likedJobsList = []
          this.ownJobs = []
          this.ownCVs = []
        } else if (response.data && response.data[0] && response.data[1] && response.data[2]) {
          this.authIt(response.data)
          
        }
      })
    //need to do these two only depending on the route
    this.refreshjobs('init')
    this.getFavedFull()
  },
  methods: {
    cvupd(e) {
      this.cvurl = e
    },
    onStorageUpdate(event) {
      if (event.key === "user") {
        this.user = event.newValue;
      } else
      if (event.key === "user_id") {
        this.user_id = event.newValue;
      } else
      if (event.key === "role") {
        this.role = event.newValue;
      } else
      if (event.key === "username") {
        this.username = event.newValue;
      } else
      if (event.key === "surname") {
        this.surname = event.newValue;
      } else
      if (event.key === "company") {
        this.company = event.newValue;
      } else
      if (event.key === "isagency") {
        this.isagency = Boolean(event.newValue);
      } else
      if (event.key === "insearch") {
        this.insearch = Boolean(event.newValue);
      } else
      if (event.key === "likedJobs") {
        this.likedJobs = Array(event.newValue);
      }
    },
    setSentState(state) {
      this.newJobSentState = state
    },
    newJobInit() {
      this.newJobsPageType = 'new'
      this.jobEditId = -1
      this.jobEditedObj = {}
      this.newJobSentState = 'none'
    },
    editJob(jid) {
      this.newJobsPageType = 'edit'
      this.jobEditId = jid
      //title: this.ownJobs.find(j => j.job_id == jid).title,
      let tmpObj = this.ownJobs.find(j => j.job_id == jid)

      let jtypeOptions = [
        {label: "Постоянная", value: 'c'},
        {label: "Временная", value: 'v'}]
      let expOptions = [
        {label: "Не имеет значения", value: -1},
        {label: "Без опыта", value: 0},
        {label: "от 1 до 3 лет", value: 2}, 
        {label: "от 3 до 5 лет", value: 4},
        {label: "от 5 лет", value: 6}
      ]
      let curOpts = [
        {label: 'манат', value: 'm'},      
        {label: '$', value: '$'},
      ]
      
      let searched

      searched = curOpts.find(c => c.value == tmpObj.currency)
      if (!searched) searched = curOpts[0]
      tmpObj.currency = searched
      
      searched = expOptions.find(c => c.value == tmpObj.experience)
      if (!searched) searched = expOptions[0]
      tmpObj.experience = searched

      searched = jtypeOptions.find(c => c.value == tmpObj.jtype)
      if (!searched) searched = jtypeOptions[0]
      tmpObj.jtype = searched
      this.jobEditedObj = Object.assign({}, tmpObj)
      if (this.jobEditedObj.contact_mail == null) this.jobEditedObj.contact_mail = ''
      if (this.jobEditedObj.contact_tel == null) this.jobEditedObj.contact_tel = ''
      
      this.$router.push('/addJob')
    },
    deleteJobById(jid) {
      //console.log('cpcpcp ', jid)
      let indx = this.ownJobs.indexOf(this.ownJobs.find(val=>val.job_id == jid))
      //console.log(indx)
      this.ownJobs.splice(indx, 1)
      let url = config.jobsUrl + '/delJobBy.id?jid=' + jid
      this.ajaxLoading = true
      axios
        .post(url, [], {withCredentials: true,})
        .then(response => {
          this.ajaxLoading = false
        })
    },
    closeJobById(jid) {
      //console.log('cpcpcp ', jid)
      this.ownJobs.find(val=>val.job_id == jid).is_closed = true
      //console.log(indx)
      let url = config.jobsUrl + '/closeJobBy.id?jid=' + jid
      this.ajaxLoading = true
      axios
        .post(url, [], {withCredentials: true,})
        .then(response => {
          this.ajaxLoading = false
        })
    },
    scrollTo(yyy) {
      let el = document.documentElement
      const target = getScrollTarget(el)
      const offset = el.offsetTop + yyy
      const duration = 250
      setScrollPosition(target, offset, duration)
    },
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
    getOwnCVHits() {
      let owncvhitsUrl = config.jobsUrl + '/getallcvuser'
      this.ajaxLoading = true
      axios
        .post(owncvhitsUrl, [], {withCredentials: true,})
        .then(response => {
          if (response.data.cvs) {
            //console.log('getOwnCVHits response cp621: ', response.data.cvs)
            this.ownCVs = response.data.cvs //wat
          }
          
          this.ajaxLoading = false
        })
    },
    hitcv(id) {
      console.log('app hitOne', id)
      console.log('cppcp44: ', this.cvurl)
      if (!this.cvurl || this.cvurl.length < 5) {
        this.$router.push("/registration")
        this.$q.notify('Сначала загрузите резюме!')
        return false
      }
      let hitcvUrl = config.jobsUrl + '/hitjobcv?jid=' + id
      this.ajaxLoading = true
      axios
        .post(hitcvUrl, {cvurl: this.cvurl}, {withCredentials: true,})
        .then(response => {
          if (response && response.data && response.data.cvhit_id) {
            this.ownCVs.push(response.data)
          }
          //console.log('getOwnJobs response cp61: ', response.newCV, response.data)
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
        this.cvurl = token[7]
        setTimeout(()=>{this.getOwnCVHits()}, 50)
      } else
      if (token[2] === 'company') {
        this.company = token[3]
        this.isagency = token[4]
        this.likedJobs = []
      }
      //console.log('cp111')
    },
    uDataChangeFromSubProfile(udata) {
      this.username = udata.username
      this.surname = udata.surname
      this.insearch = udata.insearch
    },
    logoutAndRetry: function() {
      //this is logout when logout has happened on different tab - no need to send data to server
      console.log('logoutandretry')
      this.status = 'Выход...'//имя пользователя?
      this.user = 'Гость'
      this.user_id = -1
      this.role = 'guest'
      this.status = 'Вход не выполнен'
      this.cvurl = ''
      this.token = undefined
      this.surname = ''
      this.username = ''
      this.company = ''
      this.isagency = false
      this.insearch = false
      this.likedJobs = []
      this.cvurl = ''
      this.likedJobsList = []
      this.ownJobs = []
      this.ownCVs = []
      //console.log(this.$route)
      if (this.$route.name != 'home') this.$router.push("/")
      //this.$destroy() try this to flush data on logout
    },
    logout: function() {
      if (this.user_id !== -1) {
        this.status = 'Выход...'//имя пользователя?
        this.user = 'Гость'
        this.user_id = -1
        this.role = 'guest'
        this.status = 'Вход не выполнен'
        this.cvurl = ''
        this.token = undefined
        this.surname = ''
        this.username = ''
        this.company = ''
        this.isagency = false
        this.insearch = false
        this.likedJobs = []
        this.cvurl = ''
        this.likedJobsList = []
        this.ownJobs = []
        this.ownCVs = []
        axios
          .post(config.jobsUrl + '/out', [], {withCredentials: true})
          .then(response => {
            this.status = 'Вход не выполнен'
            //console.log(this.$route)
            if (this.$route.name != 'home') this.$router.push("/")
          })
      }
    },
    refreshjobs: function (param, param2) {
      if (this.$router.currentRoute.name == 'jobpage' && param != 'logoclick') {
        console.log('get one job app level')
        
      } else {
        console.log('refresh ALL jobs app level')
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
            //if (param === 'init') this.featuredJobslist = response.data.rows
            this.ajaxLoading = false
            
          })
      }
      
    },
    getOwnJobs() {
      console.log('getOwnJobs app level')
      let jobslistUrl = config.jobsUrl + '/getOwnJobs.json'
      this.ajaxLoading = true
      axios
        .post(jobslistUrl, [], {withCredentials: true,})
        .then(response => {
          
          if (response.data && response.data.rows) {
            this.ownJobs = response.data.rows
          } else
          if (response.data && response.data.startsWith('logout')) {
            console.log('logged out on different tab')
            this.logoutAndRetry()
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
    $route (to, from){
      if (to.name === 'uploads') {
        this.getOwnJobs()
      } else
      if (to.name === 'addjob') {
        this.newJobSentState = 'none'
      } else
      if (to.name === 'entprofile') {
        //this.getOwnJobs()
        //console.log('from app')
      }

    },
    user(newName) {
      localStorage.user = newName
    },
    user_id(newName) {
      //console.log(this.$route.name)
      if (newName == -1 && (this.$route.name != 'home' && this.$route.name != 'jobpage' && this.$route.name != 'companyPage' && this.$route.name != 'registration' && this.$route.name != 'feedback')) {
        this.$router.push({ name: "home"})
        //console.log('user_id change')
      }
      localStorage.user_id = newName
    },
    role(newName) {
      localStorage.role = newName
    },
    username(newName) {
      localStorage.username = newName
    },
    surname(newName) {
      localStorage.surname = newName
    },
    company(newName) {
      localStorage.company = newName
    },
    isagency(newName) {
      localStorage.isagency = newName
    },
    insearch(newName) {
      localStorage.insearch = newName
    },
    likedJobs(newName) {
      localStorage.likedJobs = Array(newName)
    },
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