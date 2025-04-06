const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'years_web_secret_key';

// 身份验证中间件
exports.protect = async (req, res, next) => {
  let token;

  // 检查请求头中是否存在授权令牌
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 获取令牌
      token = req.headers.authorization.split(' ')[1];

      // 验证令牌
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');

      // 查找用户并添加到请求对象中（不包含密码）
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('认证令牌验证失败:', error);
      return res.status(401).json({
        success: false,
        message: '认证失败，请重新登录'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '未授权，请登录后重试'
    });
  }
};

// 角色授权中间件
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '用户未登录'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '您没有权限执行此操作'
      });
    }

    next();
  };
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