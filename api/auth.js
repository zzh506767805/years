// 认证API处理函数 - 处理注册和登录请求
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'years_web_secret_key';

// 创建Express应用
const app = express();

// 中间件
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// 定义User模型
let User;
try {
  User = require('../server/models/User');
} catch (error) {
  console.log('导入User模型失败，创建临时模型');
  
  const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
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

  // 保存前对密码进行哈希处理
  userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });

  // 比较密码
  userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

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

// 生成JWT
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d' // 30天过期
  });
};

// 注册处理函数
const register = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { email, password } = req.body;
    
    // 验证输入
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '请提供邮箱和密码'
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
    
    // 获取用户总数来决定是否为第一个用户（管理员）
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;
    
    // 创建用户
    const user = await User.create({
      email,
      password,
      role: isFirstUser ? 'admin' : 'user' // 第一个用户作为管理员
    });
    
    // 生成token
    const token = generateToken(user._id);
    
    // 返回用户信息（不含密码）
    res.status(201).json({
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
    res.status(500).json({
      success: false,
      message: '注册过程中发生错误',
      error: error.message
    });
  }
};

// 登录处理函数
const login = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { email, password } = req.body;
    
    // 验证输入
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '请提供邮箱和密码'
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
    
    // 生成token
    const token = generateToken(user._id);
    
    // 返回用户信息（不含密码）
    res.status(200).json({
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
    res.status(500).json({
      success: false,
      message: '登录过程中发生错误',
      error: error.message
    });
  }
};

// 获取当前用户信息
const getCurrentUser = async (req, res) => {
  try {
    await connectToDatabase();
    
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未授权，请登录'
      });
    }
    
    try {
      // 验证token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // 获取用户信息
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }
      
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: '令牌无效，请重新登录'
      });
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息过程中发生错误',
      error: error.message
    });
  }
};

// 注册路由
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', getCurrentUser);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', serverTime: new Date().toISOString() });
});

// 导出处理函数
module.exports = app; 