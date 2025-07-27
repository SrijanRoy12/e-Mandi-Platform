import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Calendar, Package, Leaf, Edit, Trash2, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface CropCardProps {
  crop: any;
  isOwner: boolean;
  onUpdate: () => void;
  buyerId?: string;
  onOrderSuccess?: () => void;
}

const CropCard = ({ crop, isOwner, onUpdate, buyerId, onOrderSuccess }: CropCardProps) => {
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const quantity = Number(formData.get('quantity'));
    const deliveryAddress = formData.get('deliveryAddress') as string;
    const notes = formData.get('notes') as string;

    if (quantity > crop.quantity_available) {
      toast({
        title: 'Error',
        description: 'Requested quantity exceeds available stock',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      const totalPrice = quantity * crop.price_per_unit;

      const { error } = await supabase.from('orders').insert({
        buyer_id: buyerId,
        farmer_id: crop.farmer_id,
        crop_id: crop.id,
        quantity,
        total_price: totalPrice,
        delivery_address: deliveryAddress,
        notes,
      });

      if (error) throw error;

      // Update crop quantity
      await supabase
        .from('crops')
        .update({ 
          quantity_available: crop.quantity_available - quantity,
          is_available: crop.quantity_available - quantity > 0
        })
        .eq('id', crop.id);

      toast({
        title: 'Success',
        description: 'Order placed successfully!',
      });

      setShowOrderDialog(false);
      onUpdate();
      onOrderSuccess?.();
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Error',
        description: 'Failed to place order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const updates = {
      quantity_available: Number(formData.get('quantity_available')),
      price_per_unit: Number(formData.get('price_per_unit')),
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      is_available: formData.get('is_available') === 'true',
    };

    try {
      const { error } = await supabase
        .from('crops')
        .update(updates)
        .eq('id', crop.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Crop updated successfully!',
      });

      setShowEditDialog(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating crop:', error);
      toast({
        title: 'Error',
        description: 'Failed to update crop',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this crop?')) return;

    try {
      const { error } = await supabase
        .from('crops')
        .delete()
        .eq('id', crop.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Crop deleted successfully!',
      });

      onUpdate();
    } catch (error) {
      console.error('Error deleting crop:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete crop',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{crop.name}</CardTitle>
          <Badge variant={crop.category === 'organic' ? 'default' : 'secondary'}>
            {crop.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>{crop.quantity_available} {crop.unit} available</span>
        </div>

        <div className="text-2xl font-bold text-green-600">
          ₹{crop.price_per_unit}/{crop.unit}
        </div>

        {crop.description && (
          <p className="text-sm text-muted-foreground">{crop.description}</p>
        )}

        {crop.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{crop.location}</span>
          </div>
        )}

        {crop.harvest_date && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Harvested: {format(new Date(crop.harvest_date), 'PP')}</span>
          </div>
        )}

        {crop.is_organic && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Leaf className="h-4 w-4" />
            <span>Organic</span>
          </div>
        )}

        {!isOwner && crop.farmer && (
          <div className="text-sm">
            <p className="font-medium">Farmer: {crop.farmer.full_name}</p>
            <p className="text-muted-foreground">{crop.farmer.city}, {crop.farmer.state}</p>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          {isOwner ? (
            <>
              <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Crop</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quantity_available">Quantity Available</Label>
                        <Input
                          id="quantity_available"
                          name="quantity_available"
                          type="number"
                          step="0.01"
                          defaultValue={crop.quantity_available}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="price_per_unit">Price per {crop.unit}</Label>
                        <Input
                          id="price_per_unit"
                          name="price_per_unit"
                          type="number"
                          step="0.01"
                          defaultValue={crop.price_per_unit}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={crop.description}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        defaultValue={crop.location}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_available"
                        name="is_available"
                        value="true"
                        defaultChecked={crop.is_available}
                      />
                      <Label htmlFor="is_available">Available for sale</Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Updating...' : 'Update Crop'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
              <DialogTrigger asChild>
                <Button className="w-full" disabled={crop.quantity_available === 0}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Order Now
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Place Order for {crop.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleOrder} className="space-y-4">
                  <div>
                    <Label htmlFor="quantity">Quantity ({crop.unit})</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={crop.quantity_available}
                      required
                      placeholder={`Max: ${crop.quantity_available} ${crop.unit}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Textarea
                      id="deliveryAddress"
                      name="deliveryAddress"
                      required
                      placeholder="Enter complete delivery address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any special instructions or requirements"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Price: ₹{crop.price_per_unit}/{crop.unit}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CropCard;