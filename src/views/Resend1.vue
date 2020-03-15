<template>
  <div class="feedback">
  </div>
</template>

<script>
import axios from 'axios'
const config = require('./../configs/main_config')

export default {
  name: 'Resend',
  data: ()=>{return {
    state: 'ready', //justSentOk, justSentBad
    mailregex: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    fbData: {
      topic: '',
      name: '',
      mail: '',
      body: ''
    }
  }},
  methods: {
    fbDataFlush() {
      this.fbData = {
        topic: '',
        name: '',
        mail: '',
        body: '',
      }
    },
    sendFB() {
      console.log(this.fbData)
      if (
        this.fbData.mail.length > 3 &&
        this.fbData.mail.length < 71 &&
        this.mailregex.test(this.fbData.mail)
      ) {
        let url = config.jobsUrl + '/fb'
        axios
          .post(url, this.fbData, {headers: {'Content-Type' : 'application/json' }, withCredentials: true,})
          .then(response => {
            //console.log('viewHit', response.data)
            if (response.data == 'OK') {
              this.$q.notify(this.$t('fb.fbSuccess'))
              this.state = 'OK'
              this.fbDataFlush()
            } else {
              this.$q.notify(this.$t('fb.fbError'))
              this.state = 'BAD'
            }
        })
      } else {
        this.$q.notify({type:'negative', message: this.$t('fb.reqMail')})
      }
      
    }
  }
}
</script>

<style scoped lang="stylus">
.feedback
  max-width 620px
  width 620px
  min-height 70vh
  .fb_inner
    box-shadow 0 0 3px 1px var(--main-borders-color)
    margin-top 15px
    
    padding 10px
</style>