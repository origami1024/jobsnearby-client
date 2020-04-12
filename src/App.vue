<template>
  <div id="app">
    <q-btn v-if="$route.path == '/'" class="scrollTopBtn" icon="keyboard_arrow_up" glossy color="red-10" round @click="scrollTop"/>
    <div class="header-wrapper">
      <header>
        <router-link
          @click.native="refreshjobs('logoclick')" to="/"
          class="logolink"
        >
          <span class="logoText">
            G<span style="color: #8645FF; font-weight: bold;">OO</span>DWILL
          </span>
          <q-tooltip>
            <p style="font-size: 15px; margin: 0">{{$t('App.logoTooltip')}}</p>
          </q-tooltip>
        </router-link>
        <!-- <div class="separator" style="width: 150px"></div> -->
        <div class="lowres__header-right">
          <div id="nav">
            <!--  shrink stretch -->
            <!-- r-link -->
            <router-link
              class="headerBtn"
              v-if="role === 'company' && isagency == true" to="/uploads"
              :style="{color: $route.name != 'uploads' ? 'green' : 'var(--violet-btn-color)'}"
            >
              <q-icon name="description" style="font-size: 32px;" class="nav-icon multipleUploadsHeader"></q-icon>
              <!-- <q-btn round icon="description" dense></q-btn> -->
              <q-tooltip>
                <p style="font-size: 15px; margin: 0">{{$t('addJob.xlsBtn')}}</p>
              </q-tooltip>
            </router-link>
            <q-btn 
              @click.native="newJobInit"
              v-if="role == 'company'"
              class="headerBtns1 headerBtnRed"
              text-color="white" 
              :label="$t('App.newJobHint')"
              rounded
              to="/addJob"
            />
            <q-btn
              @click.native="authPls"
              v-else-if="role != 'subscriber'"
              class="headerBtns1 headerBtnRed"
              text-color="white" 
              :label="$t('App.newJobHint')"
              to="/registration"
            />
            <!-- <router-link @click.native="newJobInit" v-if="role == 'company'" class="newlinks" to="/addJob">
              {{$t('App.newJobHint')}} -->
              <!-- <q-icon round glossy name="add_circle_outline" size="40px"></q-icon>
              <q-tooltip>
                <p style="font-size: 15px; margin: 0">{{$t('App.newJobHint')}}</p>
              </q-tooltip> -->
            <!-- </router-link>
            <router-link @click.native="authPls" v-else-if="role != 'subscriber'" class="newlinks" to="/registration">
              {{$t('App.newJobHint')}} -->
              <!-- <q-icon round glossy name="add_circle_outline" size="40px"></q-icon>
              <q-tooltip>
                <p style="font-size: 15px; margin: 0">{{$t('App.newJobHint')}}</p>
              </q-tooltip> -->
            <!-- </router-link> -->

            
          </div>
          <!-- <div class="separator" style="width: 0px"></div> -->
          <div id="authmenu">
            <!-- style="alignSelf: flex-end;" -->
            <div class="colx user-status-bar">
              <q-btn 
                style="background-color: var(--violet-btn-color);"
                class="headerBtns1 violetBtns"
                text-color="white"
                :label="$t('App.login')"
                @click.native="regState='login'"
                v-if="role && role.startsWith('guest')"
                to="/registration"
              />
              <!-- <router-link
                @click.native="regState='login'"
                v-if="role && role.startsWith('guest')"
                class="headerBtnNew"
                to="/registration">
                {{$t('App.login')}}
              </router-link> -->
              <!-- :text-color="$route.path == '/registration' ? 'yellow' : 'white'"  -->
              <!-- <q-btn
                color="white"
                text-color="indigo"
                size="16px"
                dense
                class="no-shadow"
                style="font-weight: 700; alignSelf: flex-end; padding: 0 10px"
                v-if="role && role.startsWith('guest')"
                @click.native="regState='login'"
                :label="$t('App.login')"
                to="/registration"/> -->
              <router-link
                v-if="role && role === 'subscriber'"
                class="headerBtn marginLeft30pxOnBig"
                to="/subprofile"
                :style="{color: $route.name != 'subprofile' ? '' : 'var(--violet-btn-color)'}"
              >
                <q-icon name="person" style="font-size: 36px;" class="nav-icon"></q-icon>
                <q-tooltip>
                  <p style="font-size: 15px; margin: 0">{{$t('App.myProfile')}}</p>
                </q-tooltip>
              </router-link>

              <router-link
                @click.native="getOwnJobs"
                v-if="role && role === 'company' && $route.name == 'entprofile'"
                class="headerBtn marginLeft30pxOnBig"
                to="/entprofile"
                :style="{color: $route.name != 'entprofile' ? '' : 'var(--violet-btn-color)'}"
              >
                <q-icon name="person" style="font-size: 36px;" class="nav-icon"></q-icon>
                <q-tooltip>
                  <p style="font-size: 15px; margin: 0">{{$t('App.myProfile')}}</p>
                </q-tooltip>
              </router-link>
              <router-link
                v-if="role && role === 'company' && $route.name != 'entprofile'"
                class="headerBtn marginLeft30pxOnBig"
                to="/entprofile"
                :style="{color: $route.name != 'entprofile' ? '' : 'var(--violet-btn-color)'}"
              >
                <q-icon name="person" style="font-size: 36px;" class="nav-icon"></q-icon>
                <q-tooltip>
                  <p style="font-size: 15px; margin: 0">{{$t('App.myProfile')}}</p>
                </q-tooltip>
              </router-link>


              <router-link
                @click.native="logout"
                v-if="user_id != -1"
                class="headerBtn"
                to="/"
              >
                <q-icon name="logout" style="font-size: 32px; font-weight: bold" class="nav-icon-logout"></q-icon>
                <q-tooltip>
                  <p style="font-size: 15px; margin: 0">{{$t('App.logoutHint')}}</p>
                </q-tooltip>
              </router-link>
            </div>
          </div>
          <div style="font-weight: 700">
            <!-- Язык -->
            <!-- <p style="margin: 0; margin-bottom: 5px;">Язык</p>
            <select v-model="app_lng" style="width: 40px">
              <option value="tm">tm</option>
              <option value="ru">ru</option>
              <option value="en">en</option>
            </select> -->
            <button class="langLink" style="display: flex; align-items: center; white-space: nowrap; margin-right: 0; padding-left: 0; padding-right: 0;">{{app_lng}}
              <q-menu dense>
                <q-item style="lineHeight: 2.2" dense :style="{color: app_lng == 'TM' ? 'var(--violet-btn-color)' : 'var(--color1)', fontWeight: app_lng == 'TM' ? '700' : '400'}" clickable v-close-popup @click="app_lng = 'TM'; $i18n.locale = 'tm'; setLang('tm')">
                  TM
                </q-item>
                <q-item style="lineHeight: 2.2" dense :style="{color: app_lng == 'RU' ? 'var(--violet-btn-color)' : 'var(--color1)', fontWeight: app_lng == 'RU' ? '700' : '400'}" clickable v-close-popup @click="app_lng = 'RU'; $i18n.locale = 'ru'; setLang('ru')">
                  RU
                </q-item>
              </q-menu>
              <img style="display: inline-block; margin-left: 5px;" src="./../public/assets/arrow1.png">
            </button>
          </div>
        </div>
        <q-ajax-bar
          position="bottom"
          color="red"
          size="10px"
        />
        <!-- color="accent" -->
      </header>
    </div>
    <!--  mode="out-in" -->
    <keep-alive>
    <router-view
      :salMin="salMin" :salAvg="salAvg" :salMax="salMax"
      :tops="tops"
      :ownCVs="ownCVs"
      @cvupd="cvupd"
      @changeUDataSub="uDataChangeFromSubProfile"
      @setSentState="setSentState" :sent="newJobSentState" @newJobInit="newJobInit" :jobEditedObj="jobEditedObj" :jobEditId="jobEditId" :newJobsPageType="newJobsPageType" @editJob="editJob"
      @scrollTo="scrollTo"
      @delJob="deleteJobById" @closeJob="closeJobById" @reopenJob="reopenJobById"
      @logoutAndRetry="logoutAndRetry"
      @hitcv="hitcv"
      @getOwnJobs="getOwnJobs" :ownJobs="ownJobs"
      @authed="authIt" @regStateUpd="regStateUpd" :regState="regState"
      class="r-view"
      :jobsFullcount="jobsFullcount"
      :page_current="page_current" :pages="pages_count"
      :pending="ajaxLoading" @updQue="updQue"
      :user="user" :cvurl="cvurl" :role="role" :username="username" :surname="surname" :insearch="insearch" :company="company" :isagency="isagency" :jobslist="jobslist" @refresh="refreshjobs" 
      :uid="user_id" :authed="user_id !== -1"
    />
    
    </keep-alive>
    <footer class="main__footer">
      <ul class="footer__ul-top">
        <li>
          <h3>О нас</h3>
          <ul>
            <li><a href="#">Наши вакансии</a></li>
            <li><a href="#">Реклама на сайте</a></li>
          </ul>
        </li>
        <li>
          <h3>Соискателю</h3>
          <ul>
            <li><a href="#">Рассылка вакансий</a></li>
          </ul>
        </li>
        <li>
          <h3>Работодателю</h3>
          <ul>
            <li>
              <router-link @click.native="newJobInit();scrollTop()" v-if="role == 'company'" class="newlinks" to="/addJob">
              {{$t('App.newJobHint')}}
              </router-link>
              <router-link @click.native="newJobInit();scrollTop()" v-else-if="role != 'subscriber'" class="newlinks" to="/registration">
              {{$t('App.newJobHint')}}
              </router-link>
            </li>
          </ul>
        </li>
        <li>
          <h3>Контакты</h3>
          <ul>
            <li><router-link class="headerBtns1 violetBtns footerLinkFB" @click.native="scrollTop()" to="/feedback">{{$t('App.fbBtnLabel')}}</router-link></li>
            <!-- <li><a href="#">info@gmail.com</a></li> -->
          </ul>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
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
    //likedJobs: [],
    //likedJobsList: [],
    ownCVs: [],
    //step: 1, //для uploads
    dismiss: null,
    salMin: "",
    salAvg: "",
    salMax: "",
    tops: [["","",""],["","",""],["","",""],["","",""],["","",""],["","",""]],
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
    if (localStorage.lang) {
      this.$i18n.locale = localStorage.lang
      this.app_lng = localStorage.lang.toUpperCase()
    }
  },
  beforeDestroy() {
    window.removeEventListener("storage", this.onStorageUpdate);
  },
  mounted() {
    if (this.$route.query.login == 1) this.regState = 'login'
    if (this.$route.query.login == 2) this.regState = 'reg'
    if (this.$route.query.verified == 1) this.$q.notify({message: 'Email пользователя верифицирован.', icon: 'warning', color: 'green',timeout: 5000})
    if (this.$route.query.resender == 1) this.$q.notify({message: 'Повторное письмо со ссылкой для активации учетной записи отправлено.', icon: 'warning', color: 'green',timeout: 5000})
    if (this.$route.query.reset == 1) this.$q.notify({message: 'Пароль сброшен. Новый пароль отправлен на вашу почту.', icon: 'warning', color: 'green',timeout: 5000})

    if (localStorage.user) {
      this.user = localStorage.user
    }
    if (localStorage.user_id) {
      this.user_id = Number(localStorage.user_id)
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
    // if (localStorage.likedJobs) {
    //   this.likedJobs = Array(localStorage.likedJobs)
    // }
    if (localStorage.ownCVs) {
      this.ownCVs = Array(localStorage.ownCVs)
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
          //this.likedJobs = []
          this.cvurl = ''
          //this.likedJobsList = []
          this.ownJobs = []
          this.ownCVs = []
        } else if (response.data && response.data[0] && response.data[1] && response.data[2]) {
          this.authIt(response.data)
          
        }
      })
    //need to do these two only depending on the route
    this.refreshjobs('init')
    // this.getFavedFull()
    axios
      .get(config.jobsUrl + '/salStats.json', null, {headers: {'Content-Type' : 'application/json' }})
      .then(response => {
        //console.log('cp51: ', response)
        let salMinTmp = response.data.find(stat=>stat.statname == 'salMin')
        this.salMin = salMinTmp.statvalue + salMinTmp.statcurrency
        let salAvgTmp = response.data.find(stat=>stat.statname == 'salAvg')
        this.salAvg = salAvgTmp.statvalue + salAvgTmp.statcurrency
        let salMaxTmp = response.data.find(stat=>stat.statname == 'salMax')
        this.salMax = salMaxTmp.statvalue + salMaxTmp.statcurrency
        for (let index = 0; index < 6; index++) {
          let tmp = response.data.find(stat=>stat.statname == 'top' + (index + 1))
          this.tops[index][0] = tmp.statlabel
          this.tops[index][1] = tmp.statvalue + tmp.statcurrency
          this.tops[index][2] = tmp.statlink
        }
      })
  },
  methods: {
    // getOwnJobsWrapperRL() {
    //   console.log('cpoo: ', this.$router.currentRoute.name)
    //   console.log('cpoo: ', this.$route.name)
    //   this.getOwnJobs()
    // },
    setLang(lang) {
      localStorage.lang = lang
    },
    authPls() {
      if (this.dismiss != null) this.dismiss()
      this.dismiss = this.$q.notify('Авторизируйтесь для возможности добавления вакансий')
    },
    cvupd(e) {
      this.cvurl = e
    },
    onStorageUpdate(event) {
      if (event.key === "user") {
        this.user = event.newValue;
      } else
      if (event.key === "user_id") {
        this.user_id = Number(event.newValue);
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
      if (event.key === "ownCVs") {
        this.ownCVs = Array(event.newValue);
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
      let jcatOptions = this.$t('App.jcats')
      // let jcatOptions = [
      //   {label: "Не имеет значения", value: 0}, 
      //   {label: "Администрация", value: 1},
      //   {label: "Юристы", value: 2},
      //   {label: "Нефть и газ", value: 3},
      //   {label: "Инженер", value: 4},
      //   {label: "Образование", value: 5},
      //   {label: "Продажи", value: 6},
      //   {label: "Производство", value: 7},
      //   {label: "Строительство", value: 8},
      //   {label: "Недвижимость", value: 9},
      //   {label: "Логистика", value: 10},
      //   {label: "Туризм, гостиницы, рестораны", value: 11},
      //   {label: "Информационные технологии", value: 12},
      //   {label: "Медицина", value: 13},
      //   {label: "Безопасность", value: 14}
      // ]
      let jtypeOptions = this.$t('App.jtypeOptions')
      let expOptions = this.$t('App.expOpts')
      // let jtypeOptions = [
      //   {label: "Постоянная", value: 'c'},
      //   {label: "Временная", value: 'v'}]
      // let expOptions = [
      //   {label: "Не имеет значения", value: -1},
      //   {label: "Без опыта", value: 0},
      //   {label: "от 1 до 3 лет", value: 2}, 
      //   {label: "от 3 до 5 лет", value: 4},
      //   {label: "от 5 лет", value: 6}
      // ]
      let curOpts = this.$t('App.curOpts')
      // let curOpts = [
      //   {label: 'манат', value: 'm'},      
      //   {label: '$', value: '$'},
      // ]
      
      let searched
      
      searched = jcatOptions.find(c => c.value == tmpObj.jcategory)
      if (!searched) searched = jcatOptions[0]
      tmpObj.jcategory = searched

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
    reopenJobById(jid) {
      //console.log('cpcpcp ', jid)
      this.ownJobs.find(val=>val.job_id == jid).is_closed = false
      //console.log(indx)
      let url = config.jobsUrl + '/reopenJobBy.id?jid=' + jid
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
    // getFavedFull() {
    //   let url = config.jobsUrl + '/getFavedFull.json'
    //   this.ajaxLoading = true
    //   axios
    //     .post(url, [], {withCredentials: true,})
    //     .then(response => {
    //       //console.log('getLikedJobs response cp72: ', response.data)
    //       if (response.data) {
    //         if (Array.isArray(response.data)) {
    //           this.likedJobsList = response.data
    //         } else {
    //           this.likedJobsList = []
    //         }
    //       }
    //       this.ajaxLoading = false
    //     })
    // },
    // getLikedJobs() {
    //   let jobsLikedUrl = config.jobsUrl + '/getFaved.json'
    //   this.ajaxLoading = true
    //   axios
    //     .post(jobsLikedUrl, [], {withCredentials: true,})
    //     .then(response => {
    //       //console.log('getLikedJobs response cp72: ', response.data)
    //       if (response.data) {
    //         if (Array.isArray(response.data)) {
    //           this.likedJobs = response.data
    //         } else {
    //           this.likedJobs = []
    //         }
            
    //         //console.log(this.likedJobs)
    //       }
    //       this.ajaxLoading = false
    //     })
    // },
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
      if (this.role == 'subscriber') {
        console.log('app hitOne', id)
        console.log(this.role)
        console.log(this.ownCVs)
      if (!this.cvurl || this.cvurl.length < 5) {
        this.$router.push("/subprofile")
        this.$q.notify(this.$t('App.firstCVNote'))
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
      } else
      if (this.role != 'company') {
        this.$router.push("/registration")
        this.$q.notify({html: true, message: this.$t('App.onlyRegisteredCV')})
        return false
      }
    },
    // favOne(id) {
    //   let favOneUrl
    //   if (!this.likedJobs.includes(id)) {
    //     this.likedJobs.push(id)
    //     favOneUrl = config.jobsUrl + '/favOne.json?jid=' + id
    //   } else {
    //     let index = this.likedJobs.indexOf(id);
    //     if (index !== -1) this.likedJobs.splice(index, 1);
    //     favOneUrl = config.jobsUrl + '/delFavOne.json?jid=' + id
    //   }
    //   this.ajaxLoading = true
    //   axios
    //     .post(favOneUrl, [], {withCredentials: true,})
    //     .then(response => {
    //       //console.log('getOwnJobs response cp61: ', response.status, response.data)
    //       this.ajaxLoading = false
    //     })
    
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
      this.ownJobs = []
      if (token[2] === 'subscriber') {
        this.username = token[3]
        this.surname = token[4]
        this.insearch = token[5]
        //this.likedJobs = token[6]
        this.cvurl = token[7]
        setTimeout(()=>{this.getOwnCVHits()}, 50)
      } else
      if (token[2] === 'company') {
        this.company = token[3]
        this.isagency = token[4]
        //this.likedJobs = []
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
      //this.likedJobs = []
      this.cvurl = ''
      //this.likedJobsList = []
      this.ownJobs = []
      this.ownCVs = []
      //console.log(this.$route)
      
      if (this.$route.name != 'home') this.$router.push("/")
      //this.refreshjobs()
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
        //this.likedJobs = []
        this.cvurl = ''
        //this.likedJobsList = []
        this.ownJobs = []
        this.ownCVs = []
        console.log('cplogout1: ', this.ownCVs)
        axios
          .post(config.jobsUrl + '/out', [], {withCredentials: true})
          .then(response => {
            this.status = 'Вход не выполнен'
            //console.log(this.$route)
            if (this.$route.name != 'home') this.$router.push("/")
            this.refreshjobs()
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
    // likedJobs(newName) {
    //   localStorage.likedJobs = Array(newName)
    // },
    ownCVs(newName) {
      localStorage.ownCVs = Array(newName)
    },
  }
}
</script>


<style lang="stylus">
*
  font-family "Montserrat", sans-serif
  --main-bg-color #fff
  --main-borders-color #2E2768//#3A6E8F
  --btn-color #C00027
  --btn-color1 #D00027
  --violet-btn-color #8645FF
  --violet2 #9955FF
  --color1 #2E2768 //#181059
  --color-graypink #F8F4FF
  --footer-color #EDEEF2
  --logoWidth 180px
  --maxW 1135px
  @media screen and (max-width: 1160px)
    --maxW 100%
body
  background-image url('./../public/assets/bg1.png'), url('./../public/assets/bg2.png'), linear-gradient(180deg, var(--footer-color), var(--footer-color))
  background-repeat no-repeat
  background-size: auto, auto, 100% 200px;
  background-position right top, left 18px bottom, center bottom
  @media screen and (max-width 550px)
    background-size: auto, auto, 100% 300px;
#app
  //calc(50vh - 15px)
  box-sizing border-box
  position relative
  font-family 'Montserrat', sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  font-size 13px
  line-height 14px
  //max-width var(--maxW)
  margin auto
  //padding-bottom 70px
  //border-bottom 1.5px solid red//#E6E6E6
  .header-wrapper
    border-bottom 1.5px solid #E6E6E6
  header
    display flex
    align-items center
    justify-content space-between
    margin 0px auto
    height 115px
    padding 0px
    box-sizing border-box
    max-width var(--maxW)
    @media screen and (max-width 1160px)
      padding 0px 10px
    @media screen and (max-width 950px)
      height 95px
      margin 0px
    @media screen and (max-width 800px)
      height 75px
      padding 0px 5px
    @media screen and (max-width 550px)
      display block
      margin-bottom 20px
    #nav
      display flex
      align-items center
      margin-left auto
      margin-right 15px
      @media screen and (max-width 550px)
        margin-left 0
        margin-right 0
  .lowres__header-right
    display flex
    align-items center
    @media screen and (max-width 550px)
      justify-content center
      
  .r-link
    margin-right 10px
    display block
    border-radius 4px
    color var(--main-borders-color)//purple
    text-decoration none
  h1,h2,h3,h5,h6
    font-size 14px
    line-height 1
  h4
    line-height 1
  // a 
  //   &:visited
  //     color purple
  .logo.router-link-exact-active
    color white
    background-color white//purple
    &:visited
      color white
      background-color white//purple
  .searched
    background-color yellow
  .r-view
    //width 90%
    max-width var(--maxW)
    min-height calc(100vh - 150px - 1.5px - 200px)
    box-sizing border-box
    margin auto
  // .logo
  //   //margin-right 10px
  //   font-weight 700
  //   letter-spacing 2px
  .logoText
    color var(--color1)
    letter-spacing 0.115em
    font-size 34px
    font-weight bold
    font-family 'Montserrat', serif
    line-height 123.4%
    @media screen and (max-width 800px)
      letter-spacing 0.01em
  .logolink
    margin-right 10px
    text-decoration none
    @media screen and (max-width: 550px)
      // font-size 24px
      // margin-right 2px
      margin 5px auto
      display block
  .headerBtns1
    padding 0 5px
    white-space nowrap
    background-color: var(--btn-color);
    font-weight: bold;
    align-self:flex-start;
    border-radius 10px
    height 40px
    transition-duration 0.3s
    @media screen and (max-width 800px)
      height 40px
      padding 0
      white-space normal
      max-width 120px
    div
      font-family 'Montserrat', sans-serif !important
      font-size 14px !important
      line-height 17px !important
      @media screen and (max-width 800px)
        line-height 1 !important
        //max-height 30px
        padding 0 5px
      div
        @media screen and (max-width 800px)
          //max-height 24px
          padding 0
  .headerBtnRed
    &:hover
      background-color var(--btn-color1) !important
    @media screen and (max-width: 550px)
      // font-size 12px
      // padding 0 !important
      // white-space normal
      // height 36px
      // line-height 14px
      // div
      //   padding 0 !important
      //   width 82px
  .violetBtns
    padding 0 3px
    margin-left 15px
    @media screen and (max-width 800px)
      margin-left 10px
      padding 0 6px
    @media screen and (max-width: 550px)
      // font-size 16px
      // line-height 36px
      // height 36px
      // padding 0 !important
      // margin-right 0
      // div
      //   width 55px
      // div div
      //   margin-top -3px
  .scrollTopBtn
    position fixed
    bottom 12px
    left 40px
    opacity 0.7
    z-index 3
  .main__footer
    display flex
    justify-content flex-end
    margin 0 auto
    margin-top 20px
    padding-top 30px
    box-sizing border-box
    height 200px
    max-width var(--maxW)
    padding 30px 200px 12px 100px
    @media screen and (max-width 950px)
      padding 25px 75px 12px 50px
    @media screen and (max-width 800px)
      padding 20px 15px 12px 15px
    @media screen and (max-width 550px)
      height auto
    .footer__ul-top
      display flex
      list-style-type none
      padding 0
      margin 0
      width 100%
      justify-content space-between
      @media screen and (max-width 550px)
        flex-wrap wrap
      h3
        text-decoration none
        font-family: Montserrat, sans-serif
        font-weight bold
        font-size: 12px;
        line-height: 15px;
        color var(--color1)
        margin 0
        margin-bottom 15px
        @media screen and (max-width 800px)
          margin-bottom 10px
      li
        padding 0
        margin 0
        text-align left
        max-width 20%
        @media screen and (max-width 800px)
          max-width 26%
        @media screen and (max-width 550px)
          display inline-block
          max-width 50%
          margin-bottom 12px
        ul
          list-style-type none
          width 100%
          padding 0
          margin 0
          li
            max-width 100%
            margin 3px 0
            a
              width 100%
              text-decoration none
              font-family: Montserrat, sans-serif
              font-size: 12px;
              line-height: 15px;
              color var(--color1)
              &:hover
                color var(--violet-btn-color)
        &:last-child li a
          font-weight bold
  .langLink
    border 0
    background-color transparent
    color var(--color1)
    //width 30px
    cursor pointer
    font-family: Montserrat, sans-serif;
    font-style normal
    font-weight 500
    font-weight 500
    font-size 14px
    line-height 17px
    margin-left 30px
    @media screen and (max-width 800px)
      margin-left 20px
    // &:hover
    //   color var(--btn-color)
  .user-status-bar
    display flex
    align-items center
  .headerBtn
    text-decoration none
    color var(--main-borders-color)
    font-size 16px
    background-color transparent
    text-transform uppercase
    //border 2px solid transparent
    //transition-duration .4s
    //padding 4px
    margin 0 2px
    border-radius 4px
    padding-right 0px
    letter-spacing 2px
    font-weight 700
    &:hover
      color var(--violet-btn-color)//var(--btn-color)
.marginLeft30pxOnBig
  margin-left 30px
  @media screen and (max-width 550px)
    margin-left 0px
.multipleUploadsHeader
  margin-right 5px
  transition-duration 0.25s
  &:hover
    color var(--violet-btn-color)
  @media screen and (max-width 550px)
    margin-right 0px
.footerLinkFB
  background-color: var(--violet-btn-color) !important
  color: white !important
  height: 32px !important
  line-height: 32px !important
  padding 0 5px !important
  text-align: center;
  display: inline-block;
  margin: 0 !important
  text-transform uppercase
  &:hover
    background-color var(--violet2) !important

.nav-icon
  @media screen and (max-width 550px)
    font-size 30px !important
.nav-icon-logout
  @media screen and (max-width 550px)
    font-size 26px !important

</style>