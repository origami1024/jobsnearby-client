<template>
  <div class="jobslist">
    <h3>
      {{msg}} : {{jobslist.length}}
      Отфильтрованные : <strong>{{jobslistFiltered.length}}</strong>
    </h3>
    <div>
      <JobCard :job="item" v-for="item in jobslistFiltered" :key="item.id"></JobCard>
    </div>
  </div>
</template>

<script>
import JobCard from './../molecules/JobCard'

export default {
  name: 'JobsList',
  props: {
    msg: String,
    jobslist: {type: Array, default: ()=>[]},
    salaryFilter: {type: Array, default: ()=>[-Infinity, Infinity]},
    sort: String,
    langsFilter: {type: Array, default: ()=>[]},
  },
  computed: {
    jobslistFiltered: function() {
      let filtered = this.jobslist.filter(job=>(job.salary >= this.salaryFilter[0] && job.salary <= this.salaryFilter[1]))
      if (this.langsFilter.length > 0) {
        filtered = filtered.filter(job=>{
          let result = false
          job.langs.forEach(lang=>{
            if (this.langsFilter.includes(lang)) result = true
          })
          return result
        })
      }
      
      let sorted
      if (this.sort == 'salary') {
        sorted = filtered.sort((a,b)=>Number(a.salary) < Number(b.salary) ? 1 : -1)
      } else sorted = filtered
      return sorted
    }
  },
  components:{
    JobCard
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
*
  margin 0

</style>
