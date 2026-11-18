import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { apiClient, getSiswa } from '../src/services/siswaService.js';

const originalBaseURL = apiClient.defaults.baseURL;
const originalAdapter = apiClient.defaults.adapter;

afterEach(() => {
  apiClient.defaults.baseURL = originalBaseURL;
  apiClient.defaults.adapter = originalAdapter;
});

const stubAdapter = (data, status = 200) => async (config) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config,
});

test('getSiswa mengembalikan data.items dari envelope backend', async () => {
  apiClient.defaults.baseURL = 'http://test.local/api';
  apiClient.defaults.adapter = stubAdapter({
    success: true,
    message: 'ok',
    data: {
      items: [{ kode_siswa: 'SIS-001' }],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  });

  const result = await getSiswa({ page: 1 });

  assert.equal(result.items[0].kode_siswa, 'SIS-001');
});

test('getSiswa menolak respons bertubuh HTML', async () => {
  apiClient.defaults.baseURL = 'http://test.local/api';
  apiClient.defaults.adapter = stubAdapter('<!doctype html><html></html>');

  await assert.rejects(() => getSiswa(), /Respons backend tidak sesuai/);
});

test('getSiswa menolak respons dengan data null', async () => {
  apiClient.defaults.baseURL = 'http://test.local/api';
  apiClient.defaults.adapter = stubAdapter({ success: true, data: null });

  await assert.rejects(() => getSiswa(), /Respons backend tidak sesuai/);
});

test('getSiswa memberi pesan status saat response error tanpa JSON message', async () => {
  apiClient.defaults.baseURL = 'http://test.local/api';
  apiClient.defaults.adapter = async (config) => {
    const error = new Error('Request failed');
    error.config = config;
    error.response = { status: 502, data: '<html>bad gateway</html>' };
    throw error;
  };

  await assert.rejects(() => getSiswa(), /Backend merespons 502/);
});

test('getSiswa gagal dengan pesan jelas saat VITE_API_BASE_URL kosong', async () => {
  apiClient.defaults.baseURL = '';

  await assert.rejects(() => getSiswa(), /VITE_API_BASE_URL/);
});
