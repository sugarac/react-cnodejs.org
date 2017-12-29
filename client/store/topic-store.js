import {
  observable,
  toJS,
  computed,
  action,
  extendObservable,
} from 'mobx'
import {
  get,
  post,
} from '../util/http'

import {
  topicSchema,
} from '../util/variable-define'

const createTopic = (data) => {
  return Object.assign({}, topicSchema, data)
}

export class Topic {
  constructor(data) {
    extendObservable(this, data)
  }
  @observable createdReplies = []
  @observable syncing = false

  @action doReply(content) {
    return new Promise((resolve, reject) => {
      post(`/topic/${this.id}/replies`, {
        content,
      })
        .then(data => {
          // debugger // eslint-disable-line
          if (data.success) {
            this.createdReplies.push({
              create_at: Date.now(),
              id: data.reply_id,
              content,
            })
            resolve({
              replyId: data.reply_id,
              content,
            })
          } else {
            reject()
          }
        }).catch(reject)
    })
  }
}

export class TopicStore {
  @observable topics
  @observable details
  @observable createdTopics
  @observable syncing = false
  @observable tab = undefined

  constructor(
    { syncing = false, topics = [], tab = null, details = [] } = {},
  ) {
    this.syncing = syncing
    this.topics = topics.map(topic => new Topic(createTopic(topic)))
    this.details = details.map(detail => new Topic(createTopic(detail)))
    this.tab = tab
  }

  @computed get topicMap() {
    return this.topics.reduce((result, topic) => {
      result[topic.id] = topic
      return result
    }, {})
  }

  @computed get detailsMap() {
    return this.details.reduce((result, topic) => {
      result[topic.id] = topic
      return result
    }, {})
  }

  @action addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)))
  }

  @action fetchTopics(tab) {
    return new Promise((resolve, reject) => {
      if (tab === this.tab && this.topics.length > 0) {
        resolve()
      } else {
        this.tab = tab
        this.topics = []
        this.syncing = true
        get('/topics', {
          mdrender: false,
          tab,
        }).then(resp => {
          if (resp.success) {
            const topics = resp.data.map(topic => {
              return new Topic(createTopic(topic))
            })
            this.topics = topics
            this.syncing = false
            resolve()
          } else {
            this.syncing = false
            reject()
          }
        }).catch(err => {
          reject(err)
        })
      }
    })
  }

  @action createTopic(title, tab, content) {
    return new Promise((resolve, reject) => {
      post('/topics', {
        title, tab, content,
      })
        .then(data => {
          if (data.success) {
            const topic = {
              title,
              tab,
              content,
              id: data.topic_id,
              create_at: Date.now(),
            }
            this.createdTopics.push(new Topic(createTopic(topic)))
            resolve(topic)
          } else {
            reject(new Error(data.error_msg || '未知错误'))
          }
        })
        .catch((err) => {
          if (err.response) {
            reject(new Error(err.response.data.error_msg || '未知错误'))
          } else {
            reject(new Error('未知错误'))
          }
        })
    })
  }

  @action getTopicDetail(id) {
    console.log('get topic id:', id) // eslint-disable-line
    return new Promise((resolve, reject) => {
      if (this.detailsMap[id]) {
        resolve(this.detailsMap[id])
      } else {
        get(`/topic/${id}`, {
          mdrender: false,
        }).then(resp => {
          if (resp.success) {
            const topic = new Topic(createTopic(resp.data), true)
            this.details.push(topic)
            resolve(topic)
          } else {
            reject()
          }
        }).catch(err => {
          reject(err)
        })
      }
    })
  }

  toJson() {
    return {
      page: this.page,
      topics: toJS(this.topics),
      syncing: toJS(this.syncing),
      details: toJS(this.details),
      tab: this.tab,
    }
  }
}

export default TopicStore
