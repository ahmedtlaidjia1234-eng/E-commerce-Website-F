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
        defaultValue : 'address',
        allowNull : false
    },
    desc : {
        type : DataTypes.STRING,
        defaultValue : 'description',
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
        defaultValue : 'vission',
        allowNull : false
    },
    mission : {
        type : DataTypes.STRING,
        defaultValue : 'misson',
        allowNull : false
    },
    story : {
        type : DataTypes.STRING,
        defaultValue : 'your Company Story',
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
    }
    })

module.exports = CompanyInfoModel