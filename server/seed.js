require('dotenv').config();
const mongoose = require('mongoose');
const Person = require('./models/Person');
const { timelineData } = require('../src/data/timelineData');
const fs = require('fs');
const path = require('path');

// 从src/pages/HomePage.jsx获取人物简介信息
const homePageContent = fs.readFileSync(path.join(__dirname, '../src/pages/HomePage.jsx'), 'utf8');

// 使用正则表达式提取people数组
const peopleMatch = homePageContent.match(/const people = \[([\s\S]*?)\];/);
let peopleArray = [];

if (peopleMatch && peopleMatch[1]) {
  // 简单解析people数组
  const peopleString = peopleMatch[1].trim();
  const peopleEntries = peopleString.split('},');
  
  peopleArray = peopleEntries.map(entry => {
    if (!entry.trim()) return null;
    
    // 确保每个条目是一个完整的对象
    const cleanEntry = entry.trim().endsWith('}') ? entry : entry + '}';
    
    // 提取id, name, title, brief
    const idMatch = cleanEntry.match(/id: (\d+)/);
    const nameMatch = cleanEntry.match(/name: ['"](.+?)['"]/);
    const titleMatch = cleanEntry.match(/title: ['"](.+?)['"]/);
    const briefMatch = cleanEntry.match(/brief: ['"](.+?)['"]/);
    
    return {
      id: idMatch ? parseInt(idMatch[1]) : null,
      name: nameMatch ? nameMatch[1] : '',
      title: titleMatch ? titleMatch[1] : '',
      brief: briefMatch ? briefMatch[1] : ''
    };
  }).filter(Boolean);
}

// 合并来自timelineData和HomePage的数据
const completeData = timelineData.map(person => {
  const personInfo = peopleArray.find(p => p.id === person.id) || {};
  return {
    ...person,
    title: personInfo.title || '',
    brief: personInfo.brief || ''
  };
});

// 连接到MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB连接成功');
    
    try {
      // 清空现有数据
      await Person.deleteMany({});
      console.log('已清空旧数据');
      
      // 插入完整数据
      await Person.insertMany(completeData);
      console.log('数据初始化成功');
      
      mongoose.connection.close();
    } catch (error) {
      console.error('初始化数据时出错:', error);
    }
  })
  .catch(err => {
    console.error('连接MongoDB失败:', err);
  }); 