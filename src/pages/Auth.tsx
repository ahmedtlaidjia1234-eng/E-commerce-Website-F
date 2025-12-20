import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, LogIn, Shield, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useStore } from '@/lib/store';
import axios from 'axios'
import cookie from 'universal-cookie';
import { set } from 'react-hook-form';
import {jwtDecode} from "jwt-decode";
import Cookies from 'universal-cookie';
import { URL } from '@/lib/BackendURL';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { websiteSettings,signOut ,signUp, signIn, currentUser, toggleAdmin } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // const [isAuth, setIsAuth] = useState(false); // true for Sign In, false for Sign Up


  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
    isAdmin: false,
  });
  
  const [signUpData, setSignUpData] = useState({
    fName: '',
    lName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    streetAdr: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  
  // Get the intended destination from location state
  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || '/';
  // const cookies = new Cookies();
// useEffect(() => {
//   const token = cookies.get('secured');

//   const checkCookie = () => {
    
// console.log(token)
//     if (!token && currentUser) {
//       signOut(); // ✅ trigger logout
//       sessionStorage.removeItem('User');
//       setIsAuth(false);
//     }
//     else return
//   };

//   // ✅ Check every 5 seconds
//   const interval = setInterval(checkCookie, 5000);

//   // ✅ Also check when user comes back to the tab
//   window.addEventListener('focus', checkCookie);

//   return () => {
//     clearInterval(interval);
//     window.removeEventListener('focus', checkCookie);
//   };
// }, []);

  // Redirect if already signed in
  // if (currentUser) {
  //   navigate(from);
  //   return null;
  // }
  

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for admin credentials
    // if (signInData.isAdmin) {
    //   if (signInData.email === 'admin@shophub.com' && signInData.password === 'admin123') {
    //     // Create admin user if doesn't exist
    //     const adminUser = {
    //       id: 'admin',
    //       email: 'admin@shophub.com',
    //       fName: 'Admin',
    //       lName: 'User',
    //       phone: '+1 (555) 123-4567',
    //       streetAdr: '123 Admin St',
    //       city: 'Admin City',
    //       state: 'AC',
    //       zipCode: '12345',
    //       country: 'US',
    //       wishlist: [],
    //       createdAt: new Date().toISOString(),
    //     };
        
    //     // Set as current user and enable admin
    //     // useStore.setState({ 
    //     //   currentUser: adminUser,
    //     //   isAdmin: true,
    //     //   users: useStore.getState().users.some(u => u.id === 'admin') 
    //     //     ? useStore.getState().users 
    //     //     : [...useStore.getState().users, adminUser]
    //     // });
    //    if(signIn(signInData.email, signInData.password)) {
        
    //     navigate('/admin');
    //     return; 
    //   } else {
    //     useStore.getState().addNotification('Invalid admin credentials!', 'error');
    //     return;
    //   }
    // }

  try {

    
    const success = await signIn(signInData.email, signInData.password);
    
    if (success) {
     const token = success.token;
    if (!token) {
      useStore.getState().addNotification('Invalid email or password!', 'error');
      return false;
    }

    const decoded: any = jwtDecode(token);

    if (!decoded?.exp || !decoded?.userWP) {
      console.error('Invalid JWT payload:', decoded);
      useStore.getState().addNotification('Invalid authentication token!', 'error');
      return false;
    }
    const sessionExp = websiteSettings.settings.security.sessionTimeout
      cookies.set('secured', token, {
      path: '/',
      expires: new Date(Date.now() + sessionExp * 60 * 1000), // ✅ seconds → milliseconds
      // sameSite: 'lax',
      // secure: window.location.protocol === 'https:',
    });

    sessionStorage.setItem('adminAuth', 'true')

    useStore.getState().addNotification('Signed in successfully!', 'success');
    
    useStore.getState().addCurrentUser(decoded.userWP.email)
    
    }
  } catch (err) {
    console.error('Sign in failed:', err);
  }
  };
  
  
  const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();

  if (signUpData.password !== signUpData.confirmPassword) {
    useStore.getState().addNotification(
      "Passwords do not match!",
      "error"
    );
    return;
  }

  if (!agreeToTerms) {
    useStore.getState().addNotification(
      "Please agree to terms and conditions!",
      "error"
    );
    return;
  }

  // ✅ ALWAYS generate a fresh code on each run
  // const verificationCode = generateVerificationCode();
  // sessionStorage.setItem('verificationCode', verificationCode); 
  sessionStorage.setItem('pendingUser', JSON.stringify(signUpData));
// console.log(verificationCode)
  try {
    const response = await axios.post(
      `${URL}/api/user/verification/addCode`,
      {
        email: signUpData.email,
        // code: verificationCode,
        createdAt: Date.now(), // helps backend invalidate old codes
      }
    );
  

    if (response.status === 201) {
      console.log("Verification code sent successfully");

      navigate("/verify-email", {
        state: { email: signUpData.email },
      });
    }
  } catch (err) {
    console.error("Verification error:", err);
  }
};
const cookies = new cookie();




useEffect(() => {
  if (currentUser) {
  
     
      navigate(from);
      return
  
    
   
  }
}, [currentUser, from, navigate]);


  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-0" style={{ backgroundColor: 'var(--color-surface)' }}>
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
            >
              <User className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
              Welcome to ShopHub
            </CardTitle>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Sign in to your account or create a new one
            </p>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              {/* Sign In Tab */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                      <Input
                        id="signin-email"
                        type="email"
                        value={signInData.email}
                        onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        value={signInData.password}
                        onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                        minLength={websiteSettings?.settings?.security?.minimumPasswordLength}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Admin Login Toggle */}
                  {/* <div className="flex items-center space-x-2 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
                    <Checkbox
                      id="admin-login"
                      checked={signInData.isAdmin}
                      onCheckedChange={(checked) => setSignInData(prev => ({ ...prev, isAdmin: checked as boolean }))}
                    />
                    <Label htmlFor="admin-login" className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" style={{ color: 'var(--color-primary)' }} />
                      Sign in as Administrator
                    </Label>
                  </div> */}
                  
                  {signInData.isAdmin && (
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-info)', color: 'white' }}>
                      <p className="text-sm font-medium mb-2">Admin Credentials:</p>
                      <p className="text-sm">Email: admin@shophub.com</p>
                      <p className="text-sm">Password: admin123</p>
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full" size="lg">
                    <LogIn className="h-4 w-4 mr-2" />
                    {signInData.isAdmin ? 'Sign In as Admin' : 'Sign In'}
                  </Button>
                  
                  {/* {!signInData.isAdmin && (
                    <div className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      <p>Demo Account:</p>
                      <p>Email: demo@example.com | Password: password</p>
                    </div>
                  )} */}
                </form>
              </TabsContent>
              
              {/* Sign Up Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                        <Input
                          id="fName"
                          value={signUpData.fName}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, fName: e.target.value }))}
                          placeholder="First name"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="lName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                        <Input
                          id="lName"
                          value={signUpData.lName}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, lName: e.target.value }))}
                          placeholder="Last name"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div>
                    <Label htmlFor="signup-email">Email streetAdr</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                      <Input
                        id="signup-email"
                        type="email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Password Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                        <Input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          value={signUpData.password}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Create password"
                          minLength={websiteSettings?.settings?.security?.minimumPasswordLength}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={signUpData.confirmPassword}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          minLength={websiteSettings?.settings?.security?.minimumPasswordLength}
                          placeholder="Confirm password"
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                      <Input
                        id="phone"
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Your phone number"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  {/* streetAdr */}
                  <div>
                    <Label htmlFor="streetAdr">streetAdr (Optional)</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                      <Input
                        id="streetAdr"
                        value={signUpData.streetAdr}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, streetAdr: e.target.value }))}
                        placeholder="Street streetAdr"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  {/* City, State, ZIP */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={signUpData.city}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="City"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={signUpData.state}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="State"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={signUpData.zipCode}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, zipCode: e.target.value }))}
                        placeholder="ZIP"
                      />
                    </div>
                  </div>
                  
                  {/* Terms and Conditions */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the Terms and Conditions and Privacy Policy
                    </Label>
                  </div>
                  
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={!agreeToTerms || signUpData.password !== signUpData.confirmPassword}
                  >
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


