const User = require('../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const Note = require('../models/note')

module.exports = {
  create: async (req, res) => {
    console.log(req.body)

    try {
      const { title, body } = req.body

      const note = new Note({
        title,
        body,
        author: req.user._id
      })

      await note.save()
    } catch (err) {
      console.log(err)
      res.status(400).send({ err })
    }

    res.redirect('back')
  }
}
