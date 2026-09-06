export const ROLE_OPTIONS = [
  { value: "admin_bidang", label: "Admin Bidang" },
  { value: "super_admin", label: "Super Admin" },
] as const;

export type RoleOption = typeof ROLE_OPTIONS[number]["value"];
