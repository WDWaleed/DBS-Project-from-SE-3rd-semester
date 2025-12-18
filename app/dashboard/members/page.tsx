"use client";

import Spinner from "@/components/atoms/Spinner";
import axios from "axios";
import { ArchiveRestore, Search, Edit, Trash2 } from "lucide-react";
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "",
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

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setEditFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address,
      status: member.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (memberId: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      await axios.delete(`/api/members/${memberId}`);
      setMembers(members.filter((m) => m.member_id !== memberId));
      setFilteredMembers(
        filteredMembers.filter((m) => m.member_id !== memberId)
      );
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Failed to delete member");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    try {
      await axios.put(`/api/members/${editingMember.member_id}`, editFormData);
      const updatedMembers = members.map((m) =>
        m.member_id === editingMember.member_id ? { ...m, ...editFormData } : m
      );
      setMembers(updatedMembers);
      setFilteredMembers(updatedMembers);
      setIsEditDialogOpen(false);
      setEditingMember(null);
    } catch (error) {
      console.error("Error updating member:", error);
      alert("Failed to update member");
    }
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
                  "Actions",
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.member_id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Edit Dialog */}
          {isEditDialogOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Edit Member</h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={editFormData.phone}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <textarea
                      value={editFormData.address}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Status
                    </label>
                    <select
                      value={editFormData.status}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="banned">Banned</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditDialogOpen(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      )}
    </main>
  );
}
