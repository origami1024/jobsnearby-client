<template>
  <div v-if="isShown" class="registerModal">
    <button @click="$emit('regclosed')">X</button>
    <form action="#" @submit.prevent="tryreg">
      <h4>Регистрация</h4>
      <label for="email">Email</label>
      <input v-model="mail" id="email" placeholder="Почта используется как логин">
      <label for="pw">Пароль</label>
      <input v-model="pw" id="pw" placeholder="6 - 25 символов, 1 цифра, 1 заглавная">
      <label for="pwconfirm">Подтверждение пароля</label>
      <input v-model="pwc" id="pwconfirm" placeholder="Введите пароль повторно">
      <label for="rulescb">Ознакомлен с <a href="#">условиями использования</a></label>
      <input type="checkbox" id="rulescb" v-model="rules">
      <input type="submit" value="Регистрация">
      <p>{{status}}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

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
    status: ''
  }},
  methods: {
    tryreg() {
      console.log('trying')
      this.status = 'Попытка регистрации'
      //client validation here
      let validation = true
      if (validation) {
        axios
          .post('http://localhost:3000/reg', [this.mail, this.pw], {headers: {'Content-Type' : 'application/json' }})
          .then(response => {
            if (response.data == 'OK') {
              this.status = 'Регистрация удалась'
              console.log(this.status)
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
      }
    }
  }
}
</script>
<style scoped lang="stylus">
*
  margin 0
.registerModal
  width 280px
  box-sizing border-box
  padding 10px
  background-color #bbb
  position fixed
  top 30%
  right 0%
  transform translate3d(-10%, -82%, 0)
  text-align right
  form
    display flex
    flex-direction column
    text-align left
</style>
