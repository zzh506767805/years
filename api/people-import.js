// 名人导入API处理函数 - 处理单个和批量导入名人数据的请求
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'years_web_secret_key';

// 创建Express应用
const app = express();

// 中间件
app.use(cors({
  origin: '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// 导入模型
let Person, User;
try {
  Person = require('../server/models/Person');
  User = require('../server/models/User');
} catch (error) {
  console.log('导入模型失败，创建临时模型');
  
  // Person模型
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
  
  Person = mongoose.models.Person || mongoose.model('Person', personSchema);
  
  // User模型
  const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: String,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  User = mongoose.models.User || mongoose.model('User', userSchema);
}

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

// 认证中间件
const auth = async (req, res, next) => {
  try {
    // 获取令牌
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未授权，请登录'
      });
    }
    
    // 验证令牌
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 查找用户
    await connectToDatabase();
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '未找到用户'
      });
    }
    
    // 将用户信息添加到请求对象
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error('认证失败:', error);
    res.status(401).json({
      success: false,
      message: '认证失败，请重新登录',
      error: error.message
    });
  }
};

// 验证Person数据
const validatePersonData = (data) => {
  const errors = [];
  
  // 必需字段验证
  if (!data.name) errors.push('姓名是必填项');
  if (!data.birthYear) errors.push('出生年份是必填项');
  
  // 字段类型验证
  if (data.birthYear && typeof data.birthYear !== 'number') 
    errors.push('出生年份必须是数字');
    
  // 经历验证
  if (data.experiences && Array.isArray(data.experiences)) {
    data.experiences.forEach((exp, index) => {
      if (!exp.year) errors.push(`经历 #${index+1} 的年份是必填项`);
      if (exp.year && typeof exp.year !== 'number') 
        errors.push(`经历 #${index+1} 的年份必须是数字`);
      if (!exp.title) errors.push(`经历 #${index+1} 的标题是必填项`);
    });
  }
  
  return errors;
};

// 单个导入处理函数
const importPerson = async (req, res) => {
  try {
    await connectToDatabase();
    
    // 获取请求数据
    const personData = req.body;
    
    // 验证数据
    const validationErrors = validatePersonData(personData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: '数据验证失败',
        errors: validationErrors
      });
    }
    
    // 检查是否存在同名同出生年份的名人
    const existingPerson = await Person.findOne({
      name: personData.name,
      birthYear: personData.birthYear
    });
    
    if (existingPerson) {
      return res.status(409).json({
        success: false,
        message: '已存在同名同出生年份的名人',
        existingId: existingPerson._id
      });
    }
    
    // 创建新名人
    const newPerson = await Person.create(personData);
    
    // 返回结果
    res.status(201).json({
      success: true,
      message: '名人数据导入成功',
      data: newPerson
    });
  } catch (error) {
    console.error('导入名人数据失败:', error);
    res.status(500).json({
      success: false,
      message: '导入名人数据过程中发生错误',
      error: error.message
    });
  }
};

// 批量导入处理函数
const batchImportPeople = async (req, res) => {
  try {
    await connectToDatabase();
    
    // 检查用户是否为管理员
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '权限不足，只有管理员可以执行批量导入'
      });
    }
    
    // 获取请求数据
    const { people } = req.body;
    
    if (!people || !Array.isArray(people) || people.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的人物数据数组'
      });
    }
    
    // 验证和导入结果
    const results = {
      total: people.length,
      successful: 0,
      failed: 0,
      errors: [],
      imported: []
    };
    
    // 逐个处理人物数据
    for (let i = 0; i < people.length; i++) {
      const personData = people[i];
      
      try {
        // 验证数据
        const validationErrors = validatePersonData(personData);
        if (validationErrors.length > 0) {
          results.failed++;
          results.errors.push({
            index: i,
            name: personData.name || '未命名',
            errors: validationErrors
          });
          continue;
        }
        
        // 检查是否存在同名同出生年份的名人
        const existingPerson = await Person.findOne({
          name: personData.name,
          birthYear: personData.birthYear
        });
        
        if (existingPerson) {
          results.failed++;
          results.errors.push({
            index: i,
            name: personData.name,
            errors: ['已存在同名同出生年份的名人']
          });
          continue;
        }
        
        // 创建新名人
        const newPerson = await Person.create(personData);
        results.successful++;
        results.imported.push({
          id: newPerson._id,
          name: newPerson.name,
          birthYear: newPerson.birthYear
        });
      } catch (error) {
        results.failed++;
        results.errors.push({
          index: i,
          name: personData.name || '未命名',
          errors: [error.message]
        });
      }
    }
    
    // 返回结果
    res.status(201).json({
      success: true,
      message: `批量导入完成: ${results.successful}成功, ${results.failed}失败`,
      results
    });
  } catch (error) {
    console.error('批量导入名人数据失败:', error);
    res.status(500).json({
      success: false,
      message: '批量导入名人数据过程中发生错误',
      error: error.message
    });
  }
};

// 注册路由
app.post('/api/people/import', auth, importPerson);
app.post('/api/people/batch-import', auth, batchImportPeople);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', serverTime: new Date().toISOString() });
});

// 导出处理函数
module.exports = app; 