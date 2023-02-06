const { Item } = require('../models/Models')

class ItemController {
    async createItem(req, res) {
        const { title, tags, collectionId } = req.body;
        try {
            if (!title && !tags) {
                return res.status(400).json({ successful: false, message: `Incorrect data. Please try create again.` })
            }
            await Item.create({ title, tags, collectionId })
            const item = await Item.findOne({ where: { title: title, collectionId: collectionId } })
            return res.status(200).json({ successful: true, message: `Item ${title} created.`, data: item })
        } catch (error) {
            res.status(500).json(error)
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
            res.status(500).json(error)
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
            res.status(500).json(error)
        }
    }

    async addLike(req, res) {
        const { id, collectionId } = req.body
        try {
            await Item.increment({ likes: 1 }, { where: { id: id } })
            const items = await Item.findAll({ where: { collectionId: collectionId } })
            return res.status(200).json({ successful: true, data: items })
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async removeLike(req, res) {
        const { id, collectionId } = req.body
        try {
            await Item.decrement({ likes: 1 }, { where: { id: id } })
            const items = await Item.findAll({ where: { collectionId: collectionId } })
            return res.status(200).json({ successful: true, data: items })
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = new ItemController()