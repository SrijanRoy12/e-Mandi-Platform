import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  ShoppingCart, 
  Wheat, 
  TrendingUp, 
  AlertTriangle,
  Search,
  Eye,
  Trash2,
  Ban,
  CheckCircle
} from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Analytics {
  totalUsers: number;
  totalFarmers: number;
  totalBuyers: number;
  totalCrops: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  user_type: 'farmer' | 'buyer' | 'admin';
  phone: string;
  city: string;
  state: string;
  created_at: string;
}

interface Crop {
  id: string;
  name: string;
  category: string;
  farmer_id: string;
  quantity_available: number;
  price_per_unit: number;
  is_available: boolean;
  created_at: string;
  profiles: {
    full_name: string;
  } | null;
}

interface Order {
  id: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'delivered' | 'confirmed' | 'shipped' | 'cancelled';
  created_at: string;
  crops: {
    name: string;
  } | null;
  buyer_profile: {
    full_name: string;
  } | null;
  farmer_profile: {
    full_name: string;
  } | null;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalFarmers: 0,
    totalBuyers: 0,
    totalCrops: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is admin (you can implement your own logic here)
  const isAdmin = user?.email === 'admin@emandi.com'; // Replace with your admin email

  useEffect(() => {
    if (user && isAdmin) {
      fetchAnalytics();
      fetchUsers();
      fetchCrops();
      fetchOrders();
    }
  }, [user, isAdmin]);

  const fetchAnalytics = async () => {
    try {
      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch farmers count
      const { count: totalFarmers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'farmer');

      // Fetch buyers count
      const { count: totalBuyers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'buyer');

      // Fetch total crops
      const { count: totalCrops } = await supabase
        .from('crops')
        .select('*', { count: 'exact', head: true });

      // Fetch total orders
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Fetch pending orders
      const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Calculate total revenue
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_price')
        .eq('status', 'delivered');

      const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total_price.toString()), 0) || 0;

      setAnalytics({
        totalUsers: totalUsers || 0,
        totalFarmers: totalFarmers || 0,
        totalBuyers: totalBuyers || 0,
        totalCrops: totalCrops || 0,
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCrops = async () => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .select(`
          *,
          profiles:farmer_id (full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCrops((data || []) as unknown as Crop[]);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          crops (name),
          buyer_profile:buyer_id (full_name),
          farmer_profile:farmer_id (full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data || []) as unknown as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCrop = async (cropId: string) => {
    try {
      const { error } = await supabase
        .from('crops')
        .delete()
        .eq('id', cropId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Crop deleted successfully',
      });

      fetchCrops();
      fetchAnalytics();
    } catch (error) {
      console.error('Error deleting crop:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete crop',
        variant: 'destructive',
      });
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'pending' | 'delivered' | 'confirmed' | 'shipped' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      });

      fetchOrders();
      fetchAnalytics();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have permission to access the admin dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(order =>
    order.crops?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.buyer_profile?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.farmer_profile?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-6 py-4">
        <h1 className="text-2xl font-bold text-primary mb-6">Admin Dashboard</h1>
      </div>

      <main className="max-w-7xl mx-auto p-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.totalFarmers} farmers, {analytics.totalBuyers} buyers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Crops</CardTitle>
              <Wheat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalCrops}</div>
              <p className="text-xs text-muted-foreground">
                Active listings on platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.pendingOrders} pending orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From completed orders
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users Management</TabsTrigger>
            <TabsTrigger value="crops">Crops Management</TabsTrigger>
            <TabsTrigger value="orders">Orders Management</TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.user_type === 'farmer' ? 'default' : 'secondary'}>
                            {user.user_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.city}, {user.state}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Ban className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crops Management */}
          <TabsContent value="crops" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Crops Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search crops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Crop Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCrops.map((crop) => (
                      <TableRow key={crop.id}>
                        <TableCell className="font-medium">{crop.name}</TableCell>
                        <TableCell>{crop.category}</TableCell>
                        <TableCell>{crop.profiles?.full_name}</TableCell>
                        <TableCell>{crop.quantity_available} kg</TableCell>
                        <TableCell>₹{crop.price_per_unit}</TableCell>
                        <TableCell>
                          <Badge variant={crop.is_available ? 'default' : 'secondary'}>
                            {crop.is_available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Crop</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this crop listing? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteCrop(crop.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Management */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Crop</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                        <TableCell>{order.crops?.name}</TableCell>
                        <TableCell>{order.buyer_profile?.full_name}</TableCell>
                        <TableCell>{order.farmer_profile?.full_name}</TableCell>
                        <TableCell>{order.quantity} kg</TableCell>
                        <TableCell>₹{order.total_price}</TableCell>
                        <TableCell>
                           <Badge 
                            variant={
                              order.status === 'delivered' ? 'default' :
                              order.status === 'confirmed' ? 'secondary' :
                              order.status === 'cancelled' ? 'destructive' :
                              'outline'
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {order.status === 'pending' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {order.status === 'confirmed' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                              >
                                Deliver
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;