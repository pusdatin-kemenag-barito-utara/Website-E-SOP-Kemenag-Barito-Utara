import React from "react";
import {
  useUserManagement,
  UserManagementHeader,
  UserManagementFilters,
  UserTable,
  CreateUserModal,
  EditUserModal,
  DeleteUserModal,
} from "./users";

interface UserManagementTabProps {
  currentUserEmail?: string | null;
  onToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export function UserManagementTab({
  currentUserEmail,
  onToast,
}: UserManagementTabProps) {
  const {
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
  } = useUserManagement({ onToast });

  const hasActiveFilters =
    Boolean(search) ||
    roleFilter !== "all" ||
    statusFilter !== "all" ||
    bidangFilter !== "all";

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50/50 dark:bg-slate-950">
      {/* Top Header & Actions Bar */}
      <UserManagementHeader
        totalUsers={users.length}
        loading={loading}
        onRefresh={fetchUsers}
        onAddUser={() => setCreateModalOpen(true)}
      />

      {/* Dynamic Filter and Search Bar */}
      <UserManagementFilters
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        bidangFilter={bidangFilter}
        onBidangFilterChange={setBidangFilter}
        bidangOptions={bidangOptions}
      />

      {/* Main Users Table / Empty & Loading States */}
      <UserTable
        users={filteredUsers}
        loading={loading}
        currentUserEmail={currentUserEmail}
        hasActiveFilters={hasActiveFilters}
        onEdit={(user) => setEditUser(user)}
        onDelete={(user) => setDeleteUser(user)}
      />

      {/* Modal: Tambah Pengguna Baru (Dynamic Bidang) */}
      <CreateUserModal
        isOpen={createModalOpen}
        isLoading={actionLoading}
        bidangOptions={bidangOptions}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreate}
        onToast={onToast}
      />

      {/* Modal: Edit Pengguna (Dynamic Bidang) */}
      <EditUserModal
        user={editUser}
        isLoading={actionLoading}
        bidangOptions={bidangOptions}
        onClose={() => setEditUser(null)}
        onSubmit={handleUpdate}
      />

      {/* Modal: Konfirmasi Hapus Pengguna */}
      <DeleteUserModal
        user={deleteUser}
        isLoading={actionLoading}
        onClose={() => setDeleteUser(null)}
        onConfirm={() => {
          if (deleteUser) {
            handleDelete(deleteUser.id, deleteUser.email);
          }
        }}
      />
    </div>
  );
}
