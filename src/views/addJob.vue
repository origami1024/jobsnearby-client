<template>
  <div class="addJob">
    <div v-if="role === 'company'" class="authed">
      тест
      * <q-input dense filled v-model="job.title" label="Название вакансии" :hint="null"/>
      * <q-input dense filled v-model="job.salary_fix" label="Оклад фикс" :hint="null"/>
      или
      <q-input dense filled v-model="job.salary_min" label="От" :hint="null"/>
      <q-input dense filled v-model="job.salary_max" label="До" :hint="null"/>
      <q-toggle v-model="job.salaryOn" label="По итогам собеседования"/>
      Оплата в: 
      <q-btn-toggle
        v-model="job.currency"
        push
        toggle-color="primary"
        :options="[
          {label: '$', value: '$'},
          {label: 'Манаты', value: 'm'},
          {label: 'Рубли', value: 'р'},
          {label: 'Евро', value: 'e'}
        ]"
      />
      Контактные данные
      Город
      Возраст
      График работы
      Требования
        Пол
        Языки
        Образование
        Мин стаж
      Обязанности
      <q-btn color="primary" label="Опубликовать"/>
    </div>
    <div v-else>
      Авторизируйтесь, для возможности загрузки вакансий
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
const config = require('@/configs/main_config')



export default {
  name: 'addJob',
  props: {
    uid: Number,
    authed: {type: Boolean, default: false},
    role: String,
  },
  data() {
    return {
      job: {
        title: '',
        salary_fix: '',
        salary_min: '',
        salary_max: '',
        currency: {label: '$', value: '$'},
        salaryOn: false,
      }
    }
  },
  computed: {
    // myjobslist: function () {
    //   return this.jobslist.filter(job => job.author_id === this.uid)
    // }
  },
  methods:{
  },
  components: {
  }
}
</script>


<style scoped lang="stylus">
.addJob
  width 80%
  padding 5px
  background-color #eee
</style>