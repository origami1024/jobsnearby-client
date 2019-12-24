<template>
  <div v-if="role === 'subscriber'" class="subprofile">
    <p>Личный кабинет</p>
    <h4>{{username}} {{surname}}</h4>
    <input id="insearc" type="checkbox" :checked="insearch">
    <label for="insearc">Я ищу работу</label>
    <button>Загрузить резюме</button>
    <button disabled="true">Отправить на сервер</button>
    //отклики
    //избранные вакансии
    //оповещения
  </div>
</template>

<script>
export default {
  name: 'SubProfile',
  props: {
    username: {type: String, default: ''},
    surname: {type: String, default: ''},
    insearch: {type: Boolean, default: false},
    role: String
  },
  components: {
  }
}
</script>

<style lang="stylus">
.subprofile
  display flex
  flex-direction column
  align-items flex-start
  *
    margin 0
</style>
