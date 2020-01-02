<template>
  <div class="home">
    <p>Последние вакансии:</p>
    <JobsList way="row" :jobslist="featuredJobslist"/>
    <p>Последние вакансии(карусель):</p>
    <q-carousel
      animated
      v-model="slide"
      navigation
      infinite
      autoplay
      transition-prev="slide-right"
      transition-next="slide-left"
    >
      <q-carousel-slide :name="index" v-for="(item, index) in featuredJobslist" :key="item.id">
        <JobCard way="row" :job="item" :key="item.id"/>
      </q-carousel-slide>
    </q-carousel>
    <p>тут популярные профессии/категории и статистика/кол-во по ним</p>    
  </div>
</template>

<script>
// @ is an alias to /src
import JobsList from '@/components/organisms/JobsList.vue'
import JobCard from '@/components/molecules/JobCard.vue'

export default {
  name: 'home',
  props: {
    featuredJobslist: Array
  },
  data: ()=>{return {
    slide: 1
  }},
  components: {
    JobsList,
    JobCard
  }
}
</script>

<style lang="stylus">
.home
  margin 0
  text-align left
  *
    margin 0
</style>