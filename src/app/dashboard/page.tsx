"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/component/common/PageHeader";
import DashboardCard from "@/component/dashboard/DashboardCard";
import RecentActivity from "@/component/dashboard/RecentActivity";
import { useAuth } from "@/contexts/AuthContext";

const DashboardPage = () => {
  const [mounted, setMounted] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Selamat datang di panel admin Desa Ngebruk"
        mounted={mounted}
        actions={
          <div className="text-left sm:text-right sm:min-w-0 sm:flex-shrink-0">
            <p className="text-gray-600 text-xs truncate smooth-transition">Selamat datang, {profile?.name || "Admin"}</p>
            <p className="text-gray-400 text-xs truncate smooth-transition">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        }
      />

      {/* Content */}
      <div className={`app-content smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <DashboardCard title="Total Berita" value="1.245 Berita" percentage="8.5%" change="+96 Bulan ini" isPositive={true} />
          <DashboardCard title="Total Pengumuman" value="87.530 Pengumuman" percentage="15.2%" change="-1.320 Bulan ini" isPositive={false} />
          <DashboardCard title="Total Pengunjung" value="56.742 Pengguna" percentage="10.7%" change="+5.480 Hari ini" isPositive={true} />
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </>
  );
};

export default DashboardPage;
