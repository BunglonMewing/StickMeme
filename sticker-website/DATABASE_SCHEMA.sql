-- ### KUMPULAN STICKER WHATSAPP - SUPABASE SCHEMA ###
-- This script sets up the database tables, relationships,
-- and basic security policies for the sticker sharing platform.

-- ---
-- 1. TABLES
-- ---

-- Table to store user information
-- The `id` column is linked to the `auth.users` table in Supabase.
CREATE TABLE public.users (
    id UUID PRIMARY KEY NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    photo_url TEXT,
    bio TEXT,
    followers_count INT NOT NULL DEFAULT 0,
    following_count INT NOT NULL DEFAULT 0,
    coins INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Add a comment to explain the table's purpose
COMMENT ON TABLE public.users IS 'Stores public user profile information.';

-- Table for sticker posts
CREATE TABLE public.stickers (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    id_user UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    file_url TEXT NOT NULL, -- URL to the .webp file in Supabase Storage
    likes_count INT NOT NULL DEFAULT 0,
    downloads_count INT NOT NULL DEFAULT 0,
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.stickers IS 'Stores individual sticker posts.';

-- Junction table for likes
CREATE TABLE public.likes (
    id_user UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    id_sticker UUID NOT NULL REFERENCES public.stickers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id_user, id_sticker)
);
COMMENT ON TABLE public.likes IS 'Tracks which user liked which sticker.';

-- Table for comments on stickers
CREATE TABLE public.comments (
    id BIGSERIAL PRIMARY KEY,
    id_user UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    id_sticker UUID NOT NULL REFERENCES public.stickers(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.comments IS 'Stores comments made by users on stickers.';

-- Table for follower relationships
CREATE TABLE public.followers (
    follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);
COMMENT ON TABLE public.followers IS 'Tracks follower/following relationships.';

-- Table for coin transactions (optional feature)
CREATE TABLE public.transactions (
    id BIGSERIAL PRIMARY KEY,
    id_user UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- e.g., 'topup', 'purchase'
    amount INT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.transactions IS 'Logs coin top-ups and purchases.';


-- ---
-- 2. SUPABASE AUTH INTEGRATION
-- ---

-- Function to create a public user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, username, photo_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'username', -- Expect 'username' in metadata on signup
    new.raw_user_meta_data->>'avatar_url'  -- Expect 'avatar_url' in metadata
  );
  RETURN new;
END;
$$;

-- Trigger to execute the function after a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ---
-- 3. ROW LEVEL SECURITY (RLS)
-- ---

-- Enable RLS for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policies for 'users' table
CREATE POLICY "Public user profiles are viewable by everyone." ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile." ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- INSERT is handled by the trigger, so no INSERT policy is needed for users.

-- Policies for 'stickers' table
CREATE POLICY "Stickers are viewable by everyone." ON public.stickers FOR SELECT USING (true);
CREATE POLICY "Users can insert their own stickers." ON public.stickers FOR INSERT WITH CHECK (auth.uid() = id_user);
CREATE POLICY "Users can update their own stickers." ON public.stickers FOR UPDATE USING (auth.uid() = id_user) WITH CHECK (auth.uid() = id_user);
CREATE POLICY "Users can delete their own stickers." ON public.stickers FOR DELETE USING (auth.uid() = id_user);

-- Policies for 'likes' table
CREATE POLICY "Likes are viewable by everyone." ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can insert and delete their own likes." ON public.likes FOR ALL USING (auth.uid() = id_user) WITH CHECK (auth.uid() = id_user);

-- Policies for 'comments' table
CREATE POLICY "Comments are viewable by everyone." ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can insert their own comments." ON public.comments FOR INSERT WITH CHECK (auth.uid() = id_user);
CREATE POLICY "Users can update their own comments." ON public.comments FOR UPDATE USING (auth.uid() = id_user) WITH CHECK (auth.uid() = id_user);
CREATE POLICY "Users can delete their own comments." ON public.comments FOR DELETE USING (auth.uid() = id_user);

-- Policies for 'followers' table
CREATE POLICY "Follow relationships are viewable by everyone." ON public.followers FOR SELECT USING (true);
CREATE POLICY "Users can create and delete their own follow relationships." ON public.followers FOR ALL USING (auth.uid() = follower_id) WITH CHECK (auth.uid() = follower_id);

-- Policies for 'transactions' table
CREATE POLICY "Users can view their own transactions." ON public.transactions FOR SELECT USING (auth.uid() = id_user);
CREATE POLICY "Users can insert their own transactions." ON public.transactions FOR INSERT WITH CHECK (auth.uid() = id_user);

-- ---
-- 4. BUCKET FOR STICKERS
-- ---
-- The user should manually create a storage bucket named 'stickers'
-- with public read access. Here is the policy for that bucket:

-- Bucket: 'stickers'
-- Public: Yes
-- Access Policies:
-- - SELECT: anon, authenticated
-- - INSERT: authenticated
-- - UPDATE: authenticated (with custom RLS policy if needed)
-- - DELETE: authenticated (with custom RLS policy if needed)
-- Example RLS policy for Storage (run in SQL editor):
-- CREATE POLICY "Sticker images are publicly accessible."
-- ON storage.objects FOR SELECT
-- USING ( bucket_id = 'stickers' );

-- CREATE POLICY "Anyone can upload a sticker."
-- ON storage.objects FOR INSERT
-- WITH CHECK ( bucket_id = 'stickers' );
