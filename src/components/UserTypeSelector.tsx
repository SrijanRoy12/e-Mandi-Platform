import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Tractor, ShoppingCart, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface UserTypeSelectorProps {
  profile: any;
  onUserTypeChange: (newProfile: any) => void;
}

const UserTypeSelector = ({ profile, onUserTypeChange }: UserTypeSelectorProps) => {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUserTypeChange = async (userType: 'farmer' | 'buyer') => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ user_type: userType })
        .eq('user_id', profile.user_id)
        .select()
        .single();

      if (error) throw error;

      onUserTypeChange(data);
      toast({
        title: 'Success',
        description: `Switched to ${userType} role successfully`,
      });
    } catch (error) {
      console.error('Error updating user type:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user type',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-bold">Choose Your Role</h1>
            <p className="text-muted-foreground">Welcome back, {profile.full_name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Welcome to e-Mandi</h2>
          <p className="text-lg text-muted-foreground mb-2">
            Choose your role to continue
          </p>
          {profile.user_type && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Current role:</span>
              <Badge variant="secondary">
                {profile.user_type === 'farmer' ? '🚜 Farmer' : '🛒 Buyer'}
              </Badge>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit">
                <Tractor className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl">I'm a Farmer</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Sell your fresh produce directly to buyers
              </p>
              <ul className="text-sm space-y-2 text-left">
                <li>• List your crops with prices</li>
                <li>• Manage orders from buyers</li>
                <li>• Track your revenue</li>
                <li>• Set harvest and expiry dates</li>
              </ul>
              <Button 
                className="w-full" 
                onClick={() => handleUserTypeChange('farmer')}
                disabled={loading}
                variant={profile.user_type === 'farmer' ? 'default' : 'outline'}
              >
                {profile.user_type === 'farmer' ? '✓ Current Role' : 'Choose Farmer'}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit">
                <ShoppingCart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">I'm a Buyer</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Buy fresh produce directly from farmers
              </p>
              <ul className="text-sm space-y-2 text-left">
                <li>• Browse available crops</li>
                <li>• Search by location and category</li>
                <li>• Place orders directly</li>
                <li>• Track your purchases</li>
              </ul>
              <Button 
                className="w-full" 
                onClick={() => handleUserTypeChange('buyer')}
                disabled={loading}
                variant={profile.user_type === 'buyer' ? 'default' : 'outline'}
              >
                {profile.user_type === 'buyer' ? '✓ Current Role' : 'Choose Buyer'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            You can switch between roles anytime from your dashboard
          </p>
        </div>
      </main>
    </div>
  );
};

export default UserTypeSelector;