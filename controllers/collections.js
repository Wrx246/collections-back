const { Collection, Item, Comment } = require('../models/Models')

class CollectionController {
    async createCollection(req, res) {
        const { title, description, theme, tags, userId } = req.body;
        try {
            if (!title && !description && !theme && !tags) {
                return res.status(400).json({ successful: false, message: `Incorrect data. Please try create again.` })
            }
            await Collection.create({ title, description, tags, theme, userId })
            const collection = await Collection.findOne({ where: { title: title } })
            return res.status(200).json({ successful: true, message: `Collection ${title} created.`, data: collection })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async saveImage(req, res) {
        const { id, image } = req.body
        try {
            if (!id && !image) {
                return res.status(400).json({ successful: false, message: `Incorrect data. Please try create again.` })
            }
            const collection = await Collection.findOne({ where: { id: id } })
            if (!collection) {
                return res.status(400).json({ message: `Collection doesn't exist.` })
            }
            await collection.update({ image: image }, { where: { id: id } })
            res.status(200).json({ successful: true, collection })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async editCollection(req, res) {
        const { title, description, theme, tags, id } = req.body;
        const options = {
            title: title,
            description: description,
            theme: theme,
            tags: tags
        }
        try {
            if (!title && !id && !description && !theme && !tags) {
                return res.status(400).json({ successful: false, message: `Incorrect data. Please try create again.` })
            }
            const collection = await Collection.findOne({ where: { id: id } })
            const items = await Item.findAll({ where: { collectionId: id } })
            if (!collection) {
                return res.status(400).json({ message: `Collection doesn't exist.` })
            }
            if (!items) {
                return res.status(400).json({ message: `Items doesn't exist` })
            }
            await collection.update(options, { where: { id: id } })
            items.map(item => item.update({ tags: tags }))
            res.status(200).json({ successful: true, collection })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async getCollections(req, res) {
        const { id } = req.params;
        try {
            if (!id) {
                return res.status(400).json({ message: `Incorrect user ID. Please try again.` })
            }
            const collections = await Collection.findAll({ where: { userId: id } })
            return res.status(200).json({ successful: true, data: collections })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async getPopular(req, res) {
        try {
            const items = await Item.findAll()
            const comments = await Comment.findAll({ where: { itemId: items.map(i => i.id) } })
            const it = await Item.findAll({ where: { id: comments.map(c => c.itemId) } })
            const collections = await Collection.findAll({ where: { id: it.map(i => i.collectionId) } })
            if (!collections) {
                return res.status(500).json({ message: 'Collections not find' })
            }
            return res.status(200).json({ successful: true, collections })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async deleteCollection(req, res) {
        const { id, userId } = req.body;
        try {
            if (!id && !userId) {
                return res.status(400).json({ message: `Incorrect data ID. Please try again.` })
            }
            const collection = await Collection.findOne({ where: { id: id } })
            if (!collection) {
                return res.status(400).json({ message: `Collection doesn't exist. Please try again.` })
            }
            await Collection.destroy({ where: { id: id } })
            await Item.destroy({ where: { collectionId: null } })
            await Comment.destroy({ where: { itemId: null } })
            const collections = await Collection.findAll({ where: { userId: userId } })
            return res.status(200).json({ successful: true, data: collections })
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

module.exports = new CollectionController()