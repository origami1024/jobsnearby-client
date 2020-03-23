<template>
  <div class="jobsfilter">
    <h3
      style="
        text-transform: uppercase;
        font-family: Montserrat, sans-serif;
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 20px;
        margin-bottom: 15px;
      "
    >Расширенный поиск:</h3>
    <span class="f-label">{{$t('filters.city')}}</span>
    <!-- {{city}} -->
    <DDSelect :picked="city" @update:city="cityUpd($event)" :cities="cityOptions" ph="Ашхабад" style="margin-bottom: 12px;"/>
    <!-- <span class="f-label">{{$t('filters.city')}}</span> -->
    <!-- <q-select
      :value="city"
      @input="cityUpd"
      use-input
      dense
      color="cyan-10"
      hide-selected
      :options="cityOptions"
      @filter="filterFn"
      placeholder="Ашхабад"
      style="border-radius: 10px; margin-bottom: 12px;"
      @keyup="addNewCity"
      no-border
    /> -->
    <span class="f-label">{{$t('filters.jcat')}}</span>
    <BasicSelect :picked="jcat" @update:value="jcatUpd($event)" :values="jcatOptions" ph="Бухгалтер" style="margin-bottom: 12px;" emptyTemplate='0' />
    <!-- <span class="f-label">{{$t('filters.jcat')}}</span>
    <q-select
      dense
      color="cyan-10"
      @input="jcatUpd" :value="jcat" 
      style="border-radius: 10px; margin-bottom: 12px;"
      class="f-select"
      :options="jcatOptions"
    /> -->
    <span class="f-label">{{$t('filters.exp')}}</span>
    <BasicSelect :picked="exp" @update:value="expUpd($event)" :values="expOptions" ph="от 1 до 3 лет" style="margin-bottom: 12px;" />
    <!-- <q-select color="cyan-10" @input="expUpd" dense :value="exp" :options="expOptions" :label="$t('filters.exp')" /> -->
    <div class="line">
      <div style="width: 125px">
      <span class="f-label">{{$t('filters.sal')}}</span>
      <BasicSelect :picked="salary" @update:value="salaryUpd($event)" :values="salOptions" ph="от 200 до 500" style="margin-bottom: 12px;" />
      </div>
      <div style="width: 71px">
      <span class="f-label">{{$t('filters.curr')}}</span>
      <BasicSelect :picked="currency" @update:value="currUpd($event)" :values="currOptions" ph="" style="margin-bottom: 12px;" />
      </div>
    </div>

    <!-- <div class="line">
      <q-select
        :content-style="{ backgroundColor: 'red' }"
        style="width: 65%;"
        dense
        color="cyan-10"
        @input="salaryUpd"
        :value="salary" :options="salOptions" :label="$t('filters.sal')" />
      <q-select color="cyan-10" style="width: 30%; text-align: center" dense @input="currUpd" :value="currency" :options="currOptions" :label="$t('filters.curr')" />
    </div> -->
    
    <div class="w100" :style="{justifyContent: isResetShown ? 'space-between': 'flex-end'}" style="margin-top: 19px;">
      <q-btn
        v-if="isResetShown"
        class="headerBtns1 trashBg"
        @click="$emit('resetFilters')"
      />
      <q-btn
        :loading="pending"
        style="background-color: var(--violet-btn-color); font-weight: 700; width: 100%"
        :style="{width: isResetShown ? '126px': '100%'}"
        class="headerBtns1"
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
import DDSelect from './../atoms/DDSelect'
import BasicSelect from './../atoms/BasicSelect'

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
  components: {
    DDSelect,
    BasicSelect
  },
  methods: {
    cityUpd(new1) {
      //console.log('cp7 ', new1)
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
  //background-color yellow
  //flex 0 1 35%
  text-align left
  max-width 278px
  min-width 278px
  margin-bottom 15px
  padding 31px
  box-sizing border-box
  //box-shadow 0 0 4px 1px var(--main-borders-color)
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  border-radius 10px
  color white
  .f-label
    font-family: Montserrat, sans-serif;
    font-weight normal
    font-size 14px
    line-height 17px !important
    display block
    margin-bottom 6px !important
  f-select
    background-color white !important
    input
      border-radius 10px !important
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
.trashBg
  background url('./../../../public/assets/trash1.png') !important
  background-repeat no-repeat !important
  background-position center !important
  background-color var(--btn-color) !important
  width 70px
  &:hover
    background-color var(--btn-color1) !important
.jobsfilter__search-btn
  align-self flex-start

  
  
</style>
