import axios from 'axios';
import Cookies from 'universal-cookie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {URL} from '@/lib/BackendURL.js'

function convertToDinar(amount, currency) {
  // Example exchange rates (update with real-time values)
  const rates = {
    USD: 151.5, // 1 USD = 151.5 DZD
    EUR: 165.2, // 1 EUR = 165.2 DZD
    DZD: 1      // Already in Dinar
  };

  switch (currency) {
    case "USD":
      return amount * rates.USD;
    case "EUR":
      return amount * rates.EUR;
    case "DZD":
      return amount; // No conversion needed
    default:
      throw new Error("Unsupported currency");
  }
}


export interface Product {
  id: string;
  Name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  desc: string;
  category: string;
  rating: number;
  reviews: Review[];
  allowReviews : boolean
  stock: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: number;
}

export interface User {
  id: string;
  email: string;
  fName: string;
  lName: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  wishlist: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface CompanyInfo {
  name: string;
  description: string;
  mission: string;
  vision: string;
  founded: string;
  employees: string;
  location: string;
  phone: string;
  email: string;
  story: string;
  values: string[];
}

export interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backGroundColor: string;
  elementsBackgroundColor : string
  surfaceColor: string;
  primaryText: string;
  secondaryText: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface SocialMediaLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
}

export interface WebsiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  socialMedia: SocialMediaLinks;
  enableNotifications: boolean;
  enableReviews: boolean;
  enableWishlist: boolean;
  currency: string;
  taxRate: number;
  freeShippingThreshold: number;
  defaultShipping: number;
}

export interface Followers {
  email : string;
  fName : string
}

interface StoreState {
  // Products
  products: Product[];
  
  // Cart
  cart: CartItem[];
  
  // User Authentication
  currentUser: User | null;
  users: User[];
  followers : Followers[]
  // Admin
  isAdmin: boolean;
  
  // Messages
  messages: Message[];
  
  // Notifications
  notifications: Notification[];
  
  // Company Info
  companyInfo: CompanyInfo;
  
  // Theme Colors
  themeColors: ThemeColors;
  
  // Website Settings
  websiteSettings: WebsiteSettings;
  
  // Search
  searchQuery: string;
  

   

  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'reviews'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Discount actions
  addDiscount: (productId: string, discount: number) => void;
  removeDiscount: (productId: string) => void;
  
  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // User actions
  signUp: (userData: Omit<User, 'id' | 'wishlist' | 'createdAt'>) => void;
 signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  updateUser: (userData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  
  // Wishlist actions
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  
  // Review actions
  addReview: (review: Omit<Review, 'id'>) => void;
  
  // Message actions
  addMessage: (message: Omit<Message, 'id' | 'date' | 'isRead'>) => void;
  markMessageAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  
  // Company info actions
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;
  
  // Website settings actions
  updateWebsiteSettings: (settings: Partial<WebsiteSettings>) => void;
  
  // Theme actions
  updateThemeColors: (colors: Partial<ThemeColors>) => void;
  resetThemeColors: () => void;
  applyThemeToDOM: () => void;
  
  // Notification actions
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
  
  // Search actions
  setSearchQuery: (query: string) => void;
  
  // Admin actions
  toggleAdmin: () => void;
}


const defaultThemeColors: ThemeColors = {
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
};

const normalizeThemeColors = (colors: Partial<ThemeColors>): ThemeColors => ({
  primaryColor: colors.primaryColor ?? defaultThemeColors.primaryColor,
  secondaryColor: colors.secondaryColor ?? defaultThemeColors.secondaryColor,
  accentColor: colors.accentColor ?? defaultThemeColors.accentColor,
  backGroundColor: colors.backGroundColor ?? defaultThemeColors.backGroundColor,
  elementsBackgroundColor: colors.elementsBackgroundColor ?? defaultThemeColors.elementsBackgroundColor,
  surfaceColor: colors.surfaceColor ?? defaultThemeColors.surfaceColor,
  primaryText: colors.primaryText ?? defaultThemeColors.primaryText,
  secondaryText: colors.secondaryText ?? defaultThemeColors.secondaryText,
  success: colors.success ?? defaultThemeColors.success,
  warning: colors.warning ?? defaultThemeColors.warning,
  error: colors.error ?? defaultThemeColors.error,
  info: colors.info ?? defaultThemeColors.info,
});




const defaultWebsiteSettings: WebsiteSettings = {
  // siteName: 'ShopHub',
  // siteDescription: 'Your premium destination for cutting-edge technology and amazing products.',
  // contactEmail: 'support@shophub.com',
  // contactPhone: '+1 (555) 123-4567',
  // address: '123 Commerce Street',
  // city: 'Tech City',
  // state: 'TC',
  // zipCode: '12345',
  // country: 'United States',
  // socialMedia: {
  //   facebook: 'https://facebook.com/shophub',
  //   twitter: 'https://twitter.com/shophub',
  //   instagram: 'https://instagram.com/shophub',
  //   linkedin: 'https://linkedin.com/company/shophub',
  //   youtube: 'https://youtube.com/shophub',
  //   tiktok: 'https://tiktok.com/@shophub',
  // },
  // enableNotifications: true,
  // enableReviews: true,
  // enableWishlist: true,
  // currency: 'USD',
  // taxRate: 8.5,
  // freeShippingThreshold: 50,
  // defaultShipping: 9.99,
  
  settings: {
    id: 6,
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
      backGroundColor: "#F9FAFB"
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
      enableTwoFactorAuthentication: false
    }
  },
  companyInfo: {
    id: 4,
    companyName: "shopHub",
    address: "address",
    desc: "description",
    metaDesc: "metaData description",
    vission: "vission",
    mission: "misson",
    story: "your Company Story",
    email: "email@shophub.com",
    phone: "0557362171",
    createdAt: "2025-12-06T17:11:38.751Z",
    updatedAt: "2025-12-06T17:11:38.751Z"
  },
  socialMedia: [
    {
      id: 15,
      icon: "instagram",
      URL: "http://",
      createdAt: "2025-12-06T17:11:38.755Z",
      updatedAt: "2025-12-06T17:11:38.755Z"
    }
  ]


};


export const useStore = create<StoreState>()(

  
  persist(
    (set, get) => ({
      products: [],
      cart: [],
      currentUser: null,
      users: [],
      isAdmin: false,
      messages: [],
      notifications: [],
      searchQuery: '',
      themeColors: defaultThemeColors,
      websiteSettings: defaultWebsiteSettings,
      followers : [],
      companyInfo: {
        name: 'ShopHub',
        description: 'Your premium destination for cutting-edge technology and amazing products.',
        mission: 'To provide the best shopping experience with unbeatable prices and quality.',
        vision: 'To become the world\'s most trusted e-commerce platform.',
        founded: '2020',
        employees: '500+',
        location: 'Tech City, TC',
        phone: '+1 (555) 123-4567',
        email: 'info@shophub.com',
        story: 'Founded in 2020 by a team of passionate entrepreneurs, ShopHub started as a small online store with a big vision. Today, we serve millions of customers worldwide.',
        values: ['Customer First', 'Innovation', 'Quality', 'Integrity', 'Sustainability'],
      },
      getCurrentUser : async (data) =>{
        set({currentUser : data})
      },


      getProducts: async () => {
        try{
          const getProducts = await axios.get(`${URL}/api/products/getProducts`)
          
          if(getProducts.status == 200){
           const getWebsiteSettings = await axios.get(`${URL}/api/webSiteSettings/getWebsiteSettings`);
            if(getWebsiteSettings.status == 200){
              const currency = getWebsiteSettings.data.settings.commerce.currency
              const products = getProducts.data
            //  const conPrice = convertToDinar(50, "USD")
            


const productsInDinar = products.map(product => {
  let priceInDZD;
  let symbole ;
  let cur ;
const rates = { USD: 129.66, EUR: 152.29, DZD: 1 };
  switch (currency) {
    case "USD":
      priceInDZD = (product.price / rates.USD).toFixed(2);
      symbole = '$'
      cur = "USD"
      break;
    case "EUR":
      priceInDZD = (product.price / rates.EUR).toFixed(2);
      symbole = '€'
      cur = "EUR"
      break;
    case "DZD":
      priceInDZD = product.price;
      symbole = 'dz'
      cur = "DZD"
      break;
    default:
      priceInDZD = product.price;
  }

  return {
    ...product,
    originalPrice : priceInDZD,
    price: priceInDZD,
    currency: cur,
    symbole : symbole // update currency after conversion
  };
});
            

  console.log(productsInDinar)

              set({products : productsInDinar})
            }
          }
        }catch(err){
          console.log(err)
        }
      },
      
      addProduct: async (productData) => {
        try{
          const addProduct = await axios.post(`${URL}/api/products/addProduct`,{product: productData})
          if(addProduct.status == 200){
            const data = addProduct.data
            
                    set((state) => ({
          products: [...state.products, data],
        }));
            
            get().addNotification('Product added successfully!','success')
            
          }
        }catch(err){
          console.log(err)
          get().addNotification('cant add this product please try again' , 'error')
        }
        // console.log(productData)
      
        // console.log(newProduct)

        // get().addNotification('Product added successfully!', 'success');
      },
      
      updateProduct: async(id, productData) => {
          try{
            const updateProduct = await axios.put(`${URL}/api/products/updateProduct`,{productData})
            if(updateProduct.status == 200){
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...productData } : p
          ),
        }));
        get().addNotification('Product updated successfully!', 'success');

            }
          }catch(err){
            console.log(err)
            get().addNotification('cant update this product please try again','error')
          }
      },
      
      deleteProduct: async(id) => {
        try{
          const deleteProduct = await axios.delete(`${URL}/api/products/deleteProduct/${id}`)
        if(deleteProduct.status == 200){
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
        get().addNotification('Product deleted successfully!', 'success');

        }
        }catch(err){
          console.log(err)
          get().addNotification('can delete this product please try again', 'error')
        }
      },
      
      addDiscount: async (productId, discount , price) => {
        
        try{
          const newPrice = price - (price * discount / 100)
          const addDiscount = await axios.put(`${URL}/api/products/addDiscount`,{productId,discount,price : newPrice})

          if(addDiscount.status == 200){
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId 
              ? { 
                  ...p, 
                  originalPrice: p.originalPrice || p.price,
                  discount,
                  price: newPrice
                } 
              : p
          ),
        }));
        get().addNotification(`${discount}% discount applied!`, 'success');

          }
        }catch(err){
          console.log(err)
          get().addNotification('cant apply this discount please try again','error')
        }
        
      },
      
      removeDiscount: async (product) => {
        try{
          const productId = product.id
          const price = product.originalPrice
          const deleteDiscount = await axios.put(`${URL}/api/products/addDiscount`,{productId,discount : '',price})
          if(deleteDiscount.status == 200){
                    set((state) => ({
          products: state.products.map((p) =>
            p.id === productId && p.originalPrice
              ? { 
                  ...p, 
                  price: product.originalPrice,
                  discount: ''
                } 
              : p
          ),
        }));
        get().addNotification('Discount removed!', 'info');

          }
        
        }catch(err){
          console.log(err)
          get().addNotification('cant remove the dicount','error')
        }
      },
      
      


      addToCart: (product, quantity = 1) => {
        const { currentUser } = get();
        if (!currentUser) {
          get().addNotification('Please sign in to add items to cart', 'error');
          return;
        }
        
        set((state) => {
          const existingItem = state.cart.find((item) => item.product.id === product.id);
          // console.log(existingItem)
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            cart: [...state.cart, { product, quantity }],
          };
        });
        get().addNotification(`${product.name} added to cart!`, 'success');
      },
      
      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
        get().addNotification('Item removed from cart!', 'info');
      },
      
      updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ cart: [] });
        get().addNotification('Cart cleared!', 'info');
      },
      
      signUp: async (userData) => {
  try {
    // 1️⃣ Fetch existing users
    // const getusers = await axios.get('${URL}/api/user/getAllUsers');
    
    // 2️⃣ Check if email already exists
    // const existingUser = getusers.data.find((u: User) => u.email === userData.email);
    // if (existingUser) {
    //   get().addNotification('Email already exists!', 'error');
    //   return;
    // }

    // 3️⃣ Register new user
    const { data: newUser } = await axios.post(`${URL}/api/user/register`, userData);

    // console.log('New user created:', newUser);

    // 4️⃣ Update store with new user list including the new user
    // set(() => ({
    //   // users: [...getusers.data, newUser],
    //   currentUser: newUser,
    // }));

    get().addNotification('Account created successfully!', 'success');
  } catch (error) {
    console.error('Signup error:', error);
    get().addNotification('Failed to create account!', 'error');
  }
},

addCurrentUser: async (email) =>{
        try{
          const res = await axios.post(`${URL}/api/user/getAllUsers`,{email})
          const resData = res.data
          const {password, ...data} =resData 
          // console.log(data)
          set({currentUser : data})
        
        }catch(err){
          console.log(err)
        }
      },


      getUsers : async () => {
        try {
          const response = await axios.post(`${URL}/api/user/getAllUsers`);
          
          set({ users: response.data });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      },
      
      signIn: async (email, password ) => {
       // console.log({email,password})
  try {
    
    const response = await axios.post(
      `${URL}/api/user/login`,
      { email, password }
    );

    const token = response.data.token;
    if (!token) {
      get().addNotification('Invalid email or password!', 'error');
      return false;
    }

    

    // ✅ Save user in Zustand
    // const usersResponse = await axios.get('${URL}/api/user/getAllUsers');
    // const users = usersResponse.data;
   
    // set({
    //   currentUser: decoded.userWP,
    //   users : users,
    // });

    // ✅ Save cookie correctly
  

    // console.log('✅ Token stored in cookies:', cookies.get('secured'));
// setIsAuthenticated(true)
    
    return {token}

  } catch (err: any) {
    console.error('Login error:', err?.response?.data || err);
    get().addNotification('Login failed!', 'error');
    return false;
  }
},

      
      signOut: async (email) => {
        const cookies = new Cookies()
        try {
          // 1️⃣ Invalidate session on server
          const response = await axios.put(`${URL}/api/user/logout`, {email});
          sessionStorage.setItem('adminAuth','false')
          cookies.remove('secured', { path: '/' });
        set({ currentUser: null, cart: [], isAdmin: false });
        get().addNotification('Signed out successfully!', 'info');
        } catch (error) {
          get().addNotification('error while signing out please try again', 'error');
          console.error('Logout error:', error);
        }
        
        
        
      },
      
      updateUser: async (userData) => {
        const { currentUser } = get();
        
        if (!currentUser) return;
        try{
        const updUser = await axios.put(`${URL}/api/user/updateUser`,{userData})

        if(updUser.status == 201){
          const updatedUser = { ...currentUser, ...userData };
        set((state) => ({
          currentUser: updatedUser,
          users: state.users.map(u => u.id === currentUser.id ? updatedUser : u),
        }));
        get().addNotification('Profile updated successfully!', 'success');

        }
        

        }catch(err){
          get().addNotification('something wrong please try again ...','error')
        }
        
      },
      deleteAccount: async (email)=>{
        try{
          const cookies = new Cookies()
          console.log(email)
        const deleteAccount = await axios.post(`${URL}/api/user/deleteUser`,{email})
          if(deleteAccount.status == 204){
          get().addNotification('the account deleted !','success')
          sessionStorage.setItem('adminAuth','false')
          cookies.remove('secured', { path: '/' });
        set({ currentUser: null, cart: [], isAdmin: false });
            return true
          }
        }catch(err){
          get().addNotification('cant delete this account right now please try again','error')
        return false
        }
      },
      
      deleteUser: (userId) => {
        if (userId === 'admin') {
          get().addNotification('Cannot delete admin user!', 'error');
          return;
        }
        
        set((state) => ({
          users: state.users.filter(u => u.id !== userId),
          currentUser: state.currentUser?.id === userId ? null : state.currentUser,
        }));
        get().addNotification('User deleted successfully!', 'success');
      },
      
      addToWishlist: (productId) => {
        // console.log(get().wishlist)
        console.log(productId)
        const { currentUser } = get();
        if (!currentUser) {
          get().addNotification('Please sign in to add to wishlist', 'error');
          return;
        }
        console.log(currentUser)
        if (currentUser?.wishlist?.includes(productId)) {
          get().addNotification('Item already in wishlist!', 'info');
          return;
        }
        
        const updatedUser = {
          ...currentUser,
          wishlist: [...currentUser.wishlist, productId],
        };
        
        set((state) => ({
          currentUser: updatedUser,
          users: state.users.map(u => u.id === currentUser.id ? updatedUser : u),
        }));
        get().addNotification('Added to wishlist!', 'success');
      },
      
      removeFromWishlist: (productId) => {
        const { currentUser } = get();
        if (!currentUser) return;
        
        const updatedUser = {
          ...currentUser,
          wishlist: currentUser.wishlist.filter(id => id !== productId),
        };
        
        set((state) => ({
          currentUser: updatedUser,
          users: state.users.map(u => u.id === currentUser.id ? updatedUser : u),
        }));
        get().addNotification('Removed from wishlist!', 'info');
      },
      
      addReview: async (reviewData) => {
       
        const { currentUser } = get();
        if (!currentUser) {
          get().addNotification('Please sign in to add a review', 'error');
          return;
        }
        const newReview: Review = {
          ...reviewData,
          id: Date.now().toString(),
          userName: `${currentUser.fName} ${currentUser.lName}`,
        };

        const product = get().products.find(p=> p.id == reviewData.productId)
        const data = {...product,reviews : [...product.reviews,newReview]}
        const addReview = await axios.post(`${URL}/api/products/addReview`,{reviews : data.reviews , ProductId : data.id}) 

        if(addReview.status == 200){
        set((state) => ({
          products: state.products.map((p) =>
            p.id === reviewData.productId
              ? {
                  ...p,
                  reviews: [...p.reviews, newReview],
                  rating: [...p.reviews, newReview].reduce((acc, r) => acc + r.rating, 0) / [...p.reviews, newReview].length,
                }
              : p
          ),
        }));
        get().addNotification('Review added successfully!', 'success');

        }else{
        get().addNotification('Review cant be added please try again!', 'error');
        }
      },
      
      addMessage: (messageData) => {
        const newMessage: Message = {
          ...messageData,
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          isRead: false,
        };
        
        set((state) => ({
          messages: [newMessage, ...state.messages],
        }));
        get().addNotification('Message sent successfully!', 'success');
      },
      
      markMessageAsRead: (id) => {
        set((state) => ({
          messages: state.messages.map(msg => 
            msg.id === id ? { ...msg, isRead: true } : msg
          ),
        }));
      },
      
      deleteMessage: (id) => {
        set((state) => ({
          messages: state.messages.filter(msg => msg.id !== id),
        }));
        get().addNotification('Message deleted', 'info');
      },
      
      updateCompanyInfo: (info) => {
        set((state) => ({
          companyInfo: { ...state.companyInfo, ...info },
        }));
        get().addNotification('Company information updated!', 'success');
      },
      
      updateUserSettings : async (UserSettings , email) => {
       try{
        console.log(UserSettings)
        const updateSettings = await axios.put(`${URL}/api/user/EditUserSettings`,{UserSettings , email})
        if(updateSettings.status == 200)
          {
        set((state)=> ({
        currentUser: {
          ...state.currentUser,
          userSettings: { ...state.currentUser.userSettings, ...UserSettings }
        }
      }
    ))
          get().addNotification('User settings updated!', 'success');
          return true
        }
        return false
       }catch(err){
        get().addNotification('cant update the user settings please try again', 'error');
        console.log(err)
       }  
        

        // 

      },

      AddSocial : async (data) =>{
        try{
          // 
          const add = await axios.post(`${URL}/api/user/socials/addSocial`,{data})
          if(add.status == 200){
            get().addNotification('the social Media account was created with succes ', 'success')
          }
          
        }catch(err){
          console.log(err)
          get().addNotification('cant add a social Media link please try again.' , 'error')
        }
      },

      DeleteSocial : async (id) => {
        try{
          const removeSoical = await axios.post(`${URL}/api/user/socials/deleteSocial`,{id})
          if(removeSoical.status == 204){
            get().addNotification('the social Media account was removed with succes ', 'success')
          }else{
            get().addNotification('cant remove this soial Media Account please try again', 'error')
          }
        }catch(err){
          console.log(err)
        }
      },
      
      getWebsiteSettings: async () => {
  try {
    const res = await axios.get(`${URL}/api/webSiteSettings/getWebsiteSettings`);

    if (res.status === 200) {
      const data = res.data;

      const normalizedColors = normalizeThemeColors(
        data.settings?.colors || {}
      );
      set({
        websiteSettings: data,
        themeColors: normalizedColors,
      });

      get().applyThemeToDOM();
    }
  } catch (err) {
    console.error(err);
    get().addNotification('Failed to load website settings', 'error');
  }
},


      updateWebsiteSettings: async (settings) => {
        try{
          const updateSettingsReq =await axios.put(`${URL}/api/webSiteSettings/updateWebsiteSettings`,{settings})

          if(updateSettingsReq.status == 200){
          set((state) => ({
          websiteSettings: {...settings }
        }
      ));
        get().addNotification('Website settings updated!', 'success');

          }
        
        }catch(err){
          console.log(err)
          get().addNotification('cant update the settings please try again', 'error')
        }
      },
      
      updateThemeColors: (colors) => {
        // console.log(colors)
        set((state) => ({
          themeColors: { ...state.themeColors, ...colors },
        }));
        // get().applyThemeToDOM();
        // get().addNotification('Theme colors updated!', 'success');
      },
      
      resetThemeColors: () => {
        set({ themeColors: defaultThemeColors });
        get().applyThemeToDOM();
        get().addNotification('Theme colors reset to default!', 'info');
      },
      
      applyThemeToDOM: () => {
        const { themeColors } = get();
        const root = document.documentElement;
        
        // Apply CSS custom properties
        root.style.setProperty('--color-primary', themeColors.primaryColor);
        root.style.setProperty('--color-secondary', themeColors.secondaryColor);
        root.style.setProperty('--color-accent', themeColors.accentColor);
        root.style.setProperty('--color-background', themeColors.backGroundColor);
        root.style.setProperty('--color-elementsBackground', themeColors.elementsBackgroundColor);
        root.style.setProperty('--color-surface', themeColors.surfaceColor);
        root.style.setProperty('--color-text', themeColors.primaryText);
        root.style.setProperty('--color-text-secondary', themeColors.secondaryText);
        root.style.setProperty('--color-border', themeColors.border);
        root.style.setProperty('--color-success', themeColors.success);
        root.style.setProperty('--color-warning', themeColors.warning);
        root.style.setProperty('--color-error', themeColors.error);
        root.style.setProperty('--color-info', themeColors.info);
      },

      addFollower : async (email,fName) => {
        try{
          const follow = await axios.post(`${URL}/api/followers/addFollower`,{email,fName})
          if(follow.status == 200){
            // set((state)=>({...state,followers : {...state.followers , email,fName}}))
            get().addNotification('thank you for following us!', 'success');
          }else if (follow.status == 404){
            get().addNotification('We cant reach this email please write a valid one', 'info');
          }
        }catch(err){
          console.log(err)
          get().addNotification('please try again', 'error');
        }
      },

      updateFollowState: async (email) =>{
        try{
          const update = await axios.post(`${URL}/api/followers/addFollower`,{email})
          if(update.status == 201){
            get().addNotification('updated with success','success')
          }
        }catch(err){
          console.log(err)
          get().addNotification('cant update this please try again','error')
        }
      },
      
      getFollowers : async () =>{
        try{
          const followers = await axios.get(`${URL}/api/followers/getFollowers`)
          if(followers.status == 200){
        //  console.log([followers.data])
           set({ followers : followers?.data });
          }
        }catch(err){
          console.log(err)
          get().addNotification('cant get followers data please reload the page','error')
        }
      }
      ,

      addNotification: (message, type) => {
        const notification: Notification = {
          id: Date.now().toString(),
          message,
          type,
          timestamp: Date.now(),
        };
        set((state) => ({
          notifications: [...state.notifications, notification],
        }));
        
        setTimeout(() => {
          get().removeNotification(notification.id);
        }, 5000);
      },
      
      removeNotification: (id) => {
        set((state) => ({
          notifications: id ? state.notifications.filter((n) => n.id !== id) : [],
        }));
      },
      
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },
      
      toggleAdmin: () => {
        set((state) => ({ isAdmin: !state.isAdmin }));
      },
    }),
    {
      name: 'ecommerce-store',
    }
  )
);