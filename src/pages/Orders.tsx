import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  X,
  Check,
  MoreHorizontal,
  Filter,
  Download,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStore } from '@/lib/store';
import JSZip from "jszip";
import { StyledWrapper } from '@/components/ui/loader';
import jsPDF from "jspdf";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  Status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  billingAddress: string;
  trackingNumber: string | null;
  paymentMethod: string;
  note?: string;
}

// Enhanced mock orders data
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: 'user1',
    customerName: 'John Doe',
    customerEmail: 'john.doe@email.com',
    customerPhone: '+1 (555) 123-4567',
    date: '2024-01-15',
    status: 'delivered',
    total: 299.99,
    items: [
      {
        id: '1',
        name: 'Wireless Headphones',
        price: 299.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
      }
    ],
    shippingAddress: '123 Main St, City, State 12345',
    billingAddress: '123 Main St, City, State 12345',
    trackingNumber: 'TRK123456789',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-002',
    userId: 'user2',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@email.com',
    customerPhone: '+1 (555) 987-6543',
    date: '2024-01-20',
    status: 'shipped',
    total: 149.98,
    items: [
      {
        id: '2',
        name: 'Smart Watch',
        price: 149.98,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'
      }
    ],
    shippingAddress: '456 Oak Ave, Town, State 67890',
    billingAddress: '456 Oak Ave, Town, State 67890',
    trackingNumber: 'TRK987654321',
    paymentMethod: 'PayPal'
  },
  {
    id: 'ORD-003',
    userId: 'user3',
    customerName: 'Mike Johnson',
    customerEmail: 'mike.johnson@email.com',
    customerPhone: '+1 (555) 456-7890',
    date: '2024-01-25',
    status: 'processing',
    total: 89.99,
    items: [
      {
        id: '3',
        name: 'Bluetooth Speaker',
        price: 89.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop'
      }
    ],
    shippingAddress: '789 Pine Rd, Village, State 13579',
    billingAddress: '789 Pine Rd, Village, State 13579',
    trackingNumber: null,
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-004',
    userId: '33',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@email.com',
    customerPhone: '+1 (555) 321-0987',
    date: '2024-01-28',
    status: 'pending',
    total: 199.99,
    items: [
      {
        id: '4',
        name: 'Laptop Stand',
        price: 199.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop'
      }
    ],
    shippingAddress: '321 Elm St, City, State 24680',
    billingAddress: '321 Elm St, City, State 24680',
    trackingNumber: null,
    paymentMethod: 'Apple Pay'
  }
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const { currentUser, getOrders,orders,users,getUsers,isAdmin, updateOrders,addNotification,deleteOrders } = useStore();
//   const [orders, setOrders] = useState<Order[]>(ordersData);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [refresh,setRefresh]=useState(true)

  const canDownloadInvoice = (order: Order) => {
  return currentUser.isAdmin || order.customerid === currentUser.id;
};

  if (!currentUser) {
    navigate('/auth');
    return null;
  }
  
// console.log(ordersData)
  const getStatusIcon = (Status: string) => {
    switch (Status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" style={{ color: 'var(--color-success)' }} />;
      case 'shipped':
        return <Truck className="h-4 w-4" style={{ color: 'var(--color-info)' }} />;
      case 'processing':
        return <Clock className="h-4 w-4" style={{ color: 'var(--color-warning)' }} />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />;
      case 'cancelled':
        return <X className="h-4 w-4" style={{ color: 'var(--color-error)' }} />;
      case 'refunded':
        return <RefreshCw className="h-4 w-4" style={{ color: 'var(--color-secondary)' }} />;
      default:
        return <AlertCircle className="h-4 w-4" style={{ color: 'var(--color-error)' }} />;
    }
  };

  const getStatusColor = (Status: string) => {
    switch (Status) {
      case 'delivered':
        return 'default';
      case 'shipped':
        return 'secondary';
      case 'processing':
        return 'outline';
      case 'pending':
        return 'destructive';
      case 'cancelled':
        return 'destructive';
      case 'refunded':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  useEffect(()=>{
    getOrders()
    getUsers()
  },[])

  const handleRufresh= async (time) => {
    setRefresh(false);
    getOrders();
    setTimeout(() => {
      setRefresh(true)
    }, time);
  }


 const filteredOrders = orders?.filter(order => {
  // 1️⃣ Filter by current user if not admin
  if (!currentUser.isAdmin && order.customerid !== currentUser.id) {
    return false;
  }

  // 2️⃣ Filter by status
  if (statusFilter !== 'all' && order.Status !== statusFilter) {
    return false;
  }

  // 3️⃣ Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();

    const matchesId = String(order.id).includes(query);
    const matchesName = order.customerName
      ?.toLowerCase()
      .includes(query);
    const matchesEmail = order.customerEmail
      ?.toLowerCase()
      .includes(query);

    if (!matchesId && !matchesName && !matchesEmail) {
      return false;
    }
  }

  return true;
})
.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'total':
          aValue = a.total;
          bValue = b.total;
          break;
        case 'Status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

const handleViewOrder = (order: Order) => {
  const user = users.find(v => v.id === order.customerid);

  if (!user) {
    console.error("User not found for order", order);
    return;
  }

  const shippingAddress = user?.country + ' ' + user?.city + ` (Longitude : ${order.billingAddress.longitude} , Latitude : ${order.billingAddress.latitude})`;
  const billingAddress = user?.country + ' ' + user?.city + ` (Longitude : ${order.billingAddress.longitude} , Latitude : ${order.billingAddress.latitude})` ;

  const updatedOrder = { ...order, shippingAddress, billingAddress };
  // console.log(updatedOrder);

  setSelectedOrder(updatedOrder);
  setIsViewDialogOpen(true);
};


  const handleEditOrder = (order: Order) => {
    setEditingOrder({ ...order });
    setIsEditDialogOpen(true);
  };

  const handleUpdateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      updateOrders(editingOrder.id,editingOrder)
      setIsEditDialogOpen(false);
      setEditingOrder(null);
      addNotification('Order updated successfully!', 'success');
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      // setOrders(prev => prev.filter(order => order.id !== orderId));
      deleteOrders(orderId)
      // useStore.setState(prev => ({
      //   orders: prev.orders.filter(order => order.id !== orderId)
      // }));
      // addNotification('Order deleted successfully!', 'success');
    }
  };




const safeText = (value: any) =>
  value !== undefined && value !== null ? String(value) : "";

const generateInvoicePDF = (order) => {
  const doc = new jsPDF();

  let y = 20;

  /* ===== TITLE ===== */
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Facture de paiement électronique", 105, y, { align: "center" });

  y += 15;

  /* ===== ORDER INFO ===== */
  doc.setFontSize(11);
  doc.setFont("Helvetica", "normal");

  doc.text(`Numéro de commande : ${order.id}`, 14, y); y += 7;
  doc.text(`Date : ${new Date(order.createdAt).toLocaleDateString("fr-FR")}`, 14, y); y += 7;

  /* ===== CUSTOMER ===== */
  y += 5;
  doc.setFont("Helvetica", "bold");
  doc.text("Informations client", 14, y); y += 7;

  doc.setFont("Helvetica", "normal");
  doc.text(`Nom : ${order.customerName}`, 14, y); y += 6;
  doc.text(`Email : ${order.customerEmail}`, 14, y); y += 6;
  doc.text(`Téléphone : ${order.customerPhone}`, 14, y); y += 10;

  /* ===== ITEMS HEADER ===== */
  doc.setFont("Helvetica", "bold");
  doc.text("Articles", 14, y); y += 8;

  doc.setFontSize(10);
  doc.text("Produit", 14, y);
  doc.text("Qté", 120, y);
  doc.text("Prix", 140, y);
  doc.text("Total", 170, y);
  y += 5;

  doc.line(14, y, 196, y);
  y += 5;

  /* ===== ITEMS ===== */
  doc.setFont("Helvetica", "normal");

  order.items.forEach((item) => {
    const total = item.product.price * item.quantity;

    doc.text(item.product.Name, 14, y);
    doc.text(String(item.quantity), 125, y);
    doc.text(`${item.product.price} DZD`, 140, y);
    doc.text(`${total.toFixed(2)} DZD`, 170, y);

    y += 7;
  });

  y += 5;
  doc.line(14, y, 196, y);
  y += 7;

  /* ===== TOTALS ===== */
  const subtotal = Number(order.total);
  const tva = subtotal * 0.19;
  const totalTTC = subtotal + tva;

  doc.text(`Sous-total : ${subtotal} DZD`, 140, y); y += 6;
  doc.text(`TVA (19 %) : ${tva} DZD`, 140, y); y += 6;

  doc.setFont("Helvetica", "bold");
  doc.text(`Total TTC : ${totalTTC} DZD`, 140, y); y += 10;

  /* ===== PAYMENT ===== */
  doc.setFont("Helvetica", "normal");
  doc.text(`Méthode de paiement : Paiement à la livraison`, 14, y);

  /* ===== FOOTER ===== */
  y += 15;
  doc.setFontSize(9);
  doc.text(
    "Cette facture est générée électroniquement et ne nécessite pas de signature.",
    105,
    y,
    { align: "center" }
  );

  doc.save(`facture-${order.id}.pdf`);
};






const exportOrdersToCSV = async (orders: Order[]) => {
  if (!orders || orders.length === 0) return;

  const zip = new JSZip();

  /* =======================
     ITEMS CSV
  ======================= */

  const itemHeaders = [
    "id",
    "name of item",
    "final price",
    "garanti",
    "quantity",
  ];

  let itemIdCounter = 1;
  const itemRows: string[][] = [];

  // Map orderId -> itemIds[]
  const orderItemMap = new Map<string, number[]>();

  orders.forEach(order => {
    const ids: number[] = [];

    order.items.forEach(item => {
      const itemId = itemIdCounter++;

      ids.push(itemId);

      itemRows.push([
        String(itemId),
        item.product.Name,
        String(item.product.price),
        String(item.product.garanty ?? "N/A"),
        String(item.quantity),
      ]);
    });

    orderItemMap.set(order.id, ids);
  });

  const itemsCSV = [
    itemHeaders.join(","),
    ...itemRows.map(row =>
      row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  zip.file("items.csv", itemsCSV);

  /* =======================
     ORDERS CSV (UNCHANGED)
  ======================= */

  const orderHeaders = [
    "Order ID",
    "Customer Name",
    "Customer Email",
    "Customer Phone",
    "Status",
    "Date",
    "Total",
    "Payment Method",
    "Items",
    "Shipping Address",
    "Billing Address",
    "Notes"
  ];

  const orderRows = orders.map(order => [
    order.id,
    order.customerName,
    order.customerEmail,
    (order.customerPhone).toString(),
    order.Status,
    new Date(order.createdAt).toDateString(),
    order.total,
    order.paymentMethod || "N/A",
    orderItemMap.get(order.id)?.join("|") || "",
    JSON.stringify(order.shippingAddress),
    JSON.stringify(order.billingAddress),
    order.note ? order.note.replace(/\n/g, " ") : "",
  ]);

  const ordersCSV = [
    orderHeaders.join(","),
    ...orderRows.map(row =>
      row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  zip.file("orders.csv", ordersCSV);

  /* =======================
     DOWNLOAD ZIP
  ======================= */

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "Orders.zip";
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


  const handleStatusChange = (orderId: string, newStatus: Order['Status']) => {
    // setOrders(prev => prev.map(order => 
    //   order.id === orderId ? { ...order, Status: newStatus } : order
    // ));
    useStore.setState(prev => ({
      orders: prev.orders.map(order => 
        order.id === orderId ? { ...order, Status: newStatus } : order
      )
    }));
    addNotification(`Order status updated to ${newStatus}!`, 'success');
  };

  const getOrdersByStatus = (Status: string) => {
    if (Status === 'all') return filteredOrders;
    return filteredOrders.filter(order => order.Status === Status);
  };

  const orderStats = {
    total: filteredOrders?.length,
    pending: filteredOrders?.filter(o => o.Status === 'pending').length,
    processing: filteredOrders?.filter(o => o.Status === 'processing').length,
    shipped: filteredOrders?.filter(o => o.Status === 'shipped').length,
    delivered: filteredOrders?.filter(o => o.Status === 'delivered').length,
    cancelled: filteredOrders?.filter(o => o.Status === 'cancelled').length,
    revenue: filteredOrders?.reduce((sum, order) => sum + Number(order.total), 0),
  };

  return (
    <div className="min-h-screen p-4 sm:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                {currentUser.isAdmin ? 'Order Management' : 'My Orders'}
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {currentUser.isAdmin ? 'Manage all customer orders' : 'Track and manage your orders'}
              </p>
            </div>
            
            {currentUser.isAdmin && (
              <div className="flex gap-2">
                <Button
                onClick={() => exportOrdersToCSV(filteredOrders)}
                variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button  variant="outline" size="sm" onClick={()=>{handleRufresh(1000)}}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Order Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8"
        >
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardContent className="p-4 text-center">
              <Package className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--color-primary)' }} />
              <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{orderStats.total}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Total</p>
            </CardContent>
          </Card>
          
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardContent className="p-4 text-center">
              <AlertCircle className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--color-accent)' }} />
              <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{orderStats.pending}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Pending</p>
            </CardContent>
          </Card>
          
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--color-warning)' }} />
              <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{orderStats.processing}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Processing</p>
            </CardContent>
          </Card>
          
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardContent className="p-4 text-center">
              <Truck className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--color-info)' }} />
              <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{orderStats.shipped}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Shipped</p>
            </CardContent>
          </Card>
          
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--color-success)' }} />
              <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{orderStats.delivered}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Delivered</p>
            </CardContent>
          </Card>
          
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardContent className="p-4 text-center">
              <X className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--color-error)' }} />
              <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{orderStats.cancelled}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Cancelled</p>
            </CardContent>
          </Card>
          
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardContent className="p-4 text-center">
              <CreditCard className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--color-success)' }} />
              <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>DZD {orderStats?.revenue}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Revenue</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                    <Input
                      placeholder="Search orders by ID, customer name, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2" translate='no'>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="total">Total</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { 
                      handleRufresh(300);
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    }}
                  >
                    {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardHeader>
              <CardTitle style={{ color: 'var(--color-text)' }}>
                Orders ({filteredOrders?.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      {currentUser.isAdmin && <TableHead>Customer</TableHead>}
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="hidden md:table-cell">Items</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  
                  
                  
                 
                    {
                      refresh &&
                    <TableBody>
                    <AnimatePresence>
                      {filteredOrders?.map((order, index) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-muted/50"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {/* <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                              >
                                {expandedOrder === order.id ? 
                                  <ChevronUp className="h-4 w-4" /> : 
                                  <ChevronDown className="h-4 w-4" />
                                }
                              </Button> */}
                              <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                                {order.id}
                              </span>
                            </div>
                          </TableCell>
                          
                          {currentUser.isAdmin && (
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
                                  {order.customerName}
                                </p>
                                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                  {order.customerEmail}
                                </p>
                              </div>
                            </TableCell>
                          )}
                          
                          <TableCell>
                            <div className="flex items-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                              <Calendar className="h-4 w-4 mr-2" />
                              {/* {console.log(new Date(order.createdAt))} */}
                              {new Date(order.createdAt).toDateString()}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <Badge variant={getStatusColor(order.Status)} className="flex items-center w-fit">
                              {getStatusIcon(order.Status)}
                              <span className="ml-1 capitalize">{order.Status}</span>
                            </Badge>
                          </TableCell>
                          
                          <TableCell>
                            <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                              DZD {order.total}
                            </span>
                          </TableCell>
                          
                          <TableCell className="hidden md:table-cell">
                            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                              {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            </span>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {currentUser.isAdmin && (
                                <>
                                  <Button variant="outline" size="sm" onClick={() => handleEditOrder(order)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      
                                      <DropdownMenuItem 
                                        onClick={() => handleDeleteOrder(order.id)}
                                        className="text-red-600"
                                      >
                                        Delete Order
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>

                                {canDownloadInvoice(order) && (
  <Button
    variant="outline"
    size="sm"
    onClick={() => generateInvoicePDF(order)}
  >
    <Download className="h-4 w-4" />
  </Button>
)}

                                </>
                              )}
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                  }
                   
                  
                </Table>
                {
                  !refresh &&
                  <div className='flex justify-center w-full'>
                   <StyledWrapper className='items-center flex' style={{height : '200px' , width : '100%'}}>
                     <div className='loader'></div>
                   </StyledWrapper>
                 </div>
                }
              </div>
              
              {filteredOrders?.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 mx-auto mb-4 opacity-50" style={{ color: 'var(--color-text-secondary)' }} />
                  <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                    No orders found
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* View Order Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" style={{ color: 'var(--color-text-secondary)' }} />
                        {selectedOrder.customerEmail}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" style={{ color: 'var(--color-text-secondary)' }} />
                        {selectedOrder.customerPhone}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> <Badge variant={getStatusColor(selectedOrder.Status)} className="ml-1 capitalize">{selectedOrder.Status}</Badge></p>
                      <p><strong>Payment:</strong> pay on delivery</p>
                      {selectedOrder.trackingNumber && (
                        <p><strong>Tracking:</strong> {selectedOrder.trackingNumber}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Shipping Address</h3>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-1" style={{ color: 'var(--color-text-secondary)' }} />
                      <p className="text-sm">{selectedOrder.shippingAddress}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Billing Address</h3>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-1" style={{ color: 'var(--color-text-secondary)' }} />
                      <p className="text-sm">{selectedOrder.billingAddress}</p>
                  
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Order Items</h3>
<div className="space-y-3">
  {selectedOrder.items.map((item, itemIndex) => {
    // Normalize product(s) to array
    const products = Array.isArray(item.product)
      ? item.product
      : [item.product];

    return (
      <div
        key={itemIndex}
        className="space-y-2 p-3 rounded-lg"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center space-x-4"
          >
            <img
              src={product.img}
              alt={product.Name}
              className="w-16 h-16 object-cover rounded"
            />

            <div className="flex-1">
              <p className="font-medium">{product.Name}</p>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Qty: {item.quantity} × ${product.price}
              </p>
            </div>

            <p className="font-medium">
              DZD {(product.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}

        {/* ✅ Item subtotal if item has multiple products */}
        {products.length > 1 && (
          <div className="flex justify-between pt-2 border-t font-semibold">
            <span>Item Total</span>
            <span>
              DZD
              {products
                .reduce(
                  (sum, product) =>
                    sum + product.price * item.quantity,
                  0
                )
                .toFixed(2)}
            </span>
          </div>
        )}
      </div>
    );
  })}
</div>

                  
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                        DZD {selectedOrder.total}
                      </span>
                    </div>
                  </div>
                </div>
                
                {(selectedOrder.note && currentUser.isAdmin) && (
                  <div>
                    <h3 className="font-semibold mb-3">Notes</h3>
                    <p className="text-sm p-3 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
                      {selectedOrder.note}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Order Dialog (Admin Only) */}
        {currentUser.isAdmin && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" translate='no'>
              <DialogHeader>
                <DialogTitle>Edit Order - {editingOrder?.id}</DialogTitle>
              </DialogHeader>
              {editingOrder && (
                <form onSubmit={handleUpdateOrder} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4" >
                    <div>
                      <Label htmlFor="edit-customer-name">Customer Name</Label>
                      <Input
                        id="edit-customer-name"
                        value={editingOrder.customerName}
                        onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, customerName: e.target.value }) : null)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-customer-email">Customer Email</Label>
                      <Input
                        id="edit-customer-email"
                        type="email"
                        value={editingOrder.customerEmail}
                        onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, customerEmail: e.target.value }) : null)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="translate" htmlFor="edit-phone">Phone</Label>
                      <Input
                        id="edit-phone"
                        value={editingOrder.customerPhone}
                        onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, customerPhone: e.target.value }) : null)}
                      />
                    </div>
                    
                    <div>
                      <Label className="translate"  htmlFor="edit-status">Status</Label>
                      <Select 
                        value={editingOrder.Status} 
                        onValueChange={(value) => setEditingOrder(prev => prev ? ({ ...prev, Status: value as Order['Status'] }) : null)}
                      

                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="translate" htmlFor="edit-tracking">Tracking Number</Label>
                    <Input
                      id="edit-tracking"
                    //   value={editingOrder.trackingNumber || ''}
                    //   onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, trackingNumber: e.target.value }) : null)}
                      placeholder="Enter tracking number"
                    />
                  </div>
                  
                  {/* <div>
                    <Label className="translate" htmlFor="edit-shipping-address">Shipping Address</Label>
                    <Textarea
                      id="edit-shipping-address"
                    //   value={editingOrder.shippingAddress}
                    //   onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, shippingAddress: e.target.value }) : null)}
                      rows={2}
                    />
                  </div> */}
                  
                  <div>
                    <Label className="translate" htmlFor="edit-notes">Notes</Label>
                    <Textarea
                      id="edit-notes"
                      value={editingOrder.note || ''}
                      onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, note: e.target.value }) : null)}
                      placeholder="Add order notes..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Update Order
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}