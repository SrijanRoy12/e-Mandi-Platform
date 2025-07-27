import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, DollarSign, ShoppingCart, LogOut, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AddCropDialog from '@/components/AddCropDialog';
import CropCard from '@/components/CropCard';
import OrdersTable from '@/components/OrdersTable';
import { toast } from '@/hooks/use-toast';

interface FarmerDashboardProps {
  profile: any;
  onProfileUpdate?: (profile: any) => void;
}

const FarmerDashboard = ({ profile, onProfileUpdate }: FarmerDashboardProps) => {
  const { signOut } = useAuth();
  const [crops, setCrops] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCrops: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrops();
    fetchOrders();
  }, []);

  const fetchCrops = async () => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .eq('farmer_id', profile.user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCrops(data || []);
      setStats(prev => ({ ...prev, totalCrops: data?.length || 0 }));
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('farmer_id', profile.user_id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      if (ordersData && ordersData.length > 0) {
        // Fetch crop data separately
        const cropIds = [...new Set(ordersData.map(order => order.crop_id))];
        const { data: cropsData, error: cropsError } = await supabase
          .from('crops')
          .select('id, name, price_per_unit')
          .in('id', cropIds);

        if (cropsError) throw cropsError;

        // Fetch buyer profiles separately
        const buyerIds = [...new Set(ordersData.map(order => order.buyer_id))];
        const { data: buyersData, error: buyersError } = await supabase
          .from('profiles')
          .select('user_id, full_name, email, phone')
          .in('user_id', buyerIds);

        if (buyersError) throw buyersError;

        // Combine orders with crop and buyer data
        const ordersWithDetails = ordersData.map(order => ({
          ...order,
          crop: cropsData?.find(crop => crop.id === order.crop_id) || null,
          buyer: buyersData?.find(buyer => buyer.user_id === order.buyer_id) || null
        }));

        setOrders(ordersWithDetails);
        
        const totalRevenue = ordersWithDetails.reduce((sum, order) => sum + Number(order.total_price), 0);
        const pendingOrders = ordersWithDetails.filter(order => order.status === 'pending').length;
        
        setStats(prev => ({
          ...prev,
          totalRevenue,
          pendingOrders,
        }));
      } else {
        setOrders([]);
        setStats(prev => ({
          ...prev,
          totalRevenue: 0,
          pendingOrders: 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled') => {
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
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const handleSwitchToBuyer = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ user_type: 'buyer' })
        .eq('user_id', profile.user_id)
        .select()
        .single();

      if (error) throw error;

      onProfileUpdate?.(data);
      toast({
        title: 'Success',
        description: 'Switched to buyer role successfully',
      });
    } catch (error) {
      console.error('Error switching role:', error);
      toast({
        title: 'Error',
        description: 'Failed to switch role',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Farmer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile.full_name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSwitchToBuyer}>
              <User className="h-4 w-4 mr-2" />
              Switch to Buyer
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Crops Listed</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCrops}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Crops Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Crops</CardTitle>
              <Button onClick={() => setShowAddCrop(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Crop
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {crops.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No crops listed yet. Add your first crop to get started!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {crops.map((crop) => (
                  <CropCard
                    key={crop.id}
                    crop={crop}
                    isOwner={true}
                    onUpdate={fetchCrops}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersTable
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              userType="farmer"
            />
          </CardContent>
        </Card>
      </main>

      <AddCropDialog
        open={showAddCrop}
        onOpenChange={setShowAddCrop}
        onSuccess={() => {
          fetchCrops();
          setShowAddCrop(false);
        }}
        farmerId={profile.user_id}
      />
    </div>
  );
};

export default FarmerDashboard;