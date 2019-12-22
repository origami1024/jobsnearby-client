<template>
  <div v-if="isShown" class="registerModal">
    <button @click="$emit('regclosed')">X</button>
    <form action="#" @submit.prevent="tryreg">
      <h4>Регистрация</h4>
      <div class="col">
        <div class="row">
          <label for="email">Email</label>
          <span v-show="showErrors" class="err_span">{{validation.mail}}</span>
        </div>
        <input v-model="mail" id="email" placeholder="Почта используется как логин">
      </div>
      <div class="col">
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
      <div class="col">
        <div class="row">
          <input type="checkbox" id="rulescb" v-model="rules">
          <label for="rulescb">Ознакомлен с <a href="#">условиями использования</a></label>
        </div>
        <span v-show="showErrors" class="err_span">{{validation.rules}}</span>
      </div>
      <input type="submit" value="Регистрация">
      <p>{{status}}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
const config = require('./../../configs/main_config')

export default {
  name: 'RegisterModal',
  props: {
    isShown: Boolean
  },
  data: () => {return {
    mail: '',
    pw: '',
    pwc: '',
    rules: false,
    status: '',
    showErrors: false,
    validation: {
      mail: 'Введите email',
      pw: 'Введите пароль',
      pwc: 'Подтвердите пароль',
      rules: 'Ознакомтесь с правилами'
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
        axios
          .post(config.jobsUrl + '/reg', [this.mail, this.pw], {headers: {'Content-Type' : 'application/json' }})
          .then(response => {
            if (response.data == 'OK') {
              this.status = 'Регистрация удалась'
              console.log(this.status)
              this.mail = ''
              this.pw = ''
              this.pwc = ''
              this.rules = ''
              this.$emit('regclosed')
            }
            else if (response.data == 'step3') {
              this.status = 'Регистрация не удалась, ошибки на сервере'
              console.log(this.status)
            }
            else if (response.data == 'step2') {
              this.status = 'Такой email уже существует в базе данных'
              console.log(this.status)
            }
            else if (response.data == 'step1') 
            {
              this.status = 'валидация на сервере не прошла хух'
              console.log(this.status)
            }
            else console.dir('successful registering', response.data)
          })
      } else this.showErrors = true
    },
    validate(){
      let mailregex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      if (this.mail.length === 0) 
        this.validation.mail = 'Введите email'
      else if (!mailregex.test(this.mail)) 
        this.validation.mail = 'Неправильный формат адреса'
      else this.validation.mail = ''

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
          this.validation.rules === '')
        return true
      return false
    }
  }
}
</script>
<style scoped lang="stylus">
*
  margin 0
.registerModal
  width 300px
  box-sizing border-box
  padding 4px
  box-shadow 0 0 5px 1px gray
  background-color #ddd
  position fixed
  top 35%
  right 0%
  transform translate3d(-10%, -82%, 0)
  text-align right
  form
    display flex
    flex-direction column
    text-align left
    .line
      display flex
      padding 5px
      border 1px solid gray
      margin 5px 0
      border-radius 4px
    .col
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
</style>
