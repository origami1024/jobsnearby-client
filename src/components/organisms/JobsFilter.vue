<template>
  <div class="jobsfilter">
    <h3
      style="
        text-transform: uppercase;
        font-family: Montserrat;
        font-style: normal;
        font-weight: bold;
        font-size: 22px;
        line-height: 27px;
        margin-bottom: 30px;
      "
    >Расширенный поиск:</h3>
    <span>{{$t('filters.city')}}</span>
    <q-select
      :value="city"
      @input="cityUpd"
      use-input
      color="cyan-10"
      bg-color="white"
      fill-input
      hide-selected
      dense
      :options="cityOptions"
      @filter="filterFn"
      placeholder="Ашхабад"
      style="border-radius: 10px;"
      @keyup="addNewCity"
    />
    <span>{{$t('filters.jcat')}}</span>
    <q-select color="cyan-10" @input="jcatUpd" dense :value="jcat" :options="jcatOptions" />
    <div class="line">
      <q-select
        :content-style="{ backgroundColor: 'red' }"
        style="width: 65%;"
        color="cyan-10"
        @input="salaryUpd" dense
        :value="salary" :options="salOptions" :label="$t('filters.sal')" />
      <q-select color="cyan-10" style="width: 30%; text-align: center" dense @input="currUpd" :value="currency" :options="currOptions" :label="$t('filters.curr')" />
    </div>
    <q-select color="cyan-10" @input="expUpd" dense :value="exp" :options="expOptions" :label="$t('filters.exp')" />
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
        style="background-color: var(--main-borders-color); font-weight: 700; padding: 0 5px"
        
        text-color="white"
        :label="$t('filters.applyBtn')"
        @click="refreshPlus"
      />
      <!-- <button class="newlinks btnnewlinks" @click="refreshPlus">
        {{$t('filters.applyBtn')}}
      </button> -->
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
    jcat: {type: Object},
    salary: {type: Object},
    currency: {type: Object},
    //outerResetNeeded: {type: Boolean}
  },
  data() {return {
    cityOptions: this.$t('filters.cities'),//stringOptions, //i18n.$t('filters.cityOpts'),
    //perpage: '25',
    //timerange: 'mon',
    //txt: '',
    wordRegex: /^[\wа-яА-ЯÇçÄä£ſÑñňÖö$¢Üü¥ÿýŽžŞş\s\\-]*$/,
    search: '',
    langsSelected: [],
    currOptions: this.$t('filters.currDefault'),
    // currOptions: [
    //   {label: "все", value: 'idc'},
    //   {label: "$", value: '$'},
    //   {label: "манат", value: 'm'},],
    expOptions: this.$t('filters.expFilters'),
    // expOptions: [
    //   {label: "Не имеет значения", value: 'idc'}, 
    //   {label: "Без опыта", value: '0'},
    //   {label: "от 1 до 3 лет", value: '1-3'}, 
    //   {label: "от 3 до 5 лет", value: '3-5'},
    //   {label: "от 5 лет", value: '5'}],
    jcatOptions: this.$t('App.jcats'),
    // jcatOptions: [
    //   {label: "Не имеет значения", value: 0}, 
    //   {label: "Администрация", value: 1},
    //   {label: "Безопасность", value: 14},
    //   {label: "Инженер", value: 4},
    //   {label: "Информационные технологии", value: 12},
    //   {label: "Логистика", value: 10},
    //   {label: "Медицина", value: 13},
    //   {label: "Недвижимость", value: 9},
    //   {label: "Нефть и газ", value: 3},
    //   {label: "Образование", value: 5},
    //   {label: "Продажи", value: 6},
    //   {label: "Производство", value: 7},
    //   {label: "Строительство", value: 8},
    //   {label: "Туризм, гостиницы, рестораны", value: 11},
    //   {label: "Юристы", value: 2},
    // ],
    salOptions: this.$t('filters.salFilters'),
    // salOptions: [
    //   {label: "Не имеет значения", value: 'idc'}, 
    //   {label: "от 0 до 1000", value: '0-1'}, 
    //   {label: "от 1000 до 3000", value: '1-3'}, 
    //   {label: "от 3000", value: '3'},
    // ],
  }},
  methods: {
    cityUpd(new1) {
      //console.log(new1)
      if (new1 == this.$t('filters.cities')[0]) new1 = ''
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
    jcatUpd(new1) {
      if (new1.value == '') new1 = {label: '',value : 0}
      this.$emit('jcatUpd', new1)
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
        this.cityOptions = this.$t('filters.cities').filter(v => v.toLowerCase().indexOf(needle) > -1)
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
    // updateAndSave: function(val) {
    //   this.rangeValues = val
    //   this.$emit('slideEnd', [val.min, val.max])
    // },
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
  background-color var(--color1)
  //flex 0 1 35%
  text-align left
  max-width 410px
  min-width 410px
  margin-bottom 15px
  padding 38px 38px 42px 46px
  box-sizing border-box
  //box-shadow 0 0 4px 1px var(--main-borders-color)
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  border-radius 10px
  color white
  span
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 22px;
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
