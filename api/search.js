// 专用API处理函数 - 搜索人物数据
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
    console.log('MongoDB连接成功 - 搜索API');
  } catch (error) {
    console.error('MongoDB连接错误:', error);
    throw error;
  }
}

// 处理搜索人物的请求
const handler = async (req, res) => {
  try {
    console.log('搜索请求参数:', req.query);
    
    // 连接数据库
    await connectToDatabase();
    
    const query = req.query.q || '';
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: '搜索参数不能为空'
      });
    }
    
    // 搜索人物数据
    const people = await Person.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { title: { $regex: query, $options: 'i' } },
        { brief: { $regex: query, $options: 'i' } }
      ]
    }, 'name birthYear title brief');
    
    console.log(`搜索完成，找到 ${people.length} 条结果`);
    
    // 返回搜索结果
    return res.status(200).json(people);
  } catch (error) {
    console.error('搜索人物失败:', error);
    return res.status(500).json({
      success: false,
      message: '搜索人物失败',
      error: error.message
    });
  }
};

// 创建API路由
app.get('/api/people/search', handler);

// 导出handler
module.exports = app; 