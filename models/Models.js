
const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING, unique: true },
})

const Collection = sequelize.define('collection', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING) },
    theme: { type: DataTypes.STRING },
})

const Item = sequelize.define('item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },
})

const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.STRING },
    author: { type: DataTypes.STRING },
})

User.hasMany(Collection)
Collection.belongsTo(User)

Collection.hasMany(Item)
Item.belongsTo(Collection)

Item.hasMany(Comment)
Comment.belongsTo(Item)

module.exports = { User, Collection, Item, Comment }