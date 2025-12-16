const express = require("express");
const router = express.Router();
const  User  = require("../Models/UserModel.js");
const WebsiteSettingsModel = require("../Models/WebSiteSettingsModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const sendEmail = require("../utils/Mailer.js");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
// const getUser = async (email,password) => {

//   const user = await User.findOne({ where: {email , password} });
//   if (user) {
//    res.status(200);
//    return user;
//   } else {
//     res.status(404).json({ error: "User not found" });
//   }


// }
 

router.post("/getAllUsers", async (req, res) => {
  const {email} = req.body || ''
  // console.log(req.body)
  let user;
  try{
    if(email){
      user = await User.findOne({where : {email}})
    }else{
      user = await User.findAll();
    }
 
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }


  }catch(err){
    console.log(err)
  }
  

});

router.post("/register", async (req, res) => {
  try {
    const {
      fName, lName, streetAdr, city,
      state, zipCode, country,
      password, email, phone, location , isAdmin
    } = req.body;

    console.log(isAdmin)

    // ✅ 1. Basic validation
    // if (!email || !password || !fName || !lName) {
    //   return res.status(400).json({ error: "Missing required fields" });
    // }

    // ✅ 2. Prevent duplicate email
    // const existingUser = await User.findOne({ where: { email } });
    // if (existingUser) {
    //   return res.status(409).json({ error: "Email already registered" });
    // }

    // 3. virify password min length

    const WebsiteSettings = await WebsiteSettingsModel.findAll()
    const passwordMinLength = WebsiteSettings[0].dataValues.security.minimumPasswordLength
    if(password.length < passwordMinLength) return res.status(401).json(`your password must have min length ${passwordMinLength}`)

    // ✅ 3. Create user (bcrypt hook will hash password)
    const newUser = await User.create({
      fName, lName,
      streetAdr, city, state,
      zipCode, country,
      password, email,
      phone, location , isAdmin
    });

    // ✅ 4. Send email AFTER successful insert
    try {
     
    //   await sendEmail(
    //      email, // recipient
    //     `Welcome to ${process.env.SITE_NAME || 'Our Service'}, ${fName}!`,
    //      `Hello ${fName} ${lName},\n\nThank you for registering at ${process.env.SITE_NAME || 'Our Service'}.\nWe are excited to have you onboard!`,
    //      `
    //       <div style="font-family: Arial, sans-serif; color: #333;">
    //         <h1 style="color: #2E86DE;">Welcome to ${process.env.SITE_NAME || 'Our Service'}, ${fName}!</h1>
    //         <p>Dear ${fName} ${lName},</p>
    //         <p>Thank you for registering with us. We are excited to have you onboard and look forward to providing you with the best experience.</p>
    //         <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
    //         <p style="margin-top: 20px;">Best regards,<br/>The ${process.env.SITE_NAME || 'ShopHub'} Team</p>
    //       </div>
    //     ` 
    //   );
    } catch (mailErr) {
      console.error("Email error:", mailErr.message);
    }

    const authUser = await User.update({ auth : true }, {where : {email}});
    if(!authUser){
      return res.status(401).json({ message: "Something Wrong" });
    }
    // ✅ 5. Final response
    res.status(201).json({ 
      user : newUser
    });

  } catch (err) {
    console.error("FULL DB ERROR:", err);

    res.status(500).json({
      name: err.name,
      message: err.message,
      errors: err.errors
    });
  }
});



router.put("/updateUser", async (req, res) => {

  const { fName, lName, streetAdr, city, state, zipCode, country, password, email, phone, location } = req.body.userSettings;
  const oldEmail = req.body.email
  // console.log(req.body.password)
  let oldpass ;
if(password === '' || password === undefined){
  const getOldData = await User.findOne({where : {email : oldEmail}})
  const oldPassword = getOldData.dataValues.password
  oldpass = oldPassword
  console.log(oldPassword)
}else{
  oldpass = password
}
// console.log(oldpass)
 const newUser = await User.update({fName, lName,
     streetAdr ,city, state,
   zipCode,
   country,
     password : oldpass, email, phone,
     location,
     
  },{where: {email : oldEmail} , individualHooks: true});
// console.log(newUser)
  if (newUser) {
    res.status(201).json(newUser);
  } else {
    res.status(400).json({ error: "Failed to create user" });
  }

});



router.post("/login", async (req, res) => {
  try {
    const  email = req.body.email;
    const pass = req.body.password;
    const firstTimeLog = req.body.firstTimeLog
    // 1. Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Wrong Email" });
    }

    // 2. check password Length
    
        const WebsiteSettings = await WebsiteSettingsModel.findAll()
    const passwordMinLength = WebsiteSettings[0].dataValues.security.minimumPasswordLength
    if(pass.length < passwordMinLength) return res.status(401).json(`your password must have min length ${passwordMinLength}`)

    // 3. Compare password with bcrypt
    
    const isValidPassword = await bcrypt.compare(pass, user.password);
  
    if (!isValidPassword) {
      return res.status(401).json({ error: "Wrong Password" });
    }
 
    // 3. Successful login response (DO NOT send password)
    const authUser = await User.update({ auth : true , firstTimeLog }, {where : {email}});
    if(!authUser){
      return res.status(401).json({ message: "Something Wrong" });
    }

    const authUser2 = await User.findOne({ where: { email } });
    const { password , ...userWP } = authUser2.dataValues; // Exclude password

const token = jwt.sign(
            // Payload: Data stored inside the token (DO NOT store the password!)
            { userId: userWP.id, role: userWP.isAdmin ,userWP,exp : userWP.expire},  
            // Secret Key
            JWT_SECRET,  
            // Options: Set token expiration
            // { expiresIn: userWP.expire } // Token expires in 1 hour
        );
 

        res.status(200).json({ 
            message: 'Login successful', 
            token: token
            // data
        });

    // console.log(user)
    // res.status(200).json({
    //   userWP
    // });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/logout", async (req, res) => {
  try {
    const email = req.body.email;
   
    const user = await User.update({ auth : false }, {where : {email}});
    if(!user){
      return res.status(401).json({ message: "Something Wrong" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post("/deleteUser", async (req, res) => {
  try{
     const { email } = req.body;
 

  const deletedUser = await User.destroy({ where: { email } });
  // const deletedUser = true
  if (deletedUser) {
    res.status(204).json('User deleted successfully');
  } else {
    res.status(404).json({ error: "User not found" });
  }
  }catch(err){
    res.status(500).json(err)
  }
  
});



router.put("/EditUserSettings", async (req, res) => {
  try{
     const { UserSettigns , email } = req.body;
 
    // console.log(req.body)
  const deletedUser = await User.update({UserSettigns} , { where: { email } });
  // const deletedUser = true
  // res.status(200).json('User deleted successfully');
  if (deletedUser) {
    res.status(200).json('User deleted successfully');
  } else {
    res.status(404).json({ error: "User not found" });
  }
  }catch(err){
    res.status(500).json(err)
  }
    
});



module.exports = router; 