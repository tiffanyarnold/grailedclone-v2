"use client";

import { users } from "@/lib/data";

export default function AdminUsersPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Users</h1>

      <div className="bg-white border border-[#E8E8E8] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E8E8]">
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Name</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Email</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[#F0F0F0] last:border-0 hover:bg-[#FAFAFA]">
                <td className="px-4 py-3 text-xs font-medium">{user.name}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "seller"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
