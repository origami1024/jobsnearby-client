<template>
  <div :class="{ jobscard: true, rowedCard: way=='row' }">
    <div class="line">
      <h4 class="cardHeader">
        <a :href="'/jobBy.Id?id=' + job.job_id">
          <strong v-html="filteredTitle"/>
        </a>
      </h4>
      <div>автор: <strong v-html="filteredAuthor"></strong></div>
    </div>
    <table>
      <tr v-if="lenses == 'full'">
        <td>Требуемый опыт</td>
        <td>{{job.experience}} месяцев</td>
      </tr>
      <tr>
        <td>Город</td>
        <td v-html="filteredCity"></td>
      </tr>
      <tr v-if="lenses == 'full'">
        <td>Тип работы</td>
        <td>{{job.jobType}}</td>
      </tr>
      <tr>
        <td>Зарплата</td>
        <td v-if="job.salary_min">от {{job.salary_min}} до {{job.salary_max}}</td>
        <td v-else>{{job.salary_max}}</td>
      </tr>
      <tr v-if="lenses == 'full'">
        <td>График работы</td>
        <td>с {{job.worktime1}} до {{job.worktime2}}</td>
      </tr>
      <tr v-if="lenses == 'full'">
        <td>Языки</td>
        <td>{{job.langs}}</td>
      </tr>
      <tr v-if="lenses == 'full'">
        <td>Возраст</td>
        <td>от {{job.age1}} до {{job.age2}}</td>
      </tr>
      <tr v-if="lenses == 'full'">
        <td>Описание</td>
        <td v-html="filteredDesc"></td>
      </tr>
    </table>
    <p class="alignRight">Опубликована: {{new Date(job.published).toLocaleDateString()}} в {{new Date(job.published).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'})}}</p>
    <p class="alignRight">Обновлена: {{new Date(job.updated).toLocaleDateString()}} в {{new Date(job.updated).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'})}}</p>
    <!-- <div v-html="filteredTitle"></div> -->
  </div>
</template>

<script>

export default {
  name: 'JobCard',
  props: {
    way: String,
    job: Object,
    searchFilter: {type: String, default: ''},
    lenses: {type: String, default: 'full'},
  },
  data: ()=>{return {
    info: {}
  }},
  computed: {
    filteredTitle: function() {
      if (this.searchFilter.length > 1 && this.job.title.toLowerCase().includes(this.searchFilter)) {
        let i = this.job.title.toLowerCase().indexOf(this.searchFilter)
        return this.job.title.substr(0, i) + 
        '<span class="searched">' + this.job.title.substr(i, this.searchFilter.length) + '</span>' + 
        this.job.title.substr(i + this.searchFilter.length)
      } else return this.job.title
    },
    filteredAuthor: function() {
      if (this.searchFilter.length > 1 && this.job.author.toLowerCase().includes(this.searchFilter)) {
        let i = this.job.author.toLowerCase().indexOf(this.searchFilter)
        return this.job.author.substr(0, i) + 
        '<span class="searched">' + this.job.author.substr(i, this.searchFilter.length) + '</span>' + 
        this.job.author.substr(i + this.searchFilter.length)
      } else return this.job.author
    },
    filteredCity: function() {
      if (this.searchFilter.length > 1 && this.job.city.toLowerCase().includes(this.searchFilter)) {
        let i = this.job.city.toLowerCase().indexOf(this.searchFilter)
        return this.job.city.substr(0, i) + 
        '<span class="searched">' + this.job.city.substr(i, this.searchFilter.length) + '</span>' + 
        this.job.city.substr(i + this.searchFilter.length)
      } else return this.job.city
    },
    filteredDesc: function() {
      if (this.searchFilter.length > 1 && this.job.description.toLowerCase().includes(this.searchFilter)) {
        let i = this.job.description.toLowerCase().indexOf(this.searchFilter)
        return this.job.description.substr(0, i) + 
        '<span class="searched">' + this.job.description.substr(i, this.searchFilter.length) + '</span>' + 
        this.job.description.substr(i + this.searchFilter.length)
      } else return this.job.description
    },
  }
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
.rowedCard
  margin 10px 5px
  border 1px solid gray
  min-width 220px
</style>
