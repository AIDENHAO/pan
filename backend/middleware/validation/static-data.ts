/**
 * 静态数据模块验证器
 * 提供境界、技能、武器、物品等静态数据的验证规则
 */
import { body, param, query } from 'express-validator';
import { createValidationMiddleware } from './index.js';

// ==================== 境界数据验证 ====================

/**
 * 境界等级参数验证
 */
export const validateRealmLevel = [
  param('realm_level')
    .isInt({ min: 0, max: 63 })
    .withMessage('境界等级必须是0-63之间的整数')
];

/**
 * 创建境界数据验证
 */
export const validateCreateRealmData = createValidationMiddleware([
  body('realm_level')
    .isInt({ min: 0, max: 63 })
    .withMessage('境界等级必须是0-63之间的整数'),
    
  body('stage_division')
    .notEmpty()
    .withMessage('阶段划分不能为空')
    .isLength({ min: 1, max: 20 })
    .withMessage('阶段划分长度必须在1-20个字符之间'),
    
  body('major_realm')
    .notEmpty()
    .withMessage('大境界不能为空')
    .isLength({ min: 1, max: 30 })
    .withMessage('大境界长度必须在1-30个字符之间'),
    
  body('minor_realm')
    .notEmpty()
    .withMessage('小境界不能为空')
    .isLength({ min: 1, max: 30 })
    .withMessage('小境界长度必须在1-30个字符之间'),
    
  body('stage')
    .notEmpty()
    .withMessage('阶段不能为空')
    .isLength({ min: 1, max: 20 })
    .withMessage('阶段长度必须在1-20个字符之间'),
    
  body('cultivation_start_value')
    .optional()
    .isInt({ min: 0 })
    .withMessage('修炼值起始必须是非负整数'),
    
  body('base_cultivation_limit')
    .isInt({ min: 0 })
    .withMessage('基础修炼值上限必须是非负整数'),
    
  body('base_cultivation_speed')
    .isInt({ min: 0 })
    .withMessage('基础修炼值增加速度必须是非负整数'),
    
  body('base_physical_strength')
    .isInt({ min: 0 })
    .withMessage('体质强度必须是非负整数'),
    
  body('base_spiritual_strength')
    .isInt({ min: 0 })
    .withMessage('灵力强度必须是非负整数'),
    
  body('base_soul_strength')
    .isInt({ min: 0 })
    .withMessage('灵魂强度必须是非负整数'),
    
  body('base_spiritual_storage')
    .optional()
    .isInt({ min: 0 })
    .withMessage('基础灵气储值必须是非负整数'),
    
  body('base_blood_storage')
    .optional()
    .isInt({ min: 0 })
    .withMessage('基础血气储值必须是非负整数'),
    
  body('base_mental_storage')
    .optional()
    .isInt({ min: 0 })
    .withMessage('基础精神力储值必须是非负整数'),
    
  body('base_spiritual_recovery_rate')
    .optional()
    .isInt({ min: 0 })
    .withMessage('基础灵气恢复速率必须是非负整数'),
    
  body('base_blood_recovery_rate')
    .optional()
    .isInt({ min: 0 })
    .withMessage('基础血气恢复速率必须是非负整数'),
    
  body('base_mental_recovery_rate')
    .optional()
    .isInt({ min: 0 })
    .withMessage('基础精神力恢复速率必须是非负整数')
]);

/**
 * 更新境界数据验证
 */
export const validateUpdateRealmData = createValidationMiddleware([
  body('stage_division')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('阶段划分长度必须在1-20个字符之间'),
    
  body('major_realm')
    .optional()
    .isLength({ min: 1, max: 30 })
    .withMessage('大境界长度必须在1-30个字符之间'),
    
  body('minor_realm')
    .optional()
    .isLength({ min: 1, max: 30 })
    .withMessage('小境界长度必须在1-30个字符之间'),
    
  body('stage')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('阶段长度必须在1-20个字符之间'),
    
  body('cultivation_start_value')
    .optional()
    .isInt({ min: 0 })
    .withMessage('修炼值起始必须是非负整数'),
    
  body('base_cultivation_limit')
    .optional()
    .isInt({ min: 0 })
    .withMessage('基础修炼值上限必须是非负整数'),
    
  body('base_cultivation_speed')
    .optional()
    .isInt({ min: 0 })
    .withMessage('基础修炼值增加速度必须是非负整数'),
    
  body('base_physical_strength')
    .optional()
    .isInt({ min: 0 })
    .withMessage('体质强度必须是非负整数'),
    
  body('base_spiritual_strength')
    .optional()
    .isInt({ min: 0 })
    .withMessage('灵力强度必须是非负整数'),
    
  body('base_soul_strength')
    .optional()
    .isInt({ min: 0 })
    .withMessage('灵魂强度必须是非负整数')
]);

/**
 * 境界等级范围查询验证
 */
export const validateRealmLevelRangeQuery = createValidationMiddleware([
  query('min_level')
    .optional()
    .isInt({ min: 0, max: 63 })
    .withMessage('最小等级必须是0-63之间的整数'),
    
  query('max_level')
    .optional()
    .isInt({ min: 0, max: 63 })
    .withMessage('最大等级必须是0-63之间的整数'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('查询限制必须是1-100之间的整数'),
    
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('查询偏移量必须是非负整数')
]);

// ==================== 技能数据验证 ====================

/**
 * 技能ID参数验证
 */
export const validateSkillId = [
  param('skill_id')
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage('技能ID必须是1-20个字符的字符串')
];

/**
 * 创建技能数据验证
 */
export const validateCreateSkillData = createValidationMiddleware([
  body('skill_id')
    .notEmpty()
    .withMessage('技能ID不能为空')
    .isLength({ min: 1, max: 20 })
    .withMessage('技能ID长度必须在1-20个字符之间'),
    
  body('skill_name')
    .notEmpty()
    .withMessage('技能名称不能为空')
    .isLength({ min: 1, max: 50 })
    .withMessage('技能名称长度必须在1-50个字符之间'),
    
  body('skill_type')
    .isIn(['心法', '功法', '武技', '秘术', '禁术'])
    .withMessage('技能类型必须是心法、功法、武技、秘术或禁术'),
    
  body('skill_realm_requirement')
    .isInt({ min: 0, max: 63 })
    .withMessage('境界要求必须是0-63之间的整数'),
    
  body('skill_description')
    .optional()
    .isString()
    .withMessage('技能描述必须是字符串'),
    
  body('skill_power')
    .isInt({ min: 0 })
    .withMessage('功法威力必须是非负整数')
]);

/**
 * 更新技能数据验证
 */
export const validateUpdateSkillData = createValidationMiddleware([
  body('skill_name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('技能名称长度必须在1-50个字符之间'),
    
  body('skill_type')
    .optional()
    .isIn(['心法', '功法', '武技', '秘术', '禁术'])
    .withMessage('技能类型必须是心法、功法、武技、秘术或禁术'),
    
  body('skill_realm_requirement')
    .optional()
    .isInt({ min: 0, max: 63 })
    .withMessage('境界要求必须是0-63之间的整数'),
    
  body('skill_description')
    .optional()
    .isString()
    .withMessage('技能描述必须是字符串'),
    
  body('skill_power')
    .optional()
    .isInt({ min: 0 })
    .withMessage('功法威力必须是非负整数')
]);

/**
 * 技能类型查询验证
 */
export const validateSkillTypeQuery = createValidationMiddleware([
  query('skill_type')
    .optional()
    .isIn(['心法', '功法', '武技', '秘术', '禁术'])
    .withMessage('技能类型必须是心法、功法、武技、秘术或禁术'),
    
  query('min_realm_requirement')
    .optional()
    .isInt({ min: 0, max: 63 })
    .withMessage('最小境界要求必须是0-63之间的整数'),
    
  query('max_realm_requirement')
    .optional()
    .isInt({ min: 0, max: 63 })
    .withMessage('最大境界要求必须是0-63之间的整数')
]);

// ==================== 武器数据验证 ====================

/**
 * 武器ID参数验证
 */
export const validateWeaponId = [
  param('weapon_id')
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage('武器ID必须是1-20个字符的字符串')
];

/**
 * 创建武器数据验证
 */
export const validateCreateWeaponData = createValidationMiddleware([
  body('weapon_id')
    .notEmpty()
    .withMessage('武器ID不能为空')
    .isLength({ min: 1, max: 20 })
    .withMessage('武器ID长度必须在1-20个字符之间'),
    
  body('weapon_name')
    .notEmpty()
    .withMessage('武器名称不能为空')
    .isLength({ min: 1, max: 50 })
    .withMessage('武器名称长度必须在1-50个字符之间'),
    
  body('weapon_type')
    .isIn(['剑', '刀', '枪', '弓', '杖', '拳套', '鞭', '扇'])
    .withMessage('武器类型必须是剑、刀、枪、弓、杖、拳套、鞭或扇'),
    
  body('weapon_quality')
    .isIn(['凡品', '灵品', '宝品', '仙品', '神品'])
    .withMessage('武器品质必须是凡品、灵品、宝品、仙品或神品'),
    
  body('weapon_description')
    .optional()
    .isString()
    .withMessage('武器描述必须是字符串'),
    
  body('weapon_realm_requirement')
    .isInt({ min: 0, max: 63 })
    .withMessage('境界要求必须是0-63之间的整数'),
    
  body('weapon_attack_bonus')
    .isInt({ min: 0 })
    .withMessage('攻击加成必须是非负整数'),
    
  body('weapon_defense_bonus')
    .isInt({ min: 0 })
    .withMessage('防御加成必须是非负整数'),
    
  body('weapon_health_bonus')
    .isInt({ min: 0 })
    .withMessage('生命加成必须是非负整数'),
    
  body('weapon_mana_bonus')
    .isInt({ min: 0 })
    .withMessage('法力加成必须是非负整数'),
    
  body('weapon_special_effect')
    .optional()
    .isString()
    .withMessage('特殊效果必须是字符串')
]);

/**
 * 更新武器数据验证
 */
export const validateUpdateWeaponData = createValidationMiddleware([
  body('weapon_name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('武器名称长度必须在1-50个字符之间'),
    
  body('weapon_type')
    .optional()
    .isIn(['剑', '刀', '枪', '弓', '杖', '拳套', '鞭', '扇'])
    .withMessage('武器类型必须是剑、刀、枪、弓、杖、拳套、鞭或扇'),
    
  body('weapon_quality')
    .optional()
    .isIn(['凡品', '灵品', '宝品', '仙品', '神品'])
    .withMessage('武器品质必须是凡品、灵品、宝品、仙品或神品'),
    
  body('weapon_description')
    .optional()
    .isString()
    .withMessage('武器描述必须是字符串'),
    
  body('weapon_realm_requirement')
    .optional()
    .isInt({ min: 0, max: 63 })
    .withMessage('境界要求必须是0-63之间的整数'),
    
  body('weapon_attack_bonus')
    .optional()
    .isInt({ min: 0 })
    .withMessage('攻击加成必须是非负整数'),
    
  body('weapon_defense_bonus')
    .optional()
    .isInt({ min: 0 })
    .withMessage('防御加成必须是非负整数'),
    
  body('weapon_health_bonus')
    .optional()
    .isInt({ min: 0 })
    .withMessage('生命加成必须是非负整数'),
    
  body('weapon_mana_bonus')
    .optional()
    .isInt({ min: 0 })
    .withMessage('法力加成必须是非负整数'),
    
  body('weapon_special_effect')
    .optional()
    .isString()
    .withMessage('特殊效果必须是字符串')
]);

/**
 * 武器类型查询验证
 */
export const validateWeaponTypeQuery = createValidationMiddleware([
  query('weapon_type')
    .optional()
    .isIn(['剑', '刀', '枪', '弓', '杖', '拳套', '鞭', '扇'])
    .withMessage('武器类型必须是剑、刀、枪、弓、杖、拳套、鞭或扇'),
    
  query('weapon_quality')
    .optional()
    .isIn(['凡品', '灵品', '宝品', '仙品', '神品'])
    .withMessage('武器品质必须是凡品、灵品、宝品、仙品或神品'),
    
  query('min_realm_requirement')
    .optional()
    .isInt({ min: 0, max: 63 })
    .withMessage('最小境界要求必须是0-63之间的整数'),
    
  query('max_realm_requirement')
    .optional()
    .isInt({ min: 0, max: 63 })
    .withMessage('最大境界要求必须是0-63之间的整数')
]);

// ==================== 物品数据验证 ====================

/**
 * 物品ID参数验证
 */
export const validateItemId = [
  param('item_id')
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage('物品ID必须是1-20个字符的字符串')
];

/**
 * 创建物品数据验证
 */
export const validateCreateItemData = createValidationMiddleware([
  body('item_id')
    .notEmpty()
    .withMessage('物品ID不能为空')
    .isLength({ min: 1, max: 20 })
    .withMessage('物品ID长度必须在1-20个字符之间'),
    
  body('item_name')
    .notEmpty()
    .withMessage('物品名称不能为空')
    .isLength({ min: 1, max: 50 })
    .withMessage('物品名称长度必须在1-50个字符之间'),
    
  body('item_type')
    .isIn(['丹药', '材料', '宝物', '秘籍', '符箓', '阵法', '其他'])
    .withMessage('物品类型必须是丹药、材料、宝物、秘籍、符箓、阵法或其他'),
    
  body('item_quality')
    .isIn(['凡品', '灵品', '宝品', '仙品', '神品'])
    .withMessage('物品品质必须是凡品、灵品、宝品、仙品或神品'),
    
  body('item_description')
    .optional()
    .isString()
    .withMessage('物品描述必须是字符串'),
    
  body('item_realm_requirement')
    .isInt({ min: 0, max: 63 })
    .withMessage('境界要求必须是0-63之间的整数'),
    
  body('item_attack_bonus')
    .isInt({ min: 0 })
    .withMessage('攻击加成必须是非负整数'),
    
  body('item_defense_bonus')
    .isInt({ min: 0 })
    .withMessage('防御加成必须是非负整数'),
    
  body('item_health_bonus')
    .isInt({ min: 0 })
    .withMessage('生命加成必须是非负整数'),
    
  body('item_mana_bonus')
    .isInt({ min: 0 })
    .withMessage('法力加成必须是非负整数'),
    
  body('item_special_effect')
    .optional()
    .isString()
    .withMessage('特殊效果必须是字符串'),
    
  body('item_stackable')
    .isBoolean()
    .withMessage('是否可堆叠必须是布尔值'),
    
  body('item_max_stack')
    .isInt({ min: 1 })
    .withMessage('最大堆叠数量必须是正整数'),
    
  body('item_sell_price')
    .isInt({ min: 0 })
    .withMessage('出售价格必须是非负整数'),
    
  body('item_buy_price')
    .isInt({ min: 0 })
    .withMessage('购买价格必须是非负整数'),
    
  body('item_bindable')
    .isBoolean()
    .withMessage('是否绑定必须是布尔值')
]);

/**
 * 更新物品数据验证
 */
export const validateUpdateItemData = createValidationMiddleware([
  body('item_name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('物品名称长度必须在1-50个字符之间'),
    
  body('item_type')
    .optional()
    .isIn(['丹药', '材料', '宝物', '秘籍', '符箓', '阵法', '其他'])
    .withMessage('物品类型必须是丹药、材料、宝物、秘籍、符箓、阵法或其他'),
    
  body('item_quality')
    .optional()
    .isIn(['凡品', '灵品', '宝品', '仙品', '神品'])
    .withMessage('物品品质必须是凡品、灵品、宝品、仙品或神品'),
    
  body('item_description')
    .optional()
    .isString()
    .withMessage('物品描述必须是字符串'),
    
  body('item_realm_requirement')
    .optional()
    .isInt({ min: 0, max: 63 })
    .withMessage('境界要求必须是0-63之间的整数'),
    
  body('item_attack_bonus')
    .optional()
    .isInt({ min: 0 })
    .withMessage('攻击加成必须是非负整数'),
    
  body('item_defense_bonus')
    .optional()
    .isInt({ min: 0 })
    .withMessage('防御加成必须是非负整数'),
    
  body('item_health_bonus')
    .optional()
    .isInt({ min: 0 })
    .withMessage('生命加成必须是非负整数'),
    
  body('item_mana_bonus')
    .optional()
    .isInt({ min: 0 })
    .withMessage('法力加成必须是非负整数'),
    
  body('item_special_effect')
    .optional()
    .isString()
    .withMessage('特殊效果必须是字符串'),
    
  body('item_stackable')
    .optional()
    .isBoolean()
    .withMessage('是否可堆叠必须是布尔值'),
    
  body('item_max_stack')
    .optional()
    .isInt({ min: 1 })
    .withMessage('最大堆叠数量必须是正整数'),
    
  body('item_sell_price')
    .optional()
    .isInt({ min: 0 })
    .withMessage('出售价格必须是非负整数'),
    
  body('item_buy_price')
    .optional()
    .isInt({ min: 0 })
    .withMessage('购买价格必须是非负整数'),
    
  body('item_bindable')
    .optional()
    .isBoolean()
    .withMessage('是否绑定必须是布尔值')
]);

/**
 * 物品类型查询验证
 */
export const validateItemTypeQuery = createValidationMiddleware([
  query('item_type')
    .optional()
    .isIn(['丹药', '材料', '宝物', '秘籍', '符箓', '阵法', '其他'])
    .withMessage('物品类型必须是丹药、材料、宝物、秘籍、符箓、阵法或其他'),
    
  query('item_quality')
    .optional()
    .isIn(['凡品', '灵品', '宝品', '仙品', '神品'])
    .withMessage('物品品质必须是凡品、灵品、宝品、仙品或神品'),
    
  query('min_realm_requirement')
    .optional()
    .isInt({ min: 0, max: 63 })
    .withMessage('最小境界要求必须是0-63之间的整数'),
    
  query('max_realm_requirement')
    .optional()
    .isInt({ min: 0, max: 63 })
    .withMessage('最大境界要求必须是0-63之间的整数')
]);

// ==================== 体质数据验证 ====================

/**
 * 体质ID参数验证
 */
export const validateBodyTypeId = [
  param('body_type_id')
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage('体质ID必须是1-20个字符的字符串')
];

/**
 * 创建体质数据验证
 */
export const validateCreateBodyTypeData = createValidationMiddleware([
  body('body_type_id')
    .notEmpty()
    .withMessage('体质ID不能为空')
    .isLength({ min: 1, max: 20 })
    .withMessage('体质ID长度必须在1-20个字符之间'),
    
  body('body_type_name')
    .notEmpty()
    .withMessage('体质名称不能为空')
    .isLength({ min: 1, max: 50 })
    .withMessage('体质名称长度必须在1-50个字符之间'),
    
  body('body_type_description')
    .optional()
    .isString()
    .withMessage('体质描述必须是字符串'),
    
  body('body_type_rarity')
    .isIn(['普通', '稀有', '史诗', '传说', '神话'])
    .withMessage('体质稀有度必须是普通、稀有、史诗、传说或神话'),
    
  body('body_type_physical_bonus')
    .isInt({ min: 0 })
    .withMessage('体质加成必须是非负整数'),
    
  body('body_type_spiritual_bonus')
    .isInt({ min: 0 })
    .withMessage('灵力加成必须是非负整数'),
    
  body('body_type_soul_bonus')
    .isInt({ min: 0 })
    .withMessage('神魂加成必须是非负整数'),
    
  body('body_type_special_effect')
    .optional()
    .isString()
    .withMessage('特殊效果必须是字符串')
]);

/**
 * 更新体质数据验证
 */
export const validateUpdateBodyTypeData = createValidationMiddleware([
  body('body_type_name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('体质名称长度必须在1-50个字符之间'),
    
  body('body_type_description')
    .optional()
    .isString()
    .withMessage('体质描述必须是字符串'),
    
  body('body_type_rarity')
    .optional()
    .isIn(['普通', '稀有', '史诗', '传说', '神话'])
    .withMessage('体质稀有度必须是普通、稀有、史诗、传说或神话'),
    
  body('body_type_physical_bonus')
    .optional()
    .isInt({ min: 0 })
    .withMessage('体质加成必须是非负整数'),
    
  body('body_type_spiritual_bonus')
    .optional()
    .isInt({ min: 0 })
    .withMessage('灵力加成必须是非负整数'),
    
  body('body_type_soul_bonus')
    .optional()
    .isInt({ min: 0 })
    .withMessage('神魂加成必须是非负整数'),
    
  body('body_type_special_effect')
    .optional()
    .isString()
    .withMessage('特殊效果必须是字符串')
]);

/**
 * 体质稀有度查询验证
 */
export const validateBodyTypeRarityQuery = createValidationMiddleware([
  query('body_type_rarity')
    .optional()
    .isIn(['普通', '稀有', '史诗', '传说', '神话'])
    .withMessage('体质稀有度必须是普通、稀有、史诗、传说或神话')
]);

// ==================== 成就数据验证 ====================

/**
 * 成就ID参数验证
 */
export const validateAchievementId = [
  param('achievement_id')
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage('成就ID必须是1-20个字符的字符串')
];

/**
 * 创建成就数据验证
 */
export const validateCreateAchievementData = createValidationMiddleware([
  body('achievement_id')
    .notEmpty()
    .withMessage('成就ID不能为空')
    .isLength({ min: 1, max: 20 })
    .withMessage('成就ID长度必须在1-20个字符之间'),
    
  body('achievement_name')
    .notEmpty()
    .withMessage('成就名称不能为空')
    .isLength({ min: 1, max: 50 })
    .withMessage('成就名称长度必须在1-50个字符之间'),
    
  body('achievement_description')
    .optional()
    .isString()
    .withMessage('成就描述必须是字符串'),
    
  body('achievement_type')
    .isIn(['修炼', '战斗', '探索', '社交', '收集', '特殊'])
    .withMessage('成就类型必须是修炼、战斗、探索、社交、收集或特殊'),
    
  body('achievement_difficulty')
    .isIn(['简单', '普通', '困难', '极难', '传说'])
    .withMessage('成就难度必须是简单、普通、困难、极难或传说'),
    
  body('achievement_reward_type')
    .isIn(['经验', '物品', '称号', '技能', '属性', '其他'])
    .withMessage('奖励类型必须是经验、物品、称号、技能、属性或其他'),
    
  body('achievement_reward_value')
    .isInt({ min: 0 })
    .withMessage('奖励数值必须是非负整数'),
    
  body('achievement_hidden')
    .isBoolean()
    .withMessage('是否隐藏必须是布尔值')
]);

/**
 * 更新成就数据验证
 */
export const validateUpdateAchievementData = createValidationMiddleware([
  body('achievement_name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('成就名称长度必须在1-50个字符之间'),
    
  body('achievement_description')
    .optional()
    .isString()
    .withMessage('成就描述必须是字符串'),
    
  body('achievement_type')
    .optional()
    .isIn(['修炼', '战斗', '探索', '社交', '收集', '特殊'])
    .withMessage('成就类型必须是修炼、战斗、探索、社交、收集或特殊'),
    
  body('achievement_difficulty')
    .optional()
    .isIn(['简单', '普通', '困难', '极难', '传说'])
    .withMessage('成就难度必须是简单、普通、困难、极难或传说'),
    
  body('achievement_reward_type')
    .optional()
    .isIn(['经验', '物品', '称号', '技能', '属性', '其他'])
    .withMessage('奖励类型必须是经验、物品、称号、技能、属性或其他'),
    
  body('achievement_reward_value')
    .optional()
    .isInt({ min: 0 })
    .withMessage('奖励数值必须是非负整数'),
    
  body('achievement_hidden')
    .optional()
    .isBoolean()
    .withMessage('是否隐藏必须是布尔值')
]);

/**
 * 成就类型查询验证
 */
export const validateAchievementTypeQuery = createValidationMiddleware([
  query('achievement_type')
    .optional()
    .isIn(['修炼', '战斗', '探索', '社交', '收集', '特殊'])
    .withMessage('成就类型必须是修炼、战斗、探索、社交、收集或特殊'),
    
  query('achievement_difficulty')
    .optional()
    .isIn(['简单', '普通', '困难', '极难', '传说'])
    .withMessage('成就难度必须是简单、普通、困难、极难或传说'),
    
  query('achievement_hidden')
    .optional()
    .isBoolean()
    .withMessage('是否隐藏必须是布尔值')
]);

// ==================== 宗门数据验证 ====================

/**
 * 宗门ID参数验证
 */
export const validateZongmenId = [
  param('zongmen_id')
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage('宗门ID必须是1-20个字符的字符串')
];

/**
 * 创建宗门数据验证
 */
export const validateCreateZongmenData = createValidationMiddleware([
  body('zongmen_id')
    .notEmpty()
    .withMessage('宗门ID不能为空')
    .isLength({ min: 1, max: 20 })
    .withMessage('宗门ID长度必须在1-20个字符之间'),
    
  body('zongmen_name')
    .notEmpty()
    .withMessage('宗门名称不能为空')
    .isLength({ min: 1, max: 50 })
    .withMessage('宗门名称长度必须在1-50个字符之间'),
    
  body('zongmen_type')
    .isIn(['正道', '魔道', '中立', '隐世', '古宗'])
    .withMessage('宗门类型必须是正道、魔道、中立、隐世或古宗'),
    
  body('zongmen_location')
    .optional()
    .isString()
    .withMessage('宗门位置必须是字符串'),
    
  body('zongmen_reputation')
    .isInt({ min: 0 })
    .withMessage('宗门声望必须是非负整数'),
    
  body('zongmen_description')
    .optional()
    .isString()
    .withMessage('宗门描述必须是字符串'),
    
  body('zongmen_founding_year')
    .isInt({ min: 1 })
    .withMessage('创建年份必须是正整数'),
    
  body('zongmen_member_count')
    .isInt({ min: 0 })
    .withMessage('成员数量必须是非负整数'),
    
  body('zongmen_special_feature')
    .optional()
    .isString()
    .withMessage('特色功能必须是字符串')
]);

/**
 * 更新宗门数据验证
 */
export const validateUpdateZongmenData = createValidationMiddleware([
  body('zongmen_name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('宗门名称长度必须在1-50个字符之间'),
    
  body('zongmen_type')
    .optional()
    .isIn(['正道', '魔道', '中立', '隐世', '古宗'])
    .withMessage('宗门类型必须是正道、魔道、中立、隐世或古宗'),
    
  body('zongmen_location')
    .optional()
    .isString()
    .withMessage('宗门位置必须是字符串'),
    
  body('zongmen_reputation')
    .optional()
    .isInt({ min: 0 })
    .withMessage('宗门声望必须是非负整数'),
    
  body('zongmen_description')
    .optional()
    .isString()
    .withMessage('宗门描述必须是字符串'),
    
  body('zongmen_founding_year')
    .optional()
    .isInt({ min: 1 })
    .withMessage('创建年份必须是正整数'),
    
  body('zongmen_member_count')
    .optional()
    .isInt({ min: 0 })
    .withMessage('成员数量必须是非负整数'),
    
  body('zongmen_special_feature')
    .optional()
    .isString()
    .withMessage('特色功能必须是字符串')
]);

/**
 * 宗门类型查询验证
 */
export const validateZongmenTypeQuery = createValidationMiddleware([
  query('zongmen_type')
    .optional()
    .isIn(['正道', '魔道', '中立', '隐世', '古宗'])
    .withMessage('宗门类型必须是正道、魔道、中立、隐世或古宗'),
    
  query('min_reputation')
    .optional()
    .isInt({ min: 0 })
    .withMessage('最小声望必须是非负整数'),
    
  query('max_reputation')
    .optional()
    .isInt({ min: 0 })
    .withMessage('最大声望必须是非负整数'),
    
  query('min_founding_year')
    .optional()
    .isInt({ min: 1 })
    .withMessage('最小创建年份必须是正整数'),
    
  query('max_founding_year')
    .optional()
    .isInt({ min: 1 })
    .withMessage('最大创建年份必须是正整数')
]);

// ==================== 通用静态数据验证 ====================

/**
 * 通用分页查询验证
 */
export const validateStaticDataPaginationQuery = createValidationMiddleware([
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
    .withMessage('排序方向必须是asc或desc'),
    
  query('search')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('搜索关键词长度必须在1-50个字符之间')
]);

export default {
  validateRealmLevel,
  validateRealmId: validateRealmLevel,
  validateCreateRealmData,
  validateUpdateRealmData,
  validateRealmLevelRangeQuery,
  validateSkillId,
  validateCreateSkillData,
  validateUpdateSkillData,
  validateSkillTypeQuery,
  validateWeaponId,
  validateCreateWeaponData,
  validateUpdateWeaponData,
  validateWeaponTypeQuery,
  validateItemId,
  validateCreateItemData,
  validateUpdateItemData,
  validateItemTypeQuery,
  validateBodyTypeId,
  validateCreateBodyTypeData,
  validateUpdateBodyTypeData,
  validateBodyTypeRarityQuery,
  validateAchievementId,
  validateCreateAchievementData,
  validateUpdateAchievementData,
  validateAchievementTypeQuery,
  validateZongmenId,
  validateCreateZongmenData,
  validateUpdateZongmenData,
  validateZongmenTypeQuery,
  validateStaticDataPaginationQuery
};

// 导出别名以保持向后兼容性
export const validateRealmId = validateRealmLevel;