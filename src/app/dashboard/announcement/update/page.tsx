const UpdateAnnouncementPage = () => {
  return (
    <>
      {/* Header */}
      <header className="bg-white app-header border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="app-text-2xl font-bold text-black">Edit Pengumuman</h1>
            <p className="text-gray-600 text-xs mt-1">Edit pengumuman yang sudah ada</p>
          </div>
          <div className="space-x-2">
            <button className="border border-gray-300 text-gray-600 app-button hover:bg-gray-50 transition-colors">Batal</button>
            <button className="bg-[#1B3A6D] text-white app-button hover:bg-[#152f5a] transition-colors">Update</button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="app-content">
        <div className="bg-white app-card shadow-sm border border-gray-100">
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-black mb-2">Judul Pengumuman</label>
              <input
                type="text"
                defaultValue="Jadwal Vaksinasi COVID-19"
                className="form-input app-form-input w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                placeholder="Masukkan judul pengumuman..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-2">Isi Pengumuman</label>
              <textarea
                rows={6}
                defaultValue="Vaksinasi COVID-19 gelombang ketiga akan dilaksanakan di balai desa..."
                className="form-input app-form-input w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                placeholder="Tulis isi pengumuman di sini..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-black mb-2">Tanggal Mulai</label>
                <input type="date" defaultValue="2025-01-15" className="form-input app-form-input w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-2">Tanggal Berakhir</label>
                <input type="date" defaultValue="2025-01-20" className="form-input app-form-input w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-2">Tingkat Prioritas</label>
              <select defaultValue="penting" className="form-input app-form-input app-select w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent">
                <option value="normal">Normal</option>
                <option value="penting">Penting</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateAnnouncementPage;
