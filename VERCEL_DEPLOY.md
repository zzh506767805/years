# Years项目Vercel部署指南

本文档提供了将Years项目部署到Vercel的步骤和注意事项。

## 部署步骤

1. **注册Vercel账号**
   - 访问 [Vercel官网](https://vercel.com) 并注册账号
   - 或使用GitHub账号直接登录

2. **导入GitHub仓库**
   - 在Vercel控制台点击"Import Project"（导入项目）
   - 选择"Import Git Repository"（导入Git仓库）
   - 授权GitHub访问权限并选择`zzh506767805/years`仓库

3. **配置项目**
   - 项目名称：保持默认或自定义
   - 构建和输出设置：已由`vercel.json`配置，无需更改
   - 域名：可以使用Vercel默认提供的域名，或添加自定义域名

4. **环境变量设置**
   - 添加以下环境变量：
     - `MONGODB_URI`：MongoDB连接字符串（必填）
     - `JWT_SECRET`：JWT密钥（必填）
     - `NODE_ENV`：设置为`production`

5. **部署项目**
   - 点击"Deploy"按钮开始部署
   - Vercel会自动检测并部署前端和后端

## 注意事项

1. **数据库连接**
   - 确保MongoDB Atlas允许Vercel IP范围的访问
   - 在MongoDB Atlas网络设置中添加`0.0.0.0/0`以允许所有IP（仅用于测试，生产环境应限制）

2. **项目配置文件**
   - `vercel.json`：定义了构建和路由规则
   - `package.json`：包含了`vercel-build`脚本用于构建前端

3. **常见问题**
   - 如遇到CORS错误，检查服务器代码中的CORS配置
   - 如遇到MongoDB连接问题，验证连接字符串和网络设置
   - 如API请求失败，检查API路径是否正确配置

4. **部署后的操作**
   - 测试前端页面和功能
   - 验证API接口是否正常工作
   - 检查用户注册、登录和数据导入功能

## 更新部署

更新代码后，只需将更改推送到GitHub仓库，Vercel会自动重新部署：

```bash
git add .
git commit -m "更新项目代码"
git push origin main
```

## 相关链接

- [Vercel文档](https://vercel.com/docs)
- [MongoDB Atlas文档](https://docs.atlas.mongodb.com/)
- [GitHub仓库](https://github.com/zzh506767805/years) 