"use client";

import { ChevronRight, LucideMenu, Moon, Sun } from "lucide-react";
import { useState, ReactNode, useEffect } from "react";
import { MdPostAdd } from "react-icons/md";
import { GiFiles } from "react-icons/gi";
import { FiSettings, FiLogOut } from "react-icons/fi";
import Link from "next/link";
import { UserIcon, LogOutIcon } from "lucide-react";
import { getToken } from "@/lib/utils/auth";
import { redirect } from "next/navigation";
import { HiUserPlus, HiUsers } from "react-icons/hi2";
import { FaBook } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { GrTransaction } from "react-icons/gr";

interface MenuItem {
  name: string;
  icon: ReactNode;
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userOptionsOpen, setUserOptionsOption] = useState(false);

  const toggleSidebar = () => {
    if (isOpen) {
      setUserOptionsOption(false);
    }
    setIsOpen(!isOpen);
  };

  const user = getToken();
  //   const signOut = useAuthStore((state) => state.signOut);
  //   const checkUser = useAuthStore((state) => state.checkUser);

  const menuItems: MenuItem[] = [
    { name: "Add User", icon: <HiUserPlus /> },
    { name: "Add Book", icon: <FaBook /> },
    { name: "View Users", icon: <HiUsers /> },
    { name: "View Books", icon: <ImBooks /> },
    { name: "Borrow / Return", icon: <GrTransaction /> },
  ];

  return (
    <div id="dashboard" className="flex relative">
      <aside
        className={`bg-muted flex flex-col justify-between border-r-slate-800 border-r-2 text-muted-foreground relative p-2 md:px-3 pt-4 min-h-screen overflow-hidden transition-[width] duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Menu */}
        <div>
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="rounded-md p-2 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LucideMenu />
            </button>
          </div>

          <nav className="pt-4 pl-1">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <div className="flex gap-4 items-center cursor-pointer rounded-md p-2 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <span className="text-2xl">{item.icon}</span>
                    <span
                      className={`overflow-hidden whitespace-nowrap transition-all duration-300 transform ${
                        isOpen
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-4"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* User Info + Toggle */}
        <div className="mt-4 relative flex gap-2 items-center">
          <div
            className={`overflow-hidden whitespace-nowrap transition-all flex flex-col text-sm duration-300 transform ${
              isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
          >
            <span className="font-semibold">{user?.username}</span>
            <span>{user?.email}</span>
          </div>
          <button
            className={`overflow-hidden whitespace-nowrap transition-all flex flex-col text-sm duration-300 transform  ${
              isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
            onClick={() => setUserOptionsOption(!userOptionsOpen)}
          >
            <ChevronRight
              className={`w-5 h-5 transition-transform duration-150 ${
                userOptionsOpen ? "-rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </aside>

      {/* Floating User Menu (outside sidebar) */}
      <div
        className={`absolute bottom-2 left-66 z-50 w-40 rounded-md bg-muted text-muted-foreground shadow-lg
    transform transition-all duration-150 ease-in-out
    ${
      userOptionsOpen
        ? "opacity-100 translate-x-0"
        : "opacity-0 -translate-x-2 pointer-events-none"
    }`}
      >
        <ul className="py-1">
          <li>
            <Link
              href="/account"
              className="flex rounded-md items-center gap-2 px-4 py-2 text-sm transition  hover:bg-accent"
            >
              <UserIcon className="h-5 w-5" />
              Account
            </Link>
          </li>

          <li>
            <button
              onClick={() => {
                localStorage.removeItem("userToken");
                redirect("/auth");
              }}
              className="flex rounded-md items-center gap-2 w-full px-4 py-2 text-sm  hover:bg-accent"
            >
              <LogOutIcon className="h-5 w-5" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
