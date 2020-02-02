<template>
  <div :class="{ jobscard: true, rowedCard: way=='row' }">
    <div class="line">
      <div class="colx">
        <h4 class="cardHeader">
          <!-- <a :href="'/jobBy.Id?id=' + job.job_id" target="_blank"> -->
          <a :href="'/jobpage?id=' + job.job_id" target="_blank">
            <strong v-html="filteredTitle"/>
          </a>
        </h4>
        <a :href="'/companypage?id=' + job.author_id" target="_blank">
          <div class="author" v-html="filteredAuthor"></div>
        </a>
      </div>
      <div class="colx">
        <strong class="alignRight jobcard__salary">
          <p v-if="job.salary_min === job.salary_max && job.salary_min > 0">{{job.salary_max}} {{currency}}</p>
          <p v-else-if="job.salary_min && job.salary_min > 0">от {{job.salary_min}} до {{job.salary_max}} {{currency}}</p>
          <p v-else-if="job.salary_max > 0">{{job.salary_max}} {{currency}}</p>
          <p v-else>По итогам собеседования</p>
        </strong>
        <p class="alignRight city" v-html="filteredCity"></p>
      </div>
    </div>
    <div class="line" style="marginLeft: 5px" v-if="lenses == 'full'">
      <p class="filteredDesc" v-html="filteredDesc"></p>
    </div>
    <div class="line">
      <div>{{
            job.experience == -1 ?
              'Опыт не указан'
            :(1 > job.experience) ?
              'Без опыта'
            :(job.experience >= 1 && 3 > job.experience) ?
              'Опыт: от 1 до 3 лет'
            :(job.experience >= 3 && 5 > job.experience) ?
              'Опыт: от 3 до 5 лет'
            :job.experience >= 5 ?
              'Опыт: от 5 лет'
            : ''
          }}
      </div>
    </div>
    <div class="line">
      <div :class="{ line50: true, spbtw: lenses =='full' }">
        <!-- <a v-if="lenses == 'full' && role != 'company'" class="cardLink" href="#">Подать резюме</a> -->
        <q-btn 
          v-if="lenses == 'full' && role != 'company'" text-color="primary" 
          round size="xs" 
          :icon="cved ? 'assignment_turned_in': 'assignment'"
          @click="$emit('hitcv', job.job_id)">
          <q-tooltip v-if="hitcv">
            <p v-if="(hitcv && hitcv.date_created)" style="font-size: 15px; margin: 0">Отправлено {{hitcv.date_created}}</p>
            <p v-if="(hitcv && hitcv.date_checked)" style="font-size: 15px; margin: 0">Просмотрено {{hitcv.date_checked}}</p>
            <p v-else style="font-size: 15px; margin: 0">Не просмотрено</p>
          </q-tooltip>
        </q-btn>
        <q-btn class="mr-5px" v-else-if="role == 'subscriber'" round size="xs" icon="work"/>
        <a v-if="lenses == 'full'" class="cardLink" @click.prevent="isContactsShown = !isContactsShown" href="#">Контакты</a>
        <q-btn class="mr-5px" v-else round size="xs" @click="isContactsShown = !isContactsShown" icon="people"/>
        <q-btn v-if="showLiked" :text-color="liked ? 'primary' : 'grey'" round size="xs" icon="star" @click="$emit('favOne', job.job_id)"/>
      </div>
      <div v-if="isContactsShown" class="contactsPanel">
        <div>{{job.contact_mail}}</div>
        <div>{{job.contact_tel}}</div>
      </div>
      <div :class="{colx: lenses == 'full', linej: lenses == 'short'}">
        <!-- <div class="circle alignRight"></div> -->
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
const currencyDic = {
  '$': '$',
  'm': 'манат',
  'р': 'руб',
  'e': 'евро'
}
const sexDic = {
  'w': '<li>Женщина</li>',
  'm': '<li>Мужчина</li>',
}

export default {
  name: 'JobCard',
  props: {
    hitcvDateStart: String,
    hitcv: Object,
    hitcvDateEnd: String,
    showLiked: Boolean,
    liked: Boolean,
    cved: Boolean,
    role: String, 
    way: String,
    job: Object,
    searchFilter: {type: String, default: ''},
    lenses: {type: String, default: 'full'},
  },
  data: ()=>{return {
    isContactsShown: false  
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
      return currencyDic[this.job.currency]
    },
    gender() {
      return sexDic[this.job.sex] || ''
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
        let tmpdesc = this.job.description.split('<br>').slice(0,1).join('')
        //console.log(this.job.description)
        let i = tmpdesc.toLowerCase().indexOf(this.searchFilter)
        let res = tmpdesc.substr(0, i) + '<span class="searched">' + tmpdesc.substr(i, this.searchFilter.length) + '</span>' + tmpdesc.substr(i + this.searchFilter.length)
        //console.log(res)
        return this.strip(res)
      } else return this.strip(this.job.description.split('<br>').slice(0,1).join(''))
    },
  },
  methods: {
    strip(html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
*
  margin 0
  text-align left
.jobscard
  position relative
  border-left 2px solid #06f
  padding-left 2px
  //font-family 'Varela Round', sans-serif
  font-size 14px
  //margin-top 10px
  //max-width 300px
  display flex
  flex-direction column
  margin-bottom 10px
  box-sizing border-box
  transition-duration 0.3s
  box-shadow 0 0 2px 1px #dfdfdf
  // &:nth-child(odd)
  //   //border 1px solid black
  //   background-color #efefef
  //   box-shadow 0 0 3px 2px #dfdfdf
  // &:nth-child(even)
  //   background-color #fefefe
  //   box-shadow 0 0 3px 2px #eee
  &:hover
    box-shadow 0 0 2px 1px #bbb
  a
    text-decoration none
    color #06f
    &:visited
      color #06f
  .cardLink:visited
    color #06f//#2837C6
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
.contactsPanel
  position absolute
  left 50%
  bottom 5px
  background-color #ddf
  padding 2px
.jobcard__salary p
  font-size 16px
.filteredDesc
  height 42px
  max-height 42px
  line-height 20px
  font-size 16px
  overflow hidden
  max-width 100%
  padding 5px
  margin-right 10px
  word-break break-all
</style>
