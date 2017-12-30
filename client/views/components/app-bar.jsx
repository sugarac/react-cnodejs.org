import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import {
  inject,
  observer,
} from 'mobx-react'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui-icons/Home'

const styleSheet = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
}

@inject((stores) => {
  return {
    user: stores.appState.user,
  }
}) @observer
class ButtonAppBar extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.goToIndex = this.goToIndex.bind(this)
    this.goToUser = this.goToUser.bind(this)
    this.goToCreate = this.goToCreate.bind(this)
  }

  componentDidMount() {
    // do something here
  }

  goToUser() {
    const { location } = this.props
    if (location.pathname !== '/user/login') {
      if (this.props.user.isLogin) {
        this.context.router.history.push('/user/info')
      } else {
        this.context.router.history.push({
          pathname: '/user/login',
          search: `?from=${location.pathname}`,
        })
      }
    }
  }

  goToCreate() {
    this.context.router.history.push('/topic/create')
  }

  goToIndex() {
    this.context.router.history.push('/')
  }

  render() {
    const classes = this.props.classes
    const user = this.props.user
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton color="contrast" aria-label="Menu" onClick={this.goToIndex}>
              <HomeIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              {/* Sugar for <a href="https://cnodejs.org" color="inherit">CNodejs.org</a> */}
              CNode: Professional Node.js Chinese Community
            </Typography>
            {
              user.isLogin ?
                <Button raised color="accent" onClick={this.goToCreate}>
                  New Post
                </Button> :
                null
            }
            <Button color="contrast" onClick={this.goToUser}>
              {user.isLogin ? user.info.loginName : 'Login'}
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

ButtonAppBar.wrappedComponent.propTypes = {
  user: PropTypes.object.isRequired,
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default withStyles(styleSheet)(ButtonAppBar)
