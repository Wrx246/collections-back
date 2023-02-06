const Router = require('express')
const routerItem = new Router()
const itemController = require('../controllers/item')

routerItem.post('/create', itemController.createItem)
routerItem.get('/collection/:id', itemController.getItems)
routerItem.get('/latest', itemController.getLatestItems)
routerItem.post('/addLike', itemController.addLike)
routerItem.post('/removeLike', itemController.removeLike)

module.exports = routerItem