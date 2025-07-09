"use client";

import { FiSearch, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { useState } from "react";
import Link from "next/link";

const ArticlePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Sample data - replace with actual data from your backend
  const articles = [
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

  const filteredArticles = articles.filter((article) => article.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      {/* Header */}
      <header className="bg-white app-header border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="app-text-2xl font-bold text-black">Kelola Berita</h1>
            <p className="text-gray-600 text-xs mt-1">Kelola dan atur berita desa</p>
          </div>
          <Link href="/dashboard/article/create">
            <button className="bg-[#1B3A6D] text-white app-button hover:bg-[#152f5a] transition-colors flex items-center gap-2">
              <FiPlus size={14} />
              Tambah Berita
            </button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="app-content">
        <div className="bg-white app-card shadow-sm border border-gray-100">
          {/* Search and Filter Bar */}
          <div className="pb-4 border-b border-gray-100">
            <div className="flex justify-between items-center gap-4">
              <h3 className="app-text-lg font-semibold text-black">Berita</h3>
              <div className="flex gap-3">
                <div className="relative">
                  <FiSearch className="absolute search-icon top-1/2 transform -translate-y-1/2 text-gray-500" size={14} />
                  <input
                    type="text"
                    placeholder="Cari"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input app-form-input search-input w-48 pr-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-input app-form-input app-select border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent bg-white"
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
                  <th className="app-table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
                  <th className="app-table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="app-table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="app-table-cell whitespace-nowrap text-xs font-medium text-black">{article.title}</td>
                    <td className="app-table-cell whitespace-nowrap text-xs text-gray-600">{article.dateCreated}</td>
                    <td className="app-table-cell whitespace-nowrap">
                      <span className="app-button-small bg-orange-100 text-orange-800 font-medium">{article.status}</span>
                    </td>
                    <td className="app-table-cell whitespace-nowrap text-xs text-gray-600">
                      <div className="flex gap-1">
                        <Link href={`/dashboard/article/update?id=${article.id}`}>
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            <FiEdit size={14} />
                          </button>
                        </Link>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
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

export default ArticlePage;
