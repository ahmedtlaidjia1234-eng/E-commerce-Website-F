const express = require("express");
const router = express.Router();
const OrdersModel = require('../Models/OrdersModel.js')

router.get("/getOrders",async (req, res) => {
  try{
    const getOrders = await OrdersModel.findAll()

    if(getOrders){
      res.status(200).json(getOrders)
    }
  }catch(err){
    console.log(err)
  }
});

router.post('/addOrder', async (req,res) => {
try{
const {Status,customerid,customerName,
  customerEmail,customerPhone,total,
  trackingNumber,items,shippingAddress,
  billingAddress} = req.body
  // console.log(truckingNumber)
const addReq = await OrdersModel.create({Status,customerid,customerName,
  customerEmail,customerPhone,total,
  trackingNumber,items,shippingAddress,
  billingAddress})
  if(addReq){
    res.status(200).json(addReq)
  }

}catch(err){
  console.log(err)
  res.status(400).json(err)
}
})


router.put('/updateOrder', async (req,res) => {
try{
const {id,Status,customerName,
  customerEmail,customerPhone,
  trackingNumber,note
  } = req.body.orderData
  // console.log(truckingNumber)
const updateReq = await OrdersModel.update({Status,customerName,
  customerEmail,customerPhone,
  trackingNumber,note
  },{where : {id}})
  if(updateReq){
    const getOrders = await OrdersModel.findAll()
    if(getOrders)
    res.status(200).json(getOrders)
  }

}catch(err){
  console.log(err)
  res.status(400).json(err)
}
})

router.delete('/deleteOrder/:id', async(req,res)=>{
try{
const {id} = req.params
const deleteReq = await OrdersModel.destroy({where : {id}})
if(deleteReq){
  const getOrders =  await OrdersModel.findAll()
  if(getOrders)
  res.status(200).json(getOrders)
}
}catch(err){
  console.log(err)
}
})

module.exports = router;