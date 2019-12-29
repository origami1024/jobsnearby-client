<template>
  <div class="jobslist">
    <div class="line">
      <h3>
        {{msg}} : {{jobslist.length}}
        Отфильтрованные : <strong>{{jobslistFiltered.length}}</strong>
      </h3>
      
      <q-btn-toggle
        v-model="lenses"
        toggle-color="primary"
        size="sm"
        dense
        :options="[ {value: 'short', icon: 'list'},
                    {value: 'full', icon: 'code'},]"
      />
    </div>
    <div>
      <JobCard :lenses="lenses" :searchFilter="searchFilter" :job="item" v-for="item in jobslistFiltered" :key="item.id"></JobCard>
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
    searchFilter: {type: String, default: ''}
  },
  data: ()=>{return {
    lenses: 'full'
  }},
  computed: {
    jobslistFiltered: function() {
      //salary filter
      let filtered = this.jobslist.filter(job=>(job.salary >= this.salaryFilter[0] && job.salary <= this.salaryFilter[1]))

      //lang filter
      if (this.langsFilter.length > 0) {
        filtered = filtered.filter(job=>{
          let result = false
          job.langs.forEach(lang=>{
            if (this.langsFilter.includes(lang)) result = true
          })
          return result
        })
      }
      //text filter
      if (this.searchFilter.length > 1) {
        filtered = filtered.filter(job=>(
          job.title.toLowerCase().includes(this.searchFilter) ||
          job.author.toLowerCase().includes(this.searchFilter)
        ))
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
.jobslist
  .line
    display flex
    align-items center
    border 1px solid gray
    padding 5px
*
  margin 0

</style>
