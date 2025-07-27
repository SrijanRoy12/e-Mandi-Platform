import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Package, DollarSign, LogOut, Tractor } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import CropCard from '@/components/CropCard';
import OrdersTable from '@/components/OrdersTable';
import { toast } from '@/hooks/use-toast';

interface BuyerDashboardProps {
  profile: any;
  onProfileUpdate?: (profile: any) => void;
}

const BuyerDashboard = ({ profile, onProfileUpdate }: BuyerDashboardProps) => {
  const { signOut } = useAuth();
  const [crops, setCrops] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'pulses', label: 'Pulses' },
    { value: 'spices', label: 'Spices' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    fetchCrops();
    fetchOrders();
  }, []);

  useEffect(() => {
    filterCrops();
  }, [crops, searchTerm, selectedCategory]);

  const fetchCrops = async () => {
    try {
      const { data: cropsData, error: cropsError } = await supabase
        .from('crops')
        .select('*')
        .eq('is_available', true)
        .gt('quantity_available', 0)
        .order('created_at', { ascending: false });

      if (cropsError) throw cropsError;

      if (cropsData && cropsData.length > 0) {
        // Fetch farmer profiles separately
        const farmerIds = [...new Set(cropsData.map(crop => crop.farmer_id))];
        const { data: farmersData, error: farmersError } = await supabase
          .from('profiles')
          .select('user_id, full_name, city, state, phone')
          .in('user_id', farmerIds);

        if (farmersError) throw farmersError;

        // Combine crops with farmer data
        const cropsWithFarmers = cropsData.map(crop => ({
          ...crop,
          farmer: farmersData?.find(farmer => farmer.user_id === crop.farmer_id) || null
        }));

        setCrops(cropsWithFarmers);
      } else {
        setCrops([]);
      }
    } catch (error) {
      console.error('Error fetching crops:', error);
      setCrops([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', profile.user_id)
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

        // Fetch farmer profiles separately
        const farmerIds = [...new Set(ordersData.map(order => order.farmer_id))];
        const { data: farmersData, error: farmersError } = await supabase
          .from('profiles')
          .select('user_id, full_name, email, phone')
          .in('user_id', farmerIds);

        if (farmersError) throw farmersError;

        // Combine orders with crop and farmer data
        const ordersWithDetails = ordersData.map(order => ({
          ...order,
          crop: cropsData?.find(crop => crop.id === order.crop_id) || null,
          farmer: farmersData?.find(farmer => farmer.user_id === order.farmer_id) || null
        }));

        setOrders(ordersWithDetails);
        
        const totalSpent = ordersWithDetails.reduce((sum, order) => sum + Number(order.total_price), 0);
        const pendingOrders = ordersWithDetails.filter(order => order.status === 'pending').length;
        
        setStats({
          totalOrders: ordersWithDetails.length,
          totalSpent,
          pendingOrders,
        });
      } else {
        setOrders([]);
        setStats({
          totalOrders: 0,
          totalSpent: 0,
          pendingOrders: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const filterCrops = () => {
    let filtered = crops;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(crop => crop.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(crop =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCrops(filtered);
  };

  const handleSwitchToFarmer = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ user_type: 'farmer' })
        .eq('user_id', profile.user_id)
        .select()
        .single();

      if (error) throw error;

      onProfileUpdate?.(data);
      toast({
        title: 'Success',
        description: 'Switched to farmer role successfully',
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
            <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile.full_name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSwitchToFarmer}>
              <Tractor className="h-4 w-4 mr-2" />
              Switch to Farmer
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
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalSpent.toLocaleString()}</div>
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

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Browse Fresh Produce</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search crops, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filteredCrops.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No crops found matching your criteria.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCrops.map((crop) => (
                  <CropCard
                    key={crop.id}
                    crop={crop}
                    isOwner={false}
                    onUpdate={fetchCrops}
                    buyerId={profile.user_id}
                    onOrderSuccess={fetchOrders}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders Section */}
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersTable orders={orders} userType="buyer" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BuyerDashboard;