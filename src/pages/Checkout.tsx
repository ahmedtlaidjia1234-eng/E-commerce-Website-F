import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CreditCard, Lock, MapPin, User, Calendar, Shield, HandCoins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { REACT_APP_CHARGILY_APP_KEY } from "@/.env";
import axios from 'axios';
// import ChargilyPay from "@chargily/chargily-pay";
// import ChargilyPayButton from 'chargily-epay-react-js';
// import {create_payement} from 'chargily-epay-react-js'
// import { ChargilyClient } from '@chargily/chargily-pay';

// const client = new ChargilyClient({
//   api_key: REACT_APP_CHARGILY_APP_KEY,
//   mode: 'test', // Change to 'live' when deploying your application
// });

export default function CheckoutPage() {
  const { currentUser,cart, clearCart, addOrder,addNotification } = useStore();
 
  const navigate = useNavigate();
  
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  // const tax = subtotal * 0.08;
  const total = subtotal + shipping;

  function getRandomSixDigitNumber() {
  // Min: 100000, Max: 999999
  return Math.floor(Math.random() * (999 - 100 + 1)) + 100;
}

/////////// localisation 

 const [userLocation, setUserLocation] = useState(null);
  // const [error, setError] = useState(null);

  const fetchUserLocation = () => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
      return;
    }

   if(navigator.geolocation) navigator.geolocation.getCurrentPosition(
      (position) => {
        // setUserLocation({
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude,
        // });
        
        
        setBillingInfo((prev)=>({...prev,
  shippingAddress : 
  {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  }
  ,
  billingAddress : 
    {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  }
}))
        // console.log(null);
      },
      (err) => {
        console.log(err.message);
      }
    );
  };

  useEffect(()=>{
fetchUserLocation()
  },[])
  
//.......................

  const [billingInfo, setBillingInfo] = useState({
  customerid: currentUser?.id,
  customerName: currentUser?.fName + ' ' + currentUser?.lName,
  customerEmail: currentUser?.email,
  customerPhone: currentUser?.phone,
  Status: 'pending',
  total: total,
  items: cart,
  shippingAddress: currentUser.city,
  billingAddress: currentUser.city,
  trackingNumber: getRandomSixDigitNumber(),
  paymentMethod: 'Payment upon receipt',
  });


  //   const handleClick = async () => {
  //   const invoice = {
  //     amount: 600,
  //     invoice_number: 23,
  //     client: "John Doe",
  //     mode: "CIB",          // e.g., payment method
  //     webhook_url: "https://your-backend-url.com/webhook",
  //     back_url: "http://localhost:5173/after-payment",
  //     discount: 0
  //   };

  //   try {
  //     await create_payement(invoice);
  //     // The user may be redirected or payment initiated
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handlePayment = async (e)=>{
    try{
      e.preventDefault()
//       const options = {
//   method: 'POST',
//   headers: {
//     Authorization: `test_sk_q4YQHdWk1XLmEB6y2sHCk6VFjzKhVV53h1UqsPni`,
//     'Content-Type': 'application/json'
//   },
//   body: '{"amount":2000,"currency":"dzd","success_url":"http://localhost:5173/payments/success"}'
// };
//   const pay = await axios.post('https://pay.chargily.net/test/api/v2/checkouts',options.body,{headers : options.headers})
//   if(pay){
//     console.log(pay)
//   } 



const updated = {...billingInfo}

// const productItems = cart
// console.log(productItems)
    if(addOrder(updated)) handleSubmit() 

// axios.post(`${URL}`, {
//         "amount": 10000,
//         "contact": "37990d08-fc51-4c32-ad40-1552d13c00d1",
//         "url": "http://localhost:5173/thank-you-page",
//         "items": [
//             {
//                 "name": "Seller product",
//                 "price": 5000,
//                 "quantity": 2
//             }
//         ]
//     }, {
//         headers: {
//             "Accept": "application/json",
//             "Authorization": `ufzz4as6c9j8r53rb49elx1pw73nshl9ch9nvzi1v355gidi5f`
//         }
//     })
//     .then((result) => {
//         let response = result.data;

//         console.log(response);
//         window.location.href = response.data.url;
//     }).catch((error) => {
//         console.log(error);
//     });


    }catch(err){
      console.log(err)
    }
  }

  const paymentMethods = [
  { id: "default", label: "please press here to select a method" },
  { id: "card", label: "Credit / Debit Card" },
  { id: "paypal", label: "PayPal" },
  { id: "apple", label: "Apple Pay" },
  { id: "google", label: "Google Pay" },
];
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardName: '',
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  

  
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-Background)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products before checkout</p>
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
        </motion.div>
      </div>
    );
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearCart();
    addNotification('Order placed successfully! Thank you for your purchase.', 'success');
    navigate('/');
    setIsProcessing(false);
  };
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };
  
  return (
    <div className="min-h-screen bg-[var(--color-Background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order securely</p>
        </motion.div>
        
        <form onSubmit={handlePayment}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Billing & Payment Info */}
            <div className="space-y-8">
              {/* Billing Information */}
              
              
              {/* Payment Information */}
              <motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.2 }}
>
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <CreditCard className="h-5 w-5 mr-2" />
        Payment Information
      </CardTitle>
    </CardHeader>

    <CardContent className="space-y-4">

      {/* Payment Method Selector */}
      {/* <div>
        <Label>Select Payment Method</Label>
        <Select
          value={paymentInfo.method}
          onValueChange={(value) =>
            setPaymentInfo((prev) => ({ ...prev, method: value }))
          }
          defaultValue={paymentMethods[0].id}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a payment method" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((m) => (
              <SelectItem key={m?.id} value={m.id}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      {/* CARD FORM (Only Show When Selected) */}
      {paymentInfo.method === "card" && (
        <>
          <div>
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              value={paymentInfo.cardName}
              onChange={(e) =>
                setPaymentInfo((prev) => ({ ...prev, cardName: e.target.value }))
              }
              placeholder="Name on card"
              required
            />
          </div>

          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={(e) =>
                setPaymentInfo((prev) => ({
                  ...prev,
                  cardNumber: formatCardNumber(e.target.value),
                }))
              }
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="expiryMonth">Month</Label>
              <Select
                value={paymentInfo.expiryMonth}
                onValueChange={(value) =>
                  setPaymentInfo((prev) => ({ ...prev, expiryMonth: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem
                      key={i + 1}
                      value={String(i + 1).padStart(2, "0")}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expiryYear">Year</Label>
              <Select
                value={paymentInfo.expiryYear}
                onValueChange={(value) =>
                  setPaymentInfo((prev) => ({ ...prev, expiryYear: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem
                      key={i}
                      value={String(new Date().getFullYear() + i)}
                    >
                      {new Date().getFullYear() + i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={paymentInfo.cvv}
                onChange={(e) =>
                  setPaymentInfo((prev) => ({
                    ...prev,
                    cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                  }))
                }
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>
        </>
      )}

      {/* PAYPAL BUTTON */}
      {paymentInfo.method === "paypal" && (
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-gray-700">
            You will be redirected to PayPal to complete your payment.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-3">
            Continue to PayPal
          </button>
        </div>
      )}

      {/* APPLE PAY */}
      {paymentInfo.method === "apple" && (
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            Apple Pay will open a secure payment sheet.
          </p>
          <button className="w-full bg-black text-white py-2 rounded-lg">
            Apple Pay
          </button>
        </div>
      )}

      {/* GOOGLE PAY */}
      {paymentInfo.method === "google" && (
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            Google Pay will open a secure payment sheet.
          </p>
          <button className="w-full bg-gray-800 text-white py-2 rounded-lg">
            Google Pay
          </button>
        </div>
      )}

      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
        {/* <Shield className="h-4 w-4 text-green-600" />
        <span>Your payment information is secure and encrypted</span> */}
      <HandCoins className='mr-3 text-[var(--color-primary)]'/>
      Payment upon receipt
      </div>
    </CardContent>
  </Card>
</motion.div>
            </div>
            
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center space-x-3">
                        <img
                          src={item.product.img}
                          alt={item.product.Name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product.Name}</p>
                          <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">
                          DZD{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `DZD${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    
                    {/* <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div> */}
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>DZD{total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isProcessing}
                    // onClick={()=> handlePayment}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Processing...' : `Order DZD${total.toFixed(2)}`}
                  </Button>
                  
                  <div className="text-center text-xs text-gray-600">
                    <p>By placing this order, you agree to our terms and conditions</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}