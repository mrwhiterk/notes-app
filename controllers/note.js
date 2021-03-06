const Note = require('../models/note')

module.exports = {
  index: async (req, res, next) => {
    try {
      await Note.find({
        title: { $regex: new RegExp(req.query.title || ''), $options: 'i' }
      })
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
      if (err.code === 11000) {
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
      req.flash('errors', err)
    }
    res.redirect('back')
  },

  showCloneForm: async (req, res) => {
    const note = await Note.findById(req.params.id)
      .populate('author')
      .exec()

    res.render('notes/cloneForm', { note })
  },

  clone: async (req, res) => {
    try {
      const note = await Note.findById(req.params.id)
        .populate('author')
        .exec()

      const sanitizedTitle = req.body.title.replace(/[^\w\s]/g, '').trim()

      const newNote = new Note()

      const pulledForked = note.title.match(/\([^)]+/)

      if (pulledForked) {
        newNote.title = `${sanitizedTitle} ${pulledForked[0]})`
      } else {
        newNote.title = `${sanitizedTitle} (forked from ${note.author.username}/${note.title})`
      }

      newNote.body = req.body.body
      newNote.author = req.user._id

      await newNote.save()

      req.flash('success', 'successfully forked')
      res.redirect(`/notes/${newNote._id}`)
    } catch (error) {
      console.log(error)

      if (error.code === 11000) {
        req.flash('errors', 'Note title is not available')
      } else {
        req.flash('errors', errmsg)
      }

      res.redirect('back')
    }
  },

  edit: async (req, res) => {
    const note = await Note.findById(req.params.id)
    res.render('notes/editForm', { note })
  },

  update: async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'category', 'body', 'files']
    const isValidOperation = updates.every(item =>
      allowedUpdates.includes(item)
    )

    if (!isValidOperation) {
      req.flash('errors', 'invalid request')
      return res.redirect('back')
    }

    try {
      const note = await Note.findById(req.params.id)
      let pattern
      if (note.title.includes('(forked from')) {
        pattern = note.title.match(/\(.*\)/gi)
      }

      updates.forEach(update => {
        if (update === 'title' && pattern) {
          note[update] = req.body[update].split(/\(/g)[0] + pattern[0]
          console.log(pattern[0])
        } else {
          note[update] = req.body[update]
        }
      })

      await note.save()
      req.flash('success', 'successfully updated note')
      res.redirect(`/notes/${note._id}`)
    } catch (error) {
      console.log(error)
      req.flash('errors', error.errmsg)
      res.redirect('back')
    }
  },

  deleteNote: async (req, res) => {
    try {
      await Note.findByIdAndDelete(req.params.id)

      req.flash('success', 'note deleted')
    } catch (err) {
      req.flash('errors', err.message)
    }

    res.redirect('back')
  }
}
