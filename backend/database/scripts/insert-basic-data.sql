-- 插入基础体质数据
INSERT INTO `body_type_data` (`body_type_id`, `body_type_name`, `description`, `physical_bonus`, `spiritual_bonus`, `soul_bonus`) VALUES
('1', '普通体质', '最常见的体质类型，无特殊加成', 0, 0, 0),
('2', '金刚体质', '体质强度极高的特殊体质', 50, 0, 0),
('3', '灵体', '灵力强度极高的特殊体质', 0, 50, 0),
('4', '神魂体质', '灵魂强度极高的特殊体质', 0, 0, 50),
('5', '混沌体质', '传说中的完美体质', 30, 30, 30);

-- 插入基础技能数据
INSERT INTO `skill_data` (`skill_id`, `skill_name`, `skill_type`, `skill_realm_requirement`, `skill_description`, `skill_power`) VALUES
('1', '基础心法', '心法', 0, '最基础的修炼心法', 10),
('2', '基础剑法', '武技', 1, '基础的剑术技能', 20),
('3', '基础拳法', '武技', 1, '基础的拳法技能', 15),
('4', '基础功法', '功法', 2, '基础的修炼功法', 25),
('5', '基础秘术', '秘术', 3, '基础的秘术技能', 30);

-- 插入基础武器数据
INSERT INTO `weapon_data` (`weapon_id`, `weapon_name`, `weapon_type`, `weapon_realm_requirement`, `weapon_description`, `weapon_attack_power`, `weapon_special_effect`) VALUES
('1', '普通木剑', '剑', 0, '最基础的木制长剑', 10, '无特殊效果'),
('2', '铁剑', '剑', 1, '普通的铁制长剑', 25, '无特殊效果'),
('3', '普通木刀', '刀', 0, '最基础的木制刀', 12, '无特殊效果'),
('4', '铁刀', '刀', 1, '普通的铁制刀', 28, '无特殊效果'),
('5', '普通木棍', '棍', 0, '最基础的木棍', 8, '无特殊效果');

-- 插入基础宗门数据
INSERT INTO `zongmen_data` (`zongmen_id`, `zongmen_name`, `description`, `founder`, `established_date`, `realm_level_required`) VALUES
('00000001', '青云宗', '以剑法闻名的正道宗门', '青云子', '2020-01-01', 1),
('00000002', '天音寺', '以佛法修炼为主的宗门', '普智大师', '2020-01-01', 2),
('00000003', '鬼王宗', '魔道宗门，实力强大', '鬼王', '2020-01-01', 3);

-- 插入基础成就数据
INSERT INTO `achievement_data` (`achievement_id`, `achievement_name`, `achievement_type`, `description`, `reward`, `difficulty`) VALUES
('region_001', '初入江湖', '区域', '第一次踏入修仙界', '经验值+100', 1),
('world_001', '修仙新手', '世界', '达到练气期', '灵石+50', 2),
('special_001', '天才修士', '特殊', '在20岁前达到筑基期', '特殊功法一部', 5);

-- 插入基础物品分类数据
INSERT INTO `item_type_category` (`category_id`, `category_name`, `parent_category_id`, `description`) VALUES
(1, '武器', NULL, '各种武器装备'),
(2, '防具', NULL, '各种防护装备'),
(3, '消耗品', NULL, '可消耗的物品'),
(4, '材料', NULL, '制作用材料'),
(5, '法宝', NULL, '特殊的法宝物品');

-- 插入基础物品数据
INSERT INTO `item_data` (`item_id`, `item_name`, `item_type`, `quality`, `description`, `realm_requirement`, `attack_power`, `defense_power`, `health_bonus`, `mana_bonus`, `special_effect`, `is_stackable`, `max_stack_size`, `sell_price`, `buy_price`, `is_bind_on_pickup`, `is_bind_on_equip`) VALUES
('item_001', '回血丹', '消耗品', '普通', '恢复少量生命值的丹药', 0, 0, 0, 50, 0, '立即恢复50点生命值', true, 99, 10, 20, false, false),
('item_002', '回灵丹', '消耗品', '普通', '恢复少量灵力的丹药', 0, 0, 0, 0, 50, '立即恢复50点灵力', true, 99, 15, 30, false, false),
('item_003', '铁甲', '防具', '普通', '普通的铁制护甲', 1, 0, 20, 0, 0, '无特殊效果', false, 1, 100, 200, false, false),
('item_004', '灵石', '材料', '普通', '修炼用的基础灵石', 0, 0, 0, 0, 0, '可用于修炼', true, 999, 1, 2, false, false),
('item_005', '聚灵珠', '法宝', '稀有', '能够聚集灵气的珠子', 5, 0, 0, 0, 100, '增加修炼速度', false, 1, 1000, 2000, false, true);