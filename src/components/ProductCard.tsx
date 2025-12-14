import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, useStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { websiteSettings,addToCart, addToWishlist, removeFromWishlist, currentUser } = useStore();
  const navigate = useNavigate();

  const enableWishListfromSettings = websiteSettings?.settings?.features?.enableWishlist
  const wish =(enableWishListfromSettings && currentUser?.userSettings.enableWishList) || false


  const isInWishlist = currentUser?.wishlist?.includes(product.id) || false;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      navigate('/signin', { state: { from: { pathname: '/products' } } });
      return;
    }
    console.log(product)
    addToCart(product);
  };
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      navigate('/signin', { state: { from: { pathname: '/products' } } });
      return;
    }
    
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link to={`/product/${product.id}`}>
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
          <div className="relative overflow-hidden">
            <motion.img
              src={product.img}
              alt={product.name}
              className="w-full h-48 object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Discount Badge */}
            {product.discount && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                -{product.discount}%
              </Badge>
            )}
            
            {/* Low Stock Badge */}
            {product.stock < 10 && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                Low Stock
              </Badge>
            )}
            
            {/* Wishlist Button */}
            {wish && <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className={`absolute top-2 right-2 p-2 rounded-full shadow-lg transition-colors ${
                product.stock >= 10 ? 'top-2' : 'top-12'
              } ${
                isInWishlist 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </motion.button>}
            
            {/* Hover Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/20 flex items-center justify-center"
            >
              <Button
                onClick={handleAddToCart}
                className="bg-white text-black hover:bg-gray-100"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </motion.div>
          </div>
          
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                {product.name}
              </h3>
              <Badge variant="secondary">{product.category}</Badge>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product?.reviews?.length} reviews)
              </span>
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <div className="flex flex-col">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold text-[var(--color-primary)]"
              >
                {product.symbole} {product.price}
              </motion.div>
              {product.originalPrice && product.discount && (
                <div className="text-sm text-gray-500 line-through">
                  {product.symbole} {product.originalPrice}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {product.stock} in stock
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}