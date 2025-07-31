/**
 * 角色武器路由
 * 对应数据库表: character_weapons
 * 主键: character_uuid
 * 外键: character_uuid -> character_base_info.character_uuid
 * 外键: weapon_id -> weapon_data.weapon_id
 */
import { Router } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';

const router = Router();
const databaseController = new DatabaseController();

// ==================== 角色武器 CRUD ====================

/**
 * 根据character_uuid获取角色武器
 * GET /api/v2/character/weapons/:character_uuid
 * 返回: CharacterWeapons | null
 */
router.get('/:character_uuid', databaseController.getCharacterWeapons.bind(databaseController));

/**
 * 创建或更新角色武器
 * POST /api/v2/character/weapons
 * Body: {
 *   character_uuid: string,
 *   weapon_id: number,
 *   enhancement_level: number,
 *   refinement_level: number,
 *   special_attributes?: string
 * }
 */
router.post('/', databaseController.createOrUpdateCharacterWeapons.bind(databaseController));

/**
 * 更新角色武器
 * PUT /api/v2/character/weapons/:character_uuid
 * Body: Partial<CharacterWeapons> (不包含character_uuid)
 */
router.put('/:character_uuid', databaseController.createOrUpdateCharacterWeapons.bind(databaseController));

/**
 * 删除角色武器
 * DELETE /api/v2/character/weapons/:character_uuid
 */
router.delete('/:character_uuid', (req, res) => {
  res.status(501).json({
    success: false,
    message: '删除功能待实现',
    note: '可通过删除角色基础信息来级联删除'
  });
});

// ==================== 武器查询 ====================

/**
 * 根据武器ID查询角色
 * GET /api/v2/character/weapons/search/by-weapon/:weapon_id
 */
router.get('/search/by-weapon/:weapon_id', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按武器ID查询功能待实现'
  });
});

/**
 * 根据强化等级范围查询角色
 * GET /api/v2/character/weapons/search/by-enhancement
 * Query参数: min_level, max_level, page, limit
 */
router.get('/search/by-enhancement', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按强化等级查询功能待实现'
  });
});

/**
 * 根据精炼等级范围查询角色
 * GET /api/v2/character/weapons/search/by-refinement
 * Query参数: min_level, max_level, page, limit
 */
router.get('/search/by-refinement', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按精炼等级查询功能待实现'
  });
});

export default router;