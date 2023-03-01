const { Collection, Item, Comment } = require('../models/Models')
const ApiError = require('../exceptions/error')

class CollectionController {
    async createCollection(req, res, next) {
        const {
            userId,
            title,
            description,
            image,
            tags,
            theme,
            author,
            comment,
            additionalInfo,
            publication,
            foundation,
            price,
            reward,
            score,
            favorite,
            country,
            language,
            shortName,
            status,
            terminated,
            original,
        } = req.body;
        try {
            if (!title && !description && !theme && !tags) {
                throw ApiError.BadRequest('Incorrect data. Please try create again.')
            }
            await Collection.create({
                userId,
                title,
                description,
                image,
                tags,
                theme,
                author,
                comment,
                additionalInfo,
                publication,
                foundation,
                price,
                reward,
                score,
                favorite,
                country,
                language,
                shortName,
                status,
                terminated,
                original
            })
            const collection = await Collection.findOne({ where: { title: title } })
            return res.status(200).json({ successful: true, message: `Collection ${title} created.`, data: collection })
        } catch (error) {
            next(error)
        }
    }

    async saveImage(req, res, next) {
        const { id, image } = req.body
        try {
            if (!id && !image) {
                throw ApiError.BadRequest('Incorrect data. Please try create again.')
            }
            const collection = await Collection.findOne({ where: { id: id } })
            if (!collection) {
                throw ApiError.BadRequest(`Collection doesn't exist.`)
            }
            await collection.update({ image: image }, { where: { id: id } })
            res.status(200).json({ successful: true, collection })
        } catch (error) {
            next(error)
        }
    }

    async editCollection(req, res, next) {
        const {
            title,
            description,
            theme,
            tags,
            image,
            author,
            comment,
            additionalInfo,
            publication,
            foundation,
            price,
            reward,
            score,
            favorite,
            country,
            language,
            shortName,
            status,
            terminated,
            original,
            id } = req.body;
        const options = {
            title: title,
            description: description,
            theme: theme,
            tags: tags,
            image: image,
            author: author,
            comment: comment,
            additionalInfo: additionalInfo,
            publication: publication,
            foundation: foundation,
            price: price,
            reward: reward,
            score: score,
            favorite: favorite,
            country: country,
            language: language,
            shortName: shortName,
            status: status,
            terminated: terminated,
            original: original,
        }
        try {
            if (!title && !id && !description && !theme && !tags) {
                throw ApiError.BadRequest('Incorrect data. Please try edit again.')
            }
            const collection = await Collection.findOne({ where: { id: id } })
            const items = await Item.findAll({ where: { collectionId: id } })
            if (!collection) {
                throw ApiError.BadRequest(`Collection doesn't exist.`)
            }
            if (!items) {
                throw ApiError.BadRequest(`Items doesn't exist.`)
            }
            await collection.update(options, { where: { id: id } })
            items.map(item => item.update({ tags: tags }))
            res.status(200).json({ successful: true, collection })
        } catch (error) {
            next(error)
        }
    }

    async getCollections(req, res, next) {
        const { id } = req.params;
        try {
            if (!id) {
                throw ApiError.BadRequest('Incorrect user ID. Please try again.')
            }
            const collections = await Collection.findAll({ where: { userId: id } })
            return res.status(200).json({ successful: true, data: collections })
        } catch (error) {
            next(error)
        }
    }

    async getPopular(req, res, next) {
        try {
            const items = await Item.findAll()
            const collections = await Collection.findAll({ limit: 10, where: { id: items.map(i => i.collectionId) } })
            if (!collections) {
                throw ApiError.BadRequest('Collections did not find')
            }
            return res.status(200).json({ successful: true, collections })
        } catch (error) {
            next(error)
        }
    }

    async deleteCollection(req, res, next) {
        const { id, userId } = req.body;
        try {
            if (!id && !userId) {
                throw ApiError.BadRequest('Incorrect data ID. Please try again.')
            }
            const collection = await Collection.findOne({ where: { id: id } })
            if (!collection) {
                throw ApiError.BadRequest(`Collection doesn't exist. Please try again.`)
            }
            await Collection.destroy({ where: { id: id } })
            await Item.destroy({ where: { collectionId: null } })
            await Comment.destroy({ where: { itemId: null } })
            const collections = await Collection.findAll({ where: { userId: userId } })
            return res.status(200).json({ successful: true, data: collections })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CollectionController()