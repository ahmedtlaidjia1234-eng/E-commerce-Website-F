const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/database.js')


const CompanyInfoModel = sequelize.define('CompanyInfo',{
    companyName : {
        type : DataTypes.STRING,
        defaultValue : 'shopHub',
        allowNull : false
    },
    address : {
        type : DataTypes.STRING,
        defaultValue : 'Algeria/Setif',
        allowNull : false
    },
    desc : {
        type : DataTypes.STRING,
        defaultValue : 'Your premium destination for cutting-edge technology and amazing products.',
        allowNull : false
    }
    ,
    metaTitle : {
        type : DataTypes.STRING,
        defaultValue : 'metaData description',
        allowNull : false
    },
    metaDesc : {
        type : DataTypes.STRING,
        defaultValue : 'metaData description',
        allowNull : false
    },
    metaKeyWords : {
        type : DataTypes.ARRAY(DataTypes.STRING),
        defaultValue :[
            "something1",
            "something2"
        ],
        allowNull : false
    },
    vission : {
        type : DataTypes.STRING,
        defaultValue : 'To become the worlds most trusted e-commerce platform.',
        allowNull : false
    },
    mission : {
        type : DataTypes.STRING,
        defaultValue : 'To provide the best shopping experience with unbeatable prices and quality.',
        allowNull : false
    },
    story : {
        type : DataTypes.STRING,
        defaultValue : 'Founded in 2020 by a team of passionate entrepreneurs, ShopHub started as a small online store with a big vision. Today, we serve millions of customers worldwide.',
        allowNull : false
    },
    email :{
        type : DataTypes.STRING,
        defaultValue : 'email@shophub.com',
        allowNull : false
    },
    phone :{
        type : DataTypes.STRING,
        defaultValue : '0557362171',
        allowNull : false
    },
    founded : {
       type : DataTypes.STRING,
       defaultValue : '2020',
       allowNull : false 
    }
    })

module.exports = CompanyInfoModel