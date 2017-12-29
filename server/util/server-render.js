const Helmet = require('react-helmet').default
const ReactDomServer = require('react-dom/server')
const ejs = require('ejs')
const serialize = require('serialize-javascript')
const SheetsRegistry = require('react-jss').SheetsRegistry
const colors = require('material-ui/colors')
const createMuiTheme = require('material-ui/styles').createMuiTheme
const create = require('jss').create
const preset = require('jss-preset-default').default
const asyncBootstrapper = require('react-async-bootstrapper').default

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

module.exports = (bundle, template, req, res) => {
  const user = req.session.user
  const createApp = bundle.default
  const createStoreMap = bundle.createStoreMap
  const routerContext = {}
  const stores = createStoreMap()

  if (user) {
    stores.appState.user.isLogin = true
    stores.appState.user.info = user
  }

  const theme = createMuiTheme({
    palette: {
      primary: colors.blue,
      accent: colors.lightBlue,
      type: 'light',
    },
  })

  const sheetsRegistry = new SheetsRegistry()
  const jss = create(preset())

  const app = createApp(stores, routerContext, sheetsRegistry, jss, theme, req.url)
  return new Promise((resolve, reject) => {
    asyncBootstrapper(app).then(() => {
      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url)
        res.end()
        return
      }
      const appString = ReactDomServer.renderToString(app)
      const helmet = Helmet.rewind()
      const html = ejs.render(template, {
        meta: helmet.meta.toString(),
        link: helmet.link.toString(),
        style: helmet.style.toString(),
        title: helmet.title.toString(),
        appString,
        initalState: serialize(getStoreState(stores)),
        materialCss: sheetsRegistry.toString()
      })
      res.send(html)
      resolve()
    }).catch(reject)
  })
}