const { Comment } = require('../models/Models')

class CommentController {
    async createComment(req, res) {
        const { itemId, text, author } = req.body
        try {
            if (!text && !author) {
                return res.status(400).json({ successful: false, message: `Incorrect data. Please try create comment again.` })
            }
            await Comment.create({ text, author, itemId })
            const comment = await Comment.findOne({ where: { text: text, itemId: itemId } })
            return res.status(200).json({ successful: true, message: `Comment created.`, comment: comment })
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    async getComments(req, res) {
        const { itemId } = req.params
        try {
            if (!itemId) {
                return res.status(400).json({ successful: false, message: `Incorrect data. Please try again.` })
            }
            const comments = await Comment.findAll({ where: { itemId: itemId } })
            if (!comments) {
                return res.status(500).json({ successful: true, message: `This item has no messages` })
            }
            return res.status(200).json({ successful: true, comments: comments })
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

module.exports = new CommentController()