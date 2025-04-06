import axios from 'axios';

// 生产环境下获取当前域名作为API基础URL
const BASE_URL = window.location.origin;
const API_URL = process.env.NODE_ENV === 'production' 
  ? `${BASE_URL}` 
  : (process.env.REACT_APP_API_URL || 'http://localhost:5001');

console.log('API 服务 URL:', API_URL, '环境:', process.env.NODE_ENV);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // 增加超时时间以应对Serverless冷启动延迟
  timeout: 10000
});

// 请求拦截器，为请求添加token
api.interceptors.request.use(
  (config) => {
    // 添加请求日志
    console.log(`发送请求: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config);
    
    // 添加认证token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器，处理401错误
api.interceptors.response.use(
  (response) => {
    console.log('响应成功:', response.config.url, response.status);
    return response;
  },
  (error) => {
    // 请求超时处理
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.error('请求超时:', error.config.url);
      return Promise.reject(new Error('请求超时，请稍后再试'));
    }
    
    // 网络错误处理
    if (error.message === 'Network Error') {
      console.error('网络错误:', error.config?.url);
      return Promise.reject(new Error('网络错误，请检查您的网络连接'));
    }
    
    // 未授权错误处理
    if (error.response && error.response.status === 401) {
      console.error('未授权:', error.config.url);
      // 清除本地存储的认证信息
      localStorage.removeItem('token');
      
      // 可以在这里添加重定向到登录页面的逻辑
      window.location.href = '/login';
    }
    
    // 其他错误处理
    console.error('响应错误:', error.response?.status, error.config?.url, error.message);
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
    console.log('发起获取所有人物请求');
    const response = await api.get('/people');
    console.log('获取人物列表响应:', response.data);
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