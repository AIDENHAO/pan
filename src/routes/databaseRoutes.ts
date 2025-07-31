/**
 * 数据库管理路由配置
 * 定义数据库CRUD操作的API路由
 */
import { Router } from 'express';
import { DatabaseController } from '../controllers/DatabaseController.js';

// 创建路由实例
const router = Router();
const databaseController = new DatabaseController();

// ==================== 数据库统计 ====================
/**
 * 获取数据库统计信息
 * GET /api/database/stats
 */
router.get('/stats', databaseController.getDatabaseStats.bind(databaseController));

// ==================== 角色管理 ====================
/**
 * 获取所有角色
 * GET /api/database/characters
 */
router.get('/characters', databaseController.getAllCharacters.bind(databaseController));

/**
 * 根据ID获取角色
 * GET /api/database/characters/:id
 */
router.get('/characters/:id', databaseController.getCharacterById.bind(databaseController));

/**
 * 创建新角色
 * POST /api/database/characters
 */
router.post('/characters', databaseController.createCharacter.bind(databaseController));

/**
 * 更新角色信息
 * PUT /api/database/characters/:id
 */
router.put('/characters/:id', databaseController.updateCharacter.bind(databaseController));

/**
 * 删除角色
 * DELETE /api/database/characters/:id
 */
router.delete('/characters/:id', databaseController.deleteCharacter.bind(databaseController));

// ==================== 境界管理 ====================
/**
 * 获取所有境界
 * GET /api/database/realms
 */
router.get('/realms', databaseController.getAllRealms.bind(databaseController));

/**
 * 根据ID获取境界
 * GET /api/database/realms/:id
 */
router.get('/realms/:id', databaseController.getRealmById.bind(databaseController));

/**
 * 创建境界
 * POST /api/database/realms
 */
router.post('/realms', databaseController.createRealmData.bind(databaseController));

/**
 * 更新境界
 * PUT /api/database/realms/:id
 */
router.put('/realms/:id', databaseController.updateRealmData.bind(databaseController));

/**
 * 删除境界
 * DELETE /api/database/realms/:id
 */
router.delete('/realms/:id', databaseController.deleteRealmData.bind(databaseController));

// ==================== 技能管理 ====================
/**
 * 获取所有技能
 * GET /api/database/skills
 */
router.get('/skills', databaseController.getAllSkills.bind(databaseController));

/**
 * 根据ID获取技能
 * GET /api/database/skills/:id
 */
router.get('/skills/:id', databaseController.getSkillById.bind(databaseController));

/**
 * 创建技能
 * POST /api/database/skills
 */
router.post('/skills', databaseController.createSkillData.bind(databaseController));

/**
 * 更新技能
 * PUT /api/database/skills/:id
 */
router.put('/skills/:id', databaseController.updateSkillData.bind(databaseController));

/**
 * 删除技能
 * DELETE /api/database/skills/:id
 */
router.delete('/skills/:id', databaseController.deleteSkillData.bind(databaseController));

// ==================== 武器管理 ====================
/**
 * 获取所有武器
 * GET /api/database/weapons
 */
router.get('/weapons', databaseController.getAllWeapons.bind(databaseController));

/**
 * 根据ID获取武器
 * GET /api/database/weapons/:id
 */
router.get('/weapons/:id', databaseController.getWeaponById.bind(databaseController));

/**
 * 创建武器
 * POST /api/database/weapons
 */
router.post('/weapons', databaseController.createWeaponData.bind(databaseController));

/**
 * 更新武器
 * PUT /api/database/weapons/:id
 */
router.put('/weapons/:id', databaseController.updateWeaponData.bind(databaseController));

/**
 * 删除武器
 * DELETE /api/database/weapons/:id
 */
router.delete('/weapons/:id', databaseController.deleteWeaponData.bind(databaseController));

// ==================== 物品管理 ====================
/**
 * 获取所有物品
 * GET /api/database/items
 */
router.get('/items', databaseController.getAllItems.bind(databaseController));

/**
 * 根据ID获取物品
 * GET /api/database/items/:id
 */
router.get('/items/:id', databaseController.getItemById.bind(databaseController));

/**
 * 创建物品
 * POST /api/database/items
 */
router.post('/items', databaseController.createItemData.bind(databaseController));

/**
 * 更新物品
 * PUT /api/database/items/:id
 */
router.put('/items/:id', databaseController.updateItemData.bind(databaseController));

/**
 * 删除物品
 * DELETE /api/database/items/:id
 */
router.delete('/items/:id', databaseController.deleteItemData.bind(databaseController));

// ==================== 角色亲和度管理 ====================
/**
 * 获取角色亲和度
 * GET /api/database/character-affinities/:characterId
 */
router.get('/character-affinities/:characterId', databaseController.getCharacterAffinities.bind(databaseController));

/**
 * 创建或更新角色亲和度
 * POST /api/database/character-affinities
 */
router.post('/character-affinities', databaseController.createOrUpdateCharacterAffinities.bind(databaseController));

// ==================== 角色强度管理 ====================
/**
 * 获取角色强度
 * GET /api/database/character-strength/:characterId
 */
router.get('/character-strength/:characterId', databaseController.getCharacterStrength.bind(databaseController));

/**
 * 创建或更新角色强度
 * POST /api/database/character-strength
 */
router.post('/character-strength', databaseController.createOrUpdateCharacterStrength.bind(databaseController));

// ==================== 角色体质管理 ====================
/**
 * 获取角色体质
 * GET /api/database/character-body-types/:characterId
 */
router.get('/character-body-types/:characterId', databaseController.getCharacterBodyTypes.bind(databaseController));

/**
 * 创建或更新角色体质
 * POST /api/database/character-body-types
 */
router.post('/character-body-types', databaseController.createOrUpdateCharacterBodyTypes.bind(databaseController));

// ==================== 角色技能管理 ====================
/**
 * 获取角色技能
 * GET /api/database/character-skills/:characterId
 */
router.get('/character-skills/:characterId', databaseController.getCharacterSkills.bind(databaseController));

/**
 * 创建或更新角色技能
 * POST /api/database/character-skills
 */
router.post('/character-skills', databaseController.createOrUpdateCharacterSkills.bind(databaseController));

// ==================== 角色武器管理 ====================
/**
 * 获取角色武器
 * GET /api/database/character-weapons/:characterId
 */
router.get('/character-weapons/:characterId', databaseController.getCharacterWeapons.bind(databaseController));

/**
 * 创建或更新角色武器
 * POST /api/database/character-weapons
 */
router.post('/character-weapons', databaseController.createOrUpdateCharacterWeapons.bind(databaseController));

// ==================== 角色货币管理 ====================
/**
 * 获取角色货币
 * GET /api/database/character-currency/:characterId
 */
router.get('/character-currency/:characterId', databaseController.getCharacterCurrency.bind(databaseController));

/**
 * 创建或更新角色货币
 * POST /api/database/character-currency
 */
router.post('/character-currency', databaseController.createOrUpdateCharacterCurrency.bind(databaseController));

// ==================== 角色物品管理 ====================
/**
 * 获取所有角色物品
 * GET /api/database/character-items
 */
router.get('/character-items', databaseController.getAllCharacterItems.bind(databaseController));

/**
 * 获取角色物品列表
 * GET /api/database/character-items/:characterId
 */
router.get('/character-items/:characterId', databaseController.getCharacterItems.bind(databaseController));

/**
 * 创建角色物品
 * POST /api/database/character-items
 */
router.post('/character-items', databaseController.createCharacterItem.bind(databaseController));

/**
 * 更新角色物品
 * PUT /api/database/character-items/:id
 */
router.put('/character-items/:id', databaseController.updateCharacterItem.bind(databaseController));

/**
 * 删除角色物品
 * DELETE /api/database/character-items/:id
 */
router.delete('/character-items/:id', databaseController.deleteCharacterItem.bind(databaseController));

// ==================== 体质数据管理 ====================
/**
 * 获取所有体质数据
 * GET /api/database/body-types
 */
router.get('/body-types', databaseController.getAllBodyTypes.bind(databaseController));

/**
 * 根据ID获取体质数据
 * GET /api/database/body-types/:id
 */
router.get('/body-types/:id', databaseController.getBodyTypeById.bind(databaseController));

/**
 * 创建体质数据
 * POST /api/database/body-types
 */
router.post('/body-types', databaseController.createBodyTypeData.bind(databaseController));

/**
 * 更新体质数据
 * PUT /api/database/body-types/:id
 */
router.put('/body-types/:id', databaseController.updateBodyTypeData.bind(databaseController));

/**
 * 删除体质数据
 * DELETE /api/database/body-types/:id
 */
router.delete('/body-types/:id', databaseController.deleteBodyTypeData.bind(databaseController));

// ==================== 宗门数据管理 ====================
/**
 * 获取所有宗门数据
 * GET /api/database/zongmen
 */
router.get('/zongmen', databaseController.getAllZongmen.bind(databaseController));

/**
 * 根据ID获取宗门数据
 * GET /api/database/zongmen/:id
 */
router.get('/zongmen/:id', databaseController.getZongmenById.bind(databaseController));

/**
 * 创建宗门数据
 * POST /api/database/zongmen
 */
router.post('/zongmen', databaseController.createZongmenData.bind(databaseController));

/**
 * 更新宗门数据
 * PUT /api/database/zongmen/:id
 */
router.put('/zongmen/:id', databaseController.updateZongmenData.bind(databaseController));

/**
 * 删除宗门数据
 * DELETE /api/database/zongmen/:id
 */
router.delete('/zongmen/:id', databaseController.deleteZongmenData.bind(databaseController));

// ==================== 成就数据管理 ====================
/**
 * 获取所有成就数据
 * GET /api/database/achievements
 */
router.get('/achievements', databaseController.getAllAchievements.bind(databaseController));

/**
 * 根据ID获取成就数据
 * GET /api/database/achievements/:id
 */
router.get('/achievements/:id', databaseController.getAchievementById.bind(databaseController));

/**
 * 创建成就数据
 * POST /api/database/achievements
 */
router.post('/achievements', databaseController.createAchievementData.bind(databaseController));

/**
 * 更新成就数据
 * PUT /api/database/achievements/:id
 */
router.put('/achievements/:id', databaseController.updateAchievementData.bind(databaseController));

/**
 * 删除成就数据
 * DELETE /api/database/achievements/:id
 */
router.delete('/achievements/:id', databaseController.deleteAchievementData.bind(databaseController));

// ==================== 物品类型分类管理 ====================
/**
 * 获取所有物品类型分类
 * GET /api/database/item-categories
 */
router.get('/item-categories', databaseController.getAllItemCategories.bind(databaseController));

/**
 * 根据ID获取物品类型分类
 * GET /api/database/item-categories/:id
 */
router.get('/item-categories/:id', databaseController.getItemCategoryById.bind(databaseController));

/**
 * 创建物品类型分类
 * POST /api/database/item-categories
 */
router.post('/item-categories', databaseController.createItemCategoryData.bind(databaseController));

/**
 * 更新物品类型分类
 * PUT /api/database/item-categories/:id
 */
router.put('/item-categories/:id', databaseController.updateItemCategoryData.bind(databaseController));

/**
 * 删除物品类型分类
 * DELETE /api/database/item-categories/:id
 */
router.delete('/item-categories/:id', databaseController.deleteItemCategoryData.bind(databaseController));

// ==================== 角色基础信息管理 (兼容前端接口) ====================
/**
 * 获取所有角色基础信息
 * GET /api/database/character-base-info
 */
router.get('/character-base-info', databaseController.getAllCharacters.bind(databaseController));

/**
 * 根据ID获取角色基础信息
 * GET /api/database/character-base-info/:id
 */
router.get('/character-base-info/:id', databaseController.getCharacterById.bind(databaseController));

/**
 * 创建新角色基础信息
 * POST /api/database/character-base-info
 */
router.post('/character-base-info', databaseController.createCharacter.bind(databaseController));

/**
 * 更新角色基础信息
 * PUT /api/database/character-base-info/:id
 */
router.put('/character-base-info/:id', databaseController.updateCharacter.bind(databaseController));

/**
 * 删除角色基础信息
 * DELETE /api/database/character-base-info/:id
 */
router.delete('/character-base-info/:id', databaseController.deleteCharacter.bind(databaseController));

// ==================== 搜索功能 ====================
/**
 * 搜索角色
 * GET /api/database/search/characters?query=xxx&type=name|zongmen|realm
 */
router.get('/search/characters', databaseController.searchCharacters.bind(databaseController));

export default router;