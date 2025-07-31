/**
 * 修仙应用后端服务器
 * 使用TypeScript和控制器架构重构
 */
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import routes from '../routes/index.js';
import { dbManager } from '../database/config/database.js';
import { DatabaseService } from '../database/implementations/DatabaseService.js';

// 修复ES模块中__dirname的使用问题
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const PORT = process.env.PORT || 3015;
let server: any; // 服务器实例，用于优雅关闭

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
  console.log(`🌐 [${timestamp}] ${req.method} ${req.url}`);
  console.log(`🔍 Headers:`, req.headers);
  
  // 记录请求体（仅在开发环境）
  if (process.env.NODE_ENV === 'development' && req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  }
  
  next();
});



// 使用路由
app.use('/', routes);

// 直接测试路由（在routes之后）
app.post('/direct-test', (req, res) => {
  console.log('🎯 直接测试路由被调用');
  res.json({ message: '直接测试路由工作正常' });
});

// 路由加载确认
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 调试信息：路由已加载');
  if (routes && typeof routes.stack !== 'undefined') {
    console.log('🔍 Routes.stack长度:', routes.stack.length);
  }
}

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

// 初始化数据库连接和服务器启动
async function startServer() {
  try {
    // 建立数据库连接
    console.log('🔗 正在连接数据库...');
    await dbManager.connect();
    console.log('✅ 数据库连接成功');
    
    // 初始化数据库服务
    const databaseService = DatabaseService.getInstance();
    await databaseService.initialize();
    console.log('✅ 数据库服务初始化完成');
    
    // 启动服务器
     server = app.listen(PORT, () => {
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
      console.log(`\n📊 数据库管理API:`);
      console.log(`   GET  /api/database/stats       - 获取数据库统计`);
      console.log(`   GET  /api/database/characters  - 获取所有角色`);
      console.log(`   GET  /api/database/realms      - 获取所有境界`);
      console.log(`   GET  /api/database/skills      - 获取所有技能`);
      console.log(`   GET  /api/database/weapons     - 获取所有武器`);
      console.log(`   GET  /api/database/items       - 获取所有物品`);
      console.log(`\n🔄 兼容旧接口:`);
      console.log(`   POST /api/get-person-info      - 获取掌门信息(旧)`);
      console.log(`   POST /api/update-cultivation   - 更新修炼值(旧)`);
      console.log(`   POST /api/get-zongmen-info     - 获取宗门信息(旧)`);
      console.log(`   POST /api/get-mappings         - 获取映射数据(旧)`);
      console.log(`\n✨ 服务器就绪，等待请求...\n`);
    });
    
    return server;
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

// 启动服务器
const serverPromise = startServer();

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