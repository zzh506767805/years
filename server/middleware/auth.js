const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'years_web_secret_key';

// 验证token中间件
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 从请求头获取token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 检查token是否存在
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未授权，请登录'
      });
    }

    try {
      // 验证token
      const decoded = jwt.verify(token, JWT_SECRET);

      // 将用户信息添加到请求对象
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: '令牌无效，请重新登录'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 验证管理员权限中间件
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: '无权限，需要管理员权限'
    });
  }
}; 