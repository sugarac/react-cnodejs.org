import React from 'react'
import {
  withRouter,
} from 'react-router-dom'

import PropTypes from 'prop-types'

import AppBar from './components/app-bar'

import Routes from '../config/router'

class App extends React.Component {
  componentDidMount() {
    // do something here
  }

  componentDidCatch(error, info) {
    console.error(error) // eslint-disable-line
    console.log(info) // eslint-disable-line
  }

  render() {
    return [
      <AppBar location={this.props.location} key="app-bar" />,
      <Routes key="routes" />,
    ]
  }
}

App.propTypes = {
  location: PropTypes.object.isRequired,
}

export default withRouter(App)
