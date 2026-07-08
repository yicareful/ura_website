import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/AdminSidebar";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: "var(--space-12) var(--space-12)", minHeight: "100vh", background: "var(--color-paper)" }}>{children}</main>
    </div>
  );
}