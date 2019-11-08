var express = require('express')
var router = express.Router()
const User = require('../models/user')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
})

router.post('/', async (req, res) => {
  try {
    const me = new User({
      username: 'mrwhiterk',
      email: 'ryan@gmail.com',
      password: '1234doggy'
    })

    await me.save()

    res.send(me)
  } catch (err) {
    res.send({ err })
  }
})

module.exports = router
