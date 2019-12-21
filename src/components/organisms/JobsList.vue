<template>
  <div class="jobslist">
    <h3>
      {{msg}} : {{jobslist.length}}
    </h3>
    <hr>
    <div>
      <JobCard :job="item" v-for="item in jobslist" :key="item.id"></JobCard>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import JobCard from './../molecules/JobCard'

export default {
  name: 'JobsList',
  props: {
    msg: String,
    jobslist: {type: Array, default: ()=>[]}
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
