const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/database.js')



const WishListModel = sequelize.define('WishList',{
    productName : {
       type: DataTypes.STRING,
        allowNull : false
    },
    

    
    })

module.exports = WishListModel