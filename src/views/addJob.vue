<template>
  <div class="addJob">
    <transition name="bounce">
      <div v-if="role === 'company' && sent == 'none'" class="authed" :key="1">
        <div class="line">
          <p class="star">*</p>
          <q-input
            :style="{width: '100%'}"
            dense filled :hint="null"
            v-model="job.title"
            label="Название вакансии"
            :rules="[title => (
              title.length > 1 && 
              title.length < 76 &&
              /^[\wа-яА-ЯÇçÄä£ſÑñňÖö$¢Üü¥ÿýŽžŞş\s\\-]*$/.test(title)
              ) || 'Длина от 2 до 75 символов, без специальных символов']"
            lazy-rules
            />
        </div>
        <div class="line">
          <p class="star">*</p>
          <p class="startP">Зарплата</p>
          <q-input
            :disable="job.salaryOn"
            :style="{width: '110px', marginRight: '10px'}"
            dense filled
            v-model="job.salary_min"
            label="От" :hint="null"
            :rules="[sal => (sal >= 0 && String(sal).length < 6 && sal < 100000) || 'От 0 до 99999']"
          />
          <q-input
            :disable="job.salaryOn"
            :style="{width: '110px', marginRight: '10px'}"
            dense filled
            v-model="job.salary_max"
            label="До" :hint="null"
            :rules="[sal => (sal >= 0 && String(sal).length < 6 && sal < 100000) || 'От 0 до 99999']"
          />
          <q-select
            :disable="job.salaryOn"
            style="width: 85px"
            dense filled
            v-model="job.currency"
            :options="[
              {label: 'манат', value: 'm'},      
              {label: '$', value: '$'},
            ]"
            :hint="null"
          />
          <q-toggle v-model="job.salaryOn" :style="{alignSelf: 'start'}" :hint="null">
            <q-tooltip>
              <p style="font-size: 15px; margin-bottom: 0">По итогам собеседования</p>
            </q-tooltip>
          </q-toggle>
        </div>
        <div class="line">
          <p class="star">*</p>
          <p class="startP">Ваши контакты</p>
          <q-input
            dense filled
            v-model="job.contact_mail"
            label="Email"
            type="email"
            ref="mail1"
            style="marginRight: 10px"
          />
          <!-- :rules="[mail => (
              mail.length < 60 && 
              isValidMail(mail)
              ) || 'Введите валидный адрес электронной почты (*@*.*)']"
            lazy-rules -->
          <q-input
            dense filled
            v-model="job.contact_phone"
            label="Phone"
            type="tel"
          />
        </div>
        <div class="line">
          <!-- <p class="startP">Город</p> -->
          <q-input :style="{width: '250px'}" dense filled v-model="job.city" label="Город" :hint="null"/>
        </div>
        <div class="line">
          <p class="startP">Возраст</p>
          <q-input type="Number" :style="{width: '100px', marginRight: '10px'}" dense filled v-model="job.age1" label="От" :hint="null"/>
          <q-input type="Number" :style="{width: '100px', marginRight: '10px'}" dense filled v-model="job.age2" label="До" :hint="null"/>
        </div>
        <div class="line">
          <p class="startP">График работы</p>
          <q-input type="Number" :style="{width: '100px', marginRight: '10px'}" dense filled v-model="job.worktime1" label="От" :hint="null"/>
          <q-input type="Number" :style="{width: '100px', marginRight: '10px'}" dense filled v-model="job.worktime2" label="До" :hint="null"/>
        </div>
        <p>Требования</p>
        <div class="line">
          <q-select dense v-model="job.sex" :options="sexOptions" label="Пол" />
        </div>
        <div class="line">
          <q-select
            multiple
            use-chips
            :style="{width: '100%'}"
            label="Языки"
            max-values="3"
            v-model="job.langs"
            :options="langOptions"
          />
        </div>
        <div class="line">
          <!-- <p class="startP">Город</p> -->
          <q-input :style="{width: '250px'}" dense filled v-model="job.edu" label="Образование" :hint="null"/>
        </div>
        <div class="line">
          <!-- <p class="startP">Город</p> -->
          <q-input :style="{width: '250px'}" dense filled v-model="job.experience" label="Минимальный стаж" :hint="null"/>
        </div>
        <p>Обязанности</p>
        <div class="line">
          <q-input
            v-model="job.description"
            filled
            maxlength="500"
            counter
            type="textarea"
            style="width: 100%;"
          />
        </div>
        <q-btn color="primary" label="Опубликовать" @click="addOneJob"/>
      </div>
      <div v-else-if="sent == 'good'" :key="2">
        <p>Вакансия успешно добавлена</p>
        <q-btn color="primary" @click="sent='none'" label="Загрузить еще одну"/>
      </div>
      <div v-else-if="sent == 'fail'" :key="3">
        <p>Ошибка на сервере, вакансия не добавлена</p>
        <q-btn color="primary" @click="sent='none'" label="Загрузить еще одну"/>
      </div>
      <div v-else :key="4">
        Авторизируйтесь, для возможности загрузки вакансий
      </div>
    </transition>
    {{sent}}
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
const config = require('@/configs/main_config')



export default {
  name: 'addJob',
  props: {
    uid: Number,
    authed: {type: Boolean, default: false},
    role: String,
  },
  data() {
    return {
      job: {
        title: '',
        salary_min: '',
        salary_max: '',
        currency: {label: 'манат', value: 'm'},
        salaryOn: false,
        city: '',
        age1: '',
        age2: '',
        worktime1: '',
        worktime2: '',
        sex: {label: "Не имеет значения", value: ''},
        langs: [],
        edu: '',
        experience: '',
        description: '',
        contact_mail: '',
        contact_tel: ''
      },
      sent: 'none',
      sexOptions: [{label: "Не имеет значения", value: ''}, {label: "Муж", value: 'm'}, {label: "Жен", value: 'w'},],
      
      langOptions: ["Русский", "Английский", "Немецкий", "Французкий"],
    }
  },
  computed: {
    // myjobslist: function () {
    //   return this.jobslist.filter(job => job.author_id === this.uid)
    // }
  },
  methods:{
    addOneJob() {
      //console.dir(this.job)
      let j = Object.assign({}, this.job)
      if (j.salary_min > j.salary_max) j.salary_max = j.salary_min
      j.sex = j.sex.value
      j.currency = j.currency.value
      if (j.title != '' && j.title.length > 1 && (j.salary_max > 0 || j.salaryOn) && j.description.length > 15) {
        axios
          .post(config.jobsUrl + '/oneJob', j, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
          .then(response => {
            if (response.data === 'OK') {
              this.sent = 'good'
              console.log('cp addOneJob: OK')
            } else {this.sent = 'fail'; console.log('trespasser')}
            
          })
      } else {
        console.log('NO TITLE')
        return false
      }
    },
    isValidMail(mail) {
      return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(mail)
    }
  },
  components: {
  }
}
</script>


<style scoped lang="stylus">
.addJob
  max-width 80%
  width 680px
  .authed
    margin-top 15px
    background-color #eee
    padding 10px
    padding-top 20px
    box-shadow 0 0 3px 2px #ddd
  .line
    display flex
    align-items center
    margin-bottom 10px
  .startP
    margin-right 10px
    font-size 15px
  .star
    align-self flex-start
    margin-right 10px
    font-weight 900
    font-size 20px
  .withMargins
    margin 0 10px
    align-self center

  .bounce-enter-active {
    animation: bounce-in .35s;
  }
  .bounce-leave-active {
    animation: bounce-in .35s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

</style>