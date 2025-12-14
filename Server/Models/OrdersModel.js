const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/database.js')



const OrdersModel = sequelize.define('orders',{
    Status : {
       type: DataTypes.STRING,
        allowNull : false
    },
    total : {
       type: DataTypes.STRING,
        allowNull : false
    },
    items : {
       type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull : false
    },
    shiping : {
       type: DataTypes.STRING,
        allowNull : false
    },
    address : {
       type: DataTypes.STRING,
        allowNull : false
    },
    truckingNumber : {
       type: DataTypes.STRING,
        allowNull : false
    },
    

    
    })

module.exports = OrdersModel