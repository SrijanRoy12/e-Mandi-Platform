-- Add foreign key constraints to establish relationships between tables

-- Add foreign key from crops.farmer_id to profiles.user_id
ALTER TABLE public.crops 
ADD CONSTRAINT crops_farmer_id_fkey 
FOREIGN KEY (farmer_id) REFERENCES public.profiles(user_id);

-- Add foreign key from orders.buyer_id to profiles.user_id  
ALTER TABLE public.orders 
ADD CONSTRAINT orders_buyer_id_fkey 
FOREIGN KEY (buyer_id) REFERENCES public.profiles(user_id);

-- Add foreign key from orders.farmer_id to profiles.user_id
ALTER TABLE public.orders 
ADD CONSTRAINT orders_farmer_id_fkey 
FOREIGN KEY (farmer_id) REFERENCES public.profiles(user_id);

-- Add foreign key from orders.crop_id to crops.id
ALTER TABLE public.orders 
ADD CONSTRAINT orders_crop_id_fkey 
FOREIGN KEY (crop_id) REFERENCES public.crops(id);