// API调试端点 - 返回环境信息和配置
const express = require('express');
const app = express();

// 安全地过滤敏感信息
const filterSensitiveInfo = (obj) => {
  const result = {};
  Object.keys(obj).forEach(key => {
    if (key.toLowerCase().includes('key') || 
        key.toLowerCase().includes('secret') || 
        key.toLowerCase().includes('password') || 
        key.toLowerCase().includes('token') || 
        key.toLowerCase().includes('uri')) {
      result[key] = '******';
    } else {
      result[key] = obj[key];
    }
  });
  return result;
};

// 调试处理函数
const handler = (req, res) => {
  const debugInfo = {
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    vercel: {
      isVercel: !!process.env.VERCEL,
      region: process.env.VERCEL_REGION || 'unknown',
      url: process.env.VERCEL_URL || 'unknown'
    },
    node: {
      version: process.version,
      platform: process.platform,
      arch: process.arch
    },
    headers: req.headers,
    config: {
      hasMongoDB: !!process.env.MONGODB_URI,
      hasJWT: !!process.env.JWT_SECRET
    }
  };

  return res.status(200).json(debugInfo);
};

// 注册路由
app.get('/api/debug', handler);

// 导出应用
module.exports = app; 