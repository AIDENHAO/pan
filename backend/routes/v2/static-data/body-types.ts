/**
 * 体质类型数据路由
 * 对应数据库表: body_type_data
 * 主键: body_type_id
 */
import { Router } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';

const router = Router();
const databaseController = new DatabaseController();

// ==================== 体质类型数据 CRUD ====================

/**
 * 获取所有体质类型数据
 * GET /api/v2/static-data/body-types
 * 支持分页和排序
 */
router.get('/', databaseController.getAllBodyTypes.bind(databaseController));

/**
 * 根据body_type_id获取体质类型数据
 * GET /api/v2/static-data/body-types/:body_type_id
 */
router.get('/:body_type_id', databaseController.getBodyTypeById.bind(databaseController));

/**
 * 创建新体质类型数据
 * POST /api/v2/static-data/body-types
 * Body: {
 *   body_type_name: string,
 *   rarity_level: string,
 *   base_attributes: string,
 *   special_abilities?: string,
 *   awakening_conditions?: string,
 *   description?: string
 * }
 */
router.post('/', databaseController.createBodyTypeData.bind(databaseController));

/**
 * 更新体质类型数据
 * PUT /api/v2/static-data/body-types/:body_type_id
 * Body: Partial<BodyTypeData> (不包含body_type_id)
 */
router.put('/:body_type_id', databaseController.updateBodyTypeData.bind(databaseController));

/**
 * 删除体质类型数据
 * DELETE /api/v2/static-data/body-types/:body_type_id
 * 注意：删除前需要检查是否有角色拥有此体质类型
 */
router.delete('/:body_type_id', databaseController.deleteBodyTypeData.bind(databaseController));

// ==================== 体质类型查询 ====================

/**
 * 根据稀有度等级查询
 * GET /api/v2/static-data/body-types/search/by-rarity/:rarity_level
 */
router.get('/search/by-rarity/:rarity_level', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按稀有度等级查询功能待实现'
  });
});

/**
 * 根据基础属性查询
 * GET /api/v2/static-data/body-types/search/by-attributes
 * Query参数: attributes (模糊匹配), page, limit
 */
router.get('/search/by-attributes', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按基础属性查询功能待实现'
  });
});

/**
 * 根据特殊能力查询
 * GET /api/v2/static-data/body-types/search/by-abilities
 * Query参数: abilities (模糊匹配), page, limit
 */
router.get('/search/by-abilities', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按特殊能力查询功能待实现'
  });
});

/**
 * 获取体质类型统计信息
 * GET /api/v2/static-data/body-types/stats
 */
router.get('/stats', (req, res) => {
  res.status(501).json({
    success: false,
    message: '体质类型统计信息功能待实现'
  });
});

export default router;