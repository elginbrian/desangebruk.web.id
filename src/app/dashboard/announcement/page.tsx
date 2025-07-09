"use client";

import { FiSearch, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import Link from "next/link";

const AnnouncementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Sample data - replace with actual data from your backend
  const announcements = [
    {
      id: 1,
      title: "Village Festival 2024 Announcement",
      dateCreated: "Jan 15, 2024",
      status: "Lorem Ipsum",
    },
    {
      id: 2,
      title: "Village Festival 2024 Announcement",
      dateCreated: "Jan 15, 2024",
      status: "Lorem Ipsum",
    },
    {
      id: 3,
      title: "Village Festival 2024 Announcement",
      dateCreated: "Jan 15, 2024",
      status: "Lorem Ipsum",
    },
  ];

  const filteredAnnouncements = announcements.filter((announcement) => announcement.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      {/* Header */}
      <header className={`bg-white app-header border-b border-gray-200 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div className="min-w-0">
            <h1 className="app-text-2xl font-bold text-black smooth-transition">Kelola Pengumuman</h1>
            <p className="text-gray-600 text-xs mt-1 smooth-transition">Kelola dan atur pengumuman desa</p>
          </div>
          <Link href="/dashboard/announcement/create">
            <button className="bg-[#1B3A6D] text-white app-button hover:bg-[#152f5a] smooth-transition hover-lift flex items-center gap-2 whitespace-nowrap">
              <FiPlus size={14} />
              Tambah Pengumuman
            </button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className={`app-content smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="bg-white app-card shadow-sm border border-gray-100 hover-lift smooth-transition">
          {/* Search and Filter Bar */}
          <div className="pb-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="app-text-lg font-semibold text-black smooth-transition">Pengumuman</h3>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <FiSearch className="absolute search-icon top-1/2 transform -translate-y-1/2 text-gray-500 smooth-transition" size={14} />
                  <input
                    type="text"
                    placeholder="Cari pengumuman..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input app-form-input search-input w-full sm:w-48 pr-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent smooth-transition"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-input app-form-input app-select border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent bg-white smooth-transition"
                >
                  <option>All Status</option>
                  <option>Lorem Ipsum</option>
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="app-table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="app-table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date Created</th>
                  <th className="app-table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="app-table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAnnouncements.map((announcement, index) => (
                  <tr key={announcement.id} className="hover:bg-gray-50 smooth-transition">
                    <td className="app-table-cell text-xs font-medium text-black">
                      <div className="max-w-xs truncate">{announcement.title}</div>
                      <div className="sm:hidden text-gray-500 text-xs mt-1">{announcement.dateCreated}</div>
                    </td>
                    <td className="app-table-cell whitespace-nowrap text-xs text-gray-600 hidden sm:table-cell">{announcement.dateCreated}</td>
                    <td className="app-table-cell whitespace-nowrap hidden sm:table-cell">
                      <span className="app-button-small bg-orange-100 text-orange-800 font-medium smooth-transition hover:bg-orange-200">{announcement.status}</span>
                    </td>
                    <td className="app-table-cell whitespace-nowrap text-xs text-gray-600">
                      <div className="flex gap-1">
                        <Link href={`/dashboard/announcement/update?id=${announcement.id}`}>
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded smooth-transition hover-lift">
                            <FiEdit size={14} />
                          </button>
                        </Link>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded smooth-transition hover-lift">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnnouncementPage;
