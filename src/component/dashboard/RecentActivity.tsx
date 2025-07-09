const RecentActivity = () => {
  const activities = [
    {
      description: 'Pengumuman baru "Jadwal Vaksinasi" Telah diupload',
      time: "2 Jam yang lalu",
    },
    {
      description: 'Pengumuman baru "Jadwal Vaksinasi" Telah diupload',
      time: "2 Jam yang lalu",
    },
    {
      description: 'Pengumuman baru "Jadwal Vaksinasi" Telah diupload',
      time: "2 Jam yang lalu",
    },
  ];

  return (
    <div className="bg-white app-card shadow-sm border border-gray-100">
      <h3 className="app-text-lg font-semibold text-black mb-3">Aktivitas Terbaru</h3>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <p className="text-black text-xs">{activity.description}</p>
            <p className="text-gray-500 text-xs">{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
