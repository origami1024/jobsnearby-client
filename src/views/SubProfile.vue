<template>
  <div v-if="role === 'subscriber'" class="subprofile">
    <div class="subprofile__header">
      <q-toggle
        :label="insearch === true ? 'Я ищу работу' : 'Я не ищу работу'"
        color="purple"
        v-model="insearch"
      />
    </div>
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
          <div>
            <q-toggle v-model="editable" :label="editable === true ? 'Редактирование разрешено' : 'Редактирование запрещено'"/>
          </div>
          <q-input outlined bottom-slots v-model="newusername" label="Имя" counter maxlength="60" :readonly="!editable" />
          <q-input outlined bottom-slots v-model="newsurname" label="Фамилия" counter maxlength="60" :readonly="!editable" />
          <q-input outlined bottom-slots v-model="newemail" label="Email" counter maxlength="50" :readonly="!editable" />
          <h4>{{username}} {{surname}}</h4>
          <button>Загрузить резюме</button>
          <button disabled="true">Отправить на сервер</button>
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
    newusername: '',
    newsurname: '',
    newemail: '',
    tab: 'settings',
    editable: false
  }},
  components: {
  },
  mounted(){
  }
}
</script>

<style scoped lang="stylus">
.subprofile
  display flex
  flex-direction column
  justify-content center
  &__header
    display flex
    justify-content flex-end
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
