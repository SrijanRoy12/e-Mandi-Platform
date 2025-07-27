-- Create enum for user types
CREATE TYPE public.user_type AS ENUM ('farmer', 'buyer', 'admin');

-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');

-- Create enum for crop categories
CREATE TYPE public.crop_category AS ENUM ('vegetables', 'fruits', 'grains', 'pulses', 'spices', 'dairy', 'other');

-- Update profiles table to include user type and additional fields
ALTER TABLE public.profiles ADD COLUMN user_type user_type DEFAULT 'buyer';
ALTER TABLE public.profiles ADD COLUMN phone TEXT;
ALTER TABLE public.profiles ADD COLUMN address TEXT;
ALTER TABLE public.profiles ADD COLUMN city TEXT;
ALTER TABLE public.profiles ADD COLUMN state TEXT;
ALTER TABLE public.profiles ADD COLUMN pincode TEXT;

-- Create crops table for farmer listings
CREATE TABLE public.crops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category crop_category NOT NULL,
  description TEXT,
  quantity_available DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'kg',
  price_per_unit DECIMAL(10,2) NOT NULL,
  harvest_date DATE,
  expiry_date DATE,
  location TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_organic BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'pending',
  delivery_address TEXT NOT NULL,
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on crops table
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for crops
CREATE POLICY "Anyone can view available crops" 
ON public.crops 
FOR SELECT 
USING (is_available = true);

CREATE POLICY "Farmers can create their own crops" 
ON public.crops 
FOR INSERT 
WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own crops" 
ON public.crops 
FOR UPDATE 
USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete their own crops" 
ON public.crops 
FOR DELETE 
USING (auth.uid() = farmer_id);

-- Enable RLS on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

CREATE POLICY "Buyers can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

-- Create trigger for crops updated_at
CREATE TRIGGER update_crops_updated_at
BEFORE UPDATE ON public.crops
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for orders updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_crops_farmer_id ON public.crops(farmer_id);
CREATE INDEX idx_crops_category ON public.crops(category);
CREATE INDEX idx_crops_available ON public.crops(is_available);
CREATE INDEX idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX idx_orders_farmer_id ON public.orders(farmer_id);
CREATE INDEX idx_orders_status ON public.orders(status);