<template>
  <div class="addJob">
    <transition name="bounce">
      <div v-if="role === 'company' && sent == 'none'" class="authed" :key="1">
        <router-link class="r-link" v-if="role === 'company'" to="/uploads"
          style="text-align: right; marginBottom: -15px"
        >
          <q-btn round icon="description">
            <q-tooltip>
              <p style="font-size: 15px; margin: 0">Публикация вакансий XLS</p>
          </q-tooltip>
          </q-btn>
          
        </router-link>
        <p style="fontSize: 20px; marginBottom: 22px">{{pageTypes[newJobsPageType].label}} {{jobEditId != -1 ? jobEditId : ''}}</p>
        <div class="line">
          <p class="star">*</p>
          <p class="startP" style="min-width: 140px; textAlign: left">Название вакансии</p>
          <q-input
            outlined
            bg-color="white"
            :style="{width: '100%'}"
            dense :hint="null"
            v-model="job.title"
            ref="title"
            :rules="[
              val => (lazyRulesAll || !!val) || '* Обязательное поле',
              val => (lazyRulesAll || val.length > 1) || 'Минимум 2 символа',
              val => val.length < 76 || 'Максимум 75 символов',
              val => /^[\wа-яА-ЯÇçÄä£ſÑñňÖö$¢Üü¥ÿýŽžŞş\s\\-]*$/.test(val) || 'Используются запрещенные символы'
              ]"
            :lazy-rules="lazyRulesAll"
          />
        </div>
        <div class="line">
          <p class="star">*</p>
          <p class="startP" style="width: 140px; textAlign: left">Зарплата</p>
          <q-input
            :disable="job.salaryOn"
            :style="{width: '110px', marginRight: '10px'}"
            dense
            outlined
            bg-color="white"
            v-model="job.salary_min"
            ref="salary_min"
            label="От" :hint="null"
            :rules="[sal => (sal >= 0 && String(sal).length < 6 && sal < 100000) || 'От 0 до 99999']"
          />
          <q-input
            :disable="job.salaryOn"
            :style="{width: '110px', marginRight: '10px'}"
            dense
            outlined
            bg-color="white"
            v-model="job.salary_max"
            ref="salary_max"
            label="До" :hint="null"
            :rules="[sal => (sal >= 0 && String(sal).length < 6 && sal < 100000) || 'От 0 до 99999']"
          />
          <q-select
            :disable="job.salaryOn"
            style="width: 95px; lineHeight: 3.2"
            dense
            outlined
            bg-color="white"
            v-model="job.currency"
            :options="[
              {label: 'манат', value: 'm'},      
              {label: '$', value: '$'},
            ]"
            :hint="null"
          />
          <q-checkbox style="marginBottom: 12px; alignSelf: center" v-model="job.salaryOn">
            <q-tooltip>
              <p style="font-size: 15px; margin: 0">По итогам собеседования</p>
            </q-tooltip>
          </q-checkbox>
          <!-- <q-toggle v-model="job.salaryOn" :style="{alignSelf: 'start'}" :hint="null">
            <q-tooltip>
              <p style="font-size: 15px; margin-bottom: 0">По итогам собеседования</p>
            </q-tooltip>
          </q-toggle> -->
        </div>
        <div class="line">
          <p class="star" :style="{color: contactsValidated ? '#2c3e50' : '#C10015'}">*</p>
          <p class="startP" :style="{color: contactsValidated ? '#2c3e50' : '#C10015'}" style="width: 140px; textAlign: left">Ваши контакты</p>
          <q-input
            dense
            outlined
            bg-color="white"
            v-model="job.contact_mail"
            label="Email"
            type="email"
            style="marginRight: 10px"
            :hint="null"
            ref="contact_mail"
            @input="contactsValidated = true; $refs.contact_mail.validate()"
            :rules="[
              val => val.length < 41 || 'Максимум 40 символов',
              val => (val.length < 1 || isValidMail(val)) || 'Неправильный формат',
              val => contactsValidated == true || 'Заполните 1 или 2 контакта'
              ]"
            :lazy-rules="lazyRulesAll"
          />
          <!-- :rules="[mail => (
              mail.length < 60 && 
              isValidMail(mail)
              ) || 'Введите валидный адрес электронной почты (*@*.*)']"
            :lazy-rules="lazyRulesAll" -->
          <q-input
            dense
            outlined
            bg-color="white"
            v-model="job.contact_tel"
            label="Phone"
            type="tel"
            :hint="null"
            ref="contact_tel"
            @input="contactsValidated = true; $refs.contact_mail.validate()"
            :rules="[
              val => val.length < 16 || 'Максимум 15 символов',
              val => (val.length < 1 || /^[\+0-9\-\(\)]*$/.test(val)) || 'Неправильный формат',
              val => contactsValidated == true || 'Заполните 1 или 2 контакта'
            ]"
            :lazy-rules="lazyRulesAll"
          />
        </div>
        <div class="line">
          <!-- <p class="startP">Город</p> -->
          <p class="star"> </p>
          <p class="startP" style="width: 140px; textAlign: left">Город</p>
          <q-select
            :value="job.city"
            @input="cityUpd"
            outlined
            bg-color="white"
            dense
            use-input
            input-debounce="0"
            fill-input
            hide-selected
            ref="city"
            :options="cityOptions"
            @filter="filterFn"
            :hint="null"
            @keyup="addNewCity"
            :rules="[
              val => val.length < 71 || 'Максимум 70 символов',
            ]"
            :lazy-rules="lazyRulesAll"
          />
          <!-- <q-input :style="{width: '250px'}" dense filled v-model="job.city" label="Город" :hint="null"/> -->
        </div>
        <p style="fontSize: 16px; marginBottom: 5px">Описание <span style="color: red">{{descError}}</span></p>
        <div class="line">
          <vue-editor
            v-model="job.description"
            @blur="descBlur"
            @input="descUpd"
            :editorToolbar="customToolbar"
            style="textAlign: left; width: 100%; backgroundColor: white; marginBottom: 22px"
          />
        </div>
        <q-expansion-item
          expand-separator
          icon="perm_identity"
          label="Дополнительно"
          style="marginBottom: 10px"
        >
        
          <div class="line" style="marginTop: 10px">
            <p class="star"> </p>
            <p class="startP" style="width: 140px; textAlign: left">Опыт</p>
            <q-select
              v-model="job.experience"
              style="width: 180px"
              dense outlined
              bg-color="white"
              :options="expOptions"
              :hint="null"
            />
          </div>
          <div class="line">
            <p class="star"> </p>
            <p class="startP" style="width: 140px; textAlign: left">Тип занятости</p>
            <q-select
              v-model="job.jtype"
              outlined bg-color="white"
              dense 
              :options="jtypeOptions"
              :hint="null"
              style="width: 180px"
            />
          </div>
          <div class="line">
            <p class="star"> </p>
            <p class="startP" style="width: 140px; textAlign: left">Возраст</p>
            <q-input
              :style="{width: '110px', marginRight: '10px'}"
              dense outlined
              bg-color="white"
              v-model="job.age1"
              ref="age1"
              label="От"
              :hint="null"
              :rules="[
                val => isNaN(val) == false || 'Введите число',
                val => (val == undefined || val == '' || val >= 18) || 'От 18',
                val => val < 100 || 'Слишком много',
              ]"
              :lazy-rules="lazyRulesAll"
            />
            <q-input
              :style="{width: '110px', marginRight: '10px'}"
              dense outlined
              bg-color="white"
              v-model="job.age2"
              label="До"
              :hint="null"
              ref="age2"
              :rules="[
                val => isNaN(val) == false || 'Введите число',
                val => (val == undefined || val == '' || val >= 18) || 'От 18',
                val => val < 100 || 'Слишком много',
              ]"
              :lazy-rules="lazyRulesAll"
            />
          </div>
          <div class="line">
            <p class="star"> </p>
            <p class="startP" style="width: 140px; textAlign: left">График работы</p>
            <q-input
              :style="{width: '110px', marginRight: '10px'}"
              dense outlined bg-color="white"
              v-model="job.worktime1"
              ref="worktime1"
              label="От" :hint="null"
              :rules="[
                val => isNaN(val) == false || 'Введите число',
                val => val == (val | 0) || 'Целое число',
                val => (val == undefined || val == '' || val >= 0) || 'Положительное',
                val => val < 25 || '24 макс',
              ]"
              :lazy-rules="lazyRulesAll"
            />
            <q-input
              :style="{width: '110px', marginRight: '10px'}"
              dense outlined bg-color="white" v-model="job.worktime2"
              label="До" :hint="null"
              ref="worktime2"
              :rules="[
                val => isNaN(val) == false || 'Введите число',
                val => val == (val | 0) || 'Целое число',
                val => (val == undefined || val == '' || val >= 0) || 'Положительное',
                val => val < 25 || '24 макс',
              ]"
              :lazy-rules="lazyRulesAll"
            />
          </div>
          <div class="line">
            <p class="star"> </p>
            <p class="startP" style="width: 140px; textAlign: left">Образование</p>
            <q-input
              dense
              outlined
              bg-color="white"
              v-model="job.edu"
              style="marginRight: 10px"
              :hint="null"
              ref="edu"
              :rules="[
                val => val.length < 21 || '20 символов макс',
              ]"
              :lazy-rules="lazyRulesAll"
            />
          </div>
          <div class="line">
            <p class="star"> </p>
            <p class="startP" style="width: 140px; textAlign: left">Языки</p>
            <q-select
              multiple
              use-chips
              dense
              outlined
              bg-color="white"
              :style="{width: '400px'}"
              max-values="3"
              v-model="job.langs"
              :options="langOptions"
              :hint="null"
            />
          </div>
        </q-expansion-item>
        <q-btn style="marginTop: 0px" color="primary" :label="newJobsPageType == 'new' ? 'Разместить вакансию' : 'Отправить изменения'" @click="tryAdd"/>
      </div>
      <div v-else-if="sent == 'good'" :key="2">
        <p>Вакансия успешно добавлена</p>
        <q-btn color="primary" @click="$emit('setSentState', 'none'); resetFields(); $emit('newJobInit')" label="Загрузить еще одну"/>
      </div>
      <div v-else-if="sent == 'fail'" :key="3">
        <p>Ошибка на сервере, вакансия не добавлена</p>
        <q-btn color="primary" @click="$emit('setSentState', 'none'); resetFields(); $emit('newJobInit')" label="Загрузить еще одну"/>
      </div>
      <div v-else :key="4">
        Авторизируйтесь, для возможности загрузки вакансий
      </div>
    </transition>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
const config = require('@/configs/main_config')

let stringOptions = ["Ашхабад", "Дашогуз", "Мары", "Туркменабад", "Туркменбаши"]
let jobInit = {
  title: '',
  salary_min: '',
  salary_max: '',
  currency: {label: 'манат', value: 'm'},
  salaryOn: false,
  city: '',
  age1: '',
  age2: '',
  worktime1: '',
  worktime2: '',
  sex: {label: "Не имеет значения", value: ''},
  langs: [],
  edu: '',
  experience: {label: "Не имеет значения", value: -1},
  description: '',
  contact_mail: '',
  contact_tel: '',
  jtype: {label: "Постоянная", value: 'c'},
}

import { VueEditor } from "vue2-editor"

//[{ 'color': [] }, { 'background': [] }],
//[{"header":2},{"header":1}],
//[{ 'indent': '-1'}, { 'indent': '+1' }],
export default {
  name: 'addJob',
  props: {
    uid: Number,
    authed: {type: Boolean, default: false},
    role: String,
    newJobsPageType: {type: String, default: 'new'},
    jobEditId: Number,
    jobEditedObj: Object,
    sent: {type: String, default: 'none'},
  },
  data() {
    return {
      expOptions: [
        {label: "Не имеет значения", value: -1},
        {label: "Без опыта", value: 0},
        {label: "от 1 до 3 лет", value: 2}, 
        {label: "от 3 до 5 лет", value: 4},
        {label: "от 5 лет", value: 6}
      ],
      lazyRulesAll: true,
      pageTypes: {
        'new': {label: 'Создать новую вакансию'},
        'edit': {label: 'Редактирование вакансии'}
      },
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ size: [ 'small', false, 'large']}],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ 'align': [] }],
        ['clean']
      ],
      job: Object.assign({}, jobInit),
      contactsValidated: true,
      descError: '',
      sexOptions: [{label: "Не имеет значения", value: ''}, {label: "Муж", value: 'm'}, {label: "Жен", value: 'w'},],
      langOptions: ["Туркменский", "Русский", "Китайский", "Английский", "Немецкий", "Французкий"],
      cityOptions: stringOptions,
      jtypeOptions: [
        {label: "Постоянная", value: 'c'},
        {label: "Временная", value: 'v'}],
      //mailRegex: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    }
  },
  computed: {
    // myjobslist: function () {
    //   return this.jobslist.filter(job => job.author_id === this.uid)
    // }
  },
  watch: {
    jobEditedObj(newObj) {
      console.log('jobEditorWatcher cp0')
      if (this.newJobsPageType == 'edit') {
        this.job = Object.assign({}, jobInit, newObj)
        
        console.log('jobEditorWatcher cp')
        
      } else {
        this.job = Object.assign({}, jobInit)
        
      }
    }
  },
  mounted(){
    console.log('cpmount: ', this.jobEditedObj)
    if (this.newJobsPageType == 'edit') {
        this.job = Object.assign({}, jobInit, this.jobEditedObj)
    } else {
      this.job = Object.assign({}, jobInit)
      
    }
  },
  methods:{
    descUpd(e) {
      if (e.length < 751) {this.descError = ''}
    },
    descBlur(e) {
      // if (e.root.innerHTML.length < 15) {this.descError = '(15 символов минимум)'}
      if (e.root.innerHTML.length > 750) {this.descError = '(750 символов максимум)'}
      //this.job.description = e.root.innerHTML
    },
    resetFields() {
      this.job = Object.assign({}, jobInit)
      this.lazyRulesAll = true
    },
    logger1() {
      console.log(this.editorContent)
    },
    tryAdd() {
      //validate first
      //validate all
      //on bad validation set the scroll value if its not set
      //in the end if not all good scroll to that
      this.lazyRulesAll = false
      let scrollPos

      console.log('cp1111')
      //title
      this.$refs.title.validate()
      if (this.$refs.title.hasError) {
        scrollPos = 130
      }
      //salary
      this.$refs.salary_min.validate()
      this.$refs.salary_max.validate()
      if (this.$refs.salary_min.hasError || this.$refs.salary_max.hasError) {
        if (!scrollPos) scrollPos = 150
      }
      //contacts
      this.$refs.contact_mail.validate()
      this.$refs.contact_tel.validate()
      if ((this.job.contact_mail && this.job.contact_mail.length > 0) || (this.job.contact_tel && this.job.contact_tel.length > 0))
        this.contactsValidated = true
      else
        this.contactsValidated = false

      if (this.$refs.contact_mail.hasError || this.$refs.contact_tel.hasError || this.contactsValidated == false) {
        if (!scrollPos) scrollPos = 160
      }
      //city
      this.$refs.city.validate()
      if (this.$refs.city.hasError) {
        scrollPos = 190
      }
      //description
      if (this.job.description.length > 750) {
        this.descError = '(750 символов максимум)'
        scrollPos = 240
      }
      //age
      this.$refs.age1.validate()
      this.$refs.age2.validate()
      if (this.$refs.age1.hasError || this.$refs.age2.hasError) {
        scrollPos = 420
      }
      //worktime
      this.$refs.worktime1.validate()
      this.$refs.worktime2.validate()
      if (this.$refs.worktime1.hasError || this.$refs.worktime2.hasError) {
        scrollPos = 450
      }
      //edu
      this.$refs.edu.validate()
      if (this.$refs.edu.hasError) {
        scrollPos = 480
      }
      
      if (scrollPos)
        this.$emit('scrollTo', scrollPos)
      else {
        if (this.newJobsPageType == 'new') this.addOneJob()
        else this.editJobSend()
      }
        
    },
    editJobSend() {
      let j = Object.assign({}, this.job)
      if (j.salary_min > j.salary_max) j.salary_max = j.salary_min
      j.currency = j.currency.value
      j.experience = j.experience.value
      j.jtype = j.jtype.value
      if (j.title != '' && j.title.length > 1) {
        axios
          .post(config.jobsUrl + '/updateJob', j, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
          .then(response => {
            if (response.data === 'OK') {
              this.$emit('setSentState', 'good')
              console.log('cp editJob: OK')
            } else {this.$emit('setSentState', 'fail'); console.log('trespasser')}
            
          })
      } else console.log('NO TITLE in edit')
    },
    addOneJob() {
      //console.dir(this.job)
      
      let j = Object.assign({}, this.job)
      if (j.salary_min > j.salary_max) j.salary_max = j.salary_min
      j.sex = j.sex.value
      j.currency = j.currency.value
      j.experience = j.experience.value
      j.jtype = j.jtype.value
      
      if (j.title != '' && j.title.length > 1) {
        axios
          .post(config.jobsUrl + '/oneJob', j, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
          .then(response => {
            if (response.data === 'OK') {
              
              this.$emit('setSentState', 'good')
              console.log('cp addOneJob: OK')
              
            } else {this.$emit('setSentState', 'fail'); console.log('trespasser')}
            
          })
      } else {
        console.log('NO TITLE')
        return false
      }
    },
    isValidMail(mail) {
      return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(mail)
    },
    addNewCity(e){
      this.cityUpd(e.target.value)
      //this.cityOptions.push(this.city)
    },
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.cityOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    cityUpd(new1) {
      this.job.city = new1
    },
  },
  components: {
    VueEditor
  }
}
</script>


<style scoped lang="stylus">
.addJob
  max-width 80%
  width 680px
  .authed
    margin-top 15px
    background-color #eee
    padding 10px
    padding-top 10px
    box-shadow 0 0 3px 2px #ddd
  .line
    display flex
    align-items flex-end
    // margin-bottom 10px
    min-height 52px
  .startP
    margin-right 10px
    font-size 15px
    align-self flex-end
    padding-bottom 12px
  .star
    align-self flex-start
    margin-right 10px
    font-weight 900
    font-size 20px
    margin-top 5px
    width 5px
  .withMargins
    margin 0 10px
    align-self center

  .bounce-enter-active {
    animation: bounce-in .35s;
  }
  .bounce-leave-active {
    animation: bounce-in .35s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

</style>