require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// 调试日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS中间件 - 允许所有域的请求（开发环境）
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// 解析JSON请求体
app.use(express.json());

// 验证请求中间件
app.use((req, res, next) => {
  console.log('请求头:', req.headers);
  console.log('请求URL:', req.url);
  console.log('请求方法:', req.method);
  next();
});

// API路由
app.use('/api', apiRoutes);
// 认证路由
app.use('/api/auth', authRoutes);

// API根路径展示信息
app.get('/', (req, res) => {
  res.send('Famous People Timeline API 运行正常');
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', serverTime: new Date().toISOString() });
});

// 连接数据库
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('已经连接到MongoDB');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log('MongoDB连接成功');
  } catch (err) {
    console.error('MongoDB连接失败:', err);
    // 在Serverless环境下，返回错误信息而不是直接崩溃
    if (process.env.NODE_ENV === 'production') {
      console.error('尝试继续处理请求，但可能会导致数据库操作失败');
    } else {
      throw err;
    }
  }
};

// 在本地环境中启动服务器
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`后端API服务器运行在端口 ${PORT}`);
    });
  });
} else {
  // 在Serverless环境中，每次请求都会连接数据库
  app.use(async (req, res, next) => {
    try {
      await connectDB();
      return next();
    } catch (error) {
      console.error('数据库连接失败，无法处理请求:', error);
      return res.status(500).json({ 
        success: false, 
        message: '服务器内部错误：无法连接到数据库' 
      });
    }
  });
}

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('应用错误:', err);
  res.status(500).json({ success: false, message: '服务器内部错误', error: err.message });
});

// 处理404
app.use((req, res) => {
  res.status(404).json({ success: false, message: '请求的资源不存在' });
});

// 导出应用以支持Serverless部署
module.exports = app; 