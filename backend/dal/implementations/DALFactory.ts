import { IDALFactory, ITransaction } from '../../database/interfaces/dal.js';
import {
  CharacterBaseInfoDAL,
  CharacterAffinitiesDAL,
  CharacterStrengthDAL,
  CharacterBodyTypesDAL,
  CharacterSkillsDAL,
  CharacterWeaponsDAL,
  CharacterCurrencyDAL,
  CharacterItemsDAL,
  RealmDataDAL,
  BodyTypeDataDAL,
  SkillDataDAL,
  WeaponDataDAL,
  ZongmenDataDAL,
  AchievementDataDAL,
  ItemDataDAL,
  ItemTypeCategoryDAL,
  ItemTypeRelationsDAL
} from './CharacterDALs.js';
import { dbManager } from '../../database/config/database.js';

/**
 * 事务管理实现
 */
export class Transaction implements ITransaction {
  private isActive: boolean = false;
  private connection: any = null;

  async begin(): Promise<void> {
    if (this.isActive) {
      throw new Error('事务已经开始');
    }
    
    const pool = await dbManager.connect();
    this.connection = await pool.getConnection();
    await this.connection.beginTransaction();
    this.isActive = true;
  }

  async commit(): Promise<void> {
    if (!this.isActive || !this.connection) {
      throw new Error('没有活动的事务');
    }
    
    await this.connection.commit();
    this.connection.release();
    this.connection = null;
    this.isActive = false;
  }

  async rollback(): Promise<void> {
    if (!this.isActive || !this.connection) {
      throw new Error('没有活动的事务');
    }
    
    await this.connection.rollback();
    this.connection.release();
    this.connection = null;
    this.isActive = false;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    await this.begin();
    
    try {
      const result = await operation();
      await this.commit();
      return result;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  isTransactionActive(): boolean {
    return this.isActive;
  }
}

/**
 * 数据访问层工厂实现
 */
export class DALFactory implements IDALFactory {
  private static instance: DALFactory;
  
  // DAL实例缓存
  private characterBaseInfoDAL?: CharacterBaseInfoDAL;
  private characterAffinitiesDAL?: CharacterAffinitiesDAL;
  private characterStrengthDAL?: CharacterStrengthDAL;
  private characterBodyTypesDAL?: CharacterBodyTypesDAL;
  private characterSkillsDAL?: CharacterSkillsDAL;
  private characterWeaponsDAL?: CharacterWeaponsDAL;
  private characterCurrencyDAL?: CharacterCurrencyDAL;
  private characterItemsDAL?: CharacterItemsDAL;
  private realmDataDAL?: RealmDataDAL;
  private bodyTypeDataDAL?: BodyTypeDataDAL;
  private skillDataDAL?: SkillDataDAL;
  private weaponDataDAL?: WeaponDataDAL;
  private zongmenDataDAL?: ZongmenDataDAL;
  private achievementDataDAL?: AchievementDataDAL;
  private itemDataDAL?: ItemDataDAL;
  private itemTypeCategoryDAL?: ItemTypeCategoryDAL;
  private itemTypeRelationsDAL?: ItemTypeRelationsDAL;

  private constructor() {}

  public static getInstance(): DALFactory {
    if (!DALFactory.instance) {
      DALFactory.instance = new DALFactory();
    }
    return DALFactory.instance;
  }

  getCharacterBaseInfoDAL(): CharacterBaseInfoDAL {
    if (!this.characterBaseInfoDAL) {
      this.characterBaseInfoDAL = new CharacterBaseInfoDAL();
    }
    return this.characterBaseInfoDAL;
  }

  getCharacterAffinitiesDAL(): CharacterAffinitiesDAL {
    if (!this.characterAffinitiesDAL) {
      this.characterAffinitiesDAL = new CharacterAffinitiesDAL();
    }
    return this.characterAffinitiesDAL;
  }

  getCharacterStrengthDAL(): CharacterStrengthDAL {
    if (!this.characterStrengthDAL) {
      this.characterStrengthDAL = new CharacterStrengthDAL();
    }
    return this.characterStrengthDAL;
  }

  getCharacterBodyTypesDAL(): CharacterBodyTypesDAL {
    if (!this.characterBodyTypesDAL) {
      this.characterBodyTypesDAL = new CharacterBodyTypesDAL();
    }
    return this.characterBodyTypesDAL;
  }

  getCharacterSkillsDAL(): CharacterSkillsDAL {
    if (!this.characterSkillsDAL) {
      this.characterSkillsDAL = new CharacterSkillsDAL();
    }
    return this.characterSkillsDAL;
  }

  getCharacterWeaponsDAL(): CharacterWeaponsDAL {
    if (!this.characterWeaponsDAL) {
      this.characterWeaponsDAL = new CharacterWeaponsDAL();
    }
    return this.characterWeaponsDAL;
  }

  getCharacterCurrencyDAL(): CharacterCurrencyDAL {
    if (!this.characterCurrencyDAL) {
      this.characterCurrencyDAL = new CharacterCurrencyDAL();
    }
    return this.characterCurrencyDAL;
  }

  getCharacterItemsDAL(): CharacterItemsDAL {
    if (!this.characterItemsDAL) {
      this.characterItemsDAL = new CharacterItemsDAL();
    }
    return this.characterItemsDAL;
  }

  getRealmDataDAL(): RealmDataDAL {
    if (!this.realmDataDAL) {
      this.realmDataDAL = new RealmDataDAL();
    }
    return this.realmDataDAL;
  }

  getBodyTypeDataDAL(): BodyTypeDataDAL {
    if (!this.bodyTypeDataDAL) {
      this.bodyTypeDataDAL = new BodyTypeDataDAL();
    }
    return this.bodyTypeDataDAL;
  }

  getSkillDataDAL(): SkillDataDAL {
    if (!this.skillDataDAL) {
      this.skillDataDAL = new SkillDataDAL();
    }
    return this.skillDataDAL;
  }

  getWeaponDataDAL(): WeaponDataDAL {
    if (!this.weaponDataDAL) {
      this.weaponDataDAL = new WeaponDataDAL();
    }
    return this.weaponDataDAL;
  }

  getZongmenDataDAL(): ZongmenDataDAL {
    if (!this.zongmenDataDAL) {
      this.zongmenDataDAL = new ZongmenDataDAL();
    }
    return this.zongmenDataDAL;
  }

  getAchievementDataDAL(): AchievementDataDAL {
    if (!this.achievementDataDAL) {
      this.achievementDataDAL = new AchievementDataDAL();
    }
    return this.achievementDataDAL;
  }

  getItemDataDAL(): ItemDataDAL {
    if (!this.itemDataDAL) {
      this.itemDataDAL = new ItemDataDAL();
    }
    return this.itemDataDAL;
  }

  getItemTypeCategoryDAL(): ItemTypeCategoryDAL {
    if (!this.itemTypeCategoryDAL) {
      this.itemTypeCategoryDAL = new ItemTypeCategoryDAL();
    }
    return this.itemTypeCategoryDAL;
  }

  getItemTypeRelationsDAL(): ItemTypeRelationsDAL {
    if (!this.itemTypeRelationsDAL) {
      this.itemTypeRelationsDAL = new ItemTypeRelationsDAL();
    }
    return this.itemTypeRelationsDAL;
  }

  createTransaction(): ITransaction {
    return new Transaction();
  }

  /**
   * 清理所有DAL实例缓存
   */
  clearCache(): void {
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