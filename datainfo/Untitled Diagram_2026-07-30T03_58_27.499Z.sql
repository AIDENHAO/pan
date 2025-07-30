CREATE TABLE `character_base_info` (
	`character_uuid` VARCHAR(10) NOT NULL COMMENT '人物唯一id(8位序列+2位随机)',
	`character_name` VARCHAR(20) NOT NULL COMMENT '人物姓名(1-10个中文字符，1-20个英文)',
	`character_gender` ENUM('男', '女', '其他') NOT NULL DEFAULT '男' COMMENT '人物性别',
	`character_birthday` DATE COMMENT '人物生日',
	`character_dao_hao` VARCHAR(20) COMMENT '道号(1-10个中文字符，1-20个英文)',
	`character_realm_Level` TINYINT NOT NULL DEFAULT 0 COMMENT '境界(0-63)',
	`cultivatingState` ENUM('未修练', '正在修炼', '闭关中', '受伤修炼中', '顿悟中') NOT NULL DEFAULT '未修练' COMMENT '修炼状态',
	`cultivationLimitBase` INTEGER NOT NULL DEFAULT 0 COMMENT '基础修炼值上限(与境界对应)',
	`cultivationLimitAdd` INTEGER NOT NULL DEFAULT 0 COMMENT '额外修炼值上限',
	`cultivationValue` INTEGER NOT NULL DEFAULT 0 COMMENT '实际修炼值',
	`cultivationOverLimit` BOOLEAN NOT NULL DEFAULT false COMMENT '是否允许超限',
	`cultivationSpeedBase` INTEGER NOT NULL DEFAULT 0 COMMENT '基础修炼速度(与境界对应)',
	`cultivationSpeedAdd` INTEGER NOT NULL DEFAULT 0 COMMENT '格外的修炼速度',
	`breakThroughEnabled` BOOLEAN NOT NULL DEFAULT false COMMENT '修炼值是否满足',
	`breakThroughItemsEnabled` BOOLEAN NOT NULL DEFAULT false COMMENT '突破物品或条件是否满足',
	`breakThroughState` BOOLEAN NOT NULL DEFAULT false COMMENT '是否在突破(防止连续多次Post)',
	`breakThroughFailNumb` INTEGER NOT NULL DEFAULT 0 COMMENT '突破失败的次数',
	`character_physicalAttributes` ENUM('金', '木', '水', '火', '土') COMMENT '体质五行属性',
	`zongMenJoinBool` BOOLEAN DEFAULT false COMMENT '是否加入宗门',
	`zongMen_id` VARCHAR(8) COMMENT '宗门.id(8位序列)',
	`zongMenJoinDate` DATETIME COMMENT '加入时间',
	`title_1_id` ENUM('外门弟子', '内门弟子', '核心弟子', '长老', '掌门') COMMENT '宗门身份',
	`title_2_id` ENUM('初入宗门', '略有小成', '宗门栋梁', '宗门支柱', '宗门传奇') COMMENT '宗门成就',
	`title_3_id` VARCHAR(20) COMMENT '区域成就.id',
	`title_4_id` VARCHAR(20) COMMENT '世界成就.id',
	`title_5_id` VARCHAR(20) COMMENT '特殊成就.id',
	`create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	`update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
	PRIMARY KEY(`character_uuid`)
);


CREATE TABLE `character_affinities` (
	`character_uuid` VARCHAR(10) COMMENT '关联人物id',
	`total_affinity` INTEGER NOT NULL DEFAULT 0 COMMENT '总亲和度/天赋值(五行亲和度总和)',
	`metal_affinity` TINYINT NOT NULL DEFAULT 0 COMMENT '金属性亲和度0-100',
	`wood_affinity` TINYINT NOT NULL DEFAULT 0 COMMENT '木属性亲和度0-100',
	`water_affinity` TINYINT NOT NULL DEFAULT 0 COMMENT '水属性亲和度0-100',
	`fire_affinity` TINYINT NOT NULL DEFAULT 0 COMMENT '火属性亲和度0-100',
	`earth_affinity` TINYINT NOT NULL DEFAULT 0 COMMENT '土属性亲和度0-100',
	PRIMARY KEY(`character_uuid`)
);


CREATE TABLE `character_strength` (
	`character_uuid` VARCHAR(10) COMMENT '关联人物id',
	`physical_strength` INTEGER NOT NULL DEFAULT 0 COMMENT '体质强度(境界对应强度+体质加成)',
	`spiritual_strength` INTEGER NOT NULL DEFAULT 0 COMMENT '灵力强度(境界对应强度+体质加成)',
	`soul_strength` INTEGER NOT NULL DEFAULT 0 COMMENT '灵魂强度(境界对应强度+体质加成)',
	`blood_current` INTEGER NOT NULL DEFAULT 0 COMMENT '血气当前储值',
	`blood_max` INTEGER NOT NULL DEFAULT 0 COMMENT '血气最大储值',
	`blood_recovery_rate` INTEGER NOT NULL DEFAULT 0 COMMENT '血气恢复速率',
	`blood_temp_add` INTEGER NOT NULL DEFAULT 0 COMMENT '血气临时增加',
	`spiritual_current` INTEGER NOT NULL DEFAULT 0 COMMENT '灵气当前储值',
	`spiritual_max` INTEGER NOT NULL DEFAULT 0 COMMENT '灵气最大储值',
	`spiritual_recovery_rate` INTEGER NOT NULL DEFAULT 0 COMMENT '灵气恢复速率',
	`spiritual_temp_add` INTEGER NOT NULL DEFAULT 0 COMMENT '灵力临时增加',
	`mental_current` INTEGER NOT NULL DEFAULT 0 COMMENT '精神力当前储值',
	`mental_max` INTEGER NOT NULL DEFAULT 0 COMMENT '精神力最大储值',
	`mental_recovery_rate` INTEGER NOT NULL DEFAULT 0 COMMENT '精神力恢复速率',
	`mental_temp_add` INTEGER NOT NULL DEFAULT 0 COMMENT '精神力临时增加',
	`combat_power` INTEGER NOT NULL DEFAULT 0 COMMENT '当前战斗力',
	`base_combat_power` INTEGER NOT NULL DEFAULT 0 COMMENT '基础战斗力(不含装备)',
	PRIMARY KEY(`character_uuid`)
);


CREATE TABLE `character_body_types` (
	`character_uuid` VARCHAR(10) COMMENT '关联人物id',
	`body_type_1_id` VARCHAR(4) COMMENT '特殊体质1的id(4位序列)',
	`body_type_2_id` VARCHAR(4) COMMENT '特殊体质2的id(4位序列)',
	`body_type_3_id` VARCHAR(4) COMMENT '特殊体质3的id(4位序列)',
	`body_type_4_id` VARCHAR(4) COMMENT '特殊体质4的id(4位序列)',
	`body_type_5_id` VARCHAR(4) COMMENT '特殊体质5的id(4位序列)',
	PRIMARY KEY(`character_uuid`)
);


CREATE TABLE `character_skills` (
	`character_uuid` VARCHAR(10) COMMENT '关联人物id',
	`skill_1_id` VARCHAR(20) COMMENT '装备的心法id',
	`skill_2_id` VARCHAR(20) COMMENT '装备的功法1id',
	`skill_3_id` VARCHAR(20) COMMENT '装备的功法2id',
	`skill_4_id` VARCHAR(20) COMMENT '装备的武技1id',
	`skill_5_id` VARCHAR(20) COMMENT '装备的武技2id',
	`skill_6_id` VARCHAR(20) COMMENT '装备的武技3id',
	`skill_7_id` VARCHAR(20) COMMENT '装备的秘术/禁术1id',
	`skill_8_id` VARCHAR(20) COMMENT '装备的秘术/禁术2id',
	`skill_9_id` VARCHAR(20) COMMENT '装备的秘术/禁术3id',
	`skill_10_id` VARCHAR(20) COMMENT '装备的秘术/禁术4id',
	PRIMARY KEY(`character_uuid`)
);


CREATE TABLE `character_weapons` (
	`character_uuid` VARCHAR(10) COMMENT '关联人物id',
	`weapon_1_id` VARCHAR(20) COMMENT '兵器1id',
	`weapon_2_id` VARCHAR(20) COMMENT '兵器2id',
	`weapon_3_id` VARCHAR(20) COMMENT '兵器3id',
	`weapon_4_id` VARCHAR(20) COMMENT '兵器4id',
	`weapon_5_id` VARCHAR(20) COMMENT '兵器5id',
	PRIMARY KEY(`character_uuid`)
);


CREATE TABLE `character_currency` (
	`character_uuid` VARCHAR(10) COMMENT '关联人物id',
	`copper_coin` BIGINT NOT NULL DEFAULT 0 COMMENT '铜币',
	`silver_coin` BIGINT NOT NULL DEFAULT 0 COMMENT '银币',
	`gold_coin` BIGINT NOT NULL DEFAULT 0 COMMENT '金币',
	`low_spirit_stone` BIGINT NOT NULL DEFAULT 0 COMMENT '下品灵石',
	`medium_spirit_stone` BIGINT NOT NULL DEFAULT 0 COMMENT '中品灵石',
	`high_spirit_stone` BIGINT NOT NULL DEFAULT 0 COMMENT '极品灵石',
	`zongmen_contribution` INTEGER NOT NULL DEFAULT 0 COMMENT '宗门贡献',
	`region_contribution` INTEGER NOT NULL DEFAULT 0 COMMENT '区域贡献',
	`world_contribution` INTEGER NOT NULL DEFAULT 0 COMMENT '世界贡献',
	`special_contribution_1` INTEGER NOT NULL DEFAULT 0 COMMENT '特殊贡献.1',
	`special_contribution_2` INTEGER NOT NULL DEFAULT 0 COMMENT '特殊贡献.2',
	`special_contribution_3` INTEGER NOT NULL DEFAULT 0 COMMENT '特殊贡献.3',
	PRIMARY KEY(`character_uuid`)
);


CREATE TABLE `realm_data` (
	`realm_level` TINYINT NOT NULL COMMENT '境界等级(0-63)',
	`stage_division` VARCHAR(20) NOT NULL COMMENT '阶段划分',
	`major_realm` VARCHAR(30) NOT NULL COMMENT '大境界',
	`minor_realm` VARCHAR(30) NOT NULL COMMENT '小境界',
	`stage` VARCHAR(20) NOT NULL COMMENT '阶段',
	`cultivation_start_value` INTEGER NOT NULL DEFAULT 0 COMMENT '修炼值起始',
	`base_cultivation_limit` INTEGER NOT NULL COMMENT '基础修炼值上限',
	`base_cultivation_speed` INTEGER NOT NULL COMMENT '基础修炼值增加速度',
	`base_physical_strength` INTEGER NOT NULL COMMENT '体质强度',
	`base_spiritual_strength` INTEGER NOT NULL COMMENT '灵力强度',
	`base_soul_strength` INTEGER NOT NULL COMMENT '灵魂强度',
	`base_spiritual_storage` INTEGER NOT NULL DEFAULT 0 COMMENT '基础灵气储值',
	`base_blood_storage` INTEGER NOT NULL DEFAULT 0 COMMENT '基础血气储值',
	`base_mental_storage` INTEGER NOT NULL DEFAULT 0 COMMENT '基础精神力储值',
	`base_spiritual_recovery_rate` INTEGER NOT NULL DEFAULT 0 COMMENT '基础灵气恢复速率',
	`base_blood_recovery_rate` INTEGER NOT NULL DEFAULT 0 COMMENT '基础血气恢复速率',
	`base_mental_recovery_rate` INTEGER NOT NULL DEFAULT 0 COMMENT '基础精神力恢复速率',
	PRIMARY KEY(`realm_level`)
);


CREATE TABLE `body_type_data` (
	`body_type_id` VARCHAR(4) NOT NULL COMMENT '体质id(4位序列)',
	`body_type_name` VARCHAR(20) NOT NULL COMMENT '体质名称',
	`description` TEXT COMMENT '体质描述',
	`physical_bonus` INTEGER NOT NULL DEFAULT 0 COMMENT '体质强度加成',
	`spiritual_bonus` INTEGER NOT NULL DEFAULT 0 COMMENT '灵力强度加成',
	`soul_bonus` INTEGER NOT NULL DEFAULT 0 COMMENT '灵魂强度加成',
	PRIMARY KEY(`body_type_id`)
);


CREATE TABLE `skill_data` (
	`skill_id` VARCHAR(20) NOT NULL COMMENT '功法id',
	`skill_name` VARCHAR(50) NOT NULL COMMENT '功法名称',
	`skill_type` ENUM('心法', '功法', '武技', '秘术', '禁术') NOT NULL COMMENT '功法类型',
	`skill_realm_requirement` TINYINT NOT NULL COMMENT '境界要求',
	`skill_description` TEXT COMMENT '功法描述',
	`skill_power` INTEGER NOT NULL COMMENT '功法威力',
	PRIMARY KEY(`skill_id`)
);


CREATE TABLE `weapon_data` (
	`weapon_id` VARCHAR(20) NOT NULL COMMENT '武器id',
	`weapon_name` VARCHAR(50) NOT NULL COMMENT '武器名称',
	`weapon_type` ENUM('剑', '刀', '棍', '枪', '鞭', '锤', '扇', '笛', '其他') NOT NULL COMMENT '武器类型',
	`weapon_realm_requirement` TINYINT NOT NULL COMMENT '境界要求',
	`weapon_description` TEXT COMMENT '武器描述',
	`weapon_attack_power` INTEGER NOT NULL COMMENT '攻击力',
	`weapon_special_effect` TEXT COMMENT '特殊效果',
	PRIMARY KEY(`weapon_id`)
);


CREATE TABLE `zongmen_data` (
	`zongmen_id` VARCHAR(8) NOT NULL COMMENT '宗门id(8位序列)',
	`zongmen_name` VARCHAR(50) NOT NULL COMMENT '宗门名称',
	`description` TEXT COMMENT '宗门描述',
	`founder` VARCHAR(20) COMMENT '创始人',
	`established_date` DATE COMMENT '创建日期',
	`realm_level_required` TINYINT NOT NULL COMMENT '加入所需境界',
	PRIMARY KEY(`zongmen_id`)
);


CREATE TABLE `achievement_data` (
	`achievement_id` VARCHAR(20) NOT NULL COMMENT '成就id',
	`achievement_name` VARCHAR(50) NOT NULL COMMENT '成就名称',
	`achievement_type` ENUM('区域', '世界', '特殊') NOT NULL COMMENT '成就类型',
	`description` TEXT COMMENT '成就描述',
	`reward` TEXT COMMENT '成就奖励',
	`difficulty` TINYINT NOT NULL COMMENT '难度系数',
	PRIMARY KEY(`achievement_id`)
);


CREATE TABLE `character_items` (
	`character_items_id` VARCHAR(20) NOT NULL COMMENT '物品实例id',
	`item_id` VARCHAR(20) NOT NULL COMMENT '物品唯一id',
	`character_uuid` VARCHAR(10) NOT NULL COMMENT '关联人物id',
	`item_count` INTEGER NOT NULL DEFAULT 1 COMMENT '物品数量',
	`item_level` TINYINT NOT NULL DEFAULT 1 COMMENT '物品等级',
	`is_equipped` BOOLEAN NOT NULL DEFAULT false COMMENT '是否装备',
	`slot_position` TINYINT COMMENT '装备槽位（1-武器，2-防具，3-饰品等）',
	`durability` INTEGER COMMENT '耐久度',
	`create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '获得时间',
	`update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
	PRIMARY KEY(`character_items_id`)
);


CREATE TABLE `item_data` (
	`item_id` VARCHAR(20) NOT NULL COMMENT '物品唯一id',
	`item_name` VARCHAR(50) NOT NULL COMMENT '物品名称',
	`item_type` ENUM('武器', '防具', '饰品', '消耗品', '材料', '任务物品', '法宝') NOT NULL COMMENT '物品类型',
	`quality` ENUM('普通', '优秀', '稀有', '史诗', '传说', '神器') NOT NULL DEFAULT '普通' COMMENT '物品品质',
	`description` TEXT COMMENT '物品描述',
	`realm_requirement` TINYINT COMMENT '使用/装备所需境界',
	`attack_power` INTEGER COMMENT '攻击力加成',
	`defense_power` INTEGER COMMENT '防御力加成',
	`health_bonus` INTEGER COMMENT '生命值加成',
	`mana_bonus` INTEGER COMMENT '法力值加成',
	`special_effect` TEXT COMMENT '特殊效果描述',
	`is_stackable` BOOLEAN NOT NULL DEFAULT false COMMENT '是否可堆叠',
	`max_stack_size` INTEGER NOT NULL DEFAULT 1 COMMENT '最大堆叠数量',
	`sell_price` INTEGER NOT NULL DEFAULT 0 COMMENT '出售价格',
	`buy_price` INTEGER COMMENT '购买价格',
	`is_bind_on_pickup` BOOLEAN NOT NULL DEFAULT false COMMENT '拾取绑定',
	`is_bind_on_equip` BOOLEAN NOT NULL DEFAULT false COMMENT '装备绑定',
	`create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	`update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
	PRIMARY KEY(`item_id`)
);


CREATE TABLE `item_type_category` (
	`category_id` TINYINT NOT NULL COMMENT '分类id',
	`category_name` VARCHAR(20) NOT NULL COMMENT '分类名称',
	`parent_category_id` TINYINT COMMENT '父分类id',
	`description` VARCHAR(100) COMMENT '分类描述',
	PRIMARY KEY(`category_id`)
);


CREATE TABLE `item_type_relations` (
	`item_id` VARCHAR(20) NOT NULL COMMENT '物品id',
	`category_id` TINYINT NOT NULL COMMENT '分类id',
	PRIMARY KEY(`item_id`, `category_id`)
);


ALTER TABLE `character_affinities`
ADD FOREIGN KEY(`character_uuid`) REFERENCES `character_base_info`(`character_uuid`)
ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE `character_strength`
ADD FOREIGN KEY(`character_uuid`) REFERENCES `character_base_info`(`character_uuid`)
ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE `character_body_types`
ADD FOREIGN KEY(`character_uuid`) REFERENCES `character_base_info`(`character_uuid`)
ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE `character_skills`
ADD FOREIGN KEY(`character_uuid`) REFERENCES `character_base_info`(`character_uuid`)
ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE `character_weapons`
ADD FOREIGN KEY(`character_uuid`) REFERENCES `character_base_info`(`character_uuid`)
ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE `character_currency`
ADD FOREIGN KEY(`character_uuid`) REFERENCES `character_base_info`(`character_uuid`)
ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE `character_items`
ADD FOREIGN KEY(`character_uuid`) REFERENCES `character_base_info`(`character_uuid`)
ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE `character_items`
ADD FOREIGN KEY(`item_id`) REFERENCES `item_data`(`item_id`)
ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE `item_type_relations`
ADD FOREIGN KEY(`item_id`) REFERENCES `item_data`(`item_id`)
ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE `item_type_relations`
ADD FOREIGN KEY(`category_id`) REFERENCES `item_type_category`(`category_id`)
ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE `character_base_info`
ADD FOREIGN KEY(`zongMen_id`) REFERENCES `zongmen_data`(`zongmen_id`)
ON UPDATE NO ACTION ON DELETE RESTRICT;
ALTER TABLE `character_base_info`
ADD FOREIGN KEY(`title_3_id`) REFERENCES `achievement_data`(`achievement_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_base_info`
ADD FOREIGN KEY(`title_4_id`) REFERENCES `achievement_data`(`achievement_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_base_info`
ADD FOREIGN KEY(`title_5_id`) REFERENCES `achievement_data`(`achievement_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_body_types`
ADD FOREIGN KEY(`body_type_1_id`) REFERENCES `body_type_data`(`body_type_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_body_types`
ADD FOREIGN KEY(`body_type_2_id`) REFERENCES `body_type_data`(`body_type_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_body_types`
ADD FOREIGN KEY(`body_type_3_id`) REFERENCES `body_type_data`(`body_type_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_body_types`
ADD FOREIGN KEY(`body_type_4_id`) REFERENCES `body_type_data`(`body_type_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_body_types`
ADD FOREIGN KEY(`body_type_5_id`) REFERENCES `body_type_data`(`body_type_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_skills`
ADD FOREIGN KEY(`skill_1_id`) REFERENCES `skill_data`(`skill_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_skills`
ADD FOREIGN KEY(`skill_2_id`) REFERENCES `skill_data`(`skill_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_skills`
ADD FOREIGN KEY(`skill_3_id`) REFERENCES `skill_data`(`skill_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_skills`
ADD FOREIGN KEY(`skill_4_id`) REFERENCES `skill_data`(`skill_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_skills`
ADD FOREIGN KEY(`skill_5_id`) REFERENCES `skill_data`(`skill_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_skills`
ADD FOREIGN KEY(`skill_6_id`) REFERENCES `skill_data`(`skill_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_skills`
ADD FOREIGN KEY(`skill_7_id`) REFERENCES `skill_data`(`skill_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_skills`
ADD FOREIGN KEY(`skill_8_id`) REFERENCES `skill_data`(`skill_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_skills`
ADD FOREIGN KEY(`skill_9_id`) REFERENCES `skill_data`(`skill_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_skills`
ADD FOREIGN KEY(`skill_10_id`) REFERENCES `skill_data`(`skill_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_weapons`
ADD FOREIGN KEY(`weapon_1_id`) REFERENCES `weapon_data`(`weapon_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_weapons`
ADD FOREIGN KEY(`weapon_2_id`) REFERENCES `weapon_data`(`weapon_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_weapons`
ADD FOREIGN KEY(`weapon_3_id`) REFERENCES `weapon_data`(`weapon_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_weapons`
ADD FOREIGN KEY(`weapon_4_id`) REFERENCES `weapon_data`(`weapon_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `character_weapons`
ADD FOREIGN KEY(`weapon_5_id`) REFERENCES `weapon_data`(`weapon_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE `item_type_category`
ADD FOREIGN KEY(`parent_category_id`) REFERENCES `item_type_category`(`category_id`)
ON UPDATE NO ACTION ON DELETE SET NULL;