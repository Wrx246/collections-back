const { Item, Comment, User, Collection } = require('../models/Models')
const sequelize = require('../config/db')
const { Op } = require('sequelize')
const ApiError = require('../exceptions/error')

class ItemController {
    async createItem(req, res, next) {
        const {
            title,
            tags,
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
            collectionId } = req.body;
        try {
            if (!title && !tags && !collectionId) {
                throw ApiError.BadRequest(`Incorrect data. Please try create again.`)
            }
            await Item.create({
                title,
                tags,
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
                collectionId
            })
            const item = await Item.findOne({ where: { title: title, collectionId: collectionId } })
            return res.status(200).json({ successful: true, message: `Item ${title} created.`, data: item })
        } catch (error) {
            next(error)
        }
    }

    async editItem(req, res, next) {
        const { title,
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
        try {
            if (!title && !id) {
                throw ApiError.BadRequest(`Incorrect data. Please try create again.`)
            }
            const item = await Item.findOne({ where: { id: id } })
            if (!item) {
                throw ApiError.BadRequest(`Item doesn't exist.`)
            }
            await item.update({
                title: title,
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
                original: original
            }, { where: { id: id } })
            res.status(200).json({ successful: true, item })
        } catch (error) {
            next(error)
        }
    }

    async getItems(req, res, next) {
        const { id } = req.params;
        try {
            if (!id) {
                throw ApiError.BadRequest(`Incorrect user ID. Please try again.`)
            }
            const items = await Item.findAll({ where: { collectionId: id } })
            return res.status(200).json({ successful: true, data: items })
        } catch (error) {
            next(error)
        }
    }

    async deleteItem(req, res, next) {
        const { id, collectionId } = req.body
        try {
            if (!id && !collectionId) {
                throw ApiError.BadRequest(`Incorrect data. Please try again.`)
            }
            await Item.destroy({ where: { id: id } })
            await Comment.destroy({ where: { itemId: null } })
            const items = await Item.findAll({ where: { collectionId: collectionId } })
            return res.status(200).json({ successful: true, data: items })
        } catch (error) {
            next(error)
        }
    }

    async getItem(req, res, next) {
        const { id } = req.params;
        try {
            if (!id) {
                throw ApiError.BadRequest(`Incorrect user ID. Please try again.`)
            }
            const item = await Item.findOne({ where: { id: id } })
            if (!item) {
                throw ApiError.BadRequest(`Item doesn't exist`)
            }
            return res.status(200).json({ successful: true, data: item })
        } catch (error) {
            next(error)
        }
    }

    async getLatestItems(req, res, next) {
        try {
            const items = await Item.findAll({
                limit: 10,
                order: [['createdAt', 'DESC']]
            })
            return res.status(200).json({ successful: true, data: items })
        } catch (error) {
            next(error)
        }
    }

    async addLike(req, res, next) {
        const { id, userId } = req.body
        try {
            if (!id && !userId) {
                throw ApiError.BadRequest(`Wrong data. Please try again.`)
            }
            const user = await User.findOne({ where: { id: userId } })
            const item = await Item.findOne({ where: { id: id } })
            if (!user) {
                throw ApiError.BadRequest(`User doesn't exist.`)
            } else if (!item) {
                throw ApiError.BadRequest(`Item doesn't exist.`)
            }
            const n = await item.likes.includes(userId)
            if (n) {
                throw ApiError.BadRequest(`Already liked`)
            }
            await item.update({ likes: [...item.likes, userId] }, { where: { id: id } })
            return res.status(200).json({ successful: true, data: item })
        } catch (error) {
            next(error)
        }
    }

    async removeLike(req, res, next) {
        const { id, userId } = req.body
        try {
            if (!id && !userId) {
                throw ApiError.BadRequest(`Wrong data. Please try again.`)
            }
            const user = await User.findOne({ where: { id: userId } })
            const item = await Item.findOne({ where: { id: id } })
            if (!user) {
                throw ApiError.BadRequest(`User doesn't exist.`)
            } else if (!item) {
                throw ApiError.BadRequest(`Item doesn't exist.`)
            }
            const n = await item.likes.includes(userId)
            if (!n) {
                throw ApiError.BadRequest(`User doesn't liked this item`)
            }
            await item.update({ likes: item.likes.filter(i => i !== userId) }, { where: { id: id } })
            return res.status(200).json({ successful: true, data: item })
        } catch (error) {
            next(error)
        }
    }

    async searchItem(req, res, next) {
        const { search } = req.query
        try {
            if (!search) {
                throw ApiError.BadRequest(`Please, type something. I found nothing.`)
            }
            const items = await Item.findAll({ where: { title: { [Op.iLike]: '%' + search + '%' } } })
            return res.status(200).json({ successful: true, items })
        } catch (error) {
            next(error)
        }
    }

    async getTags(req, res, next) {
        try {
            let tags = []
            await Collection.findAll()
                .then(c => c.map(c => c.tags.map(t => tags.push(t))))
                .then(() => tags = [...new Set(tags)])
            return res.status(200).json({ successful: true, tags })
        } catch (error) {
            next(error)
        }
    }

    async findByTag(req, res, next) {
        const { tag } = req.body
        try {
            if (!tag) {
                throw ApiError.BadRequest(`Please, type something. I found nothing.`)
            }
            const items = await Item.findAll()
            .then(i => i.filter(i => i.tags.includes(tag)))
            return res.status(200).json({ successful: true, items })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ItemController()