var express = require('express')
var router = express.Router()
const commentController = require('../controllers/comment')

router.post('/:id', commentController.create)

router.delete('/:id', commentController.delete)

module.exports = router
