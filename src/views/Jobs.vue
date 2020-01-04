<template>
  <div class="jobs">
    <div class="jobs__top-wrapper">
      <div class="jobs__top">
        <q-input
          v-model="txt"
          dense
          
          label="Поиск"
          class="jobsfilter__search"
          :rules="[val => wordRegex.test(val) || 'некорректная строка поиска']"
          @keyup.enter="refreshPlus"
          hint="Поиск по полям название, автор, город, основной текст"
        >
          <template v-if="txt" v-slot:append>
            <q-icon name="cancel" @click.stop="txt = ''" class="cursor-pointer" />
          </template>
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn @click="refreshPlus" color="primary" :loading="pending" class="jobsfilter__search-btn">Поиск</q-btn>
      </div>
    </div>
    <div class="jobs__main">
      <div>
        <div class="jobs__filterpart">
          <JobsFilter :txt="txt" @perPageUpd="perPageUpd" :pending="pending" @refresh="$emit('refresh')" @updQue="updQue" @updSearch="updSearch" :langOptions="langOptions" @updLangs="updLangs" @slideEnd="slideEnd" :highest="maxSal" :lowest="minSal"></JobsFilter>
        </div>
      </div>
      <div class="jobs__contents">
        <div class="line">
          Страница
          <q-pagination
            :value="page_current"
            :max="pages"
            :disable="pending"
            @input="switchPage"
            size="sm"
          />
          <p>Показано {{jobslist.length}} из {{jobsFullcount}}</p>
          <q-btn-toggle
            v-model="lenses"
            toggle-color="primary"
            size="sm"
            dense
            :options="[ {value: 'short', icon: 'list'},
                        {value: 'full', icon: 'code'},]"
          />
        </div>
        <JobsList :lenses="lenses" :searchFilter="searchFilter" :jobslist="jobslist" msg="Полученные"/>
        <q-pagination
          :value="page_current"
          :max="pages"
          :disable="pending"
          @input="switchPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import JobsList from '@/components/organisms/JobsList.vue'
import JobsFilter from '@/components/organisms/JobsFilter.vue'

export default {
  name: 'Jobs',
  props: {
    jobslist: Array,
    pending: {type: Boolean, default: false},
    pages: {type: Number, default: 1},
    page_current: {type: Number, default: 1},
    jobsFullcount: {type: Number, default: 0}
  },
  data: ()=>{return {
    lenses: 'full',
    txt: '',
    wordRegex: /^[\wа-яА-ЯÇçÄä£ſÑñňÖö$¢Üü¥ÿýŽžŞş\s\\-]*$/,
    sort: 'time',//time, salary, else
    searchFilter: '',
    salaryVals: [-Infinity, Infinity],
    langsFilter: [],
    maxSal: 100000,
    minSal: 0,
    langOptions: ["Русский", "Английский", "Немецкий", "Французкий"],
  }},
  components: {
    JobsFilter,
    JobsList
  },
  computed: {
    maxSalary: function() {
      if (this.jobslist.length == 0) {return 100000} else
      return Math.max.apply(Math, this.jobslist.map(function(o) { return o.salary }))
    },
    minSalary: function() {
      if (this.jobslist.length == 0) return 0
      return Math.min.apply(Math, this.jobslist.map(function(o) { return o.salary }))
    }
  },
  watch: {
    jobslist: function(newj, oldj) {
      let max1 = Math.max.apply(Math, newj.map(function(o) { return o.salary }))
      let min1 = Math.min.apply(Math, newj.map(function(o) { return o.salary }))
      this.maxSal = max1 + ((max1 - min1) / 10) | 0
      this.minSal = min1 - ((max1 - min1) / 10) | 0
      this.salaryVals = [this.minSal, this.maxSal]
      this.langOptions = Array.from(new Set(this.jobslist.flatMap(j=>j.langs)))
    }
  },
  mounted: function() {
    let max1 = Math.max.apply(Math, this.jobslist.map(function(o) { return o.salary }))
    let min1 = Math.min.apply(Math, this.jobslist.map(function(o) { return o.salary }))
    this.maxSal = max1 + ((max1 - min1) / 10) | 0
    this.minSal = min1 - ((max1 - min1) / 10) | 0
  },
  methods: {
    refreshPlus(){
      this.searchFilter = this.txt.toLowerCase()
      this.$emit('refresh')
    },
    slideEnd: function(vals) {
      console.log('cp10: ', vals)
      this.salaryVals = vals
    },
    updLangs: function(vals) {
      console.log('cp11: ', vals)
      this.langsFilter = vals
    },
    updSearch: function(str) {
      this.searchFilter = str
    },
    updQue: function(params) {
      console.log('cpUpdQue1: ', params)
      this.$emit('updQue', params)
    },
    perPageUpd(e) {
      this.$emit('perPageUpd', e)
    },
    switchPage(newV) {
      //console.log('cpi ', newV)
      this.$emit('refresh', 'page', newV)
    }
  }
}
</script>

<style scoped lang="stylus">
.jobs
  display flex
  flex-direction column
  position relative
  padding 0px 10px
  .jobs__top-wrapper
    z-index 1
    background #fff
    position sticky
    top 0px
    padding-top 10px
    box-sizing border-box
    margin-bottom 15px
  .jobs__top
    background-color #f7f7f7
    display flex
    margin 0
    padding 10px 15px
    box-sizing border-box
    box-shadow 0 0 3px 0px #a0a9
    border-radius 15px
  .jobs__filterpart
    position sticky
    top 105px
    display flex
    margin-right 25px
  .jobsfilter__search
    width 100%
    margin-right 5px
  .jobsfilter__search-btn
    align-self flex-start
  .jobs__main
    display flex
    position relative
    // justify-content space-around
  .jobs__contents
    width 100%
  *
    margin 0
  .line
    display flex
    justify-content space-between
    align-items center

</style>
