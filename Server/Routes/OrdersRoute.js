const express = require("express");
const router = express.Router();

router.get("/getOrders", (req, res) => {
  res.send("User Route");
});

module.exports = router;