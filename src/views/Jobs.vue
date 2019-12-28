<template>
  <div class="jobs">
    <div>
      <div>Сортировка: Новые | Зарплата нисх | Наибольшее совпадение</div>
      <JobsList :salaryFilter="salaryVals" :jobslist="jobslist" msg="Все вакансии"/>
    </div>
    <JobsFilter @slideEnd="slideEnd" :highest="maxSal" :lowest="minSal"></JobsFilter>
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
    salaryVals: [0, 1000],
    maxSal: 100000,
    minSal: 0,
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
      this.maxSal = max1 + ((max1 - min1) / 10)
      this.minSal = min1 - ((max1 - min1) / 10)
      this.salaryVals = [this.minSal, this.maxSal]
    }
  },
  mounted: function() {
    let max1 = Math.max.apply(Math, this.jobslist.map(function(o) { return o.salary }))
    let min1 = Math.min.apply(Math, this.jobslist.map(function(o) { return o.salary }))
    this.maxSal = max1 + ((max1 - min1) / 10)
    this.minSal = min1 - ((max1 - min1) / 10)
  },
  methods: {
    slideEnd: function(vals) {
      console.log('cp10: ', vals)
      this.salaryVals = vals
    }
  }
}
</script>

<style scoped lang="stylus">
.jobs
  display flex
  justify-content space-around
  *
    margin 0

</style>
