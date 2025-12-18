"use client";

import Spinner from "@/components/atoms/Spinner";
import axios from "axios";
import { ArchiveRestore, Search, Edit, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MdRestore } from "react-icons/md";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    publication_year: "",
    shelf_location: "",
    status: "",
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

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setEditFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      publication_year: book.publication_year.toString(),
      shelf_location: book.shelf_location,
      status: book.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (bookId: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`/api/books/${bookId}`);
      setBooks(books.filter((b) => b.book_id !== bookId));
      setFilteredBooks(filteredBooks.filter((b) => b.book_id !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    try {
      await axios.put(`/api/books/${editingBook.book_id}`, {
        ...editFormData,
        publication_year: parseInt(editFormData.publication_year),
      });
      const updatedBooks = books.map((b) =>
        b.book_id === editingBook.book_id
          ? {
              ...b,
              ...editFormData,
              publication_year: parseInt(editFormData.publication_year),
            }
          : b
      );
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);
      setIsEditDialogOpen(false);
      setEditingBook(null);
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book");
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
                        onClick={() => handleEdit(book)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={16} />
                      </button>
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

          {/* Edit Dialog */}
          {isEditDialogOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Edit Book</h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editFormData.title}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      value={editFormData.author}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          author: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Genre
                    </label>
                    <input
                      type="text"
                      value={editFormData.genre}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          genre: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      ISBN
                    </label>
                    <input
                      type="text"
                      value={editFormData.isbn}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          isbn: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Publication Year
                    </label>
                    <input
                      type="number"
                      value={editFormData.publication_year}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          publication_year: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Shelf Location
                    </label>
                    <input
                      type="text"
                      value={editFormData.shelf_location}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          shelf_location: e.target.value,
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
                      <option value="available">Available</option>
                      <option value="borrowed">Borrowed</option>
                      <option value="lost">Lost</option>
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
