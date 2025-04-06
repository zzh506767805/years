// 专用API处理函数 - 按年份查询事件
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
    console.log('MongoDB连接成功 - 年份事件API');
  } catch (error) {
    console.error('MongoDB连接错误:', error);
    throw error;
  }
}

// 处理获取年份事件的请求
const handler = async (req, res) => {
  try {
    // 从URL或请求参数中获取年份
    const year = parseInt(req.query.year || req.params.year);
    console.log('请求年份:', year);
    
    if (isNaN(year)) {
      return res.status(400).json({
        success: false,
        message: '年份必须是有效的数字'
      });
    }
    
    // 连接数据库
    await connectToDatabase();
    
    // 聚合查询按年份的经历
    const peopleWithEvents = await Person.aggregate([
      // 展开experiences数组
      { $unwind: '$experiences' },
      // 匹配指定年份的经历
      { $match: { 'experiences.year': year } },
      // 重新构建结果格式
      {
        $project: {
          _id: 1,
          personId: '$_id',
          name: 1,
          birthYear: 1,
          title: 1,
          age: { $subtract: [year, '$birthYear'] },
          experience: '$experiences'
        }
      },
      // 按年龄排序（从小到大）
      { $sort: { age: 1 } }
    ]);
    
    if (peopleWithEvents.length === 0) {
      return res.status(200).json({
        success: true,
        message: `没有找到${year}年的事件`,
        events: []
      });
    }
    
    // 格式化响应数据
    const formattedEvents = peopleWithEvents.map(person => ({
      eventId: `${person._id}-${person.experience.year}`,
      personId: person._id,
      personName: person.name,
      personTitle: person.title,
      birthYear: person.birthYear,
      age: person.age,
      year: person.experience.year,
      title: person.experience.title,
      description: person.experience.description
    }));
    
    // 返回年份事件
    return res.status(200).json({
      success: true,
      year: year,
      events: formattedEvents
    });
  } catch (error) {
    console.error('获取年份事件失败:', error);
    return res.status(500).json({
      success: false,
      message: '获取年份事件失败',
      error: error.message
    });
  }
};

// 创建API路由
app.get('/api/events/year/:year', handler);

// 导出app
module.exports = app; 