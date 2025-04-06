import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AuthPages.css';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 验证表单
      if (!formData.email || !formData.password) {
        setMessage({ type: 'error', text: '请填写所有字段' });
        setLoading(false);
        return;
      }

      // 发送登录请求
      const response = await loginUser(formData);
      
      // 使用auth上下文的login函数保存用户信息
      login(response.user, response.token);
      
      setMessage({ type: 'success', text: '登录成功！正在重定向...' });
      
      // 跳转到首页
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || '登录失败，请重试';
      setMessage({ type: 'error', text: errorMessage });
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>登录账户</h2>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="请输入您的邮箱"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="请输入您的密码"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            还没有账号？ <Link to="/register">注册</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 