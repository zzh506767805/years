require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/authRoutes');

const app = express();

// 调试日志中间件 - 简化输出
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// CORS中间件
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// 解析JSON请求体
app.use(express.json());

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

// 使用轻量级的MongoClient连接策略
let cachedDb = null;
const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const client = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    cachedDb = client;
    console.log('MongoDB连接成功');
    return client;
  } catch (error) {
    console.error('MongoDB连接错误:', error);
    throw error;
  }
}

// Serverless环境中的数据库连接中间件
app.use(async (req, res, next) => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI环境变量未设置');
    }
    
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('数据库连接失败:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误: 数据库连接失败'
    });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('应用错误:', err);
  res.status(500).json({ 
    success: false, 
    message: '服务器内部错误', 
    error: err.message 
  });
});

// 捕获未处理的异步错误
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
});

// 启动本地服务器（非Vercel环境）
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`后端API服务器运行在端口 ${PORT}`);
  });
}

// 导出应用以支持Serverless部署
module.exports = app; 