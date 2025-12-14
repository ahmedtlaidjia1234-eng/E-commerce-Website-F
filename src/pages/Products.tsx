import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Filter, Percent } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/lib/store';
import { useSearchParams } from "react-router-dom";

export default function ProductsPage() {
  const { products, searchQuery, setSearchQuery } = useStore();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showDiscountOnly, setShowDiscountOnly] = useState(false);
  const [searchParams] = useSearchParams();
  // Initialize search from store
  useEffect(() => {
    
    if (searchQuery) {
      setLocalSearchTerm(searchQuery);
      // Clear the search query after using it
      setSearchQuery('');
    }

    if(searchParams.get('category')){
      setSelectedCategory(searchParams.get('category'))
    }else{
      setSelectedCategory('all')
    }
    

  }, [searchQuery, setSearchQuery , searchParams]);


 

  const categories = ['all', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.Name.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
                           product.desc.toLowerCase().includes(localSearchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesDiscount = !showDiscountOnly || product.discount;
      
      return matchesSearch && matchesCategory && matchesDiscount;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'discount':
          return (b.discount || 0) - (a.discount || 0);
        default:
          return a.Name.localeCompare(b.Name);
      }
    });
  
  const discountedProducts = products.filter(p => p.discount);
  
  return (
    <div className="min-h-screen bg-[var(--color-Background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-gray-600">Discover amazing products for every need</p>
          
          {/* Discount Banner */}
          {discountedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-lg inline-block"
            >
              <div className="flex items-center space-x-2">
                <Percent className="h-5 w-5" />
                <span className="font-semibold">
                  {discountedProducts.length} products on sale!
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
        
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg mb-8"
        >
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="discount">Discount</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant={showDiscountOnly ? "default" : "outline"}
              onClick={() => setShowDiscountOnly(!showDiscountOnly)}
              className="flex items-center"
            >
              <Percent className="h-4 w-4 mr-2" />
              On Sale Only
            </Button>
            
            {/* <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button> */}
          </div>
          
          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {localSearchTerm && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <span>Search: "{localSearchTerm}"</span>
                <button
                  onClick={() => setLocalSearchTerm('')}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <span>Category: {selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {showDiscountOnly && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <span>On Sale</span>
                <button
                  onClick={() => setShowDiscountOnly(false)}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </motion.div>
        
        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No products found matching your criteria.</p>
              <Button
                onClick={() => {
                  setLocalSearchTerm('');
                  setSelectedCategory('all');
                  setShowDiscountOnly(false);
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 text-gray-600"
        >
          Showing {filteredProducts.length} of {products.length} products
        </motion.div>
      </div>
    </div>
  );
}