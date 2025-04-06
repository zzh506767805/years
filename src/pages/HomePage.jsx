import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import '../styles/HomePage.css';

// API基础URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://years-web.vercel.app';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // 状态
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 加载人物数据
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/people`);
        setPeople(response.data || []);
        setError(null);
      } catch (error) {
        console.error('获取人物数据失败:', error);
        setError('加载数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPeople();
  }, []);
  
  // 处理搜索输入变化
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // 过滤人物数据
  const filteredPeople = people.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person.title && person.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // 导航到时间线页面
  const goToTimeline = (id) => {
    navigate(`/timeline/${id}`);
  };
  
  // 导航到导入页面
  const goToImport = () => {
    navigate('/import');
  };
  
  // 导航到年份页面
  const goToYearPage = (year) => {
    navigate(`/year/${year}`);
  };
  
  // 渲染人物卡片
  const renderPersonCard = (person) => (
    <div 
      key={person._id} 
      className="person-card"
      onClick={() => goToTimeline(person._id)}
    >
      <h3 className="person-name">{person.name}</h3>
      <div className="person-birth">出生于 {person.birthYear} 年</div>
      {person.title && <div className="person-title">{person.title}</div>}
      {person.brief && <p className="person-brief">{person.brief}</p>}
    </div>
  );
  
  return (
    <div className="home-container">
      <div className="home-header">
        <div className="header-left">
          <h1 className="site-title">Years</h1>
          <p className="site-slogan">探索人物生命中的关键时刻</p>
        </div>
        <div className="header-right">
          {isAuthenticated && (
            <button 
              className="import-data-button"
              onClick={goToImport}
            >
              导入数据
            </button>
          )}
        </div>
      </div>
      
      <div className="search-section">
        <div className="search-container">
          <input 
            type="text"
            className="search-input"
            placeholder="搜索人物名称或职业..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="search-icon">🔍</div>
        </div>
      </div>
      
      <div className="content-section">
        {loading ? (
          <div className="loading-message">加载中...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredPeople.length === 0 ? (
          <div className="no-results">
            {searchTerm ? '未找到匹配的结果' : '暂无人物数据'}
          </div>
        ) : (
          <div className="people-grid">
            {filteredPeople.map(renderPersonCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;