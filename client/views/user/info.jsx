import React from 'react'
import PropTypes from 'prop-types'
import {
  inject,
  observer,
} from 'mobx-react'

import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

import UserWrapper from './user'
import infoStyles from './styles/user-info-style'

const TopicItem = (({ topic }) => {
  return (
    <ListItem>
      <Avatar src={topic.author.avatar_url} />
      <ListItemText
        primary={topic.title}
        secondary={`New Reply：${topic.last_reply_at}`}
      />
    </ListItem>
  )
})

TopicItem.propTypes = {
  topic: PropTypes.object.isRequired,
}

@inject((stores) => {
  return {
    user: stores.appState.user,
    appState: stores.appState,
  }
}) @observer
class UserInfo extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  componentWillMount() {
    this.props.appState.getUserDetail()
    this.props.appState.getUserCollection()
  }

  render() {
    const classes = this.props.classes
    const topics = this.props.user.detail.recent_topics
    const replies = this.props.user.detail.recent_replies
    const collections = this.props.user.collections.list
    return (
      <UserWrapper>
        <div className={classes.root}>
          <Grid container spacing={16} align="stretch">
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>Recent Released Topics</span>
                </Typography>
                <List>
                  {
                    topics.length > 0 ?
                      topics.map(topic => <TopicItem topic={topic} key={topic.id} />) :
                      <Typography align="center">
                        No Released Topic
                      </Typography>
                  }
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>Your Reply</span>
                </Typography>
                <List>
                  {
                    replies.length > 0 ?
                      replies.map(topic => <TopicItem topic={topic} key={topic.id} />) :
                      <Typography align="center">
                        No Reply
                      </Typography>
                  }
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>Favorite Topics</span>
                </Typography>
                <List>
                  {
                    collections.length > 0 ?
                      collections.map(topic => <TopicItem topic={topic} key={topic.id} />) :
                      <Typography align="center">
                        No Favorite Topic
                      </Typography>
                  }
                </List>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </UserWrapper>
    )
  }
}

UserInfo.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
}

UserInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

export default withStyles(infoStyles)(UserInfo)
