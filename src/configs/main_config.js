//const jobsUrl = 'http://127.0.0.1:3000'
//const jobsUrl = 'https://jobsnearbyapi.herokuapp.com'
//const jobsUrl = '127.0.0.1:7777'
const jobsUrl = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:7777' : ''


module.exports = {
  jobsUrl
}