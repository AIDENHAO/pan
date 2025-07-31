/**
 * 新版本路由架构使用示例
 * 展示如何在服务器中集成新的路由系统
 */
import express from 'express';
import cors from 'cors';
import v2Routes from './index.js';
import originalRoutes from '../index.js'; // 原有路由

const app = express();
const PORT = process.env.PORT || 3001;

// ==================== 中间件配置 ====================

// CORS配置
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// 请求体解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志
app.use((req, res, next) => {
  console.log(`📝 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==================== 路由配置 ====================

// 新版本路由 (v2) - 推荐使用
app.use('/', v2Routes);

// 原有路由 - 保持兼容性
app.use('/', originalRoutes);

// ==================== 根路径处理 ====================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '欢迎使用修仙应用API',
    version: '2.0.0',
    documentation: {
      v2: {
        description: '新版本API，推荐使用',
        baseUrl: '/api/v2',
        modules: {
          character: '/api/v2/character - 角色管理',
          staticData: '/api/v2/static-data - 静态数据',
          system: '/api/v2/system - 系统管理',
          legacy: '/api/v2/legacy - 兼容性接口'
        }
      },
      v1: {
        description: '原版本API，保持兼容',
        baseUrl: '/api',
        note: '建议迁移到v2版本'
      }
    },
    quickStart: {
      health: 'GET /api/v2/system/health',
      characters: 'GET /api/v2/character/base-info',
      realms: 'GET /api/v2/static-data/realms',
      stats: 'GET /api/v2/system/stats'
    },
    timestamp: new Date().toISOString()
  });
});

// ==================== 错误处理 ====================

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.originalUrl,
    suggestion: '请检查API文档或使用 GET /api/v2 查看可用接口',
    timestamp: new Date().toISOString()
  });
});

// 全局错误处理
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('🚨 服务器错误:', error);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? error.message : '请联系管理员',
    timestamp: new Date().toISOString()
  });
});

// ==================== 服务器启动 ====================

app.listen(PORT, () => {
  console.log('🚀 修仙应用API服务器启动成功!');
  console.log(`📍 服务器地址: http://localhost:${PORT}`);
  console.log('📚 API文档:');
  console.log(`   - 新版本API: http://localhost:${PORT}/api/v2`);
  console.log(`   - 健康检查: http://localhost:${PORT}/api/v2/system/health`);
  console.log(`   - 角色管理: http://localhost:${PORT}/api/v2/character`);
  console.log(`   - 静态数据: http://localhost:${PORT}/api/v2/static-data`);
  console.log('🔄 兼容性: 原有API接口仍然可用');
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 收到SIGTERM信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 收到SIGINT信号，正在关闭服务器...');
  process.exit(0);
});

export default app;