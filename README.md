# Frontend Data Siswa

Aplikasi React 19 untuk menampilkan dan mengelola **Data Siswa** melalui REST API dari repository `backend-data-siswa`.

## Teknologi

| Komponen | Versi |
| --- | --- |
| Vite | 8.x |
| React / React DOM | 19.x |
| React Router | 7.x |
| Tailwind CSS | 4.x (CSS-first `@theme`, tanpa `tailwind.config.js`) |
| Axios | 1.x |
| React Hook Form + Zod | 7.x / 4.x |
| react-hot-toast | 2.x |

## Prasyarat

- Node.js 24 LTS terbaru.
- Backend sudah berjalan di `http://localhost:5000` dan database `db_siswa` sudah dibuat (lihat README backend).

## Instalasi dan Menjalankan

```bash
cd frontend
npm install
cp .env.example .env      # Windows: salin file dan ubah namanya menjadi .env
npm run dev
```

Buka `http://localhost:5173`.

Isi `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> Base URL API **tidak di-hardcode** di source; semua pemanggilan melewati `src/services/siswaService.js` yang membaca `VITE_API_BASE_URL`.

Perintah lain:

```bash
npm test           # test schema validasi (node:test)
npm run build      # build produksi ke dist/
npm run preview    # pratinjau hasil build
```

## Fitur

- Tabel Data Siswa: Kode, Nama, Alamat, Tanggal Lahir, Jurusan.
- Pencarian (debounce 300 ms) pada kode, nama, dan jurusan + pagination.
- Modal tambah siswa dengan validasi semua field wajib dan format tanggal `YYYY-MM-DD`.
- Modal edit ter-prefill; `kode_siswa` bersifat read-only.
- Modal konfirmasi sebelum menghapus.
- Toast sukses/gagal untuk create, update, dan delete.
- Loading state saat fetch dan tombol submit disabled saat request berjalan.
- Tampilan responsif dengan kartu, shadow halus, dan palet konsisten dari `@theme`.

## Struktur Folder

```
frontend/
├── src/
│   ├── components/
│   │   ├── SiswaTable.jsx           # tabel + skeleton + empty state
│   │   ├── SiswaFormModal.jsx       # form tambah/edit (RHF + Zod)
│   │   └── ConfirmDeleteModal.jsx   # konfirmasi hapus
│   ├── pages/SiswaListPage.jsx      # state list, search, pagination, modal
│   ├── services/siswaService.js     # axios instance + pemanggilan API
│   ├── schemas/siswaSchema.js       # schema Zod terpusat
│   ├── App.jsx                      # routing
│   ├── main.jsx                     # BrowserRouter + Toaster
│   └── index.css                    # @import tailwindcss + @theme
├── .env.example
└── package.json
```

## Alur Kerja CRUD

1. `SiswaListPage` memanggil `getSiswa()` saat mount, saat keyword berubah, dan saat halaman berubah.
2. Tombol **Tambah Siswa** membuka `SiswaFormModal` dengan form kosong; tombol **Edit** membuka modal dengan data ter-prefill.
3. Submit form memanggil `createSiswa()` atau `updateSiswa()` di `siswaService`, lalu memunculkan toast dan memuat ulang daftar.
4. Tombol **Hapus** membuka `ConfirmDeleteModal`; setelah dikonfirmasi, `deleteSiswa()` dipanggil lalu daftar dimuat ulang.
5. Setiap error dari backend dinormalisasi di `siswaService` menjadi pesan toast yang mudah dibaca.

## Kontrak Data

Backend mengembalikan list dalam bentuk:

```json
{
  "success": true,
  "message": "Data siswa berhasil diambil",
  "data": {
    "items": [],
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

`getSiswa()` langsung mengembalikan objek `data` tersebut, sehingga komponen tidak perlu mengetahui bentuk envelope respons backend.
