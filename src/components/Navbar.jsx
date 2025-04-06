import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  // 下拉菜单状态
  const [menuOpen, setMenuOpen] = useState(false);
  
  // 切换下拉菜单
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // 处理退出登录
  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo和网站名称 */}
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Years</span>
        </Link>
        
        {/* 导航链接 */}
        <div className="nav-links">
          <Link to="/" className="nav-link">首页</Link>
          {isAuthenticated && isAdmin && (
            <Link to="/import" className="nav-link">导入数据</Link>
          )}
          {isAuthenticated && !isAdmin && (
            <Link to="/import" className="nav-link">单人导入</Link>
          )}
        </div>
        
        {/* 认证菜单 */}
        <div className="auth-menu">
          {isAuthenticated ? (
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={toggleMenu}
              >
                <span className="user-email">{currentUser?.email}</span>
                <span className={`arrow ${menuOpen ? 'up' : 'down'}`}></span>
              </button>
              
              {menuOpen && (
                <div className="dropdown-menu">
                  <div className="menu-item user-role">
                    {isAdmin ? '管理员' : '普通用户'}
                  </div>
                  <button 
                    className="menu-item logout-button"
                    onClick={handleLogout}
                  >
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">登录</Link>
              <Link to="/register" className="register-button">注册</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 