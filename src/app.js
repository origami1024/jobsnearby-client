const pageParts = require('./pageParts')
const db = require('./pgqueries')
//

const express = require('express')
const app = express()
const port = process.env.PORT || 7777
const cookieParser = require('cookie-parser')

const serveStatic = require("serve-static")
const path = require('path')

var cors = require('cors');
app.use(cors({
  origin: process.argv.includes('-development') ? 'http://127.0.0.1:8080' : 'https://herokuapp.com',
  credentials: true,
  exposedHeaders: ['session','user']
}))

app.use(cookieParser())
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.use(serveStatic(path.join(__dirname, './../dist')));



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
if (process.argv.includes('-development')) console.log('development mode on')



let pages = {}
let navlinks = [{href: '/', title: 'Главная'}, {href: '/jobs', title: 'Вакансии'}, {href: '/about', title: 'О сайте'}]
pages.main = pageParts.head + pageParts.navbar(navlinks) + pageParts.demo + pageParts.foot
pages.about      = pageParts.head + pageParts.navbar(navlinks) + 'Работай!' + pageParts.foot
pages.jobListing = pageParts.head + pageParts.navbar(navlinks) + pageParts.demo + pageParts.foot


//app.get('/', (req, res) => res.send(pages.main))
//redirect from the main

app.get('/about', (req, res) => res.send(pages.about))
app.post('/auth', auth)//auth by cookie
app.post('/login', login)
app.post('/reg', reg)
app.post('/out', out)

app.get('/jobs.json', db.getJobs)
app.get('/job/:id', db.getJobById)
app.post('/entrance', db.addJobs)

async function out(req, res) {
  //maybe delete stuff in db and write some statistics down
  //for now just reset cookies and send back OK
  console.log('user logout')
  res.cookie('session', '', {expires: new Date(Date.now())})
  res.send('get out then')
}

async function auth(req, res) {
  console.log(req.cookies.session)
  if (req.cookies.session && req.cookies.session.length > 50) {
    let profile = await db.checkAuthGetProfile(req.cookies.session).catch(error => {
      console.log(error)
      return false
    })
    if (profile === false) {
      res.cookie('session', '', {expires: new Date(Date.now())})
      res.send('fail')
      return false
    } else {
      console.log('cp14: ', profile)
      res.send(Object.values(profile))
    }
  } else {
    res.cookie('session', '', {expires: new Date(Date.now())})
    res.send('fail')
  }
}

async function login(req, res) {
  console.log('cp login: ', req.cookies)
  let mail = req.body[0]
  let pw = req.body[1]
  if (SupremeValidator.isValidEmail(mail) && SupremeValidator.isValidPW(pw)) {
    console.log('user validated')
    //get hash from db checking if mail exists
    let userData = await db.tryGetLoginData(mail).catch(error => {
      res.send('step2')
      return undefined
    })
    console.log('cp77', userData)
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
        } else
        if (userData.role === 'company') {
          data.push(userData.cname)
          data.push(userData.isagency)
        }
        res.cookie('session', jwtoken, {expires: new Date(Date.now() + 900000)})
        res.send(data)
      } else res.send('step2')
      

    } else {console.log('user does not exist?', userData); res.send('step2'); return false}

    //res.send('OK')
  } else {res.send('step1'); console.log('not valid mail or wrong pw')}
  
}


async function reg(req, res) {
  console.log('cp register', req.body)
  //first server-side literal validation
  let mail = req.body[0]
  let pw = req.body[1]
  let usertype = req.body[2]
  let arg1 = req.body[3]
  let arg2 = req.body[4]
  console.log('cp9: ', arg2)
  //check type
  console.log(usertype)
  if (usertype !== 'subscriber' && usertype !== 'company') {
    res.send('step3')
    return -1
  }
  console.log('ok1')
  //check arg1
  //add /s but not from beginning or end
  let nameregex = /^[\wа-яА-Я]+$/
  if (arg1 < 3 ||
     (arg1 > 60 && usertype === 'subscriber') ||
     (arg1 > 80 && usertype === 'company') ||
      !nameregex.test(arg1)
    ) {
    res.send('step3')
    return -1
  }
  console.log('ok2')
  console.log('cp11: ', arg2)
  //check arg2
  if ((arg2 < 3 && usertype === 'subscriber') ||
      (arg2 > 60 && usertype === 'subscriber') ||
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
    if (userId === -1) return false
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
    return (pw.length>4 && pw.length<31)
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