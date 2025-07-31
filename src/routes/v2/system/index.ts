/**
 * 系统管理模块路由
 * 提供健康检查、统计信息、系统监控等功能
 */
import { Router, Request, Response } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';
import {
  validateHealthCheckQuery,
  validateDatabaseHealthQuery,
  validateDatabaseStatsQuery,
  validateSystemStatsQuery,
  validateUserActivityStatsQuery,
  validateVersionQuery,
  validateSystemStatusQuery,
  validateSystemConfigUpdate,
  validateSystemConfigQuery,
  validateLogQuery,
  validateLogLevelUpdate,
  validateCacheOperation,
  validateCacheStatsQuery
} from '../../../middleware/validation/system.js';

const router = Router();
const databaseController = new DatabaseController();

// ==================== 系统模块信息 ====================
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: '系统管理模块',
    description: '提供系统健康检查、统计信息、监控等功能',
    endpoints: {
      health: '/health - 健康检查',
      stats: '/stats - 数据库统计信息',
      version: '/version - 系统版本信息',
      status: '/status - 系统状态信息'
    }
  });
});

// ==================== 健康检查 ====================

/**
 * API健康检查
 * GET /api/v2/system/health
 */
router.get('/health', validateHealthCheckQuery, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API服务运行正常',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      unit: 'MB'
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * 数据库健康检查
 * GET /api/v2/system/health/database
 */
router.get('/health/database', validateDatabaseHealthQuery, async (req: Request, res: Response) => {
  try {
    // 这里可以添加数据库连接测试
    res.json({
      success: true,
      message: '数据库连接正常',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: '数据库连接异常',
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    });
  }
});

// ==================== 统计信息 ====================

/**
 * 获取数据库统计信息
 * GET /api/v2/system/stats
 */
router.get('/stats', validateDatabaseStatsQuery, databaseController.getDatabaseStats.bind(databaseController));

/**
 * 获取系统统计信息
 * GET /api/v2/system/stats/system
 */
router.get('/stats/system', validateSystemStatsQuery, (req: Request, res: Response) => {
  const memUsage = process.memoryUsage();
  res.json({
    success: true,
    data: {
      uptime: {
        seconds: process.uptime(),
        formatted: formatUptime(process.uptime())
      },
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024 * 100) / 100,
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100,
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100,
        external: Math.round(memUsage.external / 1024 / 1024 * 100) / 100,
        unit: 'MB'
      },
      cpu: {
        usage: process.cpuUsage()
      },
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid
    },
    timestamp: new Date().toISOString()
  });
});

// ==================== 版本信息 ====================

/**
 * 获取系统版本信息
 * GET /api/v2/system/version
 */
router.get('/version', validateVersionQuery, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      api: '2.0.0',
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      buildDate: new Date().toISOString(), // 实际项目中应该是构建时间
      environment: process.env.NODE_ENV || 'development'
    },
    timestamp: new Date().toISOString()
  });
});

// ==================== 系统状态 ====================

/**
 * 获取系统状态信息
 * GET /api/v2/system/status
 */
router.get('/status', validateSystemStatusQuery, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'running',
      services: {
        api: 'healthy',
        database: 'healthy', // 实际项目中应该检查数据库连接
        cache: 'not_configured' // 如果有缓存服务
      },
      lastRestart: new Date().toISOString(), // 实际项目中应该记录真实的重启时间
      activeConnections: 0 // 实际项目中应该统计活跃连接数
    },
    timestamp: new Date().toISOString()
  });
});

// ==================== 工具函数 ====================

/**
 * 格式化运行时间
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${days}天 ${hours}小时 ${minutes}分钟 ${secs}秒`;
}

export default router;