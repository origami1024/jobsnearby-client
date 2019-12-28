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
  },
  computed: {
    jobslistFiltered: function() {
      return this.jobslist.filter(job=>(job.salary >= this.salaryFilter[0] && job.salary <= this.salaryFilter[1]))
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
