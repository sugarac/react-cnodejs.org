import React from 'react'
import Helmet from 'react-helmet'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import cx from 'classnames'

import List from 'material-ui/List/List'
import ListItem from 'material-ui/List/ListItem'
import ListItemAvatar from 'material-ui/List/ListItemAvatar'
import ListItemText from 'material-ui/List/ListItemText'
import Tabs, { Tab } from 'material-ui/Tabs'
import { CircularProgress } from 'material-ui/Progress'
import FlipMove from 'react-flip-move'

import Avatar from 'material-ui/Avatar'

import { withStyles } from 'material-ui/styles'

import {
  topicPrimaryStyle,
  topicSecondaryStyle,
} from './styles'

import { TopicStore } from '../../store/topic-store'
import { tabs } from '../../util/variable-define'
import Container from '../components/container'
import formatDate from '../../util/date-format'

// const tabsValues = Object.keys(tabs).map(key => {
//   return key
// })

const getTab = (tab, isTop, isGood) => {
  return isTop ? 'Top' : (isGood ? 'Good' : tab) // eslint-disable-line
}

const TopicPrimary = (props) => {
  const topic = props.topic
  const classes = props.classes
  const isTop = topic.top
  const isGood = topic.good
  const classNames = cx([classes.tab, isTop ? classes.top : '', isGood ? classes.good : ''])
  return (
    <div className={classes.root}>
      <span
        className={classNames}
      >
        {getTab(tabs[topic.tab], isTop, isGood)}
      </span>
      <span>{topic.title}</span>
    </div>
  )
}

const TopicSecondary = ({ topic, classes }) => {
  return (
    <span className={classes.root}>
      <span className={classes.userName}>{topic.author.loginname}</span>
      <span className={classes.count}>
        <span className={classes.accentColor}>{topic.reply_count}</span>
        <span>/</span>
        <span>{topic.visit_count}</span>
      </span>
      <span>Creation Time：{formatDate(topic.create_at, 'yyyy-mm-dd')}</span>
    </span>
  )
}

TopicPrimary.propTypes = {
  topic: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

TopicSecondary.propTypes = {
  topic: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

const StyledTopicPrimary = withStyles(topicPrimaryStyle)(TopicPrimary)
const StyledTopicSecondary = withStyles(topicSecondaryStyle)(TopicSecondary)

@inject(stores => {
  return {
    topicStore: stores.topicStore,
    appState: stores.appState,
    user: stores.appState.user,
  }
}) @observer
class TopicList extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.changeTab = this.changeTab.bind(this)
    this.fetchTopic = this.fetchTopic.bind(this)
  }

  componentDidMount() {
    this.fetchTopic()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.fetchTopic(nextProps.location)
    }
  }

  asyncBootstrap() {
    const query = queryString.parse(this.props.location.search)
    const tab = query.tab
    return this.props.topicStore.fetchTopics(tab || 'all').then(() => {
      return true
    }).catch(() => {
      // console.log(err)
      return false
    })
  }

  fetchTopic(location) {
    location = location || this.props.location
    const query = queryString.parse(location.search)
    const tab = query.tab
    this.props.topicStore.fetchTopics(tab || 'all')
  }

  changeTab(e, value) {
    // change route here
    this.context.router.history.push({
      pathname: '/index',
      search: `?tab=${value}`,
    })
  }

  goToTopic(topic) {
    this.context.router.history.push(`/detail/${topic.id}`)
  }

  render() {
    const topics = this.props.topicStore.topics
    const createdTopics = this.props.topicStore.createdTopics
    const syncing = this.props.topicStore.syncing
    const user = this.props.user
    const query = queryString.parse(this.props.location.search)
    const tab = query.tab
    const tabValue = tab || 'all'

    // const disableAllAnimations = !topics.length === 20
    // disableAllAnimations从启用到禁用时enterAnimation设定的动画会不起作用，原因不明。
    const enterAnimation = {
      from: { transform: 'translateY(-80px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    }

    return (
      <Container>
        <Helmet>
          <title>CNode: Professional Node.js Chinese Community</title>
        </Helmet>
        <div>
          <Tabs
            value={tabValue}
            onChange={this.changeTab}
          >
            {
              Object.keys(tabs).map(t => <Tab key={t} label={tabs[t]} value={t} />)
            }
          </Tabs>
        </div>
        {
          createdTopics && createdTopics.length > 0 ?
            <List style={{ backgroundColor: '#dfdfdf' }}>
              {
                createdTopics.map(topic => {
                  return (
                    <ListItem button key={topic.id} onClick={() => this.goToTopic(topic)}>
                      <ListItemAvatar>
                        <Avatar src={user.info.avatar_url} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={<StyledTopicPrimary topic={topic} />}
                        secondary={
                          <StyledTopicSecondary
                            topic={Object.assign({}, topic, {
                              reply_count: 0,
                              visit_count: 0,
                              author: {
                                loginname: user.info.loginName,
                              },
                            })}
                          />}
                      />
                    </ListItem>
                  )
                })
              }
              {/* </FlipMove> */}
            </List> :
            null
        }
        <List>
          <FlipMove enterAnimation={enterAnimation} duration={600}>
            {
              topics.map(topic => {
                // topic = topic.content
                return (
                  <ListItem button key={topic.id} onClick={() => this.goToTopic(topic)}>
                    <ListItemAvatar>
                      <Avatar src={topic.author.avatar_url} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<StyledTopicPrimary topic={topic} />}
                      secondary={<StyledTopicSecondary topic={topic} />}
                    />
                  </ListItem>
                )
              })
            }
          </FlipMove>
        </List>
        {
          syncing ?
            (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: '40px 0',
                }}
              >
                <CircularProgress color="accent" size={100} />
              </div>
            ) :
            null
        }
      </Container>
    )
  }
}

TopicList.wrappedComponent.propTypes = {
  topicStore: PropTypes.instanceOf(TopicStore).isRequired,
  user: PropTypes.object.isRequired,
}

TopicList.propTypes = {
  // user: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default TopicList
