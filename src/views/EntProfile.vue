<template>
  <div v-if="role === 'company'" class="entprofile">
    <div class="entprofile__inner">
      <EntProfileNav :localRoute="tab" @setLocalRoute="setLocalRoute"/>
      <q-tab-panels
        class="qtpans"
        @before-transition="changeTabs"
        v-model="tab"
        animated
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel name="published" class="entprofile__published entprofile__mid">
          <h4 class="entprofile__header">Опубликованные вакансии({{ownJobs.length}}):</h4>
          <JobsTable @editJob="editJob" @delJob="delJob" :jobslist="ownJobs"/>
        </q-tab-panel>
        <q-tab-panel name="responses" class="entprofile__mid">
        </q-tab-panel>
        <q-tab-panel name="cabout" class="entprofile__mid">
        </q-tab-panel>
        <q-tab-panel class="entprofile__settings entprofile__mid" name="settings">
          <p>Добавить контакты</p>
          <q-input dense class="entprofile__inp" outlined bottom-slots v-model="contacts1" label="Контакты" counter maxlength="30"/>
          <q-input dense v-show="contacts_count > 1" class="entprofile__inp" outlined bottom-slots v-model="contacts2" label="Контакты" counter maxlength="30"/>
          <q-input dense v-show="contacts_count > 2" class="entprofile__inp" outlined bottom-slots v-model="contacts3" label="Контакты" counter maxlength="30"/>
          <q-btn round color="primary" @click="contacts_count < 4 ? contacts_count += 1 : ''" size="sm" icon="add" :disable="contacts_count > 2"/>
          <div>
            <q-toggle v-model="editable" label="Изменить личные данные"/>
          </div>
          <q-input class="entprofile__inp" outlined bottom-slots :value="company" label="Название компании" counter maxlength="80" :readonly="!editable" />
          <q-input type="email" class="entprofile__inp" outlined bottom-slots v-model="newemail" label="Email" counter maxlength="50" :readonly="!editable" />
          <q-input :type="isPwd ? 'password' : 'text'" class="entprofile__inp" outlined bottom-slots v-model="newpw" label="Пароль" counter maxlength="25" :readonly="!editable">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-btn color="primary" label="Изменить" :disable="!editable"/>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import JobsTable from '@/components/organisms/JobsTable.vue'
import EntProfileNav from '@/components/molecules/EntProfileNav.vue'

export default {
  name: 'EntProfile',
  props: {
    ownJobs: Array,
    company: {type: String, default: ''},
    role: String
  },
  data: ()=>{return {
    lenses: 'full',
    contacts1: '',
    contacts2: '',
    contacts3: '',
    contacts_count: 1,
    newcompany: '',
    newsurname: '',
    newemail: '',
    newpw: '',
    isPwd: true,
    tab: 'settings',
    editable: false
  }},
  components: {
    //JobsList,
    JobsTable,
    EntProfileNav
  },
  methods: {
    changeTabs(newT) {
      //if (newT == 'published') this.$emit('getOwnJobs')
      newT != 'published' || this.$emit('getOwnJobs')
    },
    setLocalRoute(rou) {
      this.tab = rou
    },
    editJob(jid) {
      console.log('edit jab: ', jid)
      this.$emit('editJob', jid)
    },
    delJob(jid) {
      this.$emit('delJob', jid)
    },
    favOne(id) {
      this.$emit('favOne', id)
    }
  },
  mounted(){
    this.newusername = this.username
    this.newsurname = this.surname
  },
  watch: {
    username(newu) {
      this.newusername = newu
    },
    surname(news) {
      this.newsurname = news
    },
    // username(newu) {
    //   this.newusername = newu
    // },
  }
}
</script>

<style scoped lang="stylus">
.qtpans
  width 100%
  min-height 75vh
  border 1px solid #eee
  border-radius 4px
.entprofile
  max-width 900px
  padding 0 10px
  padding-top 10px
  display flex
  flex-direction column
  justify-content center
  &__inner
    display flex
  &__mid
    width 100%
    
  p
    margin-bottom 15px
  &__inp
    width 300px
  &__header
    display flex
    justify-content flex-end
    font-size 18px
  .tabs
    // border-top-left-radius 15px
    // border-top-right-radius 15px
    justify-content center
    animation-duration 0.3s
    transition-duration 0.3s
  .entprofile__published
    width 100%
    //background-color #eee
    display flex
    flex-direction column
    align-items flex-start
    // border-bottom-left-radius 15px
    // border-bottom-right-radius 15px
  .entprofile__settings
    //background-color #eee
    display flex
    flex-direction column
    align-items flex-end
    // border-bottom-left-radius 15px
    // border-bottom-right-radius 15px
  .anim1
    animation-duration 0.3s
    transition-duration 0.3s
  *
    margin 0
</style>
