const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/database.js')



const OrdersModel = sequelize.define('orders',{
    Status : {
       type: DataTypes.STRING,
        allowNull : false
    },
    customerid : {
        type: DataTypes.INTEGER,
        allowNull : false
    },
    customerName : {
       type: DataTypes.STRING,
        allowNull : false
    }, 
    customerEmail : {
       type: DataTypes.STRING,
        allowNull : false
    },
    customerPhone : {
       type: DataTypes.STRING,
        allowNull : false
    },
    total : {
       type: DataTypes.STRING,
        allowNull : false
    },
    trackingNumber : {
       type: DataTypes.STRING,
        allowNull : false
    },
    items : {
        type : DataTypes.JSONB,
        defaultValue : [],
        allowNull : false
    },
    shippingAddress : {
       type: DataTypes.JSONB,
       defaultValue : {},
        allowNull : false
        
    },
    billingAddress :{
        type: DataTypes.JSONB,
        defaultValue : {},
        allowNull : false
    },
    note :{
        type : DataTypes.STRING,
        allowNull : true
    }
    
    })

module.exports = OrdersModel