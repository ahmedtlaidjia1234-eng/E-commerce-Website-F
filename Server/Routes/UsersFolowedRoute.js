const express = require("express");
const UsersFolowedModel = require("../Models/UsersFolowedModel");
const router = express.Router();
const sendEmail = require('../utils/Mailer')
const UserModel = require('../Models/UserModel')
const {validate} = require('deep-email-validator')

router.get("/getFollowers", async (req, res) => {
    
  try{
  const followers = await UsersFolowedModel.findAll()
  if(followers){ 
    res.status(200).json(followers)
  }else{
    res.status(404).json('cant get users')
  }
}
  catch(err){
    console.log(err)
    res.status(500).json(err)
  }
});

router.post("/addFollower",async (req,res)=>{
  try{
    const {email,fName} = req.body
    const emailValidator = await validate(email);
    if(!emailValidator.valid) return res.status(404).json('cant reach this email please write a valid email')
      
      // see if the user is already followed 
      const followed = await UsersFolowedModel.findOne({where : {email}})
      if(followed){
        console.log(followed.dataValues)
        const deleteF = await UsersFolowedModel.destroy({where : {id : followed.dataValues.id}})
        if(deleteF){
          res.status(200).json('removed')
        }
        
        return
      }else{
        


        const addFollower = await UsersFolowedModel.create({email,fName})
    if(addFollower){

      // ✅ 1. Send email AFTER successful insert
    try {
     
      await sendEmail(
         email, // recipient
        `Welcome to ${process.env.SITE_NAME || 'Our Service'}, ${fName}!`,
         `Hello ${(fName ?? 'friend')},\n\nThank you for registering at ${process.env.SITE_NAME || 'Our Service'}.\nWe are excited to have you onboard!`,
         `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h1 style="color: #2E86DE;">Welcome to ${process.env.SITE_NAME || 'Our Service'}, ${fName}!</h1>
            <p>Dear ${(fName ?? 'my friend')},</p>
            <p>Thank you for registering with us. We are excited to have you onboard and look forward to providing you with the best experience.</p>
            <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
            <p style="margin-top: 20px;">Best regards,<br/>The ${process.env.SITE_NAME || 'ShopHub'} Team</p>
          </div>
        ` 
      );
    } catch (mailErr) {
      console.error("Email error:", mailErr.message);
    }

    const updateUser = await UserModel.update({followed : true,firstTimeLog : false},{where : {email}}) 
    if(updateUser){
      res.status(200).json('user follower you with success')
    }
    

    }


      }
    
      
  }catch(err){
    console.log(err)
    res.status(500).json(err)
  }
})




module.exports = router;