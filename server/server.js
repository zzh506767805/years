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
app.use(cors());
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
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB连接成功');
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`后端API服务器运行在端口 ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB连接失败:', err);
  }); 