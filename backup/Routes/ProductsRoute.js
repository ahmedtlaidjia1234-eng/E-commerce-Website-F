const express = require("express");
const router = express.Router();
const ProductsModel = require('../Models/ProductsModel')
const axios = require('axios')


router.get("/getProducts", async (req, res) => {
  try{
    const products = await ProductsModel.findAll()
    if(products){
      // const discountNum = 
      res.status(200).json(products)
    }
  }catch(err){
    console.log(err)
    res.status(500).json(err)
  }
});


router.put("/addDiscount", async (req, res) => {
  try{
    const {productId , discount , price} = req.body
    const discounts = await ProductsModel.update({discount,price},{where : {id : productId}})
    if(discounts){
      res.status(200).json('discount applyed')
    }
  }catch(err){
    console.log(err)
    res.status(500).json(err)
  } 
});


router.post("/addProduct", async (req, res) => {
  try{
    const {Name ,category ,price ,stock ,garanty ,img ,image_id ,desc} = req.body.product
  // console.log(req.body.product)
      const addProduct = await ProductsModel.create({Name ,category ,price ,stock ,garanty ,img ,desc , originalPrice : price , image_id})
  // console.log(req.body)
      if(addProduct){
    // console.log(addProduct)
    res.status(200).json(addProduct)
  }
  }catch(err){
    console.log(err)
    res.status(500).json(err)
  }
});


router.put("/updateProduct", async (req, res) => {
  try{
    const {id,Name ,category ,price ,stock ,garanty ,img ,desc,originalPrice ,allowReviews,reviews} = req.body.productData
  console.log(req.body.price)
      const updateProduct = await ProductsModel.update({Name ,category ,price ,stock ,garanty ,img ,desc , originalPrice, allowReviews,reviews},{where : {id}})
  // console.log(req.body)
      if(updateProduct){
    // console.log(updateProduct)
    res.status(200).json(updateProduct)
  }
  }catch(err){ 
    console.log(err)
    res.status(500).json(err)
  }
});

router.post('/addReview', async (req,res)=>{
  const {reviews , ProductId} = req.body
  const ReviewReq = await ProductsModel.update({reviews},{where : {id : ProductId}}) 
  if(ReviewReq){
    res.status(200).json('added succesfully')
  }
})

 
router.delete("/deleteProduct/:id", async (req, res) => {
  try{
    const {id} = req.params
    console.log(id)
  // console.log(req.body.product)
      const deleteProduct = await ProductsModel.destroy({where : {id}})
  // console.log(req.body)
      if(deleteProduct){
    console.log(deleteProduct)
    res.status(200).json(deleteProduct)
  }
  }catch(err){
    console.log(err)
    res.status(500).json(err)
  }
});


router.post("/deleteImage", async (req, res) => {
  try {
    const { url } = req.body;
    const result = await axios.post(url); // server-side
    if(result.status == 200){
      res.json({ success: true, data: result.data });
      console.log(result)
    }else res.json({ success: false, data: result.data });

    
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});


module.exports = router; 