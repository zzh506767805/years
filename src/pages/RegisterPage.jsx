import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AuthPages.css';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, isAuthenticated, error, clearError, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  // 如果用户已登录，重定向到首页
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // 显示认证错误
  useEffect(() => {
    if (error) {
      setMessage({ type: 'error', text: error });
      clearError();
    }
  }, [error, clearError]);
  
  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 表单验证
    if (!email || !password || !confirmPassword) {
      setMessage({ type: 'error', text: '请填写所有必填字段' });
      return;
    }
    
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: '两次输入的密码不一致' });
      return;
    }
    
    if (password.length < 6) {
      setMessage({ type: 'error', text: '密码长度必须至少为6个字符' });
      return;
    }
    
    // 提交注册请求
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      const result = await register(email, password);
      
      if (result.success) {
        // 显示成功消息
        setMessage({ type: 'success', text: '注册成功！' });
        
        // 强制刷新用户状态
        await refreshUser();
        
        // 注册成功，重定向到首页
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        // 显示错误消息
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '注册过程中出现错误，请稍后再试' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">注册账户</h1>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入您的邮箱"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码（至少6个字符）"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入密码"
              required
            />
          </div>
          
          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? '注册中...' : '注册'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            已有账号？ <Link to="/login">立即登录</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 