<template>
  <div class="jobs">
    <div class="jobs__top">
      <p>Заголовок 1 1 1</p>
    </div>
    <div class="jobs__main">
      <div>
        
        <br>
        <br>
        <JobsList :searchFilter="searchFilter" :langsFilter="langsFilter" :sort="sort" :salaryFilter="salaryVals" :jobslist="jobslist" msg="Все вакансии"/>
      </div>
      <JobsFilter @updSearch="updSearch" :langOptions="langOptions" @updLangs="updLangs" @slideEnd="slideEnd" :highest="maxSal" :lowest="minSal"></JobsFilter>
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
  },
  data: ()=>{return {
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
  .jobs__main
    display flex
    position relative
    // justify-content space-around
  *
    margin 0

</style>
