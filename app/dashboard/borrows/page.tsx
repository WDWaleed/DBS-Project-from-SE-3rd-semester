"use client";

import Spinner from "@/components/atoms/Spinner";
import { getErrorMessage } from "@/lib/utils/helpers";
import axios from "axios";
import { Plus, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbTransferIn } from "react-icons/tb";

interface Borrow {
  borrow_id: number;
  book_name: string;
  member_name: string;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: string;
}

export default function Borrows() {
  const pathname = usePathname();
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [filteredBorrows, setFilteredBorrows] = useState<Borrow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchFormData, setSearchFormData] = useState({
    query: "",
    category: "book_name",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBorrowData, setNewBorrowData] = useState({
    book_id: "",
    member_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch borrows
  useEffect(() => {
    if (pathname !== "/dashboard/borrows") return;

    async function fetchBorrows() {
      try {
        const res = await axios.get<Borrow[]>("/api/borrows");
        setBorrows(res.data);
        setFilteredBorrows(res.data);
      } catch (err) {
        console.error("Error fetching borrows:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBorrows();
  }, [pathname]);

  // Filtering
  useEffect(() => {
    if (!searchFormData.query) {
      setFilteredBorrows(borrows);
      return;
    }
    const filtered = borrows.filter((borrow) => {
      const field = searchFormData.category as keyof Borrow;
      const value = borrow[field];
      if (!value) return false;
      return value
        .toString()
        .toLowerCase()
        .includes(searchFormData.query.toLowerCase());
    });
    setFilteredBorrows(filtered);
  }, [searchFormData, borrows]);

  const handleSearchForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filtered = borrows.filter((borrow) => {
      const field = searchFormData.category as keyof Borrow;
      const value = borrow[field];
      if (!value) return false;
      return value
        .toString()
        .toLowerCase()
        .includes(searchFormData.query.toLowerCase());
    });
    setFilteredBorrows(filtered);
  };

  // Return book
  const returnBook = async (borrowId: number) => {
    const prevBorrows = [...filteredBorrows];
    setFilteredBorrows((prev) =>
      prev.map((b) =>
        b.borrow_id === borrowId
          ? { ...b, status: "returned", return_date: new Date().toISOString() }
          : b
      )
    );

    try {
      await axios.put(`/api/borrows/${borrowId}/return`);
      const res = await axios.get<Borrow[]>("/api/borrows");
      setBorrows(res.data);
      setFilteredBorrows(res.data);
    } catch (err) {
      console.error("Failed to return book:", err);
      setFilteredBorrows(prevBorrows);
    }
  };

  // Create new borrow
  const createBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("/api/borrows", {
        book_id: newBorrowData.book_id,
        member_id: newBorrowData.member_id,
      });

      const res = await axios.get<Borrow[]>("/api/borrows");
      setBorrows(res.data);
      setFilteredBorrows(res.data);

      setIsDialogOpen(false);
      toast.success("Entered successfully");
      setNewBorrowData({ book_id: "", member_id: "" });
    } catch (err) {
      toast.error(getErrorMessage(err));
      console.error("Failed to create borrow:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-4">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
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
                className="px-3 py-2 w-40 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-ring hover:cursor-pointer"
                value={searchFormData.category}
                onChange={(e) =>
                  setSearchFormData({
                    ...searchFormData,
                    category: e.target.value,
                  })
                }
              >
                <option value="borrow_id">ID</option>
                <option value="book_name">Book</option>
                <option value="member_name">Member</option>
                <option value="status">Status</option>
              </select>

              <button
                type="submit"
                className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Search />
              </button>
            </form>

            <div>
              <button
                className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus />
              </button>
            </div>
          </div>

          {/* Dialog */}
          {isDialogOpen && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <div className="bg-background p-6 rounded-md w-80 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Create Borrow</h2>
                <form onSubmit={createBorrow} className="flex flex-col gap-3">
                  <input
                    type="number"
                    placeholder="Book ID"
                    required
                    value={newBorrowData.book_id}
                    onChange={(e) =>
                      setNewBorrowData({
                        ...newBorrowData,
                        book_id: e.target.value,
                      })
                    }
                    className="p-2 border border-border rounded bg-input"
                  />
                  <input
                    type="number"
                    placeholder="Member ID"
                    required
                    value={newBorrowData.member_id}
                    onChange={(e) =>
                      setNewBorrowData({
                        ...newBorrowData,
                        member_id: e.target.value,
                      })
                    }
                    className="p-2 border border-border rounded bg-input"
                  />

                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      className="px-3 py-2 rounded-md bg-muted hover:bg-muted/80 transition"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
                    >
                      {isSubmitting ? "Saving..." : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <p className="text-right mb-2 text-muted-foreground">
            {filteredBorrows.length} borrows
          </p>

          <table className="min-w-full border-border divide-y divide-border">
            <thead className="bg-sidebar">
              <tr>
                {[
                  "ID",
                  "Book",
                  "Member",
                  "Borrow Date",
                  "Due Date",
                  "Return Date",
                  "Status",
                  "Return",
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
              {filteredBorrows.map((borrow) => (
                <tr
                  key={borrow.borrow_id}
                  className="hover:bg-sidebar-accent transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {borrow.borrow_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {borrow.book_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {borrow.member_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {borrow.borrow_date.slice(0, 10)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {borrow.due_date.slice(0, 10)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {borrow.return_date ? borrow.return_date.slice(0, 10) : "-"}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      borrow.status === "borrowed"
                        ? "text-blue-500"
                        : borrow.status === "returned"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {borrow.status.charAt(0).toUpperCase() +
                      borrow.status.slice(1)}
                  </td>
                  {(borrow.status === "borrowed" ||
                    borrow.status === "overdue") && (
                    <td>
                      <button
                        onClick={() => returnBook(borrow.borrow_id)}
                        className="text-xl hover:text-primary transition"
                      >
                        <TbTransferIn />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
