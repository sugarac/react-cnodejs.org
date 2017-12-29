import React from 'react'
import PropTypes from 'prop-types'
import {
  inject,
  observer,
} from 'mobx-react'

import Avatar from 'material-ui/Avatar'
import { withStyles } from 'material-ui/styles'

import UserIcon from 'material-ui-icons/AccountCircle'

import Container from '../components/container'
import userStyles from './styles/user-style'

@inject(stores => {
  return {
    user: stores.appState.user,
  }
}) @observer
class User extends React.Component {
  componentDidMount() {
    // do someting here
  }

  render() {
    const classes = this.props.classes
    const user = this.props.user.info || {}
    return (
      <Container>
        <div className={classes.avatar}>
          <div className={classes.bg} />
          {
            user.avatar_url ?
              <Avatar className={classes.avatarImg} src={user.avatar_url} /> :
              <Avatar className={classes.avatarImg}>
                <UserIcon />
              </Avatar>
          }
          <span className={classes.userName}>{user.loginName || 'Please Login, you can use 0fd9c428-a206-41c0-bbe3-1d423d70431f for test.'}</span>
        </div>
        {this.props.children}
      </Container>
    )
  }
}

User.wrappedComponent.propTypes = {
  user: PropTypes.object.isRequired,
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
}

export default withStyles(userStyles)(User)
