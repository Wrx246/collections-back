const { Collection } = require('../models/Models')

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
            res.status(500).json(error)
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
            res.status(500).json(error)
        }
    }
}

module.exports = new CollectionController()