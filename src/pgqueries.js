//postgres config file
const Pool = require('pg').Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgres://postgres:123456@localhost:5433/jobsnearby`
})

const titleRegex = /^[\wа-яА-ЯÇçÄä£ſÑñňÖö$¢Üü¥ÿýŽžŞş\s\-\+\$\%\(\)\№\:\#\/]*$/



const getJobs = (req, res) => {
  let perpage = '25'
  if (req.query.perpage === '50') perpage = '50'
  else if (req.query.perpage === '100') perpage = '100'
  //console.log('cpGetJobs, txt: ', req.query.txt)
  let txt
  if (req.query.txt != undefined && 
      req.query.txt.length > 0 && 
      titleRegex.test(req.query.txt)) {
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

  let city
  if (req.query.city != undefined && 
      req.query.city.length > 0 && 
      /^[\wа-яА-ЯÇçÄä£ſÑñňÖö$¢Üü¥ÿýŽžŞş\s\\-]*$/.test(req.query.city)) {
    city = '%' + req.query.city.toLowerCase() + '%'
  }
  let cityN
  if (city != undefined) {
    if (txt != undefined) cityN = '$3'
    else cityN = '$2'
  }

  let jcat
  if (req.query.jcat && String(req.query.jcat).length < 3 && !isNaN(req.query.jcat)) jcat = req.query.jcat
  
  let exp_line
  if (req.query.exp == '0') exp_line = ` AND jobs.experience = 0`
  else if (req.query.exp == '1-3') exp_line = ` AND jobs.experience BETWEEN 1 AND 3`
  else if (req.query.exp == '3-5') exp_line = ` AND jobs.experience BETWEEN 3 AND 5`
  else if (req.query.exp == '5') exp_line = ` AND jobs.experience > 5`
  else exp_line = ''
  // console.log('exp_line: ', exp_line)
  let sal_line
  if (req.query.sal == '0-1') sal_line = ` AND ((jobs.salary_min BETWEEN 1 AND 1000) OR jobs.salary_max <= 1000)`
  else if (req.query.sal == '1-3') sal_line = ` AND (jobs.salary_min BETWEEN 1000 AND 3000 OR jobs.salary_max BETWEEN 1000 AND 3000)`
  else if (req.query.sal == '3') sal_line = ` AND (jobs.salary_max >= 3000)`
  else sal_line = ''
  console.log('sal_line: ', sal_line)

  let curr_line
  if (req.query.cur == '$') curr_line = ` AND jobs.currency = '$'`
  else if (req.query.cur == 'm') curr_line = ` AND jobs.currency = 'm'`
  else curr_line = ''
  console.log('curr_line: ', curr_line)

  //let que =  `SELECT jobs.author_id, users.company as author, jobs.job_id, jobs.city, jobs.experience, jobs.jobtype, jobs.title, jobs.edu, jobs.currency, jobs.sex, jobs.salary_min, jobs.salary_max, jobs.description, jobs.worktime1, jobs.worktime2, jobs.schedule, jobs.age1, jobs.age2, jobs.langs, jobs.time_published as published, jobs.time_updated as updated, jobs.jobtype, jobs.contact_mail, contact_tel, jcategory
  let que =  `SELECT jobs.author_id, users.company as author, jobs.job_id, jobs.city, jobs.experience, jobs.title, jobs.currency, jobs.salary_min, jobs.salary_max, jobs.description, jobs.time_updated as updated, jobs.contact_mail, contact_tel
              FROM jobs, users
              WHERE jobs.author_id = users.user_id AND
                jobs.is_published = TRUE AND
                jobs.is_closed = FALSE
                ${timerange} 
                ${txt != undefined ? ` AND
                (LOWER(jobs.title) LIKE $2 OR
                LOWER(users.company) LIKE $2 OR
                LOWER(jobs.description) LIKE $2 OR
                LOWER(jobs.city) LIKE $2)` : ''}
                ${city != undefined ? ` AND 
                LOWER(jobs.city) LIKE ${cityN}`: ''}
                ${jcat != undefined ? ` AND jobs.jcategory = ${jcat}`: ''}
                ${exp_line}
                ${sal_line}
                ${curr_line}
              ${sort}
              LIMIT $1 ${'OFFSET ' + offset}`
  //console.log('cp_getJobs2: ', que)
  let qparams = [perpage]
  if (txt) qparams.push(txt)
  if (city) qparams.push(city)
  pool.query(que, qparams, (error, results) => {
    if (error) {
      console.log(error)
      throw error
    }
    qparams[0] = 1
    let countque =  `SELECT count(*) OVER() AS full_count
                    FROM jobs, users
                    WHERE jobs.author_id = users.user_id AND
                      jobs.is_published = TRUE AND
                      jobs.is_closed = FALSE
                      ${timerange} 
                      ${txt != undefined ? ` AND
                      (LOWER(jobs.title) LIKE $2 OR
                      LOWER(users.company) LIKE $2 OR
                      LOWER(jobs.description) LIKE $2 OR
                      LOWER(jobs.city) LIKE $2)` : ''}
                      ${city != undefined ? ` AND 
                      LOWER(jobs.city) LIKE ${cityN}`: ''}
                      ${jcat != undefined ? ` AND jobs.jcategory = ${jcat}`: ''}
                      ${exp_line}
                      ${sal_line}
                      ${curr_line}
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
async function hitJobById (job_id, ip) {
  let que = `UPDATE jobs SET "hits_log" = array_append("hits_log", $1) WHERE job_id = $2`
  let params = [ip, job_id]
  pool.query(que, params, (error, results1) => {
    if (error) {
      console.log('hitJobById Error: ', error)
    } else console.log('job hit')
  })
}

async function reopenJobById(req, res) {
  const jid = parseInt(req.query.jid)
  if (isNaN(jid) || jid < 0 || String(jid).length > 10) {
    console.log('Error: wrong id')
    res.status(400).send('Неправильный id вакансии.')
    return false
  }
  if (req.cookies.session && req.cookies.session.length > 50) {
    //console.log('cpsrv', jid)
    let que1st = `SELECT user_id, email FROM "users" WHERE "auth_cookie" = $1 and role = 'company'`
    let params1st = [req.cookies.session]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        console.log(error)
        res.send('step2')
        //throw error
        return false
      }
      if (results.rows.length < 1) {
        console.log('reopenJobById err1')
        //Если юзера с таким куки не найдено, то выходим из функции прост
        res.send('step3')
        return false
      }
      let que2nd = `UPDATE jobs SET (is_closed, time_updated) = (FALSE, NOW()) WHERE (author_id = $1 AND job_id = $2)`
      //console.log(que2nd)
      let params2nd = [results.rows[0].user_id, jid]
      pool.query(que2nd, params2nd, (error2, results2) => {
        if (error2) {
          console.log('reopenJobById Error2: ', error2)
          res.status(400).send('error22')
          return false
        }
        res.status(200).send('OK')
        //Добавление логов
        addLog('Вакансия открыта', 'Айди вакансии: ' + jid, results.rows[0].user_id, results.rows[0].email)
      })

    })
  } else {res.send('wrong userinfo(reopenJobById)')}
}


async function closeJobByIdAdmin(req, res) {
  const closed_why = req.body.closed_why
  const jid = parseInt(req.body.jid)
  console.log(closed_why, jid)
  if (isNaN(jid) || jid < 0 || String(jid).length > 10) {
    console.log('Error: wrong id')
    res.status(400).send('Неправильный id вакансии.')
    return false
  }
  if (closed_why.length > 500) closed_why = closed_why.substring(0,499)
  if (req.cookies.sessioa && req.cookies.sessioa.length > 50 && req.cookies.user2) {
    //console.log('cpsrv', jid)
    let que1st = `SELECT u2id FROM "users2" WHERE "u2coo" = $1 AND u2mail = $2`
    let params1st = [req.cookies.sessioa, req.cookies.user2]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        console.log(error)
        //res.send('step2')
        //throw error
        return false
      }
      if (Boolean(results) == false || results.rows.length < 1) {
        console.log('no cookie found')
        //Если юзера с таким куки не найдено, то выходим из функции прост
        res.send('step3')
        return false
      }
      console.log('closejob2 cp1')
      //по айди
      //если есть в базе и автор сам удаляющий
      //удалить
      let que2nd = `UPDATE jobs SET (is_published, is_closed, time_updated, closed_why) = (FALSE, TRUE, NOW(), $1) WHERE job_id = $2`
      //console.log(que2nd)
      let params2nd = [closed_why, jid]
      pool.query(que2nd, params2nd, (error2, results2) => {
        if (error2) {
          console.log('closeJobById2 Error2: ', error2)
          res.status(400).send('error22')
          return false
        }
        res.status(200).send('OK')
        //Добавление логов
        addLog('Вакансия закрыта(A)', 'Id вакансии: ' + jid, results.rows[0].u2id, '(Модератор) ' + req.cookies.user2)
        //res.send(results2.rows)
      })

    })
  } else {res.send('wrong userinfo(closeJBIA)')}
}


async function approveJobByIdAdmin(req, res) {
  const jid = parseInt(req.body.jid)
  if (isNaN(jid) || jid < 0 || String(jid).length > 10) {
    console.log('Error: wrong id')
    res.status(400).send('Неправильный id вакансии.')
    return false
  }
  if (req.cookies.sessioa && req.cookies.sessioa.length > 50 && req.cookies.user2) {
    let que1st = `SELECT u2id FROM "users2" WHERE "u2coo" = $1 AND "u2mail" = $2`
    let params1st = [req.cookies.sessioa, req.cookies.user2]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        console.log(error)
        res.send('step2')
        //throw error
        return false
      }
      if (results.rows.length < 1) {
        console.log('no cookie found')
        //Если юзера с таким куки не найдено, то выходим из функции прост
        res.send('step3')
        return false
      }
      
      //по айди
      //если есть в базе и автор сам удаляющий
      //удалить
      
      let que2nd = `UPDATE jobs SET (is_published, time_updated, closed_why) = (TRUE, NOW(), '') WHERE job_id = $1`
      let params2nd = [jid]
      pool.query(que2nd, params2nd, (error2, results2) => {
        if (error2) {
          console.log('approveJobByIdAdmin Error2: ', error2)
          res.status(400).send('error222')
          return false
        }
        res.status(200).send('OK')
        addLog('Вакансия одобрена(A)', 'Id вакансии: ' + jid, results.rows[0].u2id, '(Модератор) ' + req.cookies.user2)
      })

    })
  } else {res.send('wrong userinfo(approveJBIA)')}
}

async function deleteJobByIdAdmin(req, res) {
  const jid = parseInt(req.body.jid)
  //проверить жоб айди формально
  
  if (isNaN(jid) || jid < 0 || String(jid).length > 10) {
    console.log('Error: wrong id')
    res.status(400).send('Неправильный id вакансии.')
    return false
  }

  if (req.cookies.sessioa && req.cookies.sessioa.length > 50 && req.cookies.user2) {
    //console.log('cpsrv', jid)
    let que1st = `SELECT u2id FROM "users2" WHERE "u2coo" = $1 AND "u2mail" = $2`
    let params1st = [req.cookies.sessioa, req.cookies.user2]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        console.log(error)
        res.send('step2')
        //throw error
        return false
      }
      if (results.rows.length < 1) {
        console.log('no cookie found')
        //Если юзера с таким куки не найдено, то выходим из функции прост
        res.send('step3')
        return false
      }
      
      //по айди
      //если есть в базе и автор сам удаляющий
      //удалить
      
      let que2nd = `DELETE FROM jobs WHERE job_id = $1`
      let params2nd = [jid]
      pool.query(que2nd, params2nd, (error2, results2) => {
        if (error2) {
          console.log('deleteJobByIdAdmin Error2: ', error2)
          res.status(400).send('error222')
          return false
        }
        res.status(200).send('OK')
        addLog('Вакансия удалена(A)', 'Id вакансии: ' + jid, results.rows[0].u2id, '(Модератор) ' + req.cookies.user2)
      })

    })
  } else {res.send('wrong userinfo(deleteJBIA)')}
}

async function closeJobById(req, res) {
  const jid = parseInt(req.query.jid)
  if (isNaN(jid) || jid < 0 || String(jid).length > 10) {
    console.log('Error: wrong id')
    res.status(400).send('Неправильный id вакансии.')
    return false
  }
  if (req.cookies.session && req.cookies.session.length > 50) {
    //console.log('cpsrv', jid)
    let que1st = `SELECT user_id, email FROM "users" WHERE "auth_cookie" = $1 and role = 'company'`
    let params1st = [req.cookies.session]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        console.log(error)
        res.send('step2')
        //throw error
        return false
      }
      if (results.rows.length < 1) {
        console.log('no cookie found')
        //Если юзера с таким куки не найдено, то выходим из функции прост
        res.send('step3')
        return false
      }
      console.log('closejob cp1')
      //по айди
      //если есть в базе и автор сам удаляющий
      //удалить
      let que2nd = `UPDATE jobs SET (is_closed, time_updated) = (TRUE, NOW()) WHERE (author_id = $1 AND job_id = $2)`
      //console.log(que2nd)
      let params2nd = [results.rows[0].user_id, jid]
      pool.query(que2nd, params2nd, (error2, results2) => {
        if (error2) {
          console.log('closeJobById Error2: ', error2)
          res.status(400).send('error22')
          return false
        }
        res.status(200).send('OK')
        //Добавление логов
        addLog('Вакансия закрыта', 'Айди вакансии: ' + jid, results.rows[0].user_id, results.rows[0].email)
        //res.send(results2.rows)
      })

    })
  } else {res.send('wrong userinfo(closeJBI)')}
}

async function deleteJobById(req, res) {
  const jid = parseInt(req.query.jid)
  //проверить жоб айди формально
  
  if (isNaN(jid) || jid < 0 || String(jid).length > 10) {
    console.log('Error: wrong id')
    res.status(400).send('Неправильный id вакансии.')
    return false
  }

  if (req.cookies.session && req.cookies.session.length > 50) {
    //console.log('cpsrv', jid)
    let que1st = `SELECT user_id, email FROM "users" WHERE "auth_cookie" = $1`
    let params1st = [req.cookies.session]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        console.log(error)
        res.send('step2')
        //throw error
        return false
      }
      if (results.rows.length < 1) {
        console.log('no cookie found')
        //Если юзера с таким куки не найдено, то выходим из функции прост
        res.send('step3')
        return false
      }
      
      //по айди
      //если есть в базе и автор сам удаляющий
      //удалить
      console.log('no cookie fo: ', )
      let que2nd = `DELETE FROM jobs where (author_id = $1 AND job_id = $2)`
      //console.log(que2nd)
      let params2nd = [results.rows[0].user_id, jid]
      pool.query(que2nd, params2nd, (error2, results2) => {
        if (error2) {
          console.log('deleteJobById Error2: ', error2)
          res.status(400).send('error22')
          return false
        }
        res.status(200).send('OK')
        addLog('Вакансия удалена', 'Айди вакансии: ' + jid, results.rows[0].user_id, results.rows[0].email)
      })

    })
  } else {res.send('wrong userinfo(deleteJBI)')}
}

async function getJobById (id) {
  //id is PRECHECKED!
  //const id = parseInt(request.params.id)
  // let que = `SELECT * FROM (SELECT jobs.author_id, users.company as author, jobs.job_id, jobs.city, jobs.experience, jobs.jobtype, jobs.title, jobs.edu, jobs.currency, jobs.sex, jobs.salary_min, jobs.salary_max, jobs.description, jobs.worktime1, jobs.worktime2, jobs.age1, jobs.age2, jobs.langs, jobs.time_published as published, jobs.time_updated as updated, cardinality(jobs.hits_log) as hits_all, jobs.hits_log
  //           FROM jobs, users
  //           WHERE jobs.author_id = users.user_id AND jobs.job_id = $1) a,
  //           (SELECT COUNT(*) FROM (SELECT DISTINCT hits_log FROM jobs WHERE job_id = $1) as ff) b`
  //'SELECT * FROM jobs WHERE job_id = $1'

  
  let que = `SELECT * FROM (SELECT jobs.author_id, users.company as author, users.logo_url, jobs.job_id, jobs.city, jobs.experience, jobs.jobtype, jobs.title, jobs.edu, jobs.currency, jobs.sex, jobs.salary_min, jobs.salary_max, jobs.description, jobs.worktime1, jobs.worktime2, jobs.schedule, jobs.age1, jobs.age2, jobs.langs, jobs.time_published as published, jobs.time_updated as updated, contact_mail, contact_tel, cardinality(jobs.hits_log) as hits_all, jobs.is_closed, jobs.closed_why, jobs.jcategory, jobs.is_published
            FROM jobs, users
            WHERE jobs.author_id = users.user_id AND jobs.job_id = $1) a,
            (select count(distinct hits_log1) as hits_uniq
            from (
                select unnest(hits_log) as hits_log1
                from jobs
              WHERE job_id = $1
            ) as ss) b`

  let result = await pool.query(que, [id]).catch(error => {
    console.log(error)
    throw new Error('job by id error')
  })
  //console.log(result.rows)
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
      if (results.rows.length < 1) {
        //Если юзера с таким куки не найдено, то выходим из функции прост
        res.send('step3')
        return false
      }
      //after cookies check, get the actual data from db

      //array_length(array_agg(distinct jobs.hits_log)) as hits_uniq
      let que2nd = `SELECT jobs.job_id, jobs.city, jobs.experience, jobs.jobtype, jobs.title, jobs.edu, jobs.currency, jobs.salary_min, jobs.salary_max, jobs.sex, jobs.description, jobs.worktime1, jobs.worktime2, jobs.age1, jobs.age2, jobs.langs, jobs.time_published as published, jobs.time_updated as updated, jobs.contact_tel, jobs.contact_mail, cardinality(jobs.hits_log) as hits_all, (select count(distinct a) from unnest(jobs.hits_log) as a) as hits_uniq, jobs.is_closed, jobs.closed_why, jobs.jcategory, jobs.is_published
      FROM jobs
      WHERE jobs.author_id = $1
      GROUP BY jobs.job_id
      ORDER BY (jobs.time_updated, jobs.job_id) DESC
      `
      // let que2nd = `SELECT * FROM (SELECT jobs.job_id, jobs.city, jobs.experience, jobs.jobtype, jobs.title, jobs.edu, jobs.currency, jobs.salary_min, jobs.salary_max, jobs.sex, jobs.description, jobs.worktime1, jobs.worktime2, jobs.schedule, jobs.age1, jobs.age2, jobs.langs, jobs.time_published as published, jobs.time_updated as updated, jobs.contact_tel, jobs.contact_mail, cardinality(jobs.hits_log) as hits_all
      //   FROM jobs
      //   WHERE jobs.author_id = $1
      //   ORDER BY (jobs.time_updated, jobs.job_id) DESC) a,
      //   (select count(distinct hits_log1) as hits_uniq
      //   from (
      //     select unnest(hits_log) as hits_log1
      //     from jobs
      //     WHERE jobs.author_id = $1
      //     ORDER BY (jobs.time_updated, jobs.job_id) DESC) as ss
      //     GROUP BY ss.job_id) b
      //   `
        //TODO: paginate this too

            // `SELECT jobs.job_id, jobs.city, jobs.experience, jobs.jobtype, jobs.title, jobs.edu, jobs.currency, jobs.salary_min, jobs.salary_max, jobs.sex, jobs.description, jobs.worktime1, jobs.worktime2, jobs.age1, jobs.age2, jobs.langs, jobs.time_published as published, jobs.time_updated as updated, jobs.contact_tel, jobs.contact_mail
            // FROM jobs
            // WHERE jobs.author_id = $1
            // ORDER BY (jobs.time_updated, jobs.job_id) DESC`
            
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
  } else {res.send('logout, wrong userinfo')}
}


async function getFavedFull (req, res) {
  if (req.cookies.session && req.cookies.session.length > 50) {
    let que1st = `SELECT user_id, "likedJobs" FROM "users" WHERE "auth_cookie" = ($1)`
    let params1st = [req.cookies.session]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        console.log(error)
        res.send('step2')
        //throw error
        return false
      }
      if (results.rows.length < 1) {
        //Если юзера с таким куки не найдено, то выходим из функции прост
        res.send('step3')
        return false
      }
      //res.send(results.rows[0])
      let que2nd = `SELECT jobs.author_id, users.company as author, jobs.job_id, jobs.city, jobs.experience, jobs.jobtype, jobs.title, jobs.edu, jobs.currency, jobs.sex, jobs.salary_min, jobs.salary_max, jobs.description, jobs.worktime1, jobs.worktime2, jobs.schedule, jobs.age1, jobs.age2, jobs.langs, jobs.time_published as published, jobs.time_updated as updated
                    FROM jobs, users
                    WHERE jobs.author_id = users.user_id AND
                          jobs.job_id = ANY($1)
                    ORDER BY (jobs.time_updated, jobs.job_id) DESC`
      //console.log(que2nd)
      let params2nd = [results.rows[0].likedJobs]
      pool.query(que2nd, params2nd, (error2, results2) => {
        if (error2) {
          console.log('getFavedFull Error2: ', error2)
          res.status(400).send('OK')
          return false
        }
        //res.status(200).send('OK')
        res.send(results2.rows)
      })

    })
  } else {res.send('wrong userinfo(full)')}
}

async function getFaved (req, res) {
  console.log('cpGetFaved: ', req.cookies)
  if (req.cookies.session && req.cookies.session.length > 50) {
    let que1st = `SELECT user_id, "likedJobs" FROM "users" WHERE "auth_cookie" = ($1)`
    let params1st = [req.cookies.session]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        console.log(error)
        res.send('step2')
        //throw error
        return false
      }
      if (results.rows.length < 1) {
        //Если юзера с таким куки не найдено, то выходим из функции прост
        res.send('step3')
        return false
      }
      res.send(results.rows[0].likedJobs)

    })
  } else {res.send('wrong userinfo1')}
}

async function delFavOne (req, res) {
  let jid = req.query.jid
  if (isNaN(jid) == false && Number.isInteger(Number(jid)) && jid > 0 && req.cookies.session && req.cookies.session.length > 50) {
    let que1st = `SELECT user_id FROM "users" WHERE "auth_cookie" = ($1)`
    let params1st = [req.cookies.session]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        res.send('step2')
        console.log('delFavOne Error: ', error)
      }
      if (results.rows.length < 1) {
        //Если юзера с таким куки не найдено, то выходим из функции прост
        res.send('step3')
        return false
      }
      //we are here if auth is ok
      let que2nd = `UPDATE users SET "likedJobs" = array_remove("likedJobs", $1) WHERE user_id = $2`
      //console.log(que2nd)
      let params2nd = [jid, results.rows[0].user_id]
      pool.query(que2nd, params2nd, (error2, results2) => {
        if (error2) {
          console.log('delFavOne Error2: ', error2)
        }
        res.status(200).send('OK')
      })
      
    })
  } else res.send('wrong job id')
}
async function favOne (req, res) {
  let jid = req.query.jid
  if (isNaN(jid) == false && Number.isInteger(Number(jid)) && jid > 0 && req.cookies.session && req.cookies.session.length > 50) {
    let que1st = `SELECT user_id FROM "users" WHERE "auth_cookie" = ($1)`
    let params1st = [req.cookies.session]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        res.send('step2')
        console.log('favOne Error: ', error)
      }
      if (results.rows.length < 1) {
        //Если юзера с таким куки не найдено, то выходим из функции прост
        res.send('step3')
        return false
      }
      //we are here if auth is ok
      let que2nd = `UPDATE users SET "likedJobs" = array_append ("likedJobs", $1) WHERE user_id = $2 AND $1 != ALL("likedJobs")`
      //console.log(que2nd)
      let params2nd = [jid, results.rows[0].user_id]
      pool.query(que2nd, params2nd, (error2, results2) => {
        if (error2) {
          console.log('favOne Error2: ', error2)
        }
        res.status(200).send('OK')
      })
      
    })
  } else res.status(400).send('wrong job id')
}


async function updateJob (req, res) {
  if (req.cookies.session && req.cookies.session.length > 50) {
    let que1st = `SELECT user_id, email FROM "users" WHERE "auth_cookie" = ($1)`
    let params1st = [req.cookies.session]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        res.send('step2')
        console.log('addJobs Error: ', error)
      }
      if (results.rows.length < 1) {
        //Если юзера с таким куки не найдено, то выходим из функции прост
        res.send('step3')
        return false
      }

      let jid = req.body.job_id
      if (isNaN(jid) != false || !Number.isInteger(Number(jid)) || jid < 0) {
        res.send('wrong job id: ' + jid)
        console.log('cp34: ', jid)
        return false
      }
      let parsedData = validateOneJob(req.body)
      if (parsedData == false) {res.send('error, not passing validation')}
      console.log('editing, exp: ', parsedData.experience)
      //parsedData.author_id = results.rows[0].user_id - NO NEED TO UPDATE THIS FIELD
      //`UPDATE "users" SET auth_cookie = $1, last_logged_in = NOW() where user_id = $2`
      //console.log('cp7yyu: ', parsedData.jcategory)
      let que2nd = `UPDATE "jobs" SET ("time_updated", "title", "salary_max", "salary_min", "currency", "age1", "age2", "worktime1", "worktime2", "schedule", "langs", "edu", "experience", "city", "jobtype", "description", "contact_tel", "contact_mail", "jcategory") =
                    (NOW(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
                    WHERE author_id = $19 AND job_id = $20
                    RETURNING job_id, title`
      let params2nd = [parsedData.title, parsedData.salary_max, parsedData.salary_min, parsedData.currency, parsedData.age1, parsedData.age2, parsedData.worktime1, parsedData.worktime2, parsedData.schedule, parsedData.langs, parsedData.edu, parsedData.experience, parsedData.city, parsedData.jobtype, parsedData.description, parsedData.contact_tel, parsedData.contact_mail, parsedData.jcategory, results.rows[0].user_id, jid]

      pool.query(que2nd, params2nd, (error2, results2) => {
        if (error2) {
          console.log('updateJob, err2: ', error2)
          res.send('error')
          return false
        }
        if (results2.rows.length > 0) {
          //Добавление логов
          addLog('Вакансия изменена', parsedData.title, results.rows[0].user_id, results.rows[0].email)
          res.send({...results2.rows[0], 'result': 'OK'})
        } else res.send('error unkn')
      })
    })
  } else {res.send('auth fail edit')}
}

//Добавить лог
async function addLog (action, body, author_id, author_mail) {
  //time, action, body, author_id, author_name
  let que = `
    INSERT INTO "logs" (time, action, body, author_id, author_mail) VALUES
    (NOW(), $1, $2, $3, $4)`
  let params = [action, body, author_id, author_mail]
  let result1 = await pool.query(que, params).catch(error => {
    console.log('cp addLog err: ', error)
    //throw new Error('job by id error')
    return undefined
  })
  //console.log('cpc p2: ', result1)
  return Boolean(result1)
}

async function addOneJob (req, res) {
  //
  if (req.cookies.session && req.cookies.session.length > 50) {
    //console.log(req.body)
    let que1st = `SELECT user_id, email FROM "users" WHERE "auth_cookie" = ($1)`
    let params1st = [req.cookies.session]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        res.send('step2')
        console.log('addJob Error: ', error)
      }
      if (results.rows.length < 1) {
        //Если юзера с таким куки не найдено, то выходим из функции прост
        res.send('step3')
        return false
      }

      //que2 go
      //console.log('addOneJob cp2: ', req.body)
      let parsedData = validateOneJob(req.body)
      if (parsedData == false) {res.send('error, not passing validation')}
      //author_id - проверка не нужна
      parsedData.author_id = results.rows[0].user_id
      //console.log('addOneJob cp2: ', parsedData)
      let que2nd = `INSERT INTO "jobs" ("title", "salary_max", "salary_min", "currency", "age1", "age2", "worktime1", "worktime2", "schedule", "langs", "edu", "experience", "city", "jobtype", "description", "author_id", "contact_tel", "contact_mail", "jcategory") VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
                    RETURNING job_id, title`
      let params2nd = [parsedData.title, parsedData.salary_max, parsedData.salary_min, parsedData.currency, parsedData.age1, parsedData.age2, parsedData.worktime1, parsedData.worktime2, parsedData.schedule, parsedData.langs, parsedData.edu, parsedData.experience, parsedData.city, parsedData.jobtype, parsedData.description, parsedData.author_id, parsedData.contact_tel, parsedData.contact_mail, parsedData.jcategory]
      
      pool.query(que2nd, params2nd, (error2, results2) => {
        if (error2) {
          console.log('send1Job, err2: ', error2)
          res.send('error')
          return false
        }
        if (results2.rows.length > 0) {
          //Добавление логов
          addLog('Вакансия добавлена', parsedData.title, parsedData.author_id, results.rows[0].email)
          res.send({...results2.rows[0], 'result': 'OK'})
        } else res.send('error unkn')
        
        
      })
    })

  } else {res.send('auth fail')}
}



function validateOneJob (data) {
  let parsedData = {}
  //title - обязат поле, без него вакансия пропускается; длина от 2 до 75 символов
  if (data.title && data.title.length > 1 && data.title.length < 76 && titleRegex.test(data.title)) {
    parsedData.title = data.title
  } else return false//{ iSkipped += 1; continue}
  //salary_max - необязат, целое число
  console.log(data.salary_min)
  console.log(data.salary_max)
  if (data.salary_max && isNaN(data.salary_max) === false && data.salary_max > -1 && Number.isInteger(Number(data.salary_max))) {
    if (String(data.salary_max).length > 5) data.salary_max = String(data.salary_max).substring(0,5)
    parsedData.salary_max = Number(data.salary_max)
  } else parsedData.salary_max = 0
  //salary_min - необязат, целое число
  if (data.salary_min && isNaN(data.salary_min) === false && data.salary_min > -1 && Number.isInteger(Number(data.salary_min))) {
    if (String(data.salary_min).length > 5) data.salary_min = String(data.salary_min).substring(0,5)
    parsedData.salary_min = Number(data.salary_min)
  } else parsedData.salary_min = 0
  //если указана min но не указана max, то добавить max
  if (parsedData.salary_max == 0 && parsedData.salary_min > 0) parsedData.salary_max = parsedData.salary_min
  if (parsedData.salary_max < parsedData.salary_min) parsedData.salary_max = parsedData.salary_min
  //валюта - необязат, [m, $, р, e], по умолчанию m
  if (data.currency && (data.currency === '$' || data.currency === 'm' || data.currency === 'р' || data.currency === 'e')) {
    parsedData.currency = data.currency
  } else parsedData.currency = 'm'

  // //пол - необязат, [m, w или пропуск]
  // if (data.sex && (data.sex === 'm' || data.sex === 'w')) {
  //   parsedData.sex = data.sex
  // } else parsedData.sex = ''
  //возр от - необязат, целое число
  if (data.age1 && isNaN(data.age1) === false && Number(data.age1) > 0 && Number(data.age1) < 250 && Number.isInteger(Number(data.age1))) {
    parsedData.age1 = Number(data.age1)
    if (parsedData.age1 < 18) parsedData.age1 = 18
  } else parsedData.age1 = 0
  //возр до - необязат, целое число
  if (data.age2 && isNaN(data.age2) === false && data.age2 > 0 && data.age2 < 250 && Number.isInteger(Number(data.age2))) {
    parsedData.age2 = Number(data.age2)
    if (parsedData.age2 < 18) parsedData.age2 = 18
  } else parsedData.age2 = 0
  //возр проверки
  // if (parsedData.age1 > 0 && parsedData.age1 > parsedData.age2) {
  //   parsedData.age2 = parsedData.age1
  //   parsedData.age1 = 0
  // }
  if (parsedData.age2 == 18) {
    parsedData.age1 = 18
    parsedData.age2 = 0
  }
  //время от - необязат
  if (data.worktime1 && isNaN(data.worktime1) === false && data.worktime1 > -1 && data.worktime1 < 25) {
    parsedData.worktime1 = data.worktime1
  } else parsedData.worktime1 = ''
  //время до - необязат
  if (data.worktime2 && isNaN(data.worktime2) === false && data.worktime2 > -1 && data.worktime2 < 25) {
    parsedData.worktime2 = data.worktime2
  } else parsedData.worktime2 = ''
  //режим
  if (data.schedule && data.schedule.length > 0 && data.schedule.length < 11) {
    parsedData.schedule = data.schedule
  } else parsedData.schedule = ''
  //языки - обязательно массив, длина каждого языка - 50, макс кол-во языков - 3
  if (data.langs && Array.isArray(data.langs) && data.langs.length < 4) {
    let langsFiltered = data.langs.filter(lang => lang.length < 51)
    parsedData.langs = langsFiltered
  } else parsedData.langs = []
  //edu - необязат, от 2х символов до 20
  if (data.edu && data.edu.length > 1 && data.edu.length < 21) {
    parsedData.edu = data.edu
  } else parsedData.edu = ''
  //experience - стаж в годах, дробное число от 0 до 250
  //console.log('expcheck cp: ', data.experience)
  if (data.experience != undefined && isNaN(data.experience) === false && data.experience >= -1 && data.experience < 250) {
    parsedData.experience = Number(data.experience)
  } else parsedData.experience = -1 //не указано = -1, без опыта = 0
  //jcategory - стаж в годах, дробное число от 0 до 250
  //console.log('cp67yy1: ', data)
  if (data.jcategory != undefined && isNaN(data.jcategory) === false && data.jcategory >= 0 && data.jcategory < 100) {
    parsedData.jcategory = Math.round(Number(data.jcategory))
  } else parsedData.jcategory = 0 //без категории = 0
  //city - необязат, от 2х символов до 100
  if (data.city && data.city.length > 1 && data.city.length < 101) {
    parsedData.city = data.city
  } else parsedData.city = ''
  //jobtype - постоянная, временная или пусто
  if (data.jtype && data.jtype == 'c') parsedData.jobtype = 'c'
  else if (data.jtype && data.jtype == 'v') parsedData.jobtype = 'v'
  else parsedData.jobtype = ''
  //description - необязат, от 2х символов до 500
  if (data.description && data.description.length > 1 && data.description.length < 2001) {
    parsedData.description = data.description
  } else parsedData.description = ''
  //"contact_tel", "contact_mail", 
  //contact_tel - не обязат на самом деле; длина до 15 символов
  data.contact_tel = String(data.contact_tel).trim()
  //console.log('cp10: ', data.contact_tel)
  if (data.contact_tel && data.contact_tel.length < 16 && /^[\+0-9\-\(\)]*$/.test(data.contact_tel)) {
    parsedData.contact_tel = data.contact_tel
  } else parsedData.contact_tel = ''
  //console.log('cp11: ', parsedData.contact_tel)
  //contact_mail - не обязат на самом деле; длина до 40 символов
  if (data.contact_mail && data.contact_mail.length < 41 && /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(data.contact_mail)) {
    parsedData.contact_mail = data.contact_mail
  } else parsedData.contact_mail = ''

  //console.log('validationcp1: ', parsedData)
  return parsedData
}


async function addJobs (req, res) {
  //console.log(req.cookies)
  if (req.cookies.session && req.cookies.session.length > 50) {
    //console.log(req.body)
    let que1st = `SELECT user_id, email FROM "users" WHERE "auth_cookie" = ($1)`
    let params1st = [req.cookies.session]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        res.send('step2')
        console.log('addJobs Error: ', error)
      }
      if (results.rows.length < 1) {
        //Если юзера с таким куки не найдено, то выходим из функции прост
        res.send('step3')
        return false
      }
      
      //console.log('cp19: ', results)
      //console.log('r: ', req.body[0])
      //console.log('r: ', Array.isArray(req.body[0].langs))
      let que2nd = `INSERT INTO "jobs" ("title", "salary_max", "salary_min", "currency", "age1", "age2", "worktime1", "worktime2", "schedule", "langs", "edu", "experience", "jcategory", "city", "jobtype", "description", "contact_tel", "contact_mail", "author_id") VALUES`
      let params2nd = []
      let n = 19
      let iSkipped = 0
      let processedlength = Math.min(req.body.length, 15)
      for (let i = 0; i < processedlength; i++) {//Math.min - максимум 15
        let parsedData = validateOneJob(req.body[i])
        if (parsedData == false) { iSkipped += 1; continue}
        //author_id - проверка не нужна
        parsedData.author_id = results.rows[0].user_id
        let j = i - iSkipped
        que2nd += ` ($${(j * n) + 1}, $${(j * n) + 2}, $${(j * n) + 3}, $${(j * n) + 4}, $${(j * n) + 5}, $${(j * n) + 6}, $${(j * n) + 7}, $${(j * n) + 8}, $${(j * n) + 9}, $${(j * n) + 10}, $${(j * n) + 11}, $${(j * n) + 12}, $${(j * n) + 13}, $${(j * n) + 14}, $${(j * n) + 15}, $${(j * n) + 16}, $${(j * n) + 17}, $${(j * n) + 18}, $${(j * n) + 19}),`
        params2nd = [
          ...params2nd,
          ...Object.values(parsedData)
        ]
      }
      que2nd = que2nd.substring(0, que2nd.length - 1);
      console.log(que2nd)
      console.log(params2nd)
      pool.query(que2nd, params2nd, (error2, results2) => {
        if (error2) {
          console.log('addJobs err2', error2)
        }
        res.send('OK')
        //Добавление логов
        addLog('Вакансии добавлены(n)', 'Добавлено ' + processedlength, results.rows[0].user_id, results.rows[0].email)
      })
    })
    
  } else {res.send('step1'); console.log('a trespasser is trying to send xls')}
}

async function tryGetLoginData (mail) {
  let que = `SELECT pwhash, user_id, role, name, surname, insearch, company, isagency, cvurl, is_active, block_reason FROM "users" WHERE "email" = ($1)`
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
      //res['likedJobs'] = result.rows[0].likedJobs
      res['cvurl'] = result.rows[0].cvurl
    } else
    if (result.rows[0].role === 'company') {
      res['cname'] = result.rows[0].company
      res['isagency'] = result.rows[0].isagency
    }
    res['is_active'] = result.rows[0].is_active
    res['block_reason'] = result.rows[0].block_reason
    //console.log('cp31rr3: ', res)
    return res
  }
  //return {'pwHash': result.rows[0].pwhash, 'userId': result.rows[0].user_id, 'role': result.rows[0].role}
}

async function tryInsertEmailAdmin (mail) {
  let que = `INSERT INTO "users2" ("u2mail") VALUES ($1) RETURNING u2id`
  let params = [mail]
  let result
  try {
    result = await pool.query(que, params)
  } catch(e) {
    throw new Error('email2 exists already')
  }
  //console.log('tryingInsert in the end: ', result.rows[0])
  return result.rows[0].u2id
}
async function registerFinishAdmin (id, mail, hash, note) {
  
  let que = `
    UPDATE "users2"
    SET (u2hash, category_rights, supernote) = ($1, '111', $4)
    WHERE u2id = $2 AND u2mail = $3
  `
  let params = [hash, id, mail, note]
  let result = await pool.query(que, params).catch(error => {
    console.log('cp iii: ', error)
    throw new Error('user update fail')
  })
  return true
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
  if (usertype === 'company' && (arg2 != true && arg2 != 'true')) arg2 = false
  if (usertype === 'subscriber') insert = `, name = $4, surname = $5`
  else if (usertype === 'company') insert = `, company = $4, isagency = $5`
  let que = `UPDATE "users" SET pwhash = $1, role = $3${insert} where user_id = $2 RETURNING email`
  console.log(que, '///', arg2)
  let params = [hash, id, usertype, arg1, arg2]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)
    throw new Error('user update fail')
  })
  //Добавление логов
  addLog('Регистрация пользователя', usertype === 'company' ? 'Компания ' + arg1 : 'Соискатель ' + arg1 + ' ' + arg2, id, result.rows[0].email)
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
  //console.log(result)
  return true
}
async function checkAuthGetProfile(token) {
  let que = `SELECT email, user_id, role, name, surname, insearch, company, isagency, cvurl, is_active FROM "users" WHERE "auth_cookie" = ($1)`
  let params = [token]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)
    throw new Error('auth check failed')
  })
  //console.log('cp10: ', result.rows[0])
  if (result.rowCount !== 1) return false
  if (result.rows[0].is_active == false) return false
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
      //res['likedJobs'] = result.rows[0].likedJobs
      res['cvurl'] = result.rows[0].cvurl
    } else
    if (result.rows[0].role === 'company') {
      res['cname'] = result.rows[0].company
      res['isagency'] = result.rows[0].isagency
    }
    return res
  }
}


async function updateUserData(user_id, udata) {
  //its prechecked for validity and existence
  let que = `
    UPDATE "users" SET ("name", "surname") =
    ($1, $2)
    WHERE user_id = $3
  `
  let params = [udata.name, udata.surname, user_id]
  let result = await pool.query(que, params).catch(error => {
    console.log('cp updDiapers err: ', error)
    return false
  })
  //res.send('OK')
  return result
}

async function authedForUserData(session, usertype) {
  let que1st = `SELECT user_id FROM "users" WHERE "auth_cookie" = $1 AND "role" = $2`
  let params1st = [session, usertype]
  //return user_id
  let result1 = await pool.query(que1st, params1st).catch(error => {
    console.log('cp authedForUserData err: ', error)
    //throw new Error('job by id error')
  })
  //console.log('cpc p2: ', result1)
  if (result1.rows && result1.rows.length == 1) return result1.rows[0].user_id
  else return false
}

async function checkIfUserAuthed(session) {
  let que1st = `SELECT user_id FROM "users" WHERE "auth_cookie" = ($1)`
  let params1st = [session]
  let result1 = await pool.query(que1st, params1st).catch(error => {
    console.log('cp checkIfUserAu err: ', error)
    //throw new Error('job by id error')
  })
  //console.log('cpc p2: ', result1)
  if (result1.rows && result1.rows.length == 1) return result1.rows[0].user_id
  else return false
}

async function getOneCompanyBroad(uid) {

  let que = `
    SELECT company, logo_url, domains, website, full_description, users.time_created, count(*) as jobs_count
    FROM users JOIN jobs ON (jobs.author_id = users.user_id)
    WHERE users.user_id = $1 AND users.role = 'company'
    GROUP BY users.user_id
  `
  let result = await pool.query(que, [uid]).catch(error => {
    console.log('cp getonecompanyBroad err: ', error)
    //throw new Error('job by id error')
  })
  //console.log(result.rows)
  if (result.rows && result.rows.length === 1) return result.rows[0]
  else return false
}
async function getOneCompany(uid) {
  //uid - is prechecked user_id
  //check auth and if its a company
  let que = `
    SELECT company, logo_url, domains, website, full_description
    FROM users
    WHERE user_id = $1 AND role = 'company'
  `
  let result = await pool.query(que, [uid]).catch(error => {
    console.log('cp getonecompany err: ', error)
    //throw new Error('job by id error')
  })
  //console.log(result.rows)
  if (result.rows && result.rows.length === 1) return result.rows[0]
  else return false
}


async function updateOneCompanyPic(req, res) {
  //app.post('/companyUpdate.json', db.updateOneCompany)
  if (req.cookies.session && req.cookies.session.length > 50) {
    let que1st = `SELECT user_id, company, logo_url, role FROM "users" WHERE "auth_cookie" = ($1)`
    let params1st = [req.cookies.session]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        res.send('step2')
        console.log('updateOneCompanyPic Error: ', error)
        return false
      }
      if (results.rows.length < 1) {
        //Если юзера с таким куки не найдено, то выходим из функции прост
        res.send('step3')
        return false
      }
      if (results.rows[0].role != 'company') {
        res.send('step3')
        return false
      }

      let uid = results.rows[0].user_id
      
      let logo_url = ''
      //VALIDATE SHIET HERE!
      if (req.body.logo_url && req.body.logo_url.length < 86) {
        logo_url = req.body.logo_url
      } else logo_url = results.rows[0].logo_url

      let que2nd = `
        UPDATE "users"
        SET "logo_url" = $1
        WHERE user_id = $2
      `
      let params2nd = [logo_url, uid]

      pool.query(que2nd, params2nd, (error2, results2) => {
        if (error2) {
          console.log('updateOneCompanyPic, err2: ', error2)
          res.send('error')
          return false
        }
        res.send('OK')
      })


    })
  }
}

async function updateOneCompany(req, res) {
  //check auth and if its a company
  if (req.cookies.session && req.cookies.session.length > 50) {
    //console.log(req.body)
    let que1st = `SELECT user_id, company, logo_url, role FROM "users" WHERE "auth_cookie" = ($1)`
    let params1st = [req.cookies.session]
    pool.query(que1st, params1st, (error, results) => {
      if (error) {
        res.send('step2')
        console.log('updateOneCompany Error: ', error)
        return false
      }
      if (results.rows.length < 1) {
        //Если юзера с таким куки не найдено, то выходим из функции прост
        res.send('step3')
        return false
      }
      if (results.rows[0].role != 'company') {
        res.send('step3')
        return false
      }

      let uid = results.rows[0].user_id
      //console.log('cp99: ', req.body)
      
      let parsedData = {}
      //VALIDATE SHIET HERE!
      if (req.body.company && req.body.company.length < 80 && titleRegex.test(req.body.company)) {
        parsedData.company = req.body.company
      } else parsedData.company = results.rows[0].company
      if (req.body.logo_url && req.body.logo_url.length < 86) {
        parsedData.logo_url = req.body.logo_url
      } else parsedData.logo_url = results.rows[0].logo_url
      //console.log('cp100: ', req.body.logo_url)
      if (req.body.domains) {
        parsedData.domains = req.body.domains.slice(0, 3)
      } else parsedData.domains = '{}'
      if (req.body.website) {
        parsedData.website = req.body.website
      } else parsedData.website = ''
      if (req.body.full_description && req.body.full_description.length < 2001) {
        parsedData.full_description = req.body.full_description
      } else parsedData.full_description = ''

      let que2nd = `UPDATE "users" SET ("company", "logo_url", "domains", "website", "full_description") =
                    ($1, $2, $3, $4, $5)
                    WHERE user_id = $6`
      let params2nd = [parsedData.company, parsedData.logo_url, parsedData.domains, parsedData.website, parsedData.full_description, uid]

      pool.query(que2nd, params2nd, (error2, results2) => {
        if (error2) {
          console.log('updateOneCompany, err2: ', error2)
          res.send('error')
          return false
        }
        res.send('OK')
      })


    })
  }
  //then by company id insert data

}

async function updateDiaper(newhash, oldhash, sess) {
  let que = `
    UPDATE "users" SET "pwhash" =
    $1
    WHERE auth_cookie = $2 AND pwhash = $3
  `
  let params = [newhash, sess, oldhash]
  let result = await pool.query(que, params).catch(error => {
    console.log('cp updDiapers err: ', error)
    return false
  })
  return result
}
async function getDiapers(sess, mail) {
  let que = `
    SELECT pwhash
    FROM users
    WHERE LOWER(email) = $1 AND auth_cookie = $2
  `
  let result = await pool.query(que, [mail, sess]).catch(error => {
    console.log('cp getDiapers err: ', error)
  })
  if (result.rows && result.rows.length === 1) return result.rows[0]
  else return false
}

async function cvurldelete(req, res) {
  if (req.cookies.session && req.cookies.session.length > 50) {
    let que = `
      UPDATE "users" SET "cvurl" = ''
      WHERE auth_cookie = $1 AND role = 'subscriber'
    `
    let params = [req.cookies.session]
    let result = await pool.query(que, params).catch(error => {
      console.log('cp cvurlupdate err: ', error)
      return undefined
    })
    if (result) {
      res.send('OK')
      return true
    } else {
      res.send('User non existent')
      return false
    }

  } else res.send('err2')
}

async function cvurlupdate(req, res) {
  //check auth and role
  console.log('cp')
  if (req.body && req.body.cvurl && req.body.cvurl.length > 4 && req.body.cvurl.length < 86) {
    if (req.cookies.session && req.cookies.session.length > 50) {
      //console.log(req.body)
      let que = `
        UPDATE "users" SET "cvurl" = $1
        WHERE auth_cookie = $2 AND role = 'subscriber'
      `
      let params = [req.body.cvurl, req.cookies.session]
      let result = await pool.query(que, params).catch(error => {
        console.log('cp cvurlupdate err: ', error)
        return undefined
      })
      if (result) {
        res.send('OK')
        return true
      } else {
        res.send('User non existent')
        return false
      }
    } else res.send('err2')
  } else res.send('err1')
  
  //validate url
  //update url
  //send OK
}

async function hitjobcv(req, res) {
  //получить job_id
  //выяснить user_id
  const jid = parseInt(req.query.jid)
  //проверить жоб айди формально
  if (isNaN(jid) || jid < 0 || String(jid).length > 10) {
    console.log('Error: wrong id')
    res.status(400).send('Неправильный id вакансии.')
    return false
  }
  if (!req.body.cvurl || req.body.cvurl.length > 85) {
    //и еще надо проверить cv url  - что начинается с webhost000
    res.send('Error: CV not loaded')
    return false
  }
  if (req.cookies.session && req.cookies.session.length > 50) {
    let que = `
      SELECT user_id
      FROM users
      WHERE auth_cookie = $1 AND role = 'subscriber'
    `
    let result = await pool.query(que, [req.cookies.session]).catch(error => {
      console.log('cp hitjobcv err: ', error)
    })
    if (result && result.rows && result.rows.length == 1) {
      let uid = result.rows[0].user_id
      console.log('cp yuu3:', uid)

      //ПРОВЕРКА - существует ли такая cvhit уже - по job_id, user_id
      let precheck_que = `
        SELECT cvhit_id
        FROM cvhits WHERE
        cvjob_id = $1 AND cvuser_id = $2
      `
      let precheck_params = [jid, uid]
      let precheck_result = await pool.query(precheck_que, precheck_params).catch(error => {
        console.log('cp hitjobcv1.5 err: ', error)
      })
      console.log('cp234yy: ', precheck_result.rows.length)
      if (precheck_result.rows.length != 0) {
        res.send('Уже подано')
        return false
      }

      let que2 = `INSERT INTO "cvhits" ("cvjob_id", "cvuser_id", "cv_url") VALUES ($1, $2, $3) RETURNING *`
      let params2 = [jid, uid, req.body.cvurl]
      let result2 = await pool.query(que2, params2).catch(error => {
        console.log('cp hitjobcv2 err: ', error)
      })
      if (result2 && result2.rows.length == 1) {
        console.log(result2.rows[0])
        res.send(result2.rows[0])
      }
      else res.send('Ошбика в бд')
    } else {
      res.send('Ошибка 1')
      return false
    }
    
    
  } else res.send('Ошибка авторизации')
}

async function getAllCVHitsOfUser(req, res) {
  //получить свой айди по сессии
  //отправить список назад
  if (req.cookies.session && req.cookies.session.length > 50) {
    let que = `
      SELECT user_id
      FROM users
      WHERE auth_cookie = $1 AND role = 'subscriber'
    `
    let result = await pool.query(que, [req.cookies.session]).catch(error => {
      console.log('cp getAllCVHitsOfUser err1: ', error)
    })
    if (result.rows.length == 1) {
      let que = `
        SELECT *
        FROM cvhits
        WHERE cvuser_id = $1
      `
      params = [result.rows[0].user_id]
      let result2 = await pool.query(que, params).catch(error => {
        console.log('cp getAllCVHitsOfUser err2: ', error)
      })
      if (result2) {
        res.send({cvs: result2.rows})
        return false
      } else res.send('Ошибка рес2')
    } else res.send('Ошибка авт')

    
  } else res.send('Ошибка авторизации')
}


async function getCVedJobs(req, res) {
  if (req.cookies.session && req.cookies.session.length > 50) {
    let que = `
      SELECT user_id
      FROM users
      WHERE auth_cookie = $1 AND role = 'subscriber'
    `
    let result = await pool.query(que, [req.cookies.session]).catch(error => {
      console.log('cp getCVedJobs err1: ', error)
    })
    if (result.rows.length == 1) {
      //Change que to select jobs 
      let que = `
        SELECT *
        FROM jobs
        WHERE job_id
        IN (SELECT cvjob_id
          FROM cvhits
          WHERE cvuser_id = $1)
      `
      params = [result.rows[0].user_id]
      let result2 = await pool.query(que, params).catch(error => {
        console.log('cp getCVedJobs err2: ', error)
      })
      if (result2) res.send({jobs: result2.rows})
      else res.send('error 3')
    } else res.send('error 2')
  } else res.send('error 1')
  //by session
  //get only the ids
}


async function getCVHitsHistory(req, res) {
  if (req.cookies.session && req.cookies.session.length > 50) {
    let que = `
      SELECT user_id
      FROM users
      WHERE auth_cookie = $1 AND role = 'subscriber'
    `
    let result = await pool.query(que, [req.cookies.session]).catch(error => {
      console.log('cp getResps err1: ', error)
    })
    if (result.rows.length == 1) {
      let que2 = `
        SELECT cvhits.*, jobs.title, jobs.is_closed, users.company
        FROM cvhits, jobs, users
        WHERE jobs.author_id = users.user_id AND cvhits.cvjob_id = jobs.job_id AND cvhits.cvuser_id = $1
        ORDER BY (cvhits.date_created) DESC
      `
      let params2 = [result.rows[0].user_id]
      let history = await pool.query(que2, params2).catch(error => {
        console.log('cp getResps err2: ', error)
      })
      if (history.rows && history.rows.length > 0) {
        res.send({rows: history.rows})
      } else res.send({rows: []})

    } else res.send('error 2')
  } else res.send('error 1')
}

async function getResps(req, res) {
  if (req.cookies.session && req.cookies.session.length > 50) {
    //get author_id first, also check role in the process
    let que = `
      SELECT user_id
      FROM users
      WHERE auth_cookie = $1 AND role = 'company'
    `
    let result = await pool.query(que, [req.cookies.session]).catch(error => {
      console.log('cp getResps err1: ', error)
    })
    if (result.rows.length == 1) {
      let que2 = `
        SELECT cvhits.*, jobs.title, users.name, users.surname
        FROM cvhits, jobs, users
        WHERE jobs.author_id = $1 AND cvhits.cvjob_id = jobs.job_id AND cvhits.cvuser_id = users.user_id
      `
      let params2 = [result.rows[0].user_id]
      let resps = await pool.query(que2, params2).catch(error => {
        console.log('cp getResps err2: ', error)
      })
      if (resps.rows && resps.rows.length > 0) {
        res.send({rows: resps.rows})
      } else res.send({rows: []})

    } else res.send('error 1')
    
  //do it by cookie and role, not by author_id
  } else res.send('error 0')
}

async function viewHit(req, res) {
  let hit = parseInt(req.body[0])
  if (isNaN(hit) || hit < 0 || String(hit).length > 10) {
    console.log('Error: wrong hit')
    res.status(400).send('Неправильный hit.')
    return false
  }
  if (req.cookies.session && req.cookies.session.length > 50) {
    let que = `
      SELECT user_id
      FROM users
      WHERE auth_cookie = $1 AND role = 'company'
    `
    let result = await pool.query(que, [req.cookies.session]).catch(error => {
      console.log('cp viewHit err1: ', error)
    })
    if (result.rows.length == 1) {
      let que2 = `
        UPDATE cvhits SET "date_checked" = NOW()
        WHERE date_checked IS NULL AND cvhit_id = $1 AND (SELECT author_id
          FROM jobs
          WHERE job_id = cvhits.cvjob_id) = $2
      `
      let params2 = [hit,result.rows[0].user_id]
      let result2 = await pool.query(que2, params2).catch(error => {
        console.log('cp viewHit err2: ', error)
        return false
      })
      console.log('h: ', hit)
      console.log('uid: ', result.rows[0].user_id)
      console.log('r2: ', result2.rows)
      if (result2) {
        res.send('OK')
      } else res.send('BAD')
    } else res.send('error 1')

  }
}

async function u2aublock(id, block_reason, active_state, u2id, user2) {
  if (active_state != true) active_state = false
  let que2 = `
    UPDATE users SET ("is_active", "block_reason") = ($1, $2)
    WHERE user_id = $3
  `
  let params2 = [active_state, block_reason, id]
  let result2 = await pool.query(que2, params2).catch(error => {
    console.log('cp u2aublock err2: ', error)
    return false
  })
  //Добавление логов
  let logcmd = active_state ? 'Разблок пользователя(A)' : 'Блок пользователя(A)'
  let logbody = active_state ? 'Id пользователя: ' + id : 'Id пользователя: ' + id + ', причина: ' + block_reason
  addLog(logcmd, logbody, u2id, '(Модератор) ' + user2)
  return Boolean(result2)
}
async function u2audelete(id, u2id, user2) {
  let que = `
    DELETE FROM users
    WHERE user_id = $1
  `
  let params = [id]
  let result = await pool.query(que, params).catch(error => {
    console.log('cp u2aublock err2: ', error)
    return false
  })
  //Добавление логов
  addLog('Удаление пользователя(A)', 'Id пользователя: ' + id, u2id, '(Модератор) ' + user2)
  return Boolean(result)
}

async function u2fbread(id) {
  let que2 = `
    UPDATE feedbacks SET "new" = false
    WHERE fb_id = $1
  `
  let params2 = [id]
  let result2 = await pool.query(que2, params2).catch(error => {
    console.log('cp u2fbread err2: ', error)
    return false
  })
  return Boolean(result2)
}
async function u2fbdel(id) {
  let que2 = `
    DELETE FROM feedbacks
    WHERE fb_id = $1
  `
  let params2 = [id]
  let result2 = await pool.query(que2, params2).catch(error => {
    console.log('cp u2fbdel err2: ', error)
    return false
  })
  return Boolean(result2)
}
async function adminGetJobs() {
  //check auth?
  let que = `
    SELECT *
    FROM "jobs"
    ORDER BY time_created DESC

  `
  let result = await pool.query(que, null).catch(error => {
    console.log('cp adminGetJobs err1: ', error)
    return false
  })
  let resu
  if (result && result.rows && result.rows.length > 0) {
    resu = result.rows
    //resu.forEach(function(v){ delete v.pwhash; delete v.auth_cookie });
  } else resu = []
  return resu
}
async function adminGetUsers() {
  //check auth?
  let que = `
    SELECT *
    FROM "users"
    ORDER BY user_id DESC
  `
  let result = await pool.query(que, null).catch(error => {
    console.log('cp adminGetUsers err1: ', error)
    return false
  })
  let resu
  if (result && result.rows && result.rows.length > 0) {
    resu = result.rows
    resu.forEach(function(v){ delete v.pwhash; delete v.auth_cookie });

  } else resu = []
  return resu
}
async function adminGetUsers2() {
  //check auth?
  let que = `
    SELECT u2id, u2mail, category_rights, u2last_logged_in, supernote
    FROM "users2"
    WHERE category_rights IS DISTINCT FROM '777'
  `
  let result = await pool.query(que, null).catch(error => {
    console.log('cp adminGetUsers2 err1: ', error)
    return false
  })
  let resu
  if (result && result.rows && result.rows.length > 0) {
    resu = result.rows

  } else resu = []
  
  return resu
}
async function adminGetFB() {
  //check auth?
  let que = `
    SELECT *
    FROM "feedbacks"
  `
  let result = await pool.query(que, null).catch(error => {
    console.log('cp adminGetFB err1: ', error)
    return false
  })
  let resu
  if (result && result.rows && result.rows.length > 0) {
    resu = result.rows
  } else resu = []
  return resu
}

async function feedback(req, res) {
  //check 4 fields
  if (req.body.topic.length > 25) {
    res.send('error, topic too long')
    return false
  }
  if (req.body.name.length > 25) {
    res.send('error, name too long')
    return false
  }
  if (
    req.body.mail.length > 70 ||
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(req.body.mail) == false
  ) {
    res.send('error, mail too bad')
    return false
  }
  if (req.body.topic.length > 2000) {
    res.send('error, body too long')
    return false
  }
  //put them in db
  let que = `
    INSERT INTO "feedbacks"
    ("topic", "name", "mail", "desc")
    VALUES
    ($1, $2, $3, $4)
  `
  let params = [req.body.topic, req.body.name, req.body.mail, req.body.body]
  let result = await pool.query(que, params).catch(error => {
    console.log('cp feedback err1: ', error)
  })
  //send back ok or bad
  if (result) res.send('OK')
  else res.send('BAD')
}


async function getAdminHash(admin) {
  //need new table
  //console.log(admin)
  let que = `SELECT u2hash FROM "users2" WHERE u2mail = $1`
  let params = [admin]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)  
    throw new Error('check admin for login error')
  })
  //console.log('asw ', result.rows.length)
  if (result && result.rows && result.rows.length === 1) return result.rows[0].u2hash
  else return undefined
}

async function tryInsertAdminCoo(mail, token) {
  let que = `UPDATE "users2" SET u2coo = $1, u2last_logged_in = NOW() where u2mail = $2`
  let params = [token, mail]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)
    throw new Error('auth2 insertion failed')
  })
  console.log('cp457', result.rows[0])
  if (result && result.rows) {
    return true
  } return undefined
  
}
async function adminAuth(mail, u2coo) {
  //here we get cookie
  //check it and bring back mail, rights, smth else
  let que1st = `SELECT u2id, category_rights FROM "users2" WHERE u2mail = $1 AND u2coo = $2`
  let params1st = [mail, u2coo]
  let result1 = await pool.query(que1st, params1st).catch(error => {
    console.log('cp adminAuth err: ', error)
    //throw new Error('job by id error')
    return undefined
  })
  //console.log('cpc p2: ', result1)
  if (result1.rows && result1.rows.length == 1) return result1.rows[0]
  else return undefined
}
async function adminDayStats() {
  // let queOld = `
  //   SELECT date_trunc('day', jobs.time_created) "day", count(*) AS "jobs"
  //   FROM jobs
  //   WHERE jobs.time_created >= now() - interval '2 months'
  //   group by 1
  //   ORDER BY 1
  // `
  let que = `
    SELECT d.day, count(jobs.job_id) AS jobs
    FROM (SELECT to_char(date_trunc('day', (current_date - offs)), 'YYYY-MM-DD') AS day 
          FROM generate_series(0, 60, 1) AS offs
        ) d LEFT OUTER JOIN
        jobs 
        ON d.day = to_char(date_trunc('day', jobs.time_created), 'YYYY-MM-DD')  
    GROUP BY d.day
    ORDER BY d.day
  `
  let result1 = await pool.query(que, null).catch(error => {
    console.log('cp adminDayStats err: ', error)
    //throw new Error('job by id error')
    return undefined
  })
  //console.log('cpc p2: ', result1)
  if (result1 && result1.rows) return result1.rows
  else return []
}
async function adminStats() {
  let que = `
    SELECT  (
      SELECT COUNT(*)
      FROM jobs
      WHERE NOT is_published = True OR is_published IS NULL
      ) AS jobs_tba,
      (
      SELECT COUNT(*)
      FROM users
      WHERE role = 'subscriber'
      ) AS uscount,
      (
      SELECT COUNT(*)
      FROM users
      WHERE role = 'company'
      ) AS uccount,
      (
      SELECT COUNT(*)
      FROM jobs
      ) AS jcount,
      (
      SELECT COUNT(*)
      FROM cvhits
      ) AS hcount,
      (
      SELECT COUNT(*)
      FROM jobs
      WHERE time_created > now() - interval '1 day'
      ) AS opened_today_count,
      (
      SELECT COUNT(*)
      FROM jobs
      WHERE time_created > now() - interval '7 day'
      ) AS opened_this_week_count,
      (
      SELECT COUNT(*)
      FROM feedbacks
      WHERE "new" = True
      ) AS unread_fb
  `
  let result1 = await pool.query(que, null).catch(error => {
    console.log('cp adminStats err: ', error)
    //throw new Error('job by id error')
    return undefined
  })
  //console.log('cpc p2: ', result1)
  if (result1.rows && result1.rows.length == 1) return result1.rows[0]
  else return undefined
}
async function adminLogs() {
  let que = `
    SELECT * FROM "logs" ORDER BY time DESC LIMIT 75
  `
  let result1 = await pool.query(que, null).catch(error => {
    console.log('cp adminLogs err: ', error)
    //throw new Error('job by id error')
    return undefined
  })
  //console.log('cpc p2: ', result1)
  if (result1) return result1.rows
  else return []
}


async function tryInsertMailVerification(hash1, userId, mail) {
  let que = `INSERT INTO "verifications" ("uid", "url", "time_created", "mail") VALUES ($1, $2, NOW(), $3)`
  let params = [userId, hash1, mail]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)
    throw new Error('veri insertion failed')
  })
  if (result && result.rows) {
    return true
  } return undefined
}

async function verifCheck(n) {
  let que = `
    DELETE FROM "verifications"
    WHERE url = $1
    RETURNING uid
  `
  let params = [n]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)
    throw new Error('veri check err1')
  })
  if (result && result.rowCount === 1) {
    let uid = result.rows[0].uid
    console.log('cp67gg1: ', uid)
    let que2 = `
      UPDATE "users" SET (is_active, email_confirmed, block_reason) = (TRUE, TRUE, '')
      WHERE user_id = $1
    `
    let params2 = [uid]
    let result2 = await pool.query(que2, params2).catch(error => {
      console.log(error)
      throw new Error('veri check err2')
    })
    return result.rowCount
  } return -1
}

async function getVerificationEntry(mail) {
  //mail should be prechecked for validity outside this
  //just get the whole entry by mail
  let que = `
  SELECT uid, url, mail, EXTRACT(EPOCH FROM time_created - 'now()'::timestamptz) AS time_passed
  FROM "verifications" WHERE mail = $1
  `
  let params = [mail]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)
    throw new Error('getVerificationEntry failed')
  })
  if (result && result.rows && result.rows.length == 1) return result.rows
  else return undefined
}

async function veriUpdTime(mail) {
  //mail should be prechecked for validity outside this
  let que = `
    UPDATE "verifications"
    SET time_created = NOW()
    WHERE mail = $1
  `
  let params = [mail]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)
    throw new Error('veriUpdTime')
  })
}

async function verifiedMailExists(mail) {
  //check if its verified too!!!
  //but need to return the result if it exists but is not verified, like verify first
  let que = `
    SELECT email_confirmed
    FROM users
    WHERE email = $1
  `
  let params = [mail]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)
    throw new Error('verifiedMailExists failed')
  })
  if (result && result.rows && result.rows.length == 1 && result.rows[0].email_confirmed == true) return true
  else return undefined
}

async function insertForgottenEntry(mail, url) {
  let que = `
    INSERT INTO "forgotten"
    ("mail", "url", "time_created") VALUES ($1, $2, NOW())
  `
  let params = [mail, url]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)
    throw new Error('insertForgottenEntry failed')
  })
  if (result) return true
  else return undefined
}

async function forgottenRequest1stCheck(mail) {
  let que = `
    SELECT url, mail, EXTRACT(EPOCH FROM time_created - 'now()'::timestamptz) AS time_passed
    FROM forgotten
    WHERE mail = $1
  `
  let params = [mail]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)
    throw new Error('forgottenRequest1stCheck failed')
  })
  if (result && result.rows && result.rows.length == 1) return result.rows[0]
  else return undefined
}

async function updateForgottenEntry(mail,url) {
  let que = `
    UPDATE "forgotten"
    SET ("url", "time_created") = ($1, NOW())
    WHERE mail = $2
  `
  let params = [url, mail]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)
    throw new Error('updateForgottenEntry failed')
  })
  if (result) return true
  else return undefined
}

async function forgCheck(n) {
  let que = `
    DELETE FROM "forgotten"
    WHERE url = $1
    RETURNING mail, EXTRACT(EPOCH FROM time_created - 'now()'::timestamptz) AS time_passed
  `
  let params = [n]
  let result = await pool.query(que, params).catch(error => {
    console.log(error)
    throw new Error('forg check err1')
  })
  if (result && result.rowCount === 1) {
    return result.rows[0]
  } return undefined
}


async function forgChangePw(pwhash, mail) {
  //mail and hash should be prechecked for validity
  let que = `
    UPDATE "users"
    SET pwhash = $1
    WHERE email = $2
  `
  let params = [pwhash, mail]
  let result = await pool.query(que, params).catch(error => {
    console.log('cp forgChangePw: ', error)
    throw new Error('user update fail')
  })
  return true
}

async function getSalStats(req, res) {
  let que = `
    SELECT * FROM cached_salary_stats
  `
  //let params = []
  let result = await pool.query(que, null).catch(error => {
    console.log(error)
    throw new Error('getSalStats failed')
  })
  if (result && result.rows) res.send(result.rows)
  else res.send('Error 13')
}

async function adminGetStats() {
  //check auth?
  let que = `
    SELECT *
    FROM cached_salary_stats
    ORDER BY statname DESC
  `
  let result = await pool.query(que, null).catch(error => {
    console.log('cp adminGetStats err1: ', error)
    return false
  })
  let resu
  if (result && result.rows && result.rows.length > 0) {
    resu = result.rows
    //resu.forEach(function(v){ delete v.pwhash; delete v.auth_cookie });
  } else resu = []
  return resu
}

async function userStatRegen(req, res) {
  //generate new stuff
  if (req.cookies && req.cookies.sessioa && req.cookies.sessioa.length > 50 && req.cookies.user2) {
    let auth = await adminAuth(req.cookies.user2, req.cookies.sessioa).catch(error => {
      //res.send('step2')
      return undefined
    })
    if (auth) {
      let que = `
        SELECT salary_min, salary_max, currency FROM jobs
        WHERE salary_min = (SELECT MIN(sal)
        FROM (SELECT salary_min as sal, currency
        FROM jobs
        WHERE salary_min > 0
        UNION ALL
        SELECT salary_max as sal, currency
        FROM jobs
        WHERE salary_max > 0) AS sal) or salary_max = (SELECT MIN(sal)
        FROM (SELECT salary_min as sal, currency
        FROM jobs
        WHERE salary_min > 0
        UNION ALL
        SELECT salary_max as sal, currency
        FROM jobs
        WHERE salary_max > 0) AS sal)
      `
      //let salMin
      var result = await pool.query(que, null).catch(error => {
        console.log('cp userStatRegen err1: ', error)
        return false
      })
      let resubig = []
      let resu = {}
      if (result && result.rows && result.rows.length > 0) {
        resu.salMin = result.rows[0]
        let salMin = 0
        if (resu.salMin.salary_min > 0) salMin = resu.salMin.salary_min
        else salMin = resu.salMin.salary_max
        salMinCurr = resu.salMin.currency
        if ((salMin < 870 && salMinCurr == 'm') || (salMin < 248 && salMinCurr == '$')) {
          salMin = 870
          salMinCurr = 'm'
        }
        
        console.log(resu.salMin)
        let que = `
          UPDATE cached_salary_stats
          SET (statvalue, statcurrency, time_updated) = (${salMin}, '${salMinCurr}', NOW())
          WHERE statname = 'salMin'
        `
        let result2 = await pool.query(que, null).catch(error => {
          console.log('cp userStatRegen err2: ', error)
          return false
        })

      }
      resubig.push(resu)
      
        


      let que3 = 'SELECT salary_min, salary_max, currency FROM jobs'
      var result = await pool.query(que3, null).catch(error => {
        console.log('cp userStatRegen err5: ', error)
        return false
      })
      if (result && result.rows && result.rows.length > 0) {
        var dataa = result.rows
        var sals = []
        //
        for (let index = 0; index < dataa.length; index++) {
          if (dataa[index].currency == '$') {
            dataa[index].currency = 'm'
            dataa[index].salary_min = dataa[index].salary_min * 3.5
            dataa[index].salary_max = dataa[index].salary_max * 3.5
          }
          var tmp = []
          if (dataa[index].salary_min > 0) tmp.push(dataa[index].salary_min)
          if (dataa[index].salary_max > 0) tmp.push(dataa[index].salary_max)
          if (tmp.length == 2) {
            sals.push((tmp[0] + tmp[1]) / 2)
          } else
          if (tmp.length == 1) sals.push(tmp[0])
        }
        sum = 0
        sals.forEach(v=>sum += v)
        avgSal = Math.round(sum / sals.length)
        let que = `
          UPDATE cached_salary_stats
          SET (statvalue, statcurrency, time_updated) = (${avgSal}, 'm', NOW())
          WHERE statname = 'salAvg'
        `
        let result2 = await pool.query(que, null).catch(error => {
          console.log('cp userStatRegen err6: ', error)
          return false
        })
      }

      let que4 = `SELECT title, job_id, salary_min, salary_max, currency FROM jobs WHERE time_updated > now() - interval '1 month'`
      var result = await pool.query(que4, null).catch(error => {
        console.log('cp userStatRegen err7: ', error)
        return false
      })
      if (result && result.rows && result.rows.length > 0) {
        var dataa = result.rows
        for (let index = 0; index < dataa.length; index++) {
          if (dataa[index].currency == '$') {
            dataa[index].currency = 'm'
            dataa[index].salary_min = dataa[index].salary_min * 3.5
            dataa[index].salary_max = dataa[index].salary_max * 3.5
          }
          if (dataa[index].salary_max < dataa[index].salary_min) dataa[index].salary_max = dataa[index].salary_min
        }
        //теперь отсорт по salmax
        
        dataa.sort((a,b)=>b.salary_max - a.salary_max)
        // console.log(dataa)
        let salMax = dataa[0].salary_max
        let salMaxCurr = 'm'
        let quex = `
          UPDATE cached_salary_stats
          SET (statvalue, statcurrency, time_updated) = (${salMax}, '${salMaxCurr}', NOW())
          WHERE statname = 'salMax';
        `
        for (let x1 = 0; x1 < 6; x1++) {
          //first five
          quex += `
            UPDATE cached_salary_stats SET 
            (statvalue, time_updated, statlabel, statcurrency, statlink) = (${dataa[x1].salary_max}, NOW(), '${dataa[x1].title}', 'm', ${dataa[x1].job_id})
            WHERE statname = 'top${x1 + 1}';
          `
        }

        var result = await pool.query(quex, null).catch(error => {
          console.log('cp userStatRegen err8: ', error)
          return false
        })
      }

      addLog('Manual userstat regen', '-', auth.u2id, '(Модератор) ' + req.cookies.user2)
      res.send('OK')
      //res.send(`<html><script>window.location.href = "/cplogin.json"</script></html>`)
    } else res.send('Auth error 2')
  } else res.send('Auth error 1')
}

module.exports = {
  userStatRegen,

  adminGetStats,
  getSalStats,

  forgChangePw,
  forgCheck,
  updateForgottenEntry,
  forgottenRequest1stCheck,
  insertForgottenEntry,
  verifiedMailExists,

  veriUpdTime,
  getVerificationEntry,
  tryInsertMailVerification,
  verifCheck,

  adminStats,
  adminDayStats,
  adminLogs,

  closeJobByIdAdmin,
  deleteJobByIdAdmin,
  approveJobByIdAdmin,

  u2fbread,
  u2fbdel,
  
  u2aublock,
  u2audelete,

  adminAuth,
  tryInsertAdminCoo,
  registerFinishAdmin,
  tryInsertEmailAdmin,
  getAdminHash,
  adminGetJobs,
  adminGetUsers,
  adminGetUsers2,
  adminGetFB,
  feedback,
  getCVHitsHistory,
  viewHit,
  getResps,
  getCVedJobs,
  getAllCVHitsOfUser,
  hitjobcv,
  cvurldelete,
  cvurlupdate,
  getDiapers,
  updateDiaper,
  checkAuthGetProfile,
  tryInsertAuthToken,
  tryGetLoginData,
  registerFinish,
  tryInsertEmail,
  getJobs,
  getJobById,
  addJobs,
  addOneJob,
  getOwnJobs,
  favOne,
  delFavOne,
  getFaved,
  getFavedFull,
  hitJobById,
  deleteJobById,
  closeJobById,
  reopenJobById,
  updateJob,
  getOneCompany,
  getOneCompanyBroad,
  updateOneCompany,
  checkIfUserAuthed,
  authedForUserData,
  updateUserData,
  updateOneCompanyPic,
}