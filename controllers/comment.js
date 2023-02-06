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
            res.status(500).json(error)
        }
    }
}

module.exports = new CommentController()