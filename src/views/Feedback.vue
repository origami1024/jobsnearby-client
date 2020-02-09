<template>
  <div class="feedback">
    <div v-if="state == 'ready'" class="fb_inner">
      <br>
      <q-input v-model="fbData.topic" outlined label="Тема"/>
      <br>
      <q-input v-model="fbData.name" outlined label="Ваше имя"/>
      <br>
      <q-input v-model="fbData.mail" outlined label="Ваш Email"/>
      <br>
      <q-input 
        maxlength="500"
        counter
        outlined
        v-model="fbData.body"
        type="textarea"
        label="Текст"
      />
      <q-btn color="primary" label="Отправить" @click="sendFB" />
    </div>
    <div v-else class="fb_inner">
      <p>{{
        state == 'OK'
          ? 'Успешно отправлено'
          : 'Ошибка на сервере'}}</p>
      <div style="width: 100%;">
        <q-btn style="margin-right: 10px" color="primary" label="Отправить еще" @click="state='ready'" />
        <q-btn color="primary" label="На главную" @click="fbDataFlush(); state='ready'; $router.push('/')" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const config = require('./../configs/main_config')

export default {
  name: 'FeedBack',
  data: ()=>{return {
    state: 'ready', //justSentOk, justSentBad
    fbData: {
      topic: '',
      name: '',
      mail: '',
      body: ''
    }
  }},
  methods: {
    fbDataFlush() {
      this.fbData = {
        topic: '',
        name: '',
        mail: '',
        body: '',
      }
    },
    sendFB() {
      console.log(this.fbData)
      let url = config.jobsUrl + '/fb'
      axios
        .post(url, this.fbData, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
        .then(response => {
          //console.log('viewHit', response.data)
          if (response.data == 'OK') {
            this.$q.notify('Фидбэк отправлен')
            this.state = 'OK'
            this.fbDataFlush()
          } else {
            this.$q.notify('Ошибка на сервере')
            this.state = 'BAD'
          }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.feedback
  max-width 620px
  width 620px
  .fb_inner
    min-height 70vh
    border-radius 5px
    box-shadow 0 0 3px 2px #a0a4
    margin-top 15px
    background-color #eee
    padding 10px
</style>