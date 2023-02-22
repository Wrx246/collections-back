
const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING, unique: true },
})

const Collection = sequelize.define('collection', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING, allowNull: true },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING) },
    theme: { type: DataTypes.STRING },
    author: { type: DataTypes.BOOLEAN, allowNull: true },
    language: { type: DataTypes.BOOLEAN, allowNull: true },
    shortName: { type: DataTypes.BOOLEAN, allowNull: true },
    comment: { type: DataTypes.BOOLEAN, allowNull: true },
    additionalInfo: { type: DataTypes.BOOLEAN, allowNull: true },
    country: { type: DataTypes.BOOLEAN, allowNull: true },
    publication: { type: DataTypes.BOOLEAN, allowNull: true },
    foundation: { type: DataTypes.BOOLEAN, allowNull: true },
    terminated: { type: DataTypes.BOOLEAN, allowNull: true },
    price: { type: DataTypes.BOOLEAN, allowNull: true },
    reward: { type: DataTypes.BOOLEAN, allowNull: true },
    score: { type: DataTypes.BOOLEAN, allowNull: true },
    favorite: { type: DataTypes.BOOLEAN, allowNull: true },
    status: { type: DataTypes.BOOLEAN, allowNull: true },
    original: { type: DataTypes.BOOLEAN, allowNull: true },
}) 

const Item = sequelize.define('item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
    title: { type: DataTypes.STRING },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING) },
    likes: { type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: [] },
    author: { type: DataTypes.STRING, allowNull: true },
    language: { type: DataTypes.STRING, allowNull: true },
    shortName: { type: DataTypes.STRING, allowNull: true },
    comment: { type: DataTypes.TEXT, allowNull: true },
    additionalInfo: { type: DataTypes.TEXT, allowNull: true },
    country: { type: DataTypes.TEXT, allowNull: true },
    publication: { type: DataTypes.DATE, allowNull: true },
    foundation: { type: DataTypes.DATE, allowNull: true },
    terminated: { type: DataTypes.DATE, allowNull: true },
    price: { type: DataTypes.INTEGER, allowNull: true },
    reward: { type: DataTypes.INTEGER, allowNull: true },
    score: { type: DataTypes.INTEGER, allowNull: true },
    favorite: { type: DataTypes.BOOLEAN, allowNull: true },
    status: { type: DataTypes.BOOLEAN, allowNull: true },
    original: { type: DataTypes.BOOLEAN, allowNull: true },
})

const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
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