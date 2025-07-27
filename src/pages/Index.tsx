import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Users, ShoppingCart, TrendingUp, MapPin, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Hero Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">e-Mandi</span>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-green-600">e-Mandi</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connecting farmers directly with buyers. Fresh produce, fair prices, and sustainable agriculture - all in one platform.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/auth')}>
                Join as Farmer
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
                Start Buying
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose e-Mandi?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Direct Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Connect farmers directly with buyers, eliminating middlemen and ensuring fair prices.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Clock className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Real-time Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get instant updates on crop availability, prices, and order status.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <ShoppingCart className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Easy Ordering</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Simple and intuitive ordering system with order tracking and delivery management.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Fair Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Transparent pricing ensures farmers get better returns and buyers get competitive rates.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-green-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-green-600">For Farmers</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-semibold">Register your farm</h4>
                      <p className="text-muted-foreground">Create your farmer profile with farm details and location.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-semibold">List your produce</h4>
                      <p className="text-muted-foreground">Add your crops with photos, quantities, and prices.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-semibold">Receive orders</h4>
                      <p className="text-muted-foreground">Get notified when buyers place orders for your produce.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                    <div>
                      <h4 className="font-semibold">Fulfill & earn</h4>
                      <p className="text-muted-foreground">Process orders and receive payments directly.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6 text-green-600">For Buyers</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-semibold">Browse fresh produce</h4>
                      <p className="text-muted-foreground">Search and filter crops by category, location, and price.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-semibold">Place orders</h4>
                      <p className="text-muted-foreground">Select quantity and provide delivery details.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-semibold">Track delivery</h4>
                      <p className="text-muted-foreground">Monitor order status and delivery progress.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                    <div>
                      <h4 className="font-semibold">Receive fresh produce</h4>
                      <p className="text-muted-foreground">Get fresh, quality produce delivered to your location.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Agriculture?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of farmers and buyers who are already benefiting from our platform.
            </p>
            <Button size="lg" variant="secondary" onClick={() => navigate('/auth')}>
              Get Started Today
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6" />
              <span className="text-xl font-bold">e-Mandi</span>
            </div>
            <p className="text-gray-400">© 2024 e-Mandi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
