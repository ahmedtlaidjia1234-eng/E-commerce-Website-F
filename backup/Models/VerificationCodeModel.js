const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/database.js')


const VerificationCodeModel = sequelize.define('VerificationCode',{
    email : {
        type : DataTypes.STRING, 
        unique : true,
        allowNull : false
    },
    code : {
        type : DataTypes.STRING,
        unique : true,
        allowNull : false
    },

    
    })

module.exports = VerificationCodeModel