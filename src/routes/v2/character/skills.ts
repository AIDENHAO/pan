/**
 * 角色技能路由
 * 对应数据库表: character_skills
 * 主键: character_uuid
 * 外键: character_uuid -> character_base_info.character_uuid
 * 外键: skill_id -> skill_data.skill_id
 */
import { Router } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';

const router = Router();
const databaseController = new DatabaseController();

// ==================== 角色技能 CRUD ====================

/**
 * 根据character_uuid获取角色技能
 * GET /api/v2/character/skills/:character_uuid
 * 返回: CharacterSkills | null
 */
router.get('/:character_uuid', databaseController.getCharacterSkills.bind(databaseController));

/**
 * 创建或更新角色技能
 * POST /api/v2/character/skills
 * Body: {
 *   character_uuid: string,
 *   skill_id: number,
 *   skill_level: number,
 *   experience_points: number,
 *   mastery_level?: string
 * }
 */
router.post('/', databaseController.createOrUpdateCharacterSkills.bind(databaseController));

/**
 * 更新角色技能
 * PUT /api/v2/character/skills/:character_uuid
 * Body: Partial<CharacterSkills> (不包含character_uuid)
 */
router.put('/:character_uuid', databaseController.createOrUpdateCharacterSkills.bind(databaseController));

/**
 * 删除角色技能
 * DELETE /api/v2/character/skills/:character_uuid
 */
router.delete('/:character_uuid', (req, res) => {
  res.status(501).json({
    success: false,
    message: '删除功能待实现',
    note: '可通过删除角色基础信息来级联删除'
  });
});

// ==================== 技能查询 ====================

/**
 * 根据技能ID查询角色
 * GET /api/v2/character/skills/search/by-skill/:skill_id
 */
router.get('/search/by-skill/:skill_id', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按技能ID查询功能待实现'
  });
});

/**
 * 根据技能等级范围查询角色
 * GET /api/v2/character/skills/search/by-level
 * Query参数: min_level, max_level, skill_id, page, limit
 */
router.get('/search/by-level', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按技能等级查询功能待实现'
  });
});

/**
 * 根据熟练度等级查询角色
 * GET /api/v2/character/skills/search/by-mastery
 * Query参数: mastery_level, page, limit
 */
router.get('/search/by-mastery', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按熟练度等级查询功能待实现'
  });
});

export default router;