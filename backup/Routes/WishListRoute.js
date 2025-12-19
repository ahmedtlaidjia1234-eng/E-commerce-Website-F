const express = require("express");
// const WishListModel = require("../Models/WishListModel");
const router = express.Router();
const User = require("../Models/UserModel.js");

router.post("/addProduct", async (req, res) => {
try{
  const {productId,userId} = req.body
  const user =  await User.findOne({where : {id : userId}})
  if(!user){
    return res.status(404).json({error : 'User not found'})
  }
  let existingProductIds = user.wishlist || []
  if(!Array.isArray(existingProductIds)){
    existingProductIds = []
  }
  // Check for duplicates
  // const newProductIds = user.wishlist.filter(id => id.productId !== productId);
  const updatedProductIds = [...user.wishlist, productId];

  
  const updateUser = await User.update({wishlist : updatedProductIds},{where : {id : userId}})
  if(updateUser){
    return  res.status(200).json('success')
  }

}catch(err){
  console.log(err)
  return res.status(500).json(err)
}
});

router.put("/removeProduct", async (req, res) => {
  try{
    const {productId,userId} = req.body
    const user =  await User.findOne({where : {id : userId}})
    if(!user){
      return res.status(404).json({error : 'User not found'})
    }
    let existingProductIds = user.wishlist
    if(!Array.isArray(existingProductIds)){
      existingProductIds = []
    }
    // Remove the productId
    const updatedProductIds = existingProductIds.filter(id => id != productId);
  

    const updateUser = await User.update({wishlist : updatedProductIds},{where : {id : userId}})
    if(updateUser){
      return  res.status(200).json('success')
    }
  }catch(err){
    console.log(err)
    return res.status(500).json(err)
  }
  });

module.exports = router;