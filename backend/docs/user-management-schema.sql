-- ==============================================================================
-- SKEMA BASIS DATA MANAJEMEN PENGGUNA MANDIRI E-SOP DIGITAL KEMENAG BARITO UTARA
-- Tidak lagi bergantung pada skema kemenag_pusdatin
-- Jalankan skrip ini di SQL Editor Dashboard Supabase
-- ==============================================================================

-- 1. Pastikan Schema kemenag_sop Ada
CREATE SCHEMA IF NOT EXISTS kemenag_sop;
GRANT USAGE ON SCHEMA kemenag_sop TO anon, authenticated, service_role;

-- 2. Buat / Perbarui Tabel Profiles
CREATE TABLE IF NOT EXISTS kemenag_sop.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text NOT NULL,
  nama text,
  role text NOT NULL DEFAULT 'admin_bidang', -- 'super_admin' atau 'admin_bidang'
  bidang text NOT NULL DEFAULT 'Umum',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Kolom tambahan jika tabel sudah pernah dibuat sebelumnya
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'kemenag_sop' AND table_name = 'profiles' AND column_name = 'nama') THEN
    ALTER TABLE kemenag_sop.profiles ADD COLUMN nama text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'kemenag_sop' AND table_name = 'is_active') THEN
    ALTER TABLE kemenag_sop.profiles ADD COLUMN is_active boolean NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'kemenag_sop' AND table_name = 'updated_at') THEN
    ALTER TABLE kemenag_sop.profiles ADD COLUMN updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
  END IF;
END $$;

-- 3. Row Level Security (RLS)
ALTER TABLE kemenag_sop.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON kemenag_sop.profiles;
DROP POLICY IF EXISTS "Super admin can view all profiles" ON kemenag_sop.profiles;
DROP POLICY IF EXISTS "Allow public read for keep-alive" ON kemenag_sop.profiles;
DROP POLICY IF EXISTS "Super admin can manage profiles" ON kemenag_sop.profiles;
DROP POLICY IF EXISTS "Allow service_role full access to profiles" ON kemenag_sop.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON kemenag_sop.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON kemenag_sop.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON kemenag_sop.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON kemenag_sop.profiles;

-- Pengguna dapat melihat profil miliknya sendiri & Super admin dapat melihat seluruh profil (Teroptimasi RLS InitPlan & Non-Overlapping)
CREATE POLICY "profiles_select_policy"
  ON kemenag_sop.profiles FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = id 
    OR 
    ((select auth.jwt()) ->> 'email') = 'baritoutara@kemenag.go.id'
  );

-- Super admin dapat menambah profil
CREATE POLICY "profiles_insert_policy"
  ON kemenag_sop.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    ((select auth.jwt()) ->> 'email') = 'baritoutara@kemenag.go.id'
  );

-- Super admin dapat mengubah profil
CREATE POLICY "profiles_update_policy"
  ON kemenag_sop.profiles FOR UPDATE
  TO authenticated
  USING (
    ((select auth.jwt()) ->> 'email') = 'baritoutara@kemenag.go.id'
  )
  WITH CHECK (
    ((select auth.jwt()) ->> 'email') = 'baritoutara@kemenag.go.id'
  );

-- Super admin dapat menghapus profil
CREATE POLICY "profiles_delete_policy"
  ON kemenag_sop.profiles FOR DELETE
  TO authenticated
  USING (
    ((select auth.jwt()) ->> 'email') = 'baritoutara@kemenag.go.id'
  );

-- Service role bypass RLS (untuk backend Go Fiber)
CREATE POLICY "Allow service_role full access to profiles"
  ON kemenag_sop.profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4. Hak Akses Schema & Table
GRANT ALL ON ALL TABLES IN SCHEMA kemenag_sop TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA kemenag_sop TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA kemenag_sop TO anon, authenticated, service_role;

-- 5. Trigger Otomatis Pembuatan Profile saat Auth User Baru Dibuat (SET search_path aman)
CREATE OR REPLACE FUNCTION kemenag_sop.handle_new_user() 
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = kemenag_sop, public, pg_temp
AS $$
BEGIN
  INSERT INTO kemenag_sop.profiles (id, email, nama, role, bidang, is_active)
  VALUES (
    new.id, 
    new.email,
    COALESCE(new.raw_user_meta_data->>'nama', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    CASE 
      WHEN new.email = 'baritoutara@kemenag.go.id' OR new.raw_user_meta_data->>'role' = 'super_admin' THEN 'super_admin'
      ELSE 'admin_bidang'
    END,
    COALESCE(new.raw_user_meta_data->>'bidang', 'Umum'),
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nama = COALESCE(EXCLUDED.nama, kemenag_sop.profiles.nama),
    bidang = COALESCE(NULLIF(EXCLUDED.bidang, 'Umum'), kemenag_sop.profiles.bidang),
    updated_at = timezone('utc'::text, now());
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_sop ON auth.users;
CREATE TRIGGER on_auth_user_created_sop
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE kemenag_sop.handle_new_user();

-- 6. Trigger Pembaruan Otomatis Kolom updated_at (SET search_path aman)
CREATE OR REPLACE FUNCTION kemenag_sop.set_updated_at()
RETURNS trigger 
LANGUAGE plpgsql
SET search_path = kemenag_sop, public, pg_temp
AS $$
BEGIN
  new.updated_at = timezone('utc'::text, now());
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON kemenag_sop.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON kemenag_sop.profiles
  FOR EACH ROW EXECUTE PROCEDURE kemenag_sop.set_updated_at();

-- 7. Migrasikan / Sinkronkan Pengguna dari kemenag_arsip.users (jika ada)
INSERT INTO kemenag_sop.profiles (id, email, nama, role, bidang, is_active, created_at, updated_at)
SELECT 
  u.id,
  u.email,
  u.full_name,
  CASE 
    WHEN u.role ILIKE '%super%' OR u.email = 'baritoutara@kemenag.go.id' THEN 'super_admin'
    ELSE 'admin_bidang'
  END,
  COALESCE(b.name, CASE WHEN u.email = 'baritoutara@kemenag.go.id' THEN 'Proyek Super Admin' ELSE 'Umum' END),
  u.is_active,
  COALESCE(u.created_at, timezone('utc'::text, now())),
  COALESCE(u.updated_at, timezone('utc'::text, now()))
FROM kemenag_arsip.users u
LEFT JOIN kemenag_arsip.bidang b ON u.bidang_id = b.id
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  nama = EXCLUDED.nama,
  role = EXCLUDED.role,
  bidang = EXCLUDED.bidang,
  is_active = EXCLUDED.is_active,
  updated_at = timezone('utc'::text, now());
