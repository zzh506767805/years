import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EventsPage.css';
import { fetchEventsByYear } from '../services/api';

function YearEventsPage() {
  const { year } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadedYear, setLoadedYear] = useState(null);

  const loadEvents = useCallback(async () => {
    // 检查年份参数是否有效
    if (!year || isNaN(parseInt(year))) {
      setError('无效的年份参数');
      setIsLoading(false);
      return;
    }

    // 如果已经加载了相同年份的数据，不再重复请求
    if (dataLoaded && loadedYear === year) {
      return;
    }

    try {
      setIsLoading(true);
      console.log(`加载 ${year} 年事件...`);
      const response = await fetchEventsByYear(year);
      
      if (response && response.success) {
        setEvents(response.events || []);
        setError(null);
      } else {
        throw new Error(response?.message || '获取事件失败');
      }
      
      setDataLoaded(true);
      setLoadedYear(year);
    } catch (error) {
      console.error(`加载${year}年事件失败:`, error);
      setError('无法加载事件数据，请稍后再试');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [year, dataLoaded, loadedYear]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handlePersonClick = (personId) => {
    navigate(`/timeline/${personId}`);
  };

  if (isLoading) {
    return <div className="loading-container">正在加载数据...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="back-button" onClick={() => navigate('/')}>
          返回首页
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <div className="back-button" onClick={() => navigate('/')}>
          返回首页
        </div>
        <h1 className="events-title">{year}年发生的事件</h1>
      </div>
      
      {events.length === 0 ? (
        <div className="no-events">这一年没有记录事件</div>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <div key={event.eventId} className="events-person-group">
              <div 
                className="events-person-name" 
                onClick={() => handlePersonClick(event.personId)}
              >
                {event.personName} ({event.age}岁)
              </div>
              <div className="events-item">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default YearEventsPage; 