<template>
  <div class="uploads">
    <div v-if="role === 'company'" class="authed">
      <h4 class="uploads__header">Публикация</h4>
      <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        animated
      >
        <q-step
          :name="1"
          title="Спарсить данные из файла"
          caption="Шаг 1"
          icon="settings"
          :done="step > 1"
        >
          Выберите файл с вакансиями. <a href="#">пример файла</a>
          <q-input
            
            @change="parseFile"
            filled
            type="file"
            hint=".xls и .xlsx файлы"
            accept=".xls, .xlsx"
            ref="fileUploader"
            name="fileUploader"
            id="fileUploader"
          />
          <!-- <q-btn :disable="parsed.length == 0" @click="step = 2" color="primary" :label="step === 3 ? 'Finish' : 'Далее'" /> -->
        </q-step>
        <q-step
          :name="2"
          title="Отправить данные на сервер"
          caption="Шаг 2"
          icon="create_new_folder"
          :done="step > 2"
        >
          <div>
            <table>
              <thead :style="{backgroundColor: 'black', color: 'white'}">
                <tr>
                  <td>Название</td>
                  <td>Зарп от</td>
                  <td>Зарп до</td>
                  <td>Валюта</td>
                  <td>Пол</td>
                  <td>возр от</td>
                  <td>возр до</td>
                  <td>время от</td>
                  <td>время до</td>
                  <td>Языки</td>
                  <td>Образование</td>
                  <td>Стаж</td>
                  <td>Город</td>
                  <td>Тип занятости</td>
                  <td>Дополнительно</td>
                </tr>
              </thead>
              <tr @input="onEditableInput" v-for="(item, index) in parsed" :key="index" :itemindex="index">
                <td contenteditable="true" propname="title">{{item.title}}</td>
                <td contenteditable="true" propname="salary_min">{{item.salary_min}}</td>
                <td contenteditable="true" propname="salary_max">{{item.salary_max}}</td>
                <td contenteditable="true">{{item.currency}}</td>
                <td contenteditable="true">{{item.sex}}</td>
                <td contenteditable="true">{{item.age1}}</td>
                <td contenteditable="true">{{item.age2}}</td>
                <td contenteditable="true">{{item.worktime1}}</td>
                <td contenteditable="true">{{item.worktime2}}</td>
                <td contenteditable="true">{{item.langs}}</td>
                <td contenteditable="true">{{item.edu}}</td>
                <td contenteditable="true">{{item.experience}}</td>
                <td contenteditable="true">{{item.city}}</td>
                <td contenteditable="true">{{item.jtype}}</td>
                <td contenteditable="true">{{item.description}}</td>
              </tr>
            </table>
            <q-btn v-if="step > 1" flat color="primary" @click="resetParsed" label="Сбросить" class="q-ml-sm" />
            <q-btn color="primary" @click="sendNewJobs" :disabled="parsed.length < 1" label="Отправить на сервер"/>
          </div>
        </q-step>
        <!-- <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn :disable="parsed.length == 0" @click="$refs.stepper.next()" color="primary" :label="step === 3 ? 'Finish' : 'Далее'" />
            <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
          </q-stepper-navigation>
        </template> -->
      </q-stepper>

      
      
      <p>Статус: {{uploadStatus}}</p>
      <h4 class="uploads__header">Опубликованные вакансии({{ownJobs.length}}):</h4>
      <JobsList :jobslist="ownJobs" msg="Опубликованные"/>
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
              this.uploadStatus = 'Вакансии загружены и опубликованы, готов к работе'
              this.$emit('getOwnJobs')
            } else {this.uploadStatus = 'Загрузка не удалась'; console.log('trespasser')}
            
          })
        this.resetParsed()
        //this.$refs.fileUploader.files = null
        
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
        lastLineIndex = lastLineIndex[lastLineIndex.length - 1].replace(/\D/g,'')
        
        let getjtype = (val) => {
          console.log('gettype cp1: ', val)
          return (val == 'постоянная') ? 'c' : (val == 'временная') ? 'v' : ''
        }

        let len = lastLineIndex
        lastLineIndex = 0
        let newData = []
        while (lastLineIndex <= len) {
          newData.push({})        
          if ('A'+lastLineIndex in tmp) newData[lastLineIndex].title = tmp['A'+lastLineIndex].v
          if ('B'+lastLineIndex in tmp) newData[lastLineIndex].salary_min = tmp['B'+lastLineIndex].v
          if ('C'+lastLineIndex in tmp) newData[lastLineIndex].salary_max = tmp['C'+lastLineIndex].v
          if ('D'+lastLineIndex in tmp) newData[lastLineIndex].currency = tmp['D'+lastLineIndex].v
          if ('E'+lastLineIndex in tmp) newData[lastLineIndex].sex = tmp['E'+lastLineIndex].v
          if ('F'+lastLineIndex in tmp) newData[lastLineIndex].age1 = tmp['F'+lastLineIndex].v
          if ('G'+lastLineIndex in tmp) newData[lastLineIndex].age2 = tmp['G'+lastLineIndex].v
          if ('H'+lastLineIndex in tmp) newData[lastLineIndex].worktime1 = tmp['H'+lastLineIndex].v
          if ('I'+lastLineIndex in tmp) newData[lastLineIndex].worktime2 = tmp['I'+lastLineIndex].v
          newData[lastLineIndex].langs = []
          if ('J'+lastLineIndex in tmp) newData[lastLineIndex].langs.push(tmp['J'+lastLineIndex].v)
          if ('K'+lastLineIndex in tmp) newData[lastLineIndex].langs.push(tmp['K'+lastLineIndex].v)
          if ('L'+lastLineIndex in tmp) newData[lastLineIndex].langs.push(tmp['L'+lastLineIndex].v)
          if ('M'+lastLineIndex in tmp) newData[lastLineIndex].edu = tmp['M'+lastLineIndex].v
          if ('N'+lastLineIndex in tmp) newData[lastLineIndex].experience = tmp['N'+lastLineIndex].v
          if ('O'+lastLineIndex in tmp) newData[lastLineIndex].city = tmp['O'+lastLineIndex].v
          if ('P'+lastLineIndex in tmp && getjtype(tmp['P'+lastLineIndex].v) != '') newData[lastLineIndex].jtype = getjtype(tmp['P'+lastLineIndex].v)
          if ('Q'+lastLineIndex in tmp) newData[lastLineIndex].description = tmp['Q'+lastLineIndex].v
          //newData[lastLineIndex].author_id = this.uid AUTHOR ID SHOULD BE TAKEN FROM DB BY SESSION, NOT SAFE HERE
          lastLineIndex++
        }
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
    JobsList
  }
}
</script>


<style scoped lang="stylus">
.uploads
  width 90%
  max-width 1280px
  &__header
    margin 8px 0
    margin-top 16px
    font-size 15px
    font-weight 600
</style>