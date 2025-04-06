import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// 创建认证上下文
export const AuthContext = createContext();

// API基础URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://years-web.vercel.app';

// 认证上下文提供者组件
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 检查并加载本地存储的用户信息
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const config = {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          };
          
          const response = await axios.get(`${API_BASE_URL}/api/auth/me`, config);
          
          if (response.data.success) {
            setCurrentUser(response.data.user);
          } else {
            // 令牌无效，清除本地存储
            localStorage.removeItem('token');
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('验证用户失败:', error);
          // 清除本地存储的令牌
          localStorage.removeItem('token');
          setCurrentUser(null);
        }
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);

  // 注册新用户
  const register = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        email,
        password
      });
      
      if (response.data.success) {
        // 保存令牌到本地存储
        localStorage.setItem('token', response.data.token);
        // 设置当前用户
        setCurrentUser(response.data.user);
        return { success: true };
      } else {
        setError(response.data.message || '注册失败');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || '注册过程中发生错误';
      setError(message);
      return { success: false, message };
    }
  };

  // 用户登录
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });
      
      if (response.data.success) {
        // 保存令牌到本地存储
        localStorage.setItem('token', response.data.token);
        // 设置当前用户
        setCurrentUser(response.data.user);
        return { success: true };
      } else {
        setError(response.data.message || '登录失败');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || '登录过程中发生错误';
      setError(message);
      return { success: false, message };
    }
  };

  // 退出登录
  const logout = () => {
    // 清除本地存储的令牌
    localStorage.removeItem('token');
    // 清除当前用户
    setCurrentUser(null);
  };

  // 上下文值
  const contextValue = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义钩子，便于使用认证上下文
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
}; 