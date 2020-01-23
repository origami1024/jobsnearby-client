<template>
  <div class="jobpage">
    <main class="detailed__main">
      <section class="detailed__line" style="marginBottom: 5px">
        <div class="detailed__col">
          <h1 class="titleHeader">{{cdata.company}}</h1>
          <div style="width: 100%">
            <p>
              {{cdata.website}}
            </p>
          </div>
        </div>
        <div class="detailed__logo" :style="{'background-image': 'url(' + cdata.logo_url + ')'}" >{{cdata.logo_url == '' || !cdata.logo_url ? 'logo placeholder' : ''}}</div>
      </section>
      <section>
        <q-list dense bordered padding class="rounded-borders" v-if="cdata.domains.length > 0">
          <h4 class="detailed__header">Сферы деятельности компании</h4>
          <q-item clickable  v-if="cdata.domains[0]">
            <q-item-section class="padleft">
              {{cdata.domains[0]}}
            </q-item-section>
          </q-item>
          <q-item clickable  v-if="cdata.domains[1]">
            <q-item-section class="padleft">
              {{cdata.domains[1]}}
            </q-item-section>
          </q-item>
          <q-item clickable  v-if="cdata.domains[2]">
            <q-item-section class="padleft">
              {{cdata.domains[2]}}
            </q-item-section>
          </q-item>
        </q-list>
      </section>
      <section>
        <div>
          <q-list dense bordered padding class="rounded-borders" v-if="cdata.full_description.length > 0">
            <h4 class="detailed__header">Описание</h4>
            <q-item clickable >
              <q-item-section class="padleft">
              <div class="descriptionHTML">
                {{cdata.full_description}}
              </div>
            </q-item-section>
            </q-item>
          </q-list>
        </div>
      </section>
      <section style="display: flex; justifyContent: space-between">
        <p>Размещено вакансий: {{cdata.jobs_count > 0 ? cdata.jobs_count : 1}}</p>
        <p>Зарегистрирована: {{created}}</p>
      </section>
    </main>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
const config = require('./../configs/main_config')

export default {
  name: 'companypage',
  props: {
    
  },
  data: ()=>{return {
    cdata: {
      company: '',
      logo_url: '',
      domains: [], //3max
      website: '',
      full_description: '',
      time_created: '',
      jobs_count: 0
    },
    ajaxLoading: false
  }},
  mounted() {
    console.log(this.$route.query.id)
    this.getCompanyData()
  },
  computed: {
    created() {
      let d = new Date(this.cdata.time_created)
      return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear()
    }
  },
  methods: {
    getCompanyData() {
      let companyUrl = config.jobsUrl + '/companyby.idjson=' + this.$route.query.id
        this.ajaxLoading = true
        axios
          .get(companyUrl, null, {headers: {'Content-Type' : 'application/json' }})
          .then(response => {
            //getting the one page data
            console.log('cpJJ2', response.data)
            this.cdata = response.data
            //this.setVariables()
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
    //box-shadow 0 0 4px 2px #ddd
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
    word-wrap break-word
    max-width 100%
  .ql-size-small
    font-size 12px
  .ql-size-large
    font-size 20px
  .salary-deriv::first-letter
    text-transform uppercase
</style>