<template>
  <div class="jobs">
    <div class="search">
      <p>Поиск на сервере(не работает)</p>
      <input type="text">
      <p>Фильтры данных с сервера</p>
      <input type="checkbox" checked>
      <input type="checkbox">
      <input type="checkbox" checked>
    </div>
    <div class="jobs__main">
      <div>
        <div>Сортировка:</div>
        <q-btn-toggle
          v-model="sort"
          toggle-color="primary"
          no-caps
          :options="[
            {label: 'Новые', value: 'time'},
            {label: 'Зарпалата', value: 'salary'},
            {label: 'Что-то', value: 'else'}
          ]"
        />
        <br>
        <br>
        <JobsList :langsFilter="langsFilter" :sort="sort" :salaryFilter="salaryVals" :jobslist="jobslist" msg="Все вакансии"/>
      </div>
      <JobsFilter :langOptions="langOptions" @updLangs="updLangs" @slideEnd="slideEnd" :highest="maxSal" :lowest="minSal"></JobsFilter>
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
    }
  }
}
</script>

<style scoped lang="stylus">
.jobs
  display flex
  flex-direction column
  .jobs__main
    display flex
    justify-content space-around
  *
    margin 0

</style>
