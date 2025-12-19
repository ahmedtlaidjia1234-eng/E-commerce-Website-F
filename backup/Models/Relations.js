const {sequelize} = require('../config/database.js')
const UserModel = require('./UserModel.js')
const SocialModel = require('./SocialModel.js')
const UsersFolowedModel = require('./UsersFolowedModel.js')

// UserModel.hasMany(SocialModel,{foreignKey : 'userID' ,onDelete : 'CASCADE'})
// SocialModel.belongsTo(UserModel,{foreignKey : 'userID'})

// Define other relationships here as needed
// UserModel.hasOne(UsersFolowedModel, { foreignKey: 'userID', onDelete: 'CASCADE' });
// UsersFolowedModel.belongsTo(UserModel, { foreignKey: 'userID' });

 
module.exports = {
    sequelize,
    UserModel,
    SocialModel
}