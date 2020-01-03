<template>
  <div class="jobs">
    <div v-if="role === 'company'" class="authed">
      <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        animated
      >
        <q-step
          :name="1"
          title="Загрузите данные из файла"
          caption="Шаг 1"
          icon="settings"
          :done="step > 1"
        >
          Шаг. Выберите .xlsx файл с вакансиями. <a href="#">пример файла</a>
        </q-step>

        <q-step
          :name="2"
          title="Create an ad group"
          caption="Шаг 2"
          icon="create_new_folder"
          :done="step > 2"
        >
          An ad group contains one or more ads which target a shared set of keywords.
        </q-step>
        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 3 ? 'Finish' : 'Continue'" />
            <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
          </q-stepper-navigation>
        </template>
      </q-stepper>


      <span>Загрузите вакансии из .xlsx файла (<a href="#">пример файла</a>)</span>
      <input ref="fileUploader" type="file" @change="parseFile" id="fileUploader" class="fileUploader" name="fileUploader" accept=".xls, .xlsx"/>
      <div>
        <table>
          <tr v-for="item in parsed" :key="item.id">
            <td v-for="(property, index) in Object.keys(item)" :key="index">
              {{item[property]}}
            </td>
          </tr>
        </table>
      </div>
      <p>Статус: {{uploadStatus}}</p>
      <button @click="sendNewJobs" :disabled="parsed.length < 1">Отправить на сервер</button>
      <hr>
      <JobsList :jobslist="myjobslist" ref="joblist" msg="Опубликованные"/>
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
    jobslist: Array,
    uid: Number,
    authed: {type: Boolean, default: false},
    role: String
  },
  data() {
    return {
      step: 1,
      parsed: [],
      uploadStatus: 'готов к загрузке'
    }
  },
  computed: {
    myjobslist: function () {
      return this.jobslist.filter(job => job.author_id === this.uid)
    }
  },
  methods:{
    sendNewJobs: function () {
      
      if (this.parsed.length > 0) {
        this.uploadStatus = 'Идет загрузка...'
        console.log(this.parsed)
        axios
          .post(config.jobsUrl + '/entrance', this.parsed, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
          .then(response => {
            if (response.data === 'OK') {
              this.uploadStatus = 'Вакансии загружены и опубликованы, готов к работе'
              this.$emit('refresh')
            } else {this.uploadStatus = 'Загрузка не удалась'; console.log('trespasser')}
            
          })
        //console.log(this.$refs.joblist)
        this.parsed = []
        this.$refs.fileUploader.files = null
        
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
        
        let len = lastLineIndex
        lastLineIndex = 0
        let newData = []
        while (lastLineIndex <= len) {
          newData.push({lang:[]})
          if ('A'+lastLineIndex in tmp) newData[lastLineIndex].title = tmp['A'+lastLineIndex].v
          if ('B'+lastLineIndex in tmp) newData[lastLineIndex].salary = tmp['B'+lastLineIndex].v
          if ('C'+lastLineIndex in tmp) newData[lastLineIndex].worktime1 = tmp['C'+lastLineIndex].v
          if ('D'+lastLineIndex in tmp) newData[lastLineIndex].worktime2 = tmp['D'+lastLineIndex].v
          if ('E'+lastLineIndex in tmp) newData[lastLineIndex].lang.push(tmp['E'+lastLineIndex].v)
          if ('F'+lastLineIndex in tmp) newData[lastLineIndex].lang.push(tmp['F'+lastLineIndex].v)
          if ('G'+lastLineIndex in tmp) newData[lastLineIndex].lang.push(tmp['G'+lastLineIndex].v)
          if ('H'+lastLineIndex in tmp) newData[lastLineIndex].age1 = tmp['H'+lastLineIndex].v
          if ('I'+lastLineIndex in tmp) newData[lastLineIndex].age2 = tmp['I'+lastLineIndex].v
          //newData[lastLineIndex].author_id = this.uid AUTHOR ID SHOULD BE TAKEN FROM DB BY SESSION, NOT SAFE HERE
          lastLineIndex++
        }
        newData.shift()
        newData.shift()
        
        localVue.parsed = newData

      }
      reader.readAsArrayBuffer(this.files[0])
      
    },
    
  },
  components: {
    JobsList
  }
}
</script>
