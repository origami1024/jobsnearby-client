exports.head = `<html><body>`
exports.end  = `</body></html>`
exports.footer = `<footer>Origami1024 2019</footer>`
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