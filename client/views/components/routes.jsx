import React from 'react'
import {
  Route,
  Redirect,
} from 'react-router-dom'
import Helmet from 'react-helmet'

import TopicList from '../topic/topic-list'

const Test = () => (
  <div>
    <Helmet>
      <meta httpEquiv="X-UA-Compatible" content="ie=8" />
      <title>测试页面</title>
    </Helmet>
    <p>This is test</p>
  </div>
)

export default () => (
  <div>
    <Route path="/" render={() => <Redirect to="/topic" />} exact />
    <Route path="/topic" component={TopicList} />
    <Route path="/test" component={Test} />
    <Route path="/redirect" render={() => <Redirect to="/test" />} />
  </div>
)
