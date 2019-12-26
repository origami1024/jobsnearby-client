<template>
  <div class="jobsfilter">
    <p>Зарплата:</p>
    <DoubleRange></DoubleRange>
  </div>
</template>

<script>
//панелька справа с выбором фильтрации
import DoubleRange from './../atoms/DoubleRange'

export default {
  name: 'JobsFilter',
  props: {
  },
  data: ()=>{return {
  }},
  components:{
    DoubleRange
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.jobsfilter
  flex 0 1 30%
  *
    margin 0
  .line
    display flex
    justify-content space-between
  .alignRight
    align-self flex-end
</style>
