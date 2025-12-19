import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Shield, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useStore } from '@/lib/store';
import { Switch } from '@/components/ui/switch';
import Cookies from 'universal-cookie';

export default function ProfilePage() {
  // const isAdmin = true
  const navigate = useNavigate();
  const { websiteSettings,deleteFollower,updateFollowState,getFollowers,updateFollower,updateUserSettings,deleteAccount,currentUser,followers, updateUser } = useStore();
  const [passwordEdit , setPasswordEdit] = useState(true)
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fName: currentUser?.fName || '',
    lName: currentUser?.lName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    streetAdr: currentUser?.streetAdr || '',
    city: currentUser?.city || '',
    state: currentUser?.state || '',
    zipCode: currentUser?.zipCode || '',
    country: currentUser?.country || '',
    password : currentUser?.password || ''
  });

  const enableWishListfromSettings = websiteSettings?.settings?.features?.enableWishlist
  const wish =(enableWishListfromSettings && currentUser?.userSettings.enableWishList) || false
 
  
  const [follow , setFollow] = useState()
  // console.log(wish)

  const subscribeHandle = async () => {
  await updateFollowState(currentUser.email,'deleteOrAdd');
  updateFollower({firstTimeLog : false,followed : follow,email : currentUser.email})
  // console.log(follow)
  await getFollowers(); // this updates `followers`
};


  useEffect(() => {
  if (!currentUser) return;

  const isFollowing = followers.some(
    e => e.email === currentUser.email
  );


  setFollow(isFollowing);
}, [followers, currentUser]);

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const handleSave = (e) => {
    e.preventDefault();
    // console.log( {oldEmail : currentUser.email})
    updateUser({...formData , oldEmail : currentUser.email});
    setIsEditing(false);
  };

const settingsMap = {
  ETFA: "Two_Factor_Auth",
  EC: "enableCaptcha",
  ENOT: "enableNotification",
  EWL: "enableWishList"
};


 const Settings = async ({ checked, type }) => {
  const settingKey = settingsMap[type];
  if (!settingKey) return;

  const previousValue = UserSettingsForm[settingKey];

  // 1) Build next state explicitly (NO stale data)
  const nextSettings = {
    ...UserSettingsForm,
    [settingKey]: checked
  };

  // 2) Optimistically update UI
  setUserSettingsForm(nextSettings);

  try {
    // 3) Send the SAME next state to backend
    const success = await updateUserSettings(
      nextSettings,
      currentUser.email
    );

    // 4) Revert UI if backend failed
    if (!success) {
      setUserSettingsForm(prev => ({
        ...prev,
        [settingKey]: previousValue
      }));
    }

  } catch (error) {
    console.error("Update failed:", error);

    // 5) Revert UI on error
    setUserSettingsForm(prev => ({
      ...prev,
      [settingKey]: previousValue
    }));
  }
};



  const [UserSettingsForm , setUserSettingsForm] = useState({
    enableNotification : currentUser.userSettings.enableNotification,
    enableWishList : currentUser.userSettings.enableWishList,
    enableCaptcha : currentUser.userSettings.enableCaptcha,
    Two_Factor_Auth : currentUser.userSettings.Two_Factor_Auth
  }) 

  const handleCancel = () => {
    setFormData({
      fName: currentUser?.fName || '',
      lName: currentUser?.lName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      streetAdr: currentUser?.streetAdr || '',
      city: currentUser?.city || '',
      state: currentUser?.state || '',
      zipCode: currentUser?.zipCode || '',
      country: currentUser?.country || '',
      password : currentUser?.password || ''
    });
    setIsEditing(false);
  };

const cookies = new Cookies()

const [settings, setSettings] = useState({
  });


  const deleteAccountAlert = async()=>{
    if(confirm('are you sure you want to delete your account ?')){
      await deleteFollower(currentUser.email);
     deleteAccount(currentUser.email)
    }
  else{
      return
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-8" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>My Profile</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage your account information</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card style={{ backgroundColor: 'var(--color-surface)' }}>
              <CardContent className="p-6 text-center">
                <div 
                  className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {currentUser.fName[0]}{currentUser.lName[0]}
                </div>
                <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                  {currentUser.fName} {currentUser.lName}
                </h2>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {currentUser.email}
                </p>
                <div className="flex items-center justify-center text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {new Date(currentUser.createdAt).toLocaleDateString()}
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                  className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white"
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card style={{ backgroundColor: 'var(--color-surface)' }}>
              <CardHeader>
                <CardTitle className="flex items-center" style={{ color: 'var(--color-text)' }}>
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name Fields */}
                <form onSubmit={handleSave} >

<div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="fName"
                        value={formData.fName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fName: e.target.value }))}
                      />
                    ) : (
                      <p className="mt-1 p-2 rounded border" style={{ backgroundColor: 'var(--color-elementsBackground)', color: 'var(--color-text)' }}>
                        {currentUser.fName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lName"
                        value={formData.lName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lName: e.target.value }))}
                      />
                    ) : (
                      <p className="mt-1 p-2 rounded border" style={{ backgroundColor: 'var(--color-elementsBackground)', color: 'var(--color-text)' }}>
                        {currentUser.lName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  ) : (
                    <div className="mt-1 p-2 rounded border flex items-center" style={{ backgroundColor: 'var(--color-elementsBackground)', color: 'var(--color-text)' }}>
                      <Mail className="h-4 w-4 mr-2" style={{ color: 'var(--color-text-secondary)' }} />
                      {currentUser.email}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="pl-10"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  ) : (
                    <div className="mt-1 p-2 rounded border flex items-center" style={{ backgroundColor: 'var(--color-elementsBackground)', color: 'var(--color-text)' }}>
                      <Phone className="h-4 w-4 mr-2" style={{ color: 'var(--color-text-secondary)' }} />
                      {currentUser.phone || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* streetAdr */}
                <div>
                  <Label htmlFor="streetAdr">street</Label>
                  {isEditing ? (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                      <Textarea
                        id="streetAdr"
                        value={formData.streetAdr}
                        onChange={(e) => setFormData(prev => ({ ...prev, streetAdr: e.target.value }))}
                        className="pl-10"
                        placeholder="Enter your streetAdr"
                        rows={2}
                      />
                    </div>
                  ) : (
                    <div className="mt-1 p-2 rounded border flex items-start" style={{ backgroundColor: 'var(--color-elementsBackground)', color: 'var(--color-text)' }}>
                      <MapPin className="h-4 w-4 mr-2 mt-0.5" style={{ color: 'var(--color-text-secondary)' }} />
                      {currentUser.streetAdr || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* City, State, ZIP */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="City"
                      />
                    ) : (
                      <p className="mt-1 p-2 rounded border" style={{ backgroundColor: 'var(--color-elementsBackground)', color: 'var(--color-text)' }}>
                        {currentUser.city || 'Not provided'}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    {isEditing ? (
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="State"
                      />
                    ) : (
                      <p className="mt-1 p-2 rounded border" style={{ backgroundColor: 'var(--color-elementsBackground)', color: 'var(--color-text)' }}>
                        {currentUser.state || 'Not provided'}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    {isEditing ? (
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                        placeholder="ZIP"
                      />
                    ) : (
                      <p className="mt-1 p-2 rounded border" style={{ backgroundColor: 'var(--color-elementsBackground)', color: 'var(--color-text)' }}>
                        {currentUser.zipCode || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <Label htmlFor="country">Country</Label>
                  {isEditing ? (
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="Country"
                    />
                  ) : (
                    <p className="mt-1 p-2 rounded border" style={{ backgroundColor: 'var(--color-elementsBackground)', color: 'var(--color-text)' }}>
                      {currentUser.country || 'Not provided'}
                    </p>
                  )}
                </div>

                 
                    
                    
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        disabled={passwordEdit}
                        type="password"
                        placeholder='********************'
                        required={true}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        min={settings.passwordMinLength}
                        max="20"
                      />
  <br />
                      {isEditing && <Button type='button' onClick={()=>{setPasswordEdit(!passwordEdit)}}>edit password ?</Button>}
                    </div>
                  

                
                
                {/* Save/Cancel Buttons */} 
                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button type='submit'  className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
                </form>

                
              </CardContent>
              
            </Card>
            <br />
           
              <br />
                <div className="flex items-center bg-[var(--color-surface)] justify-between border p-3 rounded-lg">
  <div>
    <label
      htmlFor=""
      className="font-medium text-sm text-gray-800"
    >
      Delete your account
    </label>
    <p className="text-xs text-gray-500">
      This action is permanent and cannot be undone.
    </p>
  </div>

  <Button
    id="deleteAccount"
    variant="outline"
    size="sm"
    onClick={() => deleteAccountAlert()}
    className="text-red-600 border-red-500 hover:text-white hover:bg-red-600 hover:border-red-600"
  >
    <Trash2 className="h-4 w-4 mr-1" />
    Delete
  </Button>
</div>

              
          </motion.div>
        </div>
        
<br />
{
<motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                   Settings
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
                        checked={UserSettingsForm.Two_Factor_Auth}
                        onCheckedChange={(checked) =>Settings({checked,type : 'ETFA'})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg bg-[var(--color-elementsBackground)]">
                      <div>
                        <Label className="font-medium">Enable Subscription</Label>
                        <p className="text-sm text-[var(--color-text-secondary)]">Stay updated by following us</p>
                      </div>
                      <Switch
                        checked={follow}
                        onCheckedChange={(checked) =>subscribeHandle(checked)}
                      />
                    </div>
                    
                    {/* <div className="flex items-center justify-between p-4 border rounded-lg bg-[var(--color-elementsBackground)]">
                      <div>
                        <Label className="font-medium">Enable CAPTCHA</Label>
                        <p className="text-sm text-[var(--color-text-secondary)]">Add CAPTCHA to forms</p>
                      </div>
                      <Switch
                        checked={UserSettingsForm.enableCaptcha}
                        onCheckedChange={(checked) =>Settings({checked,type : 'EC'})}
                      />
                    </div> */}
                    {websiteSettings.settings.features.enableNotifications && <div className="flex items-center justify-between p-4 border rounded-lg bg-[var(--color-elementsBackground)]">
                      <div>
                        <Label className="font-medium">Enable Notifications</Label>
                        <p className="text-sm text-[var(--color-text-secondary)]">Show toast notifications for user actions</p>
                      </div>
                      <Switch
                        checked={UserSettingsForm.enableNotification}
                        onCheckedChange={(checked) =>Settings({checked,type : 'ENOT'})}
                      />
                    </div>}

                    {enableWishListfromSettings && <div className="flex items-center justify-between p-4 border rounded-lg bg-[var(--color-elementsBackground)]">
                      <div>
                        <Label className="font-medium">Enable Wishlist</Label>
                        <p className="text-sm text-[var(--color-text-secondary)]">Let users save products for later</p>
                      </div>
                      <Switch
                        checked={UserSettingsForm.enableWishList}
                        onCheckedChange={(checked) =>Settings({checked,type : 'EWL'})}
                      />
                    </div>}
                  </div>
                  
                 
                </CardContent>
              </Card>
            </motion.div>
}

        {/* Account Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardHeader>
              <CardTitle style={{ color: 'var(--color-text)' }}>Account Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                    {!currentUser.wishlist ? 0 : currentUser.wishlist.length }
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Wishlist Items</p>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>0</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Orders</p>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>0</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Reviews</p>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-info)' }}>
                    {Math.floor((Date.now() - new Date(currentUser.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Days Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}