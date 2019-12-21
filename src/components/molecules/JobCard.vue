<template>
  <div class="jobscard">
    <h4>
      {{job.title}}
    </h4>
    <table>
      <tr>
        <td>Зарплата</td>
        <td>{{job.salary}}</td>
      </tr>
      <tr>
        <td>График работы</td>
        <td>с {{job.worktime1}} до {{job.worktime2}}</td>
      </tr>
      <tr>
        <td>Языки</td>
        <td>{{job.langs}}</td>
      </tr>
      <tr>
        <td>Возраст</td>
        <td>{{job.agebracket}}</td>
      </tr>
      <tr>
        <td>Описание</td>
        <td>{{job.description}}</td>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  name: 'JobCard',
  props: {
    job: Object
  },
  data: ()=>{return {
    info: {}
  }},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
*
  margin 0
  text-align left
.jobscard
  margin-top 10px
</style>
