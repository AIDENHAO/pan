/**
 * 物品数据路由
 * 对应数据库表: item_data
 * 主键: item_id
 */
import { Router } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';

const router = Router();
const databaseController = new DatabaseController();

// ==================== 物品数据 CRUD ====================

/**
 * 获取所有物品数据
 * GET /api/v2/static-data/items
 * 支持分页和排序
 */
router.get('/', databaseController.getAllItems.bind(databaseController));

/**
 * 根据item_id获取物品数据
 * GET /api/v2/static-data/items/:item_id
 */
router.get('/:item_id', databaseController.getItemById.bind(databaseController));

/**
 * 创建新物品数据
 * POST /api/v2/static-data/items
 * Body: {
 *   item_name: string,
 *   item_type: string,
 *   item_grade: string,
 *   effect_description?: string,
 *   usage_method?: string,
 *   stack_limit?: number,
 *   market_value?: number,
 *   rarity_level?: string
 * }
 */
router.post('/', databaseController.createItemData.bind(databaseController));

/**
 * 更新物品数据
 * PUT /api/v2/static-data/items/:item_id
 * Body: Partial<ItemData> (不包含item_id)
 */
router.put('/:item_id', databaseController.updateItemData.bind(databaseController));

/**
 * 删除物品数据
 * DELETE /api/v2/static-data/items/:item_id
 * 注意：删除前需要检查是否有角色拥有此物品
 */
router.delete('/:item_id', databaseController.deleteItemData.bind(databaseController));

// ==================== 物品查询 ====================

/**
 * 根据物品类型查询
 * GET /api/v2/static-data/items/search/by-type/:item_type
 */
router.get('/search/by-type/:item_type', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按物品类型查询功能待实现'
  });
});

/**
 * 根据物品品级查询
 * GET /api/v2/static-data/items/search/by-grade/:item_grade
 */
router.get('/search/by-grade/:item_grade', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按物品品级查询功能待实现'
  });
});

/**
 * 根据稀有度等级查询
 * GET /api/v2/static-data/items/search/by-rarity/:rarity_level
 */
router.get('/search/by-rarity/:rarity_level', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按稀有度等级查询功能待实现'
  });
});

/**
 * 根据市场价值范围查询
 * GET /api/v2/static-data/items/search/by-value
 * Query参数: min_value, max_value, page, limit
 */
router.get('/search/by-value', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按市场价值查询功能待实现'
  });
});

/**
 * 根据堆叠限制查询
 * GET /api/v2/static-data/items/search/by-stack-limit
 * Query参数: min_limit, max_limit, page, limit
 */
router.get('/search/by-stack-limit', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按堆叠限制查询功能待实现'
  });
});

export default router;