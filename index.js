const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
const SECRET = process.env.SECRET || 'cardinal'
const PORT = process.env.PORT || 5000
// admin password is admin123

app
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.urlencoded({ extended: false }))
  .use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
  }))
  .use('', require('./routes/page/navigation'))
  .use((req, res, next) => {
    res.status(404).render('pages/page404')
  })
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))