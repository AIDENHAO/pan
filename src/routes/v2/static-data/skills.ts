/**
 * 技能数据路由
 * 对应数据库表: skill_data
 * 主键: skill_id
 */
import { Router } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';

const router = Router();
const databaseController = new DatabaseController();

// ==================== 技能数据 CRUD ====================

/**
 * 获取所有技能数据
 * GET /api/v2/static-data/skills
 * 支持分页和排序
 */
router.get('/', databaseController.getAllSkills.bind(databaseController));

/**
 * 根据skill_id获取技能数据
 * GET /api/v2/static-data/skills/:skill_id
 */
router.get('/:skill_id', databaseController.getSkillById.bind(databaseController));

/**
 * 创建新技能数据
 * POST /api/v2/static-data/skills
 * Body: {
 *   skill_name: string,
 *   skill_type: string,
 *   skill_level: number,
 *   power_rating: number,
 *   mana_cost: number,
 *   cooldown_time: number,
 *   description?: string,
 *   learning_requirements?: string
 * }
 */
router.post('/', databaseController.createSkillData.bind(databaseController));

/**
 * 更新技能数据
 * PUT /api/v2/static-data/skills/:skill_id
 * Body: Partial<SkillData> (不包含skill_id)
 */
router.put('/:skill_id', databaseController.updateSkillData.bind(databaseController));

/**
 * 删除技能数据
 * DELETE /api/v2/static-data/skills/:skill_id
 * 注意：删除前需要检查是否有角色学习此技能
 */
router.delete('/:skill_id', databaseController.deleteSkillData.bind(databaseController));

// ==================== 技能查询 ====================

/**
 * 根据技能类型查询
 * GET /api/v2/static-data/skills/search/by-type/:skill_type
 */
router.get('/search/by-type/:skill_type', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按技能类型查询功能待实现'
  });
});

/**
 * 根据技能等级范围查询
 * GET /api/v2/static-data/skills/search/by-level
 * Query参数: min_level, max_level, page, limit
 */
router.get('/search/by-level', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按技能等级查询功能待实现'
  });
});

/**
 * 根据威力评级范围查询
 * GET /api/v2/static-data/skills/search/by-power
 * Query参数: min_power, max_power, page, limit
 */
router.get('/search/by-power', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按威力评级查询功能待实现'
  });
});

/**
 * 根据法力消耗范围查询
 * GET /api/v2/static-data/skills/search/by-mana-cost
 * Query参数: min_cost, max_cost, page, limit
 */
router.get('/search/by-mana-cost', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按法力消耗查询功能待实现'
  });
});

export default router;