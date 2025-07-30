import { BaseDAL, CharacterDAL, StaticDataDAL } from './BaseDAL.js';
import { CharacterBaseInfo, CharacterAffinities, CharacterStrength, CharacterBodyTypes, CharacterSkills, CharacterWeapons, CharacterCurrency, CharacterItems, RealmData, BodyTypeData, SkillData, WeaponData, ZongmenData, AchievementData, ItemData, ItemTypeCategory, ItemTypeRelations } from '../interfaces/types.js';
/**
 * 人物基础信息DAL
 */
export declare class CharacterBaseInfoDAL extends BaseDAL<CharacterBaseInfo> {
    constructor();
    /**
     * 根据姓名查找人物
     */
    findByName(name: string): Promise<CharacterBaseInfo[]>;
    /**
     * 根据宗门查找人物
     */
    findByZongmen(zongMenId: string): Promise<CharacterBaseInfo[]>;
    /**
     * 根据境界查找人物
     */
    findByRealmLevel(realmLevel: number): Promise<CharacterBaseInfo[]>;
    /**
     * 创建人物（重写以生成ID）
     */
    create(data: Omit<CharacterBaseInfo, 'character_uuid' | 'create_time' | 'update_time'>): Promise<CharacterBaseInfo>;
}
/**
 * 人物五行亲和度DAL
 */
export declare class CharacterAffinitiesDAL extends CharacterDAL<CharacterAffinities> {
    constructor();
    /**
     * 根据总亲和度范围查找
     */
    findByAffinityRange(min: number, max: number): Promise<CharacterAffinities[]>;
}
/**
 * 人物强度属性DAL
 */
export declare class CharacterStrengthDAL extends CharacterDAL<CharacterStrength> {
    constructor();
    /**
     * 根据战斗力范围查找
     */
    findByCombatPowerRange(min: number, max: number): Promise<CharacterStrength[]>;
}
/**
 * 人物体质类型DAL
 */
export declare class CharacterBodyTypesDAL extends CharacterDAL<CharacterBodyTypes> {
    constructor();
}
/**
 * 人物技能DAL
 */
export declare class CharacterSkillsDAL extends CharacterDAL<CharacterSkills> {
    constructor();
    /**
     * 根据技能ID查找拥有该技能的人物
     */
    findBySkillId(skillId: string): Promise<CharacterSkills[]>;
}
/**
 * 人物武器DAL
 */
export declare class CharacterWeaponsDAL extends CharacterDAL<CharacterWeapons> {
    constructor();
    /**
     * 根据武器ID查找拥有该武器的人物
     */
    findByWeaponId(weaponId: string): Promise<CharacterWeapons[]>;
}
/**
 * 人物货币DAL
 */
export declare class CharacterCurrencyDAL extends CharacterDAL<CharacterCurrency> {
    constructor();
    /**
     * 更新货币数量
     */
    updateCurrency(characterId: string, currencyType: keyof Omit<CharacterCurrency, 'character_uuid'>, amount: number): Promise<boolean>;
}
/**
 * 人物物品DAL
 */
export declare class CharacterItemsDAL extends BaseDAL<CharacterItems, string> {
    constructor();
    /**
     * 根据人物ID查找物品
     */
    findByCharacterId(characterId: string): Promise<CharacterItems[]>;
    /**
     * 根据人物ID和物品ID查找
     */
    findByCharacterAndItem(characterId: string, itemId: string): Promise<CharacterItems[]>;
    /**
     * 查找已装备的物品
     */
    findEquippedItems(characterId: string): Promise<CharacterItems[]>;
    /**
     * 装备物品
     */
    equipItem(id: string, slotPosition: number): Promise<boolean>;
    /**
     * 卸下物品
     */
    unequipItem(id: string): Promise<boolean>;
}
/**
 * 境界数据DAL（静态数据）
 */
export declare class RealmDataDAL extends StaticDataDAL<RealmData, number> {
    constructor();
    /**
     * 根据大境界查找
     */
    findByMajorRealm(majorRealm: string): Promise<RealmData[]>;
    /**
     * 根据小境界查找
     */
    findByMinorRealm(minorRealm: string): Promise<RealmData[]>;
    /**
     * 根据阶段划分查找
     */
    findByStage(stage: string): Promise<RealmData[]>;
}
/**
 * 体质数据DAL（静态数据）
 */
export declare class BodyTypeDataDAL extends StaticDataDAL<BodyTypeData> {
    constructor();
    /**
     * 根据体质名称查找
     */
    findByName(bodyTypeName: string): Promise<BodyTypeData | null>;
}
/**
 * 技能数据DAL（静态数据）
 */
export declare class SkillDataDAL extends StaticDataDAL<SkillData> {
    constructor();
    /**
     * 根据技能类型查找
     */
    findByType(skillType: SkillData['skill_type']): Promise<SkillData[]>;
    /**
     * 根据境界要求查找
     */
    findByRealmRequirement(realmLevel: number): Promise<SkillData[]>;
}
/**
 * 武器数据DAL（静态数据）
 */
export declare class WeaponDataDAL extends StaticDataDAL<WeaponData> {
    constructor();
    /**
     * 根据武器类型查找
     */
    findByType(weaponType: WeaponData['weapon_type']): Promise<WeaponData[]>;
    /**
     * 根据境界要求查找
     */
    findByRealmRequirement(realmLevel: number): Promise<WeaponData[]>;
}
/**
 * 宗门数据DAL（静态数据）
 */
export declare class ZongmenDataDAL extends StaticDataDAL<ZongmenData> {
    constructor();
    /**
     * 根据宗门名称查找
     */
    findByName(zongmenName: string): Promise<ZongmenData | null>;
}
/**
 * 成就数据DAL（静态数据）
 */
export declare class AchievementDataDAL extends StaticDataDAL<AchievementData> {
    constructor();
    /**
     * 根据成就类型查找
     */
    findByType(achievementType: AchievementData['achievement_type']): Promise<AchievementData[]>;
    /**
     * 根据难度查找
     */
    findByDifficulty(difficulty: number): Promise<AchievementData[]>;
}
/**
 * 物品数据DAL（静态数据）
 */
export declare class ItemDataDAL extends StaticDataDAL<ItemData> {
    constructor();
    /**
     * 根据物品类型查找
     */
    findByType(itemType: ItemData['item_type']): Promise<ItemData[]>;
    /**
     * 根据品质查找
     */
    findByQuality(quality: ItemData['quality']): Promise<ItemData[]>;
    /**
     * 根据境界要求查找
     */
    findByRealmRequirement(realmLevel: number): Promise<ItemData[]>;
}
/**
 * 物品类型分类DAL（静态数据）
 */
export declare class ItemTypeCategoryDAL extends StaticDataDAL<ItemTypeCategory, number> {
    constructor();
    /**
     * 查找顶级分类
     */
    findTopLevel(): Promise<ItemTypeCategory[]>;
    /**
     * 查找子分类
     */
    findChildren(parentId: number): Promise<ItemTypeCategory[]>;
}
/**
 * 物品类型关系DAL
 */
export declare class ItemTypeRelationsDAL extends BaseDAL<ItemTypeRelations> {
    constructor();
    /**
     * 根据物品ID查找分类
     */
    findCategoriesByItem(itemId: string): Promise<ItemTypeRelations[]>;
    /**
     * 根据分类ID查找物品
     */
    findItemsByCategory(categoryId: number): Promise<ItemTypeRelations[]>;
}
//# sourceMappingURL=CharacterDALs.d.ts.map