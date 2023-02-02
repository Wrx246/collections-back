const Router = require('express')
const routerItem = new Router()
const itemController = require('../controllers/item')

routerItem.post('/create', itemController.createItem)
routerItem.get('/:id', itemController.getItems)

module.exports = routerItem