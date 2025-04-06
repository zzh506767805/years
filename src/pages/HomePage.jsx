import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import { fetchAllPeople, searchPeople } from '../services/api';
import { useAuth } from '../context/AuthContext';

function PeopleView({ people, onCardClick, isLoading }) {
  if (isLoading) {
    return <div className="loading">正在加载数据...</div>;
  }

  if (!people || people.length === 0) {
    return <div className="no-data">没有找到人物数据</div>;
  }

  return (
    <div className="cards-grid">
      {people.map((person) => (
        <div 
          key={person._id}
          className="person-card"
          onClick={() => onCardClick(person._id)}
        >
          <div className="card-content">
            <h2>{person.name}</h2>
            <h3>{person.title}</h3>
            <p>{person.brief}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function YearsView({ onYearClick, searchTerm }) {
  const allYears = Array.from(new Set(Array.from({ length: 2024 - 1940 }, (_, i) => 1940 + i)));
  
  // 根据搜索词过滤年份
  const filteredYears = searchTerm
    ? allYears.filter(year => year.toString().includes(searchTerm))
    : allYears;

  if (filteredYears.length === 0) {
    return <div className="no-data">没有找到符合 "{searchTerm}" 的年份</div>;
  }

  return (
    <div className="years-grid">
      {filteredYears.map((year) => (
        <div 
          key={year}
          className="year-card"
          onClick={() => onYearClick(year)}
        >
          <h2>{year}</h2>
        </div>
      ))}
    </div>
  );
}

function AgesView({ onAgeClick, searchTerm }) {
  const allAges = Array.from({ length: 100 }, (_, i) => i);
  
  // 根据搜索词过滤年龄
  const filteredAges = searchTerm
    ? allAges.filter(age => age.toString().includes(searchTerm))
    : allAges;

  if (filteredAges.length === 0) {
    return <div className="no-data">没有找到符合 "{searchTerm}" 的年龄</div>;
  }

  return (
    <div className="ages-grid">
      {filteredAges.map((age) => (
        <div 
          key={age}
          className="age-card"
          onClick={() => onAgeClick(age)}
        >
          <h2>{age}岁</h2>
        </div>
      ))}
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [viewMode, setViewMode] = useState('people'); // 'people', 'years', 'ages'
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false); // 新增标记，跟踪数据是否已加载

  // 使用useCallback包装loadPeople函数，避免不必要的重新创建
  const loadPeople = useCallback(async () => {
    // 如果数据已加载，不再重复请求
    if (dataLoaded) return;
    
    try {
      setIsLoading(true);
      console.log("加载人物数据...");
      const data = await fetchAllPeople();
      setPeople(data);
      setSearchResults(data);
      setDataLoaded(true);
    } catch (error) {
      console.error('加载人物数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dataLoaded]);

  // 加载所有人物数据
  useEffect(() => {
    loadPeople();
  }, [loadPeople]);

  // 防抖搜索
  const debounceSearch = useCallback((value) => {
    if (viewMode !== 'people') return;
    
    const timer = setTimeout(async () => {
      if (value.trim() === '') {
        setSearchResults(people);
        setIsSearching(false);
        return;
      }
      
      setIsSearching(true);
      try {
        console.log("搜索中...", value);
        const results = await searchPeople(value);
        setSearchResults(results);
      } catch (error) {
        console.error('搜索失败:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [people, viewMode]);

  // 搜索输入变化时
  useEffect(() => {
    const cleanup = debounceSearch(searchTerm);
    return cleanup;
  }, [searchTerm, debounceSearch]);

  const handleCardClick = (personId) => {
    navigate(`/timeline/${personId}`);
  };

  const handleYearClick = (year) => {
    navigate(`/year/${year}`);
  };

  const handleAgeClick = (age) => {
    navigate(`/age/${age}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(people);
  };

  const goToImport = () => {
    navigate('/import');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    logout();
    // 不需要再次刷新页面，AuthContext.logout会处理
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="header-left">
          <h1>Years</h1>
          <div className="slogan">人生海海，波涛浮沉</div>
        </div>
        <div className="header-right">
          {isAuthenticated ? (
            <>
              <button onClick={goToImport} className="import-data-button">
                导入数据
              </button>
              <button onClick={handleLogout} className="logout-button">
                退出登录
              </button>
            </>
          ) : (
            <div className="auth-buttons">
              <button onClick={goToLogin} className="login-button">
                登录
              </button>
              <button onClick={goToRegister} className="register-button">
                注册
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="搜索..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        {searchTerm && (
          <button onClick={clearSearch} className="clear-search-btn">
            ×
          </button>
        )}
      </div>

      <div className="view-switcher">
        <button 
          className={`switch-btn ${viewMode === 'people' ? 'active' : ''}`}
          onClick={() => setViewMode('people')}
        >
          人物
        </button>
        <button 
          className={`switch-btn ${viewMode === 'years' ? 'active' : ''}`}
          onClick={() => setViewMode('years')}
        >
          年份
        </button>
        <button 
          className={`switch-btn ${viewMode === 'ages' ? 'active' : ''}`}
          onClick={() => setViewMode('ages')}
        >
          年龄
        </button>
      </div>

      {viewMode === 'people' && 
        <PeopleView 
          people={searchResults} 
          onCardClick={handleCardClick} 
          isLoading={isLoading || isSearching} 
        />
      }
      {viewMode === 'years' && <YearsView onYearClick={handleYearClick} searchTerm={searchTerm} />}
      {viewMode === 'ages' && <AgesView onAgeClick={handleAgeClick} searchTerm={searchTerm} />}
    </div>
  );
}

export default HomePage; 