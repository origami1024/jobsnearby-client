<template>
  <div class="jobslist">
    <!-- <div class="line" v-if="way!=='row'">
      <h3>
        {{msg}} : {{jobslist.length}}
        Отфильтрованные : <strong>{{jobslistFiltered.length}}</strong>
      </h3>
    </div> -->
    <div :class="{ rowed: way=='row' }">
      <JobCard :liked="likedJobs.includes(item.job_id)" @favOne="favOne" :way="way" :lenses="lenses" :searchFilter="searchFilter" :job="item" v-for="item in jobslistFiltered" :key="item.job_id"></JobCard>
      <p v-if="jobslist.length == 0">Нет ни одной вакансии</p>
    </div>
  </div>
</template>

<script>
import JobCard from './../molecules/JobCard'

export default {
  name: 'JobsList',
  props: {
    likedJobs: Array,
    lenses: String,
    way: String,
    msg: String,
    jobslist: {type: Array, default: ()=>[]},
    //salaryFilter: {type: Array, default: ()=>[-Infinity, Infinity]},
    sort: String,
    langsFilter: {type: Array, default: ()=>[]},
    searchFilter: {type: String, default: ''}
  },
  data: ()=>{return {
  }},
  computed: {
    jobslistFiltered: function() {
      //salary filter
      let filtered = this.jobslist.map(job=>{
        !job.city ? job.city='': null
        !job.description ? job.description='': null
        return job
      })
      
      let sorted
      if (this.sort == 'salary') {
        sorted = filtered.sort((a,b)=>Number(a.salary) < Number(b.salary) ? 1 : -1)
      } else sorted = filtered
      return sorted
    }
  },
  methods: {
    favOne(id) {
      this.$emit('favOne', id)
    }
  },
  components: {
    JobCard
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.jobslist
  .line
    display flex
    align-items center
    border 1px solid gray
    padding 5px
  .rowed
    display flex
    box-sizing border-box
    max-width 100vw
    overflow-x: scroll;
    
*
  margin 0

</style>
