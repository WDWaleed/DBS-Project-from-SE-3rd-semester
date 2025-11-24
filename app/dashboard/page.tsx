"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { getToken } from "@/lib/utils/auth";
import { redirect } from "next/navigation";

interface Book {
  book_id: number;
  title: string;
  author: string;
  genre: string;
}

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
  });

  // Fetch all books on mount
  useEffect(() => {
    const user = getToken();
    if (!user) {
      redirect("/auth");
    } else {
      const fetchBooks = async () => {
        try {
          const res = await axios.get("/api/books");
          setBooks(res.data);
        } catch (err) {
          console.error("Error fetching books:", err);
        }
      };
      fetchBooks();
    }
  }, []);

  // Add a new book
  const addBook = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("/api/books", form);
      setForm({ title: "", author: "", genre: "" });

      const updated = await axios.get("/api/books");
      setBooks(updated.data);
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl text-center font-bold mb-4">
        Library Management System
      </h1>

      <form onSubmit={addBook} className="mb-6 space-y-2">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="genre"
          placeholder="Genre"
          value={form.genre}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Book
        </button>
      </form>

      <ul className="space-y-2">
        {books.map((b) => (
          <li key={b.book_id} className="border p-2 rounded">
            <strong>{b.title}</strong> — {b.author} ({b.genre})
          </li>
        ))}
      </ul>
    </div>
  );
}
