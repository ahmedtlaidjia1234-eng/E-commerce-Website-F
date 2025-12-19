const express = require("express");
const router = express.Router();
const MessagesModel = require('../Models/MessagesModel.js');
const CompanyInfoModel = require("../Models/CompanyInfoModel.js");
const sendEmail = require("../utils/Mailer.js");

 
router.get("/getMessages", async (req, res) => {
  try {
    const messages = await MessagesModel.findAll();
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/addMessage', async(req, res) => {
  try{

    const { Name, email, subject, message } = req.body.messageData;
    // console.log(req.body)
    const newMessage = await MessagesModel.create({
      Name,
       email, 
     subject,
     message,
      isRead: false
    });
    if(newMessage){

      try{
      
      if(await sendEmail(
        process.env.EMAIL_USER,
        email, 
        "Message Received",
        `Dear ${Name}, we have received your message regarding "${subject}". Our team will get back to you shortly.`,
        `<p>Dear ${Name},</p><p>We have received your message regarding "<strong>${subject}</strong>". Our team will get back to you shortly.</p><p>Best regards,<br/>E-Commerce Team</p>`,
        false
      
      )){
        console.log("Acknowledgment email sent to user.");
      }

      await sendEmail(
        process.env.EMAIL_USER,
        process.env.EMAIL_USER, 
        `New Message from ${Name}`,
        `You have received a new message from ${Name} (${email}) regarding "${subject}": ${message}`,
        `<p>You have received a new message from <strong>${Name}</strong> (${email}) regarding "<strong>${subject}</strong>":</p><p>${message}</p>`,
        true
      
      );

      }catch(err){
        console.error("❌ Error sending acknowledgment email:", err);
      }
      


      return res.status(200).json({ error: "message sent successfully" });
    }

    return res.status(400).json({ message: "failed to send message" });

  }catch(err){
  return  res.status(500).json(err.message);
  }

});


router.put('/markAsRead/:id', async(req, res) => {
  try{
    const messageId = req.params.id;
    const message = await MessagesModel.findByPk(messageId);
    if(!message){
      return res.status(404).json({ error: "Message not found" });
    }
    message.isRead = true;
    await message.save();
    return res.status(200).json({ message: "Message marked as read" });
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/deleteMessage/:id', async(req, res) => {
  try{
    const messageId = req.params.id;
    const deletionCount = await MessagesModel.destroy({ where: { id: messageId } });
    if(deletionCount === 0){
      return res.status(404).json({ error: "Message not found" });
    }
    return res.status(200).json({ message: "Message deleted successfully" });
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;