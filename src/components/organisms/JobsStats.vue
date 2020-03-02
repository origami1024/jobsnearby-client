<template>
  <div class="jobsstats">
    <div>
      <table>
        <thead>
          <tr>
            <td style="width: 30%; min-width: 30%; max-width: 30%; text-align: left">{{$t('jobsStats.title')}}</td>
            <td style="width: 15%; min-width: 15%; max-width: 15%;">{{$t('jobsStats.views')}}</td>
            <td style="width: 15%; min-width: 15%; max-width: 15%;">{{$t('jobsStats.uniqViews')}}</td>
            <!-- <td style="width: 15%; min-width: 15%; max-width: 15%;">Подали резюме</td> -->
            <td style="width: 10%; min-width: 10%; max-width: 10%;">
              {{$t('jobsStats.published')}}
              <q-tooltip>
                <p style="font-size: 15px; margin: 0">{{$t('jobsStats.publishedHint')}}</p>
              </q-tooltip>
            </td>
            <td style="width: 10%; min-width: 10%; max-width: 10%;">{{$t('jobsStats.change')}}</td>
            <td style="width: 10%; min-width: 10%; max-width: 10%;">{{$t('jobsStats.close')}}</td>
            <td style="width: 10%; min-width: 10%; max-width: 10%;">{{$t('jobsStats.delete')}}</td>
          </tr>
        </thead>
        <tr class="jobstat" v-for="item in jobslist" :key="item.job_id">
          <td style="text-align: left"><a class="link1" target="_blank" :href="'/jobpage?id=' + item.job_id">{{item.title}}</a></td>
          <td>{{Number(item.hits_all)}}</td>
          <td>{{item.hits_uniq}}</td>
          <td>{{item.is_published === true ? $t('jobsStats.yes') : $t('jobsStats.no')}}</td>
          <td>
            <q-btn
              v-if="!item.is_closed"
              icon="edit"
              size="sm"
              color="green"
              round
              @click="$emit('editJob', item.job_id)"
            />
            <q-btn
              v-else
              icon="work"
              size="sm"
              color="blue"
              round
              @click="$emit('reopenJob', item.job_id)"
            />
          </td>
          <td>
            <q-btn
              v-if="!item.is_closed"
              icon="work_off"
              size="sm"
              color="orange"
              round
              @click="closeThis(item.job_id)"
            />
            <span v-else>
              {{$t('jobsStats.closed')}}
            </span>
          </td>
          <td>
            <q-btn
              icon="delete_forever"
              size="sm"
              color="red"
              round
              @click="delThis(item.job_id)"
            />
          </td>
        </tr>
      </table>
      <p v-if="jobslist.length == 0">{{$t('jobsStats.none')}}</p>
    </div>
  </div>
</template>

<script>
//import JobCard from './../molecules/JobCard'

export default {
  name: 'JobsStats',
  props: {
    jobslist: {type: Array, default: ()=>[]},
  },
  data: ()=>{return {
  }},
  computed: {
  },
  methods: {
    delThis(jid) {
      this.$emit('delJob', jid)
    },
    closeThis(jid) {
      this.$emit('closeJob', jid)
    }
  },
  components: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
*
  margin 0
.jobsstats
  box-sizing border-box
  width 100%
  min-width 300px
  table
    border-spacing 0
  thead td
    border-bottom 15px solid transparent
    font-size 16px
  td
    padding 3px
    font-size 12px
    max-width 85px
    font-size 16px
  .line
    display flex
    align-items center
    border 1px solid gray
    padding 5px
  .rowed
    display flex
    box-sizing border-box
    max-width 100vw
    overflow-x: scroll;
  .jobstat
    &:hover
      transition-duration 0.3s
      background-color #359DFD
      color white
      .link1
        color white
  .link1
    text-decoration none
    color #248CEC
    transition-duration 0.6s
</style>
