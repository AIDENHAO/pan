/**
 * API路由配置
 * 将控制器方法绑定到具体的API路由
 */
import { Router } from 'express';
import { LeaderController } from '../controllers/LeaderController.js';
import { ZongmenController } from '../controllers/ZongmenController.js';
import { MappingController } from '../controllers/MappingController.js';
import databaseRoutes from './databaseRoutes.js';

// 创建路由实例
const router = Router();

// 创建控制器实例
const leaderController = new LeaderController();
const zongmenController = new ZongmenController();
const mappingController = new MappingController();

// ==================== 掌门相关路由 ====================

// 获取掌门信息 (新接口)
router.get('/api/leader/info', (req, res) => leaderController.getLeaderInfo(req, res));

// 更新修炼值 (新接口)
router.post('/api/leader/cultivation/update', (req, res) => leaderController.updateCultivationValue(req, res));

// 更新境界等级 (新接口)
router.post('/api/leader/realm/update', (req, res) => leaderController.updateRealmLevel(req, res));

// 激活境界突破 (新接口)
router.post('/api/leader/breakthrough/activate', (req, res) => leaderController.activateBreakthrough(req, res));

// ==================== 兼容旧接口 ====================

// 获取掌门信息 (兼容旧接口)
router.post('/api/get-person-info', (req, res) => leaderController.getLeaderInfo(req, res));

// 更新修炼值 (兼容旧接口)
router.post('/api/update-cultivation', (req, res) => leaderController.updateCultivationValue(req, res));

// 更新境界等级 (兼容旧接口)
router.post('/api/update-realm-level', (req, res) => leaderController.updateRealmLevel(req, res));

// 激活境界突破 (兼容旧接口)
router.post('/api/activate-breakthrough', (req, res) => leaderController.activateBreakthrough(req, res));

// ==================== 宗门相关路由 ====================

// 获取宗门信息 (新接口)
router.get('/api/zongmen/info', (req, res) => zongmenController.getZongmenInfo(req, res));

// 更新宗门等级
router.post('/api/zongmen/level/update', (req, res) => zongmenController.updateZongmenLevel(req, res));

// 更新宗门声望
router.post('/api/zongmen/reputation/update', (req, res) => zongmenController.updateZongmenReputation(req, res));

// 更新宗门资源
router.post('/api/zongmen/resources/update', (req, res) => zongmenController.updateZongmenResources(req, res));

// ==================== 兼容旧宗门接口 ====================

// 获取宗门信息 (兼容旧接口)
router.post('/api/get-zongmen-info', (req, res) => zongmenController.getZongmenInfo(req, res));

// ==================== 映射数据相关路由 ====================

// 获取所有映射数据 (新接口)
router.get('/api/mappings/all', (req, res) => mappingController.getAllMappings(req, res));

// 获取职位映射数据
router.get('/api/mappings/position', (req, res) => mappingController.getPositionMapping(req, res));

// 获取境界映射数据
router.get('/api/mappings/realm', (req, res) => mappingController.getRealmMapping(req, res));

// 获取技能映射数据
router.get('/api/mappings/skill', (req, res) => mappingController.getSkillMapping(req, res));

// 获取建筑映射数据
router.get('/api/mappings/building', (req, res) => mappingController.getBuildingMapping(req, res));

// 根据类型获取特定映射数据
router.get('/api/mappings/:type', (req, res) => mappingController.getMappingByType(req, res));

// 根据映射类型和键获取特定值
router.get('/api/mappings/:type/:key', (req, res) => mappingController.getMappingValue(req, res));

// 批量获取映射值
router.post('/api/mappings/batch', (req, res) => mappingController.getBatchMappingValues(req, res));

// ==================== 兼容旧映射接口 ====================

// 获取映射数据 (兼容旧接口)
router.post('/api/get-mappings', (req, res) => mappingController.getAllMappings(req, res));

// ==================== 数据库管理路由 ====================

// 数据库管理路由
router.use('/api/database', databaseRoutes);

// ==================== 健康检查路由 ====================

// API健康检查
router.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API服务运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 根路径重定向
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '欢迎使用修仙应用API',
    endpoints: {
      leader: {
        info: 'GET /api/leader/info',
        updateCultivation: 'POST /api/leader/cultivation/update',
        updateRealm: 'POST /api/leader/realm/update',
        breakthrough: 'POST /api/leader/breakthrough/activate'
      },
      zongmen: {
        info: 'GET /api/zongmen/info',
        updateLevel: 'POST /api/zongmen/level/update',
        updateReputation: 'POST /api/zongmen/reputation/update',
        updateResources: 'POST /api/zongmen/resources/update'
      },
      mappings: {
        all: 'GET /api/mappings/all',
        byType: 'GET /api/mappings/:type',
        byKey: 'GET /api/mappings/:type/:key',
        batch: 'POST /api/mappings/batch'
      },
      legacy: {
        personInfo: 'POST /api/get-person-info',
        zongmenInfo: 'POST /api/get-zongmen-info',
        mappings: 'POST /api/get-mappings',
        updateCultivation: 'POST /api/update-cultivation',
        updateRealmLevel: 'POST /api/update-realm-level'
      }
    }
  });
});

// 404处理将在server.ts中统一处理

export default router;