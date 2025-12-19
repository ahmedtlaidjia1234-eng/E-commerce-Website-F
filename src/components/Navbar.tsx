import { useEffect, useState } from 'react';
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
  Users,
  MessageSquare,
  Star,
  Globe,
  UserCircle,
  ShoppingBag,
  Shield,
  ArrowRight,
  ChevronDown,
  Home, // Added Home icon
  Layers, // Used for Products/Shop
  Info // Used for About
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 
import SearchModal from './SearchModal';
import { useStore } from '@/lib/store';
import Cookies from 'universal-cookie';
import Header from './MetaHeader';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {URL} from '../lib/BackendURL.js'


export default function Navbar() {
  
  const navigate = useNavigate();
  const { 
    getWebsiteSettings,
    getCurrentUser,
    addFollower,
    updateFollower,
    getWishList,
    getProducts,
    currentUser, 
    cart, 
    signOut, 
    setSearchQuery, 
    searchQuery,
    websiteSettings,
  } = useStore();

  const [lang, setLang] = useState("en");

  const handleLanguageChange = (lang) => {
    // This part of the logic must remain for the Google Translate widget
    const googleSelect = document.querySelector(".goog-te-combo");
    if (!googleSelect) return;

    googleSelect.value = lang;
    googleSelect.dispatchEvent(new Event("change"));
    setLang(lang); // Update local state for visual component
  };

  const CU = currentUser?.user || currentUser;
  const cookies = new Cookies();

  // --- EXISTING LOGIC REMAINS UNTOUCHED --- 
  useEffect(() => {
    const checkAuth = () => {
      const securedCookie = cookies.get('secured');
      const session = sessionStorage.getItem('adminAuth');

      if (!securedCookie && session === 'true') {
        sessionStorage.setItem('adminAuth', 'false');
        signOut(CU?.email)
        setIsMobileMenuOpen(false);
      }
    };
    checkAuth();
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
    if(!currentUser) navigate('/')
  },[currentUser])

    useEffect(()=>{

    if(!currentUser) navigate('/')
  },[])

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = CU?.wishlist?.length || 0;

  const enableWishListfromSettings = websiteSettings?.settings?.features?.enableWishlist
  
  const wishF = ()=> {
    // if(enableWishListfromSettings == true && currentUser.userSettings.enableWishlist == true) return true;
    // return false;
    if(enableWishListfromSettings){
      if(currentUser?.userSettings?.enableWishList){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  }
const wish = wishF()
  const location = useLocation()

  useEffect(()=>{
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  },[location])

  const [scrolled, setScrolled] = useState(false);
 
  useEffect(() => {
    const onScroll = () => {
      // Logic for sticky/animated bar is inverted here: show animation when scrolled past 0
      if(window.scrollY > 10){
        setScrolled(true);
      }else{
        setScrolled(false)
      }
    };

    // Run once on mount to set initial state
    onScroll();

    // Toggle class based on scroll state
    const navbarElement = document.getElementById('navbar');
    if (navbarElement) {
        if (scrolled) {
            navbarElement.classList.add('shadow-lg'); // Apply shadow/style when scrolled
            navbarElement.classList.remove('border-b-0'); 
        } else {
            navbarElement.classList.remove('shadow-lg'); // Remove shadow/style when at top
            navbarElement.classList.add('border-b');
        }
    }


    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [scrolled]); // Re-run effect when scrolled state changes

  useEffect(()=>{
    if(isMobileMenuOpen){
      document.body.style.overflowY = 'hidden'
    }else{
      document.body.style.overflowY = 'auto'
    }
  },[isMobileMenuOpen])

  useEffect(() => {
    getWebsiteSettings();
    getProducts();
    getWishList()
    const token = cookies.get('secured');

    if (token && currentUser) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.userWP) {
          getCurrentUser(decoded.userWP);
        }
      } catch (err) {
        console.error("Invalid or expired token:", err);
      }
    } else {
      signOut(CU?.email);
    }
  }, []);
  // --- END EXISTING LOGIC ---

//   useEffect(()=>{
//     // console.log(currentUser.firstTimeLog)
//     if(currentUser && currentUser.firstTimeLog && currentUser.followed == false){
//       setTimeout(()=>{
//         if(confirm(`
//           Welcome to ${websiteSettings?.companyName}.

// We’re glad to have you here. If you would like to stay informed about our latest products, website updates, and company news, you can choose to join our newsletter.

// By subscribing, we may contact you by email whenever we publish a new product or share important updates. We will only use your email for this purpose, and you can unsubscribe at any time.

// If you would like to receive these updates, please confirm that you want to join our newsletter.

// Thank you for visiting ${websiteSettings?.companyName}.
          
//           `)){
//             addFollower(currentUser.email,currentUser.fName)
//             updateFollower({firstTimeLog : false,followed : true,email : currentUser.email})
//             getCurrentUser()
//           }else{
//             updateFollower({firstTimeLog : false,followed : false,email : currentUser.email})
//             getCurrentUser()
//           }
//       },5000)
//     }
//   },[currentUser])

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
  
  // Define the main navigation links for the secondary bar
  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop Products', path: '/products', icon: Layers },
    // You can replace '/categories' with a dedicated Categories page if one exists
    { name: 'About Us', path: '/about', icon: Info }, 
    { name: 'Contact', path: '/messages', icon: MessageSquare },
  ];

  // Custom button for better mobile menu link
  const MobileNavLink = ({ to, icon: Icon, children, count, onClick = () => {} }) => (
    <Button
      variant="ghost"
      className="w-full justify-start text-base h-12 hover:bg-primary/10 transition-all duration-200"
      onClick={() => { navigate(to); setIsMobileMenuOpen(false); onClick(); }}
    >
      <Icon className="mr-4 h-5 w-5 opacity-70" />
      <span className='font-medium' style={{ color: 'var(--color-text)' }}>{children}</span>
      {count !== undefined && count > 0 && (
        <Badge variant="destructive" className="ml-auto min-w-[24px] flex justify-center">{count}</Badge>
      )}
    </Button>
  );

  // Animation variants for the mobile side-sheet
  const menuVariants = {
    open: { opacity: 1, x: 0, transition: { type: "tween", duration: 0.25 } },
    closed: { opacity: 0, x: "100%", transition: { type: "tween", duration: 0.25 } },
  };

  // Overlay for when mobile menu is open
  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };


  return (
    <>
    <Header />
    <div id="google_translate_element" style={{position : 'absolute',zIndex : '-5'}}></div>
      {/* TWO-TIER NAVIGATION CONTAINER */}
      <nav 
        id='navbar' 
        // translate='no' 
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'border-b'}`}
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        {/* --- 1. PRIMARY BAR (Logo, Search, Icons) --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* 1.1. Logo/Branding */}
            <Link to="/" className="flex items-center space-x-2 p-1 rounded-md transition-all duration-300 hover:opacity-80">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
                translate='no'
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-base shadow-lg"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
                >
                  {(websiteSettings?.companyInfo?.companyName)?.split('')[0].toUpperCase()}
                </div>
                <span className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
                  {websiteSettings?.companyInfo?.companyName || 'TechShop'}
                </span>
              </motion.div>
            </Link>

            {/* 1.2. Desktop Search Bar - Centered (Only visible on large screens) */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
                  style={{ color: 'var(--color-text-secondary)' }} 
                />
                <Input
                  type="text"
                  placeholder="Search products, brands, and expert advice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="pl-10 pr-4 w-full h-10 rounded-full focus-visible:ring-primary"
                  style={{ backgroundColor: 'var(--color-elementsBackground)', borderColor: 'var(--color-border)' }}
                />
              </div>
            </div>

            {/* 1.3. Desktop Navigation Icons + User/Auth */}
            <div  translate='no' className="translator-safe-container notranslate hidden md:flex items-center space-x-2">
              
              {/* Language Selector */}
              <Select  value={lang} onValueChange={handleLanguageChange} >
                <SelectTrigger 
                    className="w-[100px] h-10 border-none bg-[var(--color-elementsBackground)] hover:bg-[var(--color-elementsBackground)]/80 transition-colors"
                    style={{ color: 'var(--color-text)' }}
                >
                  <Globe className="h-4 w-4 mr-2 opacity-70" />
                  <SelectValue placeholder="Lang" />
                </SelectTrigger>
                <SelectContent style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>

              {/* Wishlist */}
              {wish && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/wishlist')}
                  className="relative h-10 w-10 rounded-full hover:bg-primary/10 transition-colors duration-200"
                >
                  <Heart className="h-5 w-5" style={{ color: 'var(--color-text)' }} />
                  {wishlistCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute top-0 right-0 h-4 w-4 p-0 text-xs flex items-center justify-center font-bold"
                    >
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>
              )} 

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/cart')}
                className="relative h-10 w-10 rounded-full hover:bg-primary/10 transition-colors duration-200"
              >
                <ShoppingCart className="h-5 w-5" style={{ color: 'var(--color-text)' }} />
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute top-0 right-0 h-4 w-4 p-0 text-xs flex items-center justify-center font-bold"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              {CU ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild >
                    <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-primary/10 transition-colors duration-200">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-primary/20"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        {CU?.fName[0]}{CU?.lName[0]}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 shadow-2xl" style={{background : 'var(--color-surface)', borderColor: 'var(--color-border)'}}>
                    <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--color-border-secondary)' }}>
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                        {CU.fName} {CU.lName}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>
                        {CU.email}
                      </p>
                    </div>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className=" cursor-pointer transition-colors duration-200 hover:bg-primary/10">
                      <UserCircle className="mr-2 h-4 w-4 text-primary" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')} className=" cursor-pointer transition-colors duration-200 hover:bg-primary/10">
                      <ShoppingBag className="mr-2 h-4 w-4 text-primary" /> Orders
                    </DropdownMenuItem>
                    {wish && <DropdownMenuItem onClick={() => navigate('/wishlist')} className=" cursor-pointer transition-colors duration-200 hover:bg-primary/10">
                      <Heart className="mr-2 h-4 w-4 text-primary" /> Wishlist
                    </DropdownMenuItem>}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/settings')} className=" cursor-pointer transition-colors duration-200 hover:bg-primary/10">
                        <Settings className="mr-2 h-4 w-4 text-primary" /> Settings
                    </DropdownMenuItem>
                    {CU.isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin')} className=" cursor-pointer transition-colors duration-200 hover:bg-primary/10">
                          <Shield className="mr-2 h-4 w-4 text-green-600" /> Admin Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/users')} className=" cursor-pointer transition-colors duration-200 hover:bg-primary/10">
                          <Users className="mr-2 h-4 w-4 text-green-600" /> User Management
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/messages')} className=" cursor-pointer transition-colors duration-200 hover:bg-primary/10">
                          <MessageSquare className="mr-2 h-4 w-4 text-green-600" /> Messages
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/reviews')} className=" cursor-pointer transition-colors duration-200 hover:bg-primary/10">
                          <Star className="mr-2 h-4 w-4 text-green-600" /> Reviews
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className=" cursor-pointer transition-colors duration-200 text-red-500 hover:bg-red-500/10">
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={handleAuthClick} size="sm" className="bg-primary hover:bg-primary/90 transition-colors duration-200 ml-2 shadow-md">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>

            {/* 1.4. Mobile Trigger Icons (visible below MD screens) */}
            <div className="flex items-center md:hidden space-x-1">
              {/* Mobile Search Icon - triggers modal or input depending on design choice (using modal here) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchModalOpen(true)}
                className="h-10 w-10"
              >
                <Search className="h-5 w-5" />
              </Button>
               {/* Mobile Cart Icon */}
               <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/cart')}
                className="relative h-10 w-10"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute top-0 right-0 h-4 w-4 p-0 text-xs flex items-center justify-center font-bold"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>

          </div>
        </div>

        {/* --- 2. SECONDARY BAR (Main Links) - Visible on large screens only --- */}
        <div 
            className={`hidden md:flex justify-center border-t`} 
            style={{ 
                backgroundColor: 'var(--color-elementsBackground)', 
                borderColor: 'var(--color-border)' 
            }}
        >
            <div className="max-w-7xl w-full flex space-x-8 px-4 sm:px-6 lg:px-8 h-12">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`flex items-center text-sm font-medium transition-colors duration-200 border-b-2 h-full
                          ${location.pathname === link.path 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-primary/50'
                          }
                        `}
                    >
                      <link.icon className="h-4 w-4 mr-2" />
                      {link.name}
                    </Link>
                ))}
            </div>
        </div>
      
        {/* 3. Mobile Side-Sheet Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={overlayVariants}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              {/* Menu Content (Slides from Right) */}
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                className="fixed top-0 right-0 h-full w-full max-w-xs shadow-2xl z-50 overflow-y-auto md:hidden"
              >
                <div className="p-4 flex flex-col h-full">
                  
                  {/* Header/Close Button */}
                  <div className="flex justify-between items-center pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Menu</span>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Mobile Main Navigation Links (Prominent at the top) */}
                  <div className="py-4 space-y-1 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    {navLinks.map(link => (
                      <MobileNavLink 
                        key={link.name} 
                        to={link.path} 
                        icon={link.icon}
                        className={location.pathname === link.path ? 'bg-primary/10 text-primary' : ''}
                      >
                        {link.name}
                      </MobileNavLink>
                    ))}
                  </div>

                  {/* Mobile Search - integrated within the menu for immediate access */}
                  <form onSubmit={handleMobileSearch} className="relative mt-4 mb-4">
                    <Search 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
                      style={{ color: 'var(--color-text-secondary)' }} 
                    />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={mobileSearchQuery}
                      onChange={(e) => setMobileSearchQuery(e.target.value)}
                      className="pl-10 pr-4 w-full h-10 rounded-lg focus-visible:ring-primary"
                      style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                    />
                  </form>
                  
                  {/* Language Selector */}
                  <div className="mb-4">
                    <Select value={lang} onValueChange={handleLanguageChange} >
                      <SelectTrigger className="w-full h-11 bg-elementsBackground hover:bg-elementsBackground/80 transition-colors focus:ring-primary" style={{ borderColor: 'var(--color-border)' }}>
                        <Globe className="h-4 w-4 mr-3 opacity-70" />
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* User/Auth Section */}
                  <div className="flex-1 space-y-2 overflow-y-auto pb-4">
                    {CU ? (
                      <>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            {CU.fName[0]}{CU.lName[0]}
                          </div>
                          <div className='overflow-hidden'>
                            <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>
                              {CU.fName} {CU.lName}
                            </p>
                            <p className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>
                              {CU.email}
                            </p>
                          </div>
                        </div>

                        <MobileNavLink to="/profile" icon={UserCircle}>Profile</MobileNavLink>
                        <MobileNavLink to="/orders" icon={ShoppingBag}>Orders</MobileNavLink>
                        {wish && <MobileNavLink to="/wishlist" icon={Heart} count={wishlistCount}>Wishlist</MobileNavLink>}
                        <MobileNavLink to="/settings" icon={Settings}>Settings</MobileNavLink>

                        {CU.isAdmin && (
                          <div className="pt-4 border-t mt-4 space-y-1" style={{ borderColor: 'var(--color-border)' }}>
                            <p className="text-xs font-semibold px-2 text-green-600 mb-1">
                              Admin Panel
                            </p>
                            <MobileNavLink to="/admin" icon={Shield}>Dashboard</MobileNavLink>
                            <MobileNavLink to="/admin/users" icon={Users}>Users</MobileNavLink>
                            <MobileNavLink to="/messages" icon={MessageSquare}>Messages</MobileNavLink>
                            <MobileNavLink to="/reviews" icon={Star}>Reviews</MobileNavLink>
                          </div>
                        )}
                        
                      </>
                    ) : (
                      <div className='flex flex-col space-y-4'>
                          <Button onClick={handleAuthClick} className="w-full h-11 bg-primary hover:bg-primary/90">
                            <User className="h-4 w-4 mr-2" />
                            Sign In / Register
                          </Button>
                      </div>
                    )}
                  </div>

                  {/* Sign Out Button - Always at the bottom for Logged in users */}
                  {CU && (
                      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                          <Button
                              variant="ghost"
                              className="w-full justify-start text-red-500 hover:bg-red-500/10 h-12"
                              onClick={handleSignOut}
                          >
                              <LogOut className="mr-3 h-5 w-5" />
                              <span className='font-medium'>Sign Out</span>
                          </Button>
                      </div>
                  )}

                </div>
              </motion.div>
            </>
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