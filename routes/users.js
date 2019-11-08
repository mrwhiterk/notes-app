var express = require('express')
var router = express.Router()
const User = require('../models/user')

/* GET users listing. */
router.get('/', function (req, res, next) {

})

router.post('/', async (req, res) => {
  try {
    const { username, email, password, password2 } = req.body

    if (password !== password2) {
      throw Error('passwords must match')
    }

    const me = User({
      username,
      email,
      password
    })

    await me.save()

    res.send(me)
  } catch (err) {
    res.send({ err })
  }
})

module.exports = router
