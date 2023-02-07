const Router = require('express')
const routerComment = new Router()
const commentController = require('../controllers/comment')

routerComment.post('/create', commentController.createComment)
routerComment.get('/:itemId', commentController.getComments)

module.exports = routerComment