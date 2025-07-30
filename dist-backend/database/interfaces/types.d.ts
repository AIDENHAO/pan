/**
 * 数据库表对应的TypeScript接口定义
 */
export interface CharacterBaseInfo {
    character_uuid: string;
    character_name: string;
    character_gender: '男' | '女' | '其他';
    character_birthday?: Date;
    character_dao_hao?: string;
    character_realm_Level: number;
    cultivatingState: '未修练' | '正在修炼' | '闭关中' | '受伤修炼中' | '顿悟中';
    cultivationLimitBase: number;
    cultivationLimitAdd: number;
    cultivationValue: number;
    cultivationOverLimit: boolean;
    cultivationSpeedBase: number;
    cultivationSpeedAdd: number;
    breakThroughEnabled: boolean;
    breakThroughItemsEnabled: boolean;
    breakThroughState: boolean;
    breakThroughFailNumb: number;
    character_physicalAttributes?: '金' | '木' | '水' | '火' | '土';
    zongMenJoinBool: boolean;
    zongMen_id?: string;
    zongMenJoinDate?: Date;
    title_1_id?: '外门弟子' | '内门弟子' | '核心弟子' | '长老' | '掌门';
    title_2_id?: '初入宗门' | '略有小成' | '宗门栋梁' | '宗门支柱' | '宗门传奇';
    title_3_id?: string;
    title_4_id?: string;
    title_5_id?: string;
    create_time: Date;
    update_time: Date;
}
export interface CharacterAffinities {
    character_uuid: string;
    total_affinity: number;
    metal_affinity: number;
    wood_affinity: number;
    water_affinity: number;
    fire_affinity: number;
    earth_affinity: number;
}
export interface CharacterStrength {
    character_uuid: string;
    physical_strength: number;
    spiritual_strength: number;
    soul_strength: number;
    blood_current: number;
    blood_max: number;
    blood_recovery_rate: number;
    blood_temp_add: number;
    spiritual_current: number;
    spiritual_max: number;
    spiritual_recovery_rate: number;
    spiritual_temp_add: number;
    mental_current: number;
    mental_max: number;
    mental_recovery_rate: number;
    mental_temp_add: number;
    combat_power: number;
    base_combat_power: number;
}
export interface CharacterBodyTypes {
    character_uuid: string;
    body_type_1_id?: string;
    body_type_2_id?: string;
    body_type_3_id?: string;
    body_type_4_id?: string;
    body_type_5_id?: string;
}
export interface CharacterSkills {
    character_uuid: string;
    skill_1_id?: string;
    skill_2_id?: string;
    skill_3_id?: string;
    skill_4_id?: string;
    skill_5_id?: string;
    skill_6_id?: string;
    skill_7_id?: string;
    skill_8_id?: string;
    skill_9_id?: string;
    skill_10_id?: string;
}
export interface CharacterWeapons {
    character_uuid: string;
    weapon_1_id?: string;
    weapon_2_id?: string;
    weapon_3_id?: string;
    weapon_4_id?: string;
    weapon_5_id?: string;
}
export interface CharacterCurrency {
    character_uuid: string;
    copper_coin: number;
    silver_coin: number;
    gold_coin: number;
    low_spirit_stone: number;
    medium_spirit_stone: number;
    high_spirit_stone: number;
    zongmen_contribution: number;
    region_contribution: number;
    world_contribution: number;
    special_contribution_1: number;
    special_contribution_2: number;
    special_contribution_3: number;
}
export interface CharacterItems {
    character_items_id: string;
    item_id: string;
    character_uuid: string;
    item_count: number;
    item_level: number;
    is_equipped: boolean;
    slot_position?: number;
    durability?: number;
    create_time?: string;
    update_time?: string;
}
export interface RealmData {
    realm_level: number;
    stage_division: string;
    major_realm: string;
    minor_realm: string;
    stage: string;
    cultivation_start_value: number;
    base_cultivation_limit: number;
    base_cultivation_speed: number;
    base_physical_strength: number;
    base_spiritual_strength: number;
    base_soul_strength: number;
    base_spiritual_storage: number;
    base_blood_storage: number;
    base_mental_storage: number;
    base_spiritual_recovery_rate: number;
    base_blood_recovery_rate: number;
    base_mental_recovery_rate: number;
}
export interface BodyTypeData {
    body_type_id: string;
    body_type_name: string;
    description?: string;
    physical_bonus: number;
    spiritual_bonus: number;
    soul_bonus: number;
}
export interface SkillData {
    skill_id: string;
    skill_name: string;
    skill_type: '心法' | '功法' | '武技' | '秘术' | '禁术';
    realm_requirement: number;
    description?: string;
    power: number;
}
export interface WeaponData {
    weapon_id: string;
    weapon_name: string;
    weapon_type: '剑' | '刀' | '棍' | '枪' | '鞭' | '锤' | '扇' | '笛' | '其他';
    realm_requirement: number;
    description?: string;
    attack_power: number;
    special_effect?: string;
}
export interface ZongmenData {
    zongmen_id: string;
    zongmen_name: string;
    description?: string;
    founder?: string;
    established_date?: Date;
    realm_level_required: number;
}
export interface AchievementData {
    achievement_id: string;
    achievement_name: string;
    achievement_type: '区域' | '世界' | '特殊';
    description?: string;
    reward?: string;
    difficulty: number;
}
export interface ItemData {
    item_id: string;
    item_name: string;
    item_type: '武器' | '防具' | '饰品' | '消耗品' | '材料' | '任务物品' | '法宝';
    quality: '普通' | '优秀' | '稀有' | '史诗' | '传说' | '神器';
    description?: string;
    realm_requirement?: number;
    attack_power?: number;
    defense_power?: number;
    health_bonus?: number;
    mana_bonus?: number;
    special_effect?: string;
    is_stackable: boolean;
    max_stack_size: number;
    sell_price: number;
    buy_price?: number;
    is_bind_on_pickup: boolean;
    is_bind_on_equip: boolean;
    create_time: Date;
    update_time: Date;
}
export interface ItemTypeCategory {
    category_id: number;
    category_name: string;
    parent_category_id?: number;
    description?: string;
}
export interface ItemTypeRelations {
    item_id: string;
    category_id: number;
}
export interface QueryOptions {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
}
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
//# sourceMappingURL=types.d.ts.map