const pageParts = require('./pageParts')
const db = require('./pgqueries')
//

const express = require('express')
const app = express()
const port = process.env.PORT || 7777
const cookieParser = require('cookie-parser')


const path = require('path')
//const url = require('url');
//const querystring = require('querystring');

var cors = require('cors');
app.use(cors({
  origin: process.argv.includes('-dev') ? 'http://127.0.0.1:8080' : 'https://herokuapp.com',
  credentials: true,
  exposedHeaders: ['session','user']
}))

app.use(cookieParser())
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

var history = require('connect-history-api-fallback')
app.use(history({}))

const serveStatic = require("serve-static")
app.use(serveStatic(path.join(__dirname, './../dist')));



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
if (process.argv.includes('-dev')) console.log('development mode on')



let pages = {}
let navlinks = [{href: '/', title: 'Главная'}, {href: '/jobs', title: 'Вакансии'}, {href: '/about', title: 'О сайте'}]
pages.main = pageParts.head + pageParts.navbar(navlinks) + pageParts.demo + pageParts.foot
pages.about      = pageParts.head + pageParts.navbar(navlinks) + 'Работай!' + pageParts.foot
pages.jobListing = pageParts.head + pageParts.navbar(navlinks) + pageParts.demo + pageParts.foot


app.post('/auth', auth)//auth by cookie
app.post('/login', login)
app.post('/reg', reg)
app.post('/out', out)
app.post('/changepw', changepw)
app.post('/changeuserstuff', changeuserstuff)
app.post('/cvupdate.json', db.cvurlupdate)
app.post('/cvdelete.json', db.cvurldelete)


app.post('/entrance', db.addJobs)
app.post('/oneJob', db.addOneJob)
app.post('/updateJob', db.updateJob)
app.post('/getOwnJobs.json', db.getOwnJobs)
//app.post('/getOwnJobsShort.json', db.getOwnJobsShort)

// app.post('/favOne.json', db.favOne)
// app.post('/delFavOne.json', db.delFavOne)
// app.post('/getFaved.json', db.getFaved)
// app.post('/getFavedFull.json', db.getFavedFull)


app.post('/hitjobcv', db.hitjobcv)
app.post('/getallcvuser', db.getAllCVHitsOfUser)
app.post('/getcvedjobs', db.getCVedJobs)
app.post('/getresps', db.getResps)
app.post('/viewhit', db.viewHit)
app.post('/getcvhitshistory', db.getCVHitsHistory)


app.post('/ownCompany.json', getOwnCompanyJSON)
app.post('/companyUpdate.json', db.updateOneCompany)
app.get('/companyby.idjson=:id', getCompanyById)

app.get('/jobsu.json', params1)
app.get('/jobs.json', db.getJobs)
app.get('/salStats.json', db.getSalStats)
//app.get('/jobBy.id', getJobById)
app.get('/jobby.idjson=:id', getJobByIdJSON)

app.post('/delJobBy.id', db.deleteJobById)
app.post('/closeJobBy.id', db.closeJobById)
app.post('/reopenJobBy.id', db.reopenJobById)

app.get('/forgottenx2.json', forgottenx2)//u come here to confirm the pw regen request
app.get('/forgotten.json', forgotten)
app.post('/forgottenx.json', forgottenx)
app.get('/verify.json', verify)
app.get('/resend.json', resend)
app.post('/resender.json', resender)
//app.post('/testm.json', testMail)
app.post('/fb', db.feedback)
app.get('/allfb.json', getAllFB)
app.get('/adminusers.json', adminUsers)
app.get('/adminjobs.json', adminJobs)
app.get('/adminstats.json', adminStats)
app.get('/cp.json', adminPanel)
app.get('/cplogin.json', adminLogin)
app.post('/cploginep.json', cpLoginEndpoint)
app.get('/cpsuper.json', superAdmin)
app.get('/u2out.json', u2out)
app.post('/newu2.json', adminNew) //?check who is adding the new user!!!


app.post('/fbaction.json', fbaction)
app.post('/admnjobclo.json', db.closeJobByIdAdmin)
app.post('/admnjobdel.json', db.deleteJobByIdAdmin)
app.post('/admnjobapr.json', db.approveJobByIdAdmin)
app.post('/auaction.json', auaction)
app.post('/userstatregen.json', db.userStatRegen)

function params1(request, response) {
  //get query like ?id=23123
  console.log('cp555: ', request.query)
  console.log('cp556: ', request.params)
  response.send(request.params)
}

// app.get('/*', function (req, res) {
//   console.log('cp reached', path.join(__dirname, './../dist'))
//   serveStatic(path.join(__dirname, './../dist'))
// })

// async function redirect1(req, res) {
//   res.send('<html><body><script>window.location.replace("http://www.w3schools.com")</script></body></html>')
// }

async function forgottenx2(req, res) {
  console.log('fx2: ', req.query.n)
  let reg = /^\d+$/
  let n1 = req.query.n
  //u need to check if link in db
  if (reg.test(n1) == false || String(n1).length > 25) {
    console.log('Error: wrong num2')
    res.status(400).send('WRONG VERIFICATION LINK2')
    return false
  }
  //after that check if its in db, check by deletion//consume the db entry(delete)
  let forg = await db.forgCheck(n1).catch(error => {
    //res.send('step2')
    return undefined
  })
  console.log('cp oot:', forg)
  if (forg) {
    //check here time, send diff response based on that.
    //respond that its sent
    if (forg.time_passed > -7200) {
      //within the time - send mail, redirect
      //generate the new pw
      let pwarr = 'qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNMM'
      let newpw = ''
      var i = 10
      while (i--) {
        newpw += pwarr[Math.round(Math.random()*62)]
      }
      //generate the hash of that pw
      let hash = bcrypt.hashSync(newpw, bcrypt.genSaltSync(9))
      //put it into the db
      let some = await db.forgChangePw(hash, forg.mail).catch(error => {
        return undefined
      })
      //send letter-2 to the mail in the consumed entry
      forgottenx2Mail(newpw, forg.mail)
      let baseUrl = process.env.NODE_ENV ? 'https://jobsnearby.herokuapp.com' : 'http://127.0.0.1:8080'
      //res.send('Пароль сброшен. Новый пароль отправлен на вашу почту. <a href="' + baseUrl + '/registration?login=1">Войти</a>')
      res.send('<html><body><script>window.location.replace("' + baseUrl + '/registration?login=1&reset=1")</script></body></html>')
    } else res.send('Ссылка сброса пароля просрочена (2 часа макс), попробуйте еще раз')
  } else res.send('Ошибка в адресе верификации')
  
}

async function forgottenx(req, res) {
  console.log('cp31', req.body)
  let mail = req.body.mail
  if (SupremeValidator.isValidEmail(mail)) {
    let veri = await db.verifiedMailExists(mail).catch(error => {
      return undefined
    })
    console.log('cp19k')
    if (veri) {
      //check if there is already a request for new pw in the table first
      //need to check if mail in the forgotten basically
      //just get all that info
      let firstCheck = await db.forgottenRequest1stCheck(mail).catch(error => {
        return undefined
      })
      console.log('cpXX1: ', firstCheck)
      if (firstCheck == undefined) {
        //create new
        //getnerate the url
        let hash1 = String(hashSome()) + parseInt(Math.random()*100000000000, 11)
        //let baseUrl = process.env.NODE_ENV ? 'https://jobsnearby.herokuapp.com' : 'http://127.0.0.1:7777'
        //let url = baseUrl + '/forgottenx2.json?' + hash1

        //make a new record into the forgo
        let dbEntry = await db.insertForgottenEntry(mail, hash1).catch(error => {
          return undefined
        })
        if (dbEntry) {
          //send mail
          forgottenMail(hash1, mail)
          //send page that its sent
          res.send('Письмо подтверждения восстановления пароля отправлено на вашу почту. Оно будет действительно в течении 2 часов')
        } else res.send('Ошибка базы данных 1')
      } else if (firstCheck && firstCheck.time_passed <= -1200) {//1200 = 20 min?
        //rewrite old
        //use the old url
        let hash1 = firstCheck.url
        //rewrite the record
        let dbEntry = await db.updateForgottenEntry(mail, hash1).catch(error => {
          return undefined
        })
        if (dbEntry) {
          //send mail
          forgottenMail(hash1, mail)
          //send page that its sent
          res.send('Письмо подтверждения восстановления пароля отправлено на вашу почту')
        } else res.send('Ошибка базы данных 2')
      } else if (firstCheck && firstCheck.time_passed > -1200) {
        //send back that time hasnt passed
        res.send('Вы уже запрашивали восстановление пароля ' + Math.round(firstCheck.time_passed / -60) + ' минут назад. Минимальное время между сбросами 20 минут')
      } else res.send('Ошибка на сервере')
    } else res.send('Несуществующий, либо не верифицированный mail')
  } else res.send('Неправильный формат адреса')
}

async function forgotten(req, res) {
  let body = `
    <main>
      <form action="/forgottenx.json" method="POST">
        <p>Пароль забыт и утерян?</p>
        <p>Его можно восстановить получив письмо на оригинальный mail и перейдя по ссылке</p>
        <br>
        <label for="mail1">Введите Email</label>
        <input id="mail1" name="mail"/>
        <input type="submit" value="Отправить"/>
      </form>
    </main>
  `
  let page = pageParts.head + body + pageParts.footer
  res.send(page)
}

async function resender(req, res) {
  console.log('cp3', req.body)
  //get the mail
  let mail = req.body.mail

  //check the mail's by regex and length
  if (SupremeValidator.isValidEmail(mail)) {
    //get data in db on that mail
    //check the mail in table
    let veri = await db.getVerificationEntry(mail).catch(error => {
      //res.send('step2')
      return undefined
    })
    if (veri) {
      //also check the time of creation - 5mins
      console.log('cpLLL:', veri)
      //difference between time next
      if (veri[0].time_passed < -300) {
        console.log('time in', veri[0].time_passed)
        //send mail if ok, and send the user, that its resent, or that u shall wait so much  
        testMail(veri[0].url, mail)
        console.log('stuff')
        let upd = await db.veriUpdTime(mail).catch(error => {
          //res.send('step2')
          return undefined
        })
        let baseUrl = process.env.NODE_ENV ? 'https://jobsnearby.herokuapp.com' : 'http://127.0.0.1:8080'
        //res.send('Повторное письмо с ссылкой для активации учетной записи отправлено. <a href="' + baseUrl + '/registration?login=1">Войти</a> на сайт.')
        res.send('<html><body><script>window.location.replace("' + baseUrl + '/registration?login=1&resender=1")</script></body></html>')
      } else {
        res.send('Повторная отправка верификации возможна не реже чем раз в 5 минут. Прошло ' + -Math.round(veri[0].time_passed/60) + ' минут')
      }
    } else res.send('Неправильный email')
  } else res.send('error 1')
}

async function resend(req, res) {
  //page with form to request a resend
  let body = `
    <main style="width: 100%; display: flex; justify-content: center;">
      <form action="/resender.json" method="POST" style="padding:10px; background-color: #dfd; width: auto; display: inline-block; font-size: 18px; font-family: sans-serif;">
        <p>Письмо верификации не дошло? (в папке спам тоже нет?)</p>
        <label for="mail1">Введите Email</label>
        <input id="mail1" name="mail" />
        <input type="submit" value="Отправить еще раз"/>
      </form>
    </main>
  `
  let page = pageParts.head + body + pageParts.footer
  res.send(page)
}

async function verify(req, res) {
  //check if in the base
  
  //get the param
  //check if is a number
  let reg = /^\d+$/
  let n1 = req.query.n
  console.log('got client: ' + n1)
  if (reg.test(n1) == false || String(n1).length > 25) {
    console.log('Error: wrong num')
    res.status(400).send('WRONG VERIFICATION LINK')
    return false
  }
  console.log('cp1: ', n1)
  //after that check if its in db, check by deletion
  
  let veri = await db.verifCheck(n1).catch(error => {
    //res.send('step2')
    return -2
  })
  console.log(veri)
  if (veri === 1) {
    let baseUrl = process.env.NODE_ENV ? 'https://jobsnearby.herokuapp.com' : 'http://127.0.0.1:8080'
    //res.send('Email пользователя верифицирован. Теперь вы можете <a href="' + baseUrl + '/registration?login=1">Войти</a>')
    res.send('<html><body><script>window.location.replace("' + baseUrl + '/registration?login=1&verified=1")</script></body></html>')
  } else res.send('Ошибка в адресе верификации')
}

nodeMailer = require('nodemailer')

async function forgottenMail(url, mail) {
  console.log('sending mail forgotten func: ' + url + ' ' + mail)
  let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        // should be replaced with real sender's account
        user: 'jobsnearby1000@gmail.com',
        pass: 'h123456RR'
    }
  })
  let baseUrl = process.env.NODE_ENV ? 'https://jobsnearby.herokuapp.com' : 'http://127.0.0.1:7777'
  let url1 = baseUrl + '/forgottenx2.json?n=' + url
  let mailOptions = {
    // should be replaced with real recipient's account
    to: mail, //'origami1024@gmail.com',
    subject: 'Восстановление пароля на jobsnearby',
    text: 'Для получения нового пароля нужно подтвердить восстановление, перейдя по ссылке ' + url1 + '. После этого вы получите второе письмо с новым паролем. Эта ссылка действительна в течении 2 часов.'
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      //res.send('NOT OK')
      return 'ERR'
    }
    //res.send('OK')
    console.log('Message2 %s sent: %s', info.messageId, info.response);
    return 'OK'
  })
}

async function forgottenx2Mail(newpw, mail) {
  console.log('sending forgotten2: ' + newpw + ' ' + mail)
  let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'jobsnearby1000@gmail.com',
        pass: 'h123456RR'
    }
  })
  let mailOptions = {
    // should be replaced with real recipient's account
    to: mail, //'origami1024@gmail.com',
    subject: 'Сгенерирован новый пароль на jobsnearby',
    text: 'Пароль изменен на jobsnearby изменен по процедуре восстановления на: ' + newpw + '. Измените его в профиле на более безопасный.'
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      //res.send('NOT OK')
      return 'ERR'
    }
    //res.send('OK')
    console.log('Message3 %s sent: %s', info.messageId, info.response);
    return 'OK'
  })
}

async function testMail(n, mail) {
  //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  //console.log('cp13: ', fullUrl)
  //sending test mail from this functions via smtp of gmail
  let baseUrl = process.env.NODE_ENV ? 'https://jobsnearby.herokuapp.com' : 'http://127.0.0.1:7777'
  let txt = baseUrl + '/verify.json?n=' + n //String(hashSome()) + '888' + parseInt(Math.random()*1000000000, 10)
  console.log('sending mail func: ' + txt)
  let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        // should be replaced with real sender's account
        user: 'jobsnearby1000@gmail.com',
        pass: 'h123456RR'
    }
  })
  let mailOptions = {
    // should be replaced with real recipient's account
    to: mail, //'origami1024@gmail.com',
    subject: 'Верификация пользователя на jobsnearby',
    text: 'Перейдите по ссылке для верификации пользователя: ' + txt
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      //res.send('NOT OK')
      return 'ERR'
    }
    //res.send('OK')
    console.log('Message %s sent: %s', info.messageId, info.response);
    return 'OK'
  })
}

async function auaction(req, res) {
  let cmd //read or del
  if (req.body.action == 'block') cmd = 'block'
  else if (req.body.action == 'unblock') cmd = 'unblock'
  else if (req.body.action == 'del') cmd = 'del'
  else {
    res.send('wrong cmd')
    return false
  }
  let uid = parseInt(req.body.uid)
  if (isNaN(uid) || uid < 0 || String(uid).length > 10) {
    console.log('Error: wrong id')
    res.status(400).send('Неправильный id')
    return false
  }
  if (req.body.block_reason && req.body.block_reason.length > 500) req.body.block_reason = req.body.block_reason.substring(0,499)
  if (req.cookies && req.cookies.sessioa && req.cookies.sessioa.length > 50 && req.cookies.user2) {
    let auth = await db.adminAuth(req.cookies.user2, req.cookies.sessioa).catch(error => {
      //res.send('step2')
      return undefined
    })
    if (auth) {
      if (cmd == 'block') {
        let succ = await db.u2aublock(uid, req.body.block_reason, false, auth.u2id, req.cookies.user2).catch(error => {
          //res.send('step2')
          return undefined
        })
        res.send({cmd: 'block', id: uid})
      } else
      if (cmd == 'unblock') {
        let succ = await db.u2aublock(uid, '', true, auth.u2id, req.cookies.user2).catch(error => {
          //res.send('step2')
          return undefined
        })
        res.send({cmd: 'unblock', id: uid})
      } else
      if (cmd == 'del') {
        let succ = await db.u2audelete(uid, auth.u2id, req.cookies.user2).catch(error => {
          //res.send('step2')
          return undefined
        })
        res.send({cmd: 'del', id: uid})
      }
    } else res.send('error2; wrong mail or pw format')
  } else res.send('error1; wrong mail or pw format')
}

async function fbaction(req, res) {
  //2 types of action, then redirect to allfb.json
  let cmd //read or del
  if (req.body.action == 'read') cmd = 'read'
  else if (req.body.action == 'del') cmd = 'del'
  else {
    res.send('wrong cmd')
    return false
  }
  let fbid = parseInt(req.body.fbid)
  if (isNaN(fbid) || fbid < 0 || String(fbid).length > 10) {
    console.log('Error: wrong fb id')
    res.status(400).send('Неправильный id')
    return false
  }
  if (req.cookies && req.cookies.sessioa && req.cookies.sessioa.length > 50 && req.cookies.user2) {
    let auth = await db.adminAuth(req.cookies.user2, req.cookies.sessioa).catch(error => {
      //res.send('step2')
      return undefined
    })
    if (auth) {
      if (cmd == 'read') {
        let succ = await db.u2fbread(fbid).catch(error => {
          //res.send('step2')
          return undefined
        })
        res.send({cmd: 'read', fbid: fbid})
      } else
      if (cmd == 'del') {
        let succ = await db.u2fbdel(fbid).catch(error => {
          //res.send('step2')
          return undefined
        })
        res.send({cmd: 'del', fbid: fbid})
      }
    } else res.send('error2; wrong mail or pw format')
  } else res.send('error1; wrong mail or pw format')
}



async function u2out(req, res) {
  //maybe delete stuff in db and write some statistics down
  //for now just reset cookies and send back OK
  res.cookie('sessioa', '', {expires: new Date(Date.now())})
  res.cookie('user2', '', {expires: new Date(Date.now())})
  // res.send('OK. u2out')
  res.send(`<html><script>window.location.href = "/cplogin.json"</script></html>`)
}

async function superAdmin(req, res) {
  //cookie verify structure
  if (req.cookies && req.cookies.sessioa && req.cookies.sessioa.length > 50 && req.cookies.user2) {
    //auth check
    let auth = await db.adminAuth(req.cookies.user2, req.cookies.sessioa).catch(error => {
      //res.send('step2')
      return undefined
    })
    console.log(auth) //depending on rights, give different pages later
    if (auth && auth.category_rights === '777') {
      /*
        list of admins;
        -disable/enable
        -add new user
        -delete user
        -edit rights:
        ---deleting, changing jobs, closing, opening jobs
        ---deleting, changing, disabling/enabling users
        ---reading feedback
        ---entering pages: fb, jobs, users
      */
      let u2list = await db.adminGetUsers2().catch(error => {
        console.log('cp adminGetUsers2 err1: ', error)
        return []
      })
      
      let list_p1 = `
      <table style="width: 100%; font-size:14px">
        <thead style="background-color: purple; color: white;">
          <tr style="padding: 5px">
            <td>Логин</td>
            <td>category_rights</td>
            <td>u2last_logged_in</td>
            <td>supernote</td>
            <td>управление</td>
          </tr>
        </thead>
      <tbody>`
      u2list.forEach(val=>{
        let d = new Date(val.u2last_logged_in).toString().split(' GMT')[0].substring(3)
        let tmp = `
          <tr id=${val.u2id}>
            <td>${val.u2mail}</td>
            <td>${val.category_rights}</td>
            <td>${d}</td>
            <td>${val.supernote}</td>
            <td>
              <button>Выключить акк</button>
              <button>Изменить права</button>
              <button>Добавить заметку</button>
            </td>
          </tr>
        `
        list_p1 += tmp
      })
      list_p1 += '</tbody></table>'
      let body = `
        <main>
          ${pageParts.cplink()}
          <section>
            <h4 style="margin:0; margin-top:10px;">Добавление нового модера</h4>
            <table borders="1">
              <tr>
                <td style="width:130px">mail</td>
                <td style="width:130px">pw</td>
              </tr>
              <tr>
                <td style="border: 1px solid black" id="newmail" contenteditable="true"></td>
                <td style="border: 1px solid black" id="newpw" contenteditable="true"></td>
              </r>
            </table>
            <button onclick="addNew()">Добавить модера</button>
            <div id="viewer"></div>
            <script>
              function addNew() {
                let newmail = document.getElementById("newmail").textContent
                let newpw = document.getElementById("newpw").textContent
                let d = {newmail, newpw}
                console.log(d)
                var http = new XMLHttpRequest()
                var url = '/newu2.json'
                http.open('POST', url, true)
                http.setRequestHeader('Content-type', 'application/json')
                //
                http.onreadystatechange = function() {
                  if(http.readyState == 4 && http.status == 200) {
                    document.getElementById("viewer").textContent += http.responseText
                  }
                }
                http.send(JSON.stringify(d))
              }
            </script>
          </section>
          <section>
            <h4 style="margin:0; margin-top:10px;">Список модеров</h4>
            ${list_p1}
          </section>
        </main>
      `
      let superPage = pageParts.head + body + pageParts.footer
      res.send(superPage)
    } else res.send(pageParts.noau)
  } else res.send(pageParts.noau)
}

async function adminNew(req, res) {
  let mail = req.body.newmail
  let pw = req.body.newpw
  if (SupremeValidator.isValidEmail(mail) && SupremeValidator.isValidPW(pw)) {
    let auth = await db.adminAuth(req.cookies.user2, req.cookies.sessioa).catch(error => {
      //res.send('step2')
      return undefined
    })
    if (auth && auth.category_rights === '777') {
      let user2Id = await db.tryInsertEmailAdmin(mail).catch(error => {
        //console.log('cp3: ', error)
        res.send('error4, not uniq mail')
        return undefined
      })
      if (user2Id === undefined) {
        return false
      }
      //if id is back mail is uniq else ret
      let hash = bcrypt.hashSync(pw, bcrypt.genSaltSync(9))
      //store rest of the new user
      let isDone = await db.registerFinishAdmin(user2Id, mail, hash).catch(error => {
        console.log('STEP5', error)
        res.send('step5')
        return false
      })
      if (isDone === false) return false
      console.log('admin reg ok!')
      res.send('OK')
    } else res.send('error5; wrong mail or pw format')
  } else res.send('error3; wrong mail or pw format')
}

async function adminLogin(req, res) {
  console.log('cp rr1: ', req.query.e)
  let body = `
    <form action="/cploginep.json" method="post" style="width: 220px; margin: 0 auto; margin-top:25vh">
      <div class="container" style="display: flex; flex-direction: column;">
        <label for="uname"><b>Username</b></label>
        <input type="text" placeholder="Enter Username" name="uname" required>

        <label for="psw"><b>Password</b></label>
        <input type="password" placeholder="Enter Password" name="psw" required>

        <button type="submit">Login</button>
        <label>
          <input type="checkbox" checked="checked" name="remember"> Remember me
        </label>
      </div>
      ${req.query.e == 'err1' ? '<div style="color:red">Ошибка авторизации</div>' : ''}
    </form>
    

  `
  let loginPage = pageParts.head + body + pageParts.footer
  res.send(loginPage)
}

async function cpLoginEndpoint(req, res) {
  
  let mail = req.body.uname.toLowerCase()
  let pw = req.body.psw
  let rememberme = req.body.remember
  if (rememberme === 'on' || rememberme == 'true') rememberme = true
  if (rememberme != true) rememberme = false
  if (SupremeValidator.isValidEmail(mail) && SupremeValidator.isValidPW(pw)) {
    
    let adminData = await db.getAdminHash(mail).catch(error => {
      res.send('step2')
      return undefined
    })
    if (!adminData) {
      res.send('<html><script>window.location.href = "/cplogin.json?e=err1"</script></html>')
      return false
    }
    console.log('23')
    let authed = bcrypt.compareSync(pw, adminData)
    console.log('cp54: ', authed)

    if (authed) {
      let jwtoken = SupremeValidator.generateJSONWebToken(mail)
      let laststage = await db.tryInsertAdminCoo(mail, jwtoken).catch(error => {
        res.send('step5')
        return undefined
      })
      //after this not checked
      if (laststage === undefined) return false
      console.log('success, sending')

      if (rememberme) {
        res.cookie('sessioa', jwtoken, {expires: new Date(Date.now() + 590013000)})
        res.cookie('user2', mail, {expires: new Date(Date.now() + 590013000)})
      } else {
        res.cookie('sessioa', jwtoken)
        res.cookie('user2', mail)
      }
      //res.send(JSON.stringify({'coo': jwtoken}))
      res.send(`<html><script>window.location.href = "/cp.json"</script></html>`)
    } else {res.send(`<html><script>window.location.href = "/cplogin.json?e=err1"</script></html>`)}
    //finish this!!!
  } else {res.send(`<html><script>window.location.href = "/cplogin.json?e=err1"</script></html>`)}
  
}
async function adminPanel(req, res) {
  //cookie verify structure
  if (req.cookies && req.cookies.sessioa && req.cookies.sessioa.length > 50 && req.cookies.user2) {
    //auth check
    let auth = await db.adminAuth(req.cookies.user2, req.cookies.sessioa).catch(error => {
      //res.send('step2')
      return undefined
    })
    console.log(auth) //depending on rights, give different pages later
    if (auth) {
      
      let mail = req.cookies.user2
      
      
      let stts = await db.adminStats().catch(error => {
        //res.send('step2')
        return undefined
      })
      let sttsbody = ''
      if (stts) {
        sttsbody = `
          <div>
            <h3 style="margin: 0; margin-bottom: 10px">Основная статистика</h3>
            <p>Кол-во вакансий: <b>${stts.jcount}</b></p>
            <p>Кол-во пользователей: <b>${Number(stts.uscount) + Number(stts.uccount)}</b></p>
            <p>Из них соискателей: <b>${stts.uscount}</b></p>
            <p>Из них компаний: <b>${stts.uccount}</b></p>
            <p>Кол-во подач резюме: <b>${stts.hcount}</b></p>
            <p>Новые вакансии сегодня: <b>${stts.opened_today_count}</b></p>
            <p>Новые вакансии за неделю: <b>${stts.opened_this_week_count}</b></p>
          <div>
        `
        //уник посетителей
        //вакансии по фильтрам
        //юзеры по фильтрам
        //открытых вакансий за сегодня
        //открытых вакансий за вчера
        //за неделю
        //за месяц
      }
      let sttsDay = await db.adminDayStats().catch(error => {
        //res.send('step2')
        return undefined
      })
      if (sttsDay) {
        sttsDaybody = `
          <div class="charts">
            <h3 style="margin: 0; margin-bottom: 10px">Новые вакансии по дням за последние два месяца</h3>
            <svg id="jobs_per_day_chart" width="600" height="300"></svg>
          </div>
          <style>
            .bar {
              fill: steelblue;
            },
          </style>
          <script src="https://d3js.org/d3.v5.min.js"></script> 
          
          <script>
            var data = ${JSON.stringify(sttsDay.map(val=>{val.day = val.day.substring(5);return val}))}//.map(val=>{val.day = String(val.day).split(' 2020')[0].split(' ').slice(1).join(' ');return val})
            //console.log(JSON.stringify(data))
            
            const svg = d3.select("svg"), 
            margin = {top: 15, right: 5, bottom: 40, left: 15}, 
            width = +svg.attr("width") - margin.left - margin.right, 
            height = +svg.attr("height") - margin.top - margin.bottom, 
            x = d3.scaleBand().rangeRound([0, width]).padding(0.0), 
            y = d3.scaleLinear().rangeRound([height, 0]), 
            g = svg.append("g") 
            .attr("transform", \`translate(\${margin.left},\${margin.top})\`); 
            
            //console.log(Math.max(...data.map(d => d.jobs)))
            x.domain(data.map(d => d.day)); 
            y.domain([0, Math.max(...data.map(d => d.jobs))]); //d3.max(data, d => d.jobs)
             
            g.append("g")
            .attr("class", "axis axis-x") 
            .attr("transform", \`translate(0,\${height})\`)
            .call(d3.axisBottom(x))
            .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-9px")
            .attr("dy", "-8px")
            .attr("font-size", "9px")
            .attr("transform", "rotate(-90)");
            
            // g.append("g")
            // .attr("class", "axis axis-y") 
            // .call(d3.axisLeft(y)); 
            
            g.selectAll(".NOTHING")
            .data(data)
            .enter().append("rect") 
            .attr("class", "bar")
            .attr("x", d => x(d.day)) 
            .attr("y", d => y(d.jobs)) 
            .attr("width", x.bandwidth()) 
            .attr("height", d => height - y(d.jobs))

            g.selectAll(".NOTHING")
            .data(data)
            .enter().append("text") 
            .attr("class", "label")
            .text(d=>d.jobs > 0 ? d.jobs : '')
            .attr("x", d => x(d.day)) 
            .attr("y", d => y(d.jobs)) 
            .attr("width", x.bandwidth()) 
            .attr("height", d => height - y(d.jobs))

            
          </script>
        `
      }
      let lgs = await db.adminLogs().catch(error => {
        console.log('err appcp1')
        return []
      })
      let logs = `
      <table style="width: 100%; font-size:14px">
        <thead style="background-color: orange; color: black;">
          <tr style="padding: 5px">
            <td>Время</td>
            <td>Действие</td>
            <td>Примечания</td>
            <td>Id автора</td>
            <td>Email автора</td>
          </tr>
        </thead>
      <tbody>`
      lgs.forEach(val=>{
        let d = new Date(val.time).toString().split(' GMT')[0].substring(3)
        let tmp = `
          <tr>
            <td>${d}</td>
            <td>${val.action}</td>
            <td>${val.body}</td>
            <td>${val.author_id}</td>
            <td>${val.author_mail}</td>
          </tr>
        `
        logs += tmp
      })
      logs += '</tbody></table>'

      let body = `
        <h2 style="text-align:center; margin: 0;">Башня управления. ${mail} ${auth.category_rights === '777' ? 'супер-дупер' : ''}</h2>
        <hr>
        <main style="display:flex; justify-content: space-around;">
          <section>
          <style>
            * {
              font-family: sans-serif;
            }
            p{margin: 0px; margin-bottom: 5px;}
            .cpul1 li{
              margin: 10px 0;
            }
            .cpul1 li a {
              font-size: 18px;
              text-decoration: none;
              color: navy;
              
            }
            .cpul1 li a:hover {
              color: blue;
            }
          </style>
            <ul class="cpul1" style="list-style-type: none; width: 65%">
              <li>
                <a href="/allfb.json">
                  Фидбек пользователей
                  ${stts.unread_fb > 0 ? `<sup style="background-color:red;color:white;padding:2px">${stts.unread_fb}</sup>` : ''}
                </a>
              </li>
              <li>
                <a href="/adminusers.json">
                  Пользователи
                </a>
              </li>
              <li>
                <a href="/adminjobs.json">
                  Вакансии
                  ${stts.jobs_tba > 0 ? `<sup style="background-color:red;color:white;padding:2px">${stts.jobs_tba}</sup>` : ''}
                </a>
              </li>
              <li>
                <a href="/adminstats.json">
                  Числа
                </a>
              </li>
              ${auth.category_rights === '777'
                ? `<li>
                  <a href="/cpsuper.json">Суперадмин</a>
                </li>`
                : ''}
              <hr>
              <li>
                <a href="/u2out.json">Выйти</a>
              </li>
            </ul>
          </section>
          <section>
            ${sttsbody}
          </section>
          <section>
            ${sttsDaybody}
          </section>
        </main>
        <hr>
        <article class="cp_logs">
          <h3>Последние логи</h3>
          ${logs}
        </article>
      `
      let cpPage = pageParts.head + body + pageParts.footer
      
      res.send(cpPage)
    } else res.send(pageParts.noau)
  } else res.send(pageParts.noau)
}

async function adminStats(req, res) {
  //Страница в админке для изменения статистики показываемой пользователю в разных местах, типа зарплаты, топ профессий
  if (req.cookies && req.cookies.sessioa && req.cookies.sessioa.length > 50 && req.cookies.user2) {
    let auth = await db.adminAuth(req.cookies.user2, req.cookies.sessioa).catch(error => {
      //res.send('step2')
      return undefined
    })
    if (auth) {
      let body = `
      <style>
        .hidden {
          display: none;
        }
        tr:nth-child(even) {background: #DCD}
        a {color:blue; text-decoration: none}
        a:visited {color:blue}
      </style>
      <h2 style="text-align:center; margin: 0;">Статистика для пользователей</h2>
      ${pageParts.cplink()}
      <table style="width: 100%; font-size:14px">
        <thead style="background-color: royalblue; color: white;">
          <tr style="padding: 5px">
            <td>statname</td>
            <td>statlabel</td>
            <td>statvalue</td>
            <td>statcurrency</td>
            <td>time_updated</td>
            <td>Управление</td>
          </tr>
        </thead>
        <tbody> 
      `
      let data = await db.adminGetStats().catch(error => {
        console.log('cp adminGetStats err1: ', error)
        return []
      })
      data.forEach(val=>{
        let d = new Date(val.time_updated).toString().split(' GMT')[0].substring(3)
        let tmp = `
          <tr>
            <td>${val.statname}</td>
            <td>${val.statlabel}</td>
            <td>${val.statvalue}</td>
            <td>${val.statcurrency}</td>
            <td>${d}</td>
            <td style="width: 180px; display: flex">
            </td>
          </tr>
        `
        body += tmp
      })
      body += '</tbody></table>'
      body +='<button onclick="regen()">Перегенерировать всё</button>'
      body += `
        <script>
          function regen() {
            let d = {}
            var http = new XMLHttpRequest()
            var url = '/userstatregen.json'
            http.open('POST', url, true)
            http.setRequestHeader('Content-type', 'application/json')
            http.onreadystatechange = function() {
              if(http.readyState == 4 && http.status == 200) {
                console.log('cpo1: ', http.responseText)

              }
            }
            http.send(JSON.stringify(d))
          }
        </script>
      `
      let wholeStatsPage = pageParts.head + body + pageParts.footer
      
      res.send(wholeStatsPage)
    } else res.send(pageParts.noau)
  } else res.send(pageParts.noau)
}

async function adminJobs(req, res) {
  //auth check
  if (req.cookies && req.cookies.sessioa && req.cookies.sessioa.length > 50 && req.cookies.user2) {
    //auth check
    let auth = await db.adminAuth(req.cookies.user2, req.cookies.sessioa).catch(error => {
      //res.send('step2')
      return undefined
    })
    if (auth) {
      let body = `
        <style>
        .hidden {
          display: none;
        }
        tr:nth-child(even) {background: #DCD}
        a {color:blue; text-decoration: none}
        a:visited {color:blue}
        </style>
        <h2 style="text-align:center; margin: 0;">Вакансии</h2>
        ${pageParts.cplink()}
        <table style="width: 100%; font-size:14px">
          <thead style="background-color: purple; color: white;">
            <tr style="padding: 5px">
              <td>jid</td>
              <td>title</td>
              <td>aid</td>
              <td>time_updated</td>
              <td>is_published</td>
              <td>currency</td>
              <td>contact_mail</td>
              <td>contact_tel</td>
              <td>Закрыта?</td>
              <td>closed_why</td>
              <td>Управление</td>
            </tr>
          </thead>
          <tbody>
        
      `
      let data = await db.adminGetJobs().catch(error => {
        console.log('cp adminGetJobs err1: ', error)
        return []
      })
      
      data.forEach(val=>{
        let d = new Date(val.time_updated).toString().split(' GMT')[0].substring(3)
        let tmp = `
          <tr id="jtr_${val.job_id}" ${val.is_published == true ? '' : 'style="font-weight: 700"'}>
            <td>${val.job_id}</td>
            <td><a href="/jobpage?id=${val.job_id}" target="_blank">${val.title}</a></td>
            <td>${val.author_id}</td>
            <td>${d}</td>
            <td id="td_apr_${val.job_id}">${val.is_published}</td>
            <td>${val.currency}</td>
            <td>${val.contact_mail}</td>
            <td>${val.contact_tel}</td>
            <td id="td_ic_${val.job_id}">${val.is_closed}</td>
            <td id="td_cw_${val.job_id}">${val.closed_why}</td>
            <td style="width: 180px; display: flex">
              ${val.is_closed == false
                ? `
                  <div id="cl_ctr_${val.job_id}">
                    <button style="padding:0" onclick="popup(${val.job_id})">Закрытие</button>
                    <div id="close_${val.job_id}" class="hidden">
                      <textarea id="ta_${val.job_id}" style="color: black" placeholder="укажите причину"></textarea>
                      <button style="padding:0" onclick="sendclosejob(${val.job_id})">Закрыть</button>
                    </div>
                  </div>
                `
                : ''
              }
              <button style="padding:0" onclick="senddeljob(${val.job_id})">Удалить</button>
              ${val.is_published
                ? ''
                : `<button id="btn_apr_${val.job_id}" style="padding:0" onclick="sendaprjob(${val.job_id})">Одобрить</button>`
              }
            </td>
          </tr>
        `
        body += tmp
      })
      body += '</tbody></table>'
      body += `
        <script>
          function popup(jid) {
            document.getElementById("close_" + jid).classList.toggle("hidden")
          }
          function sendclosejob(jid) {
            let closed_why = document.getElementById("ta_" + jid).value
            let d = {closed_why, jid}
            //console.log(d)
            var http = new XMLHttpRequest()
            var url = '/admnjobclo.json'
            http.open('POST', url, true)
            http.setRequestHeader('Content-type', 'application/json')
            //
            document.getElementById("td_ic_" + jid).textContent = 'true'
            document.getElementById("td_cw_" + jid).textContent = closed_why
            document.getElementById("cl_ctr_" + jid).remove()
            http.onreadystatechange = function() {
              if(http.readyState == 4 && http.status == 200) {
                console.log('cpo1: ', http.responseText)

              }
            }
            http.send(JSON.stringify(d))
          }

          function senddeljob(jid) {
            let d = {jid}
            //console.log(d)
            var http = new XMLHttpRequest()
            var url = '/admnjobdel.json'
            http.open('POST', url, true)
            http.setRequestHeader('Content-type', 'application/json')
            //
            document.getElementById("jtr_" + jid).remove()
            http.onreadystatechange = function() {
              if(http.readyState == 4 && http.status == 200) {
                console.log('cpo2: ', http.responseText)

              }
            }
            http.send(JSON.stringify(d))
          }
          function sendaprjob(jid) {
            let d = {jid}
            //console.log(d)
            var http = new XMLHttpRequest()
            var url = '/admnjobapr.json'
            http.open('POST', url, true)
            http.setRequestHeader('Content-type', 'application/json')
            //
            document.getElementById("td_apr_" + jid).textContent = 'true'
            document.getElementById("btn_apr_" + jid).remove()
            document.getElementById("jtr_" + jid).style.fontWeight = '400'
            
            http.onreadystatechange = function() {
              if(http.readyState == 4 && http.status == 200) {
                console.log('cpo3: ', http.responseText)

              }
            }
            http.send(JSON.stringify(d))
          }
        </script>
      `
      let allJobsPage = pageParts.head + body + pageParts.footer
      
      res.send(allJobsPage)
    } else res.send(pageParts.noau)
  } else res.send(pageParts.noau)
}

async function adminUsers(req, res) {
  //auth check
  if (req.cookies && req.cookies.sessioa && req.cookies.sessioa.length > 50 && req.cookies.user2) {
    //auth check
    let auth = await db.adminAuth(req.cookies.user2, req.cookies.sessioa).catch(error => {
      //res.send('step2')
      return undefined
    })
    if (auth) {
      let body = `
        <style>
          .hidden {
            display: none;
          }
        </style>
        <h2 style="text-align:center; margin: 0;">Пользователи</h2>
        ${pageParts.cplink()}
        <table style="width: 100%; font-size:14px">
          <thead style="background-color: green; color: white;">
            <tr style="padding: 5px">
              <td>uid</td>
              <td>email</td>
              <td>role</td>
              <td>time_created</td>
              <td>last_logged_in</td>
              <td>name</td>
              <td>surname</td>
              <td>company</td>
              <td>Верифиц</td>
              <td>Рабочий?</td>
              <td>Причина блока</td>
              <td>Управление</td>
            </tr>
          </thead>
          <tbody>
        
      `
      let data = await db.adminGetUsers().catch(error => {
        console.log('cp adminGetUsers err1: ', error)
        return []
      })
      //console.log('cp32: ', data)
      data.forEach(val=>{
        let d = new Date(val.time_created).toString().split(' GMT')[0].substring(3)
        let d2 = new Date(val.last_logged_in).toString().split(' GMT')[0].substring(3)
        let tmp = `
          <tr id="tr_${val.user_id}">
            <td>${val.user_id}</td>
            <td>${val.email}</td>
            <td>${val.role}</td>
            <td>${d}</td>
            <td>${d2}</td>
            <td>${val.name}</td>
            <td>${val.surname}</td>
            <td>${val.company}</td>
            <td>${val.email_confirmed}</td>
            <td id="ia_${val.user_id}">${val.is_active}</td>
            <td id="br_${val.user_id}" style="max-width: 110px;">${val.block_reason}</td>
            <td>
              <div id="block_ctr_${val.user_id}" ${val.is_active == false ? 'class="hidden"' : ''}>
                <button onclick="popup(${val.user_id})">Блок</button>
                <div id="block_sub_${val.user_id}" class="hidden">
                  <textarea id="ta_${val.user_id}" style="color: black" placeholder="укажите причину"></textarea>
                  <button onclick="block_u(${val.user_id}, false)">Блокировать</button>
                </div>
              </div>
              <button id="unblock_${val.user_id}" ${val.is_active == true ? 'class="hidden"' : ''} onclick="block_u(${val.user_id}, true)">Разблок</button>
              <button onclick="if (confirm('Удалится пользователь, все его вакансии и поданные резюме, удалить?')) delete_u(${val.user_id})">Удалить</button>
            </td>
          </tr>
        `
        body += tmp
      })
      body += '</tbody></table>'
      body += `
        <script>
          function popup(uid) {
            document.getElementById("block_sub_" + uid).classList.toggle("hidden")
          }
          function block_u(uid, set_active_to) {
            let block_reason = Boolean(set_active_to) ? '' : document.getElementById("ta_" + uid).value
            let action = Boolean(set_active_to) ? 'unblock' : 'block'
            let d = {action, uid, block_reason}
            //console.log(d)
            var http = new XMLHttpRequest()
            var url = '/auaction.json'
            http.open('POST', url, true)
            http.setRequestHeader('Content-type', 'application/json')
            //
            document.getElementById("block_sub_" + uid).classList.add("hidden")
            document.getElementById("block_ctr_" + uid).classList.toggle("hidden")
            document.getElementById("ia_" + uid).textContent = set_active_to
            document.getElementById("br_" + uid).textContent = block_reason
            document.getElementById("ta_" + uid).value = ''
            document.getElementById("unblock_" + uid).classList.toggle("hidden")
            http.onreadystatechange = function() {
              if(http.readyState == 4 && http.status == 200) {
                console.log('cpo2: ', http.responseText)
              }
            }
            http.send(JSON.stringify(d))
          }
          function delete_u(uid) {
            let d = {action: 'del', uid}
            var http = new XMLHttpRequest()
            var url = '/auaction.json'
            http.open('POST', url, true)
            http.setRequestHeader('Content-type', 'application/json')
            document.getElementById("tr_" + uid).remove()
            http.onreadystatechange = function() {
              if(http.readyState == 4 && http.status == 200) {
                console.log('cpo2: ', http.responseText)
              }
            }
            http.send(JSON.stringify(d))
          }
        </script>
      `
      let allUsersPage = pageParts.head + body + pageParts.footer
      
      res.send(allUsersPage)
    } else res.send(pageParts.noau)
  } else res.send(pageParts.noau)
}

async function getAllFB(req, res) {
  //auth check
  if (req.cookies && req.cookies.sessioa && req.cookies.sessioa.length > 50 && req.cookies.user2) {
    //auth check
    let auth = await db.adminAuth(req.cookies.user2, req.cookies.sessioa).catch(error => {
      //res.send('step2')
      return undefined
    })
    if (auth) {
      let body = `
        ${pageParts.cplink()}
        <table style="width: 100%">
          <thead style="background-color: blue; color: white;">
            <tr style="padding: 5px">
            <td>Тема</td>
            <td>Имя</td>
            <td>Мэйл</td>
            <td>Текст</td>
            <td>Новая?</td>
            <td>Дата написания</td>
            <td>Управление</td>
            </tr>
          </thead>
          <tbody>
        
      `
      let data = await db.adminGetFB().catch(error => {
        console.log('cp getAllFB err1: ', error)
        return []
      })
      //console.log('cp31: ', data)
      data.forEach(val=>{
        let d = new Date(val.date_created).toString().split(' GMT')[0].substring(3)
        let tmp = `
          <tr id="tr_${val.fb_id}" ${val.new == true ? 'style="background-color: #eef"' : ''}>
            <td>${val.topic}</td>
            <td>${val.name}</td>
            <td>${val.mail}</td>
            <td>${val.desc}</td>
            <td id="new_${val.fb_id}">${val.new}</td>
            <td>${d}</td>
            <td>
              ${val.new == true ? `<button id="btn_${val.fb_id}" onclick="cmd('read', ${val.fb_id})">Прочитано</button>` : ''}
              <button onclick="cmd('del', ${val.fb_id})">Удалить</button>
            </td>
          </tr>
        `
        body += tmp
      })
      body += '</tbody></table>'
      body += `
        
        <script>
          function cmd(action, fbid) {
            let d = {action, fbid}
            
            var http = new XMLHttpRequest()
            var url = '/fbaction.json'
            http.open('POST', url, true)
            http.setRequestHeader('Content-type', 'application/json')
            //
            http.onreadystatechange = ()=>{
              if(http.readyState == 4) {
                let res = JSON.parse(http.responseText)
                //document.getElementById("viewer").textContent += http.responseText
                if (res.cmd === 'del') {
                  document.getElementById('tr_' + res.fbid).remove()
                }
                else if (res.cmd === 'read') {
                  document.getElementById('new_' + res.fbid).textContent = 'false'
                  document.getElementById('tr_' + res.fbid).style.backgroundColor = "white"
                  document.getElementById('btn_' + res.fbid).remove()
                }
              }
            }
            http.send(JSON.stringify(d))
          }
        </script>
      `
      let allFBPage = pageParts.head + body + pageParts.footer
      
      res.send(allFBPage)
    } else res.send(pageParts.noau)
  } else res.send(pageParts.noau)
}

async function getOwnCompanyJSON(req, res) {
  
  if (req.cookies.session && req.cookies.session.length > 50) {
    //console.log(req.body)
    
    let user_id = await db.checkIfUserAuthed(req.cookies.session).catch(error => {
      console.log(error)
      return false
    })
    if (user_id == false) {
      res.send('error1, wrong user data 1')
      return false
    }
    let company = await db.getOneCompany(user_id).catch(error => {
      console.log(error)
      res.send('err2')
      return false
    })
    //console.log('cp own company', company)
    res.send(company)
  } else res.send('error0, wrong userdata')
}

async function getCompanyById(req, res) {
  console.log('cp123')
  const id = parseInt(req.params.id)
  if (isNaN(id) || id < 0 || String(id).length > 10) {
    console.log('Error: wrong company id')
    res.status(400).send('Неправильный id компании.')
    return false
  }
  let company = await db.getOneCompanyBroad(id).catch(error => {
    console.log(error)
    return false
  })
  if (company == false) {
    res.status(400).json('Неправильный id компании. Ошибка 2')
    return false
  }
  console.log('derp')
  res.status(200).send(company)
}

async function getJobByIdJSON(req, res) {
  console.log('get job by idJSON first func. ip: ', req.headers['x-forwarded-for'] || req.connection.remoteAddress)
  const id = parseInt(req.params.id)
  // console.log('url: ', req.url)
  // console.log('params: ', req.params)
  // console.log('dd ', id)
  if (isNaN(id) || id < 0 || String(id).length > 10) {
    console.log('Error: wrong id')
    res.status(400).send('Неправильный id вакансии.')
    return false
  }
  
  let job = await db.getJobById(id).catch(error => {
    console.log(error)
    return false
  })
  if (job == false) {
    res.status(400).json('Неправильный id вакансии')
    return false
  }
  res.status(200).send(job)
  db.hitJobById(id, req.headers['x-forwarded-for'] || req.connection.remoteAddress)
}

async function getJobById(req, res) {
  console.log('get job by id first func. ip: ', req.headers['x-forwarded-for'] || req.connection.remoteAddress)
  const id = parseInt(req.query.id)
  if (isNaN(id) || id < 0 || String(id).length > 10) {
    console.log('Error: wrong id')
    res.status(400).send('Неправильный id вакансии.')
    return false
  }
  
  let job = await db.getJobById(id).catch(error => {
    console.log(error)
    return false
  })
  if (job == false) {
    res.status(400).json('Неправильный id вакансии')
    return false
  }
  //console.log('cp', job)
  let jobpage = pageParts.jobinfo(job)
  res.status(200).send(jobpage)
  db.hitJobById(id, req.headers['x-forwarded-for'] || req.connection.remoteAddress)
}

async function out(req, res) {
  //maybe delete stuff in db and write some statistics down
  //for now just reset cookies and send back OK
  console.log('user logout')
  res.cookie('session', '', {expires: new Date(Date.now())})
  res.send('get out then')
}

async function auth(req, res) {
  console.log('auth try', req.cookies.session)
  if (req.cookies.session && req.cookies.session.length > 50) {
    let profile = await db.checkAuthGetProfile(req.cookies.session).catch(error => {
      console.log(error)
      return false
    })
    if (profile === false) {
      console.log('auth failed, expiring cookies1')
      //res.cookie('session', '', {expires: new Date(Date.now())})
      res.send('fail')
      return false
    } else {
      console.log('cp14: ', profile)
      res.send(Object.values(profile))
    }
  } else {
    console.log('auth failed, expiring cookies2', req.cookies.session)
    //res.cookie('session', '', {expires: new Date(Date.now())})
    res.send('fail')
  }
}


async function changeuserstuff(req, res) {
  console.log('cp change user stuff: ', req.body)
  let udata = {}
  if (req.body && req.body.username && req.body.username.length < 36 && req.body.username.length > 2) {
    udata.name = req.body.username
  } else {
    res.send('error name')
    return false
  }
  if (req.body.surname && req.body.surname.length < 36 && req.body.surname.length > 2) {
    udata.surname = req.body.surname
  } else {
    res.send('error surname')
    return false
  }
  // console.log(req.body.insearch)
  // if (req.body.insearch != undefined && (req.body.insearch === true || req.body.insearch === false || req.body.insearch == 'true' || req.body.insearch == 'false')) {
    
  //   udata.insearch = Boolean(req.body.insearch)
  // } else {
  //   res.send('error insearch')
  //   return false
  // }
  if (req.cookies.session && req.cookies.session.length > 50) {
    let user_id = await db.authedForUserData(req.cookies.session, 'subscriber').catch(error => {
      res.send('step2')
      return undefined
    })
    if (user_id) {
      console.log('cp256: ', user_id, udata)
      let doit = await db.updateUserData(user_id, udata).catch(error => {
        res.send('step3')
        return undefined
      })
      if (doit) {
        res.send('OK')
      }
    } else {
      res.send('error bad userdata')
      return false
    }
  } else {
    res.send('error auth')
    return false
  }
  //check incoming data for validity
  //check cookie, usertype = 'subscriber', return user_id to write to
  //send update
}



async function changepw(req, res) {
  //check data for validity
  console.log('cp changepw:')
  if (req.body && req.body.oldmail && req.body.oldpw && req.body.newpw) {

    let mail = req.body.oldmail.toLowerCase()
    let oldpw = req.body.oldpw
    let newpw = req.body.newpw
    if (SupremeValidator.isValidEmail(mail) && SupremeValidator.isValidPW(oldpw) && SupremeValidator.isValidPW(newpw)) {
      //if cookies present
      if (req.cookies.session && req.cookies.session.length > 50) {
        //check data in db
        let userData = await db.getDiapers(req.cookies.session, mail).catch(error => {
          res.send('step2')
          return undefined
        })
        if (userData) {
          let authed = bcrypt.compareSync(oldpw, userData.pwhash)
          //console.log('cp219: ', userData, ' and ', authed)
          if (authed) {
            let newhash = bcrypt.hashSync(newpw, bcrypt.genSaltSync(9))
            let updator = await db.updateDiaper(newhash, userData.pwhash, req.cookies.session).catch(error => {
              res.send('step2')
              return undefined
            })
            //console.log('cp134 ', updator)
            if (updator) res.send('OK')
            //else res.send('smthngs')
          } else {res.send('step4')}
        } else {res.send('step5')}
      } else {res.send('step1'); console.log('not valid cookies')}
    } else {res.send('step1'); console.log('not valid mail or pw')}
  } else {res.send('step1'); console.log('not valid stuff: ')}
}

async function login(req, res) {
  console.log('cp login: ', req.cookies)
  let mail = req.body[0].toLowerCase()
  let pw = req.body[1]
  let rememberme = req.body[2]
  //console.log('cp login rm: ', rememberme)
  if (SupremeValidator.isValidEmail(mail) && SupremeValidator.isValidPW(pw)) {
    //console.log('user validated')
    //get hash from db checking if mail exists
    let userData = await db.tryGetLoginData(mail).catch(error => {
      res.send('step2')
      return undefined
    })
    //console.log('cp77', userData)
    if (userData) {
      //check if blockd
      if (userData.is_active == false) {
        if (userData.block_reason == 'not_verified') {
          res.status(211).send('Email не верифицирован. Вам на почту должно было прийти письмо о верификации')
        } else {
          res.status(209).send('Пользователь заблокирован модератором, причина: ' + userData.block_reason)
        }
        return false
      }
      
      //is the pw right?
      let authed = bcrypt.compareSync(pw, userData.pwHash)
      console.log('authed cp: ', authed)
      if (authed) {
        //generate and store a cookie
        let jwtoken = SupremeValidator.generateJSONWebToken(mail)
        //send the cookie and send the ok
        //console.log(req.cookies)
        let laststage = await db.tryInsertAuthToken(userData.userId, jwtoken).catch(error => {
          res.send('step3')
          return undefined
        })
        if (laststage === undefined) return false
        console.log('success, sending')
        let data = [
          'OK',
          mail,
          userData.userId,
          userData.role
        ]
        if (userData.role === 'subscriber') {
          data.push(userData.name)
          data.push(userData.surname)
          data.push(userData.insearch)
          data.push(userData.likedJobs)
          data.push(userData.cvurl)
        } else
        if (userData.role === 'company') {
          data.push(userData.cname)
          data.push(userData.isagency)
        }
        if (rememberme) res.cookie('session', jwtoken, {expires: new Date(Date.now() + 590013000)})
        else res.cookie('session', jwtoken)//, {expires: new Date(Date.now() + 1013000)}
        res.send(data)
      } else res.send('step2')
      

    } else {console.log('user does not exist?', userData); res.send('step2'); return false}

    //res.send('OK')
  } else {res.send('step1'); console.log('not valid mail or wrong pw')}
  
}


async function reg(req, res) {
  console.log('cp register', req.body)
  //first server-side literal validation
  let mail = req.body[0].toLowerCase()
  let pw = req.body[1]
  let usertype = req.body[2]
  let arg1 = req.body[3]
  let arg2 = req.body[4]
  
  //check type
  if (usertype !== 'subscriber' && usertype !== 'company') {
    res.send('step3')
    return -1
  }
  //console.log('cp10: ')
  //check arg1
  //add /s but not from beginning or end
  let nameregex = /^[\w1234567890а-яА-ЯÇçÄä£ſÑñňÖö$¢Üü¥ÿýŽžŞş\s\-]*$/
  if (arg1.length < 3 ||
     (arg1.length > 60 && usertype === 'subscriber') ||
     (arg1.length > 80 && usertype === 'company') ||
      !nameregex.test(arg1)
    ) {
    res.send('step3')
    return -1
  }
  //check arg2
  if ((arg2.length < 3 && usertype === 'subscriber') ||
      (arg2.length > 60 && usertype === 'subscriber') ||
      (!nameregex.test(arg2) && usertype === 'subscriber') ||
      ((arg2 != true && arg2 != false && arg2 != 'true' && arg2 != 'false') && usertype === 'company')
    ) {
    res.send('step3')
    return -1
  }
  
  console.log('tops validated')
  if (SupremeValidator.isValidEmail(mail) && SupremeValidator.isValidPW(pw)) {
    //try to insert the email//if fails then error
    let userId = await db.tryInsertEmail(mail).catch(error => {
      res.send('step2')
      return -1
    })
    if (userId === -1 || userId === undefined) return false
    console.log('step2 passed, email inserted:', userId)
    //if all before is successful, id of new user in emailIn
    //go on
    //hash the pw with pw and salt
    let hash = bcrypt.hashSync(pw, bcrypt.genSaltSync(9))
    //store rest of the new user
    //console.log('cp9: ', arg2)
    let isDone = await db.registerFinish(userId, hash, usertype, arg1, arg2).catch(error => {
      console.log('STEP3', error)
      res.send('step3')
      return false
    })
    if (isDone === false) return false
    
    
    let hash1 = String(hashSome()) + userId + parseInt(Math.random()*1000000000, 10)

    let success1 = await db.tryInsertMailVerification(hash1, userId, mail).catch(error => {
      res.send('step5')
      return undefined
    })
    if (success1) {
      testMail(hash1, mail)
      console.log('it is successful registraion at this point')
      res.send('OK')
    } else {res.send('step6'); console.log('failed at creating the verification entry')}
    
  } else {res.send('step1'); console.log('not valid mail or wrong pw')}
  
}



const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const SupremeValidator = {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  isValidEmail(email) {
    //return /\S+@\S+\.\S+/.test(email);
    if (email.length < 6 || email.length > 50) return false
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
  },
  isValidPW(pw) {
    let pwRegex = /[a-zA-Z]/
    if (pw.length < 6 || pw.length > 25) return false
    return (pw && pw.length > 5 && pw.length < 26 && pwRegex.test(pw))
  },
  generateJSONWebToken(mail){
    const signature = 'YoiRG3rots' + Math.random()
    const expiration = '6h'
    return jwt.sign({ mail }, signature, { expiresIn: expiration }).substr(0, 165)
  },
  generateToken(id) {
    const token = jwt.sign({
      user_id: id
    },
      process.env.SECRET, { expiresIn: '7d' }
    );
    return token;
  }
}


function hashSome() {
  let base = String(Number(new Date()))
  var hash = 0, i, chr;
  if (base.length === 0) return hash;
  for (i = 0; i < base.length; i++) {
    chr   = base.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}