import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EventsPage.css';
import { fetchEventsByAge } from '../services/api';

function AgeEventsPage() {
  const { age } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadedAge, setLoadedAge] = useState(null);

  const loadEvents = useCallback(async () => {
    // 检查年龄参数是否有效
    if (!age || isNaN(parseInt(age))) {
      setError('无效的年龄参数');
      setIsLoading(false);
      return;
    }

    // 如果已经加载了相同年龄的数据，不再重复请求
    if (dataLoaded && loadedAge === age) {
      return;
    }

    try {
      setIsLoading(true);
      console.log(`加载 ${age} 岁事件...`);
      const response = await fetchEventsByAge(age);
      
      if (response && response.success) {
        setEvents(response.events || []);
        setError(null);
      } else {
        throw new Error(response?.message || '获取事件失败');
      }
      
      setDataLoaded(true);
      setLoadedAge(age);
    } catch (error) {
      console.error(`加载${age}岁事件失败:`, error);
      setError('无法加载事件数据，请稍后再试');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [age, dataLoaded, loadedAge]);

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
        <h1 className="events-title">{age}岁时发生的事件</h1>
      </div>
      
      {events.length === 0 ? (
        <div className="no-events">这个年龄没有记录事件</div>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <div key={event.eventId} className="events-person-group">
              <div 
                className="events-person-name" 
                onClick={() => handlePersonClick(event.personId)}
              >
                {event.personName} ({event.year}年)
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

export default AgeEventsPage; 