require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// 中间件
app.use(cors({
  origin: '*', // 生产环境中应限制为特定域名
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// API路由
app.use('/api', apiRoutes);
// 认证路由
app.use('/api/auth', authRoutes);

// API根路径展示信息
app.get('/', (req, res) => {
  res.send('Famous People Timeline API 运行正常');
});

// 连接数据库
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('已经连接到MongoDB');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB连接成功');
  } catch (err) {
    console.error('MongoDB连接失败:', err);
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
    await connectDB();
    return next();
  });
}

// 导出应用以支持Serverless部署
module.exports = app; 