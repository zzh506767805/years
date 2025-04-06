// 专用API处理函数 - 按年龄查询事件
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');

// 导入Person模型
let Person;
try {
  Person = require('../server/models/Person');
} catch (error) {
  // 如果直接导入失败，尝试创建模型
  const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    birthYear: { type: Number, required: true },
    title: String,
    brief: String,
    experiences: [{
      year: Number,
      title: String,
      description: String
    }]
  });
  
  // 避免模型重复注册错误
  Person = mongoose.models.Person || mongoose.model('Person', personSchema);
}

// 创建Express实例
const app = express();

// 使用CORS和JSON解析中间件
app.use(cors({
  origin: '*',
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// 数据库连接
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    cachedDb = mongoose.connection;
    console.log('MongoDB连接成功 - 年龄事件API');
  } catch (error) {
    console.error('MongoDB连接错误:', error);
    throw error;
  }
}

// 处理获取年龄事件的请求
const handler = async (req, res) => {
  try {
    // 从URL或请求参数中获取年龄
    const age = parseInt(req.query.age || req.params.age);
    console.log('请求年龄:', age);
    
    if (isNaN(age)) {
      return res.status(400).json({
        success: false,
        message: '年龄必须是有效的数字'
      });
    }
    
    // 连接数据库
    await connectToDatabase();
    
    // 查询所有人物
    const allPeople = await Person.find().lean();
    
    // 手动处理每个人物的经历，找出对应年龄的事件
    const events = [];
    
    allPeople.forEach(person => {
      if (!person.experiences || !Array.isArray(person.experiences)) return;
      
      const targetYear = person.birthYear + age;
      
      // 查找该人在指定年龄的所有经历
      const ageExperiences = person.experiences.filter(exp => exp.year === targetYear);
      
      // 如果有经历，添加到结果中
      ageExperiences.forEach(exp => {
        events.push({
          eventId: `${person._id}-${exp.year}`,
          personId: person._id,
          personName: person.name,
          personTitle: person.title,
          birthYear: person.birthYear,
          age: age,
          year: exp.year,
          title: exp.title,
          description: exp.description
        });
      });
    });
    
    // 按年份排序（从早到晚）
    events.sort((a, b) => a.year - b.year);
    
    // 如果没有事件，返回空数组
    if (events.length === 0) {
      return res.status(200).json({
        success: true,
        message: `没有找到${age}岁的事件`,
        events: []
      });
    }
    
    // 返回年龄事件
    return res.status(200).json({
      success: true,
      age: age,
      events: events
    });
  } catch (error) {
    console.error('获取年龄事件失败:', error);
    return res.status(500).json({
      success: false,
      message: '获取年龄事件失败',
      error: error.message
    });
  }
};

// 创建API路由
app.get('/api/events/age/:age', handler);

// 导出app
module.exports = app; 