<template>
  <div v-if="isShown" class="loginModal">
    <button @click="$emit('loginclosed')">X</button>
    <form action="#" @submit.prevent="trylog">
      <h3>Вход</h3>
      <div class="col">
        <div class="row">
          <label for="email">Email</label>
          <span v-show="showErrors" class="err_span">{{validation.mail}}</span>
        </div>
        <input id="email" v-model="mail" type="text" placeholder="Почта используется как логин">
      </div>
      <div class="col">
        <div class="row">
          <label for="pw">Пароль</label>
          <span v-show="showErrors" class="err_span">{{validation.pw}}</span>
        </div>
        <input id="pw" v-model="pw" type="text" placeholder="**********">
      </div>
      <div class="row">
        <input id="remember" type="checkbox">
        <label for="remember">Запомнить меня</label>
      </div>
      <input type="submit" value="Войти">
      <p>{{status}}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
const config = require('@/configs/main_config')

export default {
  name: 'LoginModal',
  props: {
    isShown: Boolean
  },
  data: ()=>{return {
    mail: '',
    pw: '',
    status: '',
    rememberme: true,
    showErrors: false,
    validation: {
      mail: 'Введите email',
      pw: 'Введите пароль'
    }
  }},
  methods: {
    trylog() {
      this.status = 'Проверка данных'
      
      //client validation here
      if (this.validate()) {
        this.showErrors = false
        this.status = 'Попытка входа'
        axios
          .post(config.jobsUrl + '/login', [this.mail, this.pw], {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
          .then(response => {
            //fix: need to send auth data on login
            if (response.data && response.data[0] === 'OK' && response.data.length > 3) {
              this.status = 'Вход осуществлен'
              console.log(this.status)
              this.$emit('authed', response.data.slice(1))
            }
            else if (response.data == 'step3') {
              this.status = 'Не удалось выполнить вход'
              console.log(this.status)
            }
            else if (response.data == 'step2') {
              this.status = 'Такого пользователя не существует, либо неверный пароль'
              //send this in both cases
              console.log(this.status)
            }
            else if (response.data == 'step1') 
            {
              this.status = 'Валидация на сервере не прошла хух'
              console.log(this.status)
            }
            else console.dir('successful login', response.data, response.headers)
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
      else if (this.pw.length < 5 || this.pw.length > 25)
        this.validation.pw = 'Кол-во символов от 5 до 25'
      else this.validation.pw = ''

      if (this.validation.mail === '' && 
          this.validation.pw === '')
        return true
      return false
    }
  }
}
</script>
<style scoped lang="stylus">
*
  margin 0
.loginModal
  z-index 5
  width 260px
  box-sizing border-box
  padding 4px
  box-shadow 0 0 5px 1px gray
  background-color #ddd
  position fixed
  top 25%
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
