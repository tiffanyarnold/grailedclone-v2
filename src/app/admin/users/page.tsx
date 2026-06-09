"use client";

import { useProfiles } from "@/lib/use-profiles";

export default function AdminUsersPage() {
  const { profiles } = useProfiles();

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-6">Users</h1>

      <div className="bg-white border border-[#E8E8E8] overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="border-b border-[#E8E8E8]">
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Name</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Email</th>
              <th className="text-left text-[10px] uppercase tracking-wide font-medium text-gray-500 px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} className="border-b border-[#F0F0F0] last:border-0 hover:bg-[#FAFAFA]">
                <td className="px-4 py-3 text-xs font-medium">{profile.name}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{profile.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase ${
                      profile.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : profile.role === "seller"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {profile.role}
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
