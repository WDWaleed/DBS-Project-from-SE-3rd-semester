"use client";

import Spinner from "@/components/atoms/Spinner";
import axios from "axios";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
          </div>

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
        </main>
      )}
    </main>
  );
}
