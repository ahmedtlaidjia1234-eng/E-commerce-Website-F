const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/database.js')


const UsersFolowedModel = sequelize.define('UsersFolowed',{
    email : {
        type : DataTypes.STRING,
        allowNull : false
    },
    fName : {
        type : DataTypes.STRING,
        allowNull : true
    }
    
    })

module.exports = UsersFolowedModel