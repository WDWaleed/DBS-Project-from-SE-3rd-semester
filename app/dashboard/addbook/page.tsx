"use client";
import { getErrorMessage } from "@/lib/utils/helpers";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Author {
  author_id: number;
  name: string;
}

interface BookData {
  title: string;
  author_id: number;
  genre: string;
  isbn: string;
  publication_year: string;
  shelf_location: string;
  status: string;
}

export default function AddBook() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [formData, setFormData] = useState<BookData>({
    title: "",
    author_id: 0,
    genre: "",
    isbn: "",
    publication_year: "2025",
    shelf_location: "",
    status: "available",
  });

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await axios.get<Author[]>("/api/authors");
        setAuthors(res.data);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };
    fetchAuthors();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const year = Number(formData.publication_year);
    if (isNaN(year) || year < 0) {
      toast.error("Please enter a valid publication year");
      return;
    }

    const modifiedFormData = {
      ...formData,
      publication_year: year,
    };

    try {
      const res = await axios.post("/api/books", modifiedFormData);
      if (res.data.success) {
        toast.success("Book added");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.log(error);
    }
  };

  return (
    <main className="min-h-screen flex justify-center items-center">
      <div className=" w-full max-w-md m-1 p-2 md:m-2 md:p-4 rounded bg-muted">
        <h1 className="text-foreground text-2xl my-4 mt-2 md:my-6 md:mt-3   font-bold text-center">
          Add Book
        </h1>
        <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            placeholder="Title"
            maxLength={255}
            className=" bg-input border-border border p-2 rounded-sm"
          />
          <select
            name="author_id"
            value={formData.author_id}
            onChange={(e) =>
              setFormData({ ...formData, author_id: Number(e.target.value) })
            }
            required
            className=" bg-input border-border border p-2 rounded-sm"
          >
            <option value="">Select Author</option>
            {authors.map((author) => (
              <option key={author.author_id} value={author.author_id}>
                {author.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="genre"
            maxLength={100}
            value={formData.genre}
            onChange={(e) =>
              setFormData({ ...formData, genre: e.target.value })
            }
            required
            placeholder="Genre"
            className=" bg-input border-border border p-2 rounded-sm"
          />
          <input
            type="text"
            name="isbn"
            maxLength={20}
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            required
            placeholder="ISBN"
            className=" bg-input border-border border p-2 rounded-sm"
          />
          <div className="bg-input relative flex items-center">
            <input
              type="number"
              value={formData.publication_year}
              onChange={(e) =>
                setFormData({ ...formData, publication_year: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
            <div className="flex flex-col absolute right-1">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    publication_year: String(
                      Number(formData.publication_year) + 1
                    ),
                  })
                }
                className="text-xs px-1 hover:bg-input/80 transition rounded"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    publication_year: String(
                      Number(formData.publication_year) - 1
                    ),
                  })
                }
                className="text-xs px-1 hover:bg-input/80 transition rounded"
              >
                ▼
              </button>
            </div>
          </div>

          <input
            type="text"
            name="shelf_location"
            maxLength={50}
            value={formData.shelf_location}
            onChange={(e) =>
              setFormData({ ...formData, shelf_location: e.target.value })
            }
            required
            placeholder="Shelf Location"
            className=" bg-input border-border border p-2 rounded-sm"
          />

          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            required
            className="border border-border p-2 rounded-sm  text-gray-400 bg-input"
          >
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
            <option value="lost">Lost</option>
          </select>
          <button className="bg-primary text-primary-foreground p-2 rounded-sm hover:bg-primary/80 transition">
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
