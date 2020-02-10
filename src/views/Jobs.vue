<template>
  <div class="jobs">
    <div class="jobs__main">
      <div style="padding-top: 10px">
        <div class="jobs__filterpart">
          <JobsFilter :outerResetNeeded="outerResetNeeded" @resetFilters="resetFilters" @currUpd="currUpd" :currency="currency" @cityUpd="cityUpd" @jtypeUpd="jtypeUpd" @expUpd="expUpd" @salaryUpd="salaryUpd" :city="city" :salary="salary" :exp="exp" :jtype="jtype" :pending="pending" @refresh="$emit('refresh')" :langOptions="langOptions" @updLangs="updLangs" @slideEnd="slideEnd" :highest="maxSal" :lowest="minSal"></JobsFilter>
        </div>
      </div>
      <div class="jobs__contents">
        <div class="jobs__top-wrapper">
          <div class="jobs__top">
            <q-input
              v-model="txt"
              dense
              :label="$t('home.searchPH')"
              class="jobsfilter__search"
              @keyup.enter="refreshPlus"
            >
              <!-- :rules="[val => wordRegex.test(val) || $t('home.searchValSym')]" -->
              <template v-if="txt" v-slot:append>
                <q-icon name="cancel" @click.stop="txt = ''" class="cursor-pointer" />
              </template>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn @click="refreshPlus" style="background-color: #8080f1; font-weight: 700" text-color="white" :loading="pending" class="jobsfilter__search-btn" :label="$t('home.searchBtn')"/>
          </div>
        </div>
        <div style="padding: 0 4px">
          <div class="line jobs_prefilters">
            <!-- <button class="orderLink">
              {{sort.label}}
              <q-icon name="arrow_drop_down"/>
              <q-menu dense>
                <q-item
                  style="lineHeight: 2"
                  dense :style="{color: sort.value == 'new' ? 'purple' : 'black'}"
                  clickable v-close-popup
                  @click="sort = {label: 'По дате', value: 'new'}"
                >
                  По дате
                </q-item>
                <q-item
                  style="lineHeight: 2"
                  dense :style="{color: sort.value == 'saldesc' ? 'purple' : 'black'}"
                  clickable v-close-popup
                  @click="sort = {label: 'По убыв зп', value: 'saldesc'};outerResetNeeded = true"
                >
                  По убыв зп
                </q-item>
                <q-item
                  style="lineHeight: 2"
                  dense :style="{color: sort.value == 'salasc' ? 'purple' : 'black'}"
                  clickable v-close-popup
                  @click="sort = {label: 'По возр зп', value: 'salasc'};outerResetNeeded = true"
                >
                  По возр зп
                </q-item>
              </q-menu>
            </button> -->
            <q-select dense outlined
              :style="{minWidth: '170px'}"
              v-model="sort"
              @input="sort.value != 'new' ? outerResetNeeded = true : null"
              :options="[ {label: 'По дате', value: 'new'},
                          {label: 'По убыванию зп', value: 'saldesc'},
                          {label: 'По возрастанию зп', value: 'salasc'}]"
            />
            <!-- <button class="orderLink">
              {{timerange.label}}
              <q-icon name="arrow_drop_down"/>
              <q-menu dense>
                <q-item
                  style="lineHeight: 2"
                  dense :style="{color: timerange.value == 'mon' ? 'purple' : 'black'}"
                  clickable v-close-popup
                  @click="timerange = {label: 'За месяц', value: 'mon'}"
                >
                  За месяц
                </q-item>
                <q-item
                  style="lineHeight: 2"
                  dense :style="{color: timerange.value == 'wee' ? 'purple' : 'black'}"
                  clickable v-close-popup
                  @click="timerange = {label: 'За неделю', value: 'wee'};outerResetNeeded = true"
                >
                  За неделю
                </q-item>
                <q-item
                  style="lineHeight: 2"
                  dense :style="{color: timerange.value == 'day' ? 'purple' : 'black'}"
                  clickable v-close-popup
                  @click="timerange = {label: 'За сутки', value: 'day'};outerResetNeeded = true"
                >
                  За сутки
                </q-item>
              </q-menu>
            </button> -->
            <q-select dense outlined
              :style="{minWidth: '130px'}"
              v-model="timerange"
              @input="timerange.value != 'mon' ? outerResetNeeded = true : null"
              :options="[ {label: 'За месяц', value: 'mon'},
                          {label: 'За неделю', value: 'wee'},
                          {label: 'За сутки', value: 'day'}]"
            />
            <!-- <button class="orderLink">
              {{perpage.label}}
              <q-icon name="arrow_drop_down"/>
              <q-menu dense>
                <q-item
                  style="lineHeight: 2"
                  dense :style="{color: perpage.value == '25' ? 'purple' : 'black'}"
                  clickable v-close-popup
                  @click="perpage = {label: '25 на стр', value: '25'}"
                >
                  25 на стр
                </q-item>
                <q-item
                  style="lineHeight: 2"
                  dense :style="{color: perpage.value == '50' ? 'purple' : 'black'}"
                  clickable v-close-popup
                  @click="perpage = {label: '50 на стр', value: '50'};outerResetNeeded = true"
                >
                  50 на стр
                </q-item>
                <q-item
                  style="lineHeight: 2"
                  dense :style="{color: perpage.value == '100' ? 'purple' : 'black'}"
                  clickable v-close-popup
                  @click="perpage = {label: '100 на стр', value: '100'};outerResetNeeded = true"
                >
                  100 на стр
                </q-item>
              </q-menu>
            </button> -->
            <q-select dense outlined
              :style="{minWidth: '120px'}"
              v-model="perpage"
              @input="perpage.value != '25' ? outerResetNeeded = true : null"
              :options="[ {label: '25 на стр', value: '25'},
                          {label: '50 на стр', value: '50'},
                          {label: '100 на стр', value: '100'}]"
            />
            <!-- <div>По запросу: <strong>{{jobsFullcount}}</strong></div> -->
            <div v-if="pages && pages > 0" class="paginationWrap">
              <button
                :class="{pageBtns: true, currentPage: page_current == i}"
                v-for="i of (
                  page_current == 1
                    ? Math.min(pages, 3) 
                    : Math.min(pages, page_current + 1)
                )" :key="i"
                @click="switchPage(i)"
                v-show="(i >= (page_current != pages ? page_current - 1 : page_current - 2))"
              >
                {{i}}
              </button>
            </div>
            <!-- @input="switchPage" -->
            <!-- <p>Показано {{jobslist.length}} из {{jobsFullcount}}</p> -->
            <!-- <p v-if="txt != ''">Найдено: {{jobsFullcount}}</p> -->
            <q-btn-toggle
              v-model="lenses"
              toggle-color="primary"
              size="sm"
              dense
              :options="[ {value: 'short', icon: 'list'},
                          {value: 'full', icon: 'code'},]"
            />
          </div>
          <JobsList
            :ownCVs="ownCVs"
            :role="role" :showLiked="role === 'subscriber'"
            :likedJobs="likedJobs" 
            @favOne="favOne"
            @hitcv="hitcv"
            :lenses="lenses" :searchFilter="searchFilter" :jobslist="jobslist" msg="Полученные"/>
        </div>
        <div v-if="pages && pages > 0" class="paginationWrap">
          <button
            :class="{pageBtns: true, currentPage: page_current == i}"
            v-for="i of (
              page_current == 1
                ? Math.min(pages, 3) 
                : Math.min(pages, page_current + 1)
            )" :key="i"
            @click="switchPage(i)"
            v-show="(i >= (page_current != pages ? page_current - 1 : page_current - 2))"
          >
            {{i}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import JobsList from '@/components/organisms/JobsList.vue'
import JobsFilter from '@/components/organisms/JobsFilter.vue'

export default {
  name: 'Jobs',
  props: {
    role: String,
    jobslist: {type: Array, default: ()=>[]},
    likedJobs: {type: Array, default: ()=>[]},
    ownCVs: {type: Array, default: ()=>[]},
    likedJobsList: {type: Array, default: ()=>[]},
    pending: {type: Boolean, default: false},
    pages: {type: Number, default: 1},
    page_current: {type: Number, default: 1},
    jobsFullcount: {type: Number, default: 0}
  },
  data: ()=>{return {
    outerResetNeeded: false,
    lenses: 'full',
    txt: '',
    wordRegex: /^[\wа-яА-ЯÇçÄä£ſÑñňÖö$¢Üü¥ÿýŽžŞş\s\\-]*$/,
    sort: {label: 'По дате', value: 'new'},
    timerange: {label: 'За месяц', value: 'mon'},
    perpage: {label: '25 на стр', value: '25'},
    searchFilter: '',
    salaryVals: [-Infinity, Infinity],
    langsFilter: [],
    maxSal: 100000,
    minSal: 0,
    langOptions: ["Русский", "Английский", "Немецкий", "Французкий"],
    city: '',
    jtype: {label: "", value: ''},
    salary: {label: "", value: 'idc'},
    exp: {label: "", value: 'idc'}, 
    currency: {label: "", value: 'idc'},
  }},
  components: {
    JobsFilter,
    JobsList
  },
  computed: {
    query() {
      let params = []
      if (this.txt !== '' && this.wordRegex.test(this.txt)) params.push('txt=' + this.txt)
      if (this.sort.value !== 'new') params.push('sort=' + this.sort.value)
      if (this.timerange.value !== 'mon') params.push('timerange=' + this.timerange.value)
      if (this.perpage.value !== '25') params.push('perpage=' + this.perpage.value)
      if ((this.city !== 'Не имеет значения' && this.city !== '') && this.wordRegex.test(this.city)) params.push('city=' + this.city)
      if (this.exp.value !== 'idc') params.push('exp=' + this.exp.value)
      if (this.jtype.value == 'c' || this.jtype.value == 'v') params.push('jtype=' + this.jtype.value)
      if (this.salary.value !== 'idc') params.push('sal=' + this.salary.value)
      if (this.currency.value !== 'idc') params.push('cur=' + this.currency.value)
      let que = params.length == 0 ? '' : '?' + params.join('&')
      return que
    }
  },
  watch: {
    query(que){
      this.$emit('updQue', que)
    },
    jobslist: function(newj, oldj) {
      let max1 = Math.max.apply(Math, newj.map(function(o) { return o.salary }))
      let min1 = Math.min.apply(Math, newj.map(function(o) { return o.salary }))
      this.maxSal = max1 + ((max1 - min1) / 10) | 0
      this.minSal = min1 - ((max1 - min1) / 10) | 0
      this.salaryVals = [this.minSal, this.maxSal]
      this.langOptions = Array.from(new Set(this.jobslist.flatMap(j=>j.langs)))
    }
  },
  mounted: function() {
    
  },
  methods: {
    resetFilters() {
      this.city = ''
      this.jtype= {label: "", value: ''}
      this.salary= {label: "", value: 'idc'}
      this.exp= {label: "", value: 'idc'}
      this.currency= {label: "все", value: 'idc'}

      this.sort = {label: 'По дате', value: 'new'}
      this.timerange = {label: 'За месяц', value: 'mon'}
      this.perpage = {label: '25 на стр', value: '25'}
      this.outerResetNeeded = false
      this.$emit('updQue', this.query)
      this.$emit('refresh')
    },
    favOne(id) {
      console.log('favOne from Jobs')
      this.$emit('favOne', id)
    },
    hitcv(id) {
      this.$emit('hitcv', id)
    },
    refreshPlus(){
      
      this.searchFilter = this.txt.toLowerCase()
      this.$emit('refresh')
    },
    slideEnd: function(vals) {
      console.log('cp10: ', vals)
      this.salaryVals = vals
    },
    updLangs: function(vals) {
      console.log('cp11: ', vals)
      this.langsFilter = vals
    },
    updSearch: function(str) {
      this.searchFilter = str
    },
    // updQue: function(params) {
    //   console.log('cpUpdQue1: ', params)
    //   this.$emit('updQue', params)
    // },
    perPageUpd(e) {
      this.$emit('perPageUpd', e)
    },
    switchPage(newV) {
      this.$emit('refresh', 'page', newV)
    },
    salaryUpd(new1) {
      this.salary = new1
    },
    expUpd(new1) {
      this.exp = new1
    },
    jtypeUpd(new1) {
      this.jtype = new1
    },
    cityUpd(new1) {
      this.city = new1
    },
    currUpd(new1) {
      this.currency = new1
    }
  },
}
</script>


<style scoped lang="stylus">
.jobs
  display flex
  flex-direction column
  position relative
  padding 0px 10px
  .jobs__top-wrapper
    z-index 1
    background #fff
    position sticky
    top 0px
    padding-top 10px
    box-sizing border-box
    margin-bottom 15px
    border-bottom-left-radius 15px
    border-bottom-right-radius 15px
  .jobs__top
    background-color var(--main-bg-color)
    display flex
    margin 0
    padding 10px 15px
    box-sizing border-box
    //box-shadow 0 0 3px 0px #a0a9
    box-shadow 0 0 4px 1px var(--main-borders-color)
    border-radius 15px
  .jobs__filterpart
    position sticky
    //top 105px
    top 10px
    display flex
    margin-right 20px
  .jobsfilter__search
    width 100%
    margin-right 5px
  .jobsfilter__search-btn
    align-self flex-start
  .jobs__main
    display flex
    position relative
    // justify-content space-around
  .jobs__contents
    
    width 100%
    max-width calc(1000px - 310px) //that is including the filters to the left
  .jobs_prefilters
    margin-bottom 15px
    background-color var(--main-bg-color)
    padding 5px
    border-radius 5px
    box-shadow 0 0 4px 1px var(--main-borders-color)
  *
    margin 0
  .line
    display flex
    justify-content space-between
    align-items center
  .pageBtns
    cursor pointer
    border 0px solid gray
    margin 1px
    padding 5px 4px
    background-color #fff
    border-radius 4px
    font-size 14px
    font-weight 700
    color #06f
  .currentPage
    border 1px solid #06f
    color #fff
    background-color #06f
  .orderLink
    white-space nowrap
    border 0
    background-color transparent
    color purple
    cursor pointer
    font-size 14px
    &:hover
      color blue
  .paginationWrap
    padding 0 3px
</style>