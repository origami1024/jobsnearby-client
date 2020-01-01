<template>
  <div class="jobsfilter">
    <p :style="{maxWidth: '330px'}">query: {{query}}</p>
    <button @click="resetFields">Сбросить фильтры</button>
    <p class="header">Поиск</p>
    <p>Фильтр полученных данных по тексту(название, автор, город, описание):</p>
    <div class="line">
      <!-- <input type="text" v-model="txt" class="jobsfilter__search"> -->
      <q-input
        v-model="txt"
        filled
        dense
        label="Поиск"
        class="jobsfilter__search"
        :rules="[val => /^[\wа-яА-Я\s]*$/.test(val) || 'некорректная строка поиска']"
        @keyup.enter="refreshPlus"
      />
      <q-btn @click="refreshPlus" icon="search" color="primary" :loading="pending" class="jobsfilter__search-btn"></q-btn>
    </div>
    <!-- <Throttle :time="350" events="input" :isDebounce="true">
      <input type="text" :value="search" @input="searchUpd" class="jobsfilter__search">
    </Throttle> -->
    <div class="line">
      <div class="borders">
        <p class="header">Сортировка</p>
        <q-btn-toggle
          size="sm"
          v-model="sort"
          toggle-color="primary"
          no-caps
          dense
          :options="[
            {label: 'Новые', value: 'new'},
            {label: 'Зарплата-убыв', value: 'saldesc'},
            {label: 'Зарплата-возр', value: 'salasc'}
          ]"
        />
      </div>
      <div class="borders">
        <p class="header">Данные за</p>
        <q-btn-toggle
          size="sm"
          v-model="timerange"
          toggle-color="primary"
          no-caps
          dense
          :options="[
            {label: 'Месяц', value: 'mon'},
            {label: 'Неделю', value: 'wee'},
            {label: 'Сутки', value: 'day'}
          ]"
        />
      </div>
      <div class="borders">
        <p class="header">На странице</p>
        <q-btn-toggle
          size="sm"
          v-model="perpage"
          toggle-color="primary"
          no-caps
          dense
          :options="[
            {label: '25', value: '25'},
            {label: '50', value: '50'},
            {label: '100', value: '100'}
          ]"
        />
      </div>
    </div>
    <br>
    <p class="header">Фильтры</p>
    <div class="line">
      <q-item-section>
        <p :style="{textAlign: 'left'}">Скрыть вакансии без указания зп</p>
      </q-item-section>
      <q-item-section avatar>
        <q-toggle color="blue" v-model="nosal" checked-icon="check" />
      </q-item-section>
    </div>
    <br>
    <p>Зарплата:</p>
    <div class="line">
      <q-item-section avatar>
        <q-icon name="euro_symbol" />
      </q-item-section>
      <q-item-section>
        <q-range
          :key="lowest"
          :value="rangeValues"
          @change="updateAndSave"
          :min="lowest"
          :max="highest"
          label
          label-always
        />
      </q-item-section>
    </div>
    <q-input
      v-model="city"
      dense
      label="Город"
      class="jobsfilter__search"
      :rules="[val => /^[\wа-яА-Я\s]*$/.test(val) || 'некорректная строка города']"
    />
    
    <q-select dense v-model="exp" :options="expOptions" label="Опыт" />
    
    <q-select
      
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
    pending: {type: Boolean, default: false},
  },
  data: ()=>{return {
    exp: 'Не имеет значения',
    nosal: false,
    city: '',
    perpage: '25',
    timerange: 'mon',
    txt: '',
    sort: 'new',
    search: '',
    value: [1600,2000],
    reinit: true, //when loaded first time - need to set the rangeValues equal to low and high
    rangeValues: {
      min: 1600,
      max: 8000
    },
    langsSelected: [],
    //langOptions: ["Русский", "Английский", "Немецкий", "Французкий"],
    expOptions: ["Не имеет значения", "Нет опыта", "от 1 до 3 лет", "от 3 до 5", "от 5 лет"]
  }},
  methods: {
    resetFields(){
      this.exp = 'Не имеет значения'
      this.nosal = false
      this.city = ''
      this.perpage = '25'
      this.timerange = 'mon'
      this.txt = ''
      this.sort = 'new'
      this.search = ''
      //rangeValues???
    },
    updateAndSave: function(val) {
      this.rangeValues = val
      this.$emit('slideEnd', [val.min, val.max])
    },
    updateLangs: function(val) {
      if (val==null) {
        this.$emit('updLangs', [])
      } else this.$emit('updLangs', val)
    },
    searchUpd: function(e) {
      //console.log(val.target.value)
      this.search = e.target.value
      this.$emit('updSearch', e.target.value.toLowerCase())
    },
    refreshPlus(){
      this.$emit('updSearch', this.txt.toLowerCase())
      this.$emit('refresh')
    }
  },
  computed: {
    query() {
      //санитайз здесь и на сервере
      let params = []
      if (this.txt !== '' && /^[\wа-яА-Я\s]*$/.test(this.txt)) params.push('txt=' + this.txt)
      if (this.sort !== 'new') params.push('sort=' + this.sort)
      if (this.timerange !== 'mon') params.push('timerange=' + this.timerange)
      if (this.perpage !== '25') params.push('perpage=' + this.perpage)
      if (this.rangeValues.min > this.lowest) params.push('salmin=' + this.rangeValues.min)
      if (this.rangeValues.max < this.highest) params.push('salmax=' + this.rangeValues.max)
      if (this.city !== '' && /^[\wа-яА-Я\s]*$/.test(this.city)) params.push('city=' + this.city)
      if (this.nosal === false) params.push('nosal=' + '0')
      if (this.exp !== 'Не имеет значения') params.push('exp=' + this.exp)
      if (this.langsSelected.length > 0) params.push('langs=' + this.langsSelected)
      let que = params.length == 0 ? '' : '?' + params.join('&')
      this.$emit('updQue', que)
      return que
    }
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
  position fixed
  right 0
  background-color #eee
  flex 0 1 35%
  max-width 400px
  border 1px solid black
  padding 15px
  &__search
    width 100%
  .header
    background-color #ddd
  *
    margin 0
  div, span, svg
    line-height 1.6
  .line
    display flex
    justify-content space-between
  .borders
    padding 0 2px
  .alignRight
    align-self flex-end
.jobsfilter__search-btn
  align-self flex-start
</style>
