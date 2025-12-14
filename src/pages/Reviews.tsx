import { motion } from 'framer-motion';
import { useState } from 'react';
import { Star, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';

export default function ReviewsPage() {
  const { products } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  
  // Get all reviews from all products
  const allReviews = products.flatMap(product => 
    product.reviews.map(review => ({
      ...review,
      productName: product.name,
      productImage: product.image,
    }))
  );
  
  const filteredReviews = allReviews
    .filter(review => 
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(review => 
      filterRating === 'all' || review.rating === parseInt(filterRating)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const averageRating = allReviews.length > 0 
    ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
    : 0;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: allReviews.filter(review => review.rating === rating).length,
    percentage: allReviews.length > 0 
      ? (allReviews.filter(review => review.rating === rating).length / allReviews.length) * 100 
      : 0,
  }));
  
  return (
    <div className="min-h-screen bg-[var(--color-Background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Customer Reviews</h1>
          <p className="text-xl text-gray-600">See what our customers are saying</p>
        </motion.div>
        
        {/* Reviews Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Overall Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-5xl font-bold">{averageRating.toFixed(1)}</div>
                <div>
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${
                          i < Math.floor(averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">{allReviews.length} total reviews</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="w-8 text-sm">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-sm text-gray-600">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Review Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Most Reviewed Product</span>
                  <Badge variant="secondary">
                    {products.length > 0 
                      ? products.reduce((prev, current) => 
                          prev.reviews.length > current.reviews.length ? prev : current
                        ).name
                      : 'N/A'
                    }
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Highest Rated Product</span>
                  <Badge variant="secondary">
                    {products.length > 0 
                      ? products.reduce((prev, current) => 
                          prev.rating > current.rating ? prev : current
                        ).name
                      : 'N/A'
                    }
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Recent Reviews</span>
                  <Badge variant="secondary">
                    {allReviews.filter(review => {
                      const reviewDate = new Date(review.date);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return reviewDate > weekAgo;
                    }).length} this week
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-lg mb-8"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white hover:text-white">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </motion.div>
        
        {/* Reviews List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">No reviews found matching your criteria.</p>
              <Link to="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Link to={`/product/${review.productId}`}>
                          <img
                            src={review.productImage}
                            alt={review.productName}
                            className="w-16 h-16 object-cover rounded-lg hover:scale-105 transition-transform"
                          />
                        </Link>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{review.userName}</h3>
                              <Link 
                                to={`/product/${review.productId}`}
                                className="text-blue-600 hover:underline"
                              >
                                {review.productName}
                              </Link>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8 text-gray-600"
          >
            Showing {filteredReviews.length} of {allReviews.length} reviews
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}