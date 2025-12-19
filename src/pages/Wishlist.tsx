import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { useEffect } from 'react';

export default function WishlistPage() {
  const { currentUser,websiteSettings, getWishList,products, removeFromWishlist, addToCart } = useStore();
  const enableWishListfromSettings = websiteSettings?.settings?.features?.enableWishlist
  const wish =(enableWishListfromSettings && currentUser?.userSettings.enableWishList) || false

useEffect(() => {
  getWishList();
}, []);

const removeWishListHandle = async (productId: number) => {
 removeFromWishlist(productId);
  getWishList();
}

  if(wish) {
 if (!currentUser) {
    return (
      <div className="min-h-screen bg-[var(--color-Background)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Heart className="h-24 w-24 text-[var(--color-text-secondary)] mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Sign in to view wishlist</h1>
          <p className="text-[var(--color-text-secondary)] mb-8">Create an account to save your favorite items</p>
          <Link to="/signin">
            <Button size="lg">Sign In</Button>
          </Link>
        </motion.div>
      </div>
    );
  }
  
  const wishlistProducts = products.filter(product => 
    currentUser?.wishlist?.includes((product.id).toString())
  );

  
  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-Background)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Heart className="h-24 w-24 text-[var(--color-text-secondary)] mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-[var(--color-text-secondary)] mb-8">Add some products to your wishlist!</p>
          <Link to="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[var(--color-Background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
          <p className="text-[var(--color-text-secondary)]">{wishlistProducts.length} items saved</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group">
                <div className="relative overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <motion.img
                      src={product.img}
                      alt={product.Name}
                      className="w-full h-48 object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                  
                  {product.discount && (
                    <Badge variant="destructive" className="absolute top-2 left-2">
                      -{product.discount}%
                    </Badge>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeWishListHandle(product.id)}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
                
                <CardContent className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {product.Name}
                    </h3>
                  </Link>
                  
                  <p className="text-[var(--color-text-secondary)] text-sm mb-3 line-clamp-2">
                    {product.desc}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-blue-600">
                        ${product.price}
                      </span>
                      {product.originalPrice && product.discount && (
                        <span className="text-sm text-[var(--color-text-secondary)] line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  
                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
  }
 
}