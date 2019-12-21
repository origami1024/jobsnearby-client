<template>
  <div class="jobs">
    <JobsList :jobslist="jobslist" msg="Все вакансии"/>
  </div>
</template>

<script>
// @ is an alias to /src
import JobsList from '@/components/organisms/JobsList.vue'

export default {
  name: 'jobs',
  props: {
    jobslist: Array
  },
  components: {
    JobsList
  }
}
</script>
