const { Item, Comment, User, Collection } = require('../models/Models')
const sequelize = require('../config/db')
const { Op } = require('sequelize')

class ItemController {
    async createItem(req, res) {
        const { title, tags, collectionId } = req.body;
        try {
            if (!title && !tags && !collectionId) {
                return res.status(400).json({ successful: false, message: `Incorrect data. Please try create again.` })
            }
            await Item.create({ title, tags, collectionId })
            const item = await Item.findOne({ where: { title: title, collectionId: collectionId } })
            return res.status(200).json({ successful: true, message: `Item ${title} created.`, data: item })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async getItems(req, res) {
        const { id } = req.params;
        try {
            if (!id) {
                return res.status(400).json({ message: `Incorrect user ID. Please try again.` })
            }
            const items = await Item.findAll({ where: { collectionId: id } })
            return res.status(200).json({ successful: true, data: items })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async deleteItem(req, res) {
        const { id, collectionId } = req.body
        try {
            if (!id && !collectionId) {
                return res.status(400).json({ message: `Incorrect item ID. Please try again.` })
            }
            await Item.destroy({ where: { id: id } })
            await Comment.destroy({ where: { itemId: null } })
            const items = await Item.findAll({ where: { collectionId: collectionId } })
            return res.status(200).json({ successful: true, data: items })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async getItem(req, res) {
        const { id } = req.params;
        try {
            if (!id) {
                return res.status(400).json({ successful: false, message: `Incorrect user ID. Please try again.` })
            }
            const item = await Item.findOne({ where: { id: id } })
            if (!item) {
                return res.status(500).json({ successful: false, message: `Item doesn't exist` })
            }
            return res.status(200).json({ successful: true, data: item })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async getLatestItems(req, res) {
        try {
            const items = await Item.findAll({
                limit: 10,
                order: [['createdAt', 'DESC']]
            })
            return res.status(200).json({ successful: true, data: items })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async addLike(req, res) {
        const { id, userId } = req.body
        try {
            if (!id && !userId) {
                return res.status(400).json({ message: `Wrong data. Please try again.` })
            }
            const user = await User.findOne({ where: { id: userId } })
            const item = await Item.findOne({ where: { id: id } })
            if (!user) {
                return res.status(400).json({ message: `User doesn't exist.` })
            } else if (!item) {
                return res.status(400).json({ message: `Item doesn't exist.` })
            }
            const n = await item.likes.includes(userId)
            if (n) {
                return res.status(500).json({ message: `Already liked` })
            }
            await item.update({ likes: [...item.likes, userId] }, { where: { id: id } })
            return res.status(200).json({ successful: true, data: item })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async removeLike(req, res) {
        const { id, userId } = req.body
        try {
            if (!id && !userId) {
                return res.status(400).json({ message: `Wrong data. Please try again.` })
            }
            const user = await User.findOne({ where: { id: userId } })
            const item = await Item.findOne({ where: { id: id } })
            if (!user) {
                return res.status(400).json({ message: `User doesn't exist.` })
            } else if (!item) {
                return res.status(400).json({ message: `Item doesn't exist.` })
            }
            const n = await item.likes.includes(userId)
            if (!n) {
                return res.status(500).json({ message: `User doesn't liked this item` })
            }
            await item.update({ likes: item.likes.filter(i => i !== userId) }, { where: { id: id } })
            return res.status(200).json({ successful: true, data: item })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async searchItem(req, res) {
        const { search } = req.query
        try {
            const items = await Item.findAll({ where: { title: { [Op.iLike]: '%' + search + '%' } } })
            return res.status(200).json({ successful: true, items })
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

module.exports = new ItemController()