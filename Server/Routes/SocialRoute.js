const express = require("express");
const SocialModel = require("../Models/SocialModel");
const router = express.Router();

router.get("/getSocial", async (req, res) => {

try{
const social = await SocialModel.findAll()
if(social){
  res.status(200).json(social.data)
}
}catch(err){
  console.log(err)
  res.status(500).json(err)
}
  

});

router.post("/addSocial",async (req,res)=>{
  try{
const data = req.body.data
// console.log(data[1])
if(data.length > 1){
  let addSoc;
  for(let x = 0 ; x <= data?.length  ; x++){
    if(data[x]){
    const { icon , URL} = data[x]
     addSoc = await SocialModel.create({icon,URL}) 
    }
  }
  if(addSoc){
      res.status(200).json('added seccesfully!')
    } 
}else{
const { icon , URL} = req.body.data

const addSoc = await SocialModel.create({icon,URL})
if(addSoc){
  res.status(200).json('added seccesfully!')
}
}
    
  }
  catch(err){
    console.log(err)
    res.status(500).json(err)
  }
  
})

router.post('/deleteSocial', async (req,res)=>{
  try{

const {id} = req.body
const removeSocial = await SocialModel.destroy({where : {id}})

if(removeSocial){
  res.status(204).json('removed')
}else{
  res.status(400).json('cant remove this row please try again')
}
  }catch(err){
    console.log(err)
    res.status(500).json(err)
  }
})

module.exports = router;