<template>
  <div v-if="role === 'subscriber'" class="subprofile">
    <div class="subprofile__inner">
      <ProfileNav
        :localRoute="tab"
        @setLocalRoute="setLocalRoute"
        :localroutes="[{r: 'cv', l: 'Резюме'}, {r: 'sentCVS', l: 'Поданные резюме'}, {r: 'starred', l: 'Избранные вакансии'}, {r: 'personal', l: 'Личные данные'}]"
        :localroutesX="{r: 'settings', l: 'Настройки'}"
      />
      <q-tab-panels
        class="qtpans"
        v-model="tab"
        animated
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel name="cv" class="subprofile__cv">
          <div class="urlpanel" style="margin-bottom: 10px">
            Текущая ссылка на резюме <a :href="'https://docs.google.com/viewerng/viewer?url=' + cvurl" target="_blank">{{cvurl}}</a>
          </div>
          <form action="" ref="cvForm">
            <q-input
              id="fileinput1"
              @input="cvinput"
              style="width: 300px"
              outlined dense
              type="file"
              hint=""
              accept=".doc, .docx, .pdf, .rtf"
              ref="cvUploader"
            />
          </form>
          <!-- <q-btn
            @click="updateCVLink"
            style="marginBottom: 22px" dense color="primary"
            v-if="cvurlnew != ''"
          >
            Обновить ссылку
          </q-btn> -->
        </q-tab-panel>
        <q-tab-panel name="sentCVS">
          <HitsList
            :cvhitsHistory="cvhitsHistory"
          />
        </q-tab-panel>
        <q-tab-panel name="starred">
          <q-btn-toggle
            v-if="likedJobs.length > 0"
            v-model="lenses"
            toggle-color="primary"
            size="sm"
            dense
            :options="[ {value: 'short', icon: 'list'},
                        {value: 'full', icon: 'code'},]"
          />
          <JobsList
            :showLiked="role === 'subscriber'"
            :likedJobs="likedJobs"
            @favOne="favOne"
            :lenses="lenses"
            :jobslist="likedJobsList"
          />
        </q-tab-panel>
        <q-tab-panel class="subprofile__settings" name="personal">
          <q-checkbox
            :label="userdata.insearch === true ? 'Я ищу работу' : 'Я не ищу работу'"
            
            v-model="userdata.insearch"
          />
          <!-- <p>Добавить контакты</p>
          <q-input dense class="subprofile__inp" outlined bottom-slots v-model="contacts1" label="Контакты" counter maxlength="30"/>
          <q-input dense v-show="contacts_count > 1" class="subprofile__inp" outlined bottom-slots v-model="contacts2" label="Контакты" counter maxlength="30"/>
          <q-input dense v-show="contacts_count > 2" class="subprofile__inp" outlined bottom-slots v-model="contacts3" label="Контакты" counter maxlength="30"/>
          <q-btn round color="primary" @click="contacts_count < 4 ? contacts_count += 1 : ''" size="sm" icon="add" :disable="contacts_count > 2"/> -->
          
          <q-input
            class="subprofile__inp"
            outlined bottom-slots 
            v-model="userdata.username" label="Имя"
            counter maxlength="35"  />
          <q-input class="subprofile__inp" outlined bottom-slots
            v-model="userdata.surname" label="Фамилия"
            counter maxlength="35"  />
          <q-btn color="primary" @click="tryChangeUData" label="Изменить"/>
        </q-tab-panel>


        <q-tab-panel class="subprofile__settings" name="settings">
          <q-input type="email" class="subprofile__inp" 
            outlined bottom-slots :value="user" label="Email" counter maxlength="50"  />
          <q-input :type="isPwd ? 'password' : 'text'" class="subprofile__inp" outlined bottom-slots v-model="mailpw.oldpw" label="Старый пароль" counter maxlength="25" >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input 
            :type="isPwd ? 'password' : 'text'" 
            class="subprofile__inp" outlined bottom-slots 
            v-model="mailpw.newpw" label="Новый пароль" counter maxlength="25" >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-btn color="primary" @click="tryChangePw" label="Изменить"/>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import JobsList from '@/components/organisms/JobsList.vue'
import HitsList from '@/components/organisms/HitsList.vue'
import ProfileNav from '@/components/molecules/ProfileNav.vue'

import axios from 'axios'
const config = require('./../configs/main_config')

export default {
  name: 'SubProfile',
  props: {
    ownCVs: {type: Array, default: ()=>[]},
    likedJobs: {type: Array, default: ()=>[]},
    likedJobsList: {type: Array, default: ()=>[]},
    username: {type: String, default: ''},
    surname: {type: String, default: ''},
    insearch: {type: Boolean, default: false},
    role: String,
    cvurl: String,
    user: String,
  },
  data: ()=>{return {
    cvhitsHistory: [],
    sentCVJobsList: [],
    cvfile: null,
    cvurlnew: '',
    cv_upload_error: '',
    lenses: 'full',
    contacts1: '',
    contacts2: '',
    contacts3: '',
    contacts_count: 1,
    userdata: {
      username: '',
      surname: '',
      insearch: false
    },
    mailpw: {
      // oldemail: '', - заменено на user props из app
      newpw: '',
      oldpw: ''
    },
    isPwd: true,
    tab: 'cv'
  }},
  components: {
    JobsList,
    HitsList,
    ProfileNav
  },
  deactivated() {
    //this is router hook right?
    this.$destroy()
  },
  methods: {
    getCVHitsHistory() {
      let url = config.jobsUrl + '/getcvhitshistory'
      axios
        .post(url, null, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
        .then(response => {
          if (response.data && response.data.rows) {
            this.cvhitsHistory = response.data.rows
            console.log(response.data.rows)
            //this.$q.notify('Данные изменены')
            //this.$emit('cvupd', this.cvurlnew)
          } else console.log('cp124 - ошибка cvhitsHistory')
          
          //if error, show like popup or status update
      })
    },
    getSentCVJobs() {
      //let sentCVJobsList = []
      let url = config.jobsUrl + '/getcvedjobs'
      axios
        .post(url, null, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
        .then(response => {
          if (response.data && response.data.jobs) {
            this.sentCVJobsList = response.data.jobs
            console.log(response.data.jobs)
            //this.$q.notify('Данные изменены')
            //this.$emit('cvupd', this.cvurlnew)
          } else console.log('cp123 - ошибка getsentcvjobs')
          
          //if error, show like popup or status update
      })
    },
    updateCVLink() {
      let url = config.jobsUrl + '/cvupdate.json'
      axios
        .post(url, {cvurl: this.cvurlnew}, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
        .then(response => {
          if (response.data == 'OK') {
            this.$q.notify('Данные изменены')
            this.$emit('cvupd', this.cvurlnew)
          } else this.$q.notify('Ошибка')
          this.cvurlnew = ''
          //if error, show like popup or status update
      })
    },
    cvinput(val) {
      //console.log('11', val)
      this.cvfile = val[0]
      this.uploadCV()
    },
    uploadCV() {
      let dumper = 'https://decreed-silk.000webhostapp.com/cvu.php'
      //logoUploader
      console.log('start cvu')
      var formData = new FormData()
      formData.append("cv", this.cvfile)
      this.$refs.cvForm.reset()
      this.cvfile = null
      axios
        .post(dumper, formData, {
          headers: {'Content-Type': 'multipart/form-data'}
        })
        .then(resp => {
          //console.log('cp219: ', resp)
          //console.log('end uploa')
          if (resp.data && resp.data.startsWith('link:')) {
            this.logo_upload_error = null
            this.cvurlnew = resp.data.replace('link:', '')
            //this.$q.notify('Резюме загружено')
            this.updateCVLink()
          } else {
            console.log('error cv uploading: ', resp.data)
            if (resp.data.startsWith('Error in file size')) {
              this.cv_upload_error = 'Резюме больше 100кб'
              this.$q.notify('Резюме больше 100кб')
            } else {
              this.cv_upload_error = 'Ошибка'
              this.$q.notify('Ошибка')
            }
          }
          //if (response.data === 'OK') {} else 
        })
    },
    // clearData(){
    //   Object.assign(this.$data, this.$options.data())
    // },
    tryChangeUData() {
      let url = config.jobsUrl + '/changeuserstuff'
      let udata = this.userdata
      
      axios
        .post(url, udata, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
        .then(response => {
          console.log('tryChangeUData', response.data)
          if (response.data == 'OK') {
            this.$emit('changeUDataSub', udata)
            this.$q.notify('Данные изменены')
          }
          else this.$q.notify('Неправильные данные')
          //if ok show like compnenet
          //reset fields
          //error like validation
      })
    },
    tryChangePw() {
      let url = config.jobsUrl + '/changepw'
      let udata = { oldmail: this.user, oldpw: this.mailpw.oldpw, newpw: this.mailpw.newpw }
      axios
        .post(url, udata, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
        .then(response => {
          console.log('trychpw', response.data)
          if (response.data == 'OK') {
            this.$q.notify('Пароль изменен')
          }
          else this.$q.notify('Неправильные данные')
          //if ok show like compnenet
          //reset fields
          //error like validation
      })
    },
    setLocalRoute(rou) {
      if (rou == 'personal') {
        this.userdata.username = this.username
        this.userdata.surname = this.surname
        this.userdata.insearch = this.insearch
      } else
      if (rou == 'sentCVS') {
        //do axious shiet to get the listOfSentJobs
        this.getCVHitsHistory()
      }
      
      this.tab = rou
    },
    favOne(id) {
      this.$emit('favOne', id)
    }
  },
  mounted(){
    //console.log('cp11: ', this.insearch)
    this.userdata.username = this.username
    this.userdata.surname = this.surname
    this.userdata.insearch = this.insearch
    //this.cvurlnew = this.cvurl
  },
  watch: {
    username(newu) {
      this.newusername = newu
    },
    surname(news) {
      this.newsurname = news
    },
    // cvurl(newu) {
    //   this.cvurlnew = newu
    // }
    // username(newu) {
    //   this.newusername = newu
    // },
  }
}
</script>

<style scoped lang="stylus">
.qtpans
  width 100%
  min-height 75vh
  border 1px solid #eee
  border-radius 4px
.subprofile
  max-width 900px
  padding 0 10px
  padding-top 10px
  display flex
  flex-direction column
  justify-content center
  p
    margin-bottom 15px
  &__inner
    display flex
  &__inp
    width 300px
  &__header
    display flex
    justify-content flex-end
  .tabs
    // border-top-left-radius 15px
    // border-top-right-radius 15px
    justify-content center
    animation-duration 0.3s
    transition-duration 0.3s
  .subprofile__cv
    //background-color #eee
    display flex
    flex-direction column
    align-items flex-start
  .subprofile__settings
    //background-color #eee
    display flex
    flex-direction column
    align-items flex-start
  .anim1
    animation-duration 0.3s
    transition-duration 0.3s
  *
    margin 0
</style>
