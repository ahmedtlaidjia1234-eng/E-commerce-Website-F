import { delay, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import { useState } from 'react';

export default function Footer() {
const location = useLocation();
const {websiteSettings,addFollower} = useStore()

  const footerLinks = {
    'Shop': [
      { name: 'All Products', path: '/products' },
      { name: 'Electronics', path: '/products?category=Electronics' },
      { name: 'Accessories', path: '/products?category=Accessories' },
      { name: 'Gaming', path: '/products?category=Gaming' },
    ],
    'Support': [
      { name: 'Contact Us', path: '/messages' },
      { name: 'Reviews', path: '/reviews' },
      // { name: 'Shipping Info', path: '#' },
      // { name: 'Returns', path: '#' },
    ],
    'Company': [
      { name: 'About Us', path: '/About' },
      // { name: 'Careers', path: '#' },
      // { name: 'Press', path: '#' },
      // { name: 'Blog', path: '#' },
    ],
    // 'Legal': [
    //   { name: 'Privacy Policy', path: '#' },
    //   { name: 'Terms of Service', path: '#' },
    //   { name: 'Cookie Policy', path: '#' },
    //   { name: 'Refund Policy', path: '#' },
    // ],
  };
  
 const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: '#', name: 'Facebook' },
    { icon: <Twitter className="h-5 w-5" />, href: '#', name: 'Twitter' },
    { icon: <Instagram className="h-5 w-5" />, href: '#', name: 'Instagram' },
    { icon: <Youtube className="h-5 w-5" />, href: '#', name: 'YouTube' },
  ];

  const socialHundle = (icon)=>{
    // const iconEle = `"${icon} className="h-5 w-5 "`
    // const result = iconEle.replace(/^"(.*)"$/, '$1');
switch (icon) {
    case "facebook":
      return <Facebook className="h-5 w-5"/>;   // replace with your actual component
    case "instagram":
      return <Instagram className="h-5 w-5"/>;
    case "twitter":
      return <Twitter className="h-5 w-5"/>;
    default:
      return null;
  }

  }
  
const [email,setEmail] = useState('')

  const subscribeHandler = ()=>{
    addFollower(email)
  }
  
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
transition={location.pathname == '/' ? { delay: 2.5, duration: 0.8 } : { delay: 0.3, duration: 0.8 }}
            className="text-center text-"
          >
            <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
            <p className="text-xl mb-8 text-blue-100">
              Subscribe to our newsletter for exclusive deals and new product updates
            </p>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white text-gray-900"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <Button variant="secondary" size="lg" style={{border : 'white solid 1px '}} 
              onClick={()=>{subscribeHandler()}}
              >
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
transition={location.pathname == '/' ? { delay: 2.5, duration: 0.8 } : { delay: 0.3, duration: 0.8 }}
            className="lg:col-span-2"
          >
            <Link to="/" className="flex items-center mb-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                {websiteSettings?.companyInfo?.companyName}
              </div>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
            {websiteSettings?.companyInfo?.desc}
              {/* Your premium destination for cutting-edge technology and amazing products. 
              We're committed to providing the best shopping experience with unbeatable prices and quality. */}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-[var(--color-primary)]" />
                <span className="text-gray-300">{websiteSettings?.companyInfo?.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[var(--color-primary)]" />
                <span className="text-gray-300">{websiteSettings?.companyInfo?.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-[var(--color-primary)]" />
                <span className="text-gray-300">{websiteSettings?.companyInfo?.email}</span>
              </div>
            </div>
          </motion.div>
          
          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={location.pathname == '/' ? { delay:2.5 + index * 0.1 } : { delay: 0.3 + index * 0.1, duration: 0.8 }}
            >
              <h4 className="text-lg font-semibold mb-4 text-[var(--color-secondary)]">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-300 text-white transition-colors duration-200 
                      relative inline-block font-medium text-gray-800
         after:content-[''] after:absolute after:left-0 after:-bottom-1
         after:h-[3px] after:w-0 after:bg-[var(--color-primary)]
         after:transition-all after:duration-300 after:ease-out
         hover:after:w-full
                      "
                      onClick={scrollToTop}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        {/* Social Media & Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
transition={location.pathname == '/' ? { delay: 2.5, duration: 0.8 } : { delay: 0.3, duration: 0.8 }}
          className="border-t border-gray-700 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex space-x-4">
              {websiteSettings?.socialMedia?.map((social) => (
                <motion.a
                  key={social.icon}
                  href={social.URL}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-800 p-3 rounded-full hover:bg-[var(--color-primary)] transition-colors duration-200"
                  aria-label={social.name}
                >
                  {socialHundle(social.icon)}
                </motion.a>
              ))}
            </div>
            
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-400">
              <span>© 2024 ShopHub. Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>by <Link to={'https://ahmedtl.com'}>AhmedTL</Link></span>
            </div>
            
            {/* Payment Methods */}
            {/* <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">We accept:</span>
              <div className="flex space-x-2">
                {['Visa', 'MC', 'AMEX', 'PayPal'].map((method) => (
                  <div
                    key={method}
                    className="bg-gray-800 px-2 py-1 rounded text-xs font-semibold text-gray-300 hover:bg-[var(--color-primary)] transition-colors duration-200"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}