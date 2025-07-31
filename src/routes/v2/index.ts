/**
 * 新版本路由架构 - 主入口
 * 模块化、结构清晰、符合数据库表结构的路由系统
 */
import { Router } from 'express';
import characterRoutes from './character/index.js';
import staticDataRoutes from './static-data/index.js';
import systemRoutes from './system/index.js';
import legacyRoutes from './legacy/index.js';

// 创建主路由实例
const router = Router();

// ==================== API版本信息 ====================
router.get('/api/v2', (req, res) => {
  res.json({
    success: true,
    message: '修仙应用 API v2.0',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    modules: {
      character: '角色管理模块',
      staticData: '静态数据模块',
      system: '系统管理模块',
      legacy: '兼容性模块'
    },
    endpoints: {
      character: '/api/v2/character/*',
      staticData: '/api/v2/static-data/*',
      system: '/api/v2/system/*',
      legacy: '/api/v2/legacy/*'
    }
  });
});

// ==================== 模块路由挂载 ====================

// 角色管理模块 - 所有与角色相关的操作
router.use('/api/v2/character', characterRoutes);

// 静态数据模块 - 境界、技能、武器、物品等基础数据
router.use('/api/v2/static-data', staticDataRoutes);

// 系统管理模块 - 健康检查、统计信息等
router.use('/api/v2/system', systemRoutes);

// 兼容性模块 - 保持与旧版API的兼容
router.use('/api/v2/legacy', legacyRoutes);

// ==================== 全局中间件 ====================

// 请求日志中间件
router.use((req, res, next) => {
  console.log(`🔍 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// 404处理
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

export default router;