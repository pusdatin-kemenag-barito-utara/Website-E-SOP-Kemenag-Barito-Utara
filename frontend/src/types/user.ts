export interface UserProfile {
  id: string;
  email: string | null;
  nama: string | null;
  role: "super_admin" | "admin_bidang" | string;
  bidang: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  nama: string;
  role: string;
  bidang: string;
}

export interface UpdateUserInput {
  nama: string;
  role: string;
  bidang: string;
  is_active?: boolean;
  password?: string;
}
