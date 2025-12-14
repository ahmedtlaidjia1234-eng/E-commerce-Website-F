import { use, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  Package,
  Users,
  MessageSquare,
  Star,
  UserCircle,
  ShoppingBag,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SearchModal from './SearchModal';
import { useStore } from '@/lib/store';
import Cookies from 'universal-cookie';
import Header from './MetaHeader';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


export default function Navbar() {
  
  const navigate = useNavigate();
  const { 
    getWebsiteSettings,
    getCurrentUser,
    addFollower,
    getProducts,
    currentUser, 
    cart, 
    signOut, 
    isAdmin, 
    setSearchQuery, 
    searchQuery,
    websiteSettings,
    // addNotification
  } = useStore();

  // addNotification('ass','error')
const CU = currentUser?.user || currentUser;

const cookies = new Cookies();

useEffect(() => {
   // ✅ create instance inside useEffect
  const checkAuth = () => {
    const securedCookie = cookies.get('secured'); // get cookie
    const session = sessionStorage.getItem('adminAuth');

    if (!securedCookie && session === 'true') {
      // if cookie is gone but session says logged in
      sessionStorage.setItem('adminAuth', 'false'); // update session
      signOut(CU?.email)
      setIsMobileMenuOpen(false);
      // console.log('Cookie missing, signed out');
    }

    
  };


  // Check immediately
  checkAuth();

  // Check periodically (optional)
  const interval = setInterval(checkAuth, 5000);

  return () => clearInterval(interval); // cleanup
}, []); // ✅ empty dependency array since cookies are not reactive

useEffect(()=>{
 
  if(!currentUser) navigate('/')

},[currentUser])

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = CU?.wishlist?.length || 0;

  const enableWishListfromSettings = websiteSettings?.settings?.features?.enableWishlist
  const wish =(enableWishListfromSettings && currentUser?.userSettings.enableWishList) || false


  const auth = sessionStorage.getItem('adminAuth')
  const location = useLocation()

  useEffect(()=>{
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  },[location])

  useEffect(()=>{
if(isMobileMenuOpen){
  document.body.style.overflowY = 'hidden'
}else{
  document.body.style.overflowY = 'auto'
}
  },[isMobileMenuOpen])

  useEffect(()=>{
    if(currentUser && currentUser.firstTimeLog && !currentUser.followed){
      setTimeout(()=>{
        if(confirm(`
          Welcome to our platform!
We’re glad to have you with us 🎉

Would you like to subscribe to our newsletter?
You’ll receive an email whenever we release new updates, features, or important announcements.

You can unsubscribe at any time.
          
          `)){
          addFollower(currentUser.email,currentUser.fName)
        }
      },5000)
    }
  },[currentUser])

useEffect(() => {
  getWebsiteSettings();
  getProducts();

  const token = cookies.get('secured'); // read the cookie

  if (token) { // check if token exists
    try {
      const decoded = jwtDecode(token);
      if (decoded?.userWP) {
        getCurrentUser(decoded.userWP);
      }
    } catch (err) {
      console.error("Invalid or expired token:", err);
      // optionally clear cookie or redirect to login
    }
  } else {
    console.log("No token found, user not logged in");
  }
}, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    navigate('/products');
    setIsSearchModalOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      handleSearch(mobileSearchQuery);
      setMobileSearchQuery('');
    }
  };

  const handleSignOut = () => {
   if(signOut(CU?.email)){
     navigate('/');
    setIsMobileMenuOpen(false);
   } 
   
  };

  const handleAuthClick = () => {
    navigate('/auth');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
    <Header />
      <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
                >
                  S
                </div>
                <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {websiteSettings?.companyInfo?.companyName}
                </span>
              </motion.div>
            </Link>
            {/* Desktop Search Bar - Centered */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
                  style={{ color: 'var(--color-text-secondary)' }} 
                />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="pl-10 pr-4 w-full"
                  style={{ backgroundColor: 'var(--color-elementsBackground)' }}
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Icon for Mobile-like behavior */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchModalOpen(true)}
                className="md:hidden"
              >
                <Search className="h-5 w-5" />
              </Button>

              <div id="google_translate_element"></div>

              {/* Wishlist */}
              {wish && <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/wishlist')}
                className="relative border-white hover:border-b transition-colors hover:text-[var(--color-secondary)] hover:border-[var(--color-primary)] duration-300"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs "
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Button>} 

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/cart')}
              
                className="relative border-white hover:border-b transition-colors hover:text-[var(--color-secondary)] hover:border-[var(--color-primary)] duration-300"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              {CU ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild >
                    <Button variant="ghost" size="sm" className="relative">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        {CU?.fName[0]}{CU?.lName[0]}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56" style={{background : 'var(--color-surface)', borderColor: 'var(--color-border)'}}>
                    <div className="px-2 py-1.5 " >
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                        {CU.fName} {CU.lName}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        {CU.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={() => navigate('/profile')} className=" cursor-pointer transition-colors duration-200">
                      <UserCircle className="mr-2 h-4 w-4 hover:border-b border-white hover:border-[var(--color-primary)] " />
                      Profile
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/orders')} className=" cursor-pointer transition-colors duration-200">
                      <ShoppingBag className="mr-2 h-4 w-4 hover:border-b border-white hover:border-[var(--color-primary)]" />
                      Orders
                    </DropdownMenuItem>
                    
                    {wish && <DropdownMenuItem onClick={() => navigate('/wishlist')} className=" cursor-pointer transition-colors duration-200">
                      <Heart className="mr-2 h-4 w-4 hover:border-b border-white hover:border-[var(--color-primary)]" />
                      Wishlist
                    </DropdownMenuItem>}
                    
                   <DropdownMenuItem onClick={() => navigate('/settings')} className=" cursor-pointer transition-colors duration-200">
                          <Settings className="mr-2 h-4 w-4 hover:border-b border-white hover:border-[var(--color-primary)]" />
                          Settings
                        </DropdownMenuItem>

                    {CU.isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin')} className=" cursor-pointer transition-colors duration-200">
                          <Shield className="mr-2 h-4 w-4 hover:border-b border-white hover:border-[var(--color-primary)]" />
                          Admin Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/users')} className=" hover:bg-[var(--color-primary)] hover:text-white cursor-pointer transition-colors duration-200">
                          <Users className="mr-2 h-4 w-4 hover:border-b border-white hover:border-[var(--color-primary)]" />
                          User Management
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/messages')} className=" cursor-pointer transition-colors duration-200">
                          <MessageSquare className="mr-2 h-4 w-4 hover:border-b border-white hover:border-[var(--color-primary)]" />
                          Messages
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/reviews')} className=" cursor-pointer transition-colors duration-200">
                          <Star className="mr-2 h-4 w-4 hover:border-b border-white hover:border-[var(--color-primary)]" />
                          Reviews
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="data-[highlighted]:var(--color-text-secondary) hover:bg-[var(--color-primary)] hover:text-white cursor-pointer transition-colors duration-200">
                      <LogOut className="mr-2 h-4 w-4 hover:border-b border-white hover:border-[var(--color-primary)]" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={handleAuthClick} size="sm" className="data-[highlighted]:var(--color-text-secondary) hover:bg-[var(--color-primary)] hover:text-white cursor-pointer transition-colors duration-200">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
 
        {/* Mobile Menu */}
        <AnimatePresence>
          {(

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t"
              style={isMobileMenuOpen ? { backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' } : {position : 'absolute',visibility : 'hidden'}}
            >
              <div className="px-4 py-4 space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleMobileSearch} className="relative">
                  <Search 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
                    style={{ color: 'var(--color-text-secondary)' }} 
                  />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={mobileSearchQuery}
                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                    className="pl-10 pr-4 w-full"
                    style={{ backgroundColor: 'var(--color-background)' }}
                  />
                </form>
            <hr />
                <div>
                <div id="google_translate_element"></div>
                </div>
<hr />
                {/* Mobile Navigation Links */}
                <div className="space-y-2 overflow-y-auto h-[300px]">
                  {CU ? (
                    <>
                      <div className="flex items-center space-x-3 p-2 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                          {CU.fName[0]}{CU.lName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
                            {CU.fName} {CU.lName}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                            {CU.email}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}
                      >
                        <UserCircle className="mr-3 h-5 w-5" />
                        Profile
                      </Button>

                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => { navigate('/orders'); setIsMobileMenuOpen(false); }}
                      >
                        <ShoppingBag className="mr-3 h-5 w-5" />
                        Orders
                      </Button>

                      <Button
                        variant="ghost"
                        className="w-full justify-start relative"
                        onClick={() => { navigate('/wishlist'); setIsMobileMenuOpen(false); }}
                      >
                        <Heart className="mr-3 h-5 w-5" />
                        Wishlist
                        {wishlistCount > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {wishlistCount}
                          </Badge>
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        className="w-full justify-start relative"
                        onClick={() => { navigate('/cart'); setIsMobileMenuOpen(false); }}
                      >
                        <ShoppingCart className="mr-3 h-5 w-5" />
                        Cart
                        {cartItemsCount > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {cartItemsCount}
                          </Badge>
                        )}
                      </Button>

                      {CU.isAdmin && (
                        <>
                          <div className="border-t pt-2 mt-2" style={{ borderColor: 'var(--color-border)' }}>
                            <p className="text-xs font-medium mb-2 px-2" style={{ color: 'var(--color-text-secondary)' }}>
                              Admin Panel
                            </p>
                            
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => { navigate('/admin'); setIsMobileMenuOpen(false); }}
                            >
                              <Shield className="mr-3 h-5 w-5" />
                              Dashboard
                            </Button>

                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => { navigate('/admin/users'); setIsMobileMenuOpen(false); }}
                            >
                              <Users className="mr-3 h-5 w-5" />
                              Users
                            </Button>

                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => { navigate('/messages'); setIsMobileMenuOpen(false); }}
                            >
                              <MessageSquare className="mr-3 h-5 w-5" />
                              Messages
                            </Button>

                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => { navigate('/reviews'); setIsMobileMenuOpen(false); }}
                            >
                              <Star className="mr-3 h-5 w-5" />
                              Reviews
                            </Button>

                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }}
                            >
                              <Settings className="mr-3 h-5 w-5" />
                              Settings
                            </Button>
                          </div>
                        </>
                      )}


                      <div className="border-t pt-2 mt-2" style={{ borderColor: 'var(--color-border)' }}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600"
                          onClick={handleSignOut}
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          Sign Out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button onClick={handleAuthClick} className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleSearch}
      />
    </>
  );
}