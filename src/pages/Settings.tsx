import { motion } from 'framer-motion';
import { useState, useEffect, use } from 'react';
import { Palette, Globe, Bell, Shield, Database, Code, Save, RotateCcw, Eye, Paintbrush, Currency, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useStore } from '@/lib/store';
import { features } from 'process';

export default function SettingsPage() {
  const { AddSocial,DeleteSocial,websiteSettings,getWebsiteSettings,updateWebsiteSettings,currentUser, addNotification, themeColors, updateThemeColors, resetThemeColors, applyThemeToDOM } = useStore();
  const isAdmin = currentUser?.isAdmin;
  const [settings, setSettings] = useState({
    // General Settings
   settings: {
    colors: 
    { 
      info: "#3B82F6",
      error: "#EF4444",
      success: "#10B981",
      warning: "#F59E0B",
      accentColor: "#F59E0B",
      primaryText: "#111827",
      primaryColor: "#3B82F6",
      surfaceColor: "#FFFFFF",
      secondaryText: "#6B7280",
      secondaryColor: "#8B5CF6",
      backGroundColor: "#F9FAFB",
      elementsBackgroundColor : '#ffffff'
    }
    ,
    features: {
      enableReviews: false,
      enableWishlist: false,
      enableNotifications: false,
      enableShowProductRatings: false
    },
    commerce: {
      taxRate: 8,
      currency: "EUR",
      defaultShippingCost: 9.99
    },
    security: {
      sessionTimeout: 60,
      minimumPasswordLength: 8,
      enableTwoFactorAuthentication: ''
    }
  },
  companyInfo: {
    companyName: "",
    address: "",
    desc: "",
    metaTitle : '',
    metaDesc: "",
    metaKeyWords : [],
    vission: "",
    mission: "",
    story: "",
    email: "",
    phone: ""
    // createdAt: "2025-12-06T17:11:38.751Z",
    // updatedAt: "2025-12-06T17:11:38.751Z"
  },
  socialMedia: [
   
  ],

  features : {
    enableNotifications : false,
    enableReviews : false,
    enableWishlist : false,
    enableShowProductRatings : false
  }


  });

  // const [smta,setSmta] = useState([])

  const [colorsTheme , setColorsTheme] = useState(themeColors)
  useEffect(()=>{
   setSettings({...websiteSettings,socialMedia : []})
  },[])
  
  // Apply theme colors on component mount
  useEffect(() => {
    applyThemeToDOM();
  }, [applyThemeToDOM]);
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--color-Background)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-[var(--color-text-secondary)]">You need admin privileges to access settings.</p>
        </motion.div>
      </div>
    );
  }
  
  const handleSaveSettings = () => {


    // color side //////////////////
    const settingsData = {...websiteSettings.settings,colors : colorsTheme , commerce : settings.settings.commerce,security : settings.settings.security , features : settings.settings.features}
   // ........................................
   // companyInfo side //////////////////
   
   
   const filledCompanyInfo = Object.entries(settings.companyInfo).reduce(
  (acc, [key, value]) => {
    acc[key] =
      typeof value === 'string' && value.trim() === ''
        ? websiteSettings.companyInfo[key as keyof typeof websiteSettings.companyInfo] ?? ''
        : value;

    return acc;
  },
  {} as Record<string, string>
);
   
const companyInfoData = {id : websiteSettings?.companyInfo?.id,...filledCompanyInfo}
//       // ........................................
   
   
   // social side ///////////////////////
   const sml = settings?.socialMedia?.length
  // console.log(sml)
    if(sml > 0){
      AddSocial(settings.socialMedia)
      getWebsiteSettings()
      setSettings({...settings,socialMedia : []})
    }
   //....................................


      
    // final Data /////////////////
   const newData = {...websiteSettings , settings : settingsData,companyInfo : companyInfoData}
    //...................................

    

   
    
    updateWebsiteSettings(newData)
    // getWebsiteSettings()
  };


  
  const handleResetSettings = () => {
    // Reset to defaults
    updateThemeColors({
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      accentColor: '#F59E0B',
      backGroundColor: '#F9FAFB',
      elementsBackgroundColor : '#ffffff',
      primaryText: '#111827',
      secondaryText : '#6B7280',
      surfaceColor : '#FFFFFF',
      success : '#10B981',
      warning : '#F59E0B',
      info : '#3B82F6',
      error : '#EF4444'
    });
    addNotification('Settings reset to defaults', 'info');
  };
  
  const colorPresets = [
    { name: 'Blue Theme', primary: '#3B82F6', secondary: '#8B5CF6', accent: '#F59E0B' },
    { name: 'Green Theme', primary: '#10B981', secondary: '#059669', accent: '#F59E0B' },
    { name: 'Purple Theme', primary: '#8B5CF6', secondary: '#7C3AED', accent: '#F59E0B' },
    { name: 'Red Theme', primary: '#EF4444', secondary: '#DC2626', accent: '#F59E0B' },
    { name: 'Orange Theme', primary: '#F97316', secondary: '#EA580C', accent: '#10B981' },
    { name: 'Pink Theme', primary: '#EC4899', secondary: '#DB2777', accent: '#8B5CF6' },
  ];
  
  const handleColorChange = (
  colorKey: keyof ThemeColors,
  value: string
) => {
  const updatedColors = {
    ...themeColors,
    [colorKey]: value,
  };
// console.log(updatedColors)
  setColorsTheme(updatedColors);
  updateThemeColors({ [colorKey]: value });
  
};

  
  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    updateThemeColors({
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    });
  
    setColorsTheme({...colorsTheme,primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent});
      
  };
  
  return (
    <div className="min-h-screen bg-[var(--color-Background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Website Settings</h1>
          <p className="text-[var(--color-text-secondary)]">Customize every aspect of your e-commerce store</p>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-2 sm:space-y-0 mb-6">
  <Button variant="outline" onClick={handleResetSettings}>
    <RotateCcw className="h-4 w-4 mr-2" />
    Reset to Defaults
  </Button>
  <Button
    onClick={handleSaveSettings}
    className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]"
  >
    <Save className="h-4 w-4 mr-2" />
    Save Changes
  </Button>
</div>

        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full gap-2
      grid-cols-2
      sm:grid-cols-3
      md:grid-cols-4
      lg:grid-cols-6">
            <TabsTrigger className='hover:bg-[var(--color-accent)]' value="general">General</TabsTrigger>
            <TabsTrigger className='hover:bg-[var(--color-accent)]' value="colors">Colors</TabsTrigger>
            {/* <TabsTrigger className='hover:bg-[var(--color-accent)]' value="theme">Theme</TabsTrigger> */}
            <TabsTrigger className='hover:bg-[var(--color-accent)]' value="features">Features</TabsTrigger>
            <TabsTrigger className='hover:bg-[var(--color-accent)]' value="commerce">Commerce</TabsTrigger>
            <TabsTrigger className='hover:bg-[var(--color-accent)]' value="seo">SEO</TabsTrigger>
            {/* <TabsTrigger className='hover:bg-[var(--color-accent)]' value="Email-Configuration">Email Configuration</TabsTrigger> */}
            <TabsTrigger className='hover:bg-[var(--color-accent)]' value="security">Security</TabsTrigger>
            {/* <TabsTrigger className='hover:bg-[var(--color-accent)]' value="advanced">Advanced</TabsTrigger> */}
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    General Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
  <Label htmlFor="siteName">Site Name</Label>
  <Input
    id="siteName"
    placeholder={websiteSettings?.companyInfo?.companyName}
    value={settings?.companyInfo?.companyName || ""}
    onChange={(e) =>{
      console.log(settings.companyInfo)
      setSettings(prev => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          companyName: e.target.value ,
        },
      }))
    }
  }
  />
</div>
                    {/* Contact Email */}
<div>
  <Label htmlFor="contactEmail">Contact Email</Label>
  <Input
    id="contactEmail"
    type="email"
    placeholder={websiteSettings?.companyInfo?.email}
    value={settings?.companyInfo?.email || ""}
    onChange={(e) =>
      setSettings(prev => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          email: e.target.value,
        },
      }))
    }
  />
</div>

                  </div>
                  
                  {/* Vision */}
<div>
  <Label htmlFor="vision">Vision</Label>
  <Textarea
    id="vision"
    placeholder={websiteSettings?.companyInfo?.vission}
    value={settings?.companyInfo?.vission || ""}
    onChange={(e) =>
      setSettings(prev => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          vission: e.target.value,
        },
      }))
    }
    rows={3}
  />
</div>

{/* Site Description */}
<div>
  <Label htmlFor="siteDescription">Site Description</Label>
  <Textarea
    id="siteDescription"
    placeholder={websiteSettings?.companyInfo?.desc}
    value={settings?.companyInfo?.desc || ""}
    onChange={(e) =>
      setSettings(prev => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          desc: e.target.value,
        },
      }))
    }
    rows={3}
  />
</div>

{/* Company Story */}
<div>
  <Label htmlFor="companyStory">Company Story</Label>
  <Textarea
    id="companyStory"
    placeholder={websiteSettings?.companyInfo?.story}
    value={settings?.companyInfo?.story || ""}
    onChange={(e) =>
      setSettings(prev => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          story: e.target.value,
        },
      }))
    }
    rows={3}
  />
</div>

{/* Mission */}
<div>
  <Label htmlFor="mission">Mission</Label>
  <Textarea
    id="mission"
    placeholder={websiteSettings?.companyInfo?.mission}
    value={settings?.companyInfo?.mission || ""}
    onChange={(e) =>
      setSettings(prev => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          mission: e.target.value,
        },
      }))
    }
    rows={3}
  />
</div>

{/* Contact Phone */}
<div>
  <Label htmlFor="contactPhone">Contact Phone</Label>
  <Input
    id="contactPhone"
    placeholder={websiteSettings?.companyInfo?.phone}
    value={settings?.companyInfo?.phone || ""}
    onChange={(e) =>
      setSettings(prev => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          phone: e.target.value,
        },
      }))
    }
  />
</div>


<div className="space-y-4">
  <div className="flex items-center justify-between">
    <Label>Social Media Links</Label>
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() =>
        setSettings((prev) => ({
          ...prev,
          socialMedia: [...prev.socialMedia, { icon: "facebook", URL: "" }],
        }))

      }
    >
      + Add
    </Button>
  </div>

  <div className="  ">
      <div className=' p-3'>
        
{websiteSettings.socialMedia.map((social) => (
      
      <div
        key={social.id}
        className=" grid grid-cols-1 md:grid-cols-3 gap-3 items-center "
      >
        {/* icon Select */}
        <Input
        readOnly
          className="w-full border rounded-md p-2 bg-background"
          value={social.icon}
          // onChange={(e) => {
          //   const updated = [...settings.socials];
          //   updated[index].icon = e.target.value;
          //   setSettings((prev) => ({ ...prev, socials: updated }));
          // }}
        >
          
        </Input>

        {/* URL Input */}
        <Input
          placeholder="https://..."
          value={social.URL}
          readOnly
          // onChange={(e) => {
          //   const updated = [...settings.socials];
          //   // console.log(settings)
          //   updated[index].url = e.target.value;
          //   setSettings((prev) => ({ ...prev, socials: updated }));
          // }}
        />

        {/* Remove Button */}
        <Button
          type="button"
          variant="outline"
          className="text-red-600 border-red-500 hover:text-white hover:bg-red-600 hover:border-red-600"
          onClick={(e) => {
          if ( DeleteSocial(social.id)){
            getWebsiteSettings()
          }
          }}
        >
          Remove
        </Button>
        <div className="mb-2"/>
      </div>
    ))}
<br />
<hr />
<br />
{settings?.socialMedia?.map((social,index) => (
      
      <div
        key={social.id}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center"
      >
        {/* icon Select */}
        <select
          className="w-full border rounded-md p-2 bg-background"
          value={social.icon ? social.icon : settings.icon}
          onChange={(e) => {
            const updated = [...settings.socialMedia];
            updated[index].icon = e.target.value;
            setSettings((prev) => ({ ...prev, socialMedia: updated }));
          }}
        >
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="twitter">Twitter (X)</option>
          <option value="linkedin">LinkedIn</option>
          <option value="youtube">YouTube</option>
          <option value="tiktok">TikTok</option>
        </select>

        {/* URL Input */}
        <Input
          placeholder="https://..."
          value={social.URL}
          onChange={(e) => {
            const updated = [...settings.socialMedia];
            // console.log(settings)
            updated[index].URL = e.target.value;
            setSettings((prev) => ({ ...prev, socialMedia: updated }));
          }}
        />

        {/* Remove Button */}
        <Button
          type="button"
          variant="outline"
          className="text-red-600 border-red-500 hover:text-white hover:bg-red-600 hover:border-red-600"
          onClick={(e) => {
            const filtered = settings.socialMedia.filter((_, i) =>  i !== index);
            // console.log(social.id)
            setSettings((prev) => ({ ...prev, socialMedia: filtered }));
           
          }}
        >
          Remove
        </Button>
        <div className="mb-2"/>
      </div>
    ))}

      </div>

     
    
  </div>
  
</div>


                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* Color Settings */}
          <TabsContent value="colors">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Paintbrush className="h-5 w-5 mr-2" />
                      Website Colors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Color Presets */}
                    <div>
                      <Label className="text-base font-semibold">Color Presets</Label>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-4">Quick apply popular color schemes</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {colorPresets.map((preset) => (
                          <Button
                            key={preset.name}
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center p-2"
                            onClick={() => applyColorPreset(preset)}
                          >
                            <div className="flex space-x-1 mb-2">
                              <div 
                                className="w-4 h-4 rounded-full border" 
                                style={{ backgroundColor: preset.primary }}
                              />
                              <div 
                                className="w-4 h-4 rounded-full border" 
                                style={{ backgroundColor: preset.secondary }}
                              />
                              <div 
                                className="w-4 h-4 rounded-full border" 
                                style={{ backgroundColor: preset.accent }}
                              />
                            </div>
                            <span className="text-xs text-center">{preset.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Primary Colors */}
                    <div>
                      <Label className="text-base font-semibold">Primary Colors</Label>
                      <div className="grid md:grid-cols-3 gap-6 mt-4">
                        <div>
                          <Label htmlFor="primaryColor">Primary Color</Label>
                          <div className="flex space-x-2 mt-2">
                            <Input
                              id="primaryColor"
                              type="color"
                              defaultValue={websiteSettings.settings.colors.primaryColor}
                              value={themeColors.primaryColor}
                              onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                              className="w-16 h-10 p-1 rounded cursor-pointer"
                            />
                            <Input
                              defaultValue={websiteSettings.settings.colors.primaryColor}
                              value={themeColors.primaryColor}
                              onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                              className="flex-1"
                              placeholder="#3B82F6"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="secondaryColor">Secondary Color</Label>
                          <div className="flex space-x-2 mt-2">
                            <Input
                              id="secondaryColor"
                              type="color"
                              defaultValue={websiteSettings.settings.colors.secondaryColor}
                              value={themeColors.secondaryColor}
                              onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                              className="w-16 h-10 p-1 rounded cursor-pointer"
                            />
                            <Input
                              defaultValue={websiteSettings.settings.colors.secondaryColor}
                              value={themeColors.secondaryColor}
                              onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                              className="flex-1"
                              placeholder="#8B5CF6"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="accentColor">Accent Color</Label>
                          <div className="flex space-x-2 mt-2">
                            <Input
                              id="accentColor"
                              type="color"
                              defaultValue={websiteSettings.settings.colors.accentColor}
                              value={themeColors.accentColor}
                              onChange={(e) => handleColorChange('accentColor', e.target.value)}
                              className="w-16 h-10 p-1 rounded cursor-pointer"
                            />
                            <Input
                              defaultValue={websiteSettings.settings.colors.accentColor}
                              value={themeColors.accentColor}
                              onChange={(e) => handleColorChange('accentColor', e.target.value)}
                              className="flex-1"
                              placeholder="#F59E0B"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Background & Surface Colors */}
                    <div>
                      <Label className="text-base font-semibold">Background & Surface</Label>
                      <div className="grid md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <Label htmlFor="backgroundColor">Background Color</Label>
                          <div className="flex space-x-2 mt-2">
                            <Input
                              id="backgroundColor"
                              type="color"
                              defaultValue={websiteSettings.settings.colors.backGroundColor}
                              value={themeColors.backGroundColor}
                              onChange={(e) => handleColorChange('backGroundColor', e.target.value)}
                              className="w-16 h-10 p-1 rounded cursor-pointer"
                            />

                            <Input
                              defaultValue={websiteSettings.settings.colors.backGroundColor}
                              value={themeColors.backGroundColor}
                              onChange={(e) => handleColorChange('backGroundColor', e.target.value)}
                              className="flex-1"
                              placeholder="#F9FAFB"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="surfaceColor">Surface Color</Label>
                          <div className="flex space-x-2 mt-2">
                            <Input
                              id="surfaceColor"
                              type="color"
                              defaultValue={websiteSettings.settings.colors.surfaceColor}
                              value={themeColors.surfaceColor}
                              onChange={(e) => handleColorChange('surfaceColor', e.target.value)}
                              className="w-16 h-10 p-1 rounded cursor-pointer"
                            />
                            <Input
                              defaultValue={websiteSettings.settings.colors.surfaceColor}
                              value={themeColors.surfaceColor}
                              onChange={(e) => handleColorChange('surfaceColor', e.target.value)}
                              className="flex-1"
                              placeholder="#FFFFFF"
                            />
                          </div>
                        </div>


                        <div>
                          <Label htmlFor="elementsBackgroundColor">Elements Background Color</Label>
                          <div className="flex space-x-2 mt-2">
                            <Input
                              id="backgroundColor"
                              type="color"
                              defaultValue={websiteSettings.settings.colors.elementsBackgroundColor}
                              value={themeColors.elementsBackgroundColor}
                              onChange={(e) => handleColorChange('elementsBackgroundColor', e.target.value)}
                              className="w-16 h-10 p-1 rounded cursor-pointer"
                            />

                            <Input
                              defaultValue={websiteSettings.settings.colors.elementsBackgroundColor}
                              value={themeColors.elementsBackgroundColor}
                              onChange={(e) => handleColorChange('elementsBackgroundColor', e.target.value)}
                              className="flex-1"
                              placeholder="#F9FAFB"
                            />
                          </div>
                        </div>


                      </div>
                    </div>
                    
                    {/* Text Colors */}
                    <div>
                      <Label className="text-base font-semibold">Text Colors</Label>
                      <div className="grid md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <Label htmlFor="textColor">Primary Text</Label>
                          <div className="flex space-x-2 mt-2">
                            <Input
                              id="textColor"
                              type="color"
                              defaultValue={websiteSettings.settings.colors.primaryText}
                              value={themeColors.primaryText}
                              onChange={(e) => handleColorChange('primaryText', e.target.value)}
                              className="w-16 h-10 p-1 rounded cursor-pointer"
                            />
                            <Input
                              defaultValue={websiteSettings.settings.colors.primaryText}
                              value={themeColors.primaryText}
                              onChange={(e) => handleColorChange('primaryText', e.target.value)}
                              className="flex-1"
                              placeholder="#111827"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="textSecondaryColor">Secondary Text</Label>
                          <div className="flex space-x-2 mt-2">
                            <Input
                              id="textSecondaryColor"
                              type="color"
                              defaultValue={websiteSettings.settings.colors.secondaryText}
                              value={themeColors.secondaryText}
                              onChange={(e) => handleColorChange('secondaryText', e.target.value)}
                              className="w-16 h-10 p-1 rounded cursor-pointer"
                            />
                            <Input
                              defaultValue={websiteSettings.settings.colors.secondaryText}
                              value={themeColors.secondaryText}
                              onChange={(e) => handleColorChange('secondaryText', e.target.value)}
                              className="flex-1"
                              placeholder="#6B7280"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Colors */}
                    <div>
                      <Label className="text-base font-semibold">Status Colors</Label>
                      <div className="grid md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <Label htmlFor="successColor">Success</Label>
                          <div className="flex space-x-2 mt-2">
                            <Input
                              id="successColor"
                              type="color"
                              defaultValue={websiteSettings.settings.colors.success}
                              value={themeColors.success}
                              onChange={(e) => handleColorChange('success', e.target.value)}
                              className="w-12 h-8 p-1 rounded cursor-pointer"
                            />
                            <Input
                              defaultValue={websiteSettings.settings.colors.success}
                              value={themeColors.success}
                              onChange={(e) => handleColorChange('success', e.target.value)}
                              className="flex-1 text-xs"
                              placeholder="#10B981"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="warningColor">Warning</Label>
                          <div className="flex space-x-2 mt-2">
                            <Input
                              id="warningColor"
                              type="color"
                              defaultValue={websiteSettings.settings.colors.warning}
                              value={themeColors.warning}
                              onChange={(e) => handleColorChange('warning', e.target.value)}
                              className="w-12 h-8 p-1 rounded cursor-pointer"
                            />
                            <Input
                              defaultValue={websiteSettings.settings.colors.warning}
                              value={themeColors.warning}
                              onChange={(e) => handleColorChange('warning', e.target.value)}
                              className="flex-1 text-xs"
                              placeholder="#F59E0B"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="errorColor">Error</Label>
                          <div className="flex space-x-2 mt-2">
                            <Input
                              id="errorColor"
                              type="color"
                              defaultValue={websiteSettings.settings.colors.error}
                              value={themeColors.error}
                              onChange={(e) => handleColorChange('error', e.target.value)}
                              className="w-12 h-8 p-1 rounded cursor-pointer"
                            />
                            <Input
                              defaultValue={websiteSettings.settings.colors.error}
                              value={themeColors.error}
                              onChange={(e) => handleColorChange('error', e.target.value)}
                              className="flex-1 text-xs"
                              placeholder="#EF4444"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="infoColor">Info</Label>
                          <div className="flex space-x-2 mt-2">
                            <Input
                              id="infoColor"
                              type="color"
                              defaultValue={websiteSettings.settings.colors.info}
                              value={themeColors.info}
                              onChange={(e) => handleColorChange('info', e.target.value)}
                              className="w-12 h-8 p-1 rounded cursor-pointer"
                            />
                            <Input
                              defaultValue={websiteSettings.settings.colors.info}
                              value={themeColors.info}
                              onChange={(e) => handleColorChange('info', e.target.value)}
                              className="flex-1 text-xs"
                              placeholder="#3B82F6"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Color Actions */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-[var(--color-text-secondary)]" />
                        <span className="text-sm text-[var(--color-text-secondary)]">Click save changes to apply the colors</span>
                      </div>
                      <Button variant="outline" onClick={resetThemeColors}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Colors
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
          
          {/* Theme Settings */}
          <TabsContent value="theme">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Theme & Layout
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Layout Settings */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label>Header Style</Label>
                      <Select
                        value={settings.headerStyle}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, headerStyle: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="classic">Classic</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Product Grid Columns</Label>
                      <div className="mt-2">
                        <Slider
                          value={[settings.productGridColumns]}
                          onValueChange={(value) => setSettings(prev => ({ ...prev, productGridColumns: value[0] }))}
                          max={6}
                          min={2}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mt-1">
                          <span>2</span>
                          <span>{settings.productGridColumns} columns</span>
                          <span>6</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* Feature Settings */}
          <TabsContent value="features">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Features & Functionality
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6 bg-[var(--color-elementsBackground)]">
                    {[
                      { key: 'enableNotifications', label: 'Enable Notifications', description: 'Show toast notifications for user actions' },
                      { key: 'enableReviews', label: 'Enable Reviews', description: 'Allow customers to leave product reviews' },
                      { key: 'enableWishlist', label: 'Enable Wishlist', description: 'Let users save products for later' },
                      // { key: 'enableCompare', label: 'Enable Compare', description: 'Allow product comparison feature' },
                      // { key: 'enableLiveChat', label: 'Enable Live Chat', description: 'Add live chat support widget' },
                      { key: 'enableShowProductRatings', label: 'Show Product Ratings', description: 'Display star ratings on products' },
                    ].map((feature) => (
                      <div key={feature.key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label className="font-medium">{feature.label}</Label>
                          <p className="text-sm text-[var(--color-text-secondary)]">{feature.description}</p>
                        </div>
                        <Switch
                          checked={settings.settings.features[feature.key] as boolean}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev,settings:{...prev.settings, features : {...prev.settings.features , [feature.key]: checked}} }))}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* Commerce Settings */}
          <TabsContent value="commerce">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    E-commerce Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                   <div className="translator-safe-container notranslate">
  <Label>Currency</Label>
  <Select
    value={settings?.settings?.commerce?.currency}
    onValueChange={(value) =>
      setSettings((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          commerce: { ...prev.settings.commerce, currency: value },
        },
      }))
    }
    defaultValue={websiteSettings?.settings?.commerce?.currency}
  >
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="USD">USD - US Dollar</SelectItem>
      <SelectItem value="EUR">EUR - Euro</SelectItem>
      <SelectItem value="DZD">DZD - Algerian dinar</SelectItem>
    </SelectContent>
  </Select>
</div>

                    <div>
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        
                        value={settings?.settings?.commerce.taxRate}
                        onChange={(e) => setSettings(prev => ({...prev,settings : {...prev.settings,commerce : {...prev.settings.commerce , taxRate : e.target.value}} }))}
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    
                    {/* <div>
                      <Label htmlFor="freeShippingThreshold">Free Shipping Threshold</Label>
                      <Input
                        id="freeShippingThreshold"
                        type="number"
                        value={settings.freeShippingThreshold}
                        onChange={(e) => setSettings(prev => ({ ...prev, freeShippingThreshold: parseFloat(e.target.value) }))}
                        min="0"
                        step="0.01"
                      />
                    </div> */}
                    
                    <div>
                      <Label htmlFor="defaultShipping">Default Shipping Cost</Label>
                      <Input
                        id="defaultShipping"
                        type="number"
                        value={settings.settings.commerce.defaultShippingCost}
                        onChange={(e) => setSettings(prev => ({ ...prev,settings : {...prev.settings , commerce : {...prev.settings.commerce , defaultShippingCost: parseFloat(e.target.value)}} }))}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* SEO Settings */}
          <TabsContent value="seo">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>SEO & Meta Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={settings.companyInfo.metaTitle}
                      onChange={(e) => setSettings(prev => ({ ...prev,companyInfo : {...prev.companyInfo , metaTitle : e.target.value } }))}
                      placeholder={websiteSettings.companyInfo.metaTitle}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={settings.companyInfo.metaDesc}
                      onChange={(e) => setSettings(prev => ({ ...prev,companyInfo : {...prev.companyInfo , metaDesc : e.target.value } }))}                      rows={3}
                      placeholder={websiteSettings.companyInfo.metaDesc}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input
                      id="metaKeywords"
                      value={settings.companyInfo.metaKeyWords}
                      onChange={(e) => setSettings(prev => ({ ...prev,companyInfo : {...prev.companyInfo , metaKeyWords: e.target.value.split(' ') } }))}
                      placeholder={websiteSettings?.companyInfo?.metaKeyWords?.map(value => value )}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>


          {/* Email-Configuration Settings */}



          <TabsContent value="Email-Configuration">

<TabsContent value="Email-Configuration">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="h-5 w-5 mr-2" />
          Email Configuration
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* SMTP SETTINGS */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input
              id="smtpHost"
              placeholder="smtp.gmail.com"
              value={settings?.settings?.email?.smtpHost}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    email: {
                      ...prev.settings.email,
                      smtpHost: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input
              id="smtpPort"
              type="number"
              placeholder="587"
              value={settings?.settings?.email?.smtpPort}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    email: {
                      ...prev.settings.email,
                      smtpPort: Number(e.target.value),
                    },
                  },
                }))
              }
            />
          </div>
        </div>

        {/* AUTH SETTINGS */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="smtpUser">SMTP Username</Label>
            <Input
              id="smtpUser"
              placeholder="email@example.com"
              value={settings?.settings?.email?.smtpUser}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    email: {
                      ...prev.settings.email,
                      smtpUser: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="smtpPass">SMTP Password</Label>
            <Input
              id="smtpPass"
              type="password"
              placeholder="••••••••"
              value={settings?.settings?.email?.smtpPassword}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    email: {
                      ...prev.settings.email,
                      smtpPassword: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
        </div>

        {/* SECURITY & FROM SETTINGS */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-[var(--color-elementsBackground)]">
            <div>
              <Label className="font-medium">Use Secure Connection (TLS)</Label>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Enable TLS encryption for SMTP
              </p>
            </div>
            <Switch
              checked={settings?.settings?.email?.secure}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    email: {
                      ...prev.settings.email,
                      secure: checked,
                    },
                  },
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="fromEmail">From Email Address</Label>
            <Input
              id="fromEmail"
              placeholder="no-reply@yourdomain.com"
              value={settings?.settings?.email?.fromEmail}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    email: {
                      ...prev.settings.email,
                      fromEmail: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
        </div>

        {/* EMAIL TEMPLATE */}
        <div className="space-y-2">
          <Label htmlFor="emailTemplate">Email Template (Message Body)</Label>
          <Textarea
            id="emailTemplate"
            rows={6}
            placeholder="Enter the email message content here..."
            value={settings?.settings?.email?.template}
            onChange={(e) =>
              setSettings(prev => ({
                ...prev,
                settings: {
                  ...prev.settings,
                  email: {
                    ...prev.settings.email,
                    template: e.target.value,
                  },
                },
              }))
            }
          />
          <p className="text-sm text-[var(--color-text-secondary)]">
            This content will be used as the email body when messages are sent.
          </p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
</TabsContent>


          </TabsContent>



          {/* Security Settings */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6 ">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-[var(--color-elementsBackground)]">
                      <div>
                        <Label className="font-medium">Two-Factor Authentication</Label>
                        <p className="text-sm text-[var(--color-text-secondary)]">Require 2FA for admin access</p>
                      </div>
                      <Switch
                        checked={settings.settings.security.enableTwoFactor}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev,settings : {...prev.settings , security : {...prev.settings.security , enableTwoFactorAuthentication: checked}} }))}
                        defaultValue={websiteSettings.settings.security.enableTwoFactorAuthentication}
                      />
                    </div>
                    
                    {/* <div className="flex items-center justify-between p-4 border rounded-lg bg-[var(--color-elementsBackground)]">
                      <div>
                        <Label className="font-medium">Enable CAPTCHA</Label>
                        <p className="text-sm text-[var(--color-text-secondary)]">Add CAPTCHA to forms</p>
                      </div>
                      <Switch
                        checked={settings.enableCaptcha}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableCaptcha: checked }))}
                      />
                    </div> */}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.settings.security.sessionTimeout}
                        onChange={(e) => setSettings(prev => ({ ...prev,settings : {...prev.settings , security : {...prev.settings.security , sessionTimeout: parseInt(e.target.value)}}  }))}
                        min="5"
                        max="120"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                      <Input
                        id="passwordMinLength"
                        type="number"
                        value={settings.settings.security.minimumPasswordLength}
                        onChange={(e) => setSettings(prev => ({ ...prev,settings : {...prev.settings , security : {...prev.settings.security , minimumPasswordLength: parseInt(e.target.value)}}  }))}
                        min="6"
                        max="20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* Advanced Settings */}
          <TabsContent value="advanced">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      Custom Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="customCSS">Custom CSS</Label>
                      <Textarea
                        id="customCSS"
                        value={settings.customCSS}
                        onChange={(e) => setSettings(prev => ({ ...prev, customCSS: e.target.value }))}
                        placeholder="/* Add your custom CSS here */"
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="customJS">Custom JavaScript</Label>
                      <Textarea
                        id="customJS"
                        value={settings.customJS}
                        onChange={(e) => setSettings(prev => ({ ...prev, customJS: e.target.value }))}
                        placeholder="// Add your custom JavaScript here"
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics & Tracking</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                      <Input
                        id="googleAnalyticsId"
                        value={settings.googleAnalyticsId}
                        onChange={(e) => setSettings(prev => ({ ...prev, googleAnalyticsId: e.target.value }))}
                        placeholder="GA-XXXXXXXXX-X"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                      <Input
                        id="facebookPixelId"
                        value={settings.facebookPixelId}
                        onChange={(e) => setSettings(prev => ({ ...prev, facebookPixelId: e.target.value }))}
                        placeholder="XXXXXXXXXXXXXXX"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label className="font-medium">Maintenance Mode</Label>
                        <p className="text-sm text-[var(--color-text-secondary)]">Put site in maintenance mode</p>
                      </div>
                      <Switch
                        checked={settings.maintenanceMode}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}