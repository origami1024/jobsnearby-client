<template>
  <div class="registration">
    <div v-if="role && role.startsWith('guest')" class="registration__main">
      <q-tabs
        :value="regState"
        @input="regStateUpd"
        inline-label
        class="shadow-2 tabs"
        style="fontWeight:700;"
      >
        <!-- style="color: white; backgroundColor: var(--main-borders-color);" -->
        <q-tab name="login" style="width:50%;fontWeight:900; letter-spacing: 2px">
          Вход
        </q-tab>
        <q-tab name="reg" style="width:50%; letter-spacing: 1px">
          Регистрация
        </q-tab>
      </q-tabs>
      <q-tab-panels class="registration__inner" :value="regState" animated>
        <q-tab-panel name="login">
          <form action="#" @submit.prevent="trylog" style="margin-top: 12px">
            <div style="display:flex; width: 100%; margin-bottom: 10px">
              <label style="alignSelf: center; width: 100px;margin-bottom: 15px" for="mailInput1">* Email</label>
              <q-input
                id='mailInput1'
                square
                dense
                outlined
                use-input
                bg-color="teal-1" color="cyan-10"
                v-model="login.mail"
                hint=""
                :error-message="login.validation.mail"
                :error="login.validation.mail != ''"
                style="width: 100%;"
                @blur="validateMail"
                @input="login.validation.mail = ''"
              />
            </div>
            <div style="display:flex; width: 100%;">
              <label style="alignSelf: center; width: 100px;margin-bottom: 15px" for="pwInput1">* Пароль</label>
              <q-input
                id='pwInput1'
                square
                dense
                outlined
                bg-color="teal-1" color="cyan-10"
                v-model="login.pw"
                hint=""
                :error-message="login.validation.pw"
                :error="login.validation.pw != ''"
                style="width: 100%;"
                @blur="validatePW"
                @input="login.validation.pw = ''"
              />
            </div>
            <!-- <div class="colx">
              <div class="row">
                
                <span v-show="login.showErrors" class="err_span">{{login.validation.mail}}</span>
              </div>
              <input id="email" v-model="login.mail" type="text" placeholder="* Email">
            
              <div class="row">
                
                <span v-show="login.showErrors" class="err_span">{{login.validation.pw}}</span>
              </div>
              <input id="pw" v-model="login.pw" type="text" placeholder="* Пароль">
            </div> -->
            
            <div class="row spacebetw">
              <q-checkbox color="red-10" v-model="login.rememberme" label="Запомнить меня" />
              <a href="#" style="alignSelf: center; color:var(--main-borders-color)">Забыл пароль?</a>
            </div>
            <q-btn 
              color="red-10"
              label="Войти"
              type="submit"
              :loading="submitting"
              class="submitBtn"
            />
            <!-- <input type="submit" value="Войти"> -->
            <p v-if="login.status != ''" style="color: #c00; padding: 0; margin: 0; margin-top: 6px">{{login.status}}</p>
          </form>
        </q-tab-panel>
        <q-tab-panel name="reg">
          <form action="#" @submit.prevent="tryreg">
            <div style="display:flex; justify-content: space-around; width: 100%; margin-bottom: 10px">
              <q-radio color="red-10" v-model="usertype" dense val="subscriber" label="Специалист" />
              <q-radio color="red-10" v-model="usertype" dense val="company" label="Компания" />
            </div>
            <!-- <div class="line">
              <input type="radio" v-model="usertype" id="r1" name="usertype" value="subscriber">
              <label class="twolined" for="r1">Специалист (Ищу работу)</label>
              <input type="radio" v-model="usertype" id="r2" name="usertype" value="company">
              <label class="twolined" for="r2">Компания (Работодатель)</label>
            </div> -->
            <div v-show="usertype === 'company'" style="display:flex; width: 100%;">
              <label style="alignSelf: center; width: 100px;margin-bottom: 15px">* Компания</label>
              <q-input
                square
                dense
                outlined
                bg-color="teal-1" color="cyan-10"
                v-model="company"
                hint=""
                style="width: 100%;"
                :error-message="validation.company"
                :error="validation.company != ''"
                @blur="valiRegCompany"
                @input="validation.company = ''"
              />
            </div>
            <div
              v-show="usertype === 'company'"
              style="display:flex; width: 100%; margin-top: -8px; margin-bottom: 14px"
            >
              <q-checkbox
                color="red-10" label="Кадровое агенство"
                v-model="agency"
                left-label
              />
            </div>
            
            <!-- <div v-show="usertype === 'company'">
              <div class="row">
                <span v-show="showErrors" class="err_span">{{validation.company}}</span>
              </div>
              <div class="row">
                <input v-model="agency" type="checkbox" id="agency">
                <label for="agency">Кадровое агенство</label>
              </div>
            </div> -->
            <!-- <div class="colx" v-show="usertype === 'subscriber'">
              <div class="row">
                <span v-show="showErrors" class="err_span">{{validation.name}}</span>
              </div>
              <input v-model="name" id="name" placeholder="* Имя">
              <div class="row">
                <span v-show="showErrors" class="err_span">{{validation.surname}}</span>
              </div>
              <input v-model="surname" id="surname" placeholder="* Фамилия">
            </div> -->
            <!-- <div class="colx">
              <div class="row">
                <span v-show="showErrors" class="err_span">{{validation.mail}}</span>
              </div>
              <input v-model="mail" id="email" placeholder="* Укажите свой Email">
            </div> -->
            <div v-show="usertype === 'subscriber'">
              <div style="display:flex; width: 100%; margin-bottom: 10px">
                <label style="alignSelf: center; width: 100px;margin-bottom: 15px" for="name2">* Имя</label>
                <q-input
                  id='name2'
                  square
                  dense
                  outlined
                  bg-color="teal-1" color="cyan-10"
                  v-model="name"
                  hint=""
                  :error-message="validation.name"
                  :error="validation.name != ''"
                  style="width: 100%;"
                  @blur="valiRegName"
                  @input="validation.name = ''"
                />
              </div>
              <div style="display:flex; width: 100%; margin-bottom: 10px">
                <label style="alignSelf: center; width: 100px;margin-bottom: 15px" for="surname2">* Фамилия</label>
                <q-input
                  id='surname2'
                  square
                  dense
                  outlined
                  bg-color="teal-1" color="cyan-10"
                  v-model="surname"
                  hint=""
                  :error-message="validation.surname"
                  :error="validation.surname != ''"
                  style="width: 100%;"
                  @blur="valiRegSurname"
                  @input="validation.surname = ''"
                />
              </div>
            </div>
            <div style="display:flex; width: 100%; margin-bottom: 10px">
              <label style="alignSelf: center; width: 100px;margin-bottom: 15px" for="mailInput2">* Email</label>
              <q-input
                id='mailInput2'
                square
                dense
                outlined
                bg-color="teal-1" color="cyan-10"
                v-model="mail"
                hint=""
                :error-message="validation.mail"
                :error="validation.mail != ''"
                style="width: 100%;"
                @blur="valiRegMail"
                @input="validation.mail = ''"
              />
            </div>
            <div style="display:flex; width: 100%; margin-bottom: 10px">
              <label style="alignSelf: center; width: 100px;margin-bottom: 15px" for="pw2">* Пароль</label>
              <q-input
                id='pw2'
                square
                dense
                outlined
                bg-color="teal-1" color="cyan-10"
                v-model="pw"
                hint=""
                :error-message="validation.pw"
                :error="validation.pw != ''"
                style="width: 100%;"
                @blur="valiRegPW"
                @input="validation.pw = ''"
              />
            </div>
            <div style="display:flex; width: 100%; margin-bottom: 10px">
              <label style="alignSelf: center; width: 100px;margin-bottom: 15px; display:flex" for="pwc2"><div style="margin-right: 4px">*</div>Повтор пароля</label>
              <q-input
                id='pwc2'
                square
                dense
                outlined
                bg-color="teal-1" color="cyan-10"
                v-model="pwc"
                hint=""
                :error-message="validation.pwc"
                :error="validation.pwc != ''"
                style="width: 100%;"
                @blur="valiRegPWC"
                @input="validation.pwc = ''"
              />
              <!-- @blur="validateMail" -->
            </div>
            <!-- <div class="colx">
              <div class="row">
                <span v-show="showErrors" class="err_span">{{validation.pw}}</span>
              </div>
              <input v-model="pw" id="pw" placeholder="* Пароль">
              <div class="row">
                <span v-show="showErrors" class="err_span">{{validation.pwc}}</span>
              </div>
              <input v-model="pwc" id="pwconfirm" placeholder="* Повторите пароль">
            </div> -->
            
            <div style="display: flex; flex-direction:row; margin-bottom: 12px">
              <q-checkbox
                style="align-self: flex-start;margin-top:-8px" color="red-10" id="rulescb1" v-model="rules" :error-message="validation.rules" :error="validation.rules != ''"/>
              <label style="text-align: justify;" for="rulescb1">
                * Я соглашаюсь с <a style="color: var(--btn-color)" href="#">правилами использования сервиса</a>, а также с передачей и обработкой моих данных в TEST.com. Я подтверждаю своё совершеннолетие и ответственность за размещение объявления.
              </label>
            </div>
            <span style="margin-bottom: 10px; font-size: 12px " v-show="showErrors && !rules" class="err_span">{{validation.rules}}</span>          
            <!-- <div class="colx">
              <div>
                <input type="checkbox" id="rulescb" v-model="rules">
                <label class="rulescb-label" for="rulescb">* Я соглашаюсь с <a href="#">правилами использования сервиса</a>, а также с передачей и обработкой моих данных в TEST.com. Я подтверждаю своё совершеннолетие и ответственность за размещение объявления.</label>
              </div>
              <span v-show="showErrors" class="err_span">{{validation.rules}}</span>
            </div> -->
            <q-btn 
              color="red-10"
              label="Регистрация"
              type="submit"
              :loading="submitting"
              class="submitBtn"
            />
            <!-- <input type="submit" value="Регистрация"> -->
            <!-- <p>{{status}}</p> -->
          </form>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <div v-else>
      Успешная авторизация
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const config = require('./../configs/main_config')


export default {
  name: 'registration',
  props: {
    regState: {type: String, default: 'reg'},
    role: String,
  },
  data: ()=>{return {
    login: {
      mail: '',
      pw: '',
      status: '',
      rememberme: true,
      showErrors: false,
      validation: {
        mail: '',
        pw: ''
      }
    },
    submitting: false,
    wordRegex: /^[\wа-яА-ЯÇçÄä£ſÑñňÖö$¢Üü¥ÿýŽžŞş\s\\-]*$/,
    pwRegex: /[a-zA-Z]/, //хотябы одна a-zA-Z
    mail: '',
    pw: '',
    pwc: '',
    rules: false,
    usertype: 'subscriber',
    company: '',
    agency: false,
    name: '',
    surname: '',
    status: '',
    showErrors: false,
    validation: {
      mail: '',
      pw: '',
      pwc: '',
      rules: '',
      company: '',
      name: '',
      surname: ''
    }
  }},
  methods: {
    tryreg() {
      this.status = 'Заполните все поля'
      //client validation here
      if (this.rules != true) this.rules = false
      if (this.agency != true) this.agency = false
      if (this.validate()) {
        this.showErrors = false
        //this.status = 'Попытка регистрации'
        this.submitting = true
        //console.log('cp123f, ', this.surname)
        axios
          .post(config.jobsUrl + '/reg', [this.mail.toLowerCase(), this.pw, this.usertype, this.usertype === 'subscriber' ? this.name : this.company, this.usertype === 'subscriber' ? this.surname : this.agency], {headers: {'Content-Type' : 'application/json' }})
          .then(response => {
            if (response.data == 'OK') {
              this.status = 'Регистрация удалась'
              // console.log(this.status)
              this.mail = ''
              this.pw = ''
              this.pwc = ''
              this.rules = false
              this.name = ''
              this.surname = ''
              this.company = ''
              this.agency = false
              this.$emit('regStateUpd', 'login')
              this.login.mail = ''
              this.login.pw = ''
              this.login.status = ''
              this.login.validation.mail = ''
              this.login.validation.pw = ''
            }
            else if (response.data == 'step3') {
              this.status = 'Регистрация не удалась, ошибки на сервере'
              //this.$q.notify(this.status)
            }
            else if (response.data == 'step2') {
              this.status = 'Такой email уже существует в базе данных'
              //this.$q.notify(this.status)
            }
            else if (response.data == 'step1') {
              this.status = 'Email или пароль не зарегестрированы'
              //this.$q.notify(this.status)
            }
            else console.dir('successful registering', response.data)
            this.submitting = false
            this.$q.notify(this.status)
          })
      } else {this.showErrors = true; this.$q.notify(this.status)}
    },
    valiRegMail(){
      let mailregex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      if (this.mail.length === 0)
        this.validation.mail = ''
      else if (!mailregex.test(this.mail.toLowerCase())) 
        this.validation.mail = 'Неправильный формат адреса'
      else this.validation.mail = ''
      return this.validation.mail === ''
    },
    valiRegName(){
      if (this.usertype === 'subscriber') {
        if (this.name.length === 0)
          this.validation.name = ''
        else if (this.name.length < 3)
          this.validation.name = 'Минимальная длина 3 символа'
        else if (this.name.length > 35)
          this.validation.name = 'Максимальная длина 35 символов'
        else if (!this.wordRegex.test(this.name))
          this.validation.name = 'Неправильный формат имени'
        else this.validation.name = ''
        return this.validation.name === ''
      } else return true
    },
    valiRegSurname(){
      if (this.usertype === 'subscriber') {
        if (this.surname.length === 0)
          this.validation.surname = ''
        else if (this.surname.length < 3)
          this.validation.surname = 'Минимальная длина 3 символа'
        else if (this.surname.length > 35)
          this.validation.surname = 'Максимальная длина 35 символов'
        else if (!this.wordRegex.test(this.surname))
          this.validation.surname = 'Неправильный формат фамилии'
        else this.validation.surname = ''
      } else return true
    },
    valiRegCompany(){
      if (this.usertype === 'company') {
        if (this.company.length === 0)
          this.validation.company = ''
        else if (this.company.length < 3)
          this.validation.company = 'Минимальная длина 3 символа'
        else if (this.company.length > 60)
          this.validation.company = 'Максимальная длина 60 символов'
        else if (!this.wordRegex.test(this.company))
          this.validation.company = 'Неправильный формат названия'
        else this.validation.company = ''
      } else return true
    },
    valiRegPW(){
      if (this.pw.length === 0)
        this.validation.pw = ''
      else if (this.pw.length < 6)
        this.validation.pw = 'Минимум 6 символов'
      else if (this.pw.length > 25)
        this.validation.pw = 'Максимум 25 символов'
      else if (!this.pwRegex.test(this.pw))
        this.validation.pw = 'Минимум 1 английская буква'
      else this.validation.pw = ''
      return this.validation.pw === ''
    },
    valiRegPWC(){
      if (this.pwc.length === 0)
        this.validation.pwc = ''
      else if (this.pwc !== this.pw)
        this.validation.pwc = 'Пароли не совпадают'
      else this.validation.pwc = ''
      return this.validation.pwc === ''
    },
    validate(){
      let mailregex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      if (this.mail.length === 0)
        this.validation.mail = 'Введите email'
      else if (!mailregex.test(this.mail.toLowerCase())) 
        this.validation.mail = 'Неправильный формат адреса'
      else this.validation.mail = ''

      if (this.usertype === 'subscriber') {
        if (this.name.length === 0)
          this.validation.name = 'Введите имя'
        else if (this.name.length < 3)
          this.validation.name = 'Минимальная длина 3 символа'
        else if (this.name.length > 35)
          this.validation.name = 'Максимальная длина 35 символов'
        else if (!this.wordRegex.test(this.name))
          this.validation.name = 'Неправильный формат имени'
        else this.validation.name = ''

        if (this.surname.length === 0)
          this.validation.surname = 'Введите фамилию'
        else if (this.surname.length < 3)
          this.validation.surname = 'Минимальная длина 3 символа'
        else if (this.surname.length > 35)
          this.validation.surname = 'Максимальная длина 35 символов'
        else if (!this.wordRegex.test(this.surname))
          this.validation.surname = 'Неправильный формат фамилии'
        else this.validation.surname = ''
      } else {

        if (this.company.length === 0)
          this.validation.company = 'Введите название'
        else if (this.company.length < 3)
          this.validation.company = 'Минимальная длина 3 символа'
        else if (this.company.length > 60)
          this.validation.company = 'Максимальная длина 60 символов'
        else if (!this.wordRegex.test(this.company))
          this.validation.company = 'Неправильный формат названия'
        else this.validation.company = ''
      }

      if (this.pw.length === 0)
        this.validation.pw = 'Введите пароль'
      else if (this.pw.length < 6)
        this.validation.pw = 'Минимум 6 символов'
      else if (this.pw.length > 25)
        this.validation.pw = 'Максимум 25 символов'
      else if (!this.pwRegex.test(this.pw))
        this.validation.pw = 'Минимум 1 английская буква'
      else this.validation.pw = ''

      if (this.pwc.length === 0)
        this.validation.pwc = 'Подтвердите пароль'
      else if (this.pwc !== this.pw)
        this.validation.pwc = 'Пароли не совпадают'
      else this.validation.pwc = ''

      if (!this.rules) this.validation.rules = 'Ознакомтесь с правилами'
      else this.validation.rules = ''

      if (this.validation.mail === '' && 
          this.validation.pw === '' && 
          this.validation.pwc === '' && 
          this.validation.rules === '' &&
          ( ( this.usertype === 'subscriber' &&
              this.validation.name === '' && 
              this.validation.surname === '')
            ||
            ( this.usertype === 'company' &&
              this.validation.company === '')
          ))
        return true
      return false
    },
    regStateUpd(val){
      this.$emit('regStateUpd', val)
    },
    trylog() {
      //this.login.status = ''
      
      //client validation here
      if (this.validateLogin()) {
        this.showErrors = false
        //this.login.status = 'Попытка входа'
        this.submitting = true
        axios
          .post(config.jobsUrl + '/login', [this.login.mail.toLowerCase(), this.login.pw, this.login.rememberme], {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
          .then(response => {
            //fix: need to send auth data on login
            if (response.data && response.data[0] === 'OK' && response.data.length > 3) {
              this.login.status = ''
              this.$q.notify({type:'positive', message: 'Вход осуществлен'})
              console.log('cp123ss:', response.data.slice(1))
              this.$emit('authed', response.data.slice(1))
              this.$router.push({ name: 'home' })
              this.$emit('refresh')
              this.login.mail = ''
              this.login.pw = ''
            }
            else if (response.data == 'step3') {
              this.login.status = 'Не удалось выполнить вход'
              this.$q.notify(this.login.status)
            }
            else if (response.data == 'step2') {
              this.login.status = 'Такого пользователя не существует, либо неверный пароль'
              this.$q.notify(this.login.status)
              //send this in both cases
            }
            else if (response.data == 'step1') {
              this.login.status = 'Не существующий Email или не правильный пароль'
              this.$q.notify(this.login.status)
            }
            else if (response.status == 209) {
              this.$q.notify({type: 'negative', message: response.data})
              
            }
            else console.dir('successful login', response.data, response.headers)
            this.submitting = false
          })
      } else this.login.showErrors = true
    },
    validateMail(){
      let mailregex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      if (this.login.mail.length === 0) 
        this.login.validation.mail = ''
      else if (!mailregex.test(this.login.mail.toLowerCase())) 
        this.login.validation.mail = 'Неправильный формат адреса'
      else this.login.validation.mail = ''
      return this.login.validation.mail === ''
    },
    validatePW(){
      if (this.login.pw.length === 0)
        this.login.validation.pw = ''
      else if (this.login.pw.length < 5 || this.login.pw.length > 25)
        this.login.validation.pw = 'Кол-во символов от 5 до 25'
      else this.login.validation.pw = ''
      return this.login.validation.pw === ''
    },
    validateLogin(){
      let mailregex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      if (this.login.mail.length === 0) 
        this.login.validation.mail = 'Введите email'
      else if (!mailregex.test(this.login.mail.toLowerCase())) 
        this.login.validation.mail = 'Неправильный формат адреса'
      else this.login.validation.mail = ''

      if (this.login.pw.length === 0)
        this.login.validation.pw = 'Введите пароль'
      else if (this.login.pw.length < 5 || this.login.pw.length > 25)
        this.login.validation.pw = 'Кол-во символов от 5 до 25'
      else this.login.validation.pw = ''

      if (this.login.validation.mail === '' && 
          this.login.validation.pw === '')
        return true
      return false
    }
  },
  components: {
  },
}
</script>

<style scoped lang="stylus">
.registration
  padding 15px 0
  margin 0
  max-width 380px
  width 380px
  min-height calc(100vh - 148px)
  display flex
  align-items flex-start
  padding-top 50px
  .registration__main
    //border 2px solid black
    width 380px
  .registration__inner
    background-color #fff//#eee
    border-bottom-left-radius 5px
    border-bottom-right-radius 5px
    box-shadow 0 0 4px 1px var(--main-borders-color)
  .tabs
    border-top-left-radius 5px
    border-top-right-radius 5px
    box-shadow 0 0 4px 1px var(--main-borders-color)
  form
    display flex
    flex-direction column
    text-align left
    input
      margin-bottom 5px
      &:last-child
        margin-bottom 0
    input[type="checkbox"]
      margin-bottom 0
    .twolined
      display flex
      flex-wrap wrap
    .line
      display flex
      padding 5px
      border 1px solid gray
      margin 5px 0
      border-radius 4px
    .colx
      display flex
      flex-direction column
      padding 5px
      border 1px solid gray
      margin 5px 0
      border-radius 4px
    .row
      display flex
    .err_span
      color #c00
      margin-left 5px
    .spacebetw
      justify-content space-between
      margin-bottom 5px
    #rulescb
      display inline
      margin-right 5px
    .rulescb-label
      line-break normal
      display inline
.submitBtn
  margin 0 auto
  width 45%
  font-weight 700
  letter-spacing 2px
</style>