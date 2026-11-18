import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import ConfirmDeleteModal from '../components/ConfirmDeleteModal.jsx';
import SiswaFormModal from '../components/SiswaFormModal.jsx';
import SiswaTable from '../components/SiswaTable.jsx';
import { deleteSiswa, getSiswa } from '../services/siswaService.js';

const emptyList = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
};

export default function SiswaListPage() {
  const [list, setList] = useState(emptyList);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formModal, setFormModal] = useState({ open: false, initialData: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSiswa({ search, page, limit: 10 });
      setList(result);
    } catch (error) {
      toast.error(error.message || 'Gagal memuat data siswa');
      setList(emptyList);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (list.totalPages > 0 && page > list.totalPages) {
      setPage(list.totalPages);
    }
  }, [list.totalPages, page]);

  const handleSaved = () => {
    setFormModal({ open: false, initialData: null });
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await deleteSiswa(deleteTarget.kode_siswa);
      toast.success('Data siswa berhasil dihapus');
      setDeleteTarget(null);
      loadData();
    } catch (error) {
      toast.error(error.message || 'Gagal menghapus data siswa');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-brand-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
              Manajemen Data
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Data Siswa
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Kelola data siswa melalui REST API: tambah, lihat, ubah, dan hapus.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFormModal({ open: true, initialData: null })}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
            Tambah Siswa
          </button>
        </header>

        <section className="mt-8 overflow-hidden rounded-card border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Cari kode, nama, atau jurusan..."
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <span className="inline-flex items-center self-start rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 sm:self-auto">
              {list.total} siswa ditemukan
            </span>
          </div>

          <SiswaTable
            items={list.items}
            loading={loading}
            onEdit={(siswa) => setFormModal({ open: true, initialData: siswa })}
            onDelete={(siswa) => setDeleteTarget(siswa)}
          />

          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Halaman {list.page} dari {Math.max(list.totalPages, 1)} •{' '}
              {list.items.length} ditampilkan
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={loading || list.page <= 1}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={loading || list.page >= list.totalPages}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </section>
      </div>

      <SiswaFormModal
        open={formModal.open}
        initialData={formModal.initialData}
        onClose={() => setFormModal({ open: false, initialData: null })}
        onSaved={handleSaved}
      />

      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        siswa={deleteTarget}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
