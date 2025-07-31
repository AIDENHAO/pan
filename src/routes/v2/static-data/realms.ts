/**
 * 境界数据路由
 * 对应数据库表: realm_data
 * 主键: realm_id
 */
import { Router } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';

const router = Router();
const databaseController = new DatabaseController();

// ==================== 境界数据 CRUD ====================

/**
 * 获取所有境界数据
 * GET /api/v2/static-data/realms
 * 支持分页和排序
 */
router.get('/', databaseController.getAllRealms.bind(databaseController));

/**
 * 根据realm_id获取境界数据
 * GET /api/v2/static-data/realms/:realm_id
 */
router.get('/:realm_id', databaseController.getRealmById.bind(databaseController));

/**
 * 创建新境界数据
 * POST /api/v2/static-data/realms
 * Body: {
 *   realm_name: string,
 *   realm_level: number,
 *   required_cultivation: number,
 *   breakthrough_difficulty: number,
 *   description?: string,
 *   special_abilities?: string
 * }
 */
router.post('/', databaseController.createRealmData.bind(databaseController));

/**
 * 更新境界数据
 * PUT /api/v2/static-data/realms/:realm_id
 * Body: Partial<RealmData> (不包含realm_id)
 */
router.put('/:realm_id', databaseController.updateRealmData.bind(databaseController));

/**
 * 删除境界数据
 * DELETE /api/v2/static-data/realms/:realm_id
 * 注意：删除前需要检查是否有角色使用此境界
 */
router.delete('/:realm_id', databaseController.deleteRealmData.bind(databaseController));

// ==================== 境界查询 ====================

/**
 * 根据境界等级范围查询
 * GET /api/v2/static-data/realms/search/by-level
 * Query参数: min_level, max_level, page, limit
 */
router.get('/search/by-level', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按境界等级查询功能待实现'
  });
});

/**
 * 根据修炼值要求范围查询
 * GET /api/v2/static-data/realms/search/by-cultivation
 * Query参数: min_cultivation, max_cultivation, page, limit
 */
router.get('/search/by-cultivation', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按修炼值要求查询功能待实现'
  });
});

/**
 * 根据突破难度查询
 * GET /api/v2/static-data/realms/search/by-difficulty
 * Query参数: min_difficulty, max_difficulty, page, limit
 */
router.get('/search/by-difficulty', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按突破难度查询功能待实现'
  });
});

export default router;