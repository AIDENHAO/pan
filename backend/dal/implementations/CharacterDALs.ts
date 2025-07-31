import { BaseDAL, CharacterDAL, StaticDataDAL } from './BaseDAL.js';
import {
  CharacterBaseInfo,
  CharacterAffinities,
  CharacterStrength,
  CharacterBodyTypes,
  CharacterSkills,
  CharacterWeapons,
  CharacterCurrency,
  CharacterItems,
  RealmData,
  BodyTypeData,
  SkillData,
  WeaponData,
  ZongmenData,
  AchievementData,
  ItemData,
  ItemTypeCategory,
  ItemTypeRelations
} from '../../database/interfaces/types.js';
import { dbManager } from '../../database/config/database.js';

/**
 * 人物基础信息DAL
 */
export class CharacterBaseInfoDAL extends BaseDAL<CharacterBaseInfo> {
  constructor() {
    super('character_base_info', 'character_uuid');
  }

  /**
   * 根据姓名查找人物
   */
  async findByName(name: string): Promise<CharacterBaseInfo[]> {
    return await this.findWhere({ character_name: name } as Partial<CharacterBaseInfo>);
  }

  /**
   * 根据宗门查找人物
   */
  async findByZongmen(zongMenId: string): Promise<CharacterBaseInfo[]> {
    return await this.findWhere({ zongMen_id: zongMenId } as Partial<CharacterBaseInfo>);
  }

  /**
   * 根据境界查找人物
   */
  async findByRealmLevel(realmLevel: number): Promise<CharacterBaseInfo[]> {
    return await this.findWhere({ character_realm_Level: realmLevel } as Partial<CharacterBaseInfo>);
  }

  /**
   * 创建人物（重写以生成ID）
   */
  async create(data: Omit<CharacterBaseInfo, 'character_uuid' | 'create_time' | 'update_time'>): Promise<CharacterBaseInfo> {
    // 生成8位序列+2位随机的ID
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const character_uuid = timestamp + random;

    const characterData = {
      ...data,
      character_uuid,
      create_time: new Date(),
      update_time: new Date()
    };

    const keys = Object.keys(characterData);
    const values = Object.values(characterData);
    const placeholders = keys.map(() => '?').join(', ');
    const columns = keys.map(key => `\`${key}\``).join(', ');

    const sql = `INSERT INTO \`${this.tableName}\` (${columns}) VALUES (${placeholders})`;
    await dbManager.run(sql, values);

    return characterData as CharacterBaseInfo;
  }
}

/**
 * 人物五行亲和度DAL
 */
export class CharacterAffinitiesDAL extends CharacterDAL<CharacterAffinities> {
  constructor() {
    super('character_affinities', 'character_uuid');
  }

  /**
   * 根据总亲和度范围查找
   */
  async findByAffinityRange(min: number, max: number): Promise<CharacterAffinities[]> {
    const sql = `SELECT * FROM \`${this.tableName}\` WHERE total_affinity BETWEEN ? AND ?`;
    return await dbManager.all<CharacterAffinities>(sql, [min, max]);
  }
}

/**
 * 人物强度属性DAL
 */
export class CharacterStrengthDAL extends CharacterDAL<CharacterStrength> {
  constructor() {
    super('character_strength', 'character_uuid');
  }

  /**
   * 根据战斗力范围查找
   */
  async findByCombatPowerRange(min: number, max: number): Promise<CharacterStrength[]> {
    const sql = `SELECT * FROM \`${this.tableName}\` WHERE combat_power BETWEEN ? AND ?`;
    return await dbManager.all<CharacterStrength>(sql, [min, max]);
  }
}

/**
 * 人物体质类型DAL
 */
export class CharacterBodyTypesDAL extends CharacterDAL<CharacterBodyTypes> {
  constructor() {
    super('character_body_types', 'character_uuid');
  }
}

/**
 * 人物技能DAL
 */
export class CharacterSkillsDAL extends CharacterDAL<CharacterSkills> {
  constructor() {
    super('character_skills', 'character_uuid');
  }

  /**
   * 根据技能ID查找拥有该技能的人物
   */
  async findBySkillId(skillId: string): Promise<CharacterSkills[]> {
    const sql = `
      SELECT * FROM \`${this.tableName}\` 
      WHERE skill_1_id = ? OR skill_2_id = ? OR skill_3_id = ? OR skill_4_id = ? OR skill_5_id = ? 
         OR skill_6_id = ? OR skill_7_id = ? OR skill_8_id = ? OR skill_9_id = ? OR skill_10_id = ?
    `;
    const params = Array(10).fill(skillId);
    return await dbManager.all<CharacterSkills>(sql, params);
  }
}

/**
 * 人物武器DAL
 */
export class CharacterWeaponsDAL extends CharacterDAL<CharacterWeapons> {
  constructor() {
    super('character_weapons', 'character_uuid');
  }

  /**
   * 根据武器ID查找拥有该武器的人物
   */
  async findByWeaponId(weaponId: string): Promise<CharacterWeapons[]> {
    const sql = `
      SELECT * FROM \`${this.tableName}\` 
      WHERE weapon_1_id = ? OR weapon_2_id = ? OR weapon_3_id = ? OR weapon_4_id = ? OR weapon_5_id = ?
    `;
    const params = Array(5).fill(weaponId);
    return await dbManager.all<CharacterWeapons>(sql, params);
  }
}

/**
 * 人物货币DAL
 */
export class CharacterCurrencyDAL extends CharacterDAL<CharacterCurrency> {
  constructor() {
    super('character_currency', 'character_uuid');
  }

  /**
   * 更新货币数量
   */
  async updateCurrency(characterId: string, currencyType: keyof Omit<CharacterCurrency, 'character_uuid'>, amount: number): Promise<boolean> {
    const sql = `UPDATE \`${this.tableName}\` SET \`${currencyType}\` = \`${currencyType}\` + ? WHERE character_uuid = ?`;
    const result = await dbManager.run(sql, [amount, characterId]);
    return (result.changes || 0) > 0;
  }
}

/**
 * 人物物品DAL
 */
export class CharacterItemsDAL extends BaseDAL<CharacterItems, string> {
  constructor() {
    super('character_items', 'character_items_id');
  }

  /**
   * 根据人物ID查找物品
   */
  async findByCharacterId(characterId: string): Promise<CharacterItems[]> {
    return await this.findWhere({ character_uuid: characterId } as Partial<CharacterItems>);
  }

  /**
   * 根据人物ID和物品ID查找
   */
  async findByCharacterAndItem(characterId: string, itemId: string): Promise<CharacterItems[]> {
    return await this.findWhere({ 
      character_uuid: characterId, 
      item_id: itemId 
    } as Partial<CharacterItems>);
  }

  /**
   * 查找已装备的物品
   */
  async findEquippedItems(characterId: string): Promise<CharacterItems[]> {
    return await this.findWhere({ 
      character_uuid: characterId, 
      is_equipped: true 
    } as Partial<CharacterItems>);
  }

  /**
   * 装备物品
   */
  async equipItem(id: string, slotPosition: number): Promise<boolean> {
    const result = await this.update(id, { 
      is_equipped: true, 
      slot_position: slotPosition 
    } as Partial<CharacterItems>);
    return !!result;
  }

  /**
   * 卸下物品
   */
  async unequipItem(id: string): Promise<boolean> {
    const result = await this.update(id, { 
      is_equipped: false, 
      slot_position: undefined 
    } as Partial<CharacterItems>);
    return !!result;
  }
}

/**
 * 境界数据DAL（静态数据）
 */
export class RealmDataDAL extends StaticDataDAL<RealmData, number> {
  constructor() {
    super('realm_data', 'realm_level');
  }

  /**
   * 根据大境界查找
   */
  async findByMajorRealm(majorRealm: string): Promise<RealmData[]> {
    return await this.findWhere({ major_realm: majorRealm } as Partial<RealmData>);
  }

  /**
   * 根据小境界查找
   */
  async findByMinorRealm(minorRealm: string): Promise<RealmData[]> {
    return await this.findWhere({ minor_realm: minorRealm } as Partial<RealmData>);
  }

  /**
   * 根据阶段划分查找
   */
  async findByStage(stage: string): Promise<RealmData[]> {
    return await this.findWhere({ stage } as Partial<RealmData>);
  }
}

/**
 * 体质数据DAL（静态数据）
 */
export class BodyTypeDataDAL extends StaticDataDAL<BodyTypeData> {
  constructor() {
    super('body_type_data', 'body_type_id');
  }

  /**
   * 根据体质名称查找
   */
  async findByName(bodyTypeName: string): Promise<BodyTypeData | null> {
    return await this.findOneWhere({ body_type_name: bodyTypeName } as Partial<BodyTypeData>);
  }
}

/**
 * 技能数据DAL（静态数据）
 */
export class SkillDataDAL extends StaticDataDAL<SkillData> {
  constructor() {
    super('skill_data', 'skill_id');
  }

  /**
   * 根据技能类型查找
   */
  async findByType(skillType: SkillData['skill_type']): Promise<SkillData[]> {
    return await this.findWhere({ skill_type: skillType } as Partial<SkillData>);
  }

  /**
   * 根据境界要求查找
   */
  async findByRealmRequirement(realmLevel: number): Promise<SkillData[]> {
    const sql = `SELECT * FROM \`${this.tableName}\` WHERE skill_realm_requirement <= ?`;
    return await dbManager.all<SkillData>(sql, [realmLevel]);
  }
}

/**
 * 武器数据DAL（静态数据）
 */
export class WeaponDataDAL extends StaticDataDAL<WeaponData> {
  constructor() {
    super('weapon_data', 'weapon_id');
  }

  /**
   * 根据武器类型查找
   */
  async findByType(weaponType: WeaponData['weapon_type']): Promise<WeaponData[]> {
    return await this.findWhere({ weapon_type: weaponType } as Partial<WeaponData>);
  }

  /**
   * 根据境界要求查找
   */
  async findByRealmRequirement(realmLevel: number): Promise<WeaponData[]> {
    const sql = `SELECT * FROM \`${this.tableName}\` WHERE weapon_realm_requirement <= ?`;
    return await dbManager.all<WeaponData>(sql, [realmLevel]);
  }
}

/**
 * 宗门数据DAL（静态数据）
 */
export class ZongmenDataDAL extends StaticDataDAL<ZongmenData> {
  constructor() {
    super('zongmen_data', 'zongmen_id');
  }

  /**
   * 根据宗门名称查找
   */
  async findByName(zongmenName: string): Promise<ZongmenData | null> {
    return await this.findOneWhere({ zongmen_name: zongmenName } as Partial<ZongmenData>);
  }
}

/**
 * 成就数据DAL（静态数据）
 */
export class AchievementDataDAL extends StaticDataDAL<AchievementData> {
  constructor() {
    super('achievement_data', 'achievement_id');
  }

  /**
   * 根据成就类型查找
   */
  async findByType(achievementType: AchievementData['achievement_type']): Promise<AchievementData[]> {
    return await this.findWhere({ achievement_type: achievementType } as Partial<AchievementData>);
  }

  /**
   * 根据难度查找
   */
  async findByDifficulty(difficulty: number): Promise<AchievementData[]> {
    return await this.findWhere({ difficulty } as Partial<AchievementData>);
  }
}

/**
 * 物品数据DAL（静态数据）
 */
export class ItemDataDAL extends StaticDataDAL<ItemData> {
  constructor() {
    super('item_data', 'item_id');
  }

  /**
   * 根据物品类型查找
   */
  async findByType(itemType: ItemData['item_type']): Promise<ItemData[]> {
    return await this.findWhere({ item_type: itemType } as Partial<ItemData>);
  }

  /**
   * 根据品质查找
   */
  async findByQuality(quality: ItemData['quality']): Promise<ItemData[]> {
    return await this.findWhere({ quality } as Partial<ItemData>);
  }

  /**
   * 根据境界要求查找
   */
  async findByRealmRequirement(realmLevel: number): Promise<ItemData[]> {
    const sql = `SELECT * FROM \`${this.tableName}\` WHERE realm_requirement IS NULL OR realm_requirement <= ?`;
    return await dbManager.all<ItemData>(sql, [realmLevel]);
  }
}

/**
 * 物品类型分类DAL（静态数据）
 */
export class ItemTypeCategoryDAL extends StaticDataDAL<ItemTypeCategory, number> {
  constructor() {
    super('item_type_category', 'category_id');
  }

  /**
   * 查找顶级分类
   */
  async findTopLevel(): Promise<ItemTypeCategory[]> {
    const sql = `SELECT * FROM \`${this.tableName}\` WHERE parent_category_id IS NULL`;
    return await dbManager.all<ItemTypeCategory>(sql);
  }

  /**
   * 查找子分类
   */
  async findChildren(parentId: number): Promise<ItemTypeCategory[]> {
    return await this.findWhere({ parent_category_id: parentId } as Partial<ItemTypeCategory>);
  }
}

/**
 * 物品类型关系DAL
 */
export class ItemTypeRelationsDAL extends BaseDAL<ItemTypeRelations> {
  constructor() {
    super('item_type_relations', 'item_id');
  }

  /**
   * 根据物品ID查找分类
   */
  async findCategoriesByItem(itemId: string): Promise<ItemTypeRelations[]> {
    return await this.findWhere({ item_id: itemId } as Partial<ItemTypeRelations>);
  }

  /**
   * 根据分类ID查找物品
   */
  async findItemsByCategory(categoryId: number): Promise<ItemTypeRelations[]> {
    return await this.findWhere({ category_id: categoryId } as Partial<ItemTypeRelations>);
  }
}