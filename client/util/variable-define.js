export const tabs = {
  all: 'All',
  good: 'Good',
  share: 'Share',
  ask: 'QA',
  job: 'Job',
  dev: 'Test',
}

export const topicSchema = {
  id: '',
  author_id: '',
  tab: '',
  content: '',
  title: '',
  last_reply_at: '',
  good: false,
  top: false,
  reply_count: 0,
  visit_count: 0,
  create_at: '',
  is_collect: '',
  author: {
    loginname: '',
    avatar_url: '',
  },
  replies: [],
}

export const replySchema = {
  id: '',
  author: {
    loginname: '',
    avatar_url: '',
  },
  content: '',
  ups: [],
  create_at: '',
  reply_id: null,
  is_uped: false,
}

export default {
  tabs,
}
