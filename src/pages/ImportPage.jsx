import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ImportPage.css';
import { importPerson, batchImportPeople } from '../services/api';
import { useAuth } from '../context/AuthContext';

// 名人数据模板
const personTemplate = {
  name: "",
  birthYear: "",
  title: "",
  brief: "",
  experiences: [
    {
      year: "",
      title: "",
      description: ""
    }
  ]
};

// 批量导入数据模板
const batchTemplate = [
  {
    name: "示例名人1",
    birthYear: 1980,
    title: "职业/头衔",
    brief: "简短介绍",
    experiences: [
      {
        year: 1980,
        title: "出生",
        description: "出生于XX地区"
      },
      {
        year: 2000,
        title: "重要事件",
        description: "发生了什么重要事件"
      }
    ]
  },
  {
    name: "示例名人2",
    birthYear: 1990,
    title: "职业/头衔",
    brief: "简短介绍",
    experiences: [
      {
        year: 1990,
        title: "出生",
        description: "出生于XX地区"
      }
    ]
  }
];

function ImportPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState('single'); // 'single' 或 'batch'
  
  // 表单数据
  const [personData, setPersonData] = useState({...personTemplate});
  const [batchData, setBatchData] = useState('');
  
  // 状态信息
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'warning'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 检查用户是否已登录
  useEffect(() => {
    if (!isAuthenticated()) {
      setMessage('请先登录后再使用导入功能');
      setMessageType('error');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [isAuthenticated, navigate]);
  
  // 如果不是管理员但选择了批量导入，自动切换回单条导入
  useEffect(() => {
    if (activeTab === 'batch' && !hasRole('admin')) {
      setActiveTab('single');
      setMessage('只有管理员可以使用批量导入功能');
      setMessageType('warning');
    }
  }, [activeTab, hasRole]);
  
  // 处理基本信息变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonData(prev => ({
      ...prev,
      [name]: name === 'birthYear' ? (value ? parseInt(value) : '') : value
    }));
  };
  
  // 处理经历信息变化
  const handleExperienceChange = (index, field, value) => {
    const newExperiences = [...personData.experiences];
    newExperiences[index] = {
      ...newExperiences[index],
      [field]: field === 'year' ? (value ? parseInt(value) : '') : value
    };
    
    setPersonData(prev => ({
      ...prev,
      experiences: newExperiences
    }));
  };
  
  // 添加新经历
  const addExperience = () => {
    setPersonData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { year: "", title: "", description: "" }
      ]
    }));
  };
  
  // 删除经历
  const removeExperience = (index) => {
    if (personData.experiences.length <= 1) {
      setMessage('至少需要保留一条经历记录');
      setMessageType('warning');
      return;
    }
    
    const newExperiences = [...personData.experiences];
    newExperiences.splice(index, 1);
    
    setPersonData(prev => ({
      ...prev,
      experiences: newExperiences
    }));
  };
  
  // 处理批量导入数据变化
  const handleBatchDataChange = (e) => {
    setBatchData(e.target.value);
  };
  
  // 插入模板
  const insertTemplate = () => {
    if (activeTab === 'single') {
      setPersonData({...personTemplate});
    } else {
      setBatchData(JSON.stringify(batchTemplate, null, 2));
    }
  };
  
  // 提交表单
  const handleSubmit = async () => {
    setMessage('');
    setIsSubmitting(true);
    
    try {
      if (activeTab === 'single') {
        // 单个人物导入
        if (!validateSinglePerson()) {
          setIsSubmitting(false);
          return;
        }
        
        const result = await importPerson(personData);
        
        if (result.success) {
          setMessage(`${personData.name}的数据已成功导入！`);
          setMessageType('success');
          setPersonData({...personTemplate});
        } else {
          throw new Error(result.message || '导入失败');
        }
      } else {
        // 批量导入 - 需要管理员权限
        if (!hasRole('admin')) {
          setMessage('只有管理员可以使用批量导入功能');
          setMessageType('error');
          setIsSubmitting(false);
          return;
        }
        
        if (!validateBatchData()) {
          setIsSubmitting(false);
          return;
        }
        
        const parsedData = JSON.parse(batchData);
        const result = await batchImportPeople(parsedData);
        
        if (result.success) {
          setMessage(`成功导入${result.count}条人物数据！`);
          setMessageType('success');
          setBatchData('');
        } else {
          throw new Error(result.message || '导入失败');
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || '导入过程中发生错误');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 验证单个人物数据
  const validateSinglePerson = () => {
    if (!personData.name) {
      setMessage('请填写人物姓名');
      setMessageType('error');
      return false;
    }
    
    if (!personData.birthYear) {
      setMessage('请填写出生年份');
      setMessageType('error');
      return false;
    }
    
    // 验证经历数据
    for (let i = 0; i < personData.experiences.length; i++) {
      const exp = personData.experiences[i];
      if (!exp.year || !exp.title || !exp.description) {
        setMessage(`第${i+1}条经历数据不完整，请填写年份、标题和描述`);
        setMessageType('error');
        return false;
      }
    }
    
    return true;
  };
  
  // 验证批量导入数据
  const validateBatchData = () => {
    if (!batchData.trim()) {
      setMessage('请输入批量导入数据');
      setMessageType('error');
      return false;
    }
    
    try {
      const parsedData = JSON.parse(batchData);
      
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        setMessage('数据格式不正确，应为人物数组');
        setMessageType('error');
        return false;
      }
      
      // 验证每个人物数据
      for (let i = 0; i < parsedData.length; i++) {
        const person = parsedData[i];
        
        if (!person.name || !person.birthYear) {
          setMessage(`第${i+1}个人物数据不完整，请填写姓名和出生年份`);
          setMessageType('error');
          return false;
        }
        
        if (!Array.isArray(person.experiences) || person.experiences.length === 0) {
          setMessage(`第${i+1}个人物(${person.name})缺少经历数据`);
          setMessageType('error');
          return false;
        }
      }
      
      return true;
    } catch (error) {
      setMessage('JSON格式不正确，请检查输入');
      setMessageType('error');
      return false;
    }
  };
  
  return (
    <div className="import-container">
      <div className="import-header">
        <button className="back-button" onClick={() => navigate('/')}>
          返回首页
        </button>
        <h1 className="import-title">导入名人数据</h1>
      </div>
      
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      
      <div className="import-tabs">
        <button 
          className={`tab-button ${activeTab === 'single' ? 'active' : ''}`}
          onClick={() => setActiveTab('single')}
        >
          单条导入
        </button>
        {hasRole('admin') && (
          <button 
            className={`tab-button ${activeTab === 'batch' ? 'active' : ''}`}
            onClick={() => setActiveTab('batch')}
          >
            批量导入
          </button>
        )}
      </div>
      
      {activeTab === 'single' ? (
        <div className="import-form-container">
          <div className="form-group">
            <label className="form-label">姓名</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={personData.name}
              onChange={handleInputChange}
              placeholder="人物姓名"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">出生年份</label>
            <input
              type="number"
              name="birthYear"
              className="form-input"
              value={personData.birthYear}
              onChange={handleInputChange}
              placeholder="YYYY"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">头衔/职业</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={personData.title}
              onChange={handleInputChange}
              placeholder="如：作家、科学家、艺术家等"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">简介</label>
            <textarea
              name="brief"
              className="form-textarea"
              value={personData.brief}
              onChange={handleInputChange}
              placeholder="简短描述这个人物的主要成就或特点"
            />
          </div>
          
          <div className="experiences-container">
            <div className="experiences-header">
              <h3>人生经历</h3>
              <button 
                className="add-experience-button"
                onClick={addExperience}
                type="button"
              >
                添加经历
              </button>
            </div>
            
            {personData.experiences.map((exp, index) => (
              <div key={index} className="experience-entry">
                <div className="experience-header">
                  <h4>经历 #{index + 1}</h4>
                  <button
                    className="remove-experience-button"
                    onClick={() => removeExperience(index)}
                    type="button"
                  >
                    删除
                  </button>
                </div>
                
                <div className="experience-form">
                  <div className="form-group">
                    <label className="form-label">年份</label>
                    <input
                      type="number"
                      className="form-input"
                      value={exp.year}
                      onChange={(e) => handleExperienceChange(index, 'year', e.target.value)}
                      placeholder="YYYY"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">标题</label>
                    <input
                      type="text"
                      className="form-input"
                      value={exp.title}
                      onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                      placeholder="经历标题"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">描述</label>
                    <textarea
                      className="form-textarea"
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      placeholder="详细描述这一年发生的事情"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="batch-import-container">
          <div className="form-group">
            <label className="form-label">批量JSON数据</label>
            <textarea
              className="form-textarea batch-textarea"
              value={batchData}
              onChange={handleBatchDataChange}
              placeholder="请粘贴符合格式的JSON数据"
            />
          </div>
        </div>
      )}
      
      <div className="import-actions">
        <button
          className="template-button"
          onClick={insertTemplate}
          type="button"
        >
          插入模板
        </button>
        
        <button
          className="import-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          type="button"
        >
          {isSubmitting ? '正在导入...' : '导入数据'}
        </button>
      </div>
    </div>
  );
}

export default ImportPage; 