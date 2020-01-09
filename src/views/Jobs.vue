<template>
  <div class="jobs">
    <div class="jobs__top-wrapper">
      <div class="jobs__top">
        <q-input
          v-model="txt"
          dense
          label="Поиск"
          class="jobsfilter__search"
          :rules="[val => wordRegex.test(val) || 'некорректная строка поиска']"
          @keyup.enter="refreshPlus"
          hint="Поиск по полям название, автор, город, основной текст"
        >
          <template v-if="txt" v-slot:append>
            <q-icon name="cancel" @click.stop="txt = ''" class="cursor-pointer" />
          </template>
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn @click="refreshPlus" color="primary" :loading="pending" class="jobsfilter__search-btn">Поиск</q-btn>
      </div>
    </div>
    <div class="jobs__main">
      <div>
        <div class="jobs__filterpart">
          <JobsFilter @cityUpd="cityUpd" @jtypeUpd="jtypeUpd" @expUpd="expUpd" @salaryUpd="salaryUpd" :city="city" :salary="salary" :exp="exp" :jtype="jtype" :pending="pending" @refresh="$emit('refresh')" :langOptions="langOptions" @updLangs="updLangs" @slideEnd="slideEnd" :highest="maxSal" :lowest="minSal"></JobsFilter>
        </div>
      </div>
      <div class="jobs__contents">
        <div class="line jobs_prefilters">
          <q-select dense outlined
            :style="{minWidth: '240px'}"
            v-model="sort"
            :options="[ {label: 'По дате', value: 'new'},
                        {label: 'По убыванию зарплаты', value: 'saldesc'},
                        {label: 'По возрастанию зарплаты', value: 'salasc'}]"
          />
          <q-select dense outlined
            :style="{minWidth: '130px'}"
            v-model="timerange"
            :options="[ {label: 'За месяц', value: 'mon'},
                        {label: 'За неделю', value: 'wee'},
                        {label: 'За сутки', value: 'day'}]"
          />
          <q-select dense outlined
            :style="{minWidth: '130px'}"
            v-model="perpage"
            :options="[ {label: '25 на стр', value: '25'},
                        {label: '50 на стр', value: '50'},
                        {label: '100 на стр', value: '100'}]"
          />
          <!-- <q-pagination
            :value="page_current"
            :max="pages"
            :disable="pending"
            @input="switchPage"
            size="sm"
            ellipses
          /> -->
          <div v-if="pages && pages > 0" class="paginationWrap">
            <button
              :class="{pageBtns: true, currentPage: page_current == i}"
              v-for="i of pages" :key="i"
              @click="switchPage(i)"
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
        <JobsList :showLiked="role === 'subscriber'" :likedJobs="likedJobs" @favOne="favOne" :lenses="lenses" :searchFilter="searchFilter" :jobslist="jobslist" msg="Полученные"/>
        <div v-if="pages && pages > 0" class="paginationWrap">
          <button
            :class="{pageBtns: true, currentPage: page_current == i}"
            v-for="i of pages" :key="888 + i"
            @click="switchPage(i)"
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
    likedJobsList: {type: Array, default: ()=>[]},
    pending: {type: Boolean, default: false},
    pages: {type: Number, default: 1},
    page_current: {type: Number, default: 1},
    jobsFullcount: {type: Number, default: 0}
  },
  data: ()=>{return {
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
    city: 'Не имеет значения',
    jtype: {label: "Не имеет значения", value: ''},
    salary: {label: "Не имеет значения", value: 'idc'},
    exp: {label: "Не имеет значения", value: 'idc'}, 

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
    favOne(id) {
      console.log('favOne from Jobs')
      this.$emit('favOne', id)
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
  .jobs__top
    background-color #f7f7f7
    display flex
    margin 0
    padding 10px 15px
    box-sizing border-box
    //box-shadow 0 0 3px 0px #a0a9
    box-shadow 0 0 4px 1px #06f
    border-radius 15px
  .jobs__filterpart
    position sticky
    top 105px
    display flex
    margin-right 25px
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
  .jobs_prefilters
    margin-bottom 10px
    background-color #eee
    padding 5px
    border-radius 5px
    box-shadow 0 0 3px 0px #a0a9
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
</style>
