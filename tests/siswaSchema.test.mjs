import assert from 'node:assert/strict';
import test from 'node:test';

import { siswaSchema } from '../src/schemas/siswaSchema.js';

const valid = {
  kode_siswa: 'SIS-004',
  nama_siswa: 'Dewi Anggraini',
  alamat_siswa: 'Jl. Sudirman No. 5',
  tgl_lahir_siswa: '2005-01-30',
  jurusan_siswa: 'Teknik Informatika',
};

test('schema menerima data siswa yang valid', () => {
  const result = siswaSchema.safeParse(valid);
  assert.equal(result.success, true);
});

test('schema menolak semua field kosong', () => {
  const result = siswaSchema.safeParse({
    kode_siswa: '',
    nama_siswa: '',
    alamat_siswa: '',
    tgl_lahir_siswa: '',
    jurusan_siswa: '',
  });

  assert.equal(result.success, false);
  assert.equal(Object.keys(result.error.flatten().fieldErrors).length, 5);
});

test('schema menolak tanggal 2025-02-30', () => {
  const result = siswaSchema.safeParse({
    ...valid,
    tgl_lahir_siswa: '2025-02-30',
  });
  assert.equal(result.success, false);
});

test('schema menolak kode mengandung spasi', () => {
  const result = siswaSchema.safeParse({ ...valid, kode_siswa: 'SIS 004' });
  assert.equal(result.success, false);
});
