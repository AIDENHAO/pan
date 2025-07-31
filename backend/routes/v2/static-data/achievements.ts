/**
 * 成就数据路由
 * 对应数据库表: achievement_data
 * 主键: achievement_id
 */
import { Router } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';

const router = Router();
const databaseController = new DatabaseController();

// ==================== 成就数据 CRUD ====================

/**
 * 获取所有成就数据
 * GET /api/v2/static-data/achievements
 * 支持分页和排序
 */
router.get('/', databaseController.getAllAchievements.bind(databaseController));

/**
 * 根据achievement_id获取成就数据
 * GET /api/v2/static-data/achievements/:achievement_id
 */
router.get('/:achievement_id', databaseController.getAchievementById.bind(databaseController));

/**
 * 创建新成就数据
 * POST /api/v2/static-data/achievements
 * Body: {
 *   achievement_name: string,
 *   achievement_type: string,
 *   difficulty_level: string,
 *   completion_criteria: string,
 *   reward_description?: string,
 *   points_value?: number,
 *   description?: string
 * }
 */
router.post('/', databaseController.createAchievementData.bind(databaseController));

/**
 * 更新成就数据
 * PUT /api/v2/static-data/achievements/:achievement_id
 * Body: Partial<AchievementData> (不包含achievement_id)
 */
router.put('/:achievement_id', databaseController.updateAchievementData.bind(databaseController));

/**
 * 删除成就数据
 * DELETE /api/v2/static-data/achievements/:achievement_id
 * 注意：删除前需要检查是否有角色已获得此成就
 */
router.delete('/:achievement_id', databaseController.deleteAchievementData.bind(databaseController));

// ==================== 成就查询 ====================

/**
 * 根据成就类型查询
 * GET /api/v2/static-data/achievements/search/by-type/:achievement_type
 */
router.get('/search/by-type/:achievement_type', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按成就类型查询功能待实现'
  });
});

/**
 * 根据难度等级查询
 * GET /api/v2/static-data/achievements/search/by-difficulty/:difficulty_level
 */
router.get('/search/by-difficulty/:difficulty_level', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按难度等级查询功能待实现'
  });
});

/**
 * 根据积分价值范围查询
 * GET /api/v2/static-data/achievements/search/by-points
 * Query参数: min_points, max_points, page, limit
 */
router.get('/search/by-points', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按积分价值查询功能待实现'
  });
});

/**
 * 根据完成条件查询
 * GET /api/v2/static-data/achievements/search/by-criteria
 * Query参数: criteria (模糊匹配), page, limit
 */
router.get('/search/by-criteria', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按完成条件查询功能待实现'
  });
});

/**
 * 获取成就统计信息
 * GET /api/v2/static-data/achievements/stats
 */
router.get('/stats', (req, res) => {
  res.status(501).json({
    success: false,
    message: '成就统计信息功能待实现'
  });
});

export default router;