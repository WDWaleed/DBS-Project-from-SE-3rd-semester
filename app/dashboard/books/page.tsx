"use client";

import Spinner from "@/components/atoms/Spinner";
import axios from "axios";
import { ArchiveRestore, Search, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MdRestore } from "react-icons/md";
import toast from "react-hot-toast";

interface Book {
  book_id: number;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  publication_year: number;
  shelf_location: string;
  status: string;
}

export default function Books() {
  const pathname = usePathname();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchFormData, setSearchFormData] = useState({
    query: "",
    category: "title",
  });

  // Fetch books on page load
  useEffect(() => {
    if (pathname !== "/dashboard/books") return;

    async function fetchBooks() {
      try {
        const res = await axios.get<Book[]>("/api/books");
        setBooks(res.data);
        setFilteredBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
      setIsLoading(false);
    }

    fetchBooks();
  }, [pathname]);

  // Real-time filtering
  useEffect(() => {
    if (!searchFormData.query) {
      setFilteredBooks(books);
      return;
    }

    const filtered = books.filter((book) => {
      const field = searchFormData.category as keyof Book;
      const value = book[field];

      if (!value) return false;

      return value
        .toString()
        .toLowerCase()
        .includes(searchFormData.query.toLowerCase());
    });

    setFilteredBooks(filtered);
  }, [searchFormData, books]);

  // Optional form submission search
  const handleSearchForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filtered = books.filter((book) => {
      const field = searchFormData.category as keyof Book;
      const value = book[field];

      if (!value) return false;

      return value
        .toString()
        .toLowerCase()
        .includes(searchFormData.query.toLowerCase());
    });

    setFilteredBooks(filtered);
  };

  const handleDelete = async (bookId: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`/api/books/${bookId}`);
      setBooks(books.filter((b) => b.book_id !== bookId));
      setFilteredBooks(filteredBooks.filter((b) => b.book_id !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error(error.response?.data?.error || "Failed to delete book");
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
                  <option value="book_id">ID</option>
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                  <option value="genre">Genre</option>
                  <option value="isbn">ISBN</option>
                  <option value="publication_year">Publication Year</option>
                  <option value="shelf_location">Shelf</option>
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

            <button
              className="text-2xl text-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
              onClick={() => {
                setFilteredBooks(books);
                setSearchFormData({ ...searchFormData, query: "" });
              }}
            >
              <MdRestore />
            </button>
          </div>

          <p className="text-right mb-2 text-muted-foreground">
            {filteredBooks.length} books
          </p>

          <table className="min-w-full border-border divide-y divide-border">
            <thead className="bg-sidebar">
              <tr>
                {[
                  "ID",
                  "Title",
                  "Author",
                  "Genre",
                  "ISBN",
                  "Publication Year",
                  "Shelf",
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
              {filteredBooks.map((book) => (
                <tr
                  key={book.book_id}
                  className="hover:bg-sidebar-accent transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {book.book_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {book.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {book.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {book.genre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {book.isbn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {book.publication_year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {book.shelf_location}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      book.status === "available"
                        ? "text-green-500"
                        : book.status === "borrowed"
                        ? "text-muted-foreground"
                        : "text-destructive"
                    }`}
                  >
                    {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(book.book_id)}
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
        </main>
      )}
    </main>
  );
}
