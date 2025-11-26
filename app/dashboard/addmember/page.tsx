"use client";
import { getErrorMessage } from "@/lib/utils/helpers";
import axios from "axios";
import { CloudCog } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

export default function AddMember() {
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "active",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/members", formData);
      if (res.data.success) {
        toast.success("Member added");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.log(error);
    }
  };
  return (
    <main className="min-h-screen flex justify-center items-center">
      <div className=" w-full max-w-md m-1 p-2 md:m-2 md:p-4 rounded bg-muted">
        <h1 className="text-foreground text-2xl  my-4 mt-2 md:my-6 md:mt-3  font-bold text-center">
          Add Member
        </h1>
        <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Name"
            maxLength={255}
            className=" bg-input border-border border p-2 rounded-sm"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            placeholder="Email"
            maxLength={150}
            className=" bg-input border-border border p-2 rounded-sm"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
            placeholder="Phone No."
            maxLength={20}
            className=" bg-input border-border border p-2 rounded-sm"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
            placeholder="Address"
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Active</option>
          </select>
          <button className="bg-primary text-primary-foreground p-2 rounded-sm hover:bg-primary/80 transition">
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
