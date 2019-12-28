<template>
  <div class="jobsfilter">
    <p>Фильтры</p>
    <p>Зарплата:</p>
    <!-- <b-slider :min="lowest" :max="highest" v-model="value" lazy></b-slider> -->
    <q-range
      :key="lowest"
      :value="rangeValues"
      @change="updateAndSave"
      :min="lowest"
      :max="highest"
      label-always
    />
  </div>
</template>

<script>
//панелька справа с выбором фильтрации
import DoubleRange from './../atoms/DoubleRange'
//import 'vue-range-component/dist/vue-range-slider.css'



export default {
  name: 'JobsFilter',
  props: {
    lowest: {type: Number, default: 0},
    highest: {type: Number, default: 99550}
  },
  data: ()=>{return {
    col: 'red',
    value: [1600,2000],
    reinit: true, //when loaded first time - need to set the rangeValues equal to low and high
    rangeValues: {
      min: 1600,
      max: 8000
    },
  }},
  methods: {
    updateAndSave: function(val) {
      this.rangeValues = val
      this.$emit('slideEnd', [val.min, val.max])
    }
  },
  computed: {
    // lthumb: function() {
    //   return this.lowest
    // },
    // rthumb: function() {
    //   return this.lowest
    // },
  },
  mounted: function() {
    
    this.value = [this.lowest, this.highest]
    this.rangeValues.min = this.lowest
    this.rangeValues.max = this.highest
  },
  watch: {
    lowest: function(newl, oldl) {
      if (this.value[0] < newl) this.value[0] = newl
      if (this.value[1] < newl) this.value[1] = newl
      if (this.rangeValues.min < newl) this.rangeValues.min = newl
      if (this.rangeValues.max < newl) this.rangeValues.max = newl
    },
    highest: function(newh, oldh) {
      if (this.value[0] > newh) this.value[0] = newh
      if (this.value[1] > newh) this.value[1] = newh
      if (this.rangeValues.min > newh) this.rangeValues.min = newh
      if (this.rangeValues.max > newh) this.rangeValues.max = newh
      if (this.rangeValues.max = -Infinity) this.rangeValues.max = newh
    }
  },
  components:{
    DoubleRange,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.jobsfilter
  flex 0 1 30%
  #inspire
    padding 20px
  *
    margin 0
  .vuetify-rangeslider
    color black
  .line
    display flex
    justify-content space-between
  .alignRight
    align-self flex-end
</style>
