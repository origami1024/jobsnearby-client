<template>
  <div class="jobsstats">
    <div>
      <table>
        <thead>
          <tr>
            <td style="width: 22%; min-width: 22%; max-width: 22%; text-align: left">{{$t('jobsStats.title')}}</td>
            <td style="width: 6%; min-width: 6%; max-width: 6%;">{{$t('jobsStats.views')}}</td>
            <td style="width: 6%; min-width: 6%; max-width: 6%;">{{$t('jobsStats.uniqViews')}}</td>
            <!-- <td style="width: 15%; min-width: 15%; max-width: 15%;">Подали резюме</td> -->
            <td style="width: 42%; min-width: 42%; max-width: 42%;">
              {{$t('jobsStats.status')}}
            </td>
            <!-- <td style="width: 33%; min-width: 33%; max-width: 33%;">{{$t('jobsStats.status')}}</td> -->
            <td style="width: 8%; min-width: 8%; max-width: 8%;">{{$t('jobsStats.change')}}</td>
            <td style="width: 8%; min-width: 8%; max-width: 8%;">{{$t('jobsStats.close')}}</td>
            <td style="width: 8%; min-width: 8%; max-width: 8%;">{{$t('jobsStats.delete')}}</td>
          </tr>
        </thead>
        <tr class="jobstat" v-for="item in jobslist" :key="item.job_id">
          <td style="text-align: left"><a class="link1" target="_blank" :href="'/jobpage?id=' + item.job_id">{{item.title}}</a></td>
          <td>{{Number(item.hits_all)}}</td>
          <td>{{item.hits_uniq}}</td>
          <!-- <td>{{item.is_published === true ? $t('jobsStats.published') : $t('jobsStats.notpublished')}}</td> -->
          <td>
            {{
              (item.is_published === true && item.is_closed === false)
                ? $t('jobsStats.published')
                : (item.is_published === true && item.is_closed === true)
                  ? 'Закрыта пользователем' 
                  : (item.is_published === false && item.is_closed === false)
                    ? 'Ожидает проверки модератора' 
                    : (item.closed_why !== null && item.closed_why.length > 0)
                      ? 'Закрыта модератором: "' +  item.closed_why + '"'
                      : 'Закрыта модератором'
            }}
          </td>
          <td>
            <q-btn
              v-if="!item.is_closed"
              icon="edit"
              size="sm"
              color="green"
              glossy
              @click="$emit('editJob', item.job_id)"
            >
              <q-tooltip>
                <p style="font-size: 15px;margin: 0">{{$t('jobsStats.editHint')}}</p>
              </q-tooltip>
            </q-btn>
            <q-btn
              v-else-if="item.is_published == true && item.is_closed == true"
              icon="work"
              size="sm"
              color="blue"
              glossy
              @click="$emit('reopenJob', item.job_id)"
            >
              <q-tooltip>
                <p style="font-size: 15px;margin: 0">{{$t('jobsStats.reopenHint')}}</p>
              </q-tooltip>
            </q-btn>
            <q-btn
              v-else-if="item.is_published == false && item.is_closed == true"
              icon="build"
              size="sm"
              color="purple"
              glossy
              @click="$emit('reopenJob', item.job_id)"
            >
              <q-tooltip>
                <p style="font-size: 15px;margin: 0">{{$t('jobsStats.resendHint')}}</p>
              </q-tooltip>
            </q-btn>
          </td>
          <td>
            <q-btn
              v-if="!item.is_closed"
              icon="work_off"
              size="sm"
              color="orange"
              glossy
              @click="closeThis(item.job_id)"
            >
              <q-tooltip>
                <p style="font-size: 15px;margin: 0">{{$t('jobsStats.closeHint')}}</p>
              </q-tooltip>
            </q-btn>
            <span v-else>
              {{$t('jobsStats.closed')}}
            </span>
          </td>
          <td>
            <q-btn
              icon="delete_forever"
              size="sm"
              color="red"
              glossy
              @click="delThis(item.job_id)"
            >
              <q-tooltip>
                <p style="font-size: 15px;margin: 0">{{$t('jobsStats.deleteHint')}}</p>
              </q-tooltip>
            </q-btn>
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
    font-size 14px
  td
    padding 3px
    // font-size 12px
    max-width 85px
    font-size 16px
    line-height 20px
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
