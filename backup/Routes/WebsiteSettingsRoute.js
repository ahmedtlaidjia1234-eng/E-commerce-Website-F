const express = require("express");
const WebsiteSettingsModel = require("../Models/WebSiteSettingsModel");
const CompanyInfoModel = require("../Models/CompanyInfoModel");
const SocialModel = require("../Models/SocialModel");
const router = express.Router();

router.get("/getWebsiteSettings", async (req, res) => {
  try{
    const settings = await WebsiteSettingsModel.findAll()
    const companyInfo = await CompanyInfoModel.findAll()
    const social = await SocialModel.findAll()
    if(settings.length > 0 && companyInfo.length > 0 && social.length > 0){
      // console.log(social[0].dataValues)
      
      const data = {
        settings : settings[0]?.dataValues || {},
       companyInfo : companyInfo[0]?.dataValues || {},
        socialMedia : social
      }
      res.status(200).json(data)
    }else{
      const addSett = await WebsiteSettingsModel.create();
      const addCom = await CompanyInfoModel.create();
      const addSecials = await SocialModel.create(); 

      if(addSett,addCom,addSecials){
       const reSettings = await WebsiteSettingsModel.findAll()
       const reCompanyInfo = await CompanyInfoModel.findAll()
       const reSocial = await SocialModel.findAll()
        
        const data = {
          settings : reSettings[0]?.dataValues || {},
         companyInfo : reCompanyInfo[0]?.dataValues || {},
          socialMedia : reSocial
        }
        res.status(200).json(data)
      }

    }
  }catch(err){
    console.log(err)
    res.status(500).json(err)
  }
});


router.post("/addWebsiteSettings", async (req, res) => {
  try{
    const settings = await WebsiteSettingsModel.create()
    const companyInfo = await CompanyInfoModel.create()
    const social = await SocialModel.create()
    if(settings && companyInfo && social){
      const data = [
        settings,
       companyInfo,
        social
      ]
  
      res.status(200).json(data)
    }
  }catch(err){
    console.log(err)
    res.status(500).json(err)
  }
});


router.put("/updateWebsiteSettings", async (req, res) => {
  try {
    const { settings, companyInfo, socialMedia  } = req.body.settings;
    // console.log(companyInfo)
    // ✅ Update Website Settings
    await WebsiteSettingsModel.update(
      {
        colors: settings.colors,
        commerce: settings.commerce,
        security: settings.security,
        features : settings.features
      },
      { where: { id: settings.id } }
    );

    // ✅ Update Company Info
    await CompanyInfoModel.update(
      {
        address: companyInfo.address,
        companyName: companyInfo.companyName,
        desc: companyInfo.desc,
        email: companyInfo.email,
        metaTitle: companyInfo.metaTitle,
        metaDesc: companyInfo.metaDesc,
        metaKeyWords: companyInfo.metaKeyWords,
        mission: companyInfo.mission,
        vission: companyInfo.vission,
        phone: companyInfo.phone,
        story: companyInfo.story,
      },
      { where: { id: companyInfo.id } }
    );

    // ✅ OPTIONAL: update social media if sent
    if (Array.isArray(socialMedia)) {
      for (const social of socialMedia) {
        if (social.id) {
          await SocialModel.update(
            { icon: social.icon, URL: social.URL },
            { where: { id: social.id } }
          );
        }
      }
    }

    // ✅ Fetch updated data
    const updatedSettings = await WebsiteSettingsModel.findOne({
      where: { id: settings.id },
    });

    const updatedCompanyInfo = await CompanyInfoModel.findOne({
      where: { id: companyInfo.id },
    });

    const updatedSocial = await SocialModel.findAll();

    // ✅ Single response
    return res.status(200).json({
      settings: updatedSettings,
      companyInfo: updatedCompanyInfo,
      socialMedia: updatedSocial,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}); 


module.exports = router;