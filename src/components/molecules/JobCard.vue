<template>
  <div class="jobscard">
    <div class="line">
      <h4 class="cardHeader">
        <strong>{{job.title}}</strong>
      </h4>
      <div>автор: <strong>{{job.author}}</strong></div>
    </div>
    <table>
      <tr>
        <td>Требуемый опыт</td>
        <td>{{job.experience}} месяцев</td>
      </tr>
      <tr>
        <td>Город</td>
        <td>{{job.city}}</td>
      </tr>
      <tr>
        <td>Тип работы</td>
        <td>{{job.jobType}}</td>
      </tr>
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
        <td>от {{job.age1}} до {{job.age2}}</td>
      </tr>
      <tr>
        <td>Описание</td>
        <td>{{job.description}}</td>
      </tr>
    </table>
    <p class="alignRight">Опубликована: {{new Date(job.published).toLocaleDateString()}} в {{new Date(job.published).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'})}}</p>
    <p class="alignRight">Обновлена: {{new Date(job.updated).toLocaleDateString()}} в {{new Date(job.updated).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'})}}</p>
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
  max-width 300px
  display flex
  flex-direction column
  .cardHeader
    font-weight 400
  .line
    display flex
    justify-content space-between
  .alignRight
    align-self flex-end
</style>
