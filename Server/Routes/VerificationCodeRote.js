const express = require("express");
const router = express.Router();
const VerificationCodeModel = require("../Models/VerificationCodeModel.js");
const sendEmail = require("../utils/Mailer.js");

router.post("/addCode", async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  try {
    // 1️⃣ Create verification code
    const newCode = await VerificationCodeModel.create({ email, code });
    if (!newCode) {
      return res.status(400).json({ error: "Could not create verification code" });
    }

    // 2️⃣ Send verification email
    
      await sendEmail(
        email, 
        "Your Verification Code",
        `Your verification code is: ${code}`,
        `<p>Your verification code is: <strong>${code}</strong></p>`
      );
      console.log(email)
    

    // 3️⃣ Auto-delete this code after 1 hour
    setTimeout(async () => {
      try {
        await VerificationCodeModel.destroy({ where: { id: newCode.id } });
        console.log(`✅ Verification code for ${email} expired and deleted`);
      } catch (err) {
        console.error("❌ Error deleting verification code:", err);
      }
    }, 60 * 60 * 1000); // 1 hour

    // 4️⃣ Respond to client
    res.status(201).json({ message: "Verification code created and sent", codeId: newCode.id });

  } catch (error) {
    console.error("❌ Error creating verification code:", error);
    res.status(500).json({ error: "Failed to create verification code" });
  }
});

router.post("/verifyCode", async (req, res) => {
    const {email, code} = req.body;
    try {
        const foundCode = await VerificationCodeModel.findOne({ where: { email } });
        if (!foundCode) {
            return res.status(404).json({ error: "you took so long to enter the code please try again ." });
        }
        if (foundCode.code !== code) {
            return res.status(400).json({ error: "Invalid verification code" });
        }

        res.status(200).json({ message: "Verification code is valid" });

        try {
        await VerificationCodeModel.destroy({ where: { email , code } });
        console.log(`✅ Verification code for ${email} expired and deleted`);
      } catch (err) {
        console.error("❌ Error deleting verification code:", err);
      }

    } catch (error) {
        res.status(500).json({ error: "Failed to verify code" });
    }
});



module.exports = router;