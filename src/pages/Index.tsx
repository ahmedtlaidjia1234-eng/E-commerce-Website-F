import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, Shield, Headphones, Monitor, Laptop, Mouse, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/lib/store';
import { useEffect , useState } from 'react';
import Loader from '@/components/ui/loader';

// --- New/Updated Data for Computer Commerce ---

const heroSlides = [
  { 
    id: 1, 
    image: "https://i.ibb.co/Pv5nrcXV/Chat-GPT-Image-Dec-15-2025-01-46-47-PM.png", 
    alt: "High-Performance Gaming Laptop",
    tagline: "Unleash the Power: Latest Gen Processors"
  },
  { 
    id: 2, 
    image: "https://i.ibb.co/rRvx3dKw/Chat-GPT-Image-Dec-15-2025-02-10-01-PM.png", 
    alt: "Sleek Desktop Setup with Dual Monitors",
    tagline: "The Ultimate Workstation: Built for Productivity"
  },
  { 
    id: 3, 
    image: "https://i.ibb.co/TxzXygQM/Chat-GPT-Image-Dec-15-2025-06-34-30-PM.png", 
    alt: "Mechanical Keyboard and Gaming Mouse",
    tagline: "Precision Peripherals: Elevate Your Game"
  },
];

const categories = [
  { title: "Laptops", icon: <Laptop className="h-6 w-6" />, link: "/products?category=laptops", image: "https://images.unsplash.com/photo-1491472253230-a044054ca35f?q=80&w=884&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { title: "Desktops", icon: <Cpu className="h-6 w-6" />, link: "/products?category=desktops", image: "https://wallpapers.com/images/hd/pc-gaming-setup-rgb-4k-ft1ym37yjyb7lp19.jpg" },
  { title: "Monitors", icon: <Monitor className="h-6 w-6" />, link: "/products?category=monitors", image: "https://img.freepik.com/photos-gratuite/vue-affichage-du-moniteur-ordinateur_23-2150757457.jpg?t=st=1765814774~exp=1765818374~hmac=8f19fae8e1d79220cf172fa7643ca187704048bd51c115b4f706b33168d7b8e9&w=1060" },
  { title: "Accessories", icon: <Mouse className="h-6 w-6" />, link: "/products?category=accessories", image: "https://assets2.razerzone.com/images/og-image/pc-accessories-category-OGimage.jpg" },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      delayChildren: 0.3,
      staggerChildren: 0.2 
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

// --- New Component: CategoryShowcase ---
const CategoryShowcase = () => (
  <section className="py-20" style={{zIndex : 1,position : 'relative'}}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">Shop By Category</h2>
        <p className="text-lg text-gray-600">Find the perfect tech for your needs</p>
      </motion.div>
      
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {categories.map((category, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to={category.link} className="block group">
              <Card className="overflow-hidden p-0 border-0 transition-all duration-300 relative h-64">
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <motion.img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                </div>
                
                <CardContent className="p-6 relative z-10 flex flex-col justify-end h-full">
                  <div className="flex items-center text-white mb-2">
                    {category.icon}
                    <h3 className="text-2xl font-bold ml-3">{category.title}</h3>
                  </div>
                  <motion.span
                    className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ y: 5 }}
                    whileInView={{ y: 0 }}
                  >
                    Browse {category.title} &rarr;
                  </motion.span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);


export default function HomePage() {
  const {applyThemeToDOM, websiteSettings, products } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0); // State for Hero Slide

  // Simulate slide transition for Hero
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(slideTimer);
  }, []);
  
  const featuredProducts = products.slice(0, 8); // Showing more featured products

  const features = [
    {
      icon: <Truck className="h-8 w-8 text-[var(--color-primary)]" />,
      title: 'Delivery',
      description: 'Fast and reliable shipping throughout Algeria',
    },
    {
      icon: <Shield className="h-8 w-8 text-[var(--color-accent)]" />,
      title: 'Guarantee',
      description: 'Extended protection on all core components',
    },
    {
      icon: <Headphones className="h-8 w-8 text-[var(--color-primary)]" />,
      title: 'Tech Support',
      description: 'Expert help available 24/7 for setup and issues',
    },
  ];

  // Loader and Theme logic remains the same
  useEffect(() => {
    applyThemeToDOM();
  }, [applyThemeToDOM]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setShowLoader(false);
      }, 1000);
    }, 2000);
    if (!isLoading) {
      window.document.body.style.overflow = "auto";
    } else {
      window.document.body.style.overflow = "hidden";
    }
    return () => clearTimeout(timer);
  }, [isLoading]);
  
  return (
    <div className="min-h-screen">
      {showLoader && (<Loader isLoading={isLoading}/>)}
      
      {/* Hero Section - Animated Carousel Style */}
      <motion.section
        className="relative overflow-hidden bg-gray-900 text-white min-h-[70vh] flex items-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 , delay: 2}}
      >
        {/* Background Image/Carousel Container */}
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <motion.img
              key={slide.id}
              src={slide.image}
              alt={slide.alt}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: index === currentSlide ? 1 : 0, scale: index === currentSlide ? 1 : 1.1 }}
              transition={{ duration: 1.5 }}
            />
          ))}
          <div className="absolute inset-0 bg-black/60"></div> {/* Overlay */}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 , delay: 2.5}}
            >
              <motion.h1
                className="text-4xl lg:text-4xl font-extrabold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.7 }}
              >
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                  {heroSlides[currentSlide].tagline}
                </span>
              </motion.h1>
              
              <motion.p
                className="text-xl text-gray-300 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.9 }}
              >
                {websiteSettings?.companyInfo?.desc || "Your trusted source for cutting-edge computers, peripherals, and gaming gear. Powering your digital world."}
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3.1 }}
              >
                <Link to="/products">
                  <Button size="lg" className="group bg-[var(--color-primary)] hover:bg-[var(--color-accent)] transition-colors">
                    Explore Our Tech
                    <motion.div
                      className="ml-2"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </Link>
                <Link to={'/about'}>
                  <Button variant="outline" size="lg" className="bg-transparent">
                    Why Choose Us
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* The second column can be reserved for an additional, smaller floating image or graphic, or left open for focus */}
            <div className="hidden lg:block">
              {/* Optional: Floating graphic like a stylized CPU or circuit board */}
            </div>
          </div>
        </div>
      </motion.section>
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: 'easeOut' }}
  className="relative w-full py-16"
  style={{ backgroundColor: 'var(--color-Background)' }}
>
  <Link to={'/about'}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <Card
      className="overflow-hidden border-0 shadow-2xl"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <div className="relative">
        <img
          src="https://i.ibb.co/JWXbJfCJ/9df87ea8c473.png"
          alt="Our physical store and inventory"
          className="w-full h-[420px] object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Caption */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h3 className="text-3xl font-bold mb-2">
            Our Physical Store
          </h3>
          <p className="max-w-2xl text-lg text-white/90 leading-relaxed">
            A real location, real products, and a dedicated team committed to
            delivering quality technology and reliable service every day.
          </p>
        </div>
      </div>
    </Card>
  </div>
  </Link>
</motion.div>
      {/* NEW: Product Category Showcase Section */}
      <div
      className="image-wrapper"
>
  <div className="background-image" />
  <CategoryShowcase />
<section className="py-20" style={{zIndex : 1,position : 'relative'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 , delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Tech Store?</h2>
            <p className="text-xl text-gray-600">Committed to Quality, Performance, and Support</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="text-center p-8 border-2 border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    <motion.div
                      className="mb-4 inline-block p-3 rounded-full bg-blue-50"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

</div>
      
      
      {/* Features Section - Retained but with updated content */}
      
      
      {/* Featured Products - Increased to 8, Grid adapted */}
      <section className="py-20 bg-[var(--color-Background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 , delay: 0.2}}
          >
            <h2 className="text-4xl font-bold mb-4">Top Rated Tech Deals</h2>
            <p className="text-xl text-gray-600">Powerhouse performance at unbeatable prices</p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Loop through more products. Assuming ProductCard has its own enter animation for better staggering */}
            {featuredProducts.map((product, index) => (
              // The ProductCard component should handle its own Framer Motion animation (e.g., scale-up on hover, fade-in on mount)
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link to="/products">
              <Button size="lg" variant="outline" className="group border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                View All Products
                <motion.div
                  className="ml-2"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}