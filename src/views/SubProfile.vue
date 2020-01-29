<template>
  <div v-if="role === 'subscriber'" class="subprofile">
    <div class="subprofile__inner">
      <ProfileNav
        :localRoute="tab"
        @setLocalRoute="setLocalRoute"
        :localroutes="[{r: 'cv', l: 'Резюме'}, {r: 'invitations', l: 'Приглашения'}, {r: 'starred', l: 'Избранные вакансии'}, {r: 'personal', l: 'Личные данные'}]"
        :localroutesX="{r: 'settings', l: 'Изменить пароль'}"
      />
      <q-tab-panels
        class="qtpans"
        v-model="tab"
        animated
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel name="cv" class="subprofile__cv">
          <button>Загрузить резюме</button>
          <button disabled="true">Отправить на сервер</button>
        </q-tab-panel>
        <q-tab-panel name="invitations">
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
          <!-- <p v-for="faved in likedJobsList" :key="faved.job_id">{{faved}}</p> -->
        </q-tab-panel>
        <q-tab-panel class="subprofile__settings" name="personal">
          <q-checkbox
            :label="insearch === true ? 'Я ищу работу' : 'Я не ищу работу'"
            
            :value="insearch"
          />
          <!-- <p>Добавить контакты</p>
          <q-input dense class="subprofile__inp" outlined bottom-slots v-model="contacts1" label="Контакты" counter maxlength="30"/>
          <q-input dense v-show="contacts_count > 1" class="subprofile__inp" outlined bottom-slots v-model="contacts2" label="Контакты" counter maxlength="30"/>
          <q-input dense v-show="contacts_count > 2" class="subprofile__inp" outlined bottom-slots v-model="contacts3" label="Контакты" counter maxlength="30"/>
          <q-btn round color="primary" @click="contacts_count < 4 ? contacts_count += 1 : ''" size="sm" icon="add" :disable="contacts_count > 2"/> -->
          
          <q-input
            class="subprofile__inp"
            outlined bottom-slots 
            v-model="mailpw.username" label="Имя" counter maxlength="60"  />
          <q-input class="subprofile__inp" outlined bottom-slots :value="surname" label="Фамилия" counter maxlength="60"  />
          <q-btn color="primary" label="Изменить"/>
        </q-tab-panel>
        <q-tab-panel class="subprofile__settings" name="settings">
          <q-input type="email" class="subprofile__inp" 
            outlined bottom-slots v-model="mailpw.oldemail" label="Email" counter maxlength="50"  />
          <q-input :type="isPwd ? 'password' : 'text'" class="subprofile__inp" outlined bottom-slots v-model="mailpw.oldpw" label="Пароль" counter maxlength="25" >
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
            v-model="mailpw.newpw" label="Пароль" counter maxlength="25" >
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
import ProfileNav from '@/components/molecules/ProfileNav.vue'

import axios from 'axios'
const config = require('./../configs/main_config')

export default {
  name: 'SubProfile',
  props: {
    likedJobs: {type: Array, default: ()=>[]},
    likedJobsList: {type: Array, default: ()=>[]},
    username: {type: String, default: ''},
    surname: {type: String, default: ''},
    insearch: {type: Boolean, default: false},
    role: String
  },
  data: ()=>{return {
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
      oldemail: '',
      newpw: '',
      oldpw: ''
    },
    isPwd: true,
    tab: 'settings'
  }},
  components: {
    JobsList,
    ProfileNav
  },
  deactivated() {
    //this is router hook right?
    this.$destroy()
  },
  methods: {
    clearData(){
      Object.assign(this.$data, this.$options.data())
    },
    tryChangePw() {
      let url = config.jobsUrl + '/changepw'
      let udata = { oldmail: this.mailpw.oldemail, oldpw: this.mailpw.oldpw, newpw: this.mailpw.newpw }
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
      // if (rou == 'cabout') {
      //   this.logo_upload_error = null
      //   this.getOwnCompanyData()
      // }
      this.tab = rou
    },
    favOne(id) {
      this.$emit('favOne', id)
    }
  },
  mounted(){
    this.newusername = this.username
    this.newsurname = this.surname
  },
  watch: {
    username(newu) {
      this.newusername = newu
    },
    surname(news) {
      this.newsurname = news
    },
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
