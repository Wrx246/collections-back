const { Comment } = require('../models/Models')
const ApiError = require('../exceptions/error')

class CommentController {
    async createComment(req, res, next) {
        const { itemId, text, author } = req.body
        try {
            if (!text && !author) {
                throw ApiError.BadRequest('Incorrect data. Please try create comment again.')
            }
            await Comment.create({ text, author, itemId })
            const comment = await Comment.findOne({ where: { text: text, itemId: itemId } })
            return res.status(200).json({ successful: true, message: `Comment created.`, comment: comment })
        } catch (error) {
            next(error)
        }
    }
    async getComments(req, res, next) {
        const { itemId } = req.params
        try {
            if (!itemId) {
                throw ApiError.BadRequest(`Incorrect data. Please try again.`)
            }
            const comments = await Comment.findAll({ where: { itemId: itemId } })
            if (!comments) {
                throw ApiError.BadRequest(`This item has no comments`)
            }
            return res.status(200).json({ successful: true, comments: comments })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CommentController()