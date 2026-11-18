import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { siswaSchema } from '../schemas/siswaSchema.js';
import { createSiswa, updateSiswa } from '../services/siswaService.js';

const emptyValues = {
  kode_siswa: '',
  nama_siswa: '',
  alamat_siswa: '',
  tgl_lahir_siswa: '',
  jurusan_siswa: '',
};

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 read-only:bg-slate-100 read-only:text-slate-500';

const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-xs text-rose-600">{message}</p> : null;

export default function SiswaFormModal({ open, initialData, onClose, onSaved }) {
  const isEditing = Boolean(initialData?.kode_siswa);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(siswaSchema), defaultValues: emptyValues });

  useEffect(() => {
    if (!open) return;
    reset(
      isEditing
        ? {
            kode_siswa: initialData.kode_siswa ?? '',
            nama_siswa: initialData.nama_siswa ?? '',
            alamat_siswa: initialData.alamat_siswa ?? '',
            tgl_lahir_siswa: String(initialData.tgl_lahir_siswa ?? '').slice(0, 10),
            jurusan_siswa: initialData.jurusan_siswa ?? '',
          }
        : emptyValues,
    );
  }, [open, initialData, isEditing, reset]);

  if (!open) return null;

  const onSubmit = async (values) => {
    try {
      if (isEditing) {
        await updateSiswa(initialData.kode_siswa, values);
        toast.success('Data siswa berhasil diperbarui');
      } else {
        await createSiswa(values);
        toast.success('Data siswa berhasil ditambahkan');
      }
      onSaved();
    } catch (error) {
      toast.error(error.message || 'Gagal menyimpan data siswa');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="siswa-form-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-card bg-white p-6 shadow-xl"
      >
        <h2 id="siswa-form-title" className="text-xl font-bold text-slate-900">
          {isEditing ? 'Edit Data Siswa' : 'Tambah Data Siswa'}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {isEditing
            ? 'Ubah informasi siswa lalu simpan perubahan.'
            : 'Isi seluruh field berikut untuk menambahkan siswa baru.'}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="kode_siswa" className="text-sm font-medium text-slate-700">
              Kode Siswa
            </label>
            <input
              id="kode_siswa"
              {...register('kode_siswa')}
              readOnly={isEditing}
              placeholder="Contoh: SIS-004"
              className={inputClass}
            />
            <FieldError message={errors.kode_siswa?.message} />
          </div>

          <div>
            <label htmlFor="nama_siswa" className="text-sm font-medium text-slate-700">
              Nama Siswa
            </label>
            <input
              id="nama_siswa"
              {...register('nama_siswa')}
              placeholder="Nama lengkap siswa"
              className={inputClass}
            />
            <FieldError message={errors.nama_siswa?.message} />
          </div>

          <div>
            <label htmlFor="alamat_siswa" className="text-sm font-medium text-slate-700">
              Alamat Siswa
            </label>
            <textarea
              id="alamat_siswa"
              rows={3}
              {...register('alamat_siswa')}
              placeholder="Alamat lengkap siswa"
              className={inputClass}
            />
            <FieldError message={errors.alamat_siswa?.message} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="tgl_lahir_siswa"
                className="text-sm font-medium text-slate-700"
              >
                Tanggal Lahir
              </label>
              <input
                id="tgl_lahir_siswa"
                type="date"
                {...register('tgl_lahir_siswa')}
                className={inputClass}
              />
              <FieldError message={errors.tgl_lahir_siswa?.message} />
            </div>

            <div>
              <label
                htmlFor="jurusan_siswa"
                className="text-sm font-medium text-slate-700"
              >
                Jurusan
              </label>
              <input
                id="jurusan_siswa"
                {...register('jurusan_siswa')}
                placeholder="Contoh: Teknik Informatika"
                className={inputClass}
              />
              <FieldError message={errors.jurusan_siswa?.message} />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Menyimpan...'
                : isEditing
                  ? 'Simpan Perubahan'
                  : 'Tambah Siswa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
