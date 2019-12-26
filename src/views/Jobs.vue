<template>
  <div class="jobs">
    <div>
      <div>Сортировка: Новые | Зарплата нисх | Наибольшее совпадение</div>
      <JobsList :jobslist="jobslist" msg="Все вакансии"/>
    </div>
    <JobsFilter></JobsFilter>
  </div>
</template>

<script>
// @ is an alias to /src
import JobsList from '@/components/organisms/JobsList.vue'
import JobsFilter from '@/components/organisms/JobsFilter.vue'

export default {
  name: 'Jobs',
  props: {
    jobslist: Array
  },
  components: {
    JobsFilter,
    JobsList
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
