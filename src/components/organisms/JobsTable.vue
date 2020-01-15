<template>
  <div class="jobstable">
    <div>
      <table>
        <thead :style="{backgroundColor: 'black', color: 'white'}">
          <tr>
            <td>Название</td>
            <td>Зарп от</td>
            <td>Зарп до</td>
            <td>Валюта</td>
            <td>Пол</td>
            <td>возр от</td>
            <td>возр до</td>
            <td>время от</td>
            <td>время до</td>
            <td>Языки</td>
            <td>Образ ование</td>
            <td>Стаж</td>
            <td>Город</td>
            <td>Тип р.</td>
            <td>Дополн ительно</td>
            <td>Изменения</td>
          </tr>
        </thead>
        <tr contenteditable="true" v-for="item in jobslist" :key="item.job_id">
          <td>{{item.title}}</td>
          <td>{{item.salary_min}}</td>
          <td>{{item.salary_max}}</td>
          <td>{{item.currency}}</td>
          <td>{{item.sex}}</td>
          <td>{{item.age1}}</td>
          <td>{{item.age2}}</td>
          <td>{{item.worktime1}}</td>
          <td>{{item.worktime2}}</td>
          <td>{{item.langs}}</td>
          <td>{{item.edu}}</td>
          <td>{{item.experience}}</td>
          <td>{{item.city}}</td>
          <td>{{item.jobtype}}</td>
          <td>{{item.description}}</td>
          <td>
            <q-btn
              icon="edit"
              size="sm"
              color="green"
              round
              @click="$emit('editJob', item.job_id)"
            />
            <q-btn
              icon="delete_forever"
              size="sm"
              color="red"
              round
              @click="delThis(item.job_id)"
            />
          </td>
        </tr>
      </table>
      <p v-if="jobslist.length == 0">Нет ни одной вакансии</p>
    </div>
  </div>
</template>

<script>
//import JobCard from './../molecules/JobCard'

export default {
  name: 'JobsTable',
  props: {
    jobslist: {type: Array, default: ()=>[]},
  },
  data: ()=>{return {
  }},
  computed: {
  },
  methods: {
    delThis(jid) {
      this.$emit('delJob', jid)
    }
  },
  components: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
*
  margin 0
.jobstable
  box-sizing border-box
  width 100%
  min-width 300px
  td
    padding 3px
    font-size 12px
    max-width 85px
  .line
    display flex
    align-items center
    border 1px solid gray
    padding 5px
  .rowed
    display flex
    box-sizing border-box
    max-width 100vw
    overflow-x: scroll;

</style>
