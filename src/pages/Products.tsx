import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Percent, Tags, SortAsc, LayoutGrid, X } from 'lucide-react';
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

    // Animation variants
    const fadeInUp = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.9] } },
    };
    
    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    // --- EFFECTS ---

    useEffect(() => {
        if (searchQuery) {
            setLocalSearchTerm(searchQuery);
            setSearchQuery(''); 
        }

        if(searchParams.get('category')){
            setSelectedCategory(searchParams.get('category'))
        } else {
            setSelectedCategory('all')
        }
    }, [searchQuery, setSearchQuery, searchParams]);


    // --- DATA PROCESSING (Optimized with useMemo) ---

    const categories = useMemo(() => {
        return ['all', ...new Set(products.map(p => p.category))];
    }, [products]);
    
    const discountedProducts = useMemo(() => {
        return products.filter(p => p.discount);
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products
            .filter(product => {
                const searchTermLower = localSearchTerm.toLowerCase();
                
                const matchesSearch = product.Name.toLowerCase().includes(searchTermLower) ||
                                     product.desc.toLowerCase().includes(searchTermLower);
                
                const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
                
                const matchesDiscount = !showDiscountOnly || (product.discount > 0);
                
                return matchesSearch && matchesCategory && matchesDiscount;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'price-low':
                        return a.price - b.price;
                    case 'price-high':
                        return b.price - a.price;
                    case 'rating':
                        return (b.rating || 0) - (a.rating || 0); 
                    case 'discount':
                        return (b.discount || 0) - (a.discount || 0);
                    default:
                        return a.Name.localeCompare(b.Name);
                }
            });
    }, [products, localSearchTerm, selectedCategory, showDiscountOnly, sortBy]);


    // --- RENDERING ---
    
    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-Background)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                
                {/* 1. HEADER / HERO SECTION - Elevated Design */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16 pt-8 pb-4"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                        <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                            Explore Our Tech Hub
                        </span>
                    </h1>
                    <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
                        Discover amazing products built for productivity and performance.
                    </p>
                    
                    {/* Discount Banner - High Contrast */}
                    {discountedProducts.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-8 bg-gradient-to-r from-red-600 to-pink-700 text-white p-4 rounded-xl shadow-2xl inline-block"
                        >
                            <div className="flex items-center space-x-3">
                                <Percent className="h-6 w-6" />
                                <span className="font-bold text-lg tracking-wider">
                                    HURRY! {discountedProducts.length} items currently on massive sale!
                                </span>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
                
                {/* 2. FILTERS / SEARCH BLOCK - Distinct Card Style with Floating Effect */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    translate='no'
                    className="p-8 rounded-xl shadow-2xl mb-8 sticky top-0 z-10" // Added sticky and high z-index
                    style={{ backgroundColor: 'var(--color-surface)' }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                        
                        {/* Search Input */}
                        <div className="relative">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-2 block">Search Keyword</label>
                            <Search className="absolute left-3 top-[calc(50%+10px)] transform -translate-y-1/2 text-[var(--color-primary)] h-5 w-5" />
                            <Input
                                placeholder="Product name or description..."
                                value={localSearchTerm}
                                onChange={(e) => setLocalSearchTerm(e.target.value)}
                                className="pl-10 h-12 border-2 focus:border-[var(--color-primary)]"
                                style={{ backgroundColor: 'var(--color-Background)' }}
                            />
                        </div>
                        
                        {/* Category Select */}
                        <div>
                            <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-2 block">Category</label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="h-12 border-2 focus:border-[var(--color-primary)] font-medium" style={{ backgroundColor: 'var(--color-Background)' }}>
                                    <Tags className="h-4 w-4 mr-2 text-[var(--color-primary)]" />
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* Sort By */}
                        <div>
                            <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-2 block">Sort By</label>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-12 border-2 focus:border-[var(--color-primary)] font-medium" style={{ backgroundColor: 'var(--color-Background)' }}>
                                    <SortAsc className="h-4 w-4 mr-2 text-[var(--color-secondary)]" />
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name (A-Z)</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="rating">Rating</SelectItem>
                                    <SelectItem value="discount">Discount</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* Discount Toggle Button */}
                        <Button
                            variant={showDiscountOnly ? "default" : "outline"}
                            onClick={() => setShowDiscountOnly(!showDiscountOnly)}
                            className="flex items-center h-12 text-lg font-semibold w-full"
                            style={showDiscountOnly ? 
                                { backgroundColor: 'var(--color-primary)', color: 'white' } : 
                                { borderColor: 'var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'transparent' }
                            }
                        >
                            <Percent className="h-5 w-5 mr-2" />
                            {showDiscountOnly ? 'Showing Sales' : 'View Sales Only'}
                        </Button>
                    </div>
                </motion.div>
                
                {/* 3. INFO BAR (Active Filters & Count) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 px-2 mb-8 border-b border-[var(--color-border)]"
                >
                    {/* Active Filters - Branded Badges */}
                    <div className="flex flex-wrap gap-2 items-center mb-4 md:mb-0">
                        <span className="font-semibold text-sm text-[var(--color-text)]">Active Filters:</span>
                        
                        {localSearchTerm && (
                            <Badge 
                                className="flex items-center space-x-1 bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]"
                            >
                                <span>Search: "{localSearchTerm}"</span>
                                <button
                                    onClick={() => setLocalSearchTerm('')}
                                    className="ml-1 opacity-70 hover:opacity-100"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )}
                        
                        {selectedCategory !== 'all' && (
                            <Badge 
                                className="flex items-center space-x-1 bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]"
                            >
                                <span>Category: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</span>
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className="ml-1 opacity-70 hover:opacity-100"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )}
                        
                        {showDiscountOnly && (
                            <Badge 
                                className="flex items-center space-x-1 bg-red-600 text-white hover:bg-red-700"
                            >
                                <span>On Sale Only</span>
                                <button
                                    onClick={() => setShowDiscountOnly(false)}
                                    className="ml-1 opacity-70 hover:opacity-100"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )}
                        
                        {/* Clear All Button */}
                        {(localSearchTerm || selectedCategory !== 'all' || showDiscountOnly) && (
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => {
                                    setLocalSearchTerm('');
                                    setSelectedCategory('all');
                                    setShowDiscountOnly(false);
                                }}
                                className="text-sm text-red-500 hover:text-red-700"
                            >
                                Clear All
                            </Button>
                        )}
                    </div>

                    {/* Results count */}
                    <div className="text-base text-[var(--color-text-secondary)] font-medium">
                        Showing <span className="font-bold text-[var(--color-primary)]">{filteredProducts.length}</span> results 
                        out of <span className="font-bold text-[var(--color-text)]">{products.length}</span> total products.
                    </div>
                </motion.div>
                
                {/* 4. Products Grid */}
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={stagger}
                >
                    {filteredProducts.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 border-2 border-dashed border-[var(--color-border)] rounded-xl" 
                            style={{ backgroundColor: 'var(--color-surface)' }}
                        >
                            <LayoutGrid className="h-12 w-12 text-[var(--color-text-secondary)] mx-auto mb-4" />
                            <p className="text-xl font-medium text-[var(--color-text)]">
                                No products found matching your current filter settings.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProducts.map((product) => (
                                <motion.div key={product.id} variants={fadeInUp}>
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}