<template>
  <div :class="{ jobscard: true, rowedCard: way=='row' }">
    <div class="line">
      <div class="colx">
        <h4 class="cardHeader">
          <a :href="'/jobBy.Id?id=' + job.job_id" target="_blank">
            <strong v-html="filteredTitle"/>
          </a>
        </h4>
        <div class="author" v-html="filteredAuthor"></div>
      </div>
      <div class="colx">
        <strong class="alignRight">
          <p v-if="job.salary_min === job.salary_max && job.salary_min > 0">{{job.salary_max}} {{currency}}</p>
          <p v-else-if="job.salary_min && job.salary_min > 0">от {{job.salary_min}} до {{job.salary_max}} {{currency}}</p>
          <p v-else-if="job.salary_max > 0">{{job.salary_max}} {{currency}}</p>
          <p v-else>По итогам собеседования</p>
        </strong>
        <p class="alignRight city" v-html="filteredCity"></p>
      </div>
    </div>
    <div class="line" v-if="lenses == 'full'">
      <p v-html="filteredDesc"></p>
    </div>
    <div class="line">
      <div :class="{ line50: true, spbtw: lenses =='full' }">
        <a v-if="lenses == 'full'" class="cardLink" href="#">Откликнуться</a>
        <q-btn class="mr-5px" v-else round size="xs" icon="work"/>
        <a v-if="lenses == 'full'" class="cardLink" href="#">Контакты</a>
        <q-btn class="mr-5px" v-else round size="xs" icon="people"/>
        <q-btn v-if="showLiked" :text-color="liked ? 'primary' : 'grey'" round size="xs" icon="star" @click="$emit('favOne', job.job_id)"/>
      </div>
      <div :class="{colx: lenses == 'full', linej: lenses == 'short'}">
        <div class="circle alignRight"></div>
        <p class="alignRight" v-html="lastUpdated"></p>
      </div>
    </div>
    <!-- <table>
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
     -->
  </div>
</template>

<script>

export default {
  name: 'JobCard',
  props: {
    showLiked: Boolean,
    liked: Boolean,
    way: String,
    job: Object,
    searchFilter: {type: String, default: ''},
    lenses: {type: String, default: 'full'},
  },
  data: ()=>{return {
    info: {},
    currencyDic: {
      '$': '$',
      'm': 'манат',
      'р': 'руб',
      'e': 'евро'
    },
    sexDic: {
      'w': '<li>Женщина</li>',
      'm': '<li>Мужчина</li>',
    },
  }},
  computed: {
    lastUpdated() {
      let d = new Date(this.job.updated)
      let today = new Date()
      let msInDay = 24 * 60 * 60 * 1000
      let diff = (today.getTime() - d.getTime())/msInDay | 0
      let result = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear()
      if (diff == 0) result = '<span class="red">Сегодня</span>'
      else if (diff == 1) result = '<span class="red">Вчера</span>'
      else if (diff < 5) result = `<span class="red">${diff} дня назад</span>`
      return result
    },
    currency() {
      return this.currencyDic[this.job.currency]
    },
    gender() {
      return this.sexDic[this.job.sex] || ''
    },
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
        let tmpdesc = this.job.description.split('/').join('<br>')
        let i = tmpdesc.toLowerCase().indexOf(this.searchFilter)
        let res = tmpdesc.substr(0, i) + '<span class="searched">' + tmpdesc.substr(i, this.searchFilter.length) + '</span>' + tmpdesc.substr(i + this.searchFilter.length)
        //console.log(res)
        return res
      } else return this.job.description.split('/').join('<br>')
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
  font-size 14px
  //margin-top 10px
  //max-width 300px
  display flex
  flex-direction column
  margin-bottom 10px
  box-sizing border-box
  &:nth-child(odd)
    //border 1px solid black
    background-color #efefef
    box-shadow 0 0 3px 2px #dfdfdf
  &:nth-child(even)
    background-color #fefefe
    box-shadow 0 0 3px 2px #eee
  a
    text-decoration none
    color #2837C6
    &:visited
      color #2837C6
  .cardLink:visited
    color #2837C6
  .cardHeader
    font-weight 400
    font-size 20px
    margin-bottom 3px
  .city
    font-size 0.85em
  .author
    font-size 0.9em
  .line
    padding 5px
    display flex
    justify-content space-between
    &:last-child
      margin-bottom 0
  .linej
    display flex
  .line50
    display flex
    align-items center
    min-width 190px
    
  .spbtw
    justify-content space-between
  .mr-5px
    margin-right 5px
  .colx
    display flex
    flex-direction column
  .alignRight
    align-self flex-end
  .circle
    min-width 10px
    max-width 10px
    min-height 10px
    max-height 10px
    background-color lime
    border-radius 100%
    margin 5px
.rowedCard
  margin 10px 5px
  border 1px solid gray
  min-width 220px
</style>
