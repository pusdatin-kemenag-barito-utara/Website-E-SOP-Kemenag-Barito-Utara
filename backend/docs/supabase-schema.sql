-- SQL Schema for SOP Builder
-- Run this in your Supabase SQL Editor to create the necessary table

-- Create the custom schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS kemenag_sop;

-- Grant usage on the schema to the API roles
GRANT USAGE ON SCHEMA kemenag_sop TO anon, authenticated;

-- -------------------------------------------------------------
-- Tabel 'profiles' untuk menyimpan role dan bidang user
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS kemenag_sop.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text NOT NULL,
  nama text,
  role text NOT NULL DEFAULT 'admin_bidang', -- role: 'super_admin' atau 'admin_bidang'
  bidang text NOT NULL DEFAULT 'Umum', -- nama bidang, contoh: 'Bimas Islam', 'PHU', dll
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE kemenag_sop.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile & super admin to view all
CREATE POLICY "profiles_select_policy" 
  ON kemenag_sop.profiles FOR SELECT 
  TO authenticated
  USING (
    (select auth.uid()) = id
    OR
    ((select auth.jwt()) ->> 'email') = 'baritoutara@kemenag.go.id'
  );

-- Super admin can insert profiles
CREATE POLICY "profiles_insert_policy"
  ON kemenag_sop.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    ((select auth.jwt()) ->> 'email') = 'baritoutara@kemenag.go.id'
  );

-- Super admin can update profiles
CREATE POLICY "profiles_update_policy"
  ON kemenag_sop.profiles FOR UPDATE
  TO authenticated
  USING (
    ((select auth.jwt()) ->> 'email') = 'baritoutara@kemenag.go.id'
  )
  WITH CHECK (
    ((select auth.jwt()) ->> 'email') = 'baritoutara@kemenag.go.id'
  );

-- Super admin can delete profiles
CREATE POLICY "profiles_delete_policy"
  ON kemenag_sop.profiles FOR DELETE
  TO authenticated
  USING (
    ((select auth.jwt()) ->> 'email') = 'baritoutara@kemenag.go.id'
  );

-- -------------------------------------------------------------
-- Tabel 'sops' untuk menyimpan dokumen SOP
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS kemenag_sop.sops (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email text,
  title text NOT NULL,
  header jsonb NOT NULL DEFAULT '{}'::jsonb,
  activities jsonb NOT NULL DEFAULT '[]'::jsonb,
  roles jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Setup Row Level Security (RLS)
ALTER TABLE kemenag_sop.sops ENABLE ROW LEVEL SECURITY;

-- Admin Bidang hanya bisa melihat SOP miliknya sendiri
-- Super Admin bisa melihat SEMUA SOP
CREATE POLICY "View SOPs based on roles" 
  ON kemenag_sop.sops FOR SELECT 
  USING (
    auth.uid() = user_id 
    OR 
    auth.jwt() ->> 'email' = 'baritoutara@kemenag.go.id'
  );

-- Admin Bidang & Super Admin bisa membuat SOP (terikat ke akun mereka)
CREATE POLICY "Users can insert own sops" 
  ON kemenag_sop.sops FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Admin Bidang & Super Admin bisa mengedit SOP milik mereka
-- (Super Admin bisa mengedit semua SOP jika baris OR di bawah diaktifkan)
CREATE POLICY "Users can update own sops" 
  ON kemenag_sop.sops FOR UPDATE 
  USING (
    auth.uid() = user_id
    OR 
    auth.jwt() ->> 'email' = 'baritoutara@kemenag.go.id'
  );

-- Admin Bidang & Super Admin bisa menghapus SOP milik mereka
CREATE POLICY "Users can delete own sops" 
  ON kemenag_sop.sops FOR DELETE 
  USING (
    auth.uid() = user_id
    OR 
    auth.jwt() ->> 'email' = 'baritoutara@kemenag.go.id'
  );

-- Grant all privileges on all tables in schema to the API roles
GRANT ALL ON ALL TABLES IN SCHEMA kemenag_sop TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA kemenag_sop TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA kemenag_sop TO anon, authenticated;

-- -------------------------------------------------------------
-- Trigger untuk otomatis membuat profile saat ada user baru daftar
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION kemenag_sop.handle_new_user() 
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = kemenag_sop, public, pg_temp
AS $$
BEGIN
  INSERT INTO kemenag_sop.profiles (id, email, role)
  VALUES (
    new.id, 
    new.email, 
    CASE 
      WHEN new.email = 'baritoutara@kemenag.go.id' THEN 'super_admin'
      ELSE 'admin_bidang'
    END
  );
  RETURN new;
END;
$$;

-- Hapus trigger lama jika ada, lalu pasang yang baru
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE kemenag_sop.handle_new_user();
