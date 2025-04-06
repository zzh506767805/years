import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AuthPages.css';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
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
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setMessage({ type: 'error', text: '请填写所有字段' });
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: '两次输入的密码不一致' });
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setMessage({ type: 'error', text: '密码长度不能少于6个字符' });
        setLoading(false);
        return;
      }

      // 发送注册请求
      const response = await registerUser({
        email: formData.email,
        password: formData.password
      });
      
      // 使用auth上下文的login函数保存用户信息
      login(response.user, response.token);
      
      setMessage({ type: 'success', text: '注册成功！正在重定向...' });
      
      // 跳转到首页
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || '注册失败，请重试';
      setMessage({ type: 'error', text: errorMessage });
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>创建新账户</h2>
        
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
              placeholder="请设置您的密码（至少6个字符）"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="请再次输入密码"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            已有账号？ <Link to="/login">登录</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 