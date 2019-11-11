const Comment = require('../models/comment')

module.exports = {
  create: async (req, res) => {
    const { body } = req.body

    try {
      const comment = new Comment({
        body,
        author: req.user._id,
        note: req.params.id
      })

      await comment.save()

      res.redirect('back')
    } catch (error) {
      throw new Error(error)
    }
  },
  delete: async (req, res) => {
    try {
      await Comment.findByIdAndDelete(req.params.id)
      res.redirect('back')
    } catch (error) {
      throw new Error(error)
    }
  }
}
