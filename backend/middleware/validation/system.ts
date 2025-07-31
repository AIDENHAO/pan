/**
 * 系统管理模块验证器
 * 提供健康检查、统计信息、版本信息等系统相关的验证规则
 */
import { body, param, query } from 'express-validator';
import { createValidationMiddleware } from './index.js';

// ==================== 健康检查验证 ====================

/**
 * 健康检查查询验证
 */
export const validateHealthCheckQuery = createValidationMiddleware([
  query('include_database')
    .optional()
    .isBoolean()
    .withMessage('数据库检查标志必须是布尔值'),
    
  query('include_cache')
    .optional()
    .isBoolean()
    .withMessage('缓存检查标志必须是布尔值'),
    
  query('include_external')
    .optional()
    .isBoolean()
    .withMessage('外部服务检查标志必须是布尔值'),
    
  query('timeout')
    .optional()
    .isInt({ min: 1000, max: 30000 })
    .withMessage('超时时间必须是1000-30000毫秒之间的整数')
]);

/**
 * 数据库健康检查验证
 */
export const validateDatabaseHealthQuery = createValidationMiddleware([
  query('check_connections')
    .optional()
    .isBoolean()
    .withMessage('连接检查标志必须是布尔值'),
    
  query('check_performance')
    .optional()
    .isBoolean()
    .withMessage('性能检查标志必须是布尔值'),
    
  query('include_metrics')
    .optional()
    .isBoolean()
    .withMessage('指标包含标志必须是布尔值')
]);

// ==================== 统计信息验证 ====================

/**
 * 数据库统计查询验证
 */
export const validateDatabaseStatsQuery = createValidationMiddleware([
  query('table_name')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('表名长度必须在1-50个字符之间')
    .matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
    .withMessage('表名只能包含字母、数字和下划线，且必须以字母或下划线开头'),
    
  query('include_size')
    .optional()
    .isBoolean()
    .withMessage('包含大小信息标志必须是布尔值'),
    
  query('include_indexes')
    .optional()
    .isBoolean()
    .withMessage('包含索引信息标志必须是布尔值'),
    
  query('include_performance')
    .optional()
    .isBoolean()
    .withMessage('包含性能信息标志必须是布尔值')
]);

/**
 * 系统统计查询验证
 */
export const validateSystemStatsQuery = createValidationMiddleware([
  query('include_memory')
    .optional()
    .isBoolean()
    .withMessage('包含内存信息标志必须是布尔值'),
    
  query('include_cpu')
    .optional()
    .isBoolean()
    .withMessage('包含CPU信息标志必须是布尔值'),
    
  query('include_disk')
    .optional()
    .isBoolean()
    .withMessage('包含磁盘信息标志必须是布尔值'),
    
  query('include_network')
    .optional()
    .isBoolean()
    .withMessage('包含网络信息标志必须是布尔值'),
    
  query('time_range')
    .optional()
    .isIn(['1h', '6h', '24h', '7d', '30d'])
    .withMessage('时间范围必须是1h、6h、24h、7d或30d')
]);

/**
 * 用户活动统计查询验证
 */
export const validateUserActivityStatsQuery = createValidationMiddleware([
  query('start_date')
    .optional()
    .isISO8601()
    .withMessage('开始日期格式无效，请使用ISO8601格式'),
    
  query('end_date')
    .optional()
    .isISO8601()
    .withMessage('结束日期格式无效，请使用ISO8601格式'),
    
  query('group_by')
    .optional()
    .isIn(['hour', 'day', 'week', 'month'])
    .withMessage('分组方式必须是hour、day、week或month'),
    
  query('include_details')
    .optional()
    .isBoolean()
    .withMessage('包含详细信息标志必须是布尔值')
]);

// ==================== 版本信息验证 ====================

/**
 * 版本信息查询验证
 */
export const validateVersionQuery = createValidationMiddleware([
  query('include_dependencies')
    .optional()
    .isBoolean()
    .withMessage('包含依赖信息标志必须是布尔值'),
    
  query('include_build_info')
    .optional()
    .isBoolean()
    .withMessage('包含构建信息标志必须是布尔值'),
    
  query('include_git_info')
    .optional()
    .isBoolean()
    .withMessage('包含Git信息标志必须是布尔值')
]);

// ==================== 系统状态验证 ====================

/**
 * 系统状态查询验证
 */
export const validateSystemStatusQuery = createValidationMiddleware([
  query('detailed')
    .optional()
    .isBoolean()
    .withMessage('详细信息标志必须是布尔值'),
    
  query('include_services')
    .optional()
    .isBoolean()
    .withMessage('包含服务状态标志必须是布尔值'),
    
  query('include_resources')
    .optional()
    .isBoolean()
    .withMessage('包含资源状态标志必须是布尔值'),
    
  query('refresh_cache')
    .optional()
    .isBoolean()
    .withMessage('刷新缓存标志必须是布尔值')
]);

// ==================== 系统配置验证 ====================

/**
 * 系统配置更新验证
 */
export const validateSystemConfigUpdate = createValidationMiddleware([
  body('config_key')
    .notEmpty()
    .withMessage('配置键不能为空')
    .isLength({ min: 1, max: 100 })
    .withMessage('配置键长度必须在1-100个字符之间')
    .matches(/^[a-zA-Z_][a-zA-Z0-9_\.]*$/)
    .withMessage('配置键只能包含字母、数字、下划线和点号，且必须以字母或下划线开头'),
    
  body('config_value')
    .notEmpty()
    .withMessage('配置值不能为空'),
    
  body('config_type')
    .optional()
    .isIn(['string', 'number', 'boolean', 'json', 'array'])
    .withMessage('配置类型必须是string、number、boolean、json或array'),
    
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('配置描述不能超过500个字符'),
    
  body('is_sensitive')
    .optional()
    .isBoolean()
    .withMessage('敏感信息标志必须是布尔值'),
    
  body('requires_restart')
    .optional()
    .isBoolean()
    .withMessage('需要重启标志必须是布尔值')
]);

/**
 * 系统配置查询验证
 */
export const validateSystemConfigQuery = createValidationMiddleware([
  query('config_key')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('配置键长度必须在1-100个字符之间'),
    
  query('include_sensitive')
    .optional()
    .isBoolean()
    .withMessage('包含敏感信息标志必须是布尔值'),
    
  query('config_type')
    .optional()
    .isIn(['string', 'number', 'boolean', 'json', 'array'])
    .withMessage('配置类型必须是string、number、boolean、json或array')
]);

// ==================== 日志管理验证 ====================

/**
 * 日志查询验证
 */
export const validateLogQuery = createValidationMiddleware([
  query('level')
    .optional()
    .isIn(['error', 'warn', 'info', 'debug', 'trace'])
    .withMessage('日志级别必须是error、warn、info、debug或trace'),
    
  query('start_time')
    .optional()
    .isISO8601()
    .withMessage('开始时间格式无效，请使用ISO8601格式'),
    
  query('end_time')
    .optional()
    .isISO8601()
    .withMessage('结束时间格式无效，请使用ISO8601格式'),
    
  query('source')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('日志源长度必须在1-50个字符之间'),
    
  query('message_contains')
    .optional()
    .isString()
    .isLength({ min: 1, max: 200 })
    .withMessage('消息内容搜索长度必须在1-200个字符之间'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('查询限制必须是1-1000之间的整数'),
    
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('查询偏移量必须是非负整数')
]);

/**
 * 日志级别设置验证
 */
export const validateLogLevelUpdate = createValidationMiddleware([
  body('logger_name')
    .notEmpty()
    .withMessage('日志器名称不能为空')
    .isLength({ min: 1, max: 100 })
    .withMessage('日志器名称长度必须在1-100个字符之间'),
    
  body('level')
    .isIn(['error', 'warn', 'info', 'debug', 'trace'])
    .withMessage('日志级别必须是error、warn、info、debug或trace'),
    
  body('temporary')
    .optional()
    .isBoolean()
    .withMessage('临时设置标志必须是布尔值'),
    
  body('duration_minutes')
    .optional()
    .isInt({ min: 1, max: 1440 })
    .withMessage('持续时间必须是1-1440分钟之间的整数')
]);

// ==================== 缓存管理验证 ====================

/**
 * 缓存操作验证
 */
export const validateCacheOperation = createValidationMiddleware([
  body('cache_key')
    .optional()
    .isString()
    .isLength({ min: 1, max: 200 })
    .withMessage('缓存键长度必须在1-200个字符之间'),
    
  body('cache_pattern')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('缓存模式长度必须在1-100个字符之间'),
    
  body('operation')
    .isIn(['clear', 'refresh', 'delete', 'stats'])
    .withMessage('缓存操作必须是clear、refresh、delete或stats')
]);

/**
 * 缓存统计查询验证
 */
export const validateCacheStatsQuery = createValidationMiddleware([
  query('include_keys')
    .optional()
    .isBoolean()
    .withMessage('包含键信息标志必须是布尔值'),
    
  query('include_memory')
    .optional()
    .isBoolean()
    .withMessage('包含内存信息标志必须是布尔值'),
    
  query('key_pattern')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('键模式长度必须在1-100个字符之间')
]);

export default {
  validateHealthCheckQuery,
  validateDatabaseHealthQuery,
  validateDatabaseStatsQuery,
  validateSystemStatsQuery,
  validateUserActivityStatsQuery,
  validateVersionQuery,
  validateSystemStatusQuery,
  validateSystemConfigUpdate,
  validateSystemConfigQuery,
  validateLogQuery,
  validateLogLevelUpdate,
  validateCacheOperation,
  validateCacheStatsQuery
};