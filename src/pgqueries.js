//postgres config file
const Pool = require('pg').Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgres://postgres:123456@localhost:5433/jobsnearby`
})





const getJobs = (req, res) => {
  let perpage = '25'
  if (req.query.perpage === '50') perpage = '50'
  else if (req.query.perpage === '100') perpage = '100'

  let txt = undefined
  if (req.query.txt != undefined && 
      req.query.txt.length > 0 && 
      /^[\wа-яА-ЯÇçÄä£ſÑñňÖö$¢Üü¥ÿýŽžŞş\s\\-]*$/.test(req.query.txt)) {
    txt = '%' + req.query.txt.toLowerCase() + '%'
  }
  
  let sort = 'ORDER BY (jobs.time_updated, jobs.job_id) DESC'
  if (req.query.sort === 'salasc') sort = 'ORDER BY (jobs.salary_max::int, jobs.job_id) ASC'
  else if (req.query.sort === 'saldesc') sort = 'ORDER BY (jobs.salary_max::int, jobs.job_id) DESC'
  //console.log('cp_getJobs1: ', perpage)
  let timerange = ` AND jobs.time_updated > now() - interval '1 month'`

  let page = 1
  if (req.query.page && Number(req.query.page) > 0 && Number(req.query.page) < 11) page = req.query.page
  let offset = (page - 1) * Number(perpage)
  //console.log('cpoffset ', offset, 'CPPAGE ', page)
  if (req.query.timerange === 'wee') timerange = ` AND jobs.time_updated > now() - interval '1 week'`
  else if (req.query.timerange === 'day') timerange = ` AND jobs.time_updated > now() - interval '1 day'`

  let que =  `SELECT jobs.author_id, users.company as author, jobs.job_id, jobs.city, jobs.experience, jobs.jobtype, jobs.title, jobs.edu, jobs.currency, jobs.sex, jobs.salary_min, jobs.salary_max, jobs.description, jobs.worktime1, jobs.worktime2, jobs.age1, jobs.age2, jobs.langs, jobs.time_published as published, jobs.time_updated as updated
              FROM jobs, users
              WHERE jobs.author_id = users.user_id
                  ${timerange} 
                  ${txt != undefined ? ` AND
                  (LOWER(jobs.title) LIKE $2 OR
                  LOWER(users.company) LIKE $2 OR
                  LOWER(jobs.description) LIKE $2 OR
                  LOWER(jobs.city) LIKE $2)` : ''}
              ${sort} 
              LIMIT $1 ${'OFFSET ' + offset}`
  //console.log('cp_getJobs2: ', que)
  let qparams = [perpage]
  if (txt) qparams.push(txt)
  pool.query(que, qparams, (error, results) => {
    if (error) {
      console.log(error)
      throw error
    }
    qparams[0] = 1
    let countque =  `SELECT count(*) OVER() AS full_count
                    FROM jobs, users
                    WHERE jobs.author_id = users.user_id
                        ${timerange} 
                        ${txt != undefined ? ` AND
                        (LOWER(jobs.title) LIKE $2 OR
                        LOWER(users.company) LIKE $2 OR
                        LOWER(jobs.description) LIKE $2 OR
                        LOWER(jobs.city) LIKE $2)` : ''}
                    ${sort} 
                    LIMIT $1`
    pool.query(countque, qparams, (error2, results2) => {
      if (error2) {
        console.log('errcp33 ', error2)
        return false
        //throw error2
      }
      res.status(200).json({...results2.rows[0], 'page': page, 'perpage': perpage, rows: results.rows})
    })
    //console.log('cp16: ', results.rows)
    
  })
}

async function getJobById (id) {
  //const id = parseInt(request.params.id)
  let result = await pool.query('SELECT * FROM jobs WHERE job_id = $1', [id]).catch(error => {
    console.log(error)  
    throw new Error('job by id error')
  })
  if (result.rows && result.rows.length === 1) return result.rows[0]
  else return false
}


async function getOwnJobs (req, res) {  
  //we need to decouple the user here
  console.log('cpGetOwnJobs: ', req.cookies)
  if (req.cookies.session && req.cookies.session.length > 50) {
    let que1st = `SELECT user_id FROM "users" WHERE "auth_cookie" = ($1)`
    let params1st = [req.cookies.session]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        console.log(error)
        res.send('step2')
        //throw error
        return false
      }
      //after cookies check, get the actual data from db
      let que2nd = `SELECT jobs.job_id, jobs.city, jobs.experience, jobs.jobtype, jobs.title, jobs.edu, jobs.currency, jobs.salary_min, jobs.salary_max, jobs.sex, jobs.description, jobs.worktime1, jobs.worktime2, jobs.age1, jobs.age2, jobs.langs, jobs.time_published as published, jobs.time_updated as updated
            FROM jobs
            WHERE jobs.author_id = $1
            ORDER BY (jobs.time_updated, jobs.job_id) DESC` //TODO: paginate this too
      let params2nd = [results.rows[0].user_id]
      //make second que
      pool.query(que2nd, params2nd, (error2, results2) => {
        if (error2) {
          //throw error2
          console.log(error2)
          res.send('step3')
          return false
        }
        //console.log('cpcpcp1: ', results2.rows)
        res.send({rows: results2.rows})
      })
      //send back response
      //handle finding nothing?
    })
  }
}


async function addJobs (req, res) {
  //console.log(req.cookies)
  if (req.cookies.session && req.cookies.session.length > 50) {
    //console.log(req.body)
    let que1st = `SELECT user_id FROM "users" WHERE "auth_cookie" = ($1)`
    let params1st = [req.cookies.session]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        res.send('step2')
        throw error
      }
      //console.log('cp19: ', results)
      //console.log('r: ', req.body[0])
      //console.log('r: ', Array.isArray(req.body[0].langs))
      let que2nd = `INSERT INTO "jobs" ("title", "salary_max", "salary_min", "currency", "sex", "age1", "age2", "worktime1", "worktime2", "langs", "edu", "experience", "city", "description", "author_id") VALUES`
      let params2nd = []
      let n = 15
      let iSkipped = 0

      for (let i = 0; i < req.body.length; i++) {
        let parsedData = {}
        //title - обязат поле, без него вакансия пропускается; длина от 2 до 75 символов
        if (req.body[i].title && req.body[i].title.length > 1 && req.body[i].title.length < 76) {
          parsedData.title = req.body[i].title
        } else { iSkipped += 1; continue}
        console.log('cp567: ', req.body[i].title)
        
        //salary_max - необязат, целое число
        if (req.body[i].salary_max && isNaN(req.body[i].salary_max) === false && req.body[i].salary_max > -1 && Number.isInteger(req.body[i].salary_max)) {
          parsedData.salary_max = req.body[i].salary_max
        } else parsedData.salary_max = 0
        //salary_min - необязат, целое число
        if (req.body[i].salary_min && isNaN(req.body[i].salary_min) === false && req.body[i].salary_min > -1 && Number.isInteger(req.body[i].salary_min)) {
          parsedData.salary_min = req.body[i].salary_min
        } else parsedData.salary_min = 0
        //если указана min но не указана max, то добавить max
        if (parsedData.salary_max == 0 && parsedData.salary_min > 0) parsedData.salary_max = parsedData.salary_min
        //валюта - необязат, [m, $, р, e], по умолчанию m
        if (req.body[i].currency && (req.body[i].currency === '$' || req.body[i].currency === 'm' || req.body[i].currency === 'р' || req.body[i].currency === 'e')) {
          parsedData.currency = req.body[i].currency
        } else parsedData.currency = 'm'
        //пол - необязат, [m, w или пропуск]
        if (req.body[i].sex && (req.body[i].sex === 'm' || req.body[i].sex === 'w')) {
          parsedData.sex = req.body[i].sex
        } else parsedData.sex = ''
        //возр от - необязат, целое число
        if (req.body[i].age1 && isNaN(req.body[i].age1) === false && req.body[i].age1 > -1 && req.body[i].age1 < 250 && Number.isInteger(req.body[i].age1)) {
          parsedData.age1 = req.body[i].age1
        } else parsedData.age1 = 0
        //возр до - необязат, целое число
        if (req.body[i].age2 && isNaN(req.body[i].age2) === false && req.body[i].age2 > -1 && req.body[i].age2 < 250 && Number.isInteger(req.body[i].age2)) {
          parsedData.age2 = req.body[i].age2
        } else parsedData.age2 = 0
        //время от - необязат
        if (req.body[i].worktime1 && isNaN(req.body[i].worktime1) === false && req.body[i].worktime1 > -1 && req.body[i].worktime1 < 25) {
          parsedData.worktime1 = req.body[i].worktime1
        } else parsedData.worktime1 = ''
        //время до - необязат
        if (req.body[i].worktime2 && isNaN(req.body[i].worktime2) === false && req.body[i].worktime2 > -1 && req.body[i].worktime2 < 25) {
          parsedData.worktime2 = req.body[i].worktime2
        } else parsedData.worktime2 = ''
        //языки - обязательно массив, длина каждого языка - 50, макс кол-во языков - 3
        if (req.body[i].langs && Array.isArray(req.body[i].langs) && req.body[i].langs.length < 4) {
          let langsFiltered = req.body[i].langs.filter(lang => lang.length < 51)
          parsedData.langs = langsFiltered
        } else parsedData.langs = []
        //edu - необязат, от 2х символов до 20
        if (req.body[i].edu && req.body[i].edu.length > 1 && req.body[i].edu.length < 21) {
          parsedData.edu = req.body[i].edu
        } else parsedData.edu = ''
        //experience - стаж в годах, дробное число от 0 до 250
        if (req.body[i].experience && isNaN(req.body[i].experience) === false && req.body[i].experience >= 0 && req.body[i].experience < 250) {
          parsedData.experience = req.body[i].experience
        } else parsedData.experience = 0
        //city - необязат, от 2х символов до 100
        if (req.body[i].city && req.body[i].city.length > 1 && req.body[i].city.length < 101) {
          parsedData.city = req.body[i].city
        } else parsedData.city = ''
        //description - необязат, от 2х символов до 500
        if (req.body[i].description && req.body[i].description.length > 1 && req.body[i].description.length < 501) {
          parsedData.description = req.body[i].description
        } else parsedData.description = ''
        //author_id - проверка не нужна
        parsedData.author_id = results.rows[0].user_id
        
        let j = i - iSkipped
        que2nd += ` ($${(j * n) + 1}, $${(j * n) + 2}, $${(j * n) + 3}, $${(j * n) + 4}, $${(j * n) + 5}, $${(j * n) + 6}, $${(j * n) + 7}, $${(j * n) + 8}, $${(j * n) + 9}, $${(j * n) + 10}, $${(j * n) + 11}, $${(j * n) + 12}, $${(j * n) + 13}, $${(j * n) + 14}, $${(j * n) + 15}),`
        params2nd = [
          ...params2nd,
          ...Object.values(parsedData)
        ]
      }
      que2nd = que2nd.substring(0, que2nd.length - 1);
      //console.log(que2nd)
      //console.log(params2nd)
      pool.query(que2nd, params2nd, (error2, results2) => {
        if (error2) {
          throw error2
        }
        res.send('OK')
      })
    })
    
  } else {res.send('step1'); console.log('a trespasser is trying to send xls')}
}

async function tryGetLoginData (mail) {
  let que = `SELECT pwhash, user_id, role, name, surname, insearch, company, isagency FROM "users" WHERE "email" = ($1)`
  let params = [mail]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)  
    throw new Error('email does not exist')
  })
  //console.log('r: ', result.rows)
  //console.log('r: ', result.rows[0])
  if (result.rowCount !== 1) return false
  else {
    let res = {
      'pwHash': result.rows[0].pwhash,
      'userId': result.rows[0].user_id,
      'role': result.rows[0].role,
    }
    if (result.rows[0].role === 'subscriber') {
      res['name'] = result.rows[0].name
      res['surname'] = result.rows[0].surname
      res['insearch'] = result.rows[0].insearch
    } else
    if (result.rows[0].role === 'company') {
      res['cname'] = result.rows[0].company
      res['isagency'] = result.rows[0].isagency
    }
    return res
  }
  //return {'pwHash': result.rows[0].pwhash, 'userId': result.rows[0].user_id, 'role': result.rows[0].role}
}

async function tryInsertEmail (mail) {
  let que = `INSERT INTO "users" ("email") VALUES ($1) RETURNING user_id`
  let params = [mail]
  let result
  try {
    result = await pool.query(que, params)
  } catch(e) {
    throw new Error('email exists already')
  }
  //console.log('tryingInsert in the end: ', result.rows[0])
  return result.rows[0].user_id
}
async function registerFinish (id, hash, usertype, arg1, arg2) {
  let insert = ''
  console.log(usertype)
  if (usertype === 'subscriber') insert = `, name = $4, surname = $5`
  else if (usertype === 'company') insert = `, company = $4, isagency = $5`
  let que = `UPDATE "users" SET pwhash = $1, role = $3${insert} where user_id = $2`
  console.log(que)
  let params = [hash, id, usertype, arg1, arg2]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)
    throw new Error('user update fail')
  })
  return true
}
async function tryInsertAuthToken(id,token) {
  //also insert lastLoggedIn
  //not last seen btw
  //console.log('tryinsert')
  let que = `UPDATE "users" SET auth_cookie = $1, last_logged_in = NOW() where user_id = $2`
  let params = [token, id]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)
    throw new Error('auth insertion failed')
  })
  console.log(result)
  return true
}
async function checkAuthGetProfile(token) {
  let que = `SELECT email, user_id, role, name, surname, insearch, company, isagency FROM "users" WHERE "auth_cookie" = ($1)`
  let params = [token]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)
    throw new Error('auth check failed')
  })
  console.log('cp10: ', result.rowCount)
  if (result.rowCount !== 1) return false
  else {
    let res = {
      'email': result.rows[0].email,
      'userId': result.rows[0].user_id,
      'role': result.rows[0].role,
    }
    if (result.rows[0].role === 'subscriber') {
      res['name'] = result.rows[0].name
      res['surname'] = result.rows[0].surname
      res['insearch'] = result.rows[0].insearch
    } else
    if (result.rows[0].role === 'company') {
      res['cname'] = result.rows[0].company
      res['isagency'] = result.rows[0].isagency
    }
    return res
  }
}

module.exports = {
  checkAuthGetProfile,
  tryInsertAuthToken,
  tryGetLoginData,
  registerFinish,
  tryInsertEmail,
  getJobs,
  getJobById,
  addJobs,
  getOwnJobs
}