-- TACTICAL SCHEMA: User Progression & Telemetry
-- Link to auth.users for identity integrity

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  xp INTEGER DEFAULT 0 NOT NULL,
  level TEXT DEFAULT 'Beginner' NOT NULL,
  completed_msns TEXT[] DEFAULT '{}' NOT NULL,
  badges TEXT[] DEFAULT '{}' NOT NULL,
  skill_vector JSONB DEFAULT '{"python": 0, "tf": 0, "pytorch": 0, "nlp": 0, "cv": 0, "data_eng": 0}' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- SECURITY: Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- POLICY: Read Access (Global Leaderboard)
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

-- POLICY: Write Access (Own Telemetry)
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- POLICY: Insert Access (Initial Sync)
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- FUNCTION: Set Updated At
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();
