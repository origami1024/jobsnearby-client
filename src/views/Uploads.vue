<template>
  <div class="uploads">
    <div v-if="role === 'company'" class="authed">
      <h4 class="uploads__header">Добавление нескольких вакансий</h4>
      <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        animated
        style="paddingLeft: 0"
      >
        <q-step
          :name="1"
          title="Добавить несколько вакансий через Excel"
          icon="settings"
          :done="step > 1"
        >
          Выберите файл с вакансиями. <a href="/Vacancy_V5.xlsx">Пример файла</a>
          <q-input
            @change="parseFile"
            outlined
            dense
            style="max-width: 250px"
            type="file"
            hint=".xls и .xlsx файлы"
            accept=".xls, .xlsx"
            ref="fileUploader"
            name="fileUploader"
            id="fileUploader"
          />
        </q-step>
        <q-step
          :name="2"
          title="Опубликовать вакансии"
          icon="create_new_folder"
          :done="step > 2"
        >
          <div>
            <table style="border-spacing: 0">
              <thead :style="{backgroundColor: 'black', color: 'white'}">
                <td>Название</td>
                <td>Зарп от</td>
                <td>Зарп до</td>
                <td>Вал юта</td>
                <td>возр от</td>
                <td>возр до</td>
                <td>время от</td>
                <td>время до</td>
                <td>режим</td>
                <td>Языки</td>
                <td>Образ ование</td>
                <td>Стаж</td>
                <td>Город</td>
                <td>Тип занят ости</td>
                <td>Дополнительно</td>
                <td>Тел</td>
                <td>Почта</td>
              </thead>
              <tr @input="onEditableInput" v-for="(item, index) in parsed" :key="index" :itemindex="index">
                <td contenteditable="true" propname="title">{{item.title}}</td>
                <td contenteditable="true" propname="salary_min">{{item.salary_min}}</td>
                <td contenteditable="true" propname="salary_max">{{item.salary_max}}</td>
                <td contenteditable="true" propname="currency">{{item.currency}}</td>
                <td contenteditable="true" propname="age1">{{item.age1}}</td>
                <td contenteditable="true" propname="age2">{{item.age2}}</td>
                <td contenteditable="true" propname="worktime1">{{item.worktime1}}</td>
                <td contenteditable="true" propname="worktime2">{{item.worktime2}}</td>
                <td contenteditable="true" propname="schedule">{{item.schedule}}</td>
                <td contenteditable="true" propname="langs">{{item.langs}}</td>
                <td contenteditable="true" propname="edu">{{item.edu}}</td>
                <td contenteditable="true" propname="experience">{{item.experience}}</td>
                <td contenteditable="true" propname="city">{{item.city}}</td>
                <td contenteditable="true" propname="jtype">{{item.jtype}}</td>
                <td contenteditable="true" propname="description">{{item.description}}</td>
                <td contenteditable="true" propname="contact_tel">{{item.contact_tel}}</td>
                <td contenteditable="true" propname="contact_mail">{{item.contact_mail}}</td>
              </tr>
            </table>
            <q-btn v-if="step > 1" flat color="primary" @click="resetParsed" label="Сбросить" class="q-ml-sm" />
            <q-btn color="primary" @click="sendNewJobs" :disabled="parsed.length < 1" label="Опубликовать"/>
          </div>
        </q-step>
        <q-step
          :name="3"
          title="Финиш"
          icon="done"
          :done="step > 3"
        >
          <p>{{uploadStatus}}</p>
          <q-btn color="primary" @click="step = 1" :disabled="step.length < 3" label="Добавить еще несколько вакансий через Excel"/>
        </q-step>
      </q-stepper>
      <h4 class="uploads__header">Все опубликованные вакансии({{ownJobs.length}})</h4>
      <div class="uploads__published">
        <JobsStats @editJob="editJob" @delJob="delJob" :jobslist="ownJobs"/>
        <!-- <JobsList :jobslist="ownJobs"/> -->
      </div>
    </div>
    <div v-else>
      Авторизируйтесь, для возможности загрузки вакансий
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
const xlsx = require('@/libs/xlsx.mini.min')
import axios from 'axios'
const config = require('@/configs/main_config')


import JobsList from '@/components/organisms/JobsList.vue'
import JobsStats from '@/components/organisms/JobsStats.vue'

export default {
  name: 'uploads',
  props: {
    ownJobs: Array,
    uid: Number,
    authed: {type: Boolean, default: false},
    role: String,
  },
  data() {
    return {
      step: 1,
      file: undefined,
      parsed: [],
      uploadStatus: 'готов к загрузке'
    }
  },
  computed: {
    // myjobslist: function () {
    //   return this.jobslist.filter(job => job.author_id === this.uid)
    // }
  },
  methods:{
    editJob(jid) {
      console.log('edit jab: ', jid)
      this.$emit('editJob', jid)
    },
    delJob(jid) {
      this.$emit('delJob', jid)
    },
    onEditableInput(e) {
      //console.log('event: ', e)
      let itemindex = e.target.parentElement.getAttribute('itemindex')
      let propname = e.target.getAttribute('propname')
      let newContent = e.target.textContent
      console.log('t ', e.target.getAttribute('propname'))
      console.log('t1 ', e.target.textContent)
      console.log('t2 ', e.target.parentElement.getAttribute('itemindex'))
      this.parsed[itemindex][propname] = newContent
    },
    resetParsed() {
      this.parsed = []
      this.step = 1
    },
    sendNewJobs: function () {
      
      if (this.parsed.length > 0) {
        this.uploadStatus = 'Идет загрузка...'
        console.log(this.parsed)
        axios
          .post(config.jobsUrl + '/entrance', this.parsed, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
          .then(response => {
            if (response.data === 'OK') {
              this.uploadStatus = 'Вакансии успешно опубликованы'
              this.$emit('getOwnJobs')
            } else {this.uploadStatus = 'Загрузка не удалась'}
            
          })
        this.parsed = []
        this.step = 3
        
      } else {this.uploadStatus = 'Загрузите данные'}
    },
    parseFile: function (e) {
      this.files = e.target.files
      let reader = new FileReader()
      let localVue = this
      reader.onload = function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = xlsx.read(data, {type: 'array'});
        
        let tmp = workbook.Sheets[workbook.SheetNames[0]]
        
        let lastLineIndex = tmp["!ref"].split(':')
        lastLineIndex = Math.min(lastLineIndex[lastLineIndex.length - 1].replace(/\D/g,''), 15)
        console.log('ccc', lastLineIndex)
        let getjtype = (val) => {
          //console.log('gettype cp1: ', val)
          return (val == 'постоянная') ? 'c' : (val == 'временная') ? 'v' : ''
        }

        
        let entries = [
          'title', 'salary_min', 'salary_max', 'currency', 'contact_tel', 'contact_mail', 'description',
          'age1', 'age2', 'worktime1', 'worktime2', 'schedule', 'edu', 'experience', 'city'
        ]
        let len = lastLineIndex
        lastLineIndex = 0
        let newData = []
        let alpha = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('')
        let alphaIndex = 0
        let newl = (entryname) => {
          //console.log(lastLineIndex)
          //console.log(alpha[alphaIndex] + lastLineIndex)
          if (alpha[alphaIndex] + lastLineIndex in tmp) newData[lastLineIndex][entryname] = tmp[alpha[alphaIndex] + lastLineIndex].v
          alphaIndex += 1
        }
        while (lastLineIndex <= len) {
          alphaIndex = 0
          newData.push({})
          entries.forEach(val => newl(val))
          // if ('A'+lastLineIndex in tmp) newData[lastLineIndex].title = tmp['A'+lastLineIndex].v
          // if ('B'+lastLineIndex in tmp) newData[lastLineIndex].salary_min = tmp['B'+lastLineIndex].v
          // if ('C'+lastLineIndex in tmp) newData[lastLineIndex].salary_max = tmp['C'+lastLineIndex].v
          // if ('D'+lastLineIndex in tmp) newData[lastLineIndex].currency = tmp['D'+lastLineIndex].v
          // if ('E'+lastLineIndex in tmp) newData[lastLineIndex].contact_tel = tmp['E'+lastLineIndex].v
          // if ('F'+lastLineIndex in tmp) newData[lastLineIndex].contact_mail = tmp['F'+lastLineIndex].v
          // if ('E'+lastLineIndex in tmp) newData[lastLineIndex].contact_mail = tmp['E'+lastLineIndex].v
          // if ('F'+lastLineIndex in tmp) newData[lastLineIndex].age1 = tmp['F'+lastLineIndex].v
          // if ('G'+lastLineIndex in tmp) newData[lastLineIndex].age2 = tmp['G'+lastLineIndex].v
          // if ('H'+lastLineIndex in tmp) newData[lastLineIndex].worktime1 = tmp['H'+lastLineIndex].v
          // if ('I'+lastLineIndex in tmp) newData[lastLineIndex].worktime2 = tmp['I'+lastLineIndex].v
          // newData[lastLineIndex].langs = []
          // if ('J'+lastLineIndex in tmp) newData[lastLineIndex].langs.push(tmp['J'+lastLineIndex].v)
          // if ('K'+lastLineIndex in tmp) newData[lastLineIndex].langs.push(tmp['K'+lastLineIndex].v)
          // if ('L'+lastLineIndex in tmp) newData[lastLineIndex].langs.push(tmp['L'+lastLineIndex].v)
          // if ('M'+lastLineIndex in tmp) newData[lastLineIndex].edu = tmp['M'+lastLineIndex].v
          // if ('N'+lastLineIndex in tmp) newData[lastLineIndex].experience = tmp['N'+lastLineIndex].v
          // if ('O'+lastLineIndex in tmp) newData[lastLineIndex].city = tmp['O'+lastLineIndex].v
          // if ('P'+lastLineIndex in tmp && getjtype(tmp['P'+lastLineIndex].v) != '') newData[lastLineIndex].jtype = getjtype(tmp['P'+lastLineIndex].v)
          // if ('Q'+lastLineIndex in tmp) newData[lastLineIndex].description = tmp['Q'+lastLineIndex].v
          //newData[lastLineIndex].author_id = this.uid AUTHOR ID SHOULD BE TAKEN FROM DB BY SESSION, NOT SAFE HERE
          console.log((alpha[alphaIndex] + lastLineIndex in tmp && getjtype(tmp[alpha[alphaIndex] + lastLineIndex].v) != ''))
          if (alpha[alphaIndex] + lastLineIndex in tmp && getjtype(tmp[alpha[alphaIndex] + lastLineIndex].v) != '') newData[lastLineIndex].jtype = getjtype(tmp[alpha[alphaIndex] + lastLineIndex].v)
          alphaIndex += 1

          newData[lastLineIndex].langs = []
          if (alpha[alphaIndex] + lastLineIndex in tmp) newData[lastLineIndex].langs.push(tmp[alpha[alphaIndex] + lastLineIndex].v)
          alphaIndex += 1
          if (alpha[alphaIndex] + lastLineIndex in tmp) newData[lastLineIndex].langs.push(tmp[alpha[alphaIndex] + lastLineIndex].v)
          alphaIndex += 1
          if (alpha[alphaIndex] + lastLineIndex in tmp) newData[lastLineIndex].langs.push(tmp[alpha[alphaIndex] + lastLineIndex].v)
          alphaIndex += 1
          lastLineIndex++
        }
        console.log(newData)
        newData.shift()
        newData.shift()
        
        localVue.parsed = newData
        //localVue.$refs.stepper.next()
        localVue.step = 2
      }
      reader.readAsArrayBuffer(this.files[0])
      
    },
    
  },

  components: {
    JobsList,
    JobsStats,
  }
}
</script>


<style scoped lang="stylus">
.uploads
  max-width 1280px
  &__header
    //margin 8px 0
    margin-top 16px
    margin-bottom 8px
    font-size 15px
    font-weight 600
  &__published
    //margin-top 15px
    padding 10px 10px
    box-shadow 0 1px 4px 2px #ddd
    border-radius 4px
  table
    border-collapse:collapse
  tr:nth-child(odd)
    background-color #eee
  .authed
    margin 10px
</style>