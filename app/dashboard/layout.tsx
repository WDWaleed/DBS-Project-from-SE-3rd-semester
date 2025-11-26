import "../globals.css";
import Sidebar from "@/components/DashboardSidebar";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard area for logged-in users",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
