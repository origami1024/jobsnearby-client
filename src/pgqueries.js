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

const getJobById = (request, response) => {
  const id = parseInt(request.params.id)
  console.log(id)
  if (isNaN(id)) {response.send('Error: wrong id'); return false}
  pool.query('SELECT * FROM jobs WHERE job_id = $1', [id], (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).send('unknown error')
      return false
      //throw error
    }
    if (results.rows.length === 1) response.status(200).json(results.rows[0])
    else response.status(200).send('entry does not exist')
  })
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
      let que2nd = `SELECT jobs.job_id, jobs.city, jobs.experience, jobs.jobtype, jobs.title, jobs.edu, jobs.currency, jobs.salary_min, jobs.sex, jobs.salary_max, jobs.description, jobs.worktime1, jobs.worktime2, jobs.age1, jobs.age2, jobs.langs, jobs.time_published as published, jobs.time_updated as updated
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
      console.log('r: ', results.rows[0])
      let que2nd = `INSERT INTO "jobs" ("langs", "title", "salary", "worktime1", "worktime2", "age1", "age2", "author_id") VALUES`
      let params2nd = []
      let n = 8
      for (let i = 0; i < req.body.length; i++) {
        que2nd += ` ($${(i * n) + 1}, $${(i * n) + 2}, $${(i * n) + 3}, $${(i * n) + 4}, $${(i * n) + 5}, $${(i * n) + 6}, $${(i * n) + 7}, $${(i * n) + 8}),`
        params2nd = [...params2nd, ...Object.values(req.body[i]), results.rows[0].user_id]
      }
      que2nd = que2nd.substring(0, que2nd.length - 1);
      console.log(que2nd)
      console.log(params2nd)
      pool.query(que2nd, params2nd, (error, results) => {
        if (error) {
          throw error
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