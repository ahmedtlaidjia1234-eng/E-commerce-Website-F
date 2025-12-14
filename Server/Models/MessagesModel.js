const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/database.js')



const MessagesModel = sequelize.define('Messages',{
    Name : {
       type: DataTypes.STRING,
        allowNull : false
    },
    email : {
       type: DataTypes.STRING,
        allowNull : false
    },
    subject : {
       type: DataTypes.STRING,
        allowNull : false
    },
    message : {
       type: DataTypes.STRING,
        allowNull : false
    },
    

    
    })

module.exports = MessagesModel