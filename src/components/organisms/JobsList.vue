<template>
  <div class="jobslist">
    <!-- <div class="line" v-if="way!=='row'">
      <h3>
        {{msg}} : {{jobslist.length}}
        Отфильтрованные : <strong>{{jobslistFiltered.length}}</strong>
      </h3>
    </div> -->
    <div :class="{ rowed: way=='row' }">
      <JobCard
        :cved="ownCVs.map(v=>v.cvjob_id).includes(item.job_id)"
        :hitcv="ownCVs.find(v=>v.cvjob_id == item.job_id)"
        :role="role" :showLiked="showLiked" 
        :liked="likedJobs.includes(item.job_id)" 
        @favOne="favOne" @hitcv="hitcv" :way="way" :lenses="lenses" :searchFilter="searchFilter" :job="item" v-for="item in jobslistFiltered" :key="item.job_id">
        </JobCard>
      <p v-if="jobslist.length == 0 && searchFilter == ''">Нет ни одной вакансии</p>
      <p v-else-if="jobslist.length == 0 && searchFilter != ''">на ваш запрос "{{searchFilter}}" ничего не найдено</p>
    </div>
  </div>
</template>

<script>
import JobCard from './../molecules/JobCard'

export default {
  name: 'JobsList',
  props: {
    showLiked: Boolean,
    likedJobs: {type: Array, default: ()=>[]},
    ownCVs: {type: Array, default: ()=>[]},
    lenses: String,
    way: String,
    msg: String,
    role: String,
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
      console.log('favOne Click from jobsList')
      this.$emit('favOne', id)
    },
    hitcv(id) {
      this.$emit('hitcv', id)
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
  box-sizing border-box
  width 100%
  min-width 300px
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
