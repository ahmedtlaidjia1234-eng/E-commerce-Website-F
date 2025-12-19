

const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/database.js')
const bcrypt = require('bcryptjs');

const User = sequelize.define('users',{
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
    isAdmin : {
        type : DataTypes.BOOLEAN,
        defaultValue: false, 
    },
    fName : {
        type : DataTypes.STRING,
        allowNull : false
    },
    lName : {
        type : DataTypes.STRING,
        allowNull : false
    },
    streetAdr : {
        type : DataTypes.STRING,
        allowNull : false
    },
    city : {
        type : DataTypes.STRING,
        allowNull : false
    },
    state : {
        type : DataTypes.STRING,
        allowNull : false
    },
    zipCode : {
        type : DataTypes.STRING,
        allowNull : false
    },
    country : {
        type : DataTypes.STRING,
        allowNull : false
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    auth : {
        type : DataTypes.BOOLEAN,
        defaultValue: false,
    },
    email:{
       type : DataTypes.STRING,
        allowNull : false,
        },
    phone:{
       type : DataTypes.STRING,  
        allowNull : false 
    },
     location:{
       type : DataTypes.STRING,  
        allowNull : true 
    },
  img:{
       type : DataTypes.STRING,
        allowNull : true
    },
    expire : {
        type : DataTypes.INTEGER,
        defaultValue : 10000,
        allowNull : true
    },
    wishlist : {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull : true,
        defaultValue : []
    },
    userSettings : {
        type : DataTypes.JSONB,
        allowNull : true,
        defaultValue :
            {
            enableNotification : false,
            enableWishList : false,
            enableCaptcha : false,
            Two_Factor_Auth : false
        },
             
         
    },
    followed :{
        type : DataTypes.BOOLEAN,
        defaultValue : false
    },
    firstTimeLog : {
        type : DataTypes.BOOLEAN,
        defaultValue : true
    } 
} 
, {
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user) => {
      if (user.changed("password")) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
}
}

)




module.exports = User;

