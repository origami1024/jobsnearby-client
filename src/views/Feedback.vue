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
      Успешно отправлено, / ошибка
      отправить еще
      вернуться на главную
    </div>
  </div>
</template>

<script>
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
    sendFB() {
      console.log(this.fbData)
    }
  }
}
</script>

<style scoped lang="stylus">
.feedback
  max-width 620px
  width 620px
  .fb_inner
    border-radius 5px
    box-shadow 0 0 3px 2px #a0a4
    margin-top 15px
    background-color #eee
    padding 10px
</style>