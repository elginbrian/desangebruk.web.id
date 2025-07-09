import DashboardCard from "@/component/dashboard/DashboardCard";
import RecentActivity from "@/component/dashboard/RecentActivity";

const DashboardPage = () => {
  return (
    <>
      {/* Header */}
      <header className="bg-white app-header border-b border-gray-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-0">
          <div className="min-w-0">
            <h1 className="app-text-2xl font-bold text-black truncate">Dashboard</h1>
            <p className="text-gray-600 text-xs mt-1 hidden sm:block">Selamat datang di panel admin Desa Ngebruk</p>
          </div>
          <div className="text-left sm:text-right sm:min-w-0 sm:flex-shrink-0">
            <p className="text-gray-600 text-xs truncate">Selamat datang, Rifai</p>
            <p className="text-gray-400 text-xs truncate">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="app-content">
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
