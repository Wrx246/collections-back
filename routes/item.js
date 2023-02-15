const Router = require('express')
const routerItem = new Router()
const itemController = require('../controllers/item')

routerItem.post('/create', itemController.createItem)
routerItem.put('/edit', itemController.editItem)
routerItem.get('/collection/:id', itemController.getItems)
routerItem.get('/collection/item/:id', itemController.getItem)
routerItem.get('/latest', itemController.getLatestItems)
routerItem.put('/addLike', itemController.addLike)
routerItem.put('/removeLike', itemController.removeLike)
routerItem.delete('/delete', itemController.deleteItem)
routerItem.get('/', itemController.searchItem)

module.exports = routerItem