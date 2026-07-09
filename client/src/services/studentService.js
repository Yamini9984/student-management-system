import axios from 'axios';

const studentApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/students`,
});

studentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default studentApi;

export const createStudent = async (studentData) => {
  const response = await studentApi.post('/', studentData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getAllStudents = async () => {
  const response = await studentApi.get('/');
  return response.data.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await studentApi.put(`/${id}`, studentData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await studentApi.delete(`/${id}`);
  return response.data;
};
