// 专用API处理函数 - 获取人物数据
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
    console.log('MongoDB连接成功');
  } catch (error) {
    console.error('MongoDB连接错误:', error);
    throw error;
  }
}

// 处理获取所有人物的请求
const handler = async (req, res) => {
  try {
    // 连接数据库
    await connectToDatabase();
    
    // 获取所有人物数据
    const people = await Person.find({}, 'name birthYear title brief');
    
    // 返回人物数据
    return res.status(200).json(people);
  } catch (error) {
    console.error('获取人物列表失败:', error);
    return res.status(500).json({
      success: false,
      message: '获取人物列表失败',
      error: error.message
    });
  }
};

// 创建API路由
app.get('/api/people', handler);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', serverTime: new Date().toISOString() });
});

// 导出handler
module.exports = app; 