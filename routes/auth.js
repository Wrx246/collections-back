const Router = require('express')
const routerAuth = new Router()
const authController = require('../controllers/auth')

routerAuth.post('/registration', authController.registration)
routerAuth.post('/login', authController.login)
routerAuth.post('/check', authController.checkBan)

module.exports = routerAuth