<template>
  <div v-if="role === 'subscriber'" class="subprofile">
    <p>Личный кабинет</p>
    <div class="subprofile__inner">
      <q-tabs
        align="justify"
        v-model="tab"
        class="bg-primary text-white shadow-2 tabs"
        dense
      >
        <q-tab alert name="cv" icon="book" label="Резюме">
        </q-tab>
        <q-tab disable name="responses" icon="work" label="Отклики">
          <q-badge color="red" floating>0</q-badge>
        </q-tab>
        <q-tab name="starred" icon="star" label="Избранные вакансии">
          <q-badge color="red" floating>10+</q-badge>
        </q-tab>
        <q-tab name="settings" icon="settings" label="Личные данные">
        </q-tab>
      </q-tabs>
      <q-tab-panels
        v-model="tab"
        animated
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel name="cv">
        </q-tab-panel>
        <q-tab-panel name="responses">
        </q-tab-panel>
        <q-tab-panel name="starred">
        </q-tab-panel>
        <q-tab-panel class="subprofile__settings" name="settings">
          <h4>{{username}} {{surname}}</h4>
          <input id="insearc" type="checkbox" :checked="insearch">
          <label for="insearc">Я ищу работу</label>
          <button>Загрузить резюме</button>
          <button disabled="true">Отправить на сервер</button>
          //отклики
          //избранные вакансии
          //оповещения
        </q-tab-panel>
      </q-tab-panels>
    </div>
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
  data: ()=>{return {
    tab: 'settings',
  }},
  components: {
  }
}
</script>

<style scoped lang="stylus">
.subprofile
  display flex
  flex-direction column
  justify-content center
  .tabs
    border-top-left-radius 15px
    border-top-right-radius 15px
    justify-content center
    animation-duration 0.3s
    transition-duration 0.3s
  .subprofile__settings
    //border 2px solid black
    background-color #eee
    display flex
    flex-direction column
    align-items flex-start
    border-bottom-left-radius 15px
    border-bottom-right-radius 15px
  .anim1
    animation-duration 0.3s
    transition-duration 0.3s
  *
    margin 0
</style>
