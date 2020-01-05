exports.head = `<!DOCTYPE html>
<html lang="en"><head><style>
section {
  width: 100%;
}
.detailed__line {
  display: flex;
}
</style></head><body>`
exports.end  = `</body></html>`
exports.footer = `<footer>Футер 2020</footer>`
exports.foot = exports.footer + exports.end
exports.demo = `<h1>somethings</h1>`
exports.headbody = `<head><style>
  .detailed__line {
    display: flex;
  }
</style></head><body>`

exports.navbar = links => {
  return (
    `<nav>
      <ul>
        ${links.map(link => `<li><a href="${link.href}">${link.title}</a></li>`).join("")}
      </ul>
    </nav>`
  )
}
exports.jobsList = () => {
  return `
    <section>
      <ul>
        
      </ul>
    </section>
    `
}
let currencydic = {
  '$': '$',
  'm': 'манат',
  'р': 'руб',
  'e': 'евро'
}
let sexdic = {
  'w': '<li>Женщина</li>',
  'm': '<li>Мужчина</li>',
}
exports.jobinfo = (job) => {
  
  let currency = currencydic[job.currency]
  let descArr
  if (job.description) {
    descArr = job.description.split(' / ')
    descArr = '<li>' + descArr.join('</li><li>') + '</li>'
  } else descArr = ''
  let gender = sexdic[job.sex] || ''
  let salary_subtitle = job.salary_max ? `<p style="font-size: 20px">${job.salary_max} ${currency}</p>` : ''
  let edu = job.edu ? `<li>${job.edu}</li>` : ''
  let langs = job.langs.length > 0 ? `<li>${job.langs.join(', ')}</li>` : ''
  let exp = job.experience > 0 ? `<li>Минимальный стаж ${job.experience} лет</li>` : '<li>Без опыта</li>'
  return `<!DOCTYPE html>
  <html lang="en"><head><style>
  * {
    margin: 0;
    font-family: "Open Sans", sans-serif;
  }
  section {
    width: 80%;
    max-width: 450px;
    margin-bottom: 30px;
  }
  .detailed__button {
    background-color: #B4E873;
    padding: 5px;
    border: 0;
    font-size: 20px;
    cursor: pointer;
  }
  .detailed__button:hover {
    color: white;
  }
  .detailed__author-link{
    color: #0CA0DF;
  }
  .detailed__line {
    display: flex;
    justify-content: space-between;
  }
  .detailed__col{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .detailed__logo{
    width: 100px;
    height: 60px;
    background-color: coral;
  }
  .detailed__header{
    color: #2242B4;
    margin-bottom: 10px;
  }
  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
  }
  </style></head><body>
    <section class="detailed__line">
      <div class="detailed__col">
        <h1>${job.title}</h1>
        ${salary_subtitle}
      </div>
      <div class="detailed__logo">Лого</div>
    </section>
    <section>
      <p><a href="#" class="detailed__author-link">${job.author}</a></p>
      <p>${job.city}</p>
    </section>
    <section>
      <button class="detailed__button">Откликнуться</button>
    </section>
    <section>
      <h4 class="detailed__header">Обязанности</h4>
      <ul>
        ${descArr ? descArr : '-'}
      </ul>
    </section>
    <section>
      <h4 class="detailed__header">Требования</h4>
      <ul>
        ${gender}
        <li>Возраст: ${job.age1 ? 'от ' + job.age1 : ''} ${job.age2 ? 'до ' + job.age2 + ' лет': ''} ${(job.age1 && !job.age2) ? ' лет' : ''}</li>
        ${langs}
        ${edu}
        ${exp}
      </ul>
    </section>
    <section>
      <h4 class="detailed__header">Условия работы</h4>
      <ul>
        <li>Оклад ${job.salary_max} - ${job.salary_max} ${currency}</li>
        <li>График ${job.worktime1} - ${job.worktime1}</li>
      </ul>
    </section>
    <section>
      <h4 class="detailed__header">Контакты</h4>
      <ul>
        <li>тел.. .. .....</li>
        <li>мейл@домен.домен</li>
      </ul>
    </section>
    </body></html>
  `
}