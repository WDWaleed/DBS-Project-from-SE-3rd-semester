"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import axios from "axios";
import { getToken, setToken } from "@/lib/utils/auth";
import { redirect } from "next/navigation";

interface Librarian {
  librarian_id: number;
  username: string;
  password: string;
  name: string;
  email: string;
}

export default function AuthPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!credentials.username || !credentials.password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/", credentials, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.length > 0) {
        const user = res.data[0];
        setToken(user, 30);

        console.log("User ID:", user.librarian_id);
        console.log("Username:", user.username);
        console.log("Email:", user.email);
        redirect("/dashboard");
      } else {
        console.log("No user found");
      }
    } catch (err: any) {
      console.error("Librarian error:", err);
      setError(err.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = getToken();
    if (user) redirect("/dashboard");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-white">Login</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded text-white font-semibold transition-colors ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
