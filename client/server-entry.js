import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'

import { JssProvider } from 'react-jss'
import { MuiThemeProvider } from 'material-ui/styles'
import createGenerateClassName from 'material-ui/styles/createGenerateClassName'

import App from './views/App'
import { createStoreMap } from './store'

// 防止mobx在服务端渲染会出现的循环数据变化问题
useStaticRendering(true)

export default (stores, routerContext, sheetsRegistry, jss, theme, url) => {
  jss.options.createGenerateClassName = createGenerateClassName
  return (
    <Provider {...stores}>
      <StaticRouter context={routerContext} location={url}>
        <JssProvider registry={sheetsRegistry} jss={jss}>
          <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
            <App />
          </MuiThemeProvider>
        </JssProvider>
      </StaticRouter>
    </Provider>
  )
}

export { createStoreMap }
