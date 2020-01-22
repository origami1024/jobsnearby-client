<template>
  <div class="jobpage">
    <main class="detailed__main">
      <section class="detailed__line" style="marginBottom: 5px">
        <div class="detailed__col">
          <h1 class="titleHeader">{{job.title}}</h1>
          <p class="salary-deriv" style="font-size: 16px; color: #666">{{salary_deriv}}</p>
        </div>
        <div class="detailed__logo" :style="{'background-image': 'url(' + job.logo_url + ')'}" >{{job.logo_url == '' || !job.logo_url ? 'logo placeholder' : ''}}</div>
      </section>
      <section>
        <p><a href="#" class="detailed__author-link">{{job.author}}</a></p>
        <p>{{job.city}}</p>
      </section>
      <!-- <section>
        <button class="detailed__button">Откликнуться</button>
      </section> -->
      <section>
        <div>
          <q-list dense bordered padding class="rounded-borders">
            <h4 class="detailed__header">Требования</h4>
            <q-item clickable v-if="job.experience >= 0">
              <q-item-section class="padleft">
                {{
                  job.experience == 0 ?
                    'Без опыта'
                  :job.experience == 2 ?
                    'Опыт: от 1 до 3 лет'
                  :job.experience == 4 ?
                    'Опыт: от 3 до 5 лет'
                  :job.experience == 6 ?
                    'Опыт: от 5 лет'
                  : ''
                }}
              </q-item-section>
            </q-item>
            <q-item clickable v-if="job.age1 > 0 || job.age2 > 0">
              <q-item-section class="padleft">
                Возраст:{{job.age1 > 0 ? ' от ' + job.age1 : ''}}{{job.age2 > 0 ? ' до ' + job.age2 : ''}} лет
              </q-item-section>
            </q-item>
            <q-item v-if="job.edu" clickable >
              <q-item-section class="padleft">
                Образование: {{job.edu}}
              </q-item-section>
            </q-item>
            <q-item clickable v-if="job.langs && job.langs.length > 0">
              <q-item-section class="padleft">
                Языки: {{job.langs.join(', ')}}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </section>
      <section>
        <div>
          <q-list dense bordered padding class="rounded-borders">
            <h4 class="detailed__header">Условия работы</h4>
            <q-item clickable  v-if="salary_deriv">
              <q-item-section class="padleft">
                Оклад {{salary_deriv}}
              </q-item-section>
            </q-item>
            <q-item v-if="(job.worktime1 > 0 && job.worktime2 > 0) || job.schedule" clickable >
              <q-item-section class="padleft">
                График работы: {{job.schedule}} {{job.worktime1 ? 'с ' + job.worktime1 : ''}} {{job.worktime2 ? 'до ' + job.worktime2 : ''}}
              </q-item-section>
            </q-item>
            <q-item clickable >
              <q-item-section class="padleft">
                Вакансия {{job.jobtype == 'c' ? 'постоянная' : 'временная'}}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </section>
      <section v-if="job.description">
        <div>
          <q-list dense bordered padding class="rounded-borders">
            <h4 class="detailed__header">Описание</h4>
            <q-item clickable >
              <q-item-section class="padleft">
                
              <div class="descriptionHTML" v-html="job.description">
              </div>
            </q-item-section>
            </q-item>
          </q-list>
        </div>
      </section>
      <section>
        <div>
          <q-list dense bordered padding class="rounded-borders">
            <h4 class="detailed__header">Контакты</h4>
            <q-item clickable  v-if="job.contact_mail">
              <q-item-section class="padleft">
                {{job.contact_mail}}
              </q-item-section>
            </q-item>
            <q-item v-if="job.contact_tel" clickable >
              <q-item-section class="padleft">
                {{job.contact_tel}}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </section>
      <section style="display: flex; justifyContent: space-between">
        <p>Всех просмотров: {{job.hits_all > 0 ? job.hits_all : 1}}</p>
        <p>Уникальных просмотров: {{job.hits_uniq > 0 ? job.hits_uniq : 1}}</p>
      </section>
      <section style="display: flex; justifyContent: space-between">
        <p>Дата публикации: {{published}}</p>
        <p>Последние изменения: {{updated}}</p>
      </section>
    </main>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
const config = require('./../configs/main_config')

let currencydic = {
  '$': '$',
  'm': 'манат',
  'р': 'руб',
  'e': 'евро'
}
let sexdic = {
  'w': '<li>Женщина</li>',
  'm': '<li>Мужчина</li>',
}

export default {
  name: 'jobpage',
  props: {
    
  },
  data: ()=>{return {
    job: {},
    currency: 'манат',
    //salary_subtitle: '',
    salary_deriv: '',
    //langs: [],
  }},
  mounted() {
    console.log(this.$route.query.id)
    this.getJobData()
  },
  computed: {
    updated() {
      let d = new Date(this.job.updated)
      return 'в ' + ("0" + d.getHours()).slice(-2) + ':' + ("0" + d.getMinutes()).slice(-2) + ', ' + d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear()
    },
    published() {
      let d = new Date(this.job.published)
      return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear()
    }
  },
  methods: {
    getJobData() {
      let jobUrl = config.jobsUrl + '/jobby.idjson=' + this.$route.query.id
        this.ajaxLoading = true
        axios
          .get(jobUrl, null, {headers: {'Content-Type' : 'application/json' }})
          .then(response => {
            //getting the one page data
            console.log('cpJJ1', response.data)
            this.job = response.data
            this.setVariables()
            this.ajaxLoading = false
            
          })
    },
    setVariables() {
      this.currency = currencydic[this.job.currency]
      //this.salary_subtitle = this.job.salary_max ? `<p style="font-size: 20px">${this.job.salary_max} ${this.currency}</p>` : ''
      
      if (this.job.salary_min < 1) {
        if (this.job.salary_max < 1) {
          this.salary_deriv = 'по итогам собеседования'
        } else this.salary_deriv = this.job.salary_max + ' ' + this.currency
      } else {
        if (this.job.salary_min < this.job.salary_max) {
          this.salary_deriv = `${this.job.salary_min} - ${this.job.salary_max}` + ' ' + this.currency
        } else
        if (this.job.salary_min = this.job.salary_max) {
          this.salary_deriv = `${this.job.salary_max}` + ' ' + this.currency
        } else this.salary_deriv = `${this.job.salary_max}` + ' ' + this.currency
      }
    }
  }
}
</script>

<style lang="stylus">
* {
    margin: 0;
    font-family: 'Varela Round', 'Nunito', sans-serif;
  }
  .detailed__main
    width: 80%;
    max-width: 850px;
    background-color: white;
    padding: 0 10px;
    padding-top: 10px;
    
    box-sizing: border-box;
    box-shadow: 0 0 2px 3px #eee;
    display flex
    flex-direction column
    
    margin 0 auto
    margin-top 15px
    //border 1px solid black
    .titleHeader
      font-size 24px !important
      margin-top 8px
  section
    margin-bottom 15px
    text-align left
    padding-bottom 5px
    p
      margin-bottom 0
    li
      margin 5px 0
  .detailed__button {
    background-color: #B4E873;
    padding: 5px;
    border: 0;
    font-size: 20px;
    cursor: pointer;
  }
  .detailed__button:hover {
    color: white;
  }
  .detailed__author-link{
    color: #0CA0DF;
  }
  .detailed__line {
    display: flex;
    justify-content: space-between;
  }
  .detailed__col{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
  }
  .detailed__logo{
    box-shadow 0 0 4px 2px #ddd
    text-align center
    width 150px
    height 50px
    background-size 150px 50px
    background-color coral
    line-height 50px
  }
  .detailed__header
    color #2242B4
    margin 10px 10px
    margin-bottom 5px
    font-size 20px
  .padleft
    padding-left 10px
  .descriptionHTML
    font-size 14px
    line-height 1.1
  .ql-size-small
    font-size 12px
  .ql-size-large
    font-size 20px
  .salary-deriv::first-letter
    text-transform uppercase
</style>