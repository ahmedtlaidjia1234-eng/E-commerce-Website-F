import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Users, Search, Edit, Trash2, Eye, Mail, Phone, MapPin, Calendar, ShoppingBag, Heart , RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore, User } from '@/lib/store';
import Loader, { StyledWrapper } from '@/components/ui/loader';
import Loading from '@/components/ui/loading';
import axios from 'axios';
import {URL} from '@/lib/BackendURL.js'


export default function UserManagementPage() {
  const { deleteAccount,updateUserSettings,getUsers,getFollowers,users,followers, currentUser, addNotification } = useStore();
  const [searchTerm, setSearchTerm] = useState({
  search: "",
  selected: "all",
});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isAdmin = currentUser?.isAdmin;
  const [ruf,setRuf] = useState([{state :false , value : 'followers'},{state :false , value : 'users'}])

useEffect(()=>{
  getUsers()
  getFollowers()
},[])

const refrech = (value) => {
  // 1️⃣ Update the state correctly
  setRuf(prev =>
    prev.map(item =>
      item.value === value
        ? { ...item, state: true }
        : { ...item, state: false }
    )
  );

  // 2️⃣ Trigger the correct action
  if (value === 'users') {
    getUsers();
  } else if (value === 'followers') {
    getFollowers();
  }

  // 3️⃣ Reset state after 2 seconds
  setTimeout(() => {
    setRuf(prev =>
      prev.map(item => ({ ...item, state: false }))
    );
  }, 2000);
};



// useEffect(()=>{
// socket.on("send_users", (data) => {
//     console.log("Received from backend:", data);
//     // Example output: { users: ["Ahmed", "John", "Sara"] }
//   });
// },[socket])

  if (!isAdmin || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Access Denied</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>You need admin privileges to access user management.</p>
        </motion.div>
      </div>
    );
  }
  
const filteredUsers = users.filter((user) => {
  // Normalize search term and selected filter
  const term = searchTerm.search?.toLowerCase().trim() || "";
  const selected = searchTerm.selected || "all";

  // Check if user matches search
  const matchesSearch =
    !term || 
    user.fName?.toLowerCase().startsWith(term) || 
    user.lName?.toLowerCase().startsWith(term) || 
    user.email?.toLowerCase().startsWith(term);

  // Check if user matches filter
  let matchesFilter = true;
  switch (selected) {
    case "admin":
      matchesFilter = user.isAdmin === true;
      break;
    case "active":
      matchesFilter = user.auth === true; // make sure your field is correct
      break;
    default:
      matchesFilter = true; // 'all' or unrecognized value
  }

  return matchesSearch && matchesFilter;
});



  
  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
    setIsEditDialogOpen(true);
  };
  
  const handleSaveUser = async () => {
    try{
if (editingUser) {
  const oldemail = users.find(e=> e.id == editingUser.id)
      // Update user in store
      console.log(oldemail)
    const updUser = await axios.put(`${URL}/api/user/updateUser`,{userSettings : editingUser , email : oldemail.email})
    if(updUser.status == 201){
      useStore.setState(state => ({
        users: state.users.map(u => u.id === editingUser.id ? editingUser : u),
        currentUser: state.currentUser?.id === editingUser.id ? editingUser : state.currentUser
      }));
            setIsEditDialogOpen(false);
      setEditingUser(null);
    useStore.getState().addNotification('User settings updated!', 'success');

    }else{
          useStore.getState().addNotification('User settings cant be updated!', 'error');
    }
      
    }
    }catch(err){
      console.log(err)
    }
    
    
  };
  
  const handleDeleteUser = async (isAdmin : boolean,email : string , userId) => {
    if (isAdmin) {
      addNotification('Cannot delete admin user!', 'error');
      return;
    }
    const deleteAccount = await axios.post(`${URL}/api/user/deleteUser`,{email})
    if(deleteAccount.status == 200){
      useStore.setState(state => ({
      users: state.users.filter(u => u.id !== userId)
    }));
    
    addNotification('User deleted successfully!', 'success');
    }else{
    addNotification('User cant be deleted!', 'error');

    }
    
  };
  
  const getUserStats = (user: User) => {
  const { cart, products } = useStore.getState();
  const userCartItems = cart.filter(item => item.userId === user.id); // make sure cart has userId
  const wishlistCount = user.wishlist?.length || 0;
  const reviewsCount = products.reduce((count, product) => 
    count + product.reviews.filter(r => r.userName === `${user.fName} ${user.lName}`).length
  , 0);
  const activeUsers = users.filter(a => a.auth === true)
  return {
    cartItems: userCartItems.length,
    wishlistItems: wishlistCount,
    reviewsCount,
    joinDate: new Date(user.createdAt).toLocaleDateString(),
  };
};
  
  return (
    <div className="min-h-screen p-4 sm:p-8" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>User Management</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage all registered users and their accounts</p>
        </motion.div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Total Users</p>
                  <p className="text-xl sm:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{users.length}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: 'var(--color-primary)' }} />
              </div>
            </CardContent>
          </Card>
          
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Active Users</p>
                  <p className="text-xl sm:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{users.filter(a => a.auth === true).length}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: 'var(--color-success)' }} />
              </div>
            </CardContent>
          </Card>
          
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>New This Month</p>
                  <p className="text-xl sm:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                    {users.filter(u => {
                      const userDate = new Date(u.createdAt);
                      const now = new Date();
                      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: 'var(--color-accent)' }} />
              </div>
            </CardContent>
          </Card>
          
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Admin Users</p>
                  <p className="text-xl sm:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>1</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: 'var(--color-error)' }} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and Filters */}
        <Card className="mb-8" style={{ backgroundColor: 'var(--color-surface)' }}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm.search}
                   onChange={(e) => setSearchTerm(prev => ({
                      ...prev,        // preserve the previous selected value
                      search: e.target.value
                    }))}                    
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select
  value={searchTerm.selected}
  onValueChange={(value) => {
    setSearchTerm((prev) => ({
      ...prev,
      selected: value,
    }));
  }}
>
  <SelectTrigger className="w-full sm:w-48">
    <SelectValue placeholder="Filter by status" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="all">All Users</SelectItem>
    <SelectItem value="active">Active Users</SelectItem>
    <SelectItem value="admin">Admin Users</SelectItem>
  </SelectContent>
</Select>

            </div>
          </CardContent>
        </Card>
        
        {/* Users Table */}
        <div>
<Card style={{ backgroundColor: 'var(--color-surface)' }}>
          <CardHeader >
            <div className='flex justify-between'>
              <CardTitle style={{ color: 'var(--color-text)' }}>All Users ({filteredUsers.length})</CardTitle>
              <div>
                <Button variant='ghost' className='border border-black' onClick={()=>refrech('users')}>
                  <RefreshCcw />
                </Button>
              </div>
            </div>
            
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
             {!ruf[1].state ?
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden sm:table-cell">Contact</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead className="hidden lg:table-cell">Activity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                 <TableBody>
                  {filteredUsers?.map((user) => {
                    const stats = getUserStats(user);
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {user.auth && <div className='flex items-center gap-2'>
                              <div className='w-2 h-2 bg-[var(--color-success)] rounded'/>
                              Active
                            </div>}
                            
                            <div  className={"w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm" } 
                               style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                            {user.fName?.[0] || ''}{user.lName?.[0] || ''}
                          </div>
                            <div>
                              <p className="font-medium text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>
                                {user.fName} {user.lName}
                              </p>
                              <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="hidden sm:table-cell">
                          <div className="space-y-1">
                            {user.phone && (
                              <div className="flex items-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                <Phone className="h-3 w-3 mr-1" />
                                {user.phone}
                              </div>
                            )}
                            <div className="flex items-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="hidden md:table-cell">
                          {user.city && user.state ? (
                            <div className="flex items-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                              <MapPin className="h-3 w-3 mr-1" />
                              {user.city}, {user.state}
                            </div>
                          ) : (
                            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Not provided</span>
                          )}
                        </TableCell>
                        
                        <TableCell className="hidden lg:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="flex items-center" style={{ color: 'var(--color-text-secondary)' }}>
                                <ShoppingBag className="h-3 w-3 mr-1" />
                                {stats.cartItems}
                              </span>
                              <span className="flex items-center" style={{ color: 'var(--color-text-secondary)' }}>
                                <Heart className="h-3 w-3 mr-1" />
                                {stats.wishlistItems}
                              </span>
                            </div>
                            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                              Joined: {stats.joinDate}
                            </p>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant={user.isAdmin ? 'destructive' : 'secondary'}>
                            {user.isAdmin ? 'Admin' : 'User'}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          {!user.isAdmin &&
                            <div className="flex items-center space-x-1 sm:space-x-2 ">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" className=' hover:bg-[var(--color-secondary)] hover:text-white' size="sm" onClick={() => setSelectedUser(user)}>
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--color-surface)]">
                                <DialogHeader>
                                  <DialogTitle>User Details</DialogTitle>
                                </DialogHeader>
                                {selectedUser && (
                                  <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                      <div>
                                        <h3 className="font-semibold mb-3">Personal Information</h3>
                                        <div className="space-y-2 text-sm">
                                          <p><strong>Name:</strong> {selectedUser.fName} {selectedUser.lName}</p>
                                          <p><strong>Email:</strong> {selectedUser.email}</p>
                                          <p><strong>Phone:</strong> {selectedUser.phone || 'Not provided'}</p>
                                          <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <h3 className="font-semibold mb-3">Address</h3>
                                        <div className="space-y-2 text-sm">
                                          <p><strong>Street:</strong> {selectedUser.streetAdr || 'Not provided'}</p>
                                          <p><strong>City:</strong> {selectedUser.city || 'Not provided'}</p>
                                          <p><strong>State:</strong> {selectedUser.state || 'Not provided'}</p>
                                          <p><strong>ZIP:</strong> {selectedUser.zipCode || 'Not provided'}</p>
                                          <p><strong>Country:</strong> {selectedUser.country || 'Not provided'}</p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h3 className="font-semibold mb-3">Activity Summary</h3>
                                      <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
                                          <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{getUserStats(selectedUser).wishlistItems}</p>
                                          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Wishlist Items</p>
                                        </div>
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
                                          <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>{getUserStats(selectedUser).reviewsCount}</p>
                                          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Reviews</p>
                                        </div>
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
                                          <p className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>{getUserStats(selectedUser).cartItems}</p>
                                          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Cart Items</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            <Button variant="outline" className=' hover:bg-[var(--color-primary)] hover:text-white' size="sm" onClick={() => handleEditUser(user)}>
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            
                            {user.id !== 'admin' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeleteUser(user.isAdmin,user.email,user.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            )}
                          </div>}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                
              </Table>
              : 
                <div className='flex justify-center w-full'>
                  <StyledWrapper style={{height : '100px'}}>
                    <div className='loader'></div>
                  </StyledWrapper>
                </div>
                
                
                }
            </div>
          </CardContent>
        </Card>
        
        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--color-surface)]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            {editingUser && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-fName">First Name</Label>
                    <Input
                      id="edit-fName"
                      value={editingUser.fName}
                      onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, fName: e.target.value }) : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-lName">Last Name</Label>
                    <Input
                      id="edit-lName"
                      value={editingUser.lName}
                      onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, lName: e.target.value }) : null)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, email: e.target.value }) : null)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, phone: e.target.value }) : null)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-streetAdr">streetAdr</Label>
                  <Textarea
                    id="edit-streetAdr"
                    value={editingUser.streetAdr || ''}
                    onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, streetAdr: e.target.value }) : null)}
                    rows={2}
                  />
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-city">City</Label>
                    <Input
                      id="edit-city"
                      value={editingUser.city || ''}
                      onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, city: e.target.value }) : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-state">State</Label>
                    <Input
                      id="edit-state"
                      value={editingUser.state || ''}
                      onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, state: e.target.value }) : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-zipCode">ZIP Code</Label>
                    <Input
                      id="edit-zipCode"
                      value={editingUser.zipCode || ''}
                      onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, zipCode: e.target.value }) : null)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className='bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white' onClick={handleSaveUser}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        </div>
        
         <br />   {/* followers Table */}

            <div>
<Card style={{ backgroundColor: 'var(--color-surface)' }}>
          <CardHeader >
            <div className='flex justify-between'>
              <CardTitle style={{ color: 'var(--color-text)' }}>All Followers ({followers.length})</CardTitle>
              <div>
                <Button variant='ghost' className='border border-black' onClick={()=>refrech('followers')}>
                  <RefreshCcw />
                </Button>
              </div>
            </div>
            
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
             {!ruf[0].state ?
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden sm:table-cell">Contact</TableHead>
                    
                  </TableRow>
                </TableHeader>
                 <TableBody>
                  {followers?.map((user) => {
                    // const stats = getUserStats(user);
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {<div className='flex items-center gap-2'>
                              <div className='w-2 h-2 bg-[var(--color-info)] rounded'/>
                              Follower
                            </div>}
                            
                            <div  className={"w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm" } 
                               style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                            {user.fName?.[0] || user.email?.[0]}
                          </div>
                            <div>
                              <p className="font-medium text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>
                                {user.fName}
                              </p>
                              
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="hidden sm:table-cell">
                          <div className="space-y-1">
                            {user.fname && (
                              <div className="flex items-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                <Phone className="h-3 w-3 mr-1" />
                                {user.fName}
                              </div>
                            )}
                            <div className="flex items-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </TableCell>
                        
                        
                        
                        
                        
                        
                        
                        <TableCell>
                          
                             
                          <div className='flex gap-2'>
                             <Button variant="outline" className=' hover:bg-[var(--color-primary)] hover:text-white' size="sm" onClick={() => handleEditUser(user)}>
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            
                           <Button
    id="deleteAccount"
    variant="outline"
    size="sm"
    onClick={''}
    className="text-red-600 border-red-500 hover:text-white hover:bg-red-600 hover:border-red-600"
  >
    <Trash2 className="h-4 w-4 mr-1" />
    remove Sub
  </Button>
                          </div>
                            
                           
                        
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                
              </Table>
              : 
                <div className='flex justify-center w-full'>
                  <StyledWrapper style={{height : '100px'}}>
                    <div className='loader'></div>
                  </StyledWrapper>
                </div>
                
                
                }
            </div>
          </CardContent>
        </Card>
        
        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--color-surface)]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            {editingUser && 
                <>  
                <div>
                    <Label htmlFor="edit-lName">Last Name</Label>
                    <Input
                      id="edit-lName"
                      value={editingUser.fName}
                      onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, lName: e.target.value }) : null)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">email</Label>
                    <Input
                      id="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, email: e.target.value }) : null)}
                    />
                  </div>
                
                
                
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className='bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white' onClick={handleSaveUser}>
                    Save Changes
                  </Button>
                </div>
              </>
            }
          </DialogContent>
        </Dialog>

            </div>
      </div>
    </div>
  );
}