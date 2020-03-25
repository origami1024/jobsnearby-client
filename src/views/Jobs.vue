<template>
  <div class="jobs">
    <div class="jobs__banner">
      <div style="width: 68px; height: 68px; background: url('./../assets/checked.png');"></div>
      <div class="jobs__banner-right">
        <div style="height: 68px; margin-bottom: 20px; display: flex; align-items: center;">
          <h2 style="margin-left: 30px;color: var(--color1); font-family: Montserrat, sans-serif; font-weight: 600; font-size: 18px; line-height: 144.4%; max-width: 296px;">Найди подходящую вакансию уже сегодня!</h2>
        </div>
        <div class="jobs__top-search">
        <button class="filtersHamburgerBtn">Ф</button>
        <input
          style="
            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);
            border-radius: 10px;
            width: 822px;
            height: 40px;
            border: 0;
            padding: 0 26px;
            font-family: Montserrat, sans-serif;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            line-height: 17px;
            margin-left: 16px;
          "
          class="searchInput"
          type="text"
          v-model="txt" @keyup.enter="refreshPlus"
          placeholder="Введите ключевые слова"
        >
        <!-- <q-input
          v-model="txt"
          dense
          class="jobsfilter__search"
          @keyup.enter="refreshPlus"
          
          color="red-10"
        >
        </q-input> -->
        <q-btn 
          @click="refreshPlus"
          class="headerBtns1 searchBtn"
          style="background-color: var(--violet-btn-color); margin-left: -15px; padding: 0 12px;"
          text-color="white" :loading="pending"
          :label="$t('filters.searchBtn')"
        />
      </div>
      </div>
    </div>
    <!-- <div class="jobs__top-wrapper"> -->
      
    <!-- </div> -->
    <div class="jobs__main">
      <div class="jobs__filterpart">
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
        />
      </div>
      <div class="jobs__contents">
        <!-- <div> -->
          <div class="line jobs_prefilters">
            <div>
              <span class="jobs__prefilters-label">Сортировка:</span>
              <button class="orderLink">
                {{timerange.label}}
                <q-menu dense>
                  <q-item
                    v-for="timerangeee in $t('jobs.dateOpts')"
                    :key="timerangeee.value"
                    style="lineHeight: 2"
                    dense :style="{color: timerange.value == timerangeee.value ? 'var(--violet-btn-color)' : 'var(--color1)'}"
                    clickable v-close-popup
                    @click="timerange = timerangeee; prefilterDelayedRefreshPlus()"
                  >
                    {{timerangeee.label}}
                  </q-item>
                </q-menu>
              </button>
              <button class="orderLink" style="padding-left: 16px">
                {{sort.label}}
                <q-menu dense>
                  <q-item
                    v-for="sortee in $t('jobs.sortOpts')"
                    :key="sortee.value"
                    style="lineHeight: 2"
                    dense :style="{color: sort.value == sortee.value ? 'var(--violet-btn-color)' : 'var(--color1)'}"
                    clickable v-close-popup
                    @click="sort = sortee; prefilterDelayedRefreshPlus()"
                  >
                    {{sortee.label}}
                  </q-item>
                </q-menu>
              </button>
            </div>
            <div style="justify-self: flex-end">
              <span class="jobs__prefilters-label">Отображать:</span>
              <button class="orderLink">
                {{perpage.label}}
                <q-menu dense>
                  <q-item
                    v-for="perpageee in $t('jobs.perpageOpts')"
                    :key="perpageee.value"
                    style="lineHeight: 2"
                    dense :style="{color: perpage.value == perpageee.value ? 'var(--violet-btn-color)' : 'var(--color1)'}"
                    clickable v-close-popup
                    @click="perpage = perpageee; prefilterDelayedRefreshPlus()"
                  >
                    {{perpageee.label}}
                  </q-item>
                </q-menu>
              </button>
            </div>
            <!-- <q-select dense outlined
              style="white-space: nowrap"
              class="sdpp-filters"
              v-model="perpage"
              @input="perpageFilterChangeRefresh"
              :options="$t('jobs.perpageOpts')"
            /> -->

            <!-- <div>По запросу: <strong>{{jobsFullcount}}</strong></div> -->
            
            <!-- <div v-if="pages && pages > 0" class="paginationWrap">
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
            </div> -->
            
            <!-- @input="switchPage" -->
            <!-- <p>Показано {{jobslist.length}} из {{jobsFullcount}}</p> -->
            <!-- <p v-if="txt != ''">Найдено: {{jobsFullcount}}</p> -->
            <!-- <q-btn-toggle
              v-if="wwidth > 549"
              v-model="lenses"
              toggle-color="red-10"
              size="sm"
              dense
              :options="[ {value: 'short', icon: 'list'},
                          {value: 'full', icon: 'code'},]"
            /> -->
          </div>
          <JobsList
            :ownCVs="ownCVs"
            :role="role"
            @hitcv="hitcv"
            :lenses="wwidth > 549 ? lenses : 'short'" :searchFilter="searchFilter" :jobslist="jobslist"
          />
        <!-- </div> -->
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
      <div class="jobs__right-aside">
        <div class="right-aside__salaries-stat statbox">
          <h3
            class="aside-h3" style="margin-left: 7px;"
          >Зарплаты</h3>
          <div class="wrapline">
            <div class="wrapcol0">
              <svg width="8" height="201" viewBox="0 0 8 201" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.59815 0.633789C4.40289 0.438522 4.08631 0.438522 3.89105 0.633789L0.709064 3.81577C0.513802 4.01103 0.513802 4.32761 0.709064 4.52287C0.904327 4.71812 1.22091 4.71812 1.41617 4.52287L4.2446 1.69444L7.07303 4.52287C7.26829 4.71812 7.58487 4.71812 7.78013 4.52287C7.97539 4.32761 7.97539 4.01103 7.78013 3.81577L4.59815 0.633789ZM4.7446 200.003L4.7446 0.987335H3.7446L3.7446 200.003H4.7446Z" fill="#181059"/>
              </svg>
            </div>
            <div class="wrapcol">
              <div class="sal">{{salMin}}</div>
              <div class="boxMin"></div>
            </div>
            <div class="wrapcol">
              <div class="sal">{{salAvg}}</div>
              <div class="boxAvg"></div>
            </div>
            <div class="wrapcol">
              <div class="sal">{{salMax}}</div>
              <div class="boxMax"></div>
            </div>
          </div>
          <div class="wrapline2">
            <svg width="170" height="9" viewBox="0 0 170 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M169.425 4.85377C169.621 4.6585 169.621 4.34192 169.425 4.14666L166.243 0.96468C166.048 0.769418 165.732 0.769418 165.536 0.96468C165.341 1.15994 165.341 1.47652 165.536 1.67179L168.365 4.50021L165.536 7.32864C165.341 7.5239 165.341 7.84049 165.536 8.03575C165.732 8.23101 166.048 8.23101 166.243 8.03575L169.425 4.85377ZM0.997864 5.00021H169.072V4.00021H0.997864V5.00021Z" fill="#181059"/>
            </svg>
          </div>
        </div>
        <div class="right-aside__professions-stat statbox">
          <h3
            class="aside-h3"
          >Топ профессий</h3>
          <div class="professions-list">
            <div class="professions-row" v-for="(top,i) in tops" :key="i">
              <div>{{top[0]}}</div>
              <div>{{top[1]}}</div>
            </div>
          </div>
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
    jobsFullcount: {type: Number, default: 0},
    salMin: String,
    salAvg: String,
    salMax: String,
    tops: Array,
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
    prefilterDelayedRefreshPlus() {
      setTimeout(()=>this.refreshPlus())
    },
    // sortFilterChangeRefresh() {
    //   //if (this.sort.value != 'new') this.outerResetNeeded = true
    //   setTimeout(()=>this.refreshPlus())
    // },
    // timerangeFilterChangeRefresh() {
    //   //if (this.timerange.value != 'mon') this.outerResetNeeded = true
    //   setTimeout(()=>this.refreshPlus())
    // },
    // perpageFilterChangeRefresh() {
    //   //if (this.perpage.value != '25') this.outerResetNeeded = true
    //   setTimeout(()=>this.refreshPlus())
    // },
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
  padding 0px 0px
  // .jobs__top-wrapper
  //   z-index 1
  //   //background #fff
  //   ////position sticky
  //   top 0px
  //   padding-top 10px
  //   box-sizing border-box
  //   margin-bottom 15px
  //   border-bottom-left-radius 15px
  //   border-bottom-right-radius 15px
  .jobs__banner
    display flex
    text-align left
    padding-top 12.5px
    margin-bottom 46px
  .jobs__top-search
    //background-color var(--main-bg-color)
    display flex
    //justify-content center
    //margin 0
    //padding 10px 15px
    //box-sizing border-box
    //box-shadow 0 0 3px 0px #a0a9
    //box-shadow 0 0 4px 1px var(--main-borders-color)
    //border-radius 15px
  .jobs__filterpart
    //position sticky
    //box-sizing border-box
    //top 105px
    //top 10px
    //display flex
    //margin-right 20px
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
    margin 0 26px
    flex-grow 2
    //box-sizing border-box
    //width calc(100% - 10px)
    //max-width calc(var(--maxW) - 410px) //that is including the filters to the left
  .jobs_prefilters
    margin-bottom 26px
    padding-top 6px
    //background-color var(--main-bg-color)
    //box-shadow 0 0 4px 1px var(--main-borders-color)
    //box-sizing border-box
  *
    margin 0
  .line
    display flex
    justify-content space-between
    align-items center
  .pageBtns
    cursor pointer
    border 0
    margin 0
    background-color transparent
    font-family: Montserrat, sans-serif
    font-weight: normal;
    font-size: 16px;
    line-height: 20px;
    color var(--violet-btn-color)
    &:focus
      outline none
    &:hover
      color var(--color1)
  .currentPage
    font-weight bold
  .orderLink
    white-space nowrap
    border 0
    background-color transparent
    color var(--violet-btn-color)
    cursor pointer
    font-family: Montserrat, sans-serif
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    background-image url('./../../public/assets/arrow3.png')
    background-repeat no-repeat
    background-position right 3px center
    padding-right 18px
    &:hover
      color var(--color1)
  .paginationWrap
    padding 22px 0
    padding-bottom 32px
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
.statbox
  background white
  box-shadow 0px 5px 15px rgba(0, 0, 0, 0.15)
  border-radius 10px
  padding 28px 30px 39px 30px
  width 234px
  box-sizing border-box
  text-align left
  margin-bottom 18px
.jobs__prefilters-label
  color black
  font-family: Montserrat, sans-serif !important
  font-weight: normal !important
  font-size: 14px !important
  line-height: 17px !important
.jobs__right-aside
  .aside-h3
    font-family "Montserrat", sans-serif
    font-weight bold
    font-size 16px !important
    line-height 20px !important
    color var(--color1)
    text-transform uppercase
    width 130px
    margin-bottom 22px
  .professions-list
    width 172px
  .professions-row
    display flex
    justify-content space-between
    margin-bottom 11px
    align-items flex-end
    div
      font-family "Montserrat", sans-serif !important
      font-size 12px !important
      line-height 15px !important
.searchInput:focus
  outline none
  box-shadow 0px 0px 2px var(--violet-btn-color) !important
@media screen and (max-width: 550px)
  .jobs
    padding 0
    padding-left 5px
    .jobs__filterpart
      margin-right 0px
    .searchBtn
      font-size 12px
      margin auto
    .jobs__top-search
      padding 5px
      border-radius 5px
    .pageBtns
      padding 3px
      margin 0px
  .filtersHamburgerBtn
    display block

.wrapline
  display flex
  width 155px
  height 100%
  padding-left 6px
.wrapline2
  padding 0
  margin 0
  margin-top -10px
  padding-left 9px
  width 170px
.wrapcol
  width 100%
  display flex
  flex-direction column
  justify-content flex-end
  min-height 100%
  padding 0 2.5px
  margin-bottom 4px
  flex-grow 1
 .boxMin
   height 51%
   background-color rgba(134, 69, 255, 0.3)
 .boxAvg
   height 67%
   background-color rgba(24, 16, 89, 0.5);
 .boxMax
   height 90%
   background-color #4CBDF5;
 .sal
   text-align center
   font-family: Montserrat;
   font-style: normal;
   font-weight: bold;
   font-size: 10px;
   line-height: 12px;
   color: #181059;
   margin-bottom 11px;

</style>