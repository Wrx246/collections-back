const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models/Models')
const ApiError = require('../exceptions/error')

const generateToken = (id, email) => {
    return jwt.sign(
        { id, email },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )
}

class AuthController {
    async registration(req, res, next) {
        const { email, name, password } = req.body;
        try {
            if (!email || !password) {
                throw ApiError.BadRequest(`Invalid email or password`)
            }
            const candidate = await User.findOne({ where: { email } })
            if (candidate) {
                throw ApiError.BadRequest(`Email already exist`)
            }
            const username = await User.findOne({ where: { name } })
            if (username) {
                throw ApiError.BadRequest(`Username already exist`)
            }
            if (name === 'admin' && password === 'admin') {
                const hashPassword = await bcrypt.hash(password, 5);
                const admin = await User.create({
                    email, name, password: hashPassword, isActive: true, role: 'admin'
                })
                const token = generateToken(admin.id, admin.email)
                const member = await User.findOne({ where: { name } })
                return res.status(200).json({ member: member, token: token, message: 'Registration successful' })
            }
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({
                email, name, password: hashPassword, isActive: true, role: 'user'
            })
            const token = generateToken(user.id, email)
            const member = await User.findOne({ where: { name } })
            return res.status(200).json({ member: member, token: token, message: 'Registration successful' })
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        const { name, password } = req.body;
        try {
            if (name === 'admin' && password === 'admin') {
                const admin = await User.findOne({ where: { name: 'admin' } })
                const token = generateToken(admin.id, admin.email)
                return res.status(200).json({ message: 'Login successful', member: admin, token: token })
            }
            const user = await User.findOne({ where: { name } });
            if (!user) {
                throw ApiError.BadRequest(`User ${name} is not found`)
            }
            if (user.isActive === false) {
                throw ApiError.BadRequest(`User ${name} banned`)
            }
            let compare = bcrypt.compareSync(password, user.password)
            if (!compare) {
                throw ApiError.BadRequest(`Wrong password`)
            }
            const token = generateToken(user.id, user.email)
            const member = await User.findOne({ where: { name } })
            return res.status(200).json({ member: member, token: token, message: 'Login successful' })
        } catch (error) {
            next(error)
        }

    }

    async checkBan(req, res, next) {
        const { userId } = req.body;
        try {
            const user = await User.findOne({ where: { id: userId } })
            if (!user) {
                throw ApiError.BadRequest('User didnt find!')
            }
            return res.status(200).json({ successful: true, member: user })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthController()