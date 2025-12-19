import { motion } from 'framer-motion';
import { useState } from 'react';
import { useParams, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products,currentUser,websiteSettings , addToCart, addReview , addToWishlist } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  
  const enableWishListfromSettings = websiteSettings?.settings?.features?.enableWishlist
  const wish =(enableWishListfromSettings && currentUser?.userSettings.enableWishList) || false

  const enableRatingsFromSettings = websiteSettings?.settings?.features?.enableShowProductRatings

  const reviews = websiteSettings?.settings?.features?.enableReviews
  const product = products.find(p => p.id == id);


  const navigate = useNavigate()
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    // console.log(product)
    addToCart(product, quantity);
  };

  const handleAddToWishList = (id) => {
    if(!currentUser){
      navigate('/auth')
    }else{
      addToWishlist(id);
     
    }
    
  };
  const handleSubmitReview = () => {
    if (reviewerName.trim() && reviewComment.trim()) {
      addReview({
        productId: product.id,
        userName: reviewerName,
        rating: reviewRating,
        comment: reviewComment,
        date: new Date().toISOString().split('T')[0],
        productImage : product.img,
        productName : product.Name
      });
      setReviewerName('');
      setReviewComment('');
      setReviewRating(5);
    }
  };
  
  return (
    <div className="min-h-screen bg-[var(--color-Background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-12"
        >
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <img
                src={product.img}
                alt={product.Name}
                className="w-full rounded-2xl shadow-2xl"
              />
            {wish &&  <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg"
              >
                <div onClick={()=>{handleAddToWishList(product.id)}}>
<Heart  className="h-6 w-6 text-[var(--color-text-secondary)] hover:text-red-500" />
                </div>
                
              </motion.button>}
            </div>
          </motion.div>
          
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div>
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <h1 className="text-4xl font-bold mb-4">{product.Name}</h1>
             {enableRatingsFromSettings && <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-[var(--color-text-secondary)]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[var(--color-text-secondary)]">
                  {product?.rating} ({product?.reviews?.length} reviews)
                </span>
              </div>}
              <div className="text-4xl font-bold text-blue-600 mb-6">
                {product.symbole} {product.price}
              </div>
            </div>
            
            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
              {product.desc}
            </p>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-[var(--color-text-secondary)]">
                {product.stock} items available
              </span>
            </div>
            
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Reviews Section */}
        {reviews == false || product.allowReviews === false ? 
        
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-500 dark:text-gray-400 text-center mt-16">
    Reviews are disabled
  </h1>
        
        : 
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Add Review */}
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reviewer-name">Your Name</Label>
                  <Input
                    id="reviewer-name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                
                {enableRatingsFromSettings && <div>
                  <Label>Rating</Label>
                  <div className="flex space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setReviewRating(rating)}
                        className="p-1"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            rating <= reviewRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-[var(--color-text-secondary)]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>}
                
                <div>
                  <Label htmlFor="review-comment">Your Review</Label>
                  <Textarea
                    id="review-comment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this product"
                    rows={4}
                  />
                </div>
                
                <Button onClick={handleSubmitReview} className="w-full">
                  Submit Review
                </Button>
              </CardContent>
            </Card>
            
            {/* Reviews List */}
            <div className="space-y-4">
              {product?.reviews?.length === 0 ? (
                <p className="text-[var(--color-text-secondary)]">No reviews yet. Be the first to review!</p>
              ) : (
                product?.reviews?.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-lg shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{review.userName}</h4>
                      <span className="text-sm text-[var(--color-text-secondary)]">{review.date}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-[var(--color-text-secondary)]'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[var(--color-text-secondary)]">{review.comment}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>}
      </div>
    </div>
  );
}