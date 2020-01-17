<template>
  <div class="jobsstats">
    <div>
      <table>
        <thead>
          <tr>
            <td style="width: 50%">Название</td>
            <td style="width: 10%">Всего просмотров</td>
            <td style="width: 10%">Униальных просмотров</td>
            <td style="width: 10%">Подали резюме</td>
            <td style="width: 10%">Изменить</td>
            <td style="width: 10%">Удалить</td>
          </tr>
        </thead>
        <tr class="jobstat" v-for="item in jobslist" :key="item.job_id">
          <td><a class="link1" :href="'/jobBy.Id?id=' + item.job_id">{{item.title}}</a></td>
          <td>{{item.hits_all}}</td>
          <td>{{item.hits_uniq}}</td>
          <td>0</td>
          <td>
            <q-btn
              icon="edit"
              size="sm"
              color="green"
              round
              @click="$emit('editJob', item.job_id)"
            />
          </td>
          <td>
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
  name: 'JobsStats',
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
.jobsstats
  box-sizing border-box
  width 100%
  min-width 300px
  table
    border-spacing: 0
  thead td
    border-bottom 15px solid transparent

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
  .jobstat
    &:hover
      transition-duration 0.3s
      background-color #359DFD
      color white
      .link1
        color white
  .link1
    text-decoration none
    color #248CEC
    transition-duration 0.6s
</style>
