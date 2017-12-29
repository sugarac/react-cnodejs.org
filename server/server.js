const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const favicon = require('serve-favicon')
const serverRender = require('./util/server-render')

const isDev = process.env.NODE_ENV === 'development'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'I will teach you'
}))

app.use('/api/user', require('./util/user-api'))
app.use('/api', require('./util/inject-token'))

app.use(favicon(path.join(__dirname, '../favicon.ico')))

if (!isDev) {
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  const serverEntry = require('../dist/server-entry')
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8')
  app.get('*', function (req, res, next) {
    serverRender(serverEntry, template, req, res).catch(next)
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}

app.use(function (error, req, res, next) {
  console.error(error)
})

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3333

app.listen(port, host, function () {
  console.log(`server is listening on ${host}:${port}`)
})
