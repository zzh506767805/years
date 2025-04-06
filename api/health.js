// 健康检查API端点
const express = require('express');
const app = express();

// 健康检查处理函数
const handler = (req, res) => {
  console.log('健康检查被调用');
  return res.status(200).json({
    status: 'ok',
    serverTime: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    vercel: process.env.VERCEL || false
  });
};

// 注册路由
app.get('/health', handler);
app.get('/', handler);

// 导出应用
module.exports = app; 