"use client";
import { getErrorMessage } from "@/lib/utils/helpers";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface AuthorData {
  name: string;
  bio: string;
}

export default function AddAuthor() {
  const [formData, setFormData] = useState<AuthorData>({
    name: "",
    bio: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Author name is required");
      return;
    }

    try {
      const res = await axios.post("/api/authors", formData);
      if (res.data.success) {
        toast.success("Author added");
        setFormData({ name: "", bio: "" });
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
          Add Author
        </h1>
        <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Author Name"
            maxLength={255}
            className=" bg-input border-border border p-2 rounded-sm"
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Biography (optional)"
            rows={4}
            className=" bg-input border-border border p-2 rounded-sm resize-none"
          />
          <button className="bg-primary text-primary-foreground p-2 rounded-sm hover:bg-primary/80 transition">
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
