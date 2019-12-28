<template>
  <div class="jobsfilter">
    <p class="header">Фильтры</p>
    <br>
    <p>Фильтр полученных данных по тексту(не работает):</p>
    <input type="text">
    <br>
    <br>
    <p>Зарплата:</p>
    <q-range
      :key="lowest"
      :value="rangeValues"
      @change="updateAndSave"
      :min="lowest"
      :max="highest"
      label-always
    />
    <br>
    <p>Языки:</p>
    <q-select
      clearable
      multiple
      use-chips
      label="Подходящие языки"
      v-model="langsSelected"
      :options="langOptions"
      @input="updateLangs"
      
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
    highest: {type: Number, default: 99550},
    langOptions: {type: Array, default: ()=>[]},
  },
  data: ()=>{return {
    col: 'red',
    value: [1600,2000],
    reinit: true, //when loaded first time - need to set the rangeValues equal to low and high
    rangeValues: {
      min: 1600,
      max: 8000
    },
    langsSelected: [],
    //langOptions: ["Русский", "Английский", "Немецкий", "Французкий"],
  }},
  methods: {
    updateAndSave: function(val) {
      this.rangeValues = val
      this.$emit('slideEnd', [val.min, val.max])
    },
    updateLangs: function(val) {
      if (val==null) {
        this.$emit('updLangs', [])
      } else this.$emit('updLangs', val)
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
  flex 0 1 35%
  max-width 400px
  border 1px solid black
  padding 15px
  .header
    background-color #ddd
  *
    margin 0
  .line
    display flex
    justify-content space-between
  .alignRight
    align-self flex-end
</style>
