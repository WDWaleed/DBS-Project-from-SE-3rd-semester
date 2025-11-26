"use client";

import Spinner from "@/components/atoms/Spinner";
import axios from "axios";
import { ArchiveRestore, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MdRestore } from "react-icons/md";

interface Member {
  member_id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  membership_date: string;
  status: string;
}

export default function Members() {
  const pathname = usePathname();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchFormData, setSearchFormData] = useState({
    query: "",
    category: "name",
  });

  // Fetch members once on page load
  useEffect(() => {
    if (pathname !== "/dashboard/members") return;

    async function fetchMembers() {
      try {
        const res = await axios.get<Member[]>("/api/members");
        setMembers(res.data);
        setFilteredMembers(res.data);
      } catch (err) {
        console.error("Error fetching members:", err);
      }
      setIsLoading(false);
    }

    fetchMembers();
  }, [pathname]);

  // Real-time filtering
  useEffect(() => {
    if (!searchFormData.query) {
      setFilteredMembers(members);
      return;
    }

    const filtered = members.filter((member) => {
      const field = searchFormData.category as keyof Member;
      const value = member[field];

      if (!value) return false;

      return value
        .toString()
        .toLowerCase()
        .includes(searchFormData.query.toLowerCase());
    });

    setFilteredMembers(filtered);
  }, [searchFormData, members]);

  // Optional: form submission
  const handleSearchForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filtered = members.filter((member) => {
      const field = searchFormData.category as keyof Member;
      const value = member[field];

      if (!value) return false;

      return value
        .toString()
        .toLowerCase()
        .includes(searchFormData.query.toLowerCase());
    });

    setFilteredMembers(filtered);
  };

  return (
    <main className="p-4">
      {isLoading ? (
        <Spinner />
      ) : (
        <main>
          <div className="flex justify-between mb-4 items-center">
            <form
              id="searchForm"
              onSubmit={handleSearchForm}
              className="flex gap-4 items-center"
            >
              <input
                type="text"
                placeholder="Search for..."
                className="px-3 py-2 w-64 rounded-md bg-input text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                value={searchFormData.query}
                onChange={(e) =>
                  setSearchFormData({
                    ...searchFormData,
                    query: e.target.value,
                  })
                }
              />

              <select
                className="px-3 py-2 w-32 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-ring hover:cursor-pointer"
                value={searchFormData.category}
                onChange={(e) =>
                  setSearchFormData({
                    ...searchFormData,
                    category: e.target.value,
                  })
                }
              >
                <option value="member_id">ID</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="address">Address</option>
              </select>

              <button
                type="submit"
                className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Search />
              </button>
            </form>

            <MdRestore
              className="text-2xl text-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
              onClick={() => {
                setFilteredMembers(members);
                setSearchFormData({ ...searchFormData, query: "" });
              }}
            />
          </div>

          <p className="text-right mb-2 text-muted-foreground">
            {filteredMembers.length} members
          </p>

          <table className="min-w-full border-border divide-y divide-border">
            <thead className="bg-sidebar">
              <tr>
                {[
                  "ID",
                  "Name",
                  "Email",
                  "Phone",
                  "Address",
                  "Membership Date",
                  "Status",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-background divide-y divide-border">
              {filteredMembers.map((member) => (
                <tr
                  key={member.member_id}
                  className="hover:bg-sidebar-accent transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {member.member_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {member.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {member.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {member.membership_date.slice(0, 10)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      member.status === "active"
                        ? "text-green-500"
                        : member.status === "inactive"
                        ? "text-muted-foreground"
                        : "text-destructive"
                    }`}
                  >
                    {member.status.charAt(0).toUpperCase() +
                      member.status.slice(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      )}
    </main>
  );
}
