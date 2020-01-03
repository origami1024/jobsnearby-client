<template>
  <div class="registration">
    <div class="registration__main">
      <q-tabs
        :value="regState"
        @input="regStateUpd"
        inline-label
        class="bg-primary text-white shadow-2 tabs"
      >
        <q-tab name="login" label="Вход" />
        <q-tab name="reg" label="Регистрация" />
      </q-tabs>
      <q-tab-panels class="registration__inner" :value="regState" animated>
        <q-tab-panel name="login">
          <form action="#" @submit.prevent="trylog">
            <div class="colx">
              <div class="row">
                <label for="email">Email</label>
                <span v-show="login.showErrors" class="err_span">{{login.validation.mail}}</span>
              </div>
              <input id="email" v-model="login.mail" type="text" placeholder="Почта используется как логин">
            </div>
            <div class="colx">
              <div class="row">
                <label for="pw">Пароль</label>
                <span v-show="login.showErrors" class="err_span">{{login.validation.pw}}</span>
              </div>
              <input id="pw" v-model="login.pw" type="text" placeholder="**********">
            </div>
            <div class="row spacebetw">
              <div class="row">
                <input id="remember" type="checkbox" :checked="login.rememberme">
                <label for="remember">Запомнить меня</label>
              </div>
              <a href="#">Забыл пароль?</a>
            </div>
            
            <q-btn 
              color="primary"
              label="Войти"
              type="submit"
              :loading="submitting"
              class="full-width"
            />
            <!-- <input type="submit" value="Войти"> -->
            <p>{{login.status}}</p>
          </form>
        </q-tab-panel>
        <q-tab-panel name="reg">
          <form action="#" @submit.prevent="tryreg">
            <div class="line">
              <input type="radio" v-model="usertype" id="r1" name="usertype" value="subscriber">
              <label class="twolined" for="r1">Специалист (Ищу работу)</label>
              <input type="radio" v-model="usertype" id="r2" name="usertype" value="company">
              <label class="twolined" for="r2">Компания (Работодатель)</label>
            </div>
            <div class="colx" v-show="usertype === 'company'">
              <div class="row">
                <label for="company">Компания</label>
                <span v-show="showErrors" class="err_span">{{validation.company}}</span>
              </div>
              <input v-model="company" id="company" placeholder="Название компании">
              <div class="row">
                <input v-model="agency" type="checkbox" id="agency">
                <label for="agency">Кадровое агенство</label>
              </div>
            </div>
            <div class="colx" v-show="usertype === 'subscriber'">
              <div class="row">
                <label for="name">Имя</label>
                <span v-show="showErrors" class="err_span">{{validation.name}}</span>
              </div>
              <input v-model="name" id="name" placeholder="Имя">
              <div class="row">
                <label for="surname">Фамилия</label>
                <span v-show="showErrors" class="err_span">{{validation.surname}}</span>
              </div>
              <input v-model="surname" id="surname" placeholder="Фамилия">
            </div>
            <div class="colx">
              <div class="row">
                <label for="email">Email</label>
                <span v-show="showErrors" class="err_span">{{validation.mail}}</span>
              </div>
              <input v-model="mail" id="email" placeholder="Почта используется как логин">
            </div>
            <div class="colx">
              <div class="row">
                <label for="pw">Пароль</label>
                <span v-show="showErrors" class="err_span">{{validation.pw}}</span>
              </div>
              <input v-model="pw" id="pw" placeholder="5 - 25 символов, 1 цифра, 1 заглавная">
              <div class="row">
                <label for="pwconfirm">Пароль еще раз</label>
                <span v-show="showErrors" class="err_span">{{validation.pwc}}</span>
              </div>
              <input v-model="pwc" id="pwconfirm" placeholder="Введите пароль повторно">
            </div>
            <div class="colx">
              <div class="row">
                <input type="checkbox" id="rulescb" v-model="rules">
                <label for="rulescb">Ознакомлен с <a href="#">условиями использования</a></label>
              </div>
              <span v-show="showErrors" class="err_span">{{validation.rules}}</span>
            </div>
            <q-btn 
              color="primary"
              label="Регистрация"
              type="submit"
              :loading="submitting"
              class="full-width"
            />
            <!-- <input type="submit" value="Регистрация"> -->
            <p>{{status}}</p>
          </form>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const config = require('./../configs/main_config')


export default {
  name: 'registration',
  props: {
    regState: {type: String, default: 'reg'}
  },
  data: ()=>{return {
    login: {
      mail: '',
      pw: '',
      status: '',
      rememberme: true,
      showErrors: false,
      validation: {
        mail: 'Введите email',
        pw: 'Введите пароль'
      }
    },
    submitting: false,
    //tab: 'reg',
    mail: '',
    pw: '',
    pwc: '',
    rules: false,
    usertype: 'subscriber',
    company: '',
    agency: false,
    name: '',
    surname: '',
    status: '',
    showErrors: false,
    validation: {
      mail: 'Введите email',
      pw: 'Введите пароль',
      pwc: 'Подтвердите пароль',
      rules: 'Ознакомтесь с правилами',
      company: 'Введите название',
      name: 'Введите имя',
      surname: 'Введите фамилию'
    }
  }},
  methods: {
    tryreg() {
      console.log('trying')
      this.status = 'Проверка данных'
      //client validation here
      if (this.validate()) {
        this.showErrors = false
        this.status = 'Попытка регистрации'
        this.submitting = true
        console.log('cp10: ',this.agency)
        axios
          .post(config.jobsUrl + '/reg', [this.mail, this.pw, this.usertype, this.usertype === 'subscriber' ? this.name : this.company, this.usertype === 'subscriber' ? this.surname : this.agency], {headers: {'Content-Type' : 'application/json' }})
          .then(response => {
            if (response.data == 'OK') {
              this.status = 'Регистрация удалась'
              console.log(this.status)
              this.mail = ''
              this.pw = ''
              this.pwc = ''
              this.rules = ''
              this.name = ''
              this.surname = ''
              this.company = ''
              this.agency = ''
              //this.$emit('regclosed')
              this.$emit('regStateUpd', 'login')
            }
            else if (response.data == 'step3') {
              this.status = 'Регистрация не удалась, ошибки на сервере'
              console.log(this.status)
            }
            else if (response.data == 'step2') {
              this.status = 'Такой email уже существует в базе данных'
              console.log(this.status)
            }
            else if (response.data == 'step1') {
              this.status = 'валидация на сервере не прошла хух'
              console.log(this.status)
            }
            else console.dir('successful registering', response.data)
            this.submitting = false
          })
      } else this.showErrors = true
    },
    validate(){
      //return true
      let mailregex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      let nameregex = /^[\wа-яА-Я]+$/
      if (this.mail.length === 0)
        this.validation.mail = 'Введите email'
      else if (!mailregex.test(this.mail)) 
        this.validation.mail = 'Неправильный формат адреса'
      else this.validation.mail = ''

      if (this.usertype === 'subscriber') {
        // this.validation.company = ''
        
        if (this.name.length === 0)
          this.validation.name = 'Введите имя'
        else if (this.name.length < 3)
          this.validation.name = 'Минимальная длина 3 символа'
        else if (this.name.length > 60)
          this.validation.name = 'Максимальная длина 60 символов'
        else if (!nameregex.test(this.name))
          this.validation.name = 'Неправильный формат имени'
        else this.validation.name = ''

        if (this.surname.length === 0)
          this.validation.surname = 'Введите фамилию'
        else if (this.surname.length < 3)
          this.validation.surname = 'Минимальная длина 3 символа'
        else if (this.surname.length > 60)
          this.validation.surname = 'Максимальная длина 60 символов'
        else if (!nameregex.test(this.surname))
          this.validation.surname = 'Неправильный формат фамилии'
        else this.validation.surname = ''
      } else {
        // this.validation.name =  ''
        // this.validation.surname =  ''

        if (this.company.length === 0)
          this.validation.company = 'Введите название'
        else if (this.company.length < 3)
          this.validation.company = 'Минимальная длина 3 символа'
        else if (this.company.length > 60)
          this.validation.company = 'Максимальная длина 60 символов'
        else if (!nameregex.test(this.company))
          this.validation.company = 'Неправильный формат названия'
        else this.validation.company = ''
      }


      if (this.pw.length === 0)
        this.validation.pw = 'Введите пароль'
      else if (this.pw.length < 5)
        this.validation.pw = 'Минимум 5 символов'
      else if (this.pw.length > 25)
        this.validation.pw = 'Максимум 25 символов'
      else this.validation.pw = ''

      if (this.pwc.length === 0)
        this.validation.pwc = 'Подтвердите пароль'
      else if (this.pwc !== this.pw)
        this.validation.pwc = 'Не совпадает с паролем'
      else this.validation.pwc = ''

      if (!this.rules) this.validation.rules = 'Ознакомтесь с правилами'
      else this.validation.rules = ''

      if (this.validation.mail === '' && 
          this.validation.pw === '' && 
          this.validation.pwc === '' && 
          this.validation.rules === '' &&
          ( ( this.usertype === 'subscriber' &&
              this.validation.name === '' && 
              this.validation.surname === '')
            ||
            ( this.usertype === 'company' &&
              this.validation.company === '')
          ))
        return true
      return false
    },
    regStateUpd(val){
      this.$emit('regStateUpd', val)
    },
    trylog() {
      this.login.status = 'Проверка данных'
      
      //client validation here
      if (this.validateLogin()) {
        this.showErrors = false
        this.login.status = 'Попытка входа'
        this.submitting = true
        axios
          .post(config.jobsUrl + '/login', [this.login.mail, this.login.pw], {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
          .then(response => {
            //fix: need to send auth data on login
            if (response.data && response.data[0] === 'OK' && response.data.length > 3) {
              this.login.status = 'Вход осуществлен'
              //console.log(this.status)
              this.$emit('authed', response.data.slice(1))
              this.$router.push({ name: 'home' })
            }
            else if (response.data == 'step3') {
              this.login.status = 'Не удалось выполнить вход'
            }
            else if (response.data == 'step2') {
              this.login.status = 'Такого пользователя не существует, либо неверный пароль'
              //send this in both cases
            }
            else if (response.data == 'step1') {
              this.login.status = 'Валидация на сервере не прошла хух'
            }
            else console.dir('successful login', response.data, response.headers)
            this.submitting = false
          })
      } else this.login.showErrors = true
    },
    validateLogin(){
      let mailregex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      if (this.login.mail.length === 0) 
        this.login.validation.mail = 'Введите email'
      else if (!mailregex.test(this.login.mail)) 
        this.login.validation.mail = 'Неправильный формат адреса'
      else this.login.validation.mail = ''

      if (this.login.pw.length === 0)
        this.login.validation.pw = 'Введите пароль'
      else if (this.login.pw.length < 5 || this.login.pw.length > 25)
        this.login.validation.pw = 'Кол-во символов от 5 до 25'
      else this.login.validation.pw = ''

      if (this.login.validation.mail === '' && 
          this.login.validation.pw === '')
        return true
      return false
    }
  },
  components: {
  }
}
</script>

<style lang="stylus">
.registration
  padding-top 15px
  margin 0
  max-width 400px
  .registration__main
    //border 2px solid black
    
  .registration__inner
    background-color #eee
    border-bottom-left-radius 15px
    border-bottom-right-radius 15px
  .tabs
    border-top-left-radius 15px
    border-top-right-radius 15px
  form
    display flex
    flex-direction column
    text-align left
    .twolined
      display flex
      flex-wrap wrap
    .line
      display flex
      padding 5px
      border 1px solid gray
      margin 5px 0
      border-radius 4px
    .colx
      display flex
      flex-direction column
      padding 5px
      border 1px solid gray
      margin 5px 0
      border-radius 4px
    .row
      display flex
    .err_span
      color #f00
    .spacebetw
      justify-content space-between
      margin-bottom 5px
</style>