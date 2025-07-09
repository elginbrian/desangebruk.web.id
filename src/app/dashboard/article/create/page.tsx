const CreateArticlePage = () => {
  return (
    <>
      {/* Header */}
      <header className="bg-white app-header border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="app-text-2xl font-bold text-black">Tambah Berita</h1>
            <p className="text-gray-600 text-xs mt-1">Buat artikel berita baru untuk desa</p>
          </div>
          <div className="space-x-2">
            <button className="border border-gray-300 text-gray-600 app-button hover:bg-gray-50 transition-colors">Batal</button>
            <button className="bg-[#1B3A6D] text-white app-button hover:bg-[#152f5a] transition-colors">Simpan</button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="app-content">
        <div className="bg-white app-card shadow-sm border border-gray-100">
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-black mb-2">Judul Berita</label>
              <input type="text" className="form-input app-form-input w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent" placeholder="Masukkan judul berita..." />
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-2">Konten Berita</label>
              <textarea rows={8} className="form-input app-form-input w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent" placeholder="Tulis konten berita di sini..." />
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-2">Gambar</label>
              <div className="border-2 border-dashed border-gray-300 app-border-radius p-4 text-center">
                <p className="text-gray-600 text-xs">Drag & drop gambar atau klik untuk upload</p>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateArticlePage;
