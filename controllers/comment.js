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
  like: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id)

      if (comment.likes.includes(req.user.id)) {
        comment.likes = comment.likes.filter(x => x.toString() !== req.user.id)
      } else {
        comment.likes.push(req.user.id)
      }

      await comment.save()

      res.redirect('back')
    } catch (error) {
      res.redirect('back')
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
