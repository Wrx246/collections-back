const Router = require('express')
const routerCollection = new Router()
const collectionController = require('../controllers/collections')

routerCollection.post('/create', collectionController.createCollection)
routerCollection.put('/edit', collectionController.editCollection)
routerCollection.put('/image', collectionController.saveImage)
routerCollection.get('/current/:id', collectionController.getCollections)
routerCollection.get('/popular', collectionController.getPopular)
routerCollection.delete('/delete', collectionController.deleteCollection)

module.exports = routerCollection