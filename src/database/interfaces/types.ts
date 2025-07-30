/**
 * 数据库表对应的TypeScript接口定义
 */

// 人物基础信息
export interface CharacterBaseInfo {
  character_uuid: string; // 人物唯一id(8位序列+2位随机)
  character_name: string; // 人物姓名(1-10个中文字符，1-20个英文)
  character_gender: '男' | '女' | '其他'; // 人物性别
  character_birthday?: Date; // 人物生日
  character_dao_hao?: string; // 道号(1-10个中文字符，1-20个英文)
  character_realm_Level: number; // 境界(0-63)
  cultivatingState: '未修练' | '正在修炼' | '闭关中' | '受伤修炼中' | '顿悟中'; // 修炼状态
  cultivationLimitBase: number; // 基础修炼值上限(与境界对应)
  cultivationLimitAdd: number; // 额外修炼值上限
  cultivationValue: number; // 实际修炼值
  cultivationOverLimit: boolean; // 是否允许超限
  cultivationSpeedBase: number; // 基础修炼速度(与境界对应)
  cultivationSpeedAdd: number; // 格外的修炼速度
  breakThroughEnabled: boolean; // 修炼值是否满足
  breakThroughItemsEnabled: boolean; // 突破物品或条件是否满足
  breakThroughState: boolean; // 是否在突破(防止连续多次Post)
  breakThroughFailNumb: number; // 突破失败的次数
  character_physicalAttributes?: '金' | '木' | '水' | '火' | '土'; // 体质五行属性
  zongMenJoinBool: boolean; // 是否加入宗门
  zongMen_id?: string; // 宗门.id(8位序列)
  zongMenJoinDate?: Date; // 加入时间
  title_1_id?: '外门弟子' | '内门弟子' | '核心弟子' | '长老' | '掌门'; // 宗门身份
  title_2_id?: '初入宗门' | '略有小成' | '宗门栋梁' | '宗门支柱' | '宗门传奇'; // 宗门成就
  title_3_id?: string; // 区域成就.id
  title_4_id?: string; // 世界成就.id
  title_5_id?: string; // 特殊成就.id
  create_time: Date; // 创建时间
  update_time: Date; // 更新时间
}

// 人物五行亲和度
export interface CharacterAffinities {
  character_uuid: string; // 关联人物id
  total_affinity: number; // 总亲和度/天赋值
  metal_affinity: number; // 金属性亲和度0-100
  wood_affinity: number; // 木属性亲和度0-100
  water_affinity: number; // 水属性亲和度0-100
  fire_affinity: number; // 火属性亲和度0-100
  earth_affinity: number; // 土属性亲和度0-100
}

// 人物强度属性
export interface CharacterStrength {
  character_uuid: string; // 关联人物id
  physical_strength: number; // 体质强度
  spiritual_strength: number; // 灵力强度
  soul_strength: number; // 灵魂强度
  blood_current: number; // 血气当前储值
  blood_max: number; // 血气最大储值
  blood_recovery_rate: number; // 血气恢复速率
  blood_temp_add: number; // 血气临时增加
  spiritual_current: number; // 灵气当前储值
  spiritual_max: number; // 灵气最大储值
  spiritual_recovery_rate: number; // 灵气恢复速率
  spiritual_temp_add: number; // 灵力临时增加
  mental_current: number; // 精神力当前储值
  mental_max: number; // 精神力最大储值
  mental_recovery_rate: number; // 精神力恢复速率
  mental_temp_add: number; // 精神力临时增加
  combat_power: number; // 当前战斗力
  base_combat_power: number; // 基础战斗力(不含装备)
}

// 人物体质类型
export interface CharacterBodyTypes {
  character_uuid: string; // 关联人物id
  body_type_1_id?: string; // 特殊体质1的id
  body_type_2_id?: string; // 特殊体质2的id
  body_type_3_id?: string; // 特殊体质3的id
  body_type_4_id?: string; // 特殊体质4的id
  body_type_5_id?: string; // 特殊体质5的id
}

// 人物技能
export interface CharacterSkills {
  character_uuid: string; // 关联人物id
  skill_1_id?: string; // 装备的心法id
  skill_2_id?: string; // 装备的功法1id
  skill_3_id?: string; // 装备的功法2id
  skill_4_id?: string; // 装备的武技1id
  skill_5_id?: string; // 装备的武技2id
  skill_6_id?: string; // 装备的武技3id
  skill_7_id?: string; // 装备的秘术/禁术1id
  skill_8_id?: string; // 装备的秘术/禁术2id
  skill_9_id?: string; // 装备的秘术/禁术3id
  skill_10_id?: string; // 装备的秘术/禁术4id
}

// 人物武器
export interface CharacterWeapons {
  character_uuid: string; // 关联人物id
  weapon_1_id?: string; // 兵器1id
  weapon_2_id?: string; // 兵器2id
  weapon_3_id?: string; // 兵器3id
  weapon_4_id?: string; // 兵器4id
  weapon_5_id?: string; // 兵器5id
}

// 人物货币
export interface CharacterCurrency {
  character_uuid: string; // 关联人物id
  copper_coin: number; // 铜币
  silver_coin: number; // 银币
  gold_coin: number; // 金币
  low_spirit_stone: number; // 下品灵石
  medium_spirit_stone: number; // 中品灵石
  high_spirit_stone: number; // 极品灵石
  zongmen_contribution: number; // 宗门贡献
  region_contribution: number; // 区域贡献
  world_contribution: number; // 世界贡献
  special_contribution_1: number; // 特殊贡献.1
  special_contribution_2: number; // 特殊贡献.2
  special_contribution_3: number; // 特殊贡献.3
}

// 人物物品
export interface CharacterItems {
  character_items_id: string; // 物品实例id(主键)
  item_id: string; // 物品id
  character_uuid: string; // 关联人物id
  item_count: number; // 物品数量
  item_level: number; // 物品等级
  is_equipped: boolean; // 是否装备
  slot_position?: number; // 装备槽位（1-武器，2-防具，3-饰品等）
  durability?: number; // 耐久度
  create_time: Date; // 获得时间
  update_time: Date; // 更新时间
}

// 境界数据
export interface RealmData {
  realm_level: number; // 境界等级(0-63)
  stage_division: string; // 阶段划分
  major_realm: string; // 大境界
  minor_realm: string; // 小境界
  stage: string; // 阶段
  cultivation_start_value: number; // 修炼值起始
  base_cultivation_limit: number; // 基础修炼值上限
  base_cultivation_speed: number; // 基础修炼值增加速度
  base_physical_strength: number; // 体质强度
  base_spiritual_strength: number; // 灵力强度
  base_soul_strength: number; // 灵魂强度
  base_spiritual_storage: number; // 基础灵气储值
  base_blood_storage: number; // 基础血气储值
  base_mental_storage: number; // 基础精神力储值
  base_spiritual_recovery_rate: number; // 基础灵气恢复速率
  base_blood_recovery_rate: number; // 基础血气恢复速率
  base_mental_recovery_rate: number; // 基础精神力恢复速率
}

// 体质数据
export interface BodyTypeData {
  body_type_id: string; // 体质id
  body_type_name: string; // 体质名称
  description?: string; // 体质描述
  physical_bonus: number; // 体质强度加成
  spiritual_bonus: number; // 灵力强度加成
  soul_bonus: number; // 灵魂强度加成
}

// 技能数据
export interface SkillData {
  skill_id: string; // 功法id
  skill_name: string; // 功法名称
  skill_type: '心法' | '功法' | '武技' | '秘术' | '禁术'; // 功法类型
  skill_realm_requirement: number; // 境界要求
  skill_description?: string; // 功法描述
  skill_power: number; // 功法威力
}

// 武器数据
export interface WeaponData {
  weapon_id: string; // 武器id
  weapon_name: string; // 武器名称
  weapon_type: '剑' | '刀' | '棍' | '枪' | '鞭' | '锤' | '扇' | '笛' | '其他'; // 武器类型
  weapon_realm_requirement: number; // 境界要求
  weapon_description?: string; // 武器描述
  weapon_attack_power: number; // 攻击力
  weapon_special_effect?: string; // 特殊效果
}

// 宗门数据
export interface ZongmenData {
  zongmen_id: string; // 宗门id
  zongmen_name: string; // 宗门名称
  description?: string; // 宗门描述
  founder?: string; // 创始人
  established_date?: Date; // 创建日期
  realm_level_required: number; // 加入所需境界
}

// 成就数据
export interface AchievementData {
  achievement_id: string; // 成就id
  achievement_name: string; // 成就名称
  achievement_type: '区域' | '世界' | '特殊'; // 成就类型
  description?: string; // 成就描述
  reward?: string; // 成就奖励
  difficulty: number; // 难度系数
}

// 物品数据
export interface ItemData {
  item_id: string; // 物品唯一id
  item_name: string; // 物品名称
  item_type: '武器' | '防具' | '饰品' | '消耗品' | '材料' | '任务物品' | '法宝'; // 物品类型
  quality: '普通' | '优秀' | '稀有' | '史诗' | '传说' | '神器'; // 物品品质
  description?: string; // 物品描述
  realm_requirement?: number; // 使用/装备所需境界
  attack_power?: number; // 攻击力加成
  defense_power?: number; // 防御力加成
  health_bonus?: number; // 生命值加成
  mana_bonus?: number; // 法力值加成
  special_effect?: string; // 特殊效果描述
  is_stackable: boolean; // 是否可堆叠
  max_stack_size: number; // 最大堆叠数量
  sell_price: number; // 出售价格
  buy_price?: number; // 购买价格
  is_bind_on_pickup: boolean; // 拾取绑定
  is_bind_on_equip: boolean; // 装备绑定
  create_time: Date; // 创建时间
  update_time: Date; // 更新时间
}

// 物品类型分类
export interface ItemTypeCategory {
  category_id: number; // 分类id
  category_name: string; // 分类名称
  parent_category_id?: number; // 父分类id
  description?: string; // 分类描述
}

// 物品类型关系
export interface ItemTypeRelations {
  item_id: string; // 物品id
  category_id: number; // 分类id
}

// 查询选项
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

// 分页结果
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}