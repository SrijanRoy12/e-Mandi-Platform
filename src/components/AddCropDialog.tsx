import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AddCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  farmerId: string;
}

const AddCropDialog = ({ open, onOpenChange, onSuccess, farmerId }: AddCropDialogProps) => {
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'pulses', label: 'Pulses' },
    { value: 'spices', label: 'Spices' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'other', label: 'Other' },
  ];

  const units = [
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'quintal', label: 'Quintal' },
    { value: 'ton', label: 'Ton' },
    { value: 'piece', label: 'Piece' },
    { value: 'dozen', label: 'Dozen' },
    { value: 'liter', label: 'Liter' },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const category = formData.get('category') as 'vegetables' | 'fruits' | 'grains' | 'pulses' | 'spices' | 'dairy' | 'other';
    
    const cropData = {
      farmer_id: farmerId,
      name: formData.get('name') as string,
      category,
      description: formData.get('description') as string,
      quantity_available: Number(formData.get('quantity_available')),
      unit: formData.get('unit') as string,
      price_per_unit: Number(formData.get('price_per_unit')),
      harvest_date: formData.get('harvest_date') as string || null,
      expiry_date: formData.get('expiry_date') as string || null,
      location: formData.get('location') as string,
      is_organic: formData.get('is_organic') === 'on',
      is_available: true,
    };

    try {
      const { error } = await supabase.from('crops').insert(cropData);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Crop added successfully!',
      });

      onSuccess();
    } catch (error) {
      console.error('Error adding crop:', error);
      toast({
        title: 'Error',
        description: 'Failed to add crop',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Crop</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Crop Name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g., Tomatoes, Rice, Wheat"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your crop quality, variety, etc."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="quantity_available">Quantity Available</Label>
              <Input
                id="quantity_available"
                name="quantity_available"
                type="number"
                step="0.01"
                min="0.01"
                required
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select name="unit" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price_per_unit">Price per Unit (₹)</Label>
              <Input
                id="price_per_unit"
                name="price_per_unit"
                type="number"
                step="0.01"
                min="0.01"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="harvest_date">Harvest Date</Label>
              <Input
                id="harvest_date"
                name="harvest_date"
                type="date"
              />
            </div>
            <div>
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                id="expiry_date"
                name="expiry_date"
                type="date"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Farm location, city, state"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_organic"
              name="is_organic"
            />
            <Label htmlFor="is_organic">This is organic produce</Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding Crop...' : 'Add Crop'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCropDialog;