-- Jalankan perintah ini di SQL Editor Supabase Anda:
-- Ini akan menyiapkan tabel yang mendukung penyimpanan per-user

-- 1. Hapus tabel lama jika ada agar bersih
DROP TABLE IF EXISTS sops;

-- 2. Membuat tabel sops dengan dukungan User ID
CREATE TABLE sops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  title TEXT,
  header JSONB,
  activities JSONB,
  roles JSONB
);

-- 3. Mengaktifkan Row Level Security (RLS)
ALTER TABLE sops ENABLE ROW LEVEL SECURITY;

-- 4. Membuat kebijakan keamanan (Security Policy)
-- Kebijakan ini memastikan user HANYA bisa melihat dan mengedit data mereka sendiri
CREATE POLICY "Users can only access their own data" ON sops
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5. Fungsi untuk update otomatis kolom updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sops_updated_at
BEFORE UPDATE ON sops
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
