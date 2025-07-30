import { IDALFactory, ITransaction } from '../interfaces/dal.js';
import { CharacterBaseInfoDAL, CharacterAffinitiesDAL, CharacterStrengthDAL, CharacterBodyTypesDAL, CharacterSkillsDAL, CharacterWeaponsDAL, CharacterCurrencyDAL, CharacterItemsDAL, RealmDataDAL, BodyTypeDataDAL, SkillDataDAL, WeaponDataDAL, ZongmenDataDAL, AchievementDataDAL, ItemDataDAL, ItemTypeCategoryDAL, ItemTypeRelationsDAL } from './CharacterDALs.js';
/**
 * 事务管理实现
 */
export declare class Transaction implements ITransaction {
    private isActive;
    private connection;
    begin(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    execute<T>(operation: () => Promise<T>): Promise<T>;
    isTransactionActive(): boolean;
}
/**
 * 数据访问层工厂实现
 */
export declare class DALFactory implements IDALFactory {
    private static instance;
    private characterBaseInfoDAL?;
    private characterAffinitiesDAL?;
    private characterStrengthDAL?;
    private characterBodyTypesDAL?;
    private characterSkillsDAL?;
    private characterWeaponsDAL?;
    private characterCurrencyDAL?;
    private characterItemsDAL?;
    private realmDataDAL?;
    private bodyTypeDataDAL?;
    private skillDataDAL?;
    private weaponDataDAL?;
    private zongmenDataDAL?;
    private achievementDataDAL?;
    private itemDataDAL?;
    private itemTypeCategoryDAL?;
    private itemTypeRelationsDAL?;
    private constructor();
    static getInstance(): DALFactory;
    getCharacterBaseInfoDAL(): CharacterBaseInfoDAL;
    getCharacterAffinitiesDAL(): CharacterAffinitiesDAL;
    getCharacterStrengthDAL(): CharacterStrengthDAL;
    getCharacterBodyTypesDAL(): CharacterBodyTypesDAL;
    getCharacterSkillsDAL(): CharacterSkillsDAL;
    getCharacterWeaponsDAL(): CharacterWeaponsDAL;
    getCharacterCurrencyDAL(): CharacterCurrencyDAL;
    getCharacterItemsDAL(): CharacterItemsDAL;
    getRealmDataDAL(): RealmDataDAL;
    getBodyTypeDataDAL(): BodyTypeDataDAL;
    getSkillDataDAL(): SkillDataDAL;
    getWeaponDataDAL(): WeaponDataDAL;
    getZongmenDataDAL(): ZongmenDataDAL;
    getAchievementDataDAL(): AchievementDataDAL;
    getItemDataDAL(): ItemDataDAL;
    getItemTypeCategoryDAL(): ItemTypeCategoryDAL;
    getItemTypeRelationsDAL(): ItemTypeRelationsDAL;
    createTransaction(): ITransaction;
    /**
     * 清理所有DAL实例缓存
     */
    clearCache(): void;
}
export declare const dalFactory: DALFactory;
//# sourceMappingURL=DALFactory.d.ts.map