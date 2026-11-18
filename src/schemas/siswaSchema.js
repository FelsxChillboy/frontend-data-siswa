import { z } from 'zod';

const tanggalSchema = z
  .string()
  .min(1, 'Tanggal lahir wajib diisi')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
  }, 'Tanggal lahir tidak valid');

export const siswaSchema = z.object({
  kode_siswa: z
    .string()
    .trim()
    .min(1, 'Kode siswa wajib diisi')
    .max(50, 'Kode siswa maksimal 50 karakter')
    .regex(
      /^[A-Za-z0-9._-]+$/,
      'Kode hanya boleh huruf, angka, titik, garis bawah, dan tanda hubung',
    ),
  nama_siswa: z.string().trim().min(1, 'Nama siswa wajib diisi').max(150),
  alamat_siswa: z.string().trim().min(1, 'Alamat siswa wajib diisi'),
  tgl_lahir_siswa: tanggalSchema,
  jurusan_siswa: z.string().trim().min(1, 'Jurusan siswa wajib diisi').max(100),
});
