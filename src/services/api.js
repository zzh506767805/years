import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : (process.env.REACT_APP_API_URL || 'http://localhost:5001/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器，为请求添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，处理401错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 清除本地存储的认证信息
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // 可以在这里添加重定向到登录页面的逻辑
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 用户认证相关API
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('用户注册失败:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('用户登录失败:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('获取当前用户信息失败:', error);
    throw error;
  }
};

export const fetchAllPeople = async () => {
  try {
    const response = await api.get('/people');
    return response.data;
  } catch (error) {
    console.error('获取人物列表失败:', error);
    throw error;
  }
};

export const searchPeople = async (query) => {
  try {
    const response = await api.get(`/people/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('搜索人物失败:', error);
    throw error;
  }
};

export const importPerson = async (personData) => {
  try {
    const response = await api.post('/people/import', personData);
    return response.data;
  } catch (error) {
    console.error('导入人物数据失败:', error);
    throw error;
  }
};

export const batchImportPeople = async (peopleData) => {
  try {
    const response = await api.post('/people/batch-import', peopleData);
    return response.data;
  } catch (error) {
    console.error('批量导入人物数据失败:', error);
    throw error;
  }
};

export const fetchPersonById = async (id) => {
  try {
    const response = await api.get(`/people/${id}`);
    return response.data;
  } catch (error) {
    console.error(`获取人物(ID: ${id})详情失败:`, error);
    throw error;
  }
};

export const fetchEventsByYear = async (year) => {
  try {
    const response = await api.get(`/events/year/${year}`);
    return response.data;
  } catch (error) {
    console.error(`获取${year}年事件失败:`, error);
    throw error;
  }
};

export const fetchEventsByAge = async (age) => {
  try {
    const response = await api.get(`/events/age/${age}`);
    return response.data;
  } catch (error) {
    console.error(`获取${age}岁事件失败:`, error);
    throw error;
  }
}; 