# Years - 名人生涯时间线

这是一个展示名人生涯关键时刻的交互式时间线应用。用户可以按人物、年份或年龄查看不同名人的生涯发展轨迹。用户登录后可以导入名人数据，管理员可进行批量导入。

## 项目架构

本项目采用前后端分离的架构：

- 前端：React.js
- 后端：Express.js
- 数据库：MongoDB

### 核心功能

1. 查看名人列表
2. 浏览特定名人的生涯时间线
3. 按年份查看当年发生的事件
4. 按年龄查看不同名人在特定年龄的经历
5. 用户注册与登录系统
6. 基于角色的数据导入权限控制

## 安装与启动

### 前置条件

- Node.js (v14+)
- MongoDB (本地安装或MongoDB Atlas)

### 安装步骤

1. 克隆仓库

```bash
git clone <仓库地址>
cd years_web
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

创建或编辑 .env 文件，设置以下环境变量：

```
# 本地MongoDB连接 (如果你有本地安装MongoDB)
# MONGODB_URI=mongodb://localhost:27017/famous_people

# MongoDB Atlas连接 (推荐云数据库方案)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/famous_people?retryWrites=true&w=majority

PORT=5000
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000/api
JWT_SECRET=your_jwt_secret_key_here
```

4. 初始化数据库

```bash
npm run seed
```

5. 启动开发服务器

```bash
npm run dev
```

这将同时启动前端和后端服务。前端访问 http://localhost:3000，后端API访问 http://localhost:5000。

### MongoDB Atlas云数据库配置指南

如果你选择使用MongoDB Atlas云数据库（推荐），请按以下步骤操作：

1. 访问 [MongoDB Atlas官网](https://www.mongodb.com/cloud/atlas/register) 注册账号
2. 创建一个免费集群（选择M0级别）
3. 在"Security"选项卡下创建数据库用户和密码
4. 在"Network Access"中添加IP地址（开发阶段可设置为0.0.0.0/0允许所有IP访问）
5. 点击"Connect"按钮，选择"Connect your application"获取连接字符串
6. 将连接字符串复制到.env文件中的MONGODB_URI变量，替换<username>、<password>和<cluster-url>为实际值

注意：第一次连接Atlas并运行seed脚本时可能需要等待几分钟才能完成数据初始化。

## 用户认证系统

系统实现了基于JWT的用户认证系统，包含以下功能：

### 用户角色

- **游客**：可浏览名人数据，但无法导入新数据
- **普通用户**：可浏览名人数据，可导入单个名人数据
- **管理员**：可浏览名人数据，可导入单个及批量名人数据

### 注册与登录

1. **注册**：用户可使用邮箱和密码注册新账户
2. **登录**：已注册用户可登录系统
3. **权限控制**：根据用户角色限制特定功能的访问

### 第一个注册的超级管理员

系统设计为第一个注册的用户自动成为超级管理员（admin角色），之后注册的用户默认为普通用户（user角色）。

## API接口说明

### 用户认证接口

```
POST /api/auth/register    # 用户注册
POST /api/auth/login       # 用户登录
GET  /api/auth/me          # 获取当前登录用户信息
```

### 数据接口

```
GET /api/people            # 获取所有名人列表
GET /api/people/:id        # 获取特定名人详情
GET /api/people/search     # 搜索名人
POST /api/people/import    # 导入单个名人数据 (需登录)
POST /api/people/batch-import # 批量导入名人数据 (需管理员权限)
GET /api/events/year/:year # 按年份查询事件
GET /api/events/age/:age   # 按年龄查询事件
```

## 项目结构

```
├── server/                  # 后端服务
│   ├── models/              # MongoDB模型
│   │   ├── Person.js        # 名人数据模型
│   │   └── User.js          # 用户数据模型
│   ├── controllers/         # 控制器
│   │   ├── personController.js # 名人数据控制器
│   │   └── authController.js   # 认证控制器
│   ├── middleware/          # 中间件
│   │   └── auth.js          # 认证中间件
│   ├── routes/              # API路由
│   │   ├── api.js           # 数据API路由
│   │   └── authRoutes.js    # 认证API路由
│   ├── server.js            # 服务器入口
│   └── seed.js              # 数据库初始化脚本
│
├── src/                     # 前端源码
│   ├── components/          # React组件
│   ├── pages/               # 页面组件
│   │   ├── HomePage.jsx     # 首页
│   │   ├── ImportPage.jsx   # 数据导入页
│   │   ├── LoginPage.jsx    # 登录页
│   │   └── RegisterPage.jsx # 注册页
│   ├── context/             # React上下文
│   │   └── AuthContext.jsx  # 认证上下文
│   ├── services/            # API服务
│   │   └── api.js           # API服务函数
│   ├── styles/              # CSS样式
│   ├── data/                # 静态数据
│   ├── App.jsx              # 应用根组件
│   └── index.js             # 入口文件
│
├── public/                  # 静态资源
├── .env                     # 环境变量
└── package.json             # 项目配置
```

## 技术栈

- React.js
- React Router
- React Context API（状态管理）
- Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- Axios
- CSS3 & Flexbox

## 后续发展计划

1. 添加更多名人数据
2. 完善用户管理系统，增加用户资料页
3. 添加密码重置功能
4. 实现OAuth社交媒体登录
5. 增加图片和多媒体内容
6. 支持按行业、领域过滤名人
7. 添加事件之间的关联功能
8. 增强管理员后台功能 