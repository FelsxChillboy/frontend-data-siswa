import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error(
    'VITE_API_BASE_URL belum disetel. Salin .env.example menjadi .env di folder frontend.',
  );
}

const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const handleError = (error) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  if (error.request) {
    throw new Error('Tidak dapat menghubungi backend. Pastikan server berjalan.');
  }
  throw error;
};

export const getSiswa = async ({ search = '', page = 1, limit = 10 } = {}) => {
  try {
    const response = await apiClient.get('/siswa', {
      params: { search, page, limit },
    });
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const getSiswaByKode = async (kode) => {
  try {
    const response = await apiClient.get(`/siswa/${encodeURIComponent(kode)}`);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const createSiswa = async (payload) => {
  try {
    const response = await apiClient.post('/siswa', payload);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateSiswa = async (kode, payload) => {
  try {
    const response = await apiClient.put(
      `/siswa/${encodeURIComponent(kode)}`,
      payload,
    );
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteSiswa = async (kode) => {
  try {
    const response = await apiClient.delete(`/siswa/${encodeURIComponent(kode)}`);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};
