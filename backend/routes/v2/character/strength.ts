/**
 * 角色强度属性路由
 * 对应数据库表: character_strength
 * 主键: character_uuid
 * 外键: character_uuid -> character_base_info.character_uuid
 */
import { Router } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';

const router = Router();
const databaseController = new DatabaseController();

// ==================== 角色强度属性 CRUD ====================

/**
 * 根据character_uuid获取角色强度属性
 * GET /api/v2/character/strength/:character_uuid
 * 返回: CharacterStrength | null
 */
router.get('/:character_uuid', databaseController.getCharacterStrength.bind(databaseController));

/**
 * 创建或更新角色强度属性
 * POST /api/v2/character/strength
 * Body: {
 *   character_uuid: string,
 *   attack_power: number,
 *   defense_power: number,
 *   speed: number,
 *   health_points: number,
 *   mana_points: number,
 *   critical_rate: number,
 *   dodge_rate: number
 * }
 */
router.post('/', databaseController.createOrUpdateCharacterStrength.bind(databaseController));

/**
 * 更新角色强度属性
 * PUT /api/v2/character/strength/:character_uuid
 * Body: Partial<CharacterStrength> (不包含character_uuid)
 */
router.put('/:character_uuid', databaseController.createOrUpdateCharacterStrength.bind(databaseController));

/**
 * 删除角色强度属性
 * DELETE /api/v2/character/strength/:character_uuid
 */
router.delete('/:character_uuid', (req, res) => {
  res.status(501).json({
    success: false,
    message: '删除功能待实现',
    note: '可通过删除角色基础信息来级联删除'
  });
});

// ==================== 强度属性查询 ====================

/**
 * 根据战力范围查询角色
 * GET /api/v2/character/strength/search/by-power
 * Query参数: min_attack, max_attack, min_defense, max_defense, page, limit
 */
router.get('/search/by-power', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按战力范围查询功能待实现'
  });
});

export default router;