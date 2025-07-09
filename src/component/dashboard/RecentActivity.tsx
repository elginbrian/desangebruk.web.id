const RecentActivity = () => {
  const activities = [
    {
      description: 'Pengumuman baru "Jadwal Vaksinasi" Telah diupload',
      time: "2 Jam yang lalu",
    },
    {
      description: 'Artikel baru "Pembangunan Jalan Desa" telah dipublikasi',
      time: "4 Jam yang lalu",
    },
    {
      description: 'Pengumuman "Festival Desa 2024" telah diperbarui',
      time: "1 Hari yang lalu",
    },
  ];

  return (
    <div className="bg-white app-card shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 sm:gap-0">
        <h3 className="app-text-lg font-semibold text-black">Aktivitas Terbaru</h3>
        <button className="text-[#1B3A6D] text-xs hover:underline self-start sm:self-auto">Lihat Semua</button>
      </div>

      <div className="space-y-0">
        {activities.map((activity, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100 last:border-b-0 gap-1 sm:gap-4">
            <p className="text-black text-xs leading-relaxed flex-1 min-w-0">{activity.description}</p>
            <p className="text-gray-500 text-xs whitespace-nowrap flex-shrink-0 self-start sm:self-center">{activity.time}</p>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">Belum ada aktivitas terbaru</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
