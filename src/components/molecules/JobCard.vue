<template>
  <div :class="{ jobscard: true }">
    <div class="line lowres_twolines cityAndCompany">
      <div class="line" style="align-items: center;">
        <p class="city" :class="job.city.length > 0 ? 'cityOK' : ''" v-html="filteredCity"></p>
        <a :href="'/companypage?id=' + job.author_id" target="_blank">
          <div class="author joblink" v-html="filteredAuthor"></div>
        </a>
      </div>
      <div class="line" style="align-items: center; font-weight: 500; font-size: 12px; line-height: 15px; color: var(--color1);">
        <!-- <div class="updated__label">Размещено:</div> -->
        <p class="updated__value" v-html="lastUpdated"></p>
      </div>
    </div>
    <div class="line lowres_twolines linetwo">
      <h4 class="cardHeader">
        <a :href="'/jobpage?id=' + job.job_id" target="_blank">
          <strong class="joblink" v-html="filteredTitle"/>
        </a>
      </h4>
      <div class="colx salary__outer-wrap">
        <strong class="alignRight jobcard__salary">
          <p v-if="job.salary_min === job.salary_max && job.salary_min > 0">{{job.salary_max}}&nbsp;{{currency}}</p>
          <!-- <p v-else-if="job.salary_min && job.salary_min > 0">от {{job.salary_min}} до {{job.salary_max}} {{currency}}</p> -->
          <p v-else-if="job.salary_min && job.salary_min > 0">{{job.salary_min}}&nbsp;-&nbsp;{{job.salary_max}}&nbsp;{{currency}}</p>
          <p v-else-if="job.salary_max > 0">{{job.salary_max}}&nbsp;{{currency}}</p>
          <p v-else style="text-align: right; font-size: 16px;">{{$t('jc.salaryNone')}}</p>
        </strong>
      </div>
    </div>
    <div class="line">
      <p class="filteredDesc" v-html="
        `${job.experience == -1 ?
            $t('jc.expEmpty')
          :(1 > job.experience) ?
            $t('jc.expNone')
          :(job.experience >= 1 && 3 > job.experience) ?
            $t('jc.exp1_3')
          :(job.experience >= 3 && 5 > job.experience) ?
            $t('jc.exp3_5')
          :job.experience >= 5 ?
            $t('jc.exp5_')
          : ''} ${filteredDesc}`">
      </p>
    </div>
    
    <div class="line">
      <div class="line spbtw lowres_twolines" style="width: 100%">
        <!-- <q-btn class="mr-5px" v-else-if="role == 'subscriber'" round size="xs" icon="work"/> -->
        <a class="showContactsLink" @click.prevent="isContactsShown = !isContactsShown" href="#">
          {{$t('jc.contactsLabel')}}
        </a>
        <a v-if="role != 'company' && !cved" class="sendCVLink" @click.prevent="$emit('hitcv', job.job_id)" href="#">
          {{$t('jc.sendCVLabel')}}
        </a>
        <div v-else-if="role == 'subscriber'" class="cvSentSpan">
          <span style="font-size: 13px; color: gray; user-select: none">Резюме отправлено</span>
          <q-tooltip v-if="hitcv">
            <p v-if="(hitcv && hitcv.date_created)" style="font-size: 15px; margin: 0">{{$t('jc.tooltipSent')}} {{formatDate(hitcv.date_created)}}</p>
            <p v-if="(hitcv && hitcv.date_checked)" style="font-size: 15px; margin: 0">{{$t('jc.tooltipSeen')}} {{formatDate(hitcv.date_checked)}}</p>
            <p v-else style="font-size: 15px; margin: 0">{{$t('jc.tooltipNotseen')}}</p>
          </q-tooltip>
        </div>
        <!-- <q-btn
          v-if="role != 'company' && cved" text-color="primary" 
          round
          size="xs" 
          :icon="cved ? 'assignment_turned_in': 'assignment'"
          @click="$emit('hitcv', job.job_id)"
        >
          <q-tooltip v-if="hitcv">
            <p v-if="(hitcv && hitcv.date_created)" style="font-size: 15px; margin: 0">{{$t('jc.tooltipSent')}} {{formatDate(hitcv.date_created)}}</p>
            <p v-if="(hitcv && hitcv.date_checked)" style="font-size: 15px; margin: 0">{{$t('jc.tooltipSeen')}} {{formatDate(hitcv.date_checked)}}</p>
            <p v-else style="font-size: 15px; margin: 0">{{$t('jc.tooltipNotseen')}}</p>
          </q-tooltip>
        </q-btn> -->
      </div>
    </div>
    <div :class="{heightTransition: isContactsShown}" class="contactsPanel line" style="margin-top: 10px;">
      <div><span style="font-weight: 300;">Email:</span> {{job.contact_mail != '' ? job.contact_mail : 'Не указан'}}</div>
      <div><span style="font-weight: 300;">Tel:</span> {{job.contact_tel}}</div>
    </div>
  </div>
</template>

<script>
// const currencyDic = {
//   '$': '$',
//   'm': 'манат',
// }

export default {
  name: 'JobCard',
  props: {
    hitcvDateStart: String,
    hitcv: Object,
    hitcvDateEnd: String,
    cved: Boolean,
    role: String, 
    job: Object,
    searchFilter: {type: String, default: ''},
    lenses: {type: String, default: 'full'},
  },
  data: ()=>{return {
    isContactsShown: false  
  }},
  computed: {
    lastUpdated() {
      let d = new Date(this.job.updated)
      let today = new Date()
      let msInDay = 24 * 60 * 60 * 1000
      let diff = (today.getTime() - d.getTime())/msInDay | 0
      let result = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear()
      if (diff == 0) result = '<span style="color: var(--btn-color); letter-spacing: 1px;">' + this.$t('jc.today') + '</span>'
      else if (diff == 1) result = '<span style="color: var(--btn-color); letter-spacing: 1px;">' + this.$t('jc.yesterday') + '</span>'
      else if (diff < 5) result = `<span class="gray">${diff} ${this.$t('jc.daysAgo')}</span>`
      return result
    },
    currency() {
      return this.$t('App.currencyDic')[this.job.currency]
    },
    filteredTitle: function() {
      if (this.searchFilter.length > 1 && this.job.title.toLowerCase().includes(this.searchFilter)) {
        let i = this.job.title.toLowerCase().indexOf(this.searchFilter)
        return this.job.title.substr(0, i) + 
        '<span class="searched">' + this.job.title.substr(i, this.searchFilter.length) + '</span>' + 
        this.job.title.substr(i + this.searchFilter.length)
      } else return this.job.title
    },
    filteredAuthor: function() {
      if (this.searchFilter.length > 1 && this.job.author.toLowerCase().includes(this.searchFilter)) {
        let i = this.job.author.toLowerCase().indexOf(this.searchFilter)
        return this.job.author.substr(0, i) + 
        '<span class="searched">' + this.job.author.substr(i, this.searchFilter.length) + '</span>' + 
        this.job.author.substr(i + this.searchFilter.length)
      } else return this.job.author
    },
    filteredCity: function() {
      if (this.searchFilter.length > 1 && this.job.city.toLowerCase().includes(this.searchFilter)) {
        let i = this.job.city.toLowerCase().indexOf(this.searchFilter)
        return this.job.city.substr(0, i) + 
        '<span class="searched">' + this.job.city.substr(i, this.searchFilter.length) + '</span>' + 
        this.job.city.substr(i + this.searchFilter.length)
      } else if (this.job.city.length == 0) return 'Не указан'
      else return this.job.city
    },
    filteredDesc: function() {
      if (this.searchFilter.length > 1 && this.job.description.toLowerCase().includes(this.searchFilter)) {
        let tmpdesc = this.job.description.split('<br>').slice(0,1).join('')
        //console.log(this.job.description)
        tmpdesc = this.strip(tmpdesc)
        let i = tmpdesc.toLowerCase().indexOf(this.searchFilter)
        let res = tmpdesc.substr(0, i) + '<span class="searched">' + tmpdesc.substr(i, this.searchFilter.length) + '</span>' + tmpdesc.substr(i + this.searchFilter.length)
        //console.log(res)
        return res
      } else return this.strip(this.job.description.split('<br>').slice(0,1).join(''))
    },
  },
  methods: {
    formatDate(e) {
      let d = new Date(e)
      return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear()
    },
    strip(html) {
      return html.replace(/<(?:.|\n)*?>/gm, ' ').replace('  ', ' ');
      // var doc = new DOMParser().parseFromString(html, 'text/html');
      // return doc.body.textContent || "";
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
*
  margin 0
  text-align left
  font-family: Montserrat, sans-serif;
  font-style: normal;
.jobscard
  position relative
  box-sizing border-box
  transition-duration 0.1s
  //box-shadow 0 0 2px 1px #dfdfdf
  background: #fff;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15)
  border-radius: 10px;
  margin-bottom 18px
  padding 19px 30px
  @media screen and (max-width 950px)
    margin-bottom 10px
    padding 10px 12px
  @media screen and (max-width 550px)
    padding 6px
    width 100% //calc(100% - 5px)
  &:hover
    box-shadow 0 0 2px 1px var(--violet-btn-color)//#bbb
  a
    text-decoration none
  .cardHeader
    //font-weight 400
    //margin-bottom 3px
    font-weight: bold;
    font-size: 17px;
    line-height: 21px;
    text-transform uppercase
    
  .cityAndCompany
    margin-bottom 15px
    @media screen and (max-width 550px)
      margin-bottom 0
  .city
    //font-size 0.85em
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color var(--violet-btn-color)
    padding-right: 10px
    border-right: 1px solid var(--color1)
    line-height: 25px
    margin-right: 10px
    @media screen and (max-width 550px)
      width 50%
  .cityOK
    &:before
      content 'г.'
  .author
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color var(--color1)
  .updated__label
    margin-right 5px
    margin-left auto
    @media screen and (max-width 550px)
      display none
  .updated__value
    @media screen and (max-width 550px)
      margin-left auto
  .salary__outer-wrap
    margin-left 15px
    min-width 100px
    max-width 150px
    @media screen and (max-width 550px)
      margin-left 0
      margin-top 5px
      min-width auto
      max-width 100%
  .line
    //padding 5px
    display flex
    justify-content space-between
    &:last-child
      margin-bottom 0
  .linej
    display flex
  .line50
    display flex
    align-items center
    min-width 120px
    max-width 50%
  .lowres_twolines
    @media screen and (max-width 550px)
      flex-direction column
  .linetwo
    align-items center
    @media screen and (max-width 550px)
      align-items: flex-start
  .spbtw
    justify-content space-between
  .colx
    display flex
    flex-direction column
  .alignRight
    align-self flex-end

.showContactsLink
  background-image url(./../../../public/assets/arrow_jc.png)
  background-repeat no-repeat
  background-position right center
  padding-right 15px
  border-bottom 2px solid var(--violet-btn-color)
  font-family: Montserrat, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  color var(--color1)
  display inline-block
  align-self flex-end
  padding-bottom 2px
  @media screen and (max-width: 950px)
    font-size: 14px
    max-width 116px
  @media screen and (max-width: 550px)
    max-width 100%
    font-size 15px
    margin-right auto
    order 2
  &:hover
    color var(--violet-btn-color)
    background-image url(./../../../public/assets/arrow3.png)

.sendCVLink
  background-color var(--color-graypink)
  color var(--color1)
  text-decoration none
  border: 2px solid var(--violet-btn-color)
  box-sizing: border-box;
  border-radius: 10px;
  font-family: Montserrat, sans-serif
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  padding 9px 20px
  padding-right 17px
  transition-duration 0.25s
  @media screen and (max-width: 950px)
    padding 5px 10px
    padding-right 8px
    line-height: 26px;
  @media screen and (max-width 550px)
    order 1
    margin-bottom 6px
    align-self flex-start
  &:hover
    //color var(--violet-btn-color)
    background-color var(--violet-btn-color)
    color white
.contactsPanel
  border 0
  border-radius 10px
  padding 0px
  transition-duration 0.3s
  height 0
  overflow hidden
  color white
.heightTransition
  height auto
  padding 10px
  border: 1px solid var(--violet-btn-color)
  color var(--color1)
  margin 0
  font-family: Montserrat, sans-serif
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
.jobcard__salary p
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
  color var(--violet-btn-color)
.descFormats
  height 21px
  line-height 20px
  font-size 16px
  max-width 100%
  padding 5px
  padding-bottom 0
  margin-right 10px
  word-break break-all
.filteredDesc
  //height 34px
  max-height 34px
  //max-width 383px
  overflow hidden
  word-break break-word
  font-family: "Montserrat", sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color var(--color1)
  margin-top 12px
  margin-bottom 23px
  @media screen and (max-width: 950px)
    margin-top 5px
    margin-bottom 10px
.joblink
  color var(--color1)
  overflow-wrap: anywhere;
  &:hover
    color var(--violet-btn-color)
.cvSentSpan
  align-self center
  @media screen and (max-width 550px)
    align-self flex-end
    margin-bottom 10px
</style>
