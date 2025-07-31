/**
 * 宗门数据路由
 * 对应数据库表: zongmen_data
 * 主键: zongmen_id
 */
import { Router } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';

const router = Router();
const databaseController = new DatabaseController();

// ==================== 宗门数据 CRUD ====================

/**
 * 获取所有宗门数据
 * GET /api/v2/static-data/zongmen
 * 支持分页和排序
 */
router.get('/', databaseController.getAllZongmen.bind(databaseController));

/**
 * 根据zongmen_id获取宗门数据
 * GET /api/v2/static-data/zongmen/:zongmen_id
 */
router.get('/:zongmen_id', databaseController.getZongmenById.bind(databaseController));

/**
 * 创建新宗门数据
 * POST /api/v2/static-data/zongmen
 * Body: {
 *   zongmen_name: string,
 *   zongmen_type: string,
 *   founding_date?: string,
 *   location?: string,
 *   specialization?: string,
 *   reputation_level?: number,
 *   description?: string
 * }
 */
router.post('/', databaseController.createZongmenData.bind(databaseController));

/**
 * 更新宗门数据
 * PUT /api/v2/static-data/zongmen/:zongmen_id
 * Body: Partial<ZongmenData> (不包含zongmen_id)
 */
router.put('/:zongmen_id', databaseController.updateZongmenData.bind(databaseController));

/**
 * 删除宗门数据
 * DELETE /api/v2/static-data/zongmen/:zongmen_id
 * 注意：删除前需要检查是否有角色属于此宗门
 */
router.delete('/:zongmen_id', databaseController.deleteZongmenData.bind(databaseController));

// ==================== 宗门查询 ====================

/**
 * 根据宗门类型查询
 * GET /api/v2/static-data/zongmen/search/by-type/:zongmen_type
 */
router.get('/search/by-type/:zongmen_type', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按宗门类型查询功能待实现'
  });
});

/**
 * 根据地理位置查询
 * GET /api/v2/static-data/zongmen/search/by-location
 * Query参数: location (模糊匹配), page, limit
 */
router.get('/search/by-location', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按地理位置查询功能待实现'
  });
});

/**
 * 根据专业领域查询
 * GET /api/v2/static-data/zongmen/search/by-specialization
 * Query参数: specialization (模糊匹配), page, limit
 */
router.get('/search/by-specialization', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按专业领域查询功能待实现'
  });
});

/**
 * 根据声望等级范围查询
 * GET /api/v2/static-data/zongmen/search/by-reputation
 * Query参数: min_reputation, max_reputation, page, limit
 */
router.get('/search/by-reputation', (req, res) => {
  res.status(501).json({
    success: false,
    message: '按声望等级查询功能待实现'
  });
});

/**
 * 获取宗门统计信息
 * GET /api/v2/static-data/zongmen/stats
 */
router.get('/stats', (req, res) => {
  res.status(501).json({
    success: false,
    message: '宗门统计信息功能待实现'
  });
});

export default router;