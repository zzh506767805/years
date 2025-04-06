// 用于测试API服务器的连接和基本功能
require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}/api` 
  : 'http://localhost:5001/api';

console.log(`测试API服务器: ${API_URL}`);
console.log('环境变量:', {
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  // 不要打印MONGODB_URI，以保护敏感信息
  MONGODB_URI: process.env.MONGODB_URI ? '已设置' : '未设置',
  JWT_SECRET: process.env.JWT_SECRET ? '已设置' : '未设置'
});

// 测试健康检查端点
const testHealth = async () => {
  try {
    console.log('测试健康检查端点...');
    const response = await axios.get(`${API_URL.replace('/api', '')}/health`);
    console.log('健康检查成功:', response.data);
    return true;
  } catch (error) {
    console.error('健康检查失败:', error.message);
    return false;
  }
};

// 测试获取人物列表
const testFetchAllPeople = async () => {
  try {
    console.log('测试获取人物列表...');
    const response = await axios.get(`${API_URL}/people`);
    console.log('获取人物列表成功:', response.status, Array.isArray(response.data) ? `${response.data.length} 个人物` : '不是数组');
    return true;
  } catch (error) {
    console.error('获取人物列表失败:', error.message);
    if (error.response) {
      console.error('错误状态:', error.response.status);
      console.error('错误数据:', error.response.data);
    }
    return false;
  }
};

// 执行测试
const runTests = async () => {
  let healthOk = await testHealth();
  let peopleOk = await testFetchAllPeople();
  
  console.log('测试结果摘要:');
  console.log('- 健康检查:', healthOk ? '通过' : '失败');
  console.log('- 获取人物列表:', peopleOk ? '通过' : '失败');
  
  if (!healthOk || !peopleOk) {
    console.log('一些测试失败，API可能无法正常工作。');
    process.exit(1);
  } else {
    console.log('所有测试通过，API正常工作。');
    process.exit(0);
  }
};

runTests(); 