import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// 创建认证上下文
const AuthContext = createContext();

// 创建认证提供者组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 从localStorage获取存储的用户信息
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        // 设置axios默认headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(JSON.parse(storedUser));
        
        try {
          // 验证token有效性
          const response = await axios.get('/api/auth/me');
          setUser(response.data);
        } catch (error) {
          // token无效，清除本地存储
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // 登录函数
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  // 登出函数
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // 检查用户是否为管理员
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // 提供给子组件的上下文值
  const contextValue = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义hook，方便在组件中使用认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
};

export default AuthContext; 