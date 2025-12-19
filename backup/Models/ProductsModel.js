const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/database.js')



const ProductsModel = sequelize.define('Products',{
      Name : {
       type: DataTypes.STRING,
        allowNull : false
    },
    category : {
       type: DataTypes.STRING,
        allowNull : false 
    },
    desc : { 
       type: DataTypes.STRING,
        allowNull : false 
    },  
    img : {
       type: DataTypes.STRING,
        allowNull : false
    },
    image_id : {
        type : DataTypes.STRING,
        allowNull : false
    },
    price : {
       type: DataTypes.STRING,
        allowNull : false
    },
    originalPrice : {
        type: DataTypes.STRING,
        allowNull : true 
    },
    // rating : {
    //    type: DataTypes.STRING,
    //     allowNull : false
    // },
    reviews : {
       type: DataTypes.JSONB,
        allowNull : true,
        defaultValue : () => []
    },
    stock : {
       type: DataTypes.STRING,
        allowNull : false
    },
    allowReviews : {
       type: DataTypes.BOOLEAN,
        defaultValue : true
    },
    garanty : {
       type: DataTypes.STRING,
        allowNull : false
    },
    discount : {
       type: DataTypes.STRING,
        allowNull : true
    },
     
  
    })

module.exports = ProductsModel