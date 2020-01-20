<template>
  <div v-if="role === 'company'" class="entprofile">
    <div class="entprofile__inner">
      <EntProfileNav :localRoute="tab" @setLocalRoute="setLocalRoute"/>
      <q-tab-panels
        class="qtpans"
        @before-transition="changeTabs"
        v-model="tab"
        animated
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel name="published" class="entprofile__published entprofile__mid">
          <h4 class="entprofile__header">Опубликованные вакансии({{ownJobs.length}}):</h4>
          <JobsStats @editJob="editJob" @delJob="delJob" :jobslist="ownJobs"/>
        </q-tab-panel>
        <q-tab-panel name="responses" class="entprofile__mid" style="display: flex; alignItems: flex-end; justifyContent: center">
          <div class="line">
            <q-btn color="positive" style="marginRight: 10px">Пригласить</q-btn>
            <q-btn color="negative" style="marginRight: 10px">Отказать</q-btn>
            <q-btn color="primary">Просмотрено</q-btn>
          </div>
        </q-tab-panel>
        <q-tab-panel name="cabout" class="entprofile__mid">
          <q-input class="entprofile__inp" dense outlined bottom-slots :value="cabout.name" placeholder="Название компании" counter maxlength="80"/>
          <div class="line" dense style="display: flex; width: 100%; justify-content: space-between;">
            <q-input
              @input="val => { logofile = val[0] }"
              style="width: 300px"
              outlined dense
              type="file"
              hint=""
              accept=".jpg, .png, .svg"
              ref="logoUploader"
            />
            <q-btn @click="uploadLogo" :disable="logofile == null">Загрузить</q-btn>
            <div class="logo-placeholder" :style="{'background-image': 'url(' + logolink + ')'}" >{{logolink == '' ? 'logo placeholder' : ''}}</div>
            <!-- v-if="logolink == ''" -->
            <!-- <img v-else :src="logolink" alt="Лого"> -->
          </div>
          <q-input dense class="entprofile__inp" outlined bottom-slots :value="cabout.workfield" placeholder="Сфера деятельности" counter maxlength="80"/>
          <q-input dense class="entprofile__inp" outlined bottom-slots :value="cabout.link" placeholder="Сайт" counter maxlength="80"/>
          <q-input
            v-model="cabout.desc"
            outlined dense
            placeholder="Описание"
            type="textarea"
          />
          <q-btn color="primary" style="margin-top: 10px">Отправить изменения</q-btn>
        </q-tab-panel>
        <q-tab-panel class="entprofile__settings entprofile__mid" name="settings">
          <p>Добавить контакты</p>
          <q-input dense class="entprofile__inp" outlined bottom-slots v-model="contacts1" label="Контакты" counter maxlength="30"/>
          <q-input dense v-show="contacts_count > 1" class="entprofile__inp" outlined bottom-slots v-model="contacts2" label="Контакты" counter maxlength="30"/>
          <q-input dense v-show="contacts_count > 2" class="entprofile__inp" outlined bottom-slots v-model="contacts3" label="Контакты" counter maxlength="30"/>
          <q-btn round color="primary" @click="contacts_count < 4 ? contacts_count += 1 : ''" size="sm" icon="add" :disable="contacts_count > 2"/>
          <q-toggle v-model="editable" label="Изменить личные данные"/>
          <q-input class="entprofile__inp" outlined bottom-slots :value="company" label="Название компании" counter maxlength="80" :readonly="!editable" />
          <q-input type="email" class="entprofile__inp" outlined bottom-slots v-model="newemail" label="Email" counter maxlength="50" :readonly="!editable" />
          <q-input :type="isPwd ? 'password' : 'text'" class="entprofile__inp" outlined bottom-slots v-model="newpw" label="Пароль" counter maxlength="25" :readonly="!editable">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-btn color="primary" label="Изменить" :disable="!editable"/>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import JobsStats from '@/components/organisms/JobsStats.vue'
import EntProfileNav from '@/components/molecules/EntProfileNav.vue'

import axios from 'axios'

export default {
  name: 'EntProfile',
  props: {
    ownJobs: Array,
    company: {type: String, default: ''},
    role: String
  },
  data: ()=>{return {
    logolink: '',
    logofile: null,
    cabout: {
      name: '',
      logo: '',
      workfield: '',
      link: '',
      desc: ''
    },
    lenses: 'full',
    contacts1: '',
    contacts2: '',
    contacts3: '',
    contacts_count: 1,
    newcompany: '',
    newsurname: '',
    newemail: '',
    newpw: '',
    isPwd: true,
    tab: 'published',
    editable: false
  }},
  components: {
    //JobsList,
    JobsStats,
    EntProfileNav
  },
  methods: {
    uploadLogo() {
      let dumper = 'https://decreed-silk.000webhostapp.com/outer.php'
      //logoUploader

      var formData = new FormData();
      formData.append("image", this.logofile);
      axios
        .post(dumper, formData, {
          headers: {'Content-Type': 'multipart/form-data'}
        })
        .then(resp => {
          //console.log('cp219: ', resp)
          if (resp.data && resp.data.startsWith('link:')) {
            console.log('uploading is ok')
            this.logolink = resp.data.replace('link:', '')
          } else {console.log('error uploading: ', resp.data)}
          //if (response.data === 'OK') {} else 
        })
    },
    changeTabs(newT) {
      //if (newT == 'published') this.$emit('getOwnJobs')
      newT != 'published' || this.$emit('getOwnJobs')
    },
    setLocalRoute(rou) {
      this.tab = rou
    },
    editJob(jid) {
      console.log('edit jab: ', jid)
      this.$emit('editJob', jid)
    },
    delJob(jid) {
      this.$emit('delJob', jid)
    },
    favOne(id) {
      this.$emit('favOne', id)
    }
  },
  mounted(){
    this.newusername = this.username
    this.newsurname = this.surname
    setTimeout(()=>{this.$emit('getOwnJobs')},50)
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
    align-items flex-end
    // border-bottom-left-radius 15px
    // border-bottom-right-radius 15px
  .anim1
    animation-duration 0.3s
    transition-duration 0.3s
  .logo-placeholder
    width 120px
    height 50px
    background-size 120px 50px
    background-color pink
    line-height 50px
  *
    margin 0
</style>
