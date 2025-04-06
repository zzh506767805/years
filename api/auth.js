// 专用API处理函数 - 用户认证（登录和注册）
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 导入或创建User模型
let User;
try {
  User = require('../server/models/User');
} catch (error) {
  // 如果直接导入失败，尝试创建模型
  const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  });

  // 密码加密
  userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

  // 验证密码方法
  userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // 避免模型重复注册错误
  User = mongoose.models.User || mongoose.model('User', userSchema);
}

// 创建Express实例
const app = express();

// 使用CORS和JSON解析中间件
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
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
    console.log('MongoDB连接成功 - 认证API');
  } catch (error) {
    console.error('MongoDB连接错误:', error);
    throw error;
  }
}

// 生成JWT令牌
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'default_jwt_secret',
    { expiresIn: '30d' }
  );
};

// 注册处理函数
const registerHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { email, password } = req.body;
    
    // 基本输入验证
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码是必填项'
      });
    }
    
    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册'
      });
    }
    
    // 特定邮箱设置为管理员
    const isAdmin = email === process.env.ADMIN_EMAIL;
    
    // 创建用户
    const user = new User({
      email,
      password,
      role: isAdmin ? 'admin' : 'user'
    });
    
    await user.save();
    
    // 生成令牌
    const token = generateToken(user);
    
    // 返回成功响应
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    return res.status(500).json({
      success: false,
      message: '注册过程中出现错误',
      error: error.message
    });
  }
};

// 登录处理函数
const loginHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { email, password } = req.body;
    
    // 基本输入验证
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码是必填项'
      });
    }
    
    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码不正确'
      });
    }
    
    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码不正确'
      });
    }
    
    // 生成令牌
    const token = generateToken(user);
    
    // 返回成功响应
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    return res.status(500).json({
      success: false,
      message: '登录过程中出现错误',
      error: error.message
    });
  }
};

// 获取当前用户信息
const getCurrentUserHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    // 从请求头获取令牌
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未授权，缺少有效令牌'
      });
    }
    
    const token = authorization.split(' ')[1];
    
    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
    
    // 查找用户（不返回密码）
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 返回用户信息
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return res.status(500).json({
      success: false,
      message: '获取用户信息过程中出现错误',
      error: error.message
    });
  }
};

// 创建API路由
app.post('/api/auth/register', registerHandler);
app.post('/api/auth/login', loginHandler);
app.get('/api/auth/me', getCurrentUserHandler);

// 导出app
module.exports = app; 