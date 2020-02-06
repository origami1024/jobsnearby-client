<template>
  <div class="hitslist">
    <div>
      <!-- {{cvhitsHistory}} -->
      
      <table style="width:100%">
        <thead>
          <tr>
            <td style="width: 30%; min-width: 30%; max-width: 30%; text-align: left">Вакансия</td>
            <td style="width: 25%; min-width: 25%; max-width: 25%;">Компания</td>
            <td style="width: 15%; min-width: 15%; max-width: 15%;">Примечания</td>
            <td style="width: 15%; min-width: 15%; max-width: 15%;">Подано</td>
            <td style="width: 15%; min-width: 15%; max-width: 15%;">Просмотрено</td>
          </tr>
        </thead>
        <tr class="jobstat" v-for="item in cvhitsHistory" :key="item.job_id">
          <td style="text-align: left">
            <a class="link1" target="_blank" :href="'/jobpage?id=' + item.job_id">
              {{item.title}}
            </a>
          </td>
          <td>
            {{item.company}}
          </td>
          <td>
            <span v-if="item.is_closed">
              Закрыта
            </span>
          </td>
          <td>
            {{formatDate(item.date_created)}}
          </td>
          <td>
            <span v-if="item.date_checked != null">
              {{formatDate(item.date_checked)}}
            </span>
            <span v-else>
              Нет
            </span>
          </td>
        </tr>
      </table>
      <p v-if="cvhitsHistory.length == 0">Не подано ни на одну должность. Чтобы подать резюме кликните "Подать резюме" на карточке вакансии</p>
    </div>
  </div>
</template>

<script>
//import JobCard from './../molecules/JobCard'

export default {
  name: 'HitsList',
  props: {
    // jobslist: {type: Array, default: ()=>[]},
    // ownCVs: {type: Array, default: ()=>[]},
    cvhitsHistory: {type: Array, default: ()=>[]},
  },
  data: ()=>{return {
  }},
  computed: {
  },
  methods: {
    formatDate(e) {
      let d = new Date(e)
      return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear()
    },
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
    border-spacing 0
  thead td
    border-bottom 15px solid transparent
    font-size 16px
  td
    padding 3px
    font-size 12px
    max-width 85px
    font-size 16px
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
