const Router = require('express')
const routerAdmin = new Router()
const adminController = require('../controllers/admin')

routerAdmin.get('/users', adminController.getUsers)
routerAdmin.get('/user/current/:userId', adminController.getUser)
routerAdmin.delete('/user/delete', adminController.deleteUser)
routerAdmin.put('/user/block', adminController.blockUser)
routerAdmin.put('/user/unblock', adminController.unBlockUser)
routerAdmin.put('/user/promote', adminController.promoteUser)

module.exports = routerAdmin