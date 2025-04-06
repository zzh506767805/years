import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import '../styles/AuthPage.css';

const AuthPage = () => {
  const { login, register, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 检查是否从登录页面访问
  const isLogin = location.pathname === '/login';
  
  // 表单状态
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // 表单错误状态
  const [formErrors, setFormErrors] = useState({});
  
  // 表单提交状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // 清除该字段的错误
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };
  
  // 验证表单
  const validateForm = () => {
    const errors = {};
    
    // 验证电子邮件
    if (!formData.email) {
      errors.email = '请输入邮箱地址';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    // 验证密码
    if (!formData.password) {
      errors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      errors.password = '密码长度不能少于6个字符';
    }
    
    // 如果是注册，验证确认密码
    if (!isLogin) {
      if (!formData.confirmPassword) {
        errors.confirmPassword = '请确认密码';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = '两次输入的密码不一致';
      }
    }
    
    return errors;
  };
  
  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 验证表单
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 根据当前页面类型执行登录或注册
      const result = isLogin
        ? await login(formData.email, formData.password)
        : await register(formData.email, formData.password);
      
      if (result.success) {
        // 重定向到主页
        navigate('/');
      } else {
        // 显示错误
        setFormErrors({ general: result.message });
      }
    } catch (error) {
      console.error('认证过程中发生错误:', error);
      setFormErrors({ general: '认证过程中发生错误，请稍后再试' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 切换到另一个认证页面
  const toggleAuthPage = () => {
    navigate(isLogin ? '/register' : '/login');
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? '登录' : '注册'}</h2>
        
        {/* 显示全局错误 */}
        {(formErrors.general || error) && (
          <div className="auth-error">
            {formErrors.general || error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {/* 邮箱输入 */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">邮箱</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${formErrors.email ? 'input-error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="请输入您的邮箱"
              disabled={isSubmitting}
            />
            {formErrors.email && <div className="error-message">{formErrors.email}</div>}
          </div>
          
          {/* 密码输入 */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${formErrors.password ? 'input-error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="请输入您的密码"
              disabled={isSubmitting}
            />
            {formErrors.password && <div className="error-message">{formErrors.password}</div>}
          </div>
          
          {/* 确认密码（仅注册时显示） */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">确认密码</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input ${formErrors.confirmPassword ? 'input-error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="请再次输入密码"
                disabled={isSubmitting}
              />
              {formErrors.confirmPassword && (
                <div className="error-message">{formErrors.confirmPassword}</div>
              )}
            </div>
          )}
          
          {/* 提交按钮 */}
          <button 
            type="submit" 
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isLogin ? '登录中...' : '注册中...') 
              : (isLogin ? '登录' : '注册')}
          </button>
        </form>
        
        {/* 切换到另一个认证页面的链接 */}
        <div className="auth-toggle">
          {isLogin ? '还没有账号？' : '已有账号？'}
          <button
            type="button"
            className="toggle-button"
            onClick={toggleAuthPage}
            disabled={isSubmitting}
          >
            {isLogin ? '立即注册' : '立即登录'}
          </button>
        </div>
        
        {/* 返回主页链接 */}
        <div className="back-home">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate('/')}
            disabled={isSubmitting}
          >
            返回主页
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;