import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationSystem from './components/NotificationSystem';
import ThemeProvider from './components/ThemeProvider';
import Index from './pages/Index';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import Messages from './pages/Messages';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';
import VerifyEmailPage from './pages/VerifyEmailPage';
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();
const wish = true
const App = () => (
<HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
            <Navbar />
            <NotificationSystem />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} /> 
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/signin" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                {wish && <Route path="/wishlist" element={<Wishlist />} />}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
</HelmetProvider>
);

export default App;