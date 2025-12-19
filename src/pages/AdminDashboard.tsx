import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Star, 
  MessageSquare,
  Edit,
  Trash2,
  Eye,
  Percent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import axios from 'axios';
import {FURL,DURL,GURL} from '@/lib/UploadImagesURL.js'
import { Switch } from '@/components/ui/switch';
import {URL} from '@/lib/BackendURL.js'

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { 
    currentUser,  
    products,
    getProducts, 
    users, 
    cart, 
    messages,
    addProduct, 
    updateProduct, 
    deleteProduct,
    addDiscount,
    removeDiscount,
    addNotification 
  } = useStore();
  const isAdmin = currentUser?.isAdmin;

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [discountProductId, setDiscountProductId] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  
  const [newProduct, setNewProduct] = useState({
    Name: '',
    price: 0,
    img: '',
    desc: '', 
    category: '',
    stock: 0,
    garanty : 0,
    discount : 0
  });

  if (!isAdmin || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Access Denied</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>You need admin privileges to access this dashboard.</p>
        </motion.div>
      </div>
    );
  }

  useEffect(()=>{
    getProducts()
    
  },[])

  const totalRevenue = products.reduce((sum, product) => sum + (product.price * 10), 0); // Mock calculation
  const totalOrders = cart.length * 5; // Mock calculation
  const unreadMessages = messages.filter(msg => !msg.isRead).length;

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!newProduct.name || !newProduct.price || !newProduct.image) {
    //   addNotification('Please fill in all required fields', 'error');
    //   return;
    // }
    
       // Image Uploader /////////////////////////////////

    const fileuploader = await fileToBase64(newProduct.img)
    if(fileuploader){
       
      const api = '7b1460e7911af025d412badcf705415d'
      const uploader = await axios.post(`${FURL}?key=${api}`,{image : fileuploader},{headers : {"Content-Type": "multipart/form-data"}})
      if(uploader){
        const imageDATA = uploader.data.data.delete_url
        const imageID = uploader.data.data.id
        const img = uploader.data.data.url
        const updatedProduct = {
        ...newProduct,
        img,
        imgData: imageDATA,
        image_id : imageID
      };
        setNewProduct(updatedProduct)
            addProduct(
      updatedProduct // Default rating
    );
    
    setNewProduct({
      // name: '',
      // price: 0,
      // image: '',
      // description: '',
      // category: '',
      // stock: 0,
    Name: '',
    price: 0,
    img: '',
    desc: '', 
    category: '',
    stock: 0,
    garanty : 0,
    discount : 0
    });
    setIsAddProductOpen(false);

      }
    }
         ///////////////////////////////// ********************
    // setNewProduct(prev=>({...prev,img : 'pcha'})) 
    
    // console.log(newProduct)

  };

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // ✅ Guard clause
    if (!(file instanceof File || file instanceof Blob)) {
      resolve(null)
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result
      if (typeof result === "string") {
        resolve(result.split(",")[1]) // remove data:image/... prefix
      } else {
        reject("Invalid FileReader result")
      }
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}


  const handleEditProduct = (product: any) => {
    setEditingProduct({ ...product });
    setIsEditProductOpen(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const imageid = editingProduct.image_id.split('/')[3]
      const deleteToken = editingProduct.image_id.split('/')[4]
      
      // const deleteImgReq = await axios.post(`https://api.imgbb.com/1/delete/${}/73b3cd7ed3d54c7e665eae2d66de3cea`)
      // console.log(deleteImgReq)
      
      
      const fileuploader = await fileToBase64(editingProduct.img)
      console.log(fileuploader)
      if(fileuploader){
      const api = '7b1460e7911af025d412badcf705415d'

  //     // delete the old image before adding a new one 

  //     const deleteOldImg = await axios.get(`${DURL}/${editingProduct.image_id}/`)

  //     // -----------------------
  // const url = ``;
// console.log(editingProduct)
      // const uploader = await axios.post(url)
      const uploader = await axios.post(`${FURL}?key=${api}`,{image : fileuploader},{headers : {"Content-Type": "multipart/form-data"}})
      // console.log(uploader)
      if(uploader){
        const imageDATA = uploader.data.data.image.url
        const updatedProduct = {
        ...editingProduct,
        image_id : uploader.data.data.id,
        img: imageDATA,
      };
      // console.log(uploader)
        updateProduct(updatedProduct.id, updatedProduct);
      setIsEditProductOpen(false);
      setEditingProduct(null);
      
        
    }
  }else{
    const filtredData = products.find((v)=>v.id == editingProduct.id)
    const updatedProduct = {...editingProduct, img : filtredData.img}
    // console.log(updatedProduct)
   updateProduct(updatedProduct.id, updatedProduct) 
      setIsEditProductOpen(false);
      setEditingProduct(null);
    
  }
      
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
      getProducts()
    }
  };

  const handleApplyDiscount = () => {
    if (discountProductId && discountAmount > 0) {
      const product = products.find(p=> p.id == discountProductId)
      
      addDiscount(product.id, discountAmount,product.price);
      setDiscountProductId('');
      setDiscountAmount(0);
    }
    // console.log(discountProductId)
  };

  const handleRemoveDiscount = (productId: string) => {
    const product = products.find(p=> p.id == productId)
    removeDiscount(product);
  };

  return (
    <div className="min-h-screen p-4 sm:p-8" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage your e-commerce platform</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card style={{ backgroundColor: 'var(--color-surface)' }}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Total Products</p>
                    <p className="text-xl sm:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{products.length}</p>
                  </div>
                  <Package className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: 'var(--color-primary)' }} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card style={{ backgroundColor: 'var(--color-surface)' }}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Total Users</p>
                    <p className="text-xl sm:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{users.length}</p>
                  </div>
                  <Users className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: 'var(--color-success)' }} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card style={{ backgroundColor: 'var(--color-surface)' }}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Revenue</p>
                    <p className="text-xl sm:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{totalRevenue.toFixed(0)}</p>
                  </div>
                  <DollarSign className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: 'var(--color-accent)' }} />
                </div>
              </CardContent>
            </Card>
          </motion.div> */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card style={{ backgroundColor: 'var(--color-surface)' }}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Messages</p>
                    <p className="text-xl sm:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{unreadMessages}</p>
                  </div>
                  <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: 'var(--color-info)' }} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Button onClick={() => setIsAddProductOpen(true)} className="h-16 text-left flex-col items-start justify-center bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white">
            <Plus className="h-5 w-5 mb-1" />
            Add Product
          </Button>
          
          <Button variant="outline" onClick={() => navigate('/admin/users')} className="h-16 text-left flex-col items-start justify-center hover:bg-[var(--color-secondary)] hover:text-white">
            <Users className="h-5 w-5 mb-1" />
            Manage Users
          </Button>
          
          <Button variant="outline" onClick={() => navigate('/messages')} className="h-16 text-left flex-col items-start justify-center hover:bg-[var(--color-secondary)] hover:text-white">
            <MessageSquare className="h-5 w-5 mb-1" />
            View Messages
          </Button>
          
          <Button variant="outline" onClick={() => navigate('/settings')} className="h-16 text-left flex-col items-start justify-center hover:bg-[var(--color-secondary)] hover:text-white">
            <Package className="h-5 w-5 mb-1" />
            Settings
          </Button>
        </motion.div>

        {/* Discount Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardHeader>
              <CardTitle className="flex items-center" style={{ color: 'var(--color-text)' }}>
                <Percent className="h-5 w-5 mr-2" />
                Discount Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={discountProductId} onValueChange={setDiscountProductId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  type="number"
                  placeholder="Discount %"
                  value={discountAmount || ''}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-32"
                  min="0"
                  max="100"
                />
                
                <Button onClick={handleApplyDiscount} disabled={!discountProductId || discountAmount <= 0}>
                  Apply Discount
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Products Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardHeader>
              <CardTitle style={{ color: 'var(--color-text)' }}>Products Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="hidden sm:table-cell">Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="hidden md:table-cell">Stock</TableHead>
                      <TableHead className="hidden lg:table-cell">Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Link to={`/product/${product.id}`}>
                            <img
                              src={product.img}
                              alt={product.Name}
                              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                            />
                            </Link>
                            
                            <div>
                              <p className="font-medium text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>
                                {product.Name}
                              </p>
                              <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                Rating: {product.rating}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                              {product.symbole} {product?.price}
                            </p>
                            {product.originalPrice && product.discount && (
                              <p className="text-xs line-through" style={{ color: 'var(--color-text-secondary)' }}>
                                {product.symbole} {product?.originalPrice}
                              </p>
                            )}
                            {product.discount && (
                              <Badge variant="destructive" className="text-xs">
                                -{product.discount}%
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell className="hidden md:table-cell">
                          <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                            {product.stock} units
                          </Badge>
                        </TableCell>
                        
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant={product.stock > 0 ? 'default' : 'secondary'}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center space-x-1 sm:space-x-2 ">
                            <Button variant="outline" size="sm" className=' hover:bg-[var(--color-secondary)] hover:text-white' onClick={() => handleEditProduct(product)}>
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4 " />
                            </Button>
                            
                            {product.discount ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleRemoveDiscount(product.id)}
                                className="text-orange-600"
                              >
                                <Percent className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            ) : null}
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add Product Dialog */}
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--color-surface)' }}>
            <DialogHeader>
              <DialogTitle style={{ color: 'var(--color-text)' }}>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={newProduct.Name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, Name: e.target.value }))}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Enter category"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="1"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock || ''}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Garanty</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.garanty || ''}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, garanty: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="image">Image File *</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewProduct(prev => ({
                      ...prev,
                      img: e.target.files?.[0] || null
                      // img : 'test'
                    }))
                  }
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.desc}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, desc: e.target.value }))}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <Button type="button" variant="outline" onClick={() => setIsAddProductOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--color-surface)' }}>
            <DialogHeader>
              <DialogTitle style={{ color: 'var(--color-text)' }}>Edit Product</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <form onSubmit={handleUpdateProduct} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Product Name</Label>
                    <Input
                      id="edit-name"
                      value={editingProduct.Name}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-category">Category</Label>
                    <Input
                      id="edit-category"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-price">Price</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="1"
                      value={editingProduct.price || ''}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                    />
                  </div>
                  

                  <div>
                    <Label htmlFor="edit-originalPrice">originalPrice</Label>
                    <Input
                      id="edit-originalPrice"
                      type="number"
                      step="1"
                      value={editingProduct.originalPrice || ''}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                    />
                  </div>
                  
                </div>
               <div className="grid md:grid-cols-2 gap-4"> 
                <div>
                    <Label htmlFor="edit-stock">Stock Quantity</Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      value={editingProduct.stock || ''}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    />
                  </div>
                
                
              <div>
                  <Label htmlFor="edit-image">garanty</Label>
                  <Input
                    id="edit-image"
                    value={editingProduct.garanty}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, garanty: e.target.value }))}
                  />
                </div>
</div>
                <div>
                <Label htmlFor="image">Image File *</Label>
                <Input
                  id="image"
                  type={'file'}
                  accept="image/*"
                  // placeholder={editingProduct?.img}
                  
                  onChange={(e) =>
                    setEditingProduct(prev => ({
                      ...prev,
                      img: e.target.files?.[0] || null
                      // img : 'test'
                    }))
                  }
                  // required
                />
              </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingProduct.desc}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, desc: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div  className="flex items-center justify-between p-4 border rounded-lg">
                 <div>
                   <Label className="font-medium">enable reviews for this product</Label>
                   <p className="text-sm text-[var(--color-text-secondary)]">people can now add a rate of this product and they can comment in the product page</p>
                 </div>
                 <Switch
                   checked={editingProduct.allowReviews}
                   onCheckedChange={(checked) => setEditingProduct(prev => ({...prev ,allowReviews : checked })) }
                 />
               </div>
                
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button type="button" variant="outline" onClick={() => {setIsEditProductOpen(false); setEditingProduct(null)}}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Update Product
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}