const {sequelize} = require('../config/database.js')
const UserModel = require('./UserModel.js')
const SocialModel = require('./SocialModel.js')


// UserModel.hasMany(SocialModel,{foreignKey : 'userID' ,onDelete : 'CASCADE'})
// SocialModel.belongsTo(UserModel,{foreignKey : 'userID'})

 
module.exports = {
    sequelize,
    UserModel,
    SocialModel
}