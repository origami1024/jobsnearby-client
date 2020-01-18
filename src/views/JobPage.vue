<template>
  <div class="jobpage">
    <main class="detailed__main">
      <section class="detailed__line" style="marginBottom: 5px">
        <div class="detailed__col">
          <h1 class="titleHeader">{{job.title}}</h1>
          <p v-if="this.job.salary_max" style="font-size: 16px; color: #666">{{this.job.salary_max}} {{this.currency}}</p>
        </div>
        <div class="detailed__logo">Лого</div>
      </section>
      <section>
        <p><a href="#" class="detailed__author-link">{{job.author}}</a></p>
        <p>{{job.city}}</p>
      </section>
      <!-- <section>
        <button class="detailed__button">Откликнуться</button>
      </section> -->
      <section v-if="job.description">
        <div>
          <q-list dense bordered padding class="rounded-borders">
            <h4 class="detailed__header">Обязанности</h4>
            <q-item clickable v-ripple>
              <q-item-section class="padleft">
                
              <div v-html="job.description">
              </div>
            </q-item-section>
            </q-item>
          </q-list>
        </div>
      </section>
      <section>
        <div>
          <q-list dense bordered padding class="rounded-borders">
            <h4 class="detailed__header">Требования</h4>
            <q-item clickable v-ripple v-if="job.age1 > 0 && job.age2 > 0">
              <q-item-section class="padleft">
                Возраст: {{(job.age1 && job.age1 > 0) ? 'от ' + job.age1 : ''}} {{(job.age2 && job.age2 > 0) ? 'до ' + job.age2 + ' лет': ''}} {{(job.age1 && !job.age2) ? ' лет' : ''}}
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple v-if="job.langs.length > 0">
              <q-item-section class="padleft">
                Языки: {{job.langs.join(', ')}}
              </q-item-section>
            </q-item>

            <q-item v-if="job.edu" clickable v-ripple>
              <q-item-section class="padleft">
                {{job.edu}}
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple v-if="job.experience">
              <q-item-section class="padleft">
                {{job.experience > 0 ? `Минимальный стаж ${job.experience} лет` : 'Без опыта'}}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </section>
      <section>
        <div>
          <q-list dense bordered padding class="rounded-borders">
            <h4 class="detailed__header">Условия работы</h4>
            <q-item clickable v-ripple v-if="salary_deriv">
              <q-item-section class="padleft">
                Оклад {{salary_deriv}} {{currency}}
              </q-item-section>
            </q-item>
            <q-item v-if="job.worktime1 > 0 && job.worktime2 > 0" clickable v-ripple>
              <q-item-section class="padleft">
                График {{job.worktime1}} - {{job.worktime2}}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </section>
      <section>
        <div>
          <q-list dense bordered padding class="rounded-borders">
            <h4 class="detailed__header">Контакты</h4>
            <q-item clickable v-ripple v-if="job.contact_mail">
              <q-item-section class="padleft">
                {{job.contact_mail}}
              </q-item-section>
            </q-item>
            <q-item v-if="job.contact_tel" clickable v-ripple>
              <q-item-section class="padleft">
                {{job.contact_tel}}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </section>
      <section style="display: flex; justifyContent: space-between">
        <p>Всех просмотров: {{job.hits_all || 1}}</p>
        <p>Уникальных просмотров: {{job.hits_uniq || 1}}</p>
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
  mounted(){
    console.log(this.$route.query.id)
    this.getJobData()
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
        } else this.salary_deriv = this.job.salary_max
      } else {
        if (this.job.salary_min < this.job.salary_max) {
          this.salary_deriv = `${this.job.salary_min} - ${this.job.salary_max}`
        } else
        if (this.job.salary_min = this.job.salary_max) {
          this.salary_deriv = `${this.job.salary_max}`
        } else this.salary_deriv = `${this.job.salary_max}`
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
    width: 120px;
    height: 50px;
    box-shadow 0 0 4px 2px #ddd
    line-height 50px
    text-align center
    background-color: coral;
  }
  .detailed__header
    color #2242B4
    margin 10px 10px
    margin-bottom 5px
    font-size 20px
  .padleft
    padding-left 10px
</style>