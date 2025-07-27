import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import FarmerDashboard from '@/components/FarmerDashboard';
import BuyerDashboard from '@/components/BuyerDashboard';
import UserTypeSelector from '@/components/UserTypeSelector';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // Create profile if it doesn't exist
        await createProfile();
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user?.id,
          email: user?.email,
          full_name: user?.user_metadata?.full_name,
          user_type: user?.user_metadata?.user_type || 'buyer',
          phone: user?.user_metadata?.phone,
          address: user?.user_metadata?.address,
          city: user?.user_metadata?.city,
          state: user?.user_metadata?.state,
          pincode: user?.user_metadata?.pincode,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div>Error loading profile</div>;
  }

  // Show role selector if no user type is set
  if (!profile.user_type) {
    return (
      <UserTypeSelector 
        profile={profile} 
        onUserTypeChange={(newProfile) => setProfile(newProfile)} 
      />
    );
  }

  return profile.user_type === 'farmer' ? (
    <FarmerDashboard 
      profile={profile} 
      onProfileUpdate={(newProfile) => setProfile(newProfile)} 
    />
  ) : (
    <BuyerDashboard 
      profile={profile} 
      onProfileUpdate={(newProfile) => setProfile(newProfile)} 
    />
  );
};

export default Dashboard;