const axios = require('axios')
const path = require('path')
const MemoryFileSystem = require('memory-fs')

const proxy = require('http-proxy-middleware')
const serverRender = require('./server-render')

const webpack = require('webpack')
const webpackServerConfig = require('../../build/webpack.config.server')

const mfs = new MemoryFileSystem()
const serverCompiler = webpack(webpackServerConfig)
const NativeModule = require('module')
const vm = require('vm')

let serverBundle
serverCompiler.outputFileSystem = mfs
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.warn(warn))

  const bundlePath = path.join(
    webpackServerConfig.output.path,
    webpackServerConfig.output.filename
  )

  // mobx会有多个模块存在的问题，所以把mobx作为exteneral使用
  // 让bundle引用mobx的时候从node_modules下面引入
  // 保持mobx实例在运行环境中只存在一份
  const m = { exports: {} }
  try {
    const bundle = mfs.readFileSync(bundlePath, 'utf-8')
    const wrapper = NativeModule.wrap(bundle)
    const script = new vm.Script(wrapper, {
      filename: 'server-bundle.js',
      displayErrors: true
    })
    const result = script.runInThisContext()
    result.call(m.exports, m.exports, require, m)
    serverBundle = m.exports
  } catch (err) {
    console.log(err.stack)
  }
})

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        console.error('get template error', err)
      })
  })

}

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

module.exports = function handleDevSSR(app) {

  app.use('/public', proxy({
    target: 'http://127.0.0.1:8888'
  }))

  app.get('*', function (req, res, next) {
    if (!serverBundle) {
      return res.send('waiting for compile')
    }
    getTemplate().then(template => {
      return serverRender(serverBundle, template, req, res)
    }).catch(err => {
      next(err)
    })
  })
}