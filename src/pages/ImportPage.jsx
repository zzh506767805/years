import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import '../styles/ImportPage.css';

// API基础URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://years-web.vercel.app';

// 单个名人模板
const singleTemplate = {
  name: '',
  birthYear: null,
  title: '',
  brief: '',
  experiences: [
    { year: null, title: '', description: '' }
  ]
};

// 批量导入模板
const batchTemplate = [
  {
    name: '示例名人1',
    birthYear: 1960,
    title: '示例职业1',
    brief: '这是一段简短的个人介绍',
    experiences: [
      { year: 1980, title: '经历标题1', description: '详细描述1' },
      { year: 1990, title: '经历标题2', description: '详细描述2' }
    ]
  },
  {
    name: '示例名人2',
    birthYear: 1970,
    title: '示例职业2',
    brief: '这是另一段简短的个人介绍',
    experiences: [
      { year: 1995, title: '经历标题1', description: '详细描述1' }
    ]
  }
];

const ImportPage = () => {
  const { isAuthenticated, isAdmin, currentUser } = useAuth();
  const navigate = useNavigate();
  
  // 表单状态
  const [activeTab, setActiveTab] = useState('single');
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(singleTemplate)));
  const [batchData, setBatchData] = useState(JSON.stringify(batchTemplate, null, 2));
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 检查用户是否已登录
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // 处理返回按钮点击
  const handleBack = () => {
    navigate('/');
  };
  
  // 处理标签切换
  const handleTabChange = (tab) => {
    if (tab === 'batch' && !isAdmin) {
      setMessage({
        type: 'error',
        text: '只有管理员可以使用批量导入功能'
      });
      return;
    }
    
    setActiveTab(tab);
    setMessage({ type: '', text: '' });
  };
  
  // 处理表单输入变更
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // 处理数字字段变更
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value ? parseInt(value, 10) : null });
  };
  
  // 处理经历字段变更
  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...formData.experiences];
    
    if (field === 'year') {
      updatedExperiences[index][field] = value ? parseInt(value, 10) : null;
    } else {
      updatedExperiences[index][field] = value;
    }
    
    setFormData({ ...formData, experiences: updatedExperiences });
  };
  
  // 添加新经历
  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [...formData.experiences, { year: null, title: '', description: '' }]
    });
  };
  
  // 删除经历
  const removeExperience = (index) => {
    const updatedExperiences = [...formData.experiences];
    updatedExperiences.splice(index, 1);
    setFormData({ ...formData, experiences: updatedExperiences });
  };
  
  // 处理批量数据变更
  const handleBatchDataChange = (e) => {
    setBatchData(e.target.value);
  };
  
  // 插入单个模板
  const insertSingleTemplate = () => {
    setFormData(JSON.parse(JSON.stringify(singleTemplate)));
  };
  
  // 插入批量模板
  const insertBatchTemplate = () => {
    setBatchData(JSON.stringify(batchTemplate, null, 2));
  };
  
  // 验证单个数据
  const validateSingleData = () => {
    const errors = [];
    
    if (!formData.name) errors.push('姓名是必填项');
    if (!formData.birthYear) errors.push('出生年份是必填项');
    
    formData.experiences.forEach((exp, index) => {
      if (!exp.year) errors.push(`经历 #${index+1} 的年份是必填项`);
      if (!exp.title) errors.push(`经历 #${index+1} 的标题是必填项`);
    });
    
    return errors;
  };
  
  // 验证批量数据
  const validateBatchData = () => {
    try {
      const data = JSON.parse(batchData);
      
      if (!Array.isArray(data)) {
        return ['批量数据必须是数组格式'];
      }
      
      if (data.length === 0) {
        return ['批量数据不能为空数组'];
      }
      
      const errors = [];
      
      data.forEach((person, personIndex) => {
        if (!person.name) errors.push(`人物 #${personIndex+1}: 姓名是必填项`);
        if (!person.birthYear) errors.push(`人物 #${personIndex+1}: 出生年份是必填项`);
        
        if (person.experiences && Array.isArray(person.experiences)) {
          person.experiences.forEach((exp, expIndex) => {
            if (!exp.year) errors.push(`人物 #${personIndex+1}, 经历 #${expIndex+1}: 年份是必填项`);
            if (!exp.title) errors.push(`人物 #${personIndex+1}, 经历 #${expIndex+1}: 标题是必填项`);
          });
        }
      });
      
      return errors;
    } catch (error) {
      return ['JSON格式无效: ' + error.message];
    }
  };
  
  // 提交单个导入
  const submitSingleImport = async () => {
    const errors = validateSingleData();
    
    if (errors.length > 0) {
      setMessage({
        type: 'error',
        text: `表单验证失败：${errors.join('; ')}`
      });
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      // 获取令牌
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({
          type: 'error',
          text: '未授权，请重新登录'
        });
        setIsSubmitting(false);
        return;
      }
      
      // 准备请求配置
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      // 发送请求
      const response = await axios.post(
        `${API_BASE_URL}/api/people/import`,
        formData,
        config
      );
      
      if (response.data.success) {
        setMessage({
          type: 'success',
          text: '数据导入成功！'
        });
        setFormData(JSON.parse(JSON.stringify(singleTemplate)));
      } else {
        setMessage({
          type: 'error',
          text: response.data.message || '导入失败'
        });
      }
    } catch (error) {
      console.error('导入错误:', error);
      
      if (error.response?.status === 401) {
        setMessage({
          type: 'error',
          text: '未授权，请重新登录'
        });
      } else if (error.response?.status === 409) {
        setMessage({
          type: 'warning',
          text: '已存在同名同出生年份的名人'
        });
      } else {
        setMessage({
          type: 'error',
          text: error.response?.data?.message || '导入过程中发生错误'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 提交批量导入
  const submitBatchImport = async () => {
    const errors = validateBatchData();
    
    if (errors.length > 0) {
      setMessage({
        type: 'error',
        text: `数据验证失败：${errors.join('; ')}`
      });
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      // 获取令牌
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({
          type: 'error',
          text: '未授权，请重新登录'
        });
        setIsSubmitting(false);
        return;
      }
      
      // 准备请求配置
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      // 解析批量数据
      const people = JSON.parse(batchData);
      
      // 发送请求
      const response = await axios.post(
        `${API_BASE_URL}/api/people/batch-import`,
        { people },
        config
      );
      
      if (response.data.success) {
        const { successful, failed, total } = response.data.results;
        
        setMessage({
          type: 'success',
          text: `批量导入完成: 共${total}项, 成功${successful}项, 失败${failed}项`
        });
        
        if (failed > 0) {
          console.log('导入错误详情:', response.data.results.errors);
        }
      } else {
        setMessage({
          type: 'error',
          text: response.data.message || '批量导入失败'
        });
      }
    } catch (error) {
      console.error('批量导入错误:', error);
      
      if (error.response?.status === 401) {
        setMessage({
          type: 'error',
          text: '未授权，请重新登录'
        });
      } else if (error.response?.status === 403) {
        setMessage({
          type: 'error',
          text: '权限不足，只有管理员可以执行批量导入'
        });
      } else {
        setMessage({
          type: 'error',
          text: error.response?.data?.message || '批量导入过程中发生错误'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeTab === 'single') {
      submitSingleImport();
    } else {
      submitBatchImport();
    }
  };
  
  // 如果未登录，不渲染内容
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="import-container">
      <div className="import-header">
        <button className="back-button" onClick={handleBack}>
          &larr; 返回
        </button>
        <h1 className="import-title">导入名人数据</h1>
      </div>
      
      <div className="import-user-info">
        当前用户: <span className="user-email">{currentUser?.email}</span>
        <span className="user-role">{isAdmin ? '(管理员)' : '(普通用户)'}</span>
      </div>
      
      <div className="import-tabs">
        <button
          className={`tab-button ${activeTab === 'single' ? 'active' : ''}`}
          onClick={() => handleTabChange('single')}
        >
          单个导入
        </button>
        <button
          className={`tab-button ${activeTab === 'batch' ? 'active' : ''}`}
          onClick={() => handleTabChange('batch')}
          disabled={!isAdmin}
        >
          批量导入 {!isAdmin && '(仅管理员)'}
        </button>
      </div>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {activeTab === 'single' ? (
          <div className="single-import">
            <div className="form-group">
              <label className="form-label">姓名</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="输入名人姓名"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">出生年份</label>
              <input
                type="number"
                name="birthYear"
                className="form-input"
                value={formData.birthYear || ''}
                onChange={handleNumberChange}
                placeholder="输入出生年份"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">头衔/职业</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="输入头衔或职业"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">简介</label>
              <textarea
                name="brief"
                className="form-textarea"
                value={formData.brief}
                onChange={handleInputChange}
                placeholder="输入简短介绍"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="experiences-section">
              <h3>重要经历</h3>
              
              {formData.experiences.map((exp, index) => (
                <div key={index} className="experience-entry">
                  <h4>经历 #{index + 1}</h4>
                  
                  <div className="form-group">
                    <label className="form-label">年份</label>
                    <input
                      type="number"
                      className="form-input"
                      value={exp.year || ''}
                      onChange={(e) => handleExperienceChange(index, 'year', e.target.value)}
                      placeholder="输入经历年份"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">标题</label>
                    <input
                      type="text"
                      className="form-input"
                      value={exp.title}
                      onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                      placeholder="输入经历标题"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">描述</label>
                    <textarea
                      className="form-textarea"
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      placeholder="输入经历详细描述"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  {formData.experiences.length > 1 && (
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => removeExperience(index)}
                      disabled={isSubmitting}
                    >
                      删除此经历
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                className="add-button"
                onClick={addExperience}
                disabled={isSubmitting}
              >
                添加经历
              </button>
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                className="reset-button"
                onClick={insertSingleTemplate}
                disabled={isSubmitting}
              >
                重置表单
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? '导入中...' : '导入数据'}
              </button>
            </div>
          </div>
        ) : (
          <div className="batch-import">
            <div className="batch-info">
              <p>批量导入允许您一次性导入多个名人数据。请按照以下JSON格式提供数据：</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">批量数据 (JSON格式)</label>
              <textarea
                className="form-textarea json-textarea"
                value={batchData}
                onChange={handleBatchDataChange}
                placeholder="输入JSON格式的批量数据"
                disabled={isSubmitting || !isAdmin}
                rows={20}
              />
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                className="reset-button"
                onClick={insertBatchTemplate}
                disabled={isSubmitting || !isAdmin}
              >
                插入示例
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting || !isAdmin}
              >
                {isSubmitting ? '批量导入中...' : '批量导入'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ImportPage;