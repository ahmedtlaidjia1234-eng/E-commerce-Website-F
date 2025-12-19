const express = require("express");
const CompanyInfoModel = require("../Models/CompanyInfoModel");
const router = express.Router();

router.get("/getCompanyInfo", async (req, res) => {
   try{
    const companyInfo = await CompanyInfoModel.findAll()
    if(companyInfo){
      res.status(200).json(companyInfo.data)
    }
  }catch(err){
    console.log(err)
    res.status(500).json(err)
  }
});


router.put("/editCompanyInfo", async (req, res) => {
   try{
    const companyInfo = await CompanyInfoModel.findAll()
    if(companyInfo){
      res.status(200).json(companyInfo.data)
    }
  }catch(err){
    console.log(err)
    res.status(500).json(err)
  }
});

router.post("/addCompanyInfo", async (req, res) => {
   try{
    const {} = req.body
    const companyInfo = await CompanyInfoModel.findAll()
    if(companyInfo){
      res.status(200).json(companyInfo.data)
    }
  }catch(err){
    console.log(err)
    res.status(500).json(err)
  }
});


module.exports = router;