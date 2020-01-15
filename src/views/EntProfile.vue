<template>
  <div v-if="role === 'company'" class="entprofile">
    <div class="entprofile__inner">
      <q-tabs
        align="justify"
        v-model="tab"
        class="bg-primary text-white shadow-2 tabs"
        dense
      >
        <q-tab alert name="published" icon="list" label="Мои публикации">
        </q-tab>
        <q-tab disable name="responses" icon="work" label="Отклики">
          <q-badge color="red" floating>0</q-badge>
        </q-tab>
        <q-tab disable name="starred" icon="assignment_ind" label="Избранные резюме">
        </q-tab>
        <q-tab name="settings" icon="settings" label="Личные данные">
        </q-tab>
      </q-tabs>
      <q-tab-panels
        v-model="tab"
        animated
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel name="published" class="entprofile__published">
          <h4 class="entprofile__header">Опубликованные вакансии({{ownJobs.length}}):</h4>
          <JobsTable @editJob="editJob" @delJob="delJob" :jobslist="ownJobs"/>
        </q-tab-panel>
        <q-tab-panel name="responses">
        </q-tab-panel>
        <q-tab-panel name="starred">
        </q-tab-panel>
        <q-tab-panel class="entprofile__settings" name="settings">
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
    JobsTable
  },
  methods: {
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
.entprofile
  max-width 900px
  padding 0 10px
  padding-top 10px
  display flex
  flex-direction column
  justify-content center
  p
    margin-bottom 15px
  &__inp
    width 300px
  &__header
    display flex
    justify-content flex-end
    font-size 18px
  .tabs
    border-top-left-radius 15px
    border-top-right-radius 15px
    justify-content center
    animation-duration 0.3s
    transition-duration 0.3s
  .entprofile__published
    width 100%
    background-color #eee
    display flex
    flex-direction column
    align-items flex-start
    border-bottom-left-radius 15px
    border-bottom-right-radius 15px
  .entprofile__settings
    background-color #eee
    display flex
    flex-direction column
    align-items flex-end
    border-bottom-left-radius 15px
    border-bottom-right-radius 15px
  .anim1
    animation-duration 0.3s
    transition-duration 0.3s
  *
    margin 0
</style>
