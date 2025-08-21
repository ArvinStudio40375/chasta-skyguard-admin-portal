-- Create calculations table for lightning protection cost estimates
CREATE TABLE public.calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  building_type TEXT NOT NULL,
  height INTEGER NOT NULL,
  area INTEGER NOT NULL,
  lightning_points INTEGER NOT NULL,
  system_type TEXT NOT NULL,
  estimated_cost INTEGER NOT NULL,
  package TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.calculations ENABLE ROW LEVEL SECURITY;

-- Create policies for calculations
CREATE POLICY "Anyone can create calculations" 
ON public.calculations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view and manage calculations" 
ON public.calculations 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));