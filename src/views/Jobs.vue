<template>
  <div class="jobs">
    <div class="jobs__main">
      <div style="padding-top: 10px">
        <div class="jobs__filterpart">
          <!-- :outerResetNeeded="outerResetNeeded" -->
          <JobsFilter
            
            :isResetShown="isResetShown"
            @resetFilters="resetFilters"
            @currUpd="currUpd"
            :currency="currency"
            @cityUpd="cityUpd" @jcatUpd="jcatUpd" @expUpd="expUpd"
            @salaryUpd="salaryUpd" :city="city" :salary="salary"
            :exp="exp" :jcat="jcat"
            :pending="pending"
            @refresh="$emit('refresh')"
            @updLangs="updLangs"
          ></JobsFilter>
        </div>
      </div>
      <div class="jobs__contents">
        <div class="jobs__top-wrapper">
          <div class="jobs__top">
            <button class="filtersHamburgerBtn">Ф</button>
            <q-input
              v-model="txt"
              dense
              class="jobsfilter__search"
              @keyup.enter="refreshPlus"
              
              color="red-10"
            >
              <!-- @input="txt != '' ? outerResetNeeded = true : null" -->
              <!-- :rules="[val => wordRegex.test(val) || $t('filters.searchValSym')]" -->
              <template v-if="txt" v-slot:append>
                <q-icon name="cancel" @click.stop="txt = ''" class="cursor-pointer" />
              </template>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn 
              @click="refreshPlus"
              style="background-color: var(--btn-color); font-weight: 700; align-self:flex-start;"
              class="searchBtn"
              text-color="white" :loading="pending"
              :label="$t('filters.searchBtn')"
            />
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

            <!-- :style="{minWidth: '170px'}" -->
            <q-select dense outlined
              style="white-space: nowrap"
              class="sdpp-filters"
              v-model="sort"
              @input="sortFilterChangeRefresh"
              :options="$t('jobs.sortOpts')"
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
              style="white-space: nowrap"
              class="sdpp-filters"
              v-model="timerange"
              @input="timerangeFilterChangeRefresh"
              :options="$t('jobs.dateOpts')"
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
              style="white-space: nowrap"
              class="sdpp-filters"
              v-model="perpage"
              @input="perpageFilterChangeRefresh"
              :options="$t('jobs.perpageOpts')"
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
              v-if="wwidth > 549"
              v-model="lenses"
              toggle-color="red-10"
              size="sm"
              dense
              :options="[ {value: 'short', icon: 'list'},
                          {value: 'full', icon: 'code'},]"
            />
          </div>
          <JobsList
            :ownCVs="ownCVs"
            :role="role"
            @hitcv="hitcv"
            :lenses="wwidth > 549 ? lenses : 'short'" :searchFilter="searchFilter" :jobslist="jobslist"
          />
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
    ownCVs: {type: Array, default: ()=>[]},
    pending: {type: Boolean, default: false},
    pages: {type: Number, default: 1},
    page_current: {type: Number, default: 1},
    jobsFullcount: {type: Number, default: 0}
  },
  data(){return {
    //outerResetNeeded: false,
    lenses: 'full',
    txt: '',
    wordRegex: /^[\wа-яА-ЯÇçÄä£ſÑñňÖö$¢Üü¥ÿýŽžŞş\s\\-]*$/,
    sort: this.$t('jobs.sortOpts[0]'),//{label: 'По дате', value: 'new'},
    timerange: this.$t('jobs.dateOpts[0]'),
    perpage: this.$t('jobs.perpageOpts[0]'),
    searchFilter: '',
    langsFilter: [],
    maxSal: 100000,
    minSal: 0,
    //langOptions: ["Русский", "Английский", "Немецкий", "Французкий"],
    city: '',
    jcat: {label: "", value: 0},
    salary: {label: "", value: 'idc'},
    exp: {label: "", value: 'idc'}, 
    currency: {label: "", value: 'idc'},
  }},
  components: {
    JobsFilter,
    JobsList
  },
  computed: {
    wwidth() {
      return window.innerWidth
    },
    isResetShown() {
      let res = false
      if (this.city != this.$t('filters.cities[0]') && this.city != '') res = true
      else if (this.salary.value != 'idc') res = true
      else if (this.currency.value != 'idc') res = true
      else if (this.exp.value != 'idc') res = true
      else if (this.jcat.value != 0) res = true
      //else if (this.outerResetNeeded != false) res = true

      else if (this.sort.value != 'new') res = true
      else if (this.timerange.value != 'mon') res = true
      else if (this.perpage.value != '25') res = true
      
      else if (this.txt != '') res = true

      return res
    },
    query() {
      let params = []
      if (this.txt !== '' && this.wordRegex.test(this.txt)) params.push('txt=' + this.txt)
      if (this.sort.value !== 'new') params.push('sort=' + this.sort.value)
      if (this.timerange.value !== 'mon') params.push('timerange=' + this.timerange.value)
      if (this.perpage.value !== '25') params.push('perpage=' + this.perpage.value)
      if ((this.city !== this.$t('filters.cities[0]') && this.city !== '') && this.wordRegex.test(this.city)) params.push('city=' + this.city)
      if (this.exp.value !== 'idc') params.push('exp=' + this.exp.value)
      if (this.jcat.value !== 0) params.push('jcat=' + this.jcat.value)
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
      //this.langOptions = Array.from(new Set(this.jobslist.flatMap(j=>j.langs)))
    }
  },
  mounted: function() {
    
  },
  methods: {
    sortFilterChangeRefresh() {
      //if (this.sort.value != 'new') this.outerResetNeeded = true
      setTimeout(()=>this.refreshPlus())
    },
    timerangeFilterChangeRefresh() {
      //if (this.timerange.value != 'mon') this.outerResetNeeded = true
      setTimeout(()=>this.refreshPlus())
    },
    perpageFilterChangeRefresh() {
      //if (this.perpage.value != '25') this.outerResetNeeded = true
      setTimeout(()=>this.refreshPlus())
    },
    resetFilters() {
      this.txt = ''
      this.city = ''
      this.jcat= {label: "", value: 0}
      this.salary= {label: "", value: 'idc'}
      this.exp= {label: "", value: 'idc'}
      this.currency= {label: "", value: 'idc'}

      this.sort = this.$t('jobs.sortOpts[0]')
      this.timerange = this.$t('jobs.dateOpts[0]')
      this.perpage = this.$t('jobs.perpageOpts[0]')
      //this.outerResetNeeded = false
      this.$emit('updQue', this.query)
      this.$emit('refresh')
    },
    hitcv(id) {
      this.$emit('hitcv', id)
    },
    refreshPlus(){
      
      this.searchFilter = this.txt.toLowerCase()
      this.$emit('refresh')
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
    jcatUpd(new1) {
      this.jcat = new1
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
    box-sizing border-box
    //top 105px
    top 10px
    display flex
    margin-right 20px
    @media screen and (max-width: 550px)
      display block
      display none
      position fixed
      z-index 10
      top 10px
      bottom 10px
      left 10px
      right 10px
  .jobsfilter__search
    box-sizing border-box
    width 100%
    margin-right 5px
  .jobs__main
    box-sizing border-box
    display flex
    position relative
    // justify-content space-around
  .jobs__contents
    box-sizing border-box
    width calc(100% - 10px)
    max-width calc(1000px - 310px) //that is including the filters to the left
  .jobs_prefilters
    margin-bottom 15px
    background-color var(--main-bg-color)
    padding 5px
    border-radius 5px
    box-shadow 0 0 4px 1px var(--main-borders-color)
    box-sizing border-box
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
    color var(--main-borders-color)
  .currentPage
    border 1px solid var(--main-borders-color)
    color #fff
    background-color var(--main-borders-color)
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
.filtersHamburgerBtn
  display none
  border 0
  color white
  background-color var(--main-borders-color)
  align-self center
  padding 5px
  cursor pointer
  &:hover
    background-color var(--btn-color)
@media screen and (max-width: 550px)
  .jobs
    padding 0
    padding-left 5px
    .jobs__filterpart
      margin-right 0px
    .searchBtn
      font-size 12px
      margin auto
    .jobs__top
      padding 5px
      border-radius 5px
    .pageBtns
      padding 3px
      margin 0px
  .filtersHamburgerBtn
    display block

</style>