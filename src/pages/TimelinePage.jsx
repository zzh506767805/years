import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/TimelinePage.css';
import { fetchPersonById } from '../services/api';

function TimelinePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // 使用useCallback包装数据加载函数
  const loadPersonData = useCallback(async () => {
    // 如果已经加载了相同ID的数据，不再重复请求
    if (dataLoaded && person && person.id === parseInt(id)) {
      return;
    }

    try {
      setIsLoading(true);
      console.log(`加载人物ID: ${id} 的详情...`);
      const data = await fetchPersonById(id);
      setPerson(data);
      setError(null);
      setDataLoaded(true);
    } catch (error) {
      console.error('加载人物详情失败:', error);
      setError('无法加载人物数据，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  }, [id, dataLoaded, person]);

  useEffect(() => {
    loadPersonData();
  }, [loadPersonData]);

  const handleYearClick = (year) => {
    navigate(`/year/${year}`);
  };

  const handleAgeClick = (year) => {
    if (person) {
      const age = year - person.birthYear;
      navigate(`/age/${age}`);
    }
  };

  if (isLoading) {
    return <div className="loading-container">正在加载数据...</div>;
  }

  if (error || !person) {
    return (
      <div className="error-container">
        <div className="back-button" onClick={() => navigate('/')}>
          返回首页
        </div>
        <div className="error-message">{error || '人物未找到'}</div>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <div className="back-button" onClick={() => navigate('/')}>
          返回首页
        </div>
        <h1 className="timeline-title">{person.name}的人生轨迹</h1>
      </div>
      <div className="timeline">
        {person.experiences.map((experience, index) => {
          const age = experience.year - person.birthYear;
          return (
            <div key={index} className="timeline-item">
              <div className="timeline-left">
                <div className="timeline-year" onClick={() => handleYearClick(experience.year)}>
                  {experience.year}
                  <span className="timeline-year-small">年</span>
                </div>
                <div className="timeline-age" onClick={() => handleAgeClick(experience.year)}>
                  {age}
                  <span className="timeline-age-small">岁</span>
                </div>
              </div>
              <div className="timeline-right">
                <div className="timeline-event">
                  <h3 className="timeline-event-title">{experience.title}</h3>
                  <p className="timeline-event-desc">{experience.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TimelinePage; 