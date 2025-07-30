import { CharacterBaseInfoDAL, CharacterAffinitiesDAL, CharacterStrengthDAL, CharacterBodyTypesDAL, CharacterSkillsDAL, CharacterWeaponsDAL, CharacterCurrencyDAL, CharacterItemsDAL, RealmDataDAL, BodyTypeDataDAL, SkillDataDAL, WeaponDataDAL, ZongmenDataDAL, AchievementDataDAL, ItemDataDAL, ItemTypeCategoryDAL, ItemTypeRelationsDAL } from './CharacterDALs.js';
import { dbManager } from '../config/database.js';
/**
 * 事务管理实现
 */
export class Transaction {
    constructor() {
        this.isActive = false;
        this.connection = null;
    }
    async begin() {
        if (this.isActive) {
            throw new Error('事务已经开始');
        }
        const pool = await dbManager.connect();
        this.connection = await pool.getConnection();
        await this.connection.beginTransaction();
        this.isActive = true;
    }
    async commit() {
        if (!this.isActive || !this.connection) {
            throw new Error('没有活动的事务');
        }
        await this.connection.commit();
        this.connection.release();
        this.connection = null;
        this.isActive = false;
    }
    async rollback() {
        if (!this.isActive || !this.connection) {
            throw new Error('没有活动的事务');
        }
        await this.connection.rollback();
        this.connection.release();
        this.connection = null;
        this.isActive = false;
    }
    async execute(operation) {
        await this.begin();
        try {
            const result = await operation();
            await this.commit();
            return result;
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }
    isTransactionActive() {
        return this.isActive;
    }
}
/**
 * 数据访问层工厂实现
 */
export class DALFactory {
    constructor() { }
    static getInstance() {
        if (!DALFactory.instance) {
            DALFactory.instance = new DALFactory();
        }
        return DALFactory.instance;
    }
    getCharacterBaseInfoDAL() {
        if (!this.characterBaseInfoDAL) {
            this.characterBaseInfoDAL = new CharacterBaseInfoDAL();
        }
        return this.characterBaseInfoDAL;
    }
    getCharacterAffinitiesDAL() {
        if (!this.characterAffinitiesDAL) {
            this.characterAffinitiesDAL = new CharacterAffinitiesDAL();
        }
        return this.characterAffinitiesDAL;
    }
    getCharacterStrengthDAL() {
        if (!this.characterStrengthDAL) {
            this.characterStrengthDAL = new CharacterStrengthDAL();
        }
        return this.characterStrengthDAL;
    }
    getCharacterBodyTypesDAL() {
        if (!this.characterBodyTypesDAL) {
            this.characterBodyTypesDAL = new CharacterBodyTypesDAL();
        }
        return this.characterBodyTypesDAL;
    }
    getCharacterSkillsDAL() {
        if (!this.characterSkillsDAL) {
            this.characterSkillsDAL = new CharacterSkillsDAL();
        }
        return this.characterSkillsDAL;
    }
    getCharacterWeaponsDAL() {
        if (!this.characterWeaponsDAL) {
            this.characterWeaponsDAL = new CharacterWeaponsDAL();
        }
        return this.characterWeaponsDAL;
    }
    getCharacterCurrencyDAL() {
        if (!this.characterCurrencyDAL) {
            this.characterCurrencyDAL = new CharacterCurrencyDAL();
        }
        return this.characterCurrencyDAL;
    }
    getCharacterItemsDAL() {
        if (!this.characterItemsDAL) {
            this.characterItemsDAL = new CharacterItemsDAL();
        }
        return this.characterItemsDAL;
    }
    getRealmDataDAL() {
        if (!this.realmDataDAL) {
            this.realmDataDAL = new RealmDataDAL();
        }
        return this.realmDataDAL;
    }
    getBodyTypeDataDAL() {
        if (!this.bodyTypeDataDAL) {
            this.bodyTypeDataDAL = new BodyTypeDataDAL();
        }
        return this.bodyTypeDataDAL;
    }
    getSkillDataDAL() {
        if (!this.skillDataDAL) {
            this.skillDataDAL = new SkillDataDAL();
        }
        return this.skillDataDAL;
    }
    getWeaponDataDAL() {
        if (!this.weaponDataDAL) {
            this.weaponDataDAL = new WeaponDataDAL();
        }
        return this.weaponDataDAL;
    }
    getZongmenDataDAL() {
        if (!this.zongmenDataDAL) {
            this.zongmenDataDAL = new ZongmenDataDAL();
        }
        return this.zongmenDataDAL;
    }
    getAchievementDataDAL() {
        if (!this.achievementDataDAL) {
            this.achievementDataDAL = new AchievementDataDAL();
        }
        return this.achievementDataDAL;
    }
    getItemDataDAL() {
        if (!this.itemDataDAL) {
            this.itemDataDAL = new ItemDataDAL();
        }
        return this.itemDataDAL;
    }
    getItemTypeCategoryDAL() {
        if (!this.itemTypeCategoryDAL) {
            this.itemTypeCategoryDAL = new ItemTypeCategoryDAL();
        }
        return this.itemTypeCategoryDAL;
    }
    getItemTypeRelationsDAL() {
        if (!this.itemTypeRelationsDAL) {
            this.itemTypeRelationsDAL = new ItemTypeRelationsDAL();
        }
        return this.itemTypeRelationsDAL;
    }
    createTransaction() {
        return new Transaction();
    }
    /**
     * 清理所有DAL实例缓存
     */
    clearCache() {
        this.characterBaseInfoDAL = undefined;
        this.characterAffinitiesDAL = undefined;
        this.characterStrengthDAL = undefined;
        this.characterBodyTypesDAL = undefined;
        this.characterSkillsDAL = undefined;
        this.characterWeaponsDAL = undefined;
        this.characterCurrencyDAL = undefined;
        this.characterItemsDAL = undefined;
        this.realmDataDAL = undefined;
        this.bodyTypeDataDAL = undefined;
        this.skillDataDAL = undefined;
        this.weaponDataDAL = undefined;
        this.zongmenDataDAL = undefined;
        this.achievementDataDAL = undefined;
        this.itemDataDAL = undefined;
        this.itemTypeCategoryDAL = undefined;
        this.itemTypeRelationsDAL = undefined;
    }
}
// 导出单例实例
export const dalFactory = DALFactory.getInstance();
//# sourceMappingURL=DALFactory.js.map