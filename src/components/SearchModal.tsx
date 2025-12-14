import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const { setSearchQuery, products } = useStore();
  const navigate = useNavigate();
  
  const handleSearch = () => {
    if (query.trim()) {
      setSearchQuery(query);
      navigate('/products');
      onClose();
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  // Filter products for suggestions
  const suggestions = query.trim() 
    ? products
        .filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : [];
  
  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const input = document.getElementById('search-input');
        if (input) input.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 z-50"
          >
            <div className="bg-white rounded-lg shadow-2xl border-0 overflow-hidden">
              {/* Search Input */}
              <div className="p-6 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search for products..."
                    className="pl-12 pr-12 text-lg h-12 border-0 focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Suggestions</h3>
                    <div className="space-y-2">
                      {suggestions.map((product) => (
                        <motion.button
                          key={product.id}
                          whileHover={{ backgroundColor: '#f3f4f6' }}
                          onClick={() => {
                            navigate(`/product/${product.id}`);
                            onClose();
                          }}
                          className="w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-gray-50 transition-colors"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.category}</p>
                          </div>
                          <p className="font-semibold text-blue-600">${product.price}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Search Button */}
              <div className="p-4 border-t bg-gray-50">
                <Button
                  onClick={handleSearch}
                  className="w-full"
                  size="lg"
                  disabled={!query.trim()}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search for "{query}"
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="p-4 bg-gray-50 border-t">
                <p className="text-sm text-gray-500 mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {['Electronics', 'Accessories', 'Gaming', 'New Arrivals'].map((category) => (
                    <Button
                      key={category}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuery(category);
                        setSearchQuery(category);
                        navigate('/products');
                        onClose();
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}