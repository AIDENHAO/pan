/**
 * 修仙应用后端服务器
 * 使用TypeScript和控制器架构重构
 */
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import routes from '../routes/index.js';

// 修复ES模块中__dirname的使用问题
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const PORT = process.env.PORT || 3015;

// 配置CORS
app.use(cors({
  origin: [
    'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002',
    'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005',
    'http://localhost:3006', 'http://localhost:3007', 'http://localhost:3008',
    'http://localhost:3009', 'http://localhost:3010'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));

// 解析URL编码的请求体
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志中间件
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
  // 记录请求体（仅在开发环境）
  if (process.env.NODE_ENV === 'development' && req.body && Object.keys(req.body).length > 0) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  
  next();
});

// 使用路由
app.use('/', routes);

// 全局错误处理中间件
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('全局错误处理:', error);
  
  // 如果响应已经发送，则交给默认的Express错误处理器
  if (res.headersSent) {
    return next(error);
  }
  
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`\n🚀 修仙应用服务器启动成功!`);
  console.log(`📍 服务器地址: http://localhost:${PORT}`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ 启动时间: ${new Date().toLocaleString()}`);
  console.log(`\n📋 可用的API端点:`);
  console.log(`   GET  /api/health              - 健康检查`);
  console.log(`   GET  /api/leader/info          - 获取掌门信息`);
  console.log(`   POST /api/leader/cultivation/update - 更新修炼值`);
  console.log(`   POST /api/leader/realm/update  - 更新境界等级`);
  console.log(`   GET  /api/zongmen/info         - 获取宗门信息`);
  console.log(`   GET  /api/mappings/all         - 获取所有映射数据`);
  console.log(`\n🔄 兼容旧接口:`);
  console.log(`   POST /api/get-person-info      - 获取掌门信息(旧)`);
  console.log(`   POST /api/update-cultivation   - 更新修炼值(旧)`);
  console.log(`   POST /api/get-zongmen-info     - 获取宗门信息(旧)`);
  console.log(`   POST /api/get-mappings         - 获取映射数据(旧)`);
  console.log(`\n✨ 服务器就绪，等待请求...\n`);
});

// 优雅关闭处理
process.on('SIGTERM', () => {
  console.log('\n📴 收到SIGTERM信号，开始优雅关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已优雅关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n📴 收到SIGINT信号，开始优雅关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已优雅关闭');
    process.exit(0);
  });
});

// 未捕获异常处理
process.on('uncaughtException', (error) => {
  console.error('❌ 未捕获的异常:', error);
  console.error('🔄 服务器将在5秒后重启...');
  setTimeout(() => {
    process.exit(1);
  }, 5000);
});

// 未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ 未处理的Promise拒绝:', reason);
  console.error('📍 Promise:', promise);
  console.error('🔄 服务器将在5秒后重启...');
  setTimeout(() => {
    process.exit(1);
  }, 5000);
});

export default app;