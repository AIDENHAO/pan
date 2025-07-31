/**
 * 物品分类路由
 * 对应数据库表: item_type_category
 * 主键: category_id
 */
import { Router } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';

const router = Router();
const databaseController = new DatabaseController();

// ==================== 物品分类 CRUD ====================

/**
 * 获取所有物品分类
 * GET /api/v2/static-data/item-categories
 * 支持分页和排序
 */
router.get('/', databaseController.getAllItemCategories.bind(databaseController));

/**
 * 根据category_id获取物品分类
 * GET /api/v2/static-data/item-categories/:category_id
 */
router.get('/:category_id', databaseController.getItemCategoryById.bind(databaseController));

/**
 * 创建新物品分类
 * POST /api/v2/static-data/item-categories
 * Body: {
 *   category_name: string,
 *   parent_category_id?: number,
 *   description?: string,
 *   sort_order?: number
 * }
 */
router.post('/', databaseController.createItemCategoryData.bind(databaseController));

/**
 * 更新物品分类
 * PUT /api/v2/static-data/item-categories/:category_id
 * Body: Partial<ItemTypeCategory> (不包含category_id)
 */
router.put('/:category_id', databaseController.updateItemCategoryData.bind(databaseController));

/**
 * 删除物品分类
 * DELETE /api/v2/static-data/item-categories/:category_id
 * 注意：删除前需要检查是否有子分类或物品使用此分类
 */
router.delete('/:category_id', databaseController.deleteItemCategoryData.bind(databaseController));

// ==================== 物品分类查询 ====================

/**
 * 根据父分类ID查询子分类
 * GET /api/v2/static-data/item-categories/search/by-parent/:parent_category_id
 */
router.get('/search/by-parent/:parent_category_id', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按父分类查询子分类功能待实现'
  });
});

/**
 * 获取顶级分类（无父分类）
 * GET /api/v2/static-data/item-categories/search/top-level
 */
router.get('/search/top-level', (req, res) => {
  res.status(501).json({
    success: false,
    message: '获取顶级分类功能待实现'
  });
});

/**
 * 获取分类树结构
 * GET /api/v2/static-data/item-categories/tree
 */
router.get('/tree', (req, res) => {
  res.status(501).json({
    success: false,
    message: '获取分类树结构功能待实现'
  });
});

/**
 * 根据排序顺序查询
 * GET /api/v2/static-data/item-categories/search/by-order
 * Query参数: min_order, max_order, page, limit
 */
router.get('/search/by-order', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按排序顺序查询功能待实现'
  });
});

/**
 * 获取分类统计信息
 * GET /api/v2/static-data/item-categories/stats
 */
router.get('/stats', (req, res) => {
  res.status(501).json({
    success: false,
    message: '分类统计信息功能待实现'
  });
});

export default router;