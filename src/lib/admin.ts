// Any email on the lizontheweb.com domain is treated as an admin:
// no payment required, onboarding is auto-completed, unlimited access.
export const ADMIN_DOMAIN = 'lizontheweb.com';

export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return normalized.endsWith(`@${ADMIN_DOMAIN}`);
}
