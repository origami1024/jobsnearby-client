<template>
  <div class="feedback">
    <div class="fb_inner">
      <br>
      <q-input outlined label="Тема"/>
      <br>
      <q-input outlined label="Ваше имя"/>
      <br>
      <q-input outlined label="Ваш Email"/>
      <br>
      <q-input 
        maxlength="500"
        counter
        outlined
        type="textarea"
        label="Текст"
      />
      <q-btn color="primary" label="Отправить"/>
    </div>
  </div>
</template>

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