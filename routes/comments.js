var express = require('express')
var router = express.Router()
const commentController = require('../controllers/comment')

router.post('/:noteId', commentController.create)

module.exports = router
