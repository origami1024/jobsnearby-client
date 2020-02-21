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

app.post('/favOne.json', db.favOne)
app.post('/delFavOne.json', db.delFavOne)
app.post('/getFaved.json', db.getFaved)
app.post('/getFavedFull.json', db.getFavedFull)


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
//app.get('/jobBy.id', getJobById)
app.get('/jobby.idjson=:id', getJobByIdJSON)

app.post('/delJobBy.id', db.deleteJobById)
app.post('/closeJobBy.id', db.closeJobById)
app.post('/reopenJobBy.id', db.reopenJobById)


app.post('/fb', db.feedback)
app.get('/allfb.json', getAllFB)
app.get('/adminusers.json', adminUsers)
app.get('/adminjobs.json', adminJobs)
app.get('/cp.json', adminPanel)
app.get('/cplogin.json', adminLogin)
app.post('/cploginep.json', cpLoginEndpoint)
app.get('/cpsuper.json', superAdmin)
app.get('/u2out.json', u2out)
app.post('/newu2.json', adminNew) //?check who is adding the new user!!!

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
    if (auth) {
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
                <td style="width:100px">mail</td>
                <td style="width:100px">pw</td>
              </tr>
              <tr>
                <td style="border: 1px solid black" id="newmail" contenteditable="true"></td>
                <td style="border: 1px solid black" id="newpw" contenteditable="true"></td>
              </r>
            </table>
            <button onclick="addNew()">Add New Admin</button>
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
      let coo = req.cookies.sessioa
      
      let body = `
        <div>
        <h2 style="text-align:center; margin: 0;">Башня управления. ${mail}</h2>
          <ul>
            <li>
              <a href="/allfb.json">Фидбек пользователей</a>
            </li>
            <li>
              <a href="/adminusers.json">Пользователи</a>
            </li>
            <li>
              <a href="/adminjobs.json">Вакансии</a>
            </li>
            <li>
              <a href="/cpsuper.json">Суперадмин</a>
            </li>
            <li>
              <a href="/u2out.json">Выйти</a>
            </li>
          </ul>
        </div>
      `
      let cpPage = pageParts.head + body + pageParts.footer
      
      res.send(cpPage)
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
        <h2 style="text-align:center; margin: 0;">Вакансии</h2>
        ${pageParts.cplink()}
        <table style="width: 100%; font-size:14px">
          <thead style="background-color: purple; color: white;">
            <tr style="padding: 5px">
              <td>jid</td>
              <td>title</td>
              <td>aid</td>
              <td>time_updated</td>
              <td>salary_min</td>
              <td>salary_max</td>
              <td>currency</td>
              <td>contact_mail</td>
              <td>contact_tel</td>
              <td>is_closed</td>
              <td>Управление</td>
            </tr>
          </thead>
          <tbody>
        
      `
      let data = await db.adminGetJobs().catch(error => {
        console.log('cp adminGetJobs err1: ', error)
        return []
      })
      console.log('cp33: ', data)
      data.forEach(val=>{
        let d = new Date(val.time_updated).toString().split(' GMT')[0].substring(3)
        let tmp = `
          <tr id=${val.job_id}>
            <td>${val.job_id}</td>
            <td>${val.title}</td>
            <td>${val.author_id}</td>
            <td>${d}</td>
            <td>${val.salary_min}</td>
            <td>${val.salary_max}</td>
            <td>${val.currency}</td>
            <td>${val.contact_mail}</td>
            <td>${val.contact_tel}</td>
            <td>${val.is_closed}</td>
            <td>
              <button>Закрыть</button>
              <button>Открыть</button>
              <button>Удалить</button>
            </td>
          </tr>
        `
        body += tmp
      })
      body += '</tbody></table>'
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
        <h2 style="text-align:center; margin: 0;">Пользователи</h2>
        ${pageParts.cplink()}
        <table style="width: 100%; font-size:14px">
          <thead style="background-color: green; color: white;">
            <tr style="padding: 5px">
              <td>uid</td>
              <td>email</td>
              <td>role</td>
              <td>time_created</td>
              <td>name</td>
              <td>surname</td>
              <td>company</td>
              <td>isagency</td>
              <td>logo_url</td>
              <td>cvurl</td>
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
        let tmp = `
          <tr>
            <td>${val.user_id}</td>
            <td>${val.email}</td>
            <td>${val.role}</td>
            <td>${d}</td>
            <td>${val.name}</td>
            <td>${val.surname}</td>
            <td>${val.company}</td>
            <td>${val.isagency}</td>
            <td style="max-width:100px">${val.logo_url}</td>
            <td style="max-width:100px">${val.cvurl}</td>
            <td>
              <button>Редактировать</button>
              <button>Применить</button>
              <button>Удалить</button>
            </td>
          </tr>
        `
        body += tmp
      })
      body += '</tbody></table>'
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
        <a href="/cp.json">Админка</a>
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
          <tr>
            <td>${val.topic}</td>
            <td>${val.name}</td>
            <td>${val.mail}</td>
            <td>${val.desc}</td>
            <td>${val.new}</td>
            <td>${d}</td>
            <td>
              <button>Прочитано</button>
              <button>Удалить</button>
            </td>
          </tr>
        `
        body += tmp
      })
      body += '</tbody></table>'
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
  console.log('cp9: ', arg2)
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
    let isDone = await db.registerFinish(userId, hash, usertype, arg1, arg2).catch(error => {
      console.log('STEP3', error)
      res.send('step3')
      return false
    })
    if (isDone === false) return false
    console.log('it is successful registraion at this point')
    //send back ok or not ok
    res.send('OK')
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
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
  },
  isValidPW(pw) {
    let pwRegex = /[a-zA-Z]/
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