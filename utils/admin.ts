export const ADMIN_EMAIL = "andrej.rot1@gmail.com";

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}
