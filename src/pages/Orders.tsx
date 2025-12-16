import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Package, Calendar, CreditCard, Truck, CheckCircle, Clock, AlertCircle, MapPin, ChevronDown, ShoppingBag, DollarSign, Loader, XCircle, MoreVertical
} from 'lucide-react';
// Assuming these UI components are from a library like shadcn/ui
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Note: Tabs are not used in the final version but kept for context consistency.
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


// --- MOCK Dropdown Menu COMPONENTS (ENHANCED WITH FRAMER-MOTION) ---
// We convert DropdownMenuContent and DropdownMenuItem into motion components.

const DropdownMenu = ({ children }: { children: React.ReactNode }) => <div className="relative inline-block text-left">{children}</div>;
const DropdownMenuTrigger = ({ children }: { children: React.ReactNode }) => children;

// Enhanced DropdownMenuContent with Framer Motion variants
const menuVariants = {
    open: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            duration: 0.3,
            bounce: 0.2,
            staggerChildren: 0.05,
            delayChildren: 0.05,
        }
    },
    closed: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.2
        }
    }
};

const MotionDropdownMenuContent = motion(
    ({ children, open }: { children: React.ReactNode, open: boolean }) => (
        <motion.div
            variants={menuVariants}
            initial="closed"
            animate={open ? "open" : "closed"}
            // className for styling
            className={`absolute right-0 z-20 mt-2 w-48 rounded-lg border shadow-xl bg-white origin-top-right ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
            <div className="py-1">{children}</div>
        </motion.div>
    )
);

// Item variants for staggered list animation
const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -10 }
};

const MotionDropdownMenuItem = motion(
    ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
        <motion.div
            variants={itemVariants}
            onClick={onClick}
            // Tailwind classes
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
            whileHover={{ backgroundColor: '#f3f4f6', scale: 1.02 }} // Subtle scale on hover
            whileTap={{ scale: 0.98 }} // Haptic feedback on click
        >
            {children}
        </motion.div>
    )
);

const DropdownMenuContent = MotionDropdownMenuContent;
const DropdownMenuItem = MotionDropdownMenuItem;
const DropdownMenuSeparator = () => <div className="border-t border-gray-200 my-1"></div>;


// --- INTERFACE DEFINITIONS & MOCK DATA (UNCHANGED) ---

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
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
    isPaid: boolean; 
    total: number;
    items: OrderItem[];
    shippingAddress: string;
    trackingNumber: string | null;
    shippingCost: number;
    tax: number;
}

const initialOrders: Order[] = [
    { id: 'ORD-001', date: '2024-01-15', status: 'delivered', isPaid: true, total: 319.97, shippingCost: 10.00, tax: 9.98, items: [/*...*/], shippingAddress: '...', trackingNumber: 'TRK123456789' },
    { id: 'ORD-002', date: '2024-01-20', status: 'shipped', isPaid: true, total: 164.98, shippingCost: 5.00, tax: 10.00, items: [/*...*/], shippingAddress: '...', trackingNumber: 'TRK987654321' },
    { id: 'ORD-003', date: '2024-01-25', status: 'processing', isPaid: false, total: 99.99, shippingCost: 5.00, tax: 5.00, items: [/*...*/], shippingAddress: '...', trackingNumber: null },
    { id: 'ORD-004', date: '2024-02-01', status: 'cancelled', isPaid: true, total: 50.00, shippingCost: 0.00, tax: 0.00, items: [/*...*/], shippingAddress: '...', trackingNumber: null },
    { id: 'ORD-004', date: '2024-02-01', status: 'cancelled', isPaid: true, total: 50.00, shippingCost: 0.00, tax: 0.00, items: [/*...*/], shippingAddress: '...', trackingNumber: null },
    { id: 'ORD-004', date: '2024-02-01', status: 'cancelled', isPaid: true, total: 50.00, shippingCost: 0.00, tax: 0.00, items: [/*...*/], shippingAddress: '...', trackingNumber: null },
    { id: 'ORD-004', date: '2024-02-01', status: 'cancelled', isPaid: true, total: 50.00, shippingCost: 0.00, tax: 0.00, items: [/*...*/], shippingAddress: '...', trackingNumber: null }

  ];


// --- HELPER FUNCTIONS (ENHANCED with Framer-Motion Badge) ---

const StatusBadge = ({ status }: { status: Order['status'] }) => {
    let color = 'bg-gray-200 text-gray-800';
    let icon = <Clock className="mr-1 h-3 w-3" />;
    let statusText = status;

    switch (status) {
        case 'delivered': color = 'bg-green-100 text-green-800'; icon = <CheckCircle className="mr-1 h-3 w-3" />; break;
        case 'shipped': color = 'bg-blue-100 text-blue-800'; icon = <Truck className="mr-1 h-3 w-3" />; break;
        case 'processing': color = 'bg-yellow-100 text-yellow-800'; icon = <Loader className="mr-1 h-3 w-3 animate-spin" />; break;
        case 'cancelled': color = 'bg-red-100 text-red-800'; icon = <XCircle className="mr-1 h-3 w-3" />; break;
    }

    return (
        <motion.div
            key={status} // Key is essential for AnimatePresence/Framer to track changes
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`capitalize ${color} flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full`}
        >
            {icon}{statusText}
        </motion.div>
    );
};

const PaymentBadge = ({ isPaid }: { isPaid: boolean }) => {
    const text = isPaid ? 'Paid' : 'Pending';
    const color = isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800';
    const icon = isPaid ? <DollarSign className="mr-1 h-3 w-3" /> : <AlertCircle className="mr-1 h-3 w-3" />;

    return (
        <motion.div
            key={text} // Key is essential for AnimatePresence/Framer to track changes
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${color}`}
        >
            {icon}{text}
        </motion.div>
    );
};


// --- ORDER MANAGEMENT TABLE COMPONENT (ANIMATED) ---

const OrderManagementTable = () => {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    // --- State Update Logic ---
    const updateOrder = (id: string, updates: Partial<Order>) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === id ? { ...order, ...updates } : order
            )
        );
        setOpenDropdownId(null);
    };

    const handleStatusChange = (id: string, newStatus: Order['status']) => {
        const updates: Partial<Order> = { status: newStatus };
        if (newStatus === 'delivered') {
            updates.isPaid = true;
        } else if (newStatus === 'cancelled') {
             updates.isPaid = false;
        }
        updateOrder(id, updates);
    };

    const handlePaymentToggle = (id: string, isPaid: boolean) => {
        updateOrder(id, { isPaid });
    };

    // --- Filtering and Search Logic ---
    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => filter === 'all' || order.status === filter)
            .filter(order =>
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [orders, filter, searchTerm]);


    return (
        <Card style={{ backgroundColor: 'var(--color-surface)' }} className="shadow-lg">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-b space-y-4 md:space-y-0">
                <CardTitle className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Order Management</CardTitle>
                <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                    {/* Search Input (No animation needed, standard input) */}
                    <input
                        type="text"
                        placeholder="Search by ID or Product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded-lg text-sm w-full sm:w-48"
                        style={{ borderColor: 'var(--color-elementsBorder)', color: 'var(--color-text)', backgroundColor: 'var(--color-elementsBackground)' }}
                    />
                    {/* Status Filter (No animation needed, standard select) */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="p-2 border rounded-lg text-sm w-full sm:w-auto"
                        style={{ borderColor: 'var(--color-elementsBorder)', color: 'var(--color-text)', backgroundColor: 'var(--color-elementsBackground)' }}
                    >
                        <option value="all">All Statuses</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="">
                    <table className="w-full text-sm bg-white text-[var(--color-text)]">
                        <thead className="bg-gray-50/20 sticky top-0 ">
                            <tr className='bg-white py-2'>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        {/* Use AnimatePresence on the table body to animate row additions/removals/changes */}
                        <AnimatePresence initial={false}>
                            <tbody >
                                {filteredOrders.length === 0 && (
                                    <motion.tr
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <td colSpan={6} className="text-center text-gray-500 py-12">
                                            No orders found matching the criteria.
                                        </td>
                                    </motion.tr>
                                )}
                                {filteredOrders.map(order => (
                                    // Make the row a motion component
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }} // Slide in from below
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -50 }} // Slide out to the left
                                        transition={{ duration: 0.3 }}
                                        className="border-b hover:bg-gray-50/10 transition-colors"
                                    >
                                        <td className="px-4 py-3 font-medium text-[var(--color-primary)]">{order.id}</td>
                                        <td className="px-4 py-3 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">
                                            {/* Status Badge with its own transition (key ensures component remounts for status change animation) */}
                                            <AnimatePresence mode="wait">
                                                <StatusBadge status={order.status} key={order.status} />
                                            </AnimatePresence>
                                        </td>
                                        <td className="px-4 py-3">
                                            {/* Payment Badge with its own transition */}
                                            <AnimatePresence mode="wait">
                                                <PaymentBadge isPaid={order.isPaid} key={String(order.isPaid)} />
                                            </AnimatePresence>
                                        </td>
                                        <td className="px-4 py-3 font-semibold">${order.total.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right">
                                            {/* --- ACTIONS DROPDOWN (For editing) --- */}
                                            
                                            <DropdownMenu >
                                                <DropdownMenuTrigger>
                                                    <motion.div
                                                        whileTap={{ scale: 0.9 }}
                                                        whileHover={{ scale: 1.1 }}
                                                        // Subtle shake animation on hover to indicate interactiveness
                                                        whileFocus={{ rotate: [0, 5, -5, 5, 0], transition: { duration: 0.3 } }}
                                                    >
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            onClick={() => setOpenDropdownId(openDropdownId === order.id ? null : order.id)}
                                                            className="hover:bg-gray-100  h-6 w-6"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </motion.div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent open={openDropdownId === order.id}>
                                                    
                                                    {/* Payment Status Toggle */}
                                                    <DropdownMenuItem onClick={() => handlePaymentToggle(order.id, !order.isPaid)}>
                                                        {order.isPaid ? (
                                                            <div className="flex items-center text-amber-600"><DollarSign className="mr-2 h-4 w-4" /> Mark as Pending</div>
                                                        ) : (
                                                            <div className="flex items-center text-emerald-600"><CheckCircle className="mr-2 h-4 w-4" /> Mark as Paid</div>
                                                        )}
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator />

                                                    {/* Shipment Status Updates */}
                                                    <motion.div variants={itemVariants} className="px-4 py-2 text-xs font-semibold uppercase text-gray-400">Update Shipment Status</motion.div>
                                                    
                                                    {/* Status Menu Items (using MotionDropdownMenuItem) */}
                                                    {order.status !== 'processing' && order.status !== 'cancelled' && (
                                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'processing')}>
                                                            <div className="flex items-center text-yellow-600"><Loader className="mr-2 h-4 w-4" /> Set to Processing</div>
                                                        </DropdownMenuItem>
                                                    )}
                                                    
                                                    {order.status !== 'shipped' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'shipped')}>
                                                            <div className="flex items-center text-blue-600"><Truck className="mr-2 h-4 w-4" /> Set to Shipped</div>
                                                        </DropdownMenuItem>
                                                    )}
                                                    
                                                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'delivered')}>
                                                            <div className="flex items-center text-green-600"><CheckCircle className="mr-2 h-4 w-4" /> Set to Delivered</div>
                                                        </DropdownMenuItem>
                                                    )}

                                                    <DropdownMenuSeparator />
                                                    
                                                    {/* Cancel */}
                                                    {order.status !== 'cancelled' && (
                                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'cancelled')}>
                                                            <div className="flex items-center text-red-600"><XCircle className="mr-2 h-4 w-4" /> Cancel Order</div>
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </AnimatePresence>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};


// --- EXPORTED PAGE COMPONENT (No Change Needed, it already uses motion) ---

export default function OrdersPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen p-4 sm:p-8" style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
            <div className="max-w-6xl mx-auto">

                {/* HEADER: Animates on initial load */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-2xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Order Administration</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Manage all customer orders and statuses.</p>
                </motion.div>

                {/* THE NEW ORDER MANAGEMENT TABLE: Animates after header load */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <OrderManagementTable />
                </motion.div>
                
            </div>
        </div>
    );
}