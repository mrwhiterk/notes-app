const Note = require('../models/note')

module.exports = {
  index: async (req, res, next) => {
    try {
      await Note.find()
        .populate('author')
        .exec((err, notes) => {
          if (err) throw err

          res.render('notes', { notes })
        })
    } catch (err) {
      throw new Error(err)
    }
  },
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
      req.flash('success', 'successfully created note')
      res.redirect('/notes')
    } catch (err) {
      if (err.code == 11000) {
        req.flash('errors', 'Title is already taken')
      } else {
        req.flash('errors', err.errmsg)
      }
      res.status(400).redirect('back')
    }
  },

  show: async (req, res) => {
    try {
      await Note.findById(req.params.id)
        .populate('author')
        .exec(async (err, note) => {
          if (err) throw err

          await note.populate('comments').execPopulate()

          res.render('notes/show', {
            note
          })
        })
    } catch (err) {
      req.flash('errors', err)
    }
  },

  like: async (req, res) => {
    try {
      const note = await Note.findById(req.params.id)

      const match = note.likes.find(id => id.toString() === req.user.id)

      if (!match) {
        note.likes.push(req.user.id)
      } else {
        note.likes = note.likes.filter(id => id.toString() !== req.user.id)
      }
      await note.save()
    } catch (err) {
      console.log(err)
      req.flash('errors', err)
    }
    res.redirect('back')
  },

  edit: async (req, res) => {
    const note = await Note.findById(req.params.id)
    res.render('notes/editForm', { note })
  },

  update: async (req, res) => {
    console.log(req.body)
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'category', 'body']
    const isValidOperation = updates.every(item =>
      allowedUpdates.includes(item)
    )

    if (!isValidOperation) {
      req.flash('errors', 'invalid request')
      return res.redirect('back')
    }

    try {
      const note = await Note.findById(req.params.id)

      updates.forEach(update => {
        note[update] = req.body[update]
      })

      await note.save()
      req.flash('success', 'successfully updated note')
      res.redirect(`/notes/${note._id}`)
    } catch (error) {
      req.flash('errors', error.errmsg)
      res.redirect('back')
    }
  },

  deleteNote: async (req, res) => {
    try {
      await Note.findByIdAndDelete(req.params.id)
      req.flash('success', 'note deleted')
    } catch (err) {
      console.log(err)
      req.flash('errors', err.message)
    }
    res.redirect('back')
  }
}
