/**
 * 武器数据路由
 * 对应数据库表: weapon_data
 * 主键: weapon_id
 */
import { Router } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';

const router = Router();
const databaseController = new DatabaseController();

// ==================== 武器数据 CRUD ====================

/**
 * 获取所有武器数据
 * GET /api/v2/static-data/weapons
 * 支持分页和排序
 */
router.get('/', databaseController.getAllWeapons.bind(databaseController));

/**
 * 根据weapon_id获取武器数据
 * GET /api/v2/static-data/weapons/:weapon_id
 */
router.get('/:weapon_id', databaseController.getWeaponById.bind(databaseController));

/**
 * 创建新武器数据
 * POST /api/v2/static-data/weapons
 * Body: {
 *   weapon_name: string,
 *   weapon_type: string,
 *   weapon_grade: string,
 *   attack_power: number,
 *   durability: number,
 *   special_effects?: string,
 *   description?: string,
 *   required_level?: number
 * }
 */
router.post('/', databaseController.createWeaponData.bind(databaseController));

/**
 * 更新武器数据
 * PUT /api/v2/static-data/weapons/:weapon_id
 * Body: Partial<WeaponData> (不包含weapon_id)
 */
router.put('/:weapon_id', databaseController.updateWeaponData.bind(databaseController));

/**
 * 删除武器数据
 * DELETE /api/v2/static-data/weapons/:weapon_id
 * 注意：删除前需要检查是否有角色装备此武器
 */
router.delete('/:weapon_id', databaseController.deleteWeaponData.bind(databaseController));

// ==================== 武器查询 ====================

/**
 * 根据武器类型查询
 * GET /api/v2/static-data/weapons/search/by-type/:weapon_type
 */
router.get('/search/by-type/:weapon_type', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按武器类型查询功能待实现'
  });
});

/**
 * 根据武器品级查询
 * GET /api/v2/static-data/weapons/search/by-grade/:weapon_grade
 */
router.get('/search/by-grade/:weapon_grade', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按武器品级查询功能待实现'
  });
});

/**
 * 根据攻击力范围查询
 * GET /api/v2/static-data/weapons/search/by-attack
 * Query参数: min_attack, max_attack, page, limit
 */
router.get('/search/by-attack', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按攻击力查询功能待实现'
  });
});

/**
 * 根据耐久度范围查询
 * GET /api/v2/static-data/weapons/search/by-durability
 * Query参数: min_durability, max_durability, page, limit
 */
router.get('/search/by-durability', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按耐久度查询功能待实现'
  });
});

export default router;