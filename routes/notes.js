var express = require('express')
var router = express.Router()
const noteController = require('../controllers/note')

router.get('/', noteController.index)

router.get('/new', (req, res) => {
  res.render('notes/createForm')
})

router.get('/like/:id', noteController.like)

router.get('/:id/clone', noteController.clone)

router.get('/:id', noteController.show)

router.post('/', noteController.create)

router.get('/:id/edit', noteController.edit)
router.put('/:id', noteController.update)

router.delete('/:id', noteController.deleteNote)

module.exports = router
