/**
 * 兼容性模块验证器
 * 提供旧版API的验证规则，确保向后兼容性
 */
import { body, param, query } from 'express-validator';
import { createValidationMiddleware } from './index.js';

// ==================== 旧版掌门API验证 ====================

/**
 * 旧版掌门ID参数验证
 */
export const validateLegacyLeaderId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('掌门ID必须是正整数')
];

/**
 * 旧版掌门数据验证（兼容旧格式）
 */
export const validateLegacyLeaderData = createValidationMiddleware([
  body('name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('掌门名称长度必须在1-50个字符之间'),
    
  body('level')
    .optional()
    .isInt({ min: 0, max: 63 })
    .withMessage('掌门等级必须是0-63之间的整数'),
    
  body('sect')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('宗门名称长度必须在1-50个字符之间'),
    
  body('power')
    .optional()
    .isInt({ min: 0 })
    .withMessage('掌门实力必须是非负整数'),
    
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('掌门描述不能超过500个字符'),
    
  // 兼容旧版字段
  body('cultivation_level')
    .optional()
    .isInt({ min: 0, max: 63 })
    .withMessage('修炼等级必须是0-63之间的整数'),
    
  body('sect_position')
    .optional()
    .isString()
    .withMessage('宗门职位必须是字符串'),
    
  body('achievements')
    .optional()
    .isArray()
    .withMessage('成就列表必须是数组格式')
]);

/**
 * 旧版掌门查询验证
 */
export const validateLegacyLeaderQuery = createValidationMiddleware([
  query('sect')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('宗门名称长度必须在1-50个字符之间'),
    
  query('min_level')
    .optional()
    .isInt({ min: 0, max: 63 })
    .withMessage('最小等级必须是0-63之间的整数'),
    
  query('max_level')
    .optional()
    .isInt({ min: 0, max: 63 })
    .withMessage('最大等级必须是0-63之间的整数'),
    
  query('sort')
    .optional()
    .isIn(['name', 'level', 'power', 'sect'])
    .withMessage('排序字段必须是name、level、power或sect'),
    
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('排序方向必须是asc或desc')
]);

// ==================== 旧版宗门API验证 ====================

/**
 * 旧版宗门ID参数验证
 */
export const validateLegacyZongmenId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('宗门ID必须是正整数')
];

/**
 * 旧版宗门数据验证（兼容旧格式）
 */
export const validateLegacyZongmenData = createValidationMiddleware([
  body('name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('宗门名称长度必须在1-50个字符之间'),
    
  body('type')
    .optional()
    .isIn(['正道', '魔道', '中立', '隐世', '古宗'])
    .withMessage('宗门类型必须是正道、魔道、中立、隐世或古宗'),
    
  body('location')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('宗门位置长度必须在1-100个字符之间'),
    
  body('reputation')
    .optional()
    .isInt({ min: 0 })
    .withMessage('宗门声望必须是非负整数'),
    
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('宗门描述不能超过1000个字符'),
    
  // 兼容旧版字段
  body('sect_type')
    .optional()
    .isString()
    .withMessage('宗门类型必须是字符串'),
    
  body('founding_year')
    .optional()
    .isInt({ min: 1, max: 9999 })
    .withMessage('创建年份必须是1-9999之间的整数'),
    
  body('member_count')
    .optional()
    .isInt({ min: 0 })
    .withMessage('成员数量必须是非负整数'),
    
  body('specialties')
    .optional()
    .isArray()
    .withMessage('宗门特色必须是数组格式')
]);

/**
 * 旧版宗门查询验证
 */
export const validateLegacyZongmenQuery = createValidationMiddleware([
  query('type')
    .optional()
    .isIn(['正道', '魔道', '中立', '隐世', '古宗'])
    .withMessage('宗门类型必须是正道、魔道、中立、隐世或古宗'),
    
  query('location')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('宗门位置长度必须在1-100个字符之间'),
    
  query('min_reputation')
    .optional()
    .isInt({ min: 0 })
    .withMessage('最小声望必须是非负整数'),
    
  query('max_reputation')
    .optional()
    .isInt({ min: 0 })
    .withMessage('最大声望必须是非负整数'),
    
  query('sort')
    .optional()
    .isIn(['name', 'type', 'reputation', 'location'])
    .withMessage('排序字段必须是name、type、reputation或location')
]);

// ==================== 旧版映射数据验证 ====================

/**
 * 旧版映射ID参数验证
 */
export const validateLegacyMappingId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('映射ID必须是正整数')
];

/**
 * 旧版映射数据验证
 */
export const validateLegacyMappingData = createValidationMiddleware([
  body('old_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('旧ID必须是正整数'),
    
  body('new_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('新ID必须是正整数'),
    
  body('mapping_type')
    .optional()
    .isIn(['leader', 'sect', 'character', 'item', 'skill'])
    .withMessage('映射类型必须是leader、sect、character、item或skill'),
    
  body('old_format')
    .optional()
    .isString()
    .withMessage('旧格式必须是字符串'),
    
  body('new_format')
    .optional()
    .isString()
    .withMessage('新格式必须是字符串'),
    
  body('migration_status')
    .optional()
    .isIn(['pending', 'completed', 'failed', 'skipped'])
    .withMessage('迁移状态必须是pending、completed、failed或skipped'),
    
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('备注不能超过500个字符')
]);

/**
 * 旧版映射查询验证
 */
export const validateLegacyMappingQuery = createValidationMiddleware([
  query('mapping_type')
    .optional()
    .isIn(['leader', 'sect', 'character', 'item', 'skill'])
    .withMessage('映射类型必须是leader、sect、character、item或skill'),
    
  query('migration_status')
    .optional()
    .isIn(['pending', 'completed', 'failed', 'skipped'])
    .withMessage('迁移状态必须是pending、completed、failed或skipped'),
    
  query('old_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('旧ID必须是正整数'),
    
  query('new_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('新ID必须是正整数')
]);

// ==================== 旧版数据库操作验证 ====================

/**
 * 旧版数据库表名验证
 */
export const validateLegacyTableName = [
  param('table')
    .isIn(['leaders', 'sects', 'characters', 'items', 'skills', 'mappings'])
    .withMessage('表名必须是leaders、sects、characters、items、skills或mappings')
];

/**
 * 旧版数据库查询验证
 */
export const validateLegacyDatabaseQuery = createValidationMiddleware([
  query('fields')
    .optional()
    .isString()
    .withMessage('字段列表必须是字符串'),
    
  query('where')
    .optional()
    .isString()
    .withMessage('查询条件必须是字符串'),
    
  query('order_by')
    .optional()
    .isString()
    .withMessage('排序字段必须是字符串'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('查询限制必须是1-1000之间的整数'),
    
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('查询偏移量必须是非负整数')
]);

// ==================== 通用兼容性验证 ====================

/**
 * 旧版API版本验证
 */
export const validateLegacyApiVersion = createValidationMiddleware([
  query('api_version')
    .optional()
    .isIn(['v1', 'v1.1', 'v1.2'])
    .withMessage('API版本必须是v1、v1.1或v1.2'),
    
  query('compatibility_mode')
    .optional()
    .isBoolean()
    .withMessage('兼容模式标志必须是布尔值'),
    
  query('strict_validation')
    .optional()
    .isBoolean()
    .withMessage('严格验证标志必须是布尔值')
]);

/**
 * 旧版分页查询验证
 */
export const validateLegacyPaginationQuery = createValidationMiddleware([
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('页码必须是正整数'),
    
  query('per_page')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('每页数量必须是1-100之间的整数'),
    
  query('sort_by')
    .optional()
    .isString()
    .withMessage('排序字段必须是字符串'),
    
  query('sort_dir')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('排序方向必须是asc或desc'),
    
  query('search')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('搜索关键词长度必须在1-100个字符之间')
]);

/**
 * 旧版数据格式转换验证
 */
export const validateLegacyDataConversion = createValidationMiddleware([
  body('source_format')
    .isIn(['json', 'xml', 'csv', 'legacy_db'])
    .withMessage('源格式必须是json、xml、csv或legacy_db'),
    
  body('target_format')
    .isIn(['json', 'xml', 'csv', 'new_db'])
    .withMessage('目标格式必须是json、xml、csv或new_db'),
    
  body('data')
    .notEmpty()
    .withMessage('转换数据不能为空'),
    
  body('preserve_ids')
    .optional()
    .isBoolean()
    .withMessage('保留ID标志必须是布尔值'),
    
  body('validate_output')
    .optional()
    .isBoolean()
    .withMessage('验证输出标志必须是布尔值')
]);

export default {
  validateLegacyLeaderId,
  validateLegacyLeaderData,
  validateLegacyLeaderQuery,
  validateLegacyZongmenId,
  validateLegacyZongmenData,
  validateLegacyZongmenQuery,
  validateLegacyMappingId,
  validateLegacyMappingData,
  validateLegacyMappingQuery,
  validateLegacyTableName,
  validateLegacyDatabaseQuery,
  validateLegacyApiVersion,
  validateLegacyPaginationQuery,
  validateLegacyDataConversion
};