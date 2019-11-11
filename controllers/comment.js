const Comment = require('../models/comment')
const passport = require('passport')

module.exports = {
  create: async (req, res) => {
    const { body } = req.body

    try {
      const comment = new Comment({
        body,
        author: req.user._id,
        note: req.params.noteId
      })

      await comment.save()

      res.redirect('back')
    } catch (error) {
      throw new Error(error)
    }
  }
}
