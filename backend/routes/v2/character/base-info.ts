/**
 * 角色基础信息路由
 * 对应数据库表: character_base_info
 * 主键: character_uuid
 */
import { Router } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';

const router = Router();
const databaseController = new DatabaseController();

// ==================== 角色基础信息 CRUD ====================

/**
 * 获取所有角色基础信息
 * GET /api/v2/character/base-info
 * 支持分页和搜索
 */
router.get('/', databaseController.getAllCharacters.bind(databaseController));

// ==================== 角色搜索 ====================

/**
 * 搜索角色
 * GET /api/v2/character/base-info/search
 * Query参数: name, zongmen_name, realm_name, page, limit
 */
router.get('/search', databaseController.searchCharacters.bind(databaseController));

/**
 * 根据character_uuid获取角色基础信息
 * GET /api/v2/character/base-info/:character_uuid
 */
router.get('/:character_uuid', databaseController.getCharacterById.bind(databaseController));

/**
 * 创建新角色基础信息
 * POST /api/v2/character/base-info
 * Body: CharacterBaseInfo (不包含character_uuid，由系统生成)
 */
router.post('/', databaseController.createCharacter.bind(databaseController));

/**
 * 更新角色基础信息
 * PUT /api/v2/character/base-info/:character_uuid
 * Body: Partial<CharacterBaseInfo>
 */
router.put('/:character_uuid', databaseController.updateCharacter.bind(databaseController));

/**
 * 删除角色基础信息
 * DELETE /api/v2/character/base-info/:character_uuid
 * 注意：这将级联删除所有相关的角色数据
 */
router.delete('/:character_uuid', databaseController.deleteCharacter.bind(databaseController));

export default router;