<template>
  <div v-if="isShown" class="loginModal">
    <button @click="$emit('loginclosed')">X</button>
    <form action="#" @submit.prevent="trylog">
      <h3>Вход</h3>
      <label for="email">Email</label>
      <input id="email" v-model="mail" type="text" placeholder="Почта используется как логин">
      <label for="pw">Пароль</label>
      <input id="pw" v-model="pw" type="text" placeholder="**********">
      <input id="remember" type="checkbox">
      <label for="remember">Запомнить меня</label>
      <input type="submit" value="Войти">
      <p>{{status}}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

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
  }},
  methods: {
    trylog() {
      this.status = 'Попытка входа'
      //client validation here
      let validation = true
      if (validation) {
        axios
          .post('http://127.0.0.1:3000/login', [this.mail, this.pw], {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
          .then(response => {
            //fix: need to send auth data on login
            if (response.data && response.data[0] === 'OK' && response.data.length === 3) {
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
      }
    }
  }
}
</script>
<style scoped lang="stylus">
*
  margin 0
.loginModal
  width 260px
  box-sizing border-box
  padding 10px
  background-color #bbb
  position fixed
  top 20%
  right 0%
  transform translate3d(-10%, -82%, 0)
  text-align right
  form
    display flex
    flex-direction column
    text-align left
</style>
