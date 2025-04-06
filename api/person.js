// 专用API处理函数 - 获取单个人物详情
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
    console.log('MongoDB连接成功 - 人物详情API');
  } catch (error) {
    console.error('MongoDB连接错误:', error);
    throw error;
  }
}

// 处理获取单个人物详情的请求
const handler = async (req, res) => {
  try {
    // 从URL中获取人物ID
    const personId = req.query.id || req.params.id;
    console.log('请求人物ID:', personId);
    
    if (!personId) {
      return res.status(400).json({
        success: false,
        message: '人物ID不能为空'
      });
    }
    
    // 连接数据库
    await connectToDatabase();
    
    // 查询人物详情
    const person = await Person.findById(personId);
    
    if (!person) {
      return res.status(404).json({
        success: false,
        message: '未找到指定人物'
      });
    }
    
    // 返回人物详情
    return res.status(200).json(person);
  } catch (error) {
    console.error('获取人物详情失败:', error);
    return res.status(500).json({
      success: false,
      message: '获取人物详情失败',
      error: error.message
    });
  }
};

// 创建API路由
app.get('/api/people/:id', handler);

// 导出handler
module.exports = app; 