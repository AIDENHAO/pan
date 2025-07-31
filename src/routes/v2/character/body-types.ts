/**
 * 角色体质类型路由
 * 对应数据库表: character_body_types
 * 主键: character_uuid
 * 外键: character_uuid -> character_base_info.character_uuid
 * 外键: body_type_id -> body_type_data.body_type_id
 */
import { Router } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';

const router = Router();
const databaseController = new DatabaseController();

// ==================== 角色体质类型 CRUD ====================

/**
 * 根据character_uuid获取角色体质类型
 * GET /api/v2/character/body-types/:character_uuid
 * 返回: CharacterBodyTypes | null
 */
router.get('/:character_uuid', databaseController.getCharacterBodyTypes.bind(databaseController));

/**
 * 创建或更新角色体质类型
 * POST /api/v2/character/body-types
 * Body: {
 *   character_uuid: string,
 *   body_type_id: number,
 *   awakening_level: number,
 *   special_abilities?: string
 * }
 */
router.post('/', databaseController.createOrUpdateCharacterBodyTypes.bind(databaseController));

/**
 * 更新角色体质类型
 * PUT /api/v2/character/body-types/:character_uuid
 * Body: Partial<CharacterBodyTypes> (不包含character_uuid)
 */
router.put('/:character_uuid', databaseController.createOrUpdateCharacterBodyTypes.bind(databaseController));

/**
 * 删除角色体质类型
 * DELETE /api/v2/character/body-types/:character_uuid
 */
router.delete('/:character_uuid', (req, res) => {
  res.status(501).json({
    success: false,
    message: '删除功能待实现',
    note: '可通过删除角色基础信息来级联删除'
  });
});

// ==================== 体质类型查询 ====================

/**
 * 根据体质类型ID查询角色
 * GET /api/v2/character/body-types/search/by-type/:body_type_id
 */
router.get('/search/by-type/:body_type_id', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按体质类型查询功能待实现'
  });
});

/**
 * 根据觉醒等级范围查询角色
 * GET /api/v2/character/body-types/search/by-awakening
 * Query参数: min_level, max_level, page, limit
 */
router.get('/search/by-awakening', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按觉醒等级查询功能待实现'
  });
});

export default router;