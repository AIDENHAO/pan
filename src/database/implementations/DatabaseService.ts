import { dalFactory } from './DALFactory.js';
import { dbInitializer } from '../config/init.js';
import { dbManager } from '../config/database.js';
import {
  CharacterBaseInfo,
  CharacterAffinities,
  CharacterStrength,
  CharacterBodyTypes,
  CharacterSkills,
  CharacterWeapons,
  CharacterCurrency,
  CharacterItems,
  QueryOptions,
  PaginatedResult
} from '../interfaces/types.js';

/**
 * 完整的人物信息
 */
export interface CompleteCharacterInfo {
  baseInfo: CharacterBaseInfo;
  affinities?: CharacterAffinities;
  strength?: CharacterStrength;
  bodyTypes?: CharacterBodyTypes;
  skills?: CharacterSkills;
  weapons?: CharacterWeapons;
  currency?: CharacterCurrency;
  items?: CharacterItems[];
}

/**
 * 创建人物的数据
 */
export interface CreateCharacterData {
  baseInfo: Omit<CharacterBaseInfo, 'character_uuid' | 'create_time' | 'update_time'>;
  affinities?: Omit<CharacterAffinities, 'character_uuid'>;
  strength?: Omit<CharacterStrength, 'character_uuid'>;
  bodyTypes?: Omit<CharacterBodyTypes, 'character_uuid'>;
  skills?: Omit<CharacterSkills, 'character_uuid'>;
  weapons?: Omit<CharacterWeapons, 'character_uuid'>;
  currency?: Omit<CharacterCurrency, 'character_uuid'>;
}

/**
 * 数据库服务类
 * 提供高级业务逻辑操作
 */
export class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * 初始化数据库
   */
  async initialize(): Promise<void> {
    const isInitialized = await dbInitializer.isInitialized();
    if (!isInitialized) {
      await dbInitializer.initialize();
    }
  }

  /**
   * 重置数据库
   */
  async reset(): Promise<void> {
    await dbInitializer.reset();
    await dbInitializer.initialize();
  }

  /**
   * 关闭数据库连接
   */
  async close(): Promise<void> {
    await dbManager.close();
  }

  /**
   * 创建完整的人物信息
   */
  async createCharacter(data: CreateCharacterData): Promise<CompleteCharacterInfo> {
    const transaction = dalFactory.createTransaction();
    
    try {
      return await transaction.execute(async () => {
        // 创建基础信息
        const baseInfo = await dalFactory.getCharacterBaseInfoDAL().create(data.baseInfo);
        const characterId = baseInfo.character_uuid;

        const result: CompleteCharacterInfo = { baseInfo };

        // 创建五行亲和度
        if (data.affinities) {
          const affinities = await dalFactory.getCharacterAffinitiesDAL().create({
            ...data.affinities,
            character_uuid: characterId
          } as any);
          result.affinities = affinities;
        }

        // 创建强度属性
        if (data.strength) {
          const strength = await dalFactory.getCharacterStrengthDAL().create({
            ...data.strength,
            character_uuid: characterId
          } as any);
          result.strength = strength;
        }

        // 创建体质类型
        if (data.bodyTypes) {
          const bodyTypes = await dalFactory.getCharacterBodyTypesDAL().create({
            ...data.bodyTypes,
            character_uuid: characterId
          } as any);
          result.bodyTypes = bodyTypes;
        }

        // 创建技能
        if (data.skills) {
          const skills = await dalFactory.getCharacterSkillsDAL().create({
            ...data.skills,
            character_uuid: characterId
          } as any);
          result.skills = skills;
        }

        // 创建武器
        if (data.weapons) {
          const weapons = await dalFactory.getCharacterWeaponsDAL().create({
            ...data.weapons,
            character_uuid: characterId
          } as any);
          result.weapons = weapons;
        }

        // 创建货币
        if (data.currency) {
          const currency = await dalFactory.getCharacterCurrencyDAL().create({
            ...data.currency,
            character_uuid: characterId
          } as any);
          result.currency = currency;
        }

        return result;
      });
    } catch (error) {
      console.error('创建人物失败:', error);
      throw error;
    }
  }

  /**
   * 获取完整的人物信息
   */
  async getCompleteCharacterInfo(characterId: string): Promise<CompleteCharacterInfo | null> {
    try {
      const baseInfo = await dalFactory.getCharacterBaseInfoDAL().findById(characterId);
      if (!baseInfo) {
        return null;
      }

      const result: CompleteCharacterInfo = { baseInfo };

      // 并行获取所有相关数据
      const [affinities, strength, bodyTypes, skills, weapons, currency, items] = await Promise.all([
        dalFactory.getCharacterAffinitiesDAL().findByCharacterId(characterId),
        dalFactory.getCharacterStrengthDAL().findByCharacterId(characterId),
        dalFactory.getCharacterBodyTypesDAL().findByCharacterId(characterId),
        dalFactory.getCharacterSkillsDAL().findByCharacterId(characterId),
        dalFactory.getCharacterWeaponsDAL().findByCharacterId(characterId),
        dalFactory.getCharacterCurrencyDAL().findByCharacterId(characterId),
        dalFactory.getCharacterItemsDAL().findByCharacterId(characterId)
      ]);

      if (affinities) result.affinities = affinities;
      if (strength) result.strength = strength;
      if (bodyTypes) result.bodyTypes = bodyTypes;
      if (skills) result.skills = skills;
      if (weapons) result.weapons = weapons;
      if (currency) result.currency = currency;
      if (items && items.length > 0) result.items = items;

      return result;
    } catch (error) {
      console.error('获取人物信息失败:', error);
      throw error;
    }
  }

  /**
   * 删除人物及其所有相关数据
   */
  async deleteCharacter(characterId: string): Promise<boolean> {
    const transaction = dalFactory.createTransaction();
    
    try {
      return await transaction.execute(async () => {
        // 删除所有相关数据（由于外键约束，会自动级联删除）
        const deleted = await dalFactory.getCharacterBaseInfoDAL().delete(characterId);
        return deleted;
      });
    } catch (error) {
      console.error('删除人物失败:', error);
      throw error;
    }
  }

  /**
   * 分页获取人物列表
   */
  async getCharacterList(
    page: number = 1, 
    pageSize: number = 20, 
    options?: QueryOptions
  ): Promise<PaginatedResult<CharacterBaseInfo>> {
    try {
      return await dalFactory.getCharacterBaseInfoDAL().findPaginated(page, pageSize, options);
    } catch (error) {
      console.error('获取人物列表失败:', error);
      throw error;
    }
  }

  /**
   * 搜索人物
   */
  async searchCharacters(
    searchTerm: string, 
    searchType: 'name' | 'zongmen' | 'realm' = 'name'
  ): Promise<CharacterBaseInfo[]> {
    try {
      const characterDAL = dalFactory.getCharacterBaseInfoDAL();
      
      switch (searchType) {
        case 'name':
          return await characterDAL.findByName(searchTerm);
        case 'zongmen':
          return await characterDAL.findByZongmen(searchTerm);
        case 'realm':
          const realmLevel = parseInt(searchTerm);
          if (isNaN(realmLevel)) {
            return [];
          }
          return await characterDAL.findByRealmLevel(realmLevel);
        default:
          return [];
      }
    } catch (error) {
      console.error('搜索人物失败:', error);
      throw error;
    }
  }

  /**
   * 更新人物修炼值
   */
  async updateCultivation(characterId: string, cultivationValue: number): Promise<boolean> {
    try {
      const result = await dalFactory.getCharacterBaseInfoDAL().update(characterId, {
        cultivationValue,
        update_time: new Date()
      } as Partial<CharacterBaseInfo>);
      return !!result;
    } catch (error) {
      console.error('更新修炼值失败:', error);
      throw error;
    }
  }

  /**
   * 人物突破境界
   */
  async breakthrough(characterId: string): Promise<boolean> {
    const transaction = dalFactory.createTransaction();
    
    try {
      return await transaction.execute(async () => {
        const character = await dalFactory.getCharacterBaseInfoDAL().findById(characterId);
        if (!character) {
          throw new Error('人物不存在');
        }

        if (!character.breakThroughEnabled || !character.breakThroughItemsEnabled) {
          throw new Error('突破条件不满足');
        }

        if (character.breakThroughState) {
          throw new Error('正在突破中');
        }

        // 更新境界和相关属性
        const newRealmLevel = character.character_realm_Level + 1;
        const realmData = await dalFactory.getRealmDataDAL().findById(newRealmLevel);
        
        if (!realmData) {
          throw new Error('境界数据不存在');
        }

        // 更新人物基础信息
        await dalFactory.getCharacterBaseInfoDAL().update(characterId, {
          character_realm_Level: newRealmLevel,
          cultivationLimitBase: realmData.base_cultivation_limit,
          cultivationSpeedBase: realmData.base_cultivation_speed,
          cultivationValue: 0, // 重置修炼值
          breakThroughEnabled: false,
          breakThroughState: false,
          update_time: new Date()
        } as Partial<CharacterBaseInfo>);

        // 更新强度属性
        const strength = await dalFactory.getCharacterStrengthDAL().findByCharacterId(characterId);
        if (strength) {
          await dalFactory.getCharacterStrengthDAL().update(characterId, {
            physical_strength: realmData.base_physical_strength,
            spiritual_strength: realmData.base_spiritual_strength,
            soul_strength: realmData.base_soul_strength
          } as Partial<CharacterStrength>);
        }

        return true;
      });
    } catch (error) {
      console.error('突破失败:', error);
      throw error;
    }
  }

  /**
   * 添加物品到人物背包
   */
  async addItemToCharacter(
    characterId: string, 
    itemId: string, 
    count: number = 1, 
    level: number = 1
  ): Promise<CharacterItems> {
    try {
      // 检查是否已有该物品
      const existingItems = await dalFactory.getCharacterItemsDAL().findByCharacterAndItem(characterId, itemId);
      
      if (existingItems.length > 0) {
        // 如果物品可堆叠，增加数量
        const itemData = await dalFactory.getItemDataDAL().findById(itemId);
        if (itemData?.is_stackable) {
          const existingItem = existingItems[0];
          const newCount = existingItem.item_count + count;
          const maxStack = itemData.max_stack_size;
          
          if (newCount <= maxStack) {
            const updated = await dalFactory.getCharacterItemsDAL().update(existingItem.character_items_id, {
              item_count: newCount,
              update_time: new Date()
            } as Partial<CharacterItems>);
            return updated!;
          }
        }
      }

      // 创建新的物品记录
      const itemInstanceId = Date.now().toString() + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return await dalFactory.getCharacterItemsDAL().create({
        character_items_id: itemInstanceId,
        character_uuid: characterId,
        item_id: itemId,
        item_count: count,
        item_level: level,
        is_equipped: false
      } as any);
    } catch (error) {
      console.error('添加物品失败:', error);
      throw error;
    }
  }

  /**
   * 装备物品
   */
  async equipItem(characterId: string, itemInstanceId: number, slotPosition: number): Promise<boolean> {
    const transaction = dalFactory.createTransaction();
    
    try {
      return await transaction.execute(async () => {
        // 检查物品是否属于该人物
        const item = await dalFactory.getCharacterItemsDAL().findById(itemInstanceId.toString());
        if (!item || item.character_uuid !== characterId) {
          throw new Error('物品不存在或不属于该人物');
        }

        // 卸下该槽位的其他装备
        const equippedItems = await dalFactory.getCharacterItemsDAL().findEquippedItems(characterId);
        for (const equippedItem of equippedItems) {
          if (equippedItem.slot_position === slotPosition) {
            await dalFactory.getCharacterItemsDAL().unequipItem(equippedItem.character_items_id);
          }
        }

        // 装备新物品
        return await dalFactory.getCharacterItemsDAL().equipItem(itemInstanceId.toString(), slotPosition);
      });
    } catch (error) {
      console.error('装备物品失败:', error);
      throw error;
    }
  }

  /**
   * 获取数据库统计信息
   */
  async getStatistics(): Promise<{
    characterCount: number;
    realmCount: number;
    skillCount: number;
    weaponCount: number;
    itemCount: number;
  }> {
    try {
      const [characterCount, realmCount, skillCount, weaponCount, itemCount] = await Promise.all([
        dalFactory.getCharacterBaseInfoDAL().count(),
        dalFactory.getRealmDataDAL().count(),
        dalFactory.getSkillDataDAL().count(),
        dalFactory.getWeaponDataDAL().count(),
        dalFactory.getItemDataDAL().count()
      ]);

      return {
        characterCount,
        realmCount,
        skillCount,
        weaponCount,
        itemCount
      };
    } catch (error) {
      console.error('获取统计信息失败:', error);
      throw error;
    }
  }
}

// 导出单例实例
export const databaseService = DatabaseService.getInstance();