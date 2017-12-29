import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'  // eslint-disable-line

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import { lightBlue, blue } from 'material-ui/colors'

import App from './views/App'
import { AppState, TopicStore } from './store'

const initialState = window.__INITIAL_STATE__ || {} // eslint-disable-line

const theme = createMuiTheme({
  palette: {
    primary: blue,
    accent: lightBlue,
    type: 'light',
  },
})

const createClientApp = (TheApp) => {
  class ClientApp extends React.Component {
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side')
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles)
      }
    }

    render() {
      return <TheApp />
    }
  }

  return ClientApp
}

const appState = new AppState()
appState.init(initialState.appState)
const topicStore = new TopicStore(initialState.topicStore)

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider appState={appState} topicStore={topicStore}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Component />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  )
}

render(createClientApp(App))

// react 17 will replace render to hydrate when using ssr
// ReactDOM.hydrate(<App />, document.getElementById('root'))

if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App').default  // eslint-disable-line
    render(createClientApp(NextApp))
  })
}
