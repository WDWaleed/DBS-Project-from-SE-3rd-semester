"use client";

import React from "react";

interface User {
  member_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  membership_date: string;
  status: string;
}

const dummyUsers: User[] = [
  {
    member_id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    address: "123 Main St, City",
    membership_date: "2025-01-15",
    status: "Active",
  },
  {
    member_id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    phone: "+1987654321",
    address: "456 Elm St, Town",
    membership_date: "2024-11-20",
    status: "Inactive",
  },
  {
    member_id: 3,
    first_name: "Alice",
    last_name: "Johnson",
    email: "alice.johnson@example.com",
    phone: "+1122334455",
    address: "789 Oak St, Village",
    membership_date: "2025-03-01",
    status: "Active",
  },
  {
    member_id: 4,
    first_name: "Bob",
    last_name: "Williams",
    email: "bob.williams@example.com",
    phone: "+1222333444",
    address: "321 Pine St, City",
    membership_date: "2024-12-05",
    status: "Suspended",
  },
  {
    member_id: 5,
    first_name: "Eve",
    last_name: "Brown",
    email: "eve.brown@example.com",
    phone: "+1555666777",
    address: "654 Maple St, Town",
    membership_date: "2025-02-10",
    status: "Active",
  },
];

export default function UsersTable() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Members</h2>
      <div className="overflow-x-auto border rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Membership Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dummyUsers.map((user) => (
              <tr
                key={user.member_id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.member_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.first_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.membership_date}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                    user.status === "Active"
                      ? "text-green-600"
                      : user.status === "Inactive"
                      ? "text-gray-400"
                      : "text-red-600"
                  }`}
                >
                  {user.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
