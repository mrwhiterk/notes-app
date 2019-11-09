var express = require('express')
var router = express.Router()
const noteController = require('../controllers/note')
/* GET users listing. */
router.get('/', function(req, res, next) {})

router.post('/', noteController.create)

module.exports = router
