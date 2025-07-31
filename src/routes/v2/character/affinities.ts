/**
 * 角色五行亲和度路由
 * 对应数据库表: character_affinities
 * 主键: character_uuid
 * 外键: character_uuid -> character_base_info.character_uuid
 */
import { Router } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';

const router = Router();
const databaseController = new DatabaseController();

// ==================== 角色亲和度 CRUD ====================

/**
 * 根据character_uuid获取角色亲和度
 * GET /api/v2/character/affinities/:character_uuid
 * 返回: CharacterAffinities | null
 */
router.get('/:character_uuid', databaseController.getCharacterAffinities.bind(databaseController));

/**
 * 创建或更新角色亲和度
 * POST /api/v2/character/affinities
 * Body: {
 *   character_uuid: string,
 *   metal_affinity: number,
 *   wood_affinity: number,
 *   water_affinity: number,
 *   fire_affinity: number,
 *   earth_affinity: number
 * }
 */
router.post('/', databaseController.createOrUpdateCharacterAffinities.bind(databaseController));

/**
 * 更新角色亲和度
 * PUT /api/v2/character/affinities/:character_uuid
 * Body: Partial<CharacterAffinities> (不包含character_uuid)
 */
router.put('/:character_uuid', databaseController.createOrUpdateCharacterAffinities.bind(databaseController));

/**
 * 删除角色亲和度
 * DELETE /api/v2/character/affinities/:character_uuid
 */
router.delete('/:character_uuid', (req, res) => {
  // 可以通过character DAL的deleteByCharacterId方法实现
  res.status(501).json({
    success: false,
    message: '删除功能待实现',
    note: '可通过删除角色基础信息来级联删除'
  });
});

// ==================== 亲和度查询 ====================

/**
 * 根据亲和度范围查询角色
 * GET /api/v2/character/affinities/search/by-range
 * Query参数: min_total, max_total, page, limit
 */
router.get('/search/by-range', (req, res) => {
  // 使用CharacterAffinitiesDAL的findByAffinityRange方法
  res.status(501).json({
    success: false,
    message: '按亲和度范围查询功能待实现'
  });
});

export default router;