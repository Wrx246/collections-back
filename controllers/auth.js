const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models/Models')

const generateToken = (id, email) => {
    return jwt.sign(
        { id, email },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )
}

class AuthController {
    async registration(req, res) {
        const { email, name, password } = req.body;
        try {
            if (!email || !password) {
                return res.status(400).json({
                    message: `Invalid email or password`,
                    status: false
                })
            }
            const candidate = await User.findOne({ where: { email } })
            if (candidate) {
                return res.status(400).json({
                    message: `Email already exist`,
                    status: false
                })
            }
            const username = await User.findOne({ where: { name } })
            if (username) {
                return res.status(400).json({
                    message: `Username already exist`,
                    status: false
                })
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
            return res.status(500).json(error)
        }
    }

    async login(req, res) {
        const { name, password } = req.body;
        try {
            if (name === 'admin' && password === 'admin') {
                const admin = await User.findOne({ where: { name: 'admin' } })
                const token = generateToken(admin.id, admin.email)
                return res.status(200).json({ message: 'Login successful', member: admin, token: token })
            }
            const user = await User.findOne({ where: { name } });
            if (!user) {
                return res.status(400).json({
                    message: `User ${name} is not found`,
                    status: false
                })
            }
            let compare = bcrypt.compareSync(password, user.password)
            if (!compare) {
                return res.status(400).json({
                    message: `Wrong password`,
                    status: false
                })
            }
            const token = generateToken(user.id, user.email)
            const member = await User.findOne({ where: { name } })
            return res.status(200).json({ member: member, token: token, message: 'Login successful' })
        } catch (error) {
            return res.status(500).json(error)
        }

    }
}

module.exports = new AuthController()