exports.head = `<!DOCTYPE html>
<html lang="en"><body>`
exports.end  = `</body></html>`
exports.footer = `<footer>Футер 2020</footer>`
exports.foot = exports.footer + exports.end
exports.demo = `<h1>somethings</h1>`
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
exports.jobinfo = (job) => {
  return `
    <section>
      <div>
        <h1>${job.title}</h1>
        <p>${job.salary_min}</p>
        <p>${job.salary_max}</p>
        <p>${job.currency}</p>
      </div>
      <div>Лого</div>
    </section>
    <section>
      <p>${job.author_id}</p>
      <p>${job.city}</p>
    </section>
    <button>Откликнуться</button>
    <section>
      <h4>Обязанности</h4>
    </section>
    <section>
      <h4>Требования</h4>
      <ul>
        <li>- ${job.sex}</li>
        <li>- от ${job.age1} до ${job.age2}</li>
        <li>- ${job.langs.join(', ')}</li>
        <li>- ${job.edu}</li>
        <li>- Минимальный стаж ${job.experience} лет</li>
      </ul>
    </section>
    <section>
      <h4>Условия работы</h4>
      <ul>
      <li>- Оклад ${job.salary_max} - ${job.salary_max}</li>
      <li>- График ${job.worktime1} - ${job.worktime1}</li>
      </ul>
    </section>
    <section>
      <h4>Контакты</h4>
      <ul>
      <li>- тел.. .. .....</li>
      <li>- мейл@домен.домен</li>
      </ul>
    </section>
  `
}