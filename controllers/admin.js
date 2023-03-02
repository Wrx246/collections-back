const { Collection, Item, Comment, User } = require('../models/Models')
const ApiError = require('../exceptions/error')

class AdminController {
    async getUsers(req, res, next) {
        try {
            const users = await User.findAll()
                .then(u => u.filter(u => u.name !== 'admin'))
            return res.status(200).json({ successful: true, users })
        } catch (error) {
            next(error)
        }
    }

    async getUser(req, res, next) {
        const { userId, id } = req.body
        try {
            const admin = await User.findOne({ where: { id: id } })
            if (!admin) {
                throw ApiError.BadRequest('User didnt find!')
            } else if (admin.role !== 'admin') {
                throw ApiError.BadRequest('You are not admin!')
            }
            const collections = await Collection.findAll({ where: { userId: userId } })
            return res.status(200).json({ successful: true, collections })
        } catch (error) {
            next(error)
        }
    }

    async deleteUser(req, res, next) {
        const { userId, id } = req.body
        try {
            const admin = await User.findOne({ where: { id: id } })
            if (!admin) {
                throw ApiError.BadRequest('User didnt find!')
            } else if (admin.role !== 'admin') {
                throw ApiError.BadRequest('You are not admin!')
            }
            await User.destroy({ where: { id: userId } })
            await Collection.destroy({ where: { userId: null } })
            await Item.destroy({ where: { collectionId: null } })
            await Comment.destroy({ where: { itemId: null } })
            const users = await User.findAll({ where: { role: 'user' } })
            return res.status(200).json({
                successful: true,
                message: 'User successfully deleted',
                users
            })
        } catch (error) {
            next(error)
        }
    }

    async blockUser(req, res, next) {
        const { userId, id } = req.body
        try {
            const admin = await User.findOne({ where: { id: id } })
            if (!admin) {
                throw ApiError.BadRequest('User didnt find!')
            } else if (admin.role !== 'admin') {
                throw ApiError.BadRequest('You are not admin!')
            }
            await User.update({ isActive: false }, { where: { id: userId } })
            const users = await User.findAll({ where: { role: 'user' } })
            return res.status(200).json({ successful: true, users })
        } catch (error) {
            next(error)
        }
    }

    async unBlockUser(req, res, next) {
        const { userId, id } = req.body
        try {
            const admin = await User.findOne({ where: { id: id } })
            if (!admin) {
                throw ApiError.BadRequest('User didnt find!')
            } else if (admin.role !== 'admin') {
                throw ApiError.BadRequest('You are not admin!')
            }
            await User.update({ isActive: true }, { where: { id: userId } })
            const users = await User.findAll({ where: { role: 'user' } })
            return res.status(200).json({ successful: true, users })
        } catch (error) {
            next(error)
        }
    }

    async promoteUser(req, res, next) {
        const { userId, role, id } = req.body
        try {
            const admin = await User.findOne({ where: { id: id } })
            if (!admin) {
                throw ApiError.BadRequest('User didnt find!')
            } else if (admin.role !== 'admin') {
                throw ApiError.BadRequest('You are not admin!')
            }
            const user = await User.findOne({ where: { id: userId } })
            await user.update({ role: role }, { where: { id: userId } })
            return res.status(200).json({ successful: true, user })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AdminController()