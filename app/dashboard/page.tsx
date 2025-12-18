"use client";

import { getToken } from "@/lib/utils/auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  // useEffect(() => {
  //   const user = getToken();
  //   if (!user) redirect("/auth");
  // }, []);
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl md:text-5xl text-center font-bold mb-4">
        Library Management System
      </h1>
    </main>
  );
}
