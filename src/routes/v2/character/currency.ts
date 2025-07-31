/**
 * 角色货币路由
 * 对应数据库表: character_currency
 * 主键: character_uuid
 * 外键: character_uuid -> character_base_info.character_uuid
 */
import { Router } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';

const router = Router();
const databaseController = new DatabaseController();

// ==================== 角色货币 CRUD ====================

/**
 * 根据character_uuid获取角色货币
 * GET /api/v2/character/currency/:character_uuid
 * 返回: CharacterCurrency | null
 */
router.get('/:character_uuid', databaseController.getCharacterCurrency.bind(databaseController));

/**
 * 创建或更新角色货币
 * POST /api/v2/character/currency
 * Body: {
 *   character_uuid: string,
 *   spirit_stones: number,
 *   gold_coins: number,
 *   silver_coins: number,
 *   copper_coins: number,
 *   contribution_points: number,
 *   sect_points: number
 * }
 */
router.post('/', databaseController.createOrUpdateCharacterCurrency.bind(databaseController));

/**
 * 更新角色货币
 * PUT /api/v2/character/currency/:character_uuid
 * Body: Partial<CharacterCurrency> (不包含character_uuid)
 */
router.put('/:character_uuid', databaseController.createOrUpdateCharacterCurrency.bind(databaseController));

/**
 * 删除角色货币
 * DELETE /api/v2/character/currency/:character_uuid
 */
router.delete('/:character_uuid', (req, res) => {
  res.status(501).json({
    success: false,
    message: '删除功能待实现',
    note: '可通过删除角色基础信息来级联删除'
  });
});

// ==================== 货币查询 ====================

/**
 * 根据灵石数量范围查询角色
 * GET /api/v2/character/currency/search/by-spirit-stones
 * Query参数: min_amount, max_amount, page, limit
 */
router.get('/search/by-spirit-stones', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按灵石数量查询功能待实现'
  });
});

/**
 * 根据贡献点范围查询角色
 * GET /api/v2/character/currency/search/by-contribution
 * Query参数: min_points, max_points, page, limit
 */
router.get('/search/by-contribution', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按贡献点查询功能待实现'
  });
});

/**
 * 获取财富排行榜
 * GET /api/v2/character/currency/ranking/wealth
 * Query参数: currency_type (spirit_stones|gold_coins|contribution_points), limit
 */
router.get('/ranking/wealth', (req, res) => {
  res.status(501).json({
    success: false,
    message: '财富排行榜功能待实现'
  });
});

export default router;