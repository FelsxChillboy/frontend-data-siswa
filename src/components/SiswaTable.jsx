const formatTanggal = (value) => {
  if (!value) return '-';
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const SkeletonRows = () => (
  <>
    {Array.from({ length: 4 }).map((_, index) => (
      <tr key={index} className="animate-pulse">
        {Array.from({ length: 6 }).map((__, cell) => (
          <td key={cell} className="px-5 py-4">
            <div className="h-4 w-3/4 rounded bg-slate-200" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default function SiswaTable({ items = [], loading = false, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-5 py-3">Kode</th>
            <th className="px-5 py-3">Nama</th>
            <th className="px-5 py-3">Alamat</th>
            <th className="px-5 py-3">Tanggal Lahir</th>
            <th className="px-5 py-3">Jurusan</th>
            <th className="px-5 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            <SkeletonRows />
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-16 text-center">
                <p className="text-base font-medium text-slate-600">
                  Belum ada data siswa
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Tambahkan siswa baru untuk mulai mengisi daftar.
                </p>
              </td>
            </tr>
          ) : (
            items.map((siswa) => (
              <tr key={siswa.kode_siswa} className="transition hover:bg-brand-50/50">
                <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-semibold text-brand-700">
                  {siswa.kode_siswa}
                </td>
                <td className="px-5 py-4 font-medium text-slate-800">
                  {siswa.nama_siswa}
                </td>
                <td className="max-w-xs px-5 py-4 text-slate-500">
                  <span className="line-clamp-2">{siswa.alamat_siswa}</span>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                  {formatTanggal(siswa.tgl_lahir_siswa)}
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                    {siswa.jurusan_siswa}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onEdit(siswa)}
                    className="mr-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-300"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(siswa)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
