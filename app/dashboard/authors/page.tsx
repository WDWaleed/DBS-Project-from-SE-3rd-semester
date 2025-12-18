"use client";

import Spinner from "@/components/atoms/Spinner";
import axios from "axios";
import { ArchiveRestore, Search, Edit, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MdRestore } from "react-icons/md";
import toast from "react-hot-toast";

interface Author {
  author_id: number;
  name: string;
  bio: string;
}

export default function Authors() {
  const pathname = usePathname();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchFormData, setSearchFormData] = useState({
    query: "",
    category: "name",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    bio: "",
  });

  // Fetch authors on page load
  useEffect(() => {
    if (pathname !== "/dashboard/authors") return;

    async function fetchAuthors() {
      try {
        const res = await axios.get<Author[]>("/api/authors");
        setAuthors(res.data);
        setFilteredAuthors(res.data);
      } catch (err) {
        console.error("Error fetching authors:", err);
      }
      setIsLoading(false);
    }

    fetchAuthors();
  }, [pathname]);

  // Real-time filtering
  useEffect(() => {
    if (!searchFormData.query) {
      setFilteredAuthors(authors);
      return;
    }

    const filtered = authors.filter((author) => {
      const field = searchFormData.category as keyof Author;
      const value = author[field];

      if (!value) return false;

      return value
        .toString()
        .toLowerCase()
        .includes(searchFormData.query.toLowerCase());
    });

    setFilteredAuthors(filtered);
  }, [searchFormData, authors]);

  // Optional form submission search
  const handleSearchForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filtered = authors.filter((author) => {
      const field = searchFormData.category as keyof Author;
      const value = author[field];

      if (!value) return false;

      return value
        .toString()
        .toLowerCase()
        .includes(searchFormData.query.toLowerCase());
    });

    setFilteredAuthors(filtered);
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setEditFormData({
      name: author.name,
      bio: author.bio || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (authorId: number) => {
    if (!confirm("Are you sure you want to delete this author?")) return;

    try {
      await axios.delete(`/api/authors/${authorId}`);
      setAuthors(authors.filter((a) => a.author_id !== authorId));
      setFilteredAuthors(
        filteredAuthors.filter((a) => a.author_id !== authorId)
      );
    } catch (error: any) {
      console.error("Error deleting author:", error);
      toast.error(error.response?.data?.error || "Failed to delete author");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuthor) return;

    try {
      await axios.put(`/api/authors/${editingAuthor.author_id}`, editFormData);
      const updatedAuthors = authors.map((a) =>
        a.author_id === editingAuthor.author_id
          ? {
              ...a,
              ...editFormData,
            }
          : a
      );
      setAuthors(updatedAuthors);
      setFilteredAuthors(updatedAuthors);
      setIsEditDialogOpen(false);
      setEditingAuthor(null);
    } catch (error) {
      console.error("Error updating author:", error);
      toast.error("Failed to update author");
    }
  };

  return (
    <main className="p-4">
      {isLoading ? (
        <Spinner />
      ) : (
        <main>
          <div className="flex justify-between mb-4 items-center">
            <div>
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
                  <option value="author_id">ID</option>
                  <option value="name">Name</option>
                  <option value="bio">Bio</option>
                </select>

                <button
                  type="submit"
                  className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Search />
                </button>
              </form>
            </div>

            <button
              className="text-2xl text-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
              onClick={() => {
                setFilteredAuthors(authors);
                setSearchFormData({ ...searchFormData, query: "" });
              }}
            >
              <MdRestore />
            </button>
          </div>

          <p className="text-right mb-2 text-muted-foreground">
            {filteredAuthors.length} authors
          </p>

          <table className="min-w-full border-border divide-y divide-border">
            <thead className="bg-sidebar">
              <tr>
                {["ID", "Name", "Bio", "Actions"].map((header) => (
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
              {filteredAuthors.map((author) => (
                <tr
                  key={author.author_id}
                  className="hover:bg-sidebar-accent transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {author.author_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {author.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">
                    {author.bio || "No bio available"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(author)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(author.author_id)}
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
                <h2 className="text-lg font-semibold mb-4">Edit Author</h2>
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
                      Bio
                    </label>
                    <textarea
                      value={editFormData.bio}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          bio: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground resize-none"
                    />
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
