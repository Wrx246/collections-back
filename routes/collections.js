const Router = require('express')
const routerCollection = new Router()
const collectionController = require('../controllers/collections')

routerCollection.post('/create', collectionController.createCollection)
routerCollection.get('/:id', collectionController.getCollections)

module.exports = routerCollection