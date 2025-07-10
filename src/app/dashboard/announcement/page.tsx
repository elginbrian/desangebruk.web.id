"use client";

import { FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import SearchAndFilterBar from "@/component/common/SearchAndFilterBar";
import DataTable from "@/component/common/DataTable";

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

  const columns = [
    {
      key: "title",
      label: "Title",
      className: "text-xs font-medium text-black",
      render: (value: string, item: any) => (
        <div>
          <div className="max-w-xs truncate">{value}</div>
          <div className="sm:hidden text-gray-500 text-xs mt-1">{item.dateCreated}</div>
        </div>
      ),
    },
    {
      key: "dateCreated",
      label: "Date Created",
      className: "whitespace-nowrap text-xs text-gray-600 hidden sm:table-cell",
    },
    {
      key: "status",
      label: "Status",
      className: "whitespace-nowrap hidden sm:table-cell",
      render: (value: string) => <span className="app-button-small bg-orange-100 text-orange-800 font-medium smooth-transition hover:bg-orange-200">{value}</span>,
    },
  ];

  const handleDelete = (id: string | number) => {
    console.log("Delete announcement:", id);
    // Handle delete logic here
  };

  const headerActions = (
    <Link href="/dashboard/announcement/create">
      <ActionButton variant="primary" className="flex items-center gap-2 whitespace-nowrap smooth-transition hover-lift">
        <FiPlus size={14} />
        Tambah Pengumuman
      </ActionButton>
    </Link>
  );

  return (
    <>
      <PageHeader title="Kelola Pengumuman" subtitle="Kelola dan atur pengumuman desa" actions={headerActions} mounted={mounted} />

      {/* Content */}
      <div className={`app-content smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="bg-white app-card shadow-sm border border-gray-100 hover-lift smooth-transition">
          <SearchAndFilterBar title="Pengumuman" searchTerm={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Cari pengumuman..." statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} mounted={mounted} />

          <DataTable columns={columns} data={filteredAnnouncements} editRoute="/dashboard/announcement/update" onDelete={handleDelete} mounted={mounted} />
        </div>
      </div>
    </>
  );
};

export default AnnouncementPage;
