/**
 * 角色管理模块验证器
 * 提供角色基础信息、亲和度、强度、技能、货币等数据的验证规则
 * 已与数据库表结构完全对齐
 */
import { body, param, query } from 'express-validator';
import { createValidationMiddleware, validateUUID } from './index';

// ==================== 角色UUID验证 ====================

/**
 * 角色UUID参数验证
 */
export const validateCharacterUUID = [
  param('character_uuid')
    .custom(validateUUID)
    .withMessage('角色UUID格式无效')
];

// ==================== 角色基础信息验证 ====================

/**
 * 创建角色基础信息验证
 * 对应数据库表: character_base_info
 */
export const validateCreateCharacterBaseInfo = createValidationMiddleware([
  body('character_name')
    .notEmpty()
    .withMessage('角色名称不能为空')
    .isLength({ min: 1, max: 20 })
    .withMessage('角色名称长度必须在1-20个字符之间')
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9_\-\s]+$/)
    .withMessage('角色名称只能包含中文、英文、数字、下划线、连字符和空格'),
    
  body('character_gender')
    .optional()
    .isIn(['男', '女', '其他'])
    .withMessage('性别必须是男、女或其他'),
    
  body('character_birthday')
    .optional()
    .isDate()
    .withMessage('生日格式无效，请使用YYYY-MM-DD格式'),
    
  body('character_dao_hao')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('道号长度必须在1-20个字符之间'),
    
  body('character_realm_Level')
    .isInt({ min: 0, max: 63 })
    .withMessage('境界等级必须是0-63之间的整数'),
    
  body('cultivatingState')
    .optional()
    .isIn(['未修练', '正在修炼', '闭关中', '受伤修炼中', '顿悟中'])
    .withMessage('修炼状态必须是有效的枚举值'),
    
  body('cultivationLimitBase')
    .optional()
    .isInt({ min: 0 })
    .withMessage('基础修炼值上限必须是非负整数'),
    
  body('cultivationLimitAdd')
    .optional()
    .isInt({ min: 0 })
    .withMessage('额外修炼值上限必须是非负整数'),
    
  body('cultivationValue')
    .optional()
    .isInt({ min: 0 })
    .withMessage('实际修炼值必须是非负整数'),
    
  body('cultivationOverLimit')
    .optional()
    .isBoolean()
    .withMessage('是否允许超限必须是布尔值'),
    
  body('cultivationSpeedBase')
    .optional()
    .isInt({ min: 0 })
    .withMessage('基础修炼速度必须是非负整数'),
    
  body('cultivationSpeedAdd')
    .optional()
    .isInt({ min: 0 })
    .withMessage('额外修炼速度必须是非负整数'),
    
  body('breakThroughEnabled')
    .optional()
    .isBoolean()
    .withMessage('修炼值是否满足必须是布尔值'),
    
  body('breakThroughItemsEnabled')
    .optional()
    .isBoolean()
    .withMessage('突破物品或条件是否满足必须是布尔值'),
    
  body('breakThroughState')
    .optional()
    .isBoolean()
    .withMessage('是否在突破必须是布尔值'),
    
  body('breakThroughFailNumb')
    .optional()
    .isInt({ min: 0 })
    .withMessage('突破失败次数必须是非负整数'),
    
  body('character_physicalAttributes')
    .optional()
    .isIn(['金', '木', '水', '火', '土'])
    .withMessage('体质五行属性必须是金、木、水、火、土之一'),
    
  body('zongMenJoinBool')
    .optional()
    .isBoolean()
    .withMessage('是否加入宗门必须是布尔值'),
    
  body('zongMen_id')
    .optional()
    .isLength({ min: 8, max: 8 })
    .withMessage('宗门ID必须是8位字符'),
    
  body('zongMenJoinDate')
    .optional()
    .isISO8601()
    .withMessage('加入时间格式无效，请使用ISO8601格式'),
    
  body('title_1_id')
    .optional()
    .isIn(['外门弟子', '内门弟子', '核心弟子', '长老', '掌门'])
    .withMessage('宗门身份必须是有效的枚举值'),
    
  body('title_2_id')
    .optional()
    .isIn(['初入宗门', '略有小成', '宗门栋梁', '宗门支柱', '宗门传奇'])
    .withMessage('宗门成就必须是有效的枚举值'),
    
  body('title_3_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('区域成就ID不能超过20个字符'),
    
  body('title_4_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('世界成就ID不能超过20个字符'),
    
  body('title_5_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('特殊成就ID不能超过20个字符')
]);

/**
 * 更新角色基础信息验证
 */
export const validateUpdateCharacterBaseInfo = createValidationMiddleware([
  ...validateCharacterUUID,
  
  body('character_name')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('角色名称长度必须在1-20个字符之间')
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9_\-\s]+$/)
    .withMessage('角色名称只能包含中文、英文、数字、下划线、连字符和空格'),
    
  body('character_gender')
    .optional()
    .isIn(['男', '女', '其他'])
    .withMessage('性别必须是男、女或其他'),
    
  body('character_birthday')
    .optional()
    .isDate()
    .withMessage('生日格式无效，请使用YYYY-MM-DD格式'),
    
  body('character_dao_hao')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('道号长度必须在1-20个字符之间'),
    
  body('character_realm_Level')
    .optional()
    .isInt({ min: 0, max: 63 })
    .withMessage('境界等级必须是0-63之间的整数'),
    
  body('cultivatingState')
    .optional()
    .isIn(['未修练', '正在修炼', '闭关中', '受伤修炼中', '顿悟中'])
    .withMessage('修炼状态必须是有效的枚举值'),
    
  body('cultivationLimitBase')
    .optional()
    .isInt({ min: 0 })
    .withMessage('基础修炼值上限必须是非负整数'),
    
  body('cultivationLimitAdd')
    .optional()
    .isInt({ min: 0 })
    .withMessage('额外修炼值上限必须是非负整数'),
    
  body('cultivationValue')
    .optional()
    .isInt({ min: 0 })
    .withMessage('实际修炼值必须是非负整数'),
    
  body('cultivationOverLimit')
    .optional()
    .isBoolean()
    .withMessage('是否允许超限必须是布尔值'),
    
  body('cultivationSpeedBase')
    .optional()
    .isInt({ min: 0 })
    .withMessage('基础修炼速度必须是非负整数'),
    
  body('cultivationSpeedAdd')
    .optional()
    .isInt({ min: 0 })
    .withMessage('额外修炼速度必须是非负整数'),
    
  body('breakThroughEnabled')
    .optional()
    .isBoolean()
    .withMessage('修炼值是否满足必须是布尔值'),
    
  body('breakThroughItemsEnabled')
    .optional()
    .isBoolean()
    .withMessage('突破物品或条件是否满足必须是布尔值'),
    
  body('breakThroughState')
    .optional()
    .isBoolean()
    .withMessage('是否在突破必须是布尔值'),
    
  body('breakThroughFailNumb')
    .optional()
    .isInt({ min: 0 })
    .withMessage('突破失败次数必须是非负整数'),
    
  body('character_physicalAttributes')
    .optional()
    .isIn(['金', '木', '水', '火', '土'])
    .withMessage('体质五行属性必须是金、木、水、火、土之一'),
    
  body('zongMenJoinBool')
    .optional()
    .isBoolean()
    .withMessage('是否加入宗门必须是布尔值'),
    
  body('zongMen_id')
    .optional()
    .isLength({ min: 8, max: 8 })
    .withMessage('宗门ID必须是8位字符'),
    
  body('zongMenJoinDate')
    .optional()
    .isISO8601()
    .withMessage('加入时间格式无效，请使用ISO8601格式'),
    
  body('title_1_id')
    .optional()
    .isIn(['外门弟子', '内门弟子', '核心弟子', '长老', '掌门'])
    .withMessage('宗门身份必须是有效的枚举值'),
    
  body('title_2_id')
    .optional()
    .isIn(['初入宗门', '略有小成', '宗门栋梁', '宗门支柱', '宗门传奇'])
    .withMessage('宗门成就必须是有效的枚举值'),
    
  body('title_3_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('区域成就ID不能超过20个字符'),
    
  body('title_4_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('世界成就ID不能超过20个字符'),
    
  body('title_5_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('特殊成就ID不能超过20个字符')
]);

// ==================== 角色亲和度验证 ====================

/**
 * 角色亲和度验证
 * 对应数据库表: character_affinities
 */
export const validateCharacterAffinities = createValidationMiddleware([
  body('character_uuid')
    .custom(validateUUID)
    .withMessage('角色UUID格式无效'),
    
  body('total_affinity')
    .optional()
    .isInt({ min: 0, max: 500 })
    .withMessage('总亲和度必须是0-500之间的整数'),
    
  body('metal_affinity')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('金属性亲和度必须是0-100之间的整数'),
    
  body('wood_affinity')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('木属性亲和度必须是0-100之间的整数'),
    
  body('water_affinity')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('水属性亲和度必须是0-100之间的整数'),
    
  body('fire_affinity')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('火属性亲和度必须是0-100之间的整数'),
    
  body('earth_affinity')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('土属性亲和度必须是0-100之间的整数')
]);

/**
 * 亲和度范围查询验证
 */
export const validateAffinityRangeQuery = createValidationMiddleware([
  query('min_fire')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('最小火属性亲和度必须是0-100之间的整数'),
    
  query('max_fire')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('最大火属性亲和度必须是0-100之间的整数'),
    
  query('min_water')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('最小水属性亲和度必须是0-100之间的整数'),
    
  query('max_water')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('最大水属性亲和度必须是0-100之间的整数'),
    
  query('min_total')
    .optional()
    .isInt({ min: 0, max: 500 })
    .withMessage('最小总亲和度必须是0-500之间的整数'),
    
  query('max_total')
    .optional()
    .isInt({ min: 0, max: 500 })
    .withMessage('最大总亲和度必须是0-500之间的整数'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('查询限制必须是1-100之间的整数'),
    
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('查询偏移量必须是非负整数')
]);

// ==================== 角色强度验证 ====================

/**
 * 角色强度验证
 * 对应数据库表: character_strength
 */
export const validateCharacterStrength = createValidationMiddleware([
  body('character_uuid')
    .custom(validateUUID)
    .withMessage('角色UUID格式无效'),
    
  body('physical_strength')
    .optional()
    .isInt({ min: 0 })
    .withMessage('体质强度必须是非负整数'),
    
  body('spiritual_strength')
    .optional()
    .isInt({ min: 0 })
    .withMessage('灵力强度必须是非负整数'),
    
  body('soul_strength')
    .optional()
    .isInt({ min: 0 })
    .withMessage('灵魂强度必须是非负整数'),
    
  body('blood_current')
    .optional()
    .isInt({ min: 0 })
    .withMessage('血气当前储值必须是非负整数'),
    
  body('blood_max')
    .optional()
    .isInt({ min: 0 })
    .withMessage('血气最大储值必须是非负整数'),
    
  body('blood_recovery_rate')
    .optional()
    .isInt({ min: 0 })
    .withMessage('血气恢复速率必须是非负整数'),
    
  body('blood_temp_add')
    .optional()
    .isInt({ min: 0 })
    .withMessage('血气临时增加必须是非负整数'),
    
  body('spiritual_current')
    .optional()
    .isInt({ min: 0 })
    .withMessage('灵气当前储值必须是非负整数'),
    
  body('spiritual_max')
    .optional()
    .isInt({ min: 0 })
    .withMessage('灵气最大储值必须是非负整数'),
    
  body('spiritual_recovery_rate')
    .optional()
    .isInt({ min: 0 })
    .withMessage('灵气恢复速率必须是非负整数'),
    
  body('spiritual_temp_add')
    .optional()
    .isInt({ min: 0 })
    .withMessage('灵力临时增加必须是非负整数'),
    
  body('mental_current')
    .optional()
    .isInt({ min: 0 })
    .withMessage('精神力当前储值必须是非负整数'),
    
  body('mental_max')
    .optional()
    .isInt({ min: 0 })
    .withMessage('精神力最大储值必须是非负整数'),
    
  body('mental_recovery_rate')
    .optional()
    .isInt({ min: 0 })
    .withMessage('精神力恢复速率必须是非负整数'),
    
  body('mental_temp_add')
    .optional()
    .isInt({ min: 0 })
    .withMessage('精神力临时增加必须是非负整数'),
    
  body('combat_power')
    .optional()
    .isInt({ min: 0 })
    .withMessage('当前战斗力必须是非负整数'),
    
  body('base_combat_power')
    .optional()
    .isInt({ min: 0 })
    .withMessage('基础战斗力必须是非负整数')
]);

/**
 * 战斗力范围查询验证
 */
export const validateCombatPowerRangeQuery = createValidationMiddleware([
  query('min_combat_power')
    .optional()
    .isInt({ min: 0 })
    .withMessage('最小战斗力必须是非负整数'),
    
  query('max_combat_power')
    .optional()
    .isInt({ min: 0 })
    .withMessage('最大战斗力必须是非负整数'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('查询限制必须是1-100之间的整数'),
    
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('查询偏移量必须是非负整数')
]);

// ==================== 角色技能验证 ====================

/**
 * 角色技能验证
 * 对应数据库表: character_skills
 */
export const validateCharacterSkills = createValidationMiddleware([
  body('character_uuid')
    .custom(validateUUID)
    .withMessage('角色UUID格式无效'),
    
  body('skill_1_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('装备的心法ID不能超过20个字符'),
    
  body('skill_2_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('装备的功法1ID不能超过20个字符'),
    
  body('skill_3_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('装备的功法2ID不能超过20个字符'),
    
  body('skill_4_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('装备的武技1ID不能超过20个字符'),
    
  body('skill_5_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('装备的武技2ID不能超过20个字符'),
    
  body('skill_6_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('装备的武技3ID不能超过20个字符'),
    
  body('skill_7_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('装备的秘术/禁术1ID不能超过20个字符'),
    
  body('skill_8_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('装备的秘术/禁术2ID不能超过20个字符'),
    
  body('skill_9_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('装备的秘术/禁术3ID不能超过20个字符'),
    
  body('skill_10_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('装备的秘术/禁术4ID不能超过20个字符')
]);

// ==================== 角色武器验证 ====================

/**
 * 角色武器验证
 * 对应数据库表: character_weapons
 */
export const validateCharacterWeapons = createValidationMiddleware([
  body('character_uuid')
    .custom(validateUUID)
    .withMessage('角色UUID格式无效'),
    
  body('weapon_1_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('兵器1ID不能超过20个字符'),
    
  body('weapon_2_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('兵器2ID不能超过20个字符'),
    
  body('weapon_3_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('兵器3ID不能超过20个字符'),
    
  body('weapon_4_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('兵器4ID不能超过20个字符'),
    
  body('weapon_5_id')
    .optional()
    .isLength({ max: 20 })
    .withMessage('兵器5ID不能超过20个字符')
]);

// ==================== 角色货币验证 ====================

/**
 * 角色货币验证
 * 对应数据库表: character_currency
 */
export const validateCharacterCurrency = createValidationMiddleware([
  body('character_uuid')
    .custom(validateUUID)
    .withMessage('角色UUID格式无效'),
    
  body('copper_coin')
    .optional()
    .isInt({ min: 0 })
    .withMessage('铜币数量必须是非负整数'),
    
  body('silver_coin')
    .optional()
    .isInt({ min: 0 })
    .withMessage('银币数量必须是非负整数'),
    
  body('gold_coin')
    .optional()
    .isInt({ min: 0 })
    .withMessage('金币数量必须是非负整数'),
    
  body('low_spirit_stone')
    .optional()
    .isInt({ min: 0 })
    .withMessage('下品灵石数量必须是非负整数'),
    
  body('medium_spirit_stone')
    .optional()
    .isInt({ min: 0 })
    .withMessage('中品灵石数量必须是非负整数'),
    
  body('high_spirit_stone')
    .optional()
    .isInt({ min: 0 })
    .withMessage('极品灵石数量必须是非负整数'),
    
  body('zongmen_contribution')
    .optional()
    .isInt({ min: 0 })
    .withMessage('宗门贡献必须是非负整数'),
    
  body('region_contribution')
    .optional()
    .isInt({ min: 0 })
    .withMessage('区域贡献必须是非负整数'),
    
  body('world_contribution')
    .optional()
    .isInt({ min: 0 })
    .withMessage('世界贡献必须是非负整数'),
    
  body('special_contribution_1')
    .optional()
    .isInt({ min: 0 })
    .withMessage('特殊贡献1必须是非负整数'),
    
  body('special_contribution_2')
    .optional()
    .isInt({ min: 0 })
    .withMessage('特殊贡献2必须是非负整数'),
    
  body('special_contribution_3')
    .optional()
    .isInt({ min: 0 })
    .withMessage('特殊贡献3必须是非负整数')
]);

/**
 * 财富排行榜查询验证
 */
export const validateWealthLeaderboardQuery = createValidationMiddleware([
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('查询限制必须是1-100之间的整数'),
    
  query('currency_type')
    .optional()
    .isIn([
      'copper_coin', 'silver_coin', 'gold_coin', 
      'low_spirit_stone', 'medium_spirit_stone', 'high_spirit_stone',
      'zongmen_contribution', 'region_contribution', 'world_contribution',
      'total_wealth'
    ])
    .withMessage('货币类型无效')
]);

// ==================== 角色体质类型验证 ====================

/**
 * 角色体质类型验证
 * 对应数据库表: character_body_types
 */
export const validateCharacterBodyTypes = createValidationMiddleware([
  body('character_uuid')
    .custom(validateUUID)
    .withMessage('角色UUID格式无效'),
    
  body('body_type_1_id')
    .optional()
    .isLength({ min: 4, max: 4 })
    .withMessage('特殊体质1的ID必须是4位字符'),
    
  body('body_type_2_id')
    .optional()
    .isLength({ min: 4, max: 4 })
    .withMessage('特殊体质2的ID必须是4位字符'),
    
  body('body_type_3_id')
    .optional()
    .isLength({ min: 4, max: 4 })
    .withMessage('特殊体质3的ID必须是4位字符'),
    
  body('body_type_4_id')
    .optional()
    .isLength({ min: 4, max: 4 })
    .withMessage('特殊体质4的ID必须是4位字符'),
    
  body('body_type_5_id')
    .optional()
    .isLength({ min: 4, max: 4 })
    .withMessage('特殊体质5的ID必须是4位字符')
]);

// ==================== 通用查询验证 ====================

/**
 * 分页查询验证
 */
export const validatePaginationQuery = createValidationMiddleware([
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('页码必须是正整数'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('每页数量必须是1-100之间的整数'),
    
  query('sort_by')
    .optional()
    .isString()
    .withMessage('排序字段必须是字符串'),
    
  query('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('排序方向必须是asc或desc')
]);

/**
 * 日期范围查询验证
 */
export const validateDateRangeQuery = createValidationMiddleware([
  query('start_date')
    .optional()
    .isISO8601()
    .withMessage('开始日期格式无效，请使用ISO8601格式'),
    
  query('end_date')
    .optional()
    .isISO8601()
    .withMessage('结束日期格式无效，请使用ISO8601格式')
]);

export default {
  validateCharacterUUID,
  validateCreateCharacterBaseInfo,
  validateUpdateCharacterBaseInfo,
  validateCharacterAffinities,
  validateAffinityRangeQuery,
  validateCharacterStrength,
  validateCombatPowerRangeQuery,
  validateCharacterSkills,
  validateCharacterWeapons,
  validateCharacterCurrency,
  validateWealthLeaderboardQuery,
  validateCharacterBodyTypes,
  validatePaginationQuery,
  validateDateRangeQuery
};