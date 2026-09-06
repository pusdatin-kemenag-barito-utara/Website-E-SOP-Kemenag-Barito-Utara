import { useState, useEffect, useMemo, useCallback } from "react";
import { usersApi } from "@/lib/api";
import type { UserProfile, CreateUserInput, UpdateUserInput } from "@/types/user";

interface UseUserManagementProps {
  onToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export function useUserManagement({ onToast }: UseUserManagementProps = {}) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bidangFilter, setBidangFilter] = useState<string>("all");

  // Modal dialog states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserProfile | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await usersApi.list();
      setUsers(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat daftar pengguna";
      onToast?.(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filtered Users computation
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.nama && u.nama.toLowerCase().includes(q)) ||
        (u.bidang && u.bidang.toLowerCase().includes(q));

      const matchRole =
        roleFilter === "all" ||
        (roleFilter === "super_admin" && u.role === "super_admin") ||
        (roleFilter === "admin_bidang" && u.role !== "super_admin");

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && u.is_active) ||
        (statusFilter === "inactive" && !u.is_active);

      const matchBidang =
        bidangFilter === "all" || u.bidang === bidangFilter;

      return matchSearch && matchRole && matchStatus && matchBidang;
    });
  }, [users, search, roleFilter, statusFilter, bidangFilter]);

  // Dynamically extract unique bidang options from users in the system
  const bidangOptions = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => {
      const b = u.bidang?.trim();
      if (b) {
        set.add(b);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [users]);

  // Handle Create User
  const handleCreate = async (payload: CreateUserInput): Promise<boolean> => {
    setActionLoading(true);
    try {
      await usersApi.create(payload);
      onToast?.(`Pengguna ${payload.email} berhasil ditambahkan!`, "success");
      setCreateModalOpen(false);
      fetchUsers();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan pengguna";
      onToast?.(msg, "error");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Update User
  const handleUpdate = async (userId: string, payload: UpdateUserInput): Promise<boolean> => {
    setActionLoading(true);
    try {
      await usersApi.update(userId, payload);
      onToast?.("Data pengguna berhasil diperbarui!", "success");
      setEditUser(null);
      fetchUsers();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui pengguna";
      onToast?.(msg, "error");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete User
  const handleDelete = async (userId: string, email?: string | null): Promise<boolean> => {
    setActionLoading(true);
    try {
      await usersApi.remove(userId);
      onToast?.(`Pengguna ${email || "terpilih"} berhasil dihapus!`, "success");
      setDeleteUser(null);
      fetchUsers();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus pengguna";
      onToast?.(msg, "error");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    users,
    loading,
    filteredUsers,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    bidangFilter,
    setBidangFilter,
    bidangOptions,
    createModalOpen,
    setCreateModalOpen,
    editUser,
    setEditUser,
    deleteUser,
    setDeleteUser,
    actionLoading,
    fetchUsers,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
