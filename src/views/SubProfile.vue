<template>
  <div v-if="role === 'subscriber'" class="subprofile">
    <div class="subprofile__inner">
      <ProfileNav
        :localRoute="tab"
        @setLocalRoute="setLocalRoute"
        :localroutes="[{r: 'cv', l: $t('sub.navCV')}, {r: 'sentCVS', l: $t('sub.navSentCVs')}, {r: 'personal', l: $t('sub.navPersonal')}]"
        :localroutesX="{r: 'settings', l: $t('sub.navSettings')}"
      />
      <q-tab-panels
        class="qtpans"
        v-model="tab"
        animated
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel name="cv" class="subprofile__cv">
          <!-- <div class="urlpanel" style="margin-bottom: 10px">
            Текущая ссылка на резюме <a :href="'https://docs.google.com/viewerng/viewer?url=' + cvurl" target="_blank">{{cvurl}}</a>
          </div> -->
          
          <div class="urlpanel" style="margin-bottom: 10px">
            {{(cvurl != null && cvurl != '') ? $t('sub.cvurlUploaded') : $t('sub.cvurlNone')}}
            <a v-if="cvurl != null && cvurl != ''" :href="'https://docs.google.com/viewerng/viewer?url=' + cvurl" target="_blank">
              <q-icon color="blue-10" size="30px" name="assignment">
              </q-icon>
            </a>
          </div>
          <form action="" ref="cvForm">
            {{$t('sub.loadCVHeader')}}
            <q-input
              id="fileinput1"
              @input="cvinput"
              style="width: 300px"
              outlined dense
              square
              color="cyan-10"
              type="file"
              hint=""
              accept=".doc, .docx, .pdf, .rtf"
              ref="cvUploader"
            />
          </form>
          <q-btn v-if="cvurl != ''" color="red-10" :label="$t('sub.deleteCVBtn')" @click="cvdel" />
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
        <q-tab-panel class="subprofile__settings" name="personal">
          <!-- <q-checkbox
            :label="userdata.insearch === true ? 'Я ищу работу' : 'Я не ищу работу'"
            
            v-model="userdata.insearch"
          /> -->
          <!-- <p>Добавить контакты</p>
          <q-input dense class="subprofile__inp" outlined bottom-slots v-model="contacts1" label="Контакты" counter maxlength="30"/>
          <q-input dense v-show="contacts_count > 1" class="subprofile__inp" outlined bottom-slots v-model="contacts2" label="Контакты" counter maxlength="30"/>
          <q-input dense v-show="contacts_count > 2" class="subprofile__inp" outlined bottom-slots v-model="contacts3" label="Контакты" counter maxlength="30"/>
          <q-btn round color="primary" @click="contacts_count < 4 ? contacts_count += 1 : ''" size="sm" icon="add" :disable="contacts_count > 2"/> -->
          
          <q-input
            class="subprofile__inp"
            color="cyan-10"
            square outlined bottom-slots 
            v-model="userdata.username" :label="$t('sub.name')"
            counter maxlength="35"  />
          <q-input
            class="subprofile__inp"
            color="cyan-10"
            square outlined bottom-slots
            v-model="userdata.surname" :label="$t('sub.surname')"
            counter maxlength="35"  />
          <q-btn color="red-10" @click="tryChangeUData" :label="$t('sub.change')"/>
        </q-tab-panel>


        <q-tab-panel class="subprofile__settings" name="settings">
          <q-input
            type="email" class="subprofile__inp" 
            square outlined bottom-slots
            color="cyan-10"
            :value="user"
            :label="$t('sub.email')"
            counter maxlength="50"
          />
          <q-input square color="cyan-10" :type="isPwd ? 'password' : 'text'" class="subprofile__inp" outlined bottom-slots v-model="mailpw.oldpw" :label="$t('sub.oldPW')" counter maxlength="25" >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input 
            square color="cyan-10" 
            :type="isPwd ? 'password' : 'text'" 
            class="subprofile__inp" outlined bottom-slots 
            v-model="mailpw.newpw" :label="$t('sub.newPW')" counter maxlength="25" >
          </q-input>
          <q-btn color="red-10" @click="tryChangePw" :label="$t('sub.change')"/>
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
    // likedJobs: {type: Array, default: ()=>[]},
    // likedJobsList: {type: Array, default: ()=>[]},
    username: {type: String, default: ''},
    surname: {type: String, default: ''},
    insearch: {type: Boolean, default: false},
    role: String,
    cvurl: {type: String, default: ''},
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
            //console.log(response.data.rows)
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
            //console.log(response.data.jobs)
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
            this.$q.notify(this.$t('sub.dataChanged'))
            this.$emit('cvupd', this.cvurlnew)
          } else this.$q.notify(this.$t('sub.dataError'))
          this.cvurlnew = ''
          //if error, show like popup or status update
      })
    },
    cvdel() {
      let url = config.jobsUrl + '/cvdelete.json'
      axios
        .post(url, null, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
        .then(response => {
          if (response.data == 'OK') {
            this.$q.notify(this.$t('sub.cvDeleted'))
            this.$emit('cvupd', '')
          } else this.$q.notify(this.$t('sub.dataError'))
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
              this.cv_upload_error = this.$t('sub.cvTooBig')
              this.$q.notify(this.$t('sub.cvTooBig'))
            } else {
              this.cv_upload_error = this.$t('sub.dataError')
              this.$q.notify(this.$t('sub.dataError'))
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
            this.$q.notify(this.$t('sub.dataChanged'))
          }
          else this.$q.notify(this.$t('sub.wrongData'))
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
            this.$q.notify(this.$t('sub.pwChanged'))
          }
          else this.$q.notify(this.$t('sub.wrongData'))
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
  box-shadow 0 0 4px 1px var(--main-borders-color)
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
