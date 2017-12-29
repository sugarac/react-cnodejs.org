const router = require('express').Router()
const axios = require('axios')

const baseUrl = 'https://cnodejs.org/api/v1'

router.post('/login', function (req, res) {
  axios.post(`${baseUrl}/accesstoken`, {
    accesstoken: req.body.accessToken,
  }).then(resp => {
    if (resp.status === 200 && resp.data.success) {
      req.session.user = {
        accessToken: req.body.accessToken,
        loginName: resp.data.loginname,
        id: resp.data.id,
        avatar_url: resp.data.avatar_url,
      }
      res.json({
        success: true,
        data: req.session.user,
      })
    }
  }).catch(err => {
    if (err.response) {
      res.json({
        success: false,
        msg: err.message,
      })
    }
  })
})

module.exports = router
