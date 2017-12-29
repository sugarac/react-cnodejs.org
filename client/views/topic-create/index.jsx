import React from 'react'
import PropTypes from 'prop-types'
import {
  inject,
  observer,
} from 'mobx-react'

import TextField from 'material-ui/TextField'
import Radio from 'material-ui/Radio'
import Button from 'material-ui/Button'
import IconReply from 'material-ui-icons/Reply'
import { withStyles } from 'material-ui/styles'

import Container from '../components/container'
import createStyles from './styles'
import { tabs } from '../../util/variable-define'

import SimpleMDE from '../../components/simple-mde'

@inject((stores) => {
  return {
    topicStore: stores.topicStore,
    appState: stores.appState,
  }
}) @observer
class TopicCreate extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      // showEditor: false,
      title: '',
      content: '',
      tab: 'dev',
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.handleChangeTab = this.handleChangeTab.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
  }

  // componentDidMount() {
  //   setTimeout(() => {
  //     this.setState({
  //       showEditor: true,
  //     })
  //   }, 500)
  // }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value,
    })
  }

  handleContentChange(value) {
    this.setState({
      content: value,
    })
  }

  handleChangeTab(e) {
    this.setState({
      tab: e.currentTarget.value,
    })
  }

  handleCreate() {
    // do create here
    const {
      tab, title, content,
    } = this.state
    const appState = this.props.appState
    if (!title) {
      return appState.notify({
        message: 'Must write topic',
      })
    }
    if (!content) {
      return appState.notify({
        message: 'Cannot be empty',
      })
    }
    return this.props.topicStore.createTopic(title, tab, content)
      .then(() => {
        this.context.router.history.push('/index')
      })
      .catch((err) => {
        appState.notify({
          message: err.message,
        })
      })
  }

  render() {
    const classes = this.props.classes
    return (
      <Container>
        <div className={classes.root}>
          <TextField
            className={classes.title}
            label="Title"
            value={this.state.title}
            onChange={this.handleTitleChange}
            fullWidth
          />
          <SimpleMDE
            onChange={this.handleContentChange}
            value={this.state.newReply}
            options={{
              toolbar: false,
              spellChecker: false,
              placeholder: 'Give your brilliant opinion! You can use Markdown syntax.',
            }}
          />
          <div>
            {
              Object.keys(tabs).map(tab => {
                if (tab !== 'all' && tab !== 'good') {
                  return (
                    <span className={classes.selectItem} key={tab}>
                      <Radio
                        value={tab}
                        checked={tab === this.state.tab}
                        onChange={this.handleChangeTab}
                      />
                      {tabs[tab]}
                    </span>
                  )
                }
                return null
              })
            }
          </div>
          <Button fab color="primary" onClick={this.handleCreate} className={classes.replyButton}>
            <IconReply />
          </Button>
        </div>
      </Container>
    )
  }
}

TopicCreate.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
}

TopicCreate.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(createStyles)(TopicCreate)
