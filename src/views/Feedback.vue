<template>
  <div class="feedback">
    <div v-if="state == 'ready'" class="fb_inner">
      <br>
      <q-input 
        v-model="fbData.topic"
        square
        dense
        outlined
        bg-color="white" color="cyan-10" label="Тема"
        counter
        maxlength="25"
      />
      <br>
      <q-input
        square
        dense
        counter
        maxlength="25"    
        bg-color="white" color="cyan-10" v-model="fbData.name" outlined label="Ваше имя"/>
      <br>
      <q-input
        square
        dense
        bg-color="white" color="cyan-10" v-model="fbData.mail" outlined label="* Email"
        counter
        maxlength="70"
        :rules="[
          val => !!val || 'Обязательное поле',
          val => mailregex.test(val) || 'Некорректный формат адреса'
        ]"
      />        
      <br>
      <q-input 
        maxlength="500"
        counter
        square
        dense
        outlined
        bg-color="white" color="cyan-10"
        v-model="fbData.body"
        type="textarea"
        label="Пожелания"
      />
      <q-btn color="red-10" label="Отправить" @click="sendFB" />
      <!-- unelevated -->
    </div>
    <div v-else class="fb_inner">
      <p>{{
        state == 'OK'
          ? 'Успешно отправлено'
          : 'Ошибка на сервере'}}</p>
      <div style="width: 100%;">
        <q-btn style="margin-right: 10px" color="red-10" label="Отправить еще" @click="state='ready'" />
        <q-btn color="red-10" label="На главную" @click="fbDataFlush(); state='ready'; $router.push('/')" />
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
    mailregex: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
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
      if (
        this.fbData.mail.length > 3 &&
        this.fbData.mail.length < 71 &&
        this.mailregex.test(this.fbData.mail)
      ) {
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
      } else {
        this.$q.notify({type:'negative', message:'Поле email обязательное'})
      }
      
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
    box-shadow 0 0 3px 1px var(--main-borders-color)
    margin-top 15px
    
    padding 10px
</style>