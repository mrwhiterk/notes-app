var express = require('express')
var router = express.Router()
const noteController = require('../controllers/note')
const Note = require('../models/note')
/* GET users listing. */
router.get('/', async (req, res, next) => {
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
})

router.get('/new', (req, res) => {
  res.render('notes/createForm')
})

router.get('/like/:id', noteController.like)

router.get('/:id', async (req, res) => {
  try {
    await Note.findById(req.params.id)
      .populate('author')
      .exec((err, note) => {
        if (err) throw err

        res.render('notes/show', { note })
      })
  } catch (err) {
    console.log(err)
    req.flash('errors', err)
  }
})


router.post('/', noteController.create)

router.delete('/:id', noteController.deleteNote)

module.exports = router
