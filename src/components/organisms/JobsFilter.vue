<template>
  <div class="jobsfilter">
    <!-- <p :style="{maxWidth: '330px'}">query: {{query}}</p> -->
    <!-- <button @click="resetFields">Сбросить фильтры</button> -->
    <!-- <p class="header">Поиск</p>
    <p>Фильтр полученных данных по тексту(название, автор, город, описание):</p>
    <div class="line">
      <q-input
        v-model="txt"
        filled
        dense
        label="Поиск"
        class="jobsfilter__search"
        :rules="[val => wordRegex.test(val) || 'некорректная строка поиска']"
        @keyup.enter="refreshPlus"
      />
      <q-btn @click="refreshPlus" icon="search" color="primary" :loading="pending" class="jobsfilter__search-btn"></q-btn>
    </div> -->
    
      <!-- <div class="borders">
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
      </div> -->
      <!-- <div class="borders">
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
      </div> -->
      <!-- <div class="borders">
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
      </div> -->

    <!-- <div class="line">
      <q-item-section>
        <p :style="{textAlign: 'left'}">Скрыть вакансии без указания зп</p>
      </q-item-section>
      <q-item-section avatar>
        <q-toggle color="blue" v-model="nosal" checked-icon="check" />
      </q-item-section>
    </div> -->
    <!-- <br>
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
    </div> -->
    <!-- <q-select
      
      multiple
      use-chips
      label="Подходящие языки"
      v-model="langsSelected"
      :options="langOptions"
      @input="updateLangs"
      
    /> -->

    <!-- <q-input
      v-model="city"
      dense
      label="Город"
      class="jobsfilter__search"
      :rules="[val => wordRegex.test(val) || 'некорректная строка города']"
    /> -->
    <q-select
      :value="city"
      @input="cityUpd"
      use-input
      input-debounce="0"
      fill-input
      hide-selected
      :options="cityOptions"
      @filter="filterFn"
      label="Город"
      @keyup="addNewCity"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            ...
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <!-- {{txt}}{{query}} -->
    <!-- {{exp}}{{salary}} -->
    <q-select @input="salaryUpd" dense :value="salary" :options="salOptions" label="Зарплата" />
    <q-select @input="expUpd" dense :value="exp" :options="expOptions" label="Опыт" />
    <q-select @input="jtypeUpd" dense :value="jtype" :options="jtypeOptions" label="Тип занятости" />
    <div class="w100">
      <q-btn :loading="pending" color="primary" label="Применить" @click="refreshPlus"/>
    </div>
    
  </div>
</template>

<script>
//панелька справа с выбором фильтрации
let stringOptions = ["Не имеет значения", "Ашхабад", "Мары", "Туркменбаши", "Туркменабад", "Дашогуз"]

export default {
  name: 'JobsFilter',
  props: {
    lowest: {type: Number, default: 0},
    highest: {type: Number, default: 99550},
    langOptions: {type: Array, default: ()=>[]},
    pending: {type: Boolean, default: false},
    // txt: {type: String, default: ''},
    // sort: {type: String, default: 'new'},
    // timerange: {type: String, default: 'mon'},
    // perpage: {type: String, default: '25'},
    exp: {type: Object},
    city: {type: String},
    jtype: {type: Object},
    salary: {type: Object},
  },
  data: ()=>{return {
    cityOptions: stringOptions,
    //perpage: '25',
    //timerange: 'mon',
    //txt: '',
    wordRegex: /^[\wа-яА-ЯÇçÄä£ſÑñňÖö$¢Üü¥ÿýŽžŞş\s\\-]*$/,
    //sort: 'new',
    search: '',
    value: [1600,2000],
    reinit: true, //when loaded first time - need to set the rangeValues equal to low and high
    rangeValues: {
      min: 1600,
      max: 8000
    },
    langsSelected: [],
    //langOptions: ["Русский", "Английский", "Немецкий", "Французкий"],
    expOptions: [
      {label: "Не имеет значения", value: 'idc'}, 
      {label: "Без опыта", value: '0'},
      {label: "от 1 до 3 лет", value: '1-3'}, 
      {label: "от 3 до 5 лет", value: '3-5'},
      {label: "от 5 лет", value: '5'}],
    jtypeOptions: [
      {label: "Не имеет значения", value: ''}, 
      {label: "Постоянная", value: 'c'},
      {label: "Временная", value: 'v'}],
    salOptions: [
      {label: "Не имеет значения", value: 'idc'}, 
      {label: "от 0 до 1000", value: '0-1'}, 
      {label: "от 1000 до 3000", value: '1-3'}, 
      {label: "от 3000", value: '3+'},
    ],
  }},
  methods: {
    cityUpd(new1) {
      this.$emit('cityUpd', new1)
    },
    salaryUpd(new1) {
      this.$emit('salaryUpd', new1)
    },
    expUpd(new1) {
      this.$emit('expUpd', new1)
    },
    jtypeUpd(new1) {
      this.$emit('jtypeUpd', new1)
    },
    addNewCity(e){
      this.cityUpd(e.target.value)
      //this.cityOptions.push(this.city)
    },
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.cityOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    // resetFields(){
    //   this.exp = 'Не имеет значения'
    //   this.nosal = false
    //   this.city = ''
    //   //this.perpage = '25'
    //   //this.timerange = 'mon'
    //   //this.txt = ''
    //   //this.sort = 'new'
    //   //this.search = ''
    //   //rangeValues???
    // },
    updateAndSave: function(val) {
      this.rangeValues = val
      this.$emit('slideEnd', [val.min, val.max])
    },
    updateLangs: function(val) {
      if (val==null) {
        this.$emit('updLangs', [])
      } else this.$emit('updLangs', val)
    },
    refreshPlus(){
      //this.query()
      //this.$emit('updSearch', this.txt.toLowerCase())
      
      this.$emit('refresh')
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.jobsfilter
  background-color #f7f7f7
  flex 0 1 35%
  max-width 400px
  min-width 320px
  margin-bottom 15px
  padding 10px 15px
  box-sizing border-box
  box-shadow 0 0 4px 1px #06f
  border-radius 15px
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
  .w100
    display flex
    width 100%
    justify-content flex-end
    padding-top 10px
.jobsfilter__search-btn
  align-self flex-start
</style>
