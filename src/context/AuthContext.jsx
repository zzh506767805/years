import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// 创建认证上下文
const AuthContext = createContext();

// API基础URL
const BASE_URL = window.location.origin;
const API_URL = process.env.NODE_ENV === 'production' 
  ? `${BASE_URL}` 
  : (process.env.REACT_APP_API_URL || 'http://localhost:5001');

console.log('认证服务API URL:', API_URL);

// 认证提供组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初始加载时检查本地存储中的令牌
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // 设置全局默认请求头
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // 获取用户信息
          const response = await axios.get(`${API_URL}/api/auth/me`);
          
          if (response.data.success) {
            setUser(response.data.user);
            console.log("用户信息加载成功:", response.data.user);
          } else {
            console.log("用户信息加载失败:", response.data.message);
            // 如果响应不成功，清除令牌
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
          }
        } catch (error) {
          console.error('加载用户信息失败:', error);
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      } else {
        console.log("无token，未登录状态");
      }
      setLoading(false);
    };

    loadUser();
  }, [token, API_URL]);

  // 登录功能
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        // 保存令牌到本地存储和状态
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        
        // 设置默认请求头
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        return { success: true };
      } else {
        setError(response.data.message || '登录失败');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || '登录过程中出现错误';
      setError(message);
      return { success: false, message };
    }
  };

  // 注册功能
  const register = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password
      });

      if (response.data.success) {
        // 保存令牌到本地存储和状态
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        
        // 设置默认请求头
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        return { success: true };
      } else {
        setError(response.data.message || '注册失败');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || '注册过程中出现错误';
      setError(message);
      return { success: false, message };
    }
  };

  // 注销功能
  const logout = () => {
    // 清除本地存储中的令牌
    localStorage.removeItem('token');
    
    // 清除状态
    setToken(null);
    setUser(null);
    
    // 清除请求头
    delete axios.defaults.headers.common['Authorization'];
    
    // 强制刷新页面，确保状态完全重置
    window.location.href = '/';
  };

  // 检查用户是否具有特定角色
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  // 检查用户是否已登录
  const isAuthenticated = () => {
    return !!user;
  };

  // 清除错误
  const clearError = () => {
    setError(null);
  };

  // 导出上下文值
  const contextValue = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    hasRole,
    isAuthenticated,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义钩子，用于访问认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  return context;
};

export default AuthContext; 