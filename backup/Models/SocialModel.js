const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/database.js')



const SocialModel = sequelize.define('socials',{
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, 
  },
  // userID: {
  //   type: DataTypes.INTEGER,
  //   allowNull : false,
  //   references:{  
  //       model : 'users',
  //       key : 'id'
  //   },
  //   onDelete: 'CASCADE'
  // },
    icon : {
       type: DataTypes.ENUM('facebook','twitter','instagram','linkedin','youtube'),
        allowNull : false,
        defaultValue : 'facebook'
    },
    URL : {
       type: DataTypes.STRING,
       defaultValue : 'http://',
        allowNull : false
    },
    
    

    
    })

module.exports = SocialModel