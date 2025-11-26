"use client";

import { ChevronRight, LucideMenu } from "lucide-react";
import { useState, ReactNode } from "react";
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
  href: string;
  icon: ReactNode;
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userOptionsOpen, setUserOptionsOption] = useState(false);

  const toggleSidebar = () => {
    if (isOpen) setUserOptionsOption(false);
    setIsOpen(!isOpen);
  };

  const user = getToken();

  const menuItems: MenuItem[] = [
    { name: "Add Member", href: "/dashboard/addmember", icon: <HiUserPlus /> },
    { name: "Add Book", href: "/dashboard/addbook", icon: <FaBook /> },
    { name: "View Members", href: "/dashboard/members", icon: <HiUsers /> },
    { name: "View Books", href: "/dashboard/books", icon: <ImBooks /> },
    {
      name: "Borrow / Return",
      href: "/dashboard/borrows",
      icon: <GrTransaction />,
    },
  ];

  return (
    <div id="dashboard" className="flex relative">
      <aside
        className={`flex flex-col justify-between relative p-2 md:px-3 pt-4 min-h-screen overflow-hidden transition-[width] duration-300
          border-r border-sidebar-border 
          bg-sidebar text-sidebar-foreground
          ${isOpen ? "w-64" : "w-16"}`}
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
                <Link href={item.href} key={item.name}>
                  <li>
                    <div
                      className="flex gap-4 items-center cursor-pointer rounded-md p-2 transition
                        hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
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
                </Link>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}
