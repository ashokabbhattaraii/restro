import { cookies } from "next/headers";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken");
  if (!token?.value) return null;
  return { user: { id: "admin", email: "", name: "Admin" } };
}
