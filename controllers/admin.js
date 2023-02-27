const { Collection, Item, Comment, User } = require('../models/Models')

class AdminController {
    async getUsers(req, res) {
        try {
            const users = await User.findAll({ where: { role: 'user' } })
            return res.status(200).json({ successful: true, users })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async getUser(req, res) {
        const { userId } = req.params
        try {
            const collections = await Collection.findAll({ where: { userId: userId } })
            return res.status(200).json({ successful: true, collections })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async deleteUser(req, res) {
        const { userId } = req.body
        try {
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
            return res.status(500).json(error)
        }
    }

    async blockUser(req, res) {
        const { userId } = req.body
        try {
            await User.update({ isActive: false }, { where: { id: userId } })
            const users = await User.findAll({ where: { role: 'user' } })
            return res.status(200).json({ successful: true, users })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async unBlockUser(req, res) {
        const { userId } = req.body
        try {
            await User.update({ isActive: true }, { where: { id: userId } })
            const users = await User.findAll({ where: { role: 'user' } })
            return res.status(200).json({ successful: true, users })
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

module.exports = new AdminController()