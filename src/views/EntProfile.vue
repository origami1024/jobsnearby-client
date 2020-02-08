<template>
  <div v-if="role === 'company'" class="entprofile">
    <div class="entprofile__inner">
      <ProfileNav
        :localRoute="tab"
        @setLocalRoute="setLocalRoute"
        :localroutes="[{r: 'published', l: $t('entProfile.navPublishedLabel')}, {r: 'responses', l: $t('entProfile.navResponsesLabel')}, {r: 'cabout', l: $t('entProfile.navAboutLabel')}]"
        :localroutesX="{r: 'settings', l: $t('entProfile.navSettingsLabel')}"
      />
      <q-tab-panels
        class="qtpans"
        @before-transition="changeTabs"
        v-model="tab"
        animated
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel name="published" class="entprofile__published entprofile__mid">
          <h4 class="entprofile__header">{{$t('entProfile.publishedHeader')}}({{ownJobs.length}}):</h4>
          <JobsStats @reopenJob="reopenJob" @editJob="editJob" @closeJob="closeJob" @delJob="delJob" :jobslist="ownJobs"/>
        </q-tab-panel>
        <q-tab-panel name="responses" class="entprofile__mid" style="display: flex">
          <div class="line" style="width: 100%;">
            <q-expansion-item
              v-for="item in Object.keys(respsJreformat)"
              :key="item"
              default-opened
              style="line-height: 30px; font-size: 16px;text-align:left;"
            >
              <template v-slot:header>
                <a :href="'/jobpage?id=' + item" target="_blank">
                  {{resps.find(val=>val.cvjob_id == item).title}}
                  <!-- resps.find(val=>val.cvjob_id == item).cv_url -->
                </a>
                ({{respsJreformat[item].cvhits.length}})
              </template>
              
              <ul style="list-style-type:none">
                <li v-for="hit in respsJreformat[item].cvhits" :key="hit">
                  <q-item clickable>
                  <a @click="viewHit(hit)" :href="'https://docs.google.com/viewerng/viewer?url=' + resps.find(val=>val.cvhit_id == hit).cv_url" target="_blank">
                    {{
                      resps.find(val=>val.cvhit_id == hit).name + ' ' + 
                      resps.find(val=>val.cvhit_id == hit).surname
                    }}
                    <!-- :href="resps.find(val=>val.cvhit_id == hit).cv_url" -->
                  </a>
                    {{
                      'Подано: ' +
                      formatDate(resps.find(val=>val.cvhit_id == hit).date_created)
                      + '.'
                    }}
                    {{
                      resps.find(val=>val.cvhit_id == hit).date_checked != null
                        ? 'Просмотрено: ' + formatDate(resps.find(val=>val.cvhit_id == hit).date_checked)
                        : 'Просмотрено: нет'
                    }}
                    <q-btn
                      style="margin-left: 5px"
                      v-if="resps.find(val=>val.cvhit_id == hit).date_checked == null"
                      round
                      color="primary"
                      size="sm"
                      icon="visibility"
                      @click="viewHit(hit)"
                    />
                    </q-item>
                </li>
              </ul>
              
            </q-expansion-item>
          </div>
        </q-tab-panel>
        <q-tab-panel name="cabout" class="entprofile__mid">
          <q-input class="entprofile__inp" dense outlined bottom-slots v-model="cabout.company" placeholder="Название компании" counter maxlength="80"/>
          <div class="line" dense style="display: flex; width: 100%; justify-content: space-between;">
            <form action="" ref="uplForm">
              <label
                for="fileinput1"
                class="entprofile__inp"
                style="display: block; marginBottom: 6px;"
                :style="{color: logo_upload_error != null ? '#c10015' : 'inherit'}"
              >
                {{logo_upload_error ? logo_upload_error : 'Путь к лого: ' + cabout.logo_url}}
              </label>
              <!-- white-space: nowrap; max-width: 300px; overflow: hidden; text-overflow: ellipsis; -->
              <q-input
                id="fileinput1"
                @input="val => { logofile = val[0] }"
                style="width: 300px"
                outlined dense
                type="file"
                hint=""
                accept=".jpg, .png, .svg"
                ref="logoUploader"
              />
            </form>
            <q-btn @click="uploadLogo" style="marginBottom: 22px" dense color="primary" v-if="logofile != null">Загрузить</q-btn>
            <div class="logo-placeholder" :style="{'background-image': 'url(' + cabout.logo_url + ')'}" >{{cabout.logo_url == '' || !cabout.logo_url ? 'logo placeholder' : ''}}</div>
            <!-- v-if="cabout.logo_url == ''" -->
            <!-- <img v-else :src="cabout.logo_url" alt="Лого"> -->
          </div>
          <q-select
              multiple
              use-chips
              dense
              outlined
              placeholder="Сфера деятельности"
              bg-color="white"
              :style="{width: '100%'}"
              max-values="3"
              v-model="cabout.domains"
              :options="domainsAll"
              :hint="null"
            />
          <q-input dense class="entprofile__inp" outlined v-model="cabout.website" placeholder="Сайт" counter maxlength="80"/>
          <q-input
            v-model="cabout.full_description"
            outlined dense
            placeholder="Описание"
            type="textarea"
            counter maxlength="2000"
          />
          <q-btn @click="updateCompanyData" color="primary" style="margin-top: 10px">Отправить изменения</q-btn>
        </q-tab-panel>
        <q-tab-panel class="entprofile__settings entprofile__mid" name="settings">
          <h3 style="width: 100%; marginBottom: 10px; text-align: center;">Компания <strong>{{company}}</strong></h3>
          
          <!-- <p>Добавить контакты</p>
          <q-input dense class="entprofile__inp" outlined bottom-slots v-model="contacts1" label="Контакты" counter maxlength="30"/>
          <q-input dense v-show="contacts_count > 1" class="entprofile__inp" outlined bottom-slots v-model="contacts2" label="Контакты" counter maxlength="30"/>
          <q-input dense v-show="contacts_count > 2" class="entprofile__inp" outlined bottom-slots v-model="contacts3" label="Контакты" counter maxlength="30"/>
          <q-btn round color="primary" @click="contacts_count < 4 ? contacts_count += 1 : ''" size="sm" icon="add" :disable="contacts_count > 2"/> -->
          <!-- <q-toggle v-model="editable" label="Изменить личные данные"/> -->
          <q-input type="email" class="entprofile__inp" outlined bottom-slots :value="user" label="Email" counter maxlength="50" />
          <q-input :type="isPwd ? 'password' : 'text'" class="entprofile__inp" outlined bottom-slots v-model="oldpw" label="Старый пароль" counter maxlength="25">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input :type="isPwd ? 'password' : 'text'" class="entprofile__inp" outlined bottom-slots v-model="newpw" label="Новый пароль" counter maxlength="25">
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
import JobsStats from '@/components/organisms/JobsStats.vue'
import ProfileNav from '@/components/molecules/ProfileNav.vue'

import axios from 'axios'

let domainsAll = ["Автомобильный бизнес", "Гостиницы, рестораны, общепит, кейтеринг", "Государственные организации", "Добывающая отрасль", "ЖКХ", "Информационные технологии, системная интеграция, интернет", "Искусство, культура", "Лесная промышленность, деревообработка", "Медицина, фармацевтика, аптеки", "Металлургия, металлообработка", "Нефть и газ", "Образовательные учреждения", "Общественная деятельность, партии, благотворительность, НКО", "Перевозки, логистика, склад, ВЭД", "Продукты питания", "Промышленное оборудование, техника, станки и комплектующие", "Розничная торговля", "СМИ, маркетинг, реклама, BTL, PR, дизайн", "Сельское хозяйство", "Строительство, эксплуатация, проектирование", "Недвижимость", "Телекоммуникации, связь", "Товары народного потребления (непищевые)", "Тяжелое машиностроение", "Управление многопрофильными активами", "Услуги для бизнеса", "Услуги для населения", "Финансовый сектор", "Химическое производство, удобрения", "Электроника, приборостроение, бытовая техника, компьютеры и оргтехника", "Энергетика"]
const config = require('./../configs/main_config')

export default {
  name: 'EntProfile',
  props: {
    ownJobs: Array,
    company: {type: String, default: ''},
    role: String,
    user: String,
  },
  data: ()=>{return {
    respsJreformat: [],
    resps: [],
    logo_upload_error: null,
    logofile: null,
    cabout: {
      company: '',
      logo_url: '',
      domains: [], //3max
      website: '',
      full_description: ''
    },
    domainsAll: domainsAll,
    lenses: 'full',
    contacts1: '',
    contacts2: '',
    contacts3: '',
    contacts_count: 1,
    newcompany: '',
    newsurname: '',
    // oldemail: '',
    oldpw: '',
    newpw: '',
    isPwd: true,
    tab: 'published',
    editable: false,
    from: null
  }},
  components: {
    JobsStats,
    ProfileNav
  },
  deactivated() {
    //this is router hook right?
    this.$destroy()
  },
  methods: {
    viewHit(hit) {
      console.log(hit)
      if (this.resps.find(val=>val.cvhit_id == hit).date_checked == null) {
        let url = config.jobsUrl + '/viewhit'
        axios
          .post(url, [hit], {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
          .then(response => {
            //console.log('viewHit', response.data)
            if (response.data == 'OK') {
              this.resps.find(val=>val.cvhit_id == hit).date_checked = Date.now()
              //this.$q.notify('Пароль изменен')
            }
            // else this.$q.notify('Неправильные данные')
        })
      } else console.log('trying to hit second time')
    },
    formatDate(e) {
      let d = new Date(e)
      return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear()
    },
    getResps() {
      let url = config.jobsUrl + '/getresps'
      axios
        .post(url, null, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
        .then(response => {
          if (response.data && response.data.rows) {
            //console.log('getResps', response.data.rows)
            this.resps = response.data.rows
            let dic1 = { 
            }
            for (let x of response.data.rows) {
              dic1[x.cvjob_id] = {}
              dic1[x.cvjob_id]['cvhits'] = []
            }
            //console.log(response.data.rows)
            for (let x of response.data.rows) {
              dic1[x.cvjob_id]['cvhits'].push(x.cvhit_id)
              //console.log(x.cvhit_id)
            }
            this.respsJreformat = dic1

            //console.log(response.data.rows)
          }
          
          //this.$q.notify('Ошибка чот')
      })
    },
    tryChangePw() {
      let url = config.jobsUrl + '/changepw'
      let udata = { oldmail: this.user, oldpw: this.oldpw, newpw: this.newpw }
      axios
        .post(url, udata, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
        .then(response => {
          //console.log('trychpw', response.data)
          if (response.data == 'OK') {
            this.$q.notify('Пароль изменен')
          }
          else this.$q.notify('Неправильные данные')
          //if ok show like compnenet
          //reset fields
          //error like validation
      })
    },
    updateCompanyData() {
      let url = config.jobsUrl + '/companyUpdate.json'
      axios
        .post(url, this.cabout, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
        .then(response => {
          if (response.data == 'OK') {
            this.$q.notify('Данные изменены')
          } else this.$q.notify('Ошибка')
          //if error, show like popup or status update
      })
    },
    getOwnCompanyData() {
      let url = config.jobsUrl + '/ownCompany.json'
      axios
        .post(url, [], {withCredentials: true,})
        .then(response => {
          console.log('getOwnCompany ajax req cp')
        
          if (response.data && response.data.company) {
            this.cabout = response.data
          } 
      })
    },
    uploadLogo() {
      let dumper = 'https://decreed-silk.000webhostapp.com/outer.php'
      //logoUploader
      console.log('start uploa')
      var formData = new FormData()
      formData.append("image", this.logofile)
      this.$refs.uplForm.reset()
      this.logofile = null
      axios
        .post(dumper, formData, {
          headers: {'Content-Type': 'multipart/form-data'}
        })
        .then(resp => {
          //console.log('cp219: ', resp)
          //console.log('end uploa')
          if (resp.data && resp.data.startsWith('link:')) {
            this.logo_upload_error = null
            this.cabout.logo_url = resp.data.replace('link:', '')
            this.$q.notify('Изображение загружено')
          } else {
            console.log('error uploading: ', resp.data)
            if (resp.data.startsWith('Error in file size')) {
              this.logo_upload_error = 'Картинка больше 100кб'
              this.$q.notify('Картинка больше 100кб')
            }
          }
          //if (response.data === 'OK') {} else 
        })
    },
    changeTabs(newT) {
      //if (newT == 'published') this.$emit('getOwnJobs')
      newT != 'published' || this.$emit('getOwnJobs')
    },
    setLocalRoute(rou) {
      if (rou == 'cabout') {
        this.logo_upload_error = null
        this.getOwnCompanyData()
      } else
      if (rou == 'responses') {
        this.getResps()
      }
      //  else
      // if (rou == 'settings') {
      //   this.getResps()
      // }
      this.tab = rou
    },
    editJob(jid) {
      ///console.log('edit jab: ', jid)
      this.$emit('editJob', jid)
    },
    reopenJob(jid) {
      this.$emit('reopenJob', jid)
    },
    delJob(jid) {
      this.$emit('delJob', jid)
    },
    closeJob(jid) {
      this.$emit('closeJob', jid)
    },
    favOne(id) {
      this.$emit('favOne', id)
    }
  },
  mounted(){
    //this.newusername = this.username
    //this.newsurname = this.surname
    setTimeout(()=>{this.$emit('getOwnJobs')},50)
  },
  watch: {
    username(newu) {
      this.newusername = newu
    },
    surname(news) {
      this.newsurname = news
    },
    $route (to, from){
      if (to.name === 'entprofile') {
        if (this.tab == 'cabout') {
          this.getOwnCompanyData()
        }
        // elseif (this.tab == 'responses') {
          
        // }
        
      }

    }
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
.entprofile
  max-width 900px
  padding 0 10px
  padding-top 10px
  display flex
  flex-direction column
  justify-content center
  &__inner
    display flex
  &__mid
    width 100%
    
  p
    margin-bottom 15px
  &__inp
    width 300px
  &__header
    display flex
    justify-content flex-end
    align-self center
    font-size 18px
    padding-bottom 15px
  .tabs
    // border-top-left-radius 15px
    // border-top-right-radius 15px
    justify-content center
    animation-duration 0.3s
    transition-duration 0.3s
  .entprofile__published
    width 100%
    //background-color #eee
    display flex
    flex-direction column
    align-items flex-start
    // border-bottom-left-radius 15px
    // border-bottom-right-radius 15px
  .entprofile__settings
    //background-color #eee
    display flex
    flex-direction column
    align-items flex-start
    // border-bottom-left-radius 15px
    // border-bottom-right-radius 15px
  .anim1
    animation-duration 0.3s
    transition-duration 0.3s
  .logo-placeholder
    width 180px
    height 80px
    background-size 180px 80px
    background-color pink
    line-height 50px
  *
    margin 0
</style>
