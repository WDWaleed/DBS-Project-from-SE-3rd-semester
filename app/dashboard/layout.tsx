// app/dashboard/layout.tsx
import "../globals.css";
import Sidebar from "@/components/DashboardSidebar";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard area for logged-in users",
};

// ---- IMPORTANT ----
// This layout is SERVER-COMPONENT by default.
// So we CANNOT read localStorage here.
// --------------------

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar /> {/* Client Component */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
