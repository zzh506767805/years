import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// 创建认证上下文
const AuthContext = createContext();

// 获取API基础URL
const BASE_URL = window.location.origin;
const API_URL = process.env.NODE_ENV === 'production' 
  ? `${BASE_URL}/api` 
  : (process.env.REACT_APP_API_URL || 'http://localhost:5001/api');

console.log('认证服务API URL:', API_URL, '环境:', process.env.NODE_ENV);

// 认证提供组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    console.log('初始化时localStorage中的token:', savedToken ? '存在' : '不存在');
    return savedToken || null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初始加载时检查本地存储中的令牌
  useEffect(() => {
    const loadUser = async () => {
      console.log('尝试加载用户信息, token状态:', token ? '存在' : '不存在');
      
      if (token) {
        try {
          // 设置全局默认请求头
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log('设置Authorization请求头:', token);
          
          // 获取用户信息
          const url = `${API_URL}/auth/me`;
          console.log('请求用户信息URL:', url);
          
          const response = await axios.get(url);
          console.log('获取用户信息响应:', response.data);
          
          if (response.data && response.data.success) {
            setUser(response.data.user);
            console.log("用户信息加载成功:", response.data.user);
          } else {
            console.log("用户信息加载失败:", response.data?.message || '未知错误');
            // 如果响应不成功，清除令牌
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
          }
        } catch (error) {
          console.error('加载用户信息失败:', error.message, error.response?.data);
          // 清除无效的令牌和状态
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      } else {
        console.log("无token，用户未登录");
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // 登录功能
  const login = async (email, password) => {
    setError(null);
    try {
      console.log('尝试登录:', email);
      const url = `${API_URL}/auth/login`;
      console.log('登录请求URL:', url);
      
      const response = await axios.post(url, {
        email,
        password
      });
      
      console.log('登录响应:', response.data);

      if (response.data && response.data.success) {
        // 保存令牌到本地存储和状态
        const userToken = response.data.token;
        console.log('登录成功，保存token:', userToken);
        
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(response.data.user);
        
        // 设置默认请求头
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        
        return { success: true };
      } else {
        const errorMsg = response.data?.message || '登录失败';
        console.log('登录失败:', errorMsg);
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || '登录过程中出现错误';
      console.error('登录错误:', message);
      setError(message);
      return { success: false, message };
    }
  };

  // 注册功能
  const register = async (email, password) => {
    setError(null);
    try {
      console.log('尝试注册:', email);
      const url = `${API_URL}/auth/register`;
      console.log('注册请求URL:', url);
      
      const response = await axios.post(url, {
        email,
        password
      });
      
      console.log('注册响应:', response.data);

      if (response.data && response.data.success) {
        // 保存令牌到本地存储和状态
        const userToken = response.data.token;
        console.log('注册成功，保存token:', userToken);
        
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(response.data.user);
        
        // 设置默认请求头
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        
        return { success: true };
      } else {
        const errorMsg = response.data?.message || '注册失败';
        console.log('注册失败:', errorMsg);
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || '注册过程中出现错误';
      console.error('注册错误:', message);
      setError(message);
      return { success: false, message };
    }
  };

  // 注销功能
  const logout = () => {
    console.log('执行注销操作');
    
    // 清除本地存储中的令牌
    localStorage.removeItem('token');
    console.log('已清除localStorage中的token');
    
    // 清除状态
    setToken(null);
    setUser(null);
    console.log('已重置token和user状态');
    
    // 清除请求头
    delete axios.defaults.headers.common['Authorization'];
    console.log('已清除Authorization请求头');
    
    // 强制刷新页面，确保状态完全重置
    console.log('重定向到首页');
    window.location.href = '/';
  };

  // 检查用户是否具有特定角色
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  // 检查用户是否已登录
  const isAuthenticated = () => {
    const auth = !!user;
    console.log('检查认证状态:', auth ? '已登录' : '未登录', user);
    return auth;
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