import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, CreditCard, Truck, CheckCircle, Clock, AlertCircle, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/lib/store';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  trackingNumber: string | null;
}


export interface UserAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface PaymentMethod {
  type: string;
  brand: string;
  last4: string;
  expires: string;
  default: boolean;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  role: string;
  address: UserAddress;
  preferences: UserPreferences;
  paymentMethods: PaymentMethod[];
  stats: UserStats;
}

export const clientUser: ClientUser = {
  id: "USR-90421",
  name: "Michael Johnson",
  email: "michael.johnson@example.com",
  phone: "+1 415-555-2984",
  createdAt: "2024-10-12T14:33:21.000Z",
  role: "customer",
  address: {
    line1: "742 Evergreen Terrace",
    line2: "Apt 12B",
    city: "Springfield",
    state: "Illinois",
    postalCode: "62704",
    country: "USA"
  },
  preferences: {
    language: "en",
    currency: "USD",
    notifications: {
      email: true,
      sms: true,
      push: false
    }
  },
  paymentMethods: [
    {
      type: "credit_card",
      brand: "Visa",
      last4: "2243",
      expires: "12/27",
      default: true
    }
  ],
  stats: {
    totalOrders: 14,
    totalSpent: 1298.55,
    lastOrderDate: "2024-12-19"
  }
};




const mockOrders: Order[] = [
  {
    id: 'ORD-001',
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
    trackingNumber: 'TRK123456789'
  },
  {
    id: 'ORD-002',
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
    shippingAddress: '123 Main St, City, State 12345',
    trackingNumber: 'TRK987654321'
  },
  {
    id: 'ORD-003',
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
    shippingAddress: '123 Main St, City, State 12345',
    trackingNumber: null
  }
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const { currentUser } = useStore();
  console.log(currentUser)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackOrder, setTrackOrder] = useState<Order | null>(null);

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" style={{ color: 'var(--color-success)' }} />;
      case 'shipped':
        return <Truck className="h-4 w-4" style={{ color: 'var(--color-info)' }} />;
      case 'processing':
        return <Clock className="h-4 w-4" style={{ color: 'var(--color-warning)' }} />;
      default:
        return <AlertCircle className="h-4 w-4" style={{ color: 'var(--color-error)' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'default';
      case 'shipped':
        return 'secondary';
      case 'processing':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  const filterOrdersByStatus = (status: string) => {
    if (status === 'all') return mockOrders;
    return mockOrders.filter(order => order.status === status);
  };


  

  return (
    <div className="min-h-screen p-4 sm:p-8" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>My Orders</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Track and manage your orders</p>
        </motion.div>

        {/* STATS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardContent className="p-4 sm:p-6 text-center">
              <Package className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--color-primary)' }} />
              <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{mockOrders.length}</p>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Orders</p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardContent className="p-4 sm:p-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--color-success)' }} />
              <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                {mockOrders.filter(o => o.status === 'delivered').length}
              </p>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>Delivered</p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardContent className="p-4 sm:p-6 text-center">
              <Truck className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--color-info)' }} />
              <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                {mockOrders.filter(o => o.status === 'shipped').length}
              </p>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>Shipped</p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardContent className="p-4 sm:p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--color-warning)' }} />
              <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                {mockOrders.filter(o => o.status === 'processing').length}
              </p>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>Processing</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* ORDERS LIST */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card style={{ backgroundColor: 'var(--color-surface)' }}>
            <CardHeader>
              <CardTitle style={{ color: 'var(--color-text)' }}>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="all">All Orders</TabsTrigger>
                  <TabsTrigger value="processing">Processing</TabsTrigger>
                  <TabsTrigger value="shipped">Shipped</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                </TabsList>

                {['all', 'processing', 'shipped', 'delivered'].map((status) => (
                  <TabsContent key={status} value={status} className="space-y-4">
                    {filterOrdersByStatus(status).map((order, index) => (
                      <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                        <Card className="border" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                              {/* ORDER LEFT SIDE */}
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                                  <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>Order #{order.id}</h3>
                                  <Badge variant={getStatusColor(order.status)}>
                                    <div className="flex items-center space-x-1">
                                      {getStatusIcon(order.status)}
                                      <span className="capitalize">{order.status}</span>
                                    </div>
                                  </Badge>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                  <div className="flex items-center" style={{ color: 'var(--color-text-secondary)' }}>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {new Date(order.date).toLocaleDateString()}
                                  </div>

                                  <div className="flex items-center" style={{ color: 'var(--color-text-secondary)' }}>
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    ${order.total.toFixed(2)}
                                  </div>

                                  {order.trackingNumber && (
                                    <div className="flex items-center col-span-2" style={{ color: 'var(--color-text-secondary)' }}>
                                      <Truck className="h-4 w-4 mr-2" />
                                      Tracking: {order.trackingNumber}
                                    </div>
                                  )}
                                </div>

                                <div className="mt-4">
                                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Items:</p>
                                  <div className="space-y-2">
                                    {order.items.map((item) => (
                                      <div key={item.id} className="flex items-center space-x-3">
                                        <img src={item.image} className="w-12 h-12 rounded object-cover" />
                                        <div>
                                          <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{item.name}</p>
                                          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* RIGHT SIDE BUTTONS */}
                              <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]"
                                  onClick={() => setSelectedOrder(order)}>
                                  View Details
                                </Button>

                                {order.trackingNumber && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]"
                                    onClick={() => setTrackOrder(order)}>
                                    Track Package
                                  </Button>
                                )}

                                {order.status === 'delivered' && (
                                  <Button variant="outline" size="sm" className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]">
                                    Reorder
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <motion.div  initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t p-6 shadow-xl rounded-t-2xl z-50">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Order #{selectedOrder.id}</h2>
            <ChevronDown className="cursor-pointer" onClick={() => setSelectedOrder(null)} />
          </div>

          <p className="text-sm mb-3">Placed on: {new Date(selectedOrder.date).toLocaleDateString()}</p>

                  {/* USER INFORMATION */}
          <div>
            <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--color-text)' }}>
              User Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <p style={{ color: 'var(--color-text-secondary)' }}>
                <strong>Name:</strong> {clientUser.name}
              </p>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                <strong>Email:</strong> {clientUser.email}
              </p>
              {clientUser.phone && (
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  <strong>Phone:</strong> {clientUser.phone}
                </p>
              )}
              <p style={{ color: 'var(--color-text-secondary)' }}>
                <strong>User ID:</strong> {clientUser.id}
              </p>
              <p className="sm:col-span-2" style={{ color: 'var(--color-text-secondary)' }}>
                <strong>Address:</strong> {selectedOrder.shippingAddress}
              </p>
            </div>
          </div>

          {/* ORDER ITEMS */}
         


          <h3 className="font-semibold mt-4 mb-2">Items</h3>
          {selectedOrder.items.map(item => (
            <div key={item.id} className="flex items-center gap-3 mb-3">
              <img src={item.image} className="w-14 h-14 rounded" />
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs">Qty: {item.quantity}</p>
                <p className="text-xs">${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}

          <h3 className="font-semibold mt-4 mb-2">Shipping Address</h3>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            {selectedOrder.shippingAddress}
          </div>

          <h3 className="font-semibold mt-4 mb-2">Payment</h3>
          <p className="text-sm font-medium">Total: ${selectedOrder.total.toFixed(2)}</p>

          <Button className="mt-6 w-full bg-[var(--color-primary)] text-white"
            onClick={() => setSelectedOrder(null)}>
            Close
          </Button>
        </motion.div>
      )}

      {/* TRACKING MODAL */}
      {trackOrder && (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t p-6 shadow-xl rounded-t-2xl z-50">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Tracking #{trackOrder.trackingNumber}</h2>
            <ChevronDown className="cursor-pointer" onClick={() => setTrackOrder(null)} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-sm">Order confirmed</p>
            </div>

            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-blue-500" />
              <p className="text-sm">In transit</p>
            </div>

            {trackOrder.status === "delivered" && (
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-purple-500" />
                <p className="text-sm">Delivered</p>
              </div>
            )}
          </div>

          <Button className="mt-6 w-full bg-[var(--color-primary)] text-white"
            onClick={() => setTrackOrder(null)}>
            Close
          </Button>
        </motion.div>
      )}

    </div>
  );
}
