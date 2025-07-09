import DashboardCard from "@/component/dashboard/DashboardCard";
import RecentActivity from "@/component/dashboard/RecentActivity";

const DashboardPage = () => {
  return (
    <>
      {/* Header */}
      <header className="bg-white app-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="app-text-2xl font-bold text-black">Dashboard</h1>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Selamat datang, Rifai</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="app-content">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
