<template>
  <div v-if="role === 'company'" class="entprofile">
    <div class="entprofile__inner">
      <ProfileNav
        :localRoute="tab"
        @setLocalRoute="setLocalRoute"
        :localroutes="[{r: 'published', l: $t('entProfile.navPublishedLabel')}, {r: 'responses', l: $t('entProfile.navResponsesLabel'), badges: newcvhitscount}, {r: 'cabout', l: $t('entProfile.navAboutLabel')}]"
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
              
              style="line-height: 30px; font-size: 16px;text-align:left;"
            >
              <template v-slot:header>
                <a class="responseLinkLvl1" :href="'/jobpage?id=' + item" target="_blank">
                  {{resps.find(val=>val.cvjob_id == item).title}}
                  <!-- resps.find(val=>val.cvjob_id == item).cv_url -->
                </a>
                ({{respsJreformat[item].cvhits.length}})
              </template>
              
              <ul style="list-style-type:none; padding: 0 15px;">
                <li style="display: flex" v-for="hit in respsJreformat[item].cvhits" :key="hit">
                  <!-- <q-item clickable> -->
                  <a style="width: 35%" class="responseLinkLvl2" @click="viewHit(hit)" :href="'https://docs.google.com/viewerng/viewer?url=' + resps.find(val=>val.cvhit_id == hit).cv_url" target="_blank">
                    {{
                      resps.find(val=>val.cvhit_id == hit).name + ' ' + 
                      resps.find(val=>val.cvhit_id == hit).surname
                    }}
                    <!-- :href="resps.find(val=>val.cvhit_id == hit).cv_url" -->
                  </a>
                  <div style="width: 30%">
                    {{
                      $t('entProfile.cvSent') + ' ' +
                      formatDate(resps.find(val=>val.cvhit_id == hit).date_created)
                      + '.'
                    }}
                  </div>
                  <div style="width: 35%">
                    {{
                      resps.find(val=>val.cvhit_id == hit).date_checked != null
                        ? $t('entProfile.cvSeen') + ' ' + formatDate(resps.find(val=>val.cvhit_id == hit).date_checked)
                        : $t('entProfile.cvNotSeen')
                    }}
                    <q-btn
                      style="margin-left: 5px"
                      v-if="resps.find(val=>val.cvhit_id == hit).date_checked == null"
                      round
                      color="red-10"
                      size="sm"
                      icon="visibility"
                      @click="viewHit(hit)"
                    />
                  </div>
                    <!-- </q-item> -->
                </li>
              </ul>
              
            </q-expansion-item>
            <div v-if="resps.length == 0">Пока нет ни одного отклика</div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="cabout" class="entprofile__mid">
          <!-- <h2>Изменение отображаемых св-в профиля</h2> -->
          <div style="display: flex; justify-content: space-between">
            <div>
              <label for="companyInp" style="text-align: left;margin-bottom: 5px !important; display: block">{{$t('entProfile.cname')}}</label>
              <q-input
                for="companyInp"
                class="entprofile__inp"
                square dense outlined bottom-slots
                bg-color="white" color="deep-purple-10"
                v-model="cabout.company"
                counter maxlength="80"
              />
              <!-- :placeholder="$t('entProfile.cname')" -->
            </div>
          </div>
          <div class="line" style="display: flex; width: 100%; justify-content: space-between;" @drop="picDrop">
            <div style="width:300px;">
              <label for="fileInp" style="text-align: left;margin-bottom: 5px !important; display: block">{{$t('entProfile.dragLogo')}}</label>
              <label class="uploaderWrapper" tabindex="0">
              <input id="fileInp" ref="fileInput" @change="readUrl($refs.fileInput.files)" type="file" style="display:none" accept=".gif,.jpg,.jpeg,.png,.webp,.svg"/>
              <!-- <span>{{$t('entProfile.dragLogo')}}</span> -->
              <div class="logo-placeholder" :style="{'background-image': 'url(' + cabout.logo_url + ')'}" >{{cabout.logo_url == '' || !cabout.logo_url ? 'logo placeholder' : ''}}</div>
              </label>
            </div>
          </div>
          <div class="line" style="display: flex; width: 100%; justify-content: space-between;">
            <!-- <form action="" ref="uplForm">
              <label for="fileinput1" style="margin-bottom: 5px; display: block">Загрузка логотипа компании</label>
              <q-input
                id="fileinput1"
                @input="val => { logofile = val[0] }"
                style="width: 300px"
                outlined dense
                square
                color="cyan-10"
                type="file"
                hint=""
                accept=".jpg, .png, .svg"
                ref="logoUploader"
              />
            </form> -->
            
            <!--<form action="" ref="uplForm" style="width: 100%; padding: 10px 0;">
             <q-uploader
              :label="$t('entProfile.dragLogo')"
              color="red-10"
              square
              flat
              bordered
              ref="quploader1"
              accept=".jpg, image/*"
              auto-upload
              no-thumbnails
              style="width: 100%"
              :factory="fileUNew"
            /> 
            </form>-->
          </div>
          <label for="siteInp" style="text-align: left;margin-bottom: 5px !important; display: block">{{$t('entProfile.sitePH')}}</label>
          <q-input square for="siteInp" bg-color="white" color="deep-purple-10" dense class="entprofile__inp" outlined v-model="cabout.website"  counter maxlength="80"/>
          <label for="domainsInp" style="text-align: left;margin-bottom: 5px !important; display: block">{{$t('entProfile.catPH')}}</label>
          <q-select
            for="domainsInp"
            multiple
            use-chips
            dense
            outlined
            square
            bg-color="white" color="deep-purple-10"
            :style="{width: '100%'}"
            max-values="3"
            v-model="cabout.domains"
            :options="domainsAll"
            :hint="null"
          />
          <label for="descInp" style="text-align: left;margin-bottom: 5px !important; display: block">{{$t('entProfile.descPH')}}</label>
          <q-input
            for="descInp"
            v-model="cabout.full_description"
            outlined dense square bg-color="white" color="deep-purple-10"
            type="textarea"
            counter maxlength="2000"
          />
          <q-btn color="red-10" class="headerBtns1 headerBtnRed" @click="updateCompanyData" style="margin-top: 10px">{{$t('entProfile.sendChanges')}}</q-btn>
        </q-tab-panel>
        <q-tab-panel class="entprofile__settings entprofile__mid" name="settings">
          <h3 style="width: 100%; marginBottom: 10px; text-align: center;">{{$t('entProfile.settingsLabel')}} <strong>{{company}}</strong></h3>
          
          <!-- <p>Добавить контакты</p>
          <q-input dense class="entprofile__inp" outlined bottom-slots v-model="contacts1" label="Контакты" counter maxlength="30"/>
          <q-input dense v-show="contacts_count > 1" class="entprofile__inp" outlined bottom-slots v-model="contacts2" label="Контакты" counter maxlength="30"/>
          <q-input dense v-show="contacts_count > 2" class="entprofile__inp" outlined bottom-slots v-model="contacts3" label="Контакты" counter maxlength="30"/>
          <q-btn round color="primary" @click="contacts_count < 4 ? contacts_count += 1 : ''" size="sm" icon="add" :disable="contacts_count > 2"/> -->
          <!-- <q-toggle v-model="editable" label="Изменить личные данные"/> -->
          <q-input square color="cyan-10" type="email" class="entprofile__inp" outlined bottom-slots :value="user" :label="$t('entProfile.emailLabel')" counter maxlength="50" />
          <q-input square color="cyan-10" :type="isPwd ? 'password' : 'text'" class="entprofile__inp" outlined bottom-slots v-model="oldpw" :label="$t('entProfile.oldPWLabel')" counter maxlength="25">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input square color="cyan-10" :type="isPwd ? 'password' : 'text'" class="entprofile__inp" outlined bottom-slots v-model="newpw" :label="$t('entProfile.newPWLabel')" counter maxlength="25">
            
          </q-input>
          <q-btn color="red-10" @click="tryChangePw" :label="$t('entProfile.changeSettingsBtn')"/>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
//без этого дропать файлы нельзя
window.addEventListener("dragover",function(e){
  e = e || event;
  e.preventDefault()
},false)
window.addEventListener("drop",function(e){
  e = e || event;
  e.preventDefault()
},false)

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
  data() {return {
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
    domainsAll: this.$t('entProfile.companyDomains'),//domainsAll,
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
  computed: {
    newcvhitscount() {
      var count = 0
      for(var i = 0; i < this.resps.length; ++i){
          if(this.resps[i].date_checked == null)
              count++;
      }
      return count
    }
  },
  methods: {
    picDrop(e) {
      if (e.dataTransfer.files.length == 1) {
        let n = e.dataTransfer.files[0].name
        let ext = n.substr(n.lastIndexOf(".")).toLowerCase()
        if (['.gif','.jpg','.jpeg','.png','.webp','.svg'].includes(ext)) {
          this.readUrl(e.dataTransfer.files)
        }
        window.console.log(e.dataTransfer.files[0])
      }
      window.console.log(e)
    },
    readUrl(files) {
      if (files && files[0]) {
        this.logofile = files[0]
      
        let dumper = 'https://decreed-silk.000webhostapp.com/outer.php'
        console.log('start uploa1')
        var formData = new FormData()
        formData.append("image", this.logofile)
        //this.$refs.uplForm.reset()
        //this.logofile = null
        axios
          .post(dumper, formData, {
            headers: {'Content-Type': 'multipart/form-data'}
          })
          .then(resp => {
            if (resp.data && resp.data.startsWith('link:')) {
              this.logo_upload_error = null
              this.cabout.logo_url = resp.data.replace('link:', '')
              this.$q.notify(this.$t('entProfile.picLoaded'))
              console.log(this.cabout.logo_url)
              this.updateCompanyPic() // / /////// // / /// // /
            } else {
              console.log('error uploading: ', resp.data)
              if (resp.data.startsWith('Error in file size')) {
                this.logo_upload_error = this.$t('entProfile.picTooBig')
                this.$q.notify(this.$t('entProfile.picTooBig'))
              }
            }
            //if (response.data === 'OK') {} else 
          })
      }
    },
    fileUNew(files) {
      //console.log(files.length)
      this.logofile = files[0]
      this.$refs.quploader1.files = []
      this.$refs.quploader1.uploadSize = 0
      this.uploadLogo()
    },
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
            this.$q.notify(this.$t('entProfile.pwChanged'))
          }
          else this.$q.notify(this.$t('entProfile.pwWrongData'))
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
            this.$q.notify(this.$t('entProfile.dataChanged'))
          } else this.$q.notify(this.$t('entProfile.dataError'))
          //if error, show like popup or status update
      })
    },
    updateCompanyPic() {
      let url = config.jobsUrl + '/companyupdpic.json'
      axios
        .post(url, {logo_url: this.cabout.logo_url}, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
        .then(response => {
          if (response.data == 'OK') {
            this.$q.notify(this.$t('entProfile.picUploaded'))
          } else this.$q.notify(this.$t('entProfile.dataError'))
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
            this.$q.notify(this.$t('entProfile.picLoaded'))
            console.log(this.cabout.logo_url)
          } else {
            console.log('error uploading: ', resp.data)
            if (resp.data.startsWith('Error in file size')) {
              this.logo_upload_error = this.$t('entProfile.picTooBig')
              this.$q.notify(this.$t('entProfile.picTooBig'))
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
    setTimeout(()=>{this.getResps()},100)
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
  //border 1px solid #eee
  box-shadow 0 0 4px 1px var(--main-borders-color)
  border-radius 4px
  background-color transparent
.entprofile
  max-width 900px
  padding 20px 0px
  //padding-top 20px
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
    margin-bottom 12px !important
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
    width 100%
    height 90px
    max-height 90px
    //background-size 180px 80px
    //box-shadow 0 0 3px 0
    //line-height 50px
    background-size contain
    background-repeat no-repeat
    background-position center
    outline 1px solid rgba(0,0,0,0.24)
    box-sizing border-box
    transition-duration 0.3s
  .responseLinkLvl1
    color var(--btn-color)
    margin-right 5px
    text-decoration none
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
  .responseLinkLvl2
    color var(--main-borders-color)
    text-decoration none
    margin-right 5px
  *
    margin 0
.uploaderWrapper
  display block
  border 1px solid rgba(0,0,0,0.24)
  padding 12px
  transition-duration 0.3s
  min-width 300px
  margin-bottom 15px
  cursor pointer
  box-sizing border-box
  background-color white//#ede7f6
  &:focus
    outline none
    box-shadow inset 0px 0px 0px 2px var(--color1) !important
  &:hover
    border-color var(--color1)
    // background-color var(--violet-btn-color)
  &:hover>.logo-placeholder
    outline 1px solid var(--color1)
    //border-color var(--color1)
</style>
