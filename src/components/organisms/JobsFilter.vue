<template>
  <div class="jobsfilter">
    <q-select
      :value="city"
      @input="cityUpd"
      use-input
      color="cyan-10"
      fill-input
      hide-selected
      dense
      :options="cityOptions"
      @filter="filterFn"
      :label="$t('home.city')"
      stack-label
      @keyup="addNewCity"
    />
    
    <div class="line">
      <q-select
        :content-style="{ backgroundColor: 'red' }"
        style="width: 65%;"
        color="cyan-10"
        @input="salaryUpd" dense
        :value="salary" :options="salOptions" :label="$t('home.sal')" />
      <q-select color="cyan-10" style="width: 30%; text-align: center" dense @input="currUpd" :value="currency" :options="currOptions" :label="$t('home.curr')" />
    </div>
    <q-select color="cyan-10" @input="expUpd" dense :value="exp" :options="expOptions" :label="$t('home.exp')" />
    <q-select color="cyan-10" @input="jtypeUpd" dense :value="jtype" :options="jtypeOptions" :label="$t('home.jtyp')" />
    <div class="w100" :style="{justifyContent: isResetShown ? 'space-between': 'flex-end'}">
      <q-btn
        v-if="isResetShown"
        icon="delete_forever"
        rounded
        color="red-10"
        @click="$emit('resetFilters')"
      />
      <q-btn
        :loading="pending"
        style="background-color: var(--main-borders-color); font-weight: 700" text-color="white" :label="$t('home.applyBtn')" @click="refreshPlus"/>
    </div>
    
  </div>
</template>

<script>
//панелька справа с выбором фильтрации
let stringOptions = ["Не имеет значения", "Ашхабад", "Дашогуз", "Мары", "Туркменабад", "Туркменбаши"]

export default {
  name: 'JobsFilter',
  props: {
    isResetShown: Boolean,
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
    currency: {type: Object},
    //outerResetNeeded: {type: Boolean}
  },
  data: ()=>{return {
    cityOptions: stringOptions, //i18n.$t('home.cityOpts'),
    //perpage: '25',
    //timerange: 'mon',
    //txt: '',
    wordRegex: /^[\wа-яА-ЯÇçÄä£ſÑñňÖö$¢Üü¥ÿýŽžŞş\s\\-]*$/,
    search: '',
    langsSelected: [],
    //langOptions: ["Русский", "Английский", "Немецкий", "Французкий"],
    currOptions: [
      {label: "все", value: 'idc'},
      {label: "$", value: '$'},
      {label: "манат", value: 'm'},],
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
      {label: "от 3000", value: '3'},
    ],
  }},
  computed: {
    
  },
  methods: {
    cityUpd(new1) {
      //console.log(new1)
      if (new1 == 'Не имеет значения') new1 = ''
      this.$emit('cityUpd', new1)
      
    },
    salaryUpd(new1) {
      if (new1.value == 'idc') new1 = {label: '',value : "idc"}
      this.$emit('salaryUpd', new1)
    },
    expUpd(new1) {
      if (new1.value == 'idc') new1 = {label: '',value : "idc"}
      this.$emit('expUpd', new1)
    },
    jtypeUpd(new1) {
      if (new1.value == '') new1 = {label: '',value : "idc"}
      this.$emit('jtypeUpd', new1)
    },
    currUpd(new1) {
      if (new1.value == 'idc') new1 = {label: '',value : "idc"}
      this.$emit('currUpd', new1)
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
  background-color var(--main-bg-color)
  flex 0 1 35%
  max-width 360px
  min-width 270px
  margin-bottom 15px
  padding 10px 15px
  box-sizing border-box
  box-shadow 0 0 4px 1px var(--main-borders-color)
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
