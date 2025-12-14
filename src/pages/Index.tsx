import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/lib/store';
// import { initialProducts } from '@/lib/data';
import { useEffect , useState } from 'react';
import Loader from '@/components/ui/loader';

export default function HomePage() {
  const {applyThemeToDOM,websiteSettings,products, addProduct } = useStore();
  const [isLoading, setIsLoading] = useState(true);
const [showLoader, setShowLoader] = useState(true);
  // Initialize products if empty
  // useEffect(() => {
  //   if (products.length === 0) {
  //     initialProducts.forEach((product) => {
      
  //       addProduct(product);
  //     });
  //   }
  // }, [products.length, addProduct]);
  
  // useEffect(() => {
    
  // }, []);


  const featuredProducts = products.slice(0, 4);
  // console.log(initialProducts)
  
  const features = [
    {
      icon: <Truck className="h-8 w-8 text-[var(--color-primary)]" />,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50',
    },
    {
      icon: <Shield className="h-8 w-8 text-[var(--color-accent)]" />,
      title: 'Secure Payment',
      description: '100% secure payment processing',
    },
    {
      icon: <Headphones className="h-8 w-8 text-[var(--color-primary)]" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support',
    },
  ];

useEffect(() => {
    applyThemeToDOM();
  }, [applyThemeToDOM]);

useEffect(() => {
  const timer = setTimeout(() => {
    setIsLoading(false);

    // Wait for animation duration before unmounting the loader
    setTimeout(() => {
      setShowLoader(false);
    }, 1000); // must match animation duration in CSS

  }, 2000);
 if(!isLoading){
      window.document.body.style.overflow = "auto";
     
    }else{
      window.document.body.style.overflow = "hidden";
    }
  return () => clearTimeout(timer);
}, [isLoading]);
  
  return (
    <div className="min-h-screen">
      {showLoader  && (<Loader isLoading={isLoading}/>)}
      {/* Hero Section */}
      <motion.section
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 ,delay: 2}}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 ,delay: 2.5}}
            >
              <motion.h1
                className="text-5xl lg:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-[var(--color-primary)]  to-[var(--color-secondary)] bg-clip-text text-transparent">
                  Shop the Future
                </span>
              </motion.h1>
              
              <motion.p
                className="text-xl text-gray-600 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {websiteSettings?.companyInfo?.desc}

                {/* Discover amazing products with cutting-edge technology and unbeatable prices. 
                Your perfect shopping experience starts here. */}
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link to="/products">
                  <Button size="lg" className="group">
                    Shop Now
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
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
                </Link>
                
              </motion.div>
              
              <motion.div
                className="flex items-center space-x-6 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">Trusted by 10,000+ customers</span>
              </motion.div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.div
                className="relative z-10"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop"
                  alt="Featured Product"
                  className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl"
                />
              </motion.div>
              
              {/* Floating elements */}
              <motion.div
                className="absolute top-10 -left-10 bg-white p-4 rounded-2xl shadow-lg"
                animate={{ 
                  y: [0, -10, 0],
                  x: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">In Stock</span>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute bottom-10 -right-10 bg-[var(--color-primary)] hover:bg-[var(--color-accent)] transition-colors text-white p-4 rounded-2xl shadow-lg"
                animate={{ 
                  y: [0, 10, 0],
                  x: [0, -5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">50%</div>
                  <div className="text-sm">OFF</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 , delay: 2.5 }}
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose {} Shop?</h2>
            <p className="text-xl text-gray-600">Experience the best in online shopping</p>
          
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 2.5 }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    <motion.div
                      className="mb-4 inline-block"
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
          </motion.div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-20 bg-[var(--color-Background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 , delay: 2.5}}
          >
            <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Discover our most popular items</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 2.5 }}
          >
            <Link to="/products">
              <Button size="lg" variant="outline" className="group">
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