import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { LogIn, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';
import axios from 'axios';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useStore();

  const [code, setCode] = useState('');

  const storedCode = sessionStorage.getItem('verificationCode');
  const pendingUser = sessionStorage.getItem('pendingUser');

  const email = location.state?.email || 'your email';

  const handleVerify = async () => {
 try {
      const Code = await axios.post('http://localhost:5000/api/user/verification/verifyCode',{
         email : pendingUser ? JSON.parse(pendingUser).email : '',
          code : code
        });

        if(Code.status !== 200){
          alert('Invalid verification code');
          return;
        }

        const userData = JSON.parse(pendingUser);
    delete userData.confirmPassword;

    // ✅ NOW we finally create the account
     signUp(userData);
    LogIn(userData);
    sessionStorage.clear();
    navigate('/');

      }catch(err){
        console.log(err);
      }

    // if (code !== storedCode) {
    //   alert('Invalid verification code');
    //   return;
    // }

    // if (!pendingUser) {
    //   alert('Signup data expired');
    //   navigate('/auth');
    //   return;
    // }

    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-green-500" />
            <CardTitle className="mt-3 text-2xl">Verify Your Email</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Enter the 6-digit code sent to {email}
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <Input
              maxLength={6}
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <Button className="w-full" onClick={handleVerify}>
              Verify & Create Account
            </Button>

            <Button
              className="w-full"
              variant="ghost"
              onClick={() => navigate('/auth')}
            >
              Back
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
