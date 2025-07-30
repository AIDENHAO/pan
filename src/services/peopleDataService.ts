/**
 * 人物数据服务类
 * 负责人物数据的增删改查操作和业务逻辑处理
 * @author AI Assistant
 * @version 2.0
 * @date 2024-12-19
 */

import {
  IPeopleData,
  IPeopleDataFile,
  IPeopleDataMetadata,
  PeopleDataValidator,
  RealmLevel,
  PhysicalAttributeLevel
} from '../types/peopleData';
import peopleDataJson from '../data/peopleData.json';

/**
 * 人物查询条件接口
 */
export interface IPeopleQueryConditions {
  name?: string;                    // 姓名模糊搜索
  title0?: string;                  // 道号模糊搜索
  realmLevelMin?: number;           // 最低境界等级
  realmLevelMax?: number;           // 最高境界等级
  talentValueMin?: number;          // 最低天赋值
  talentValueMax?: number;          // 最高天赋值
  zongMenName?: string;             // 宗门名称
  zongMenJoinBool?: boolean;        // 是否加入宗门
  isCultivating?: boolean;          // 是否在修炼
  breakThroughNow?: boolean;        // 是否在突破
  physicalAttributes?: number;      // 体质属性
}

/**
 * 人物排序选项接口
 */
export interface IPeopleSortOptions {
  field: 'name' | 'realmLevel' | 'talentValue' | 'cultivationValue' | 'joinDate';
  order: 'asc' | 'desc';
}

/**
 * 操作结果接口
 */
export interface IPeopleOperationResult {
  success: boolean;
  message: string;
  data?: IPeopleData;
  error?: string;
}

/**
 * 人物数据服务类
 * 提供完整的人物数据管理功能
 */
export class PeopleDataService {
  private static instance: PeopleDataService;
  private peopleData: IPeopleDataFile;

  /**
   * 私有构造函数，实现单例模式
   */
  private constructor() {
    this.peopleData = peopleDataJson as IPeopleDataFile;
  }

  /**
   * 获取服务实例（单例模式）
   * @returns {PeopleDataService} 服务实例
   */
  public static getInstance(): PeopleDataService {
    if (!PeopleDataService.instance) {
      PeopleDataService.instance = new PeopleDataService();
    }
    return PeopleDataService.instance;
  }

  /**
   * 获取所有人物数据
   * @returns {IPeopleData[]} 所有人物数据数组
   */
  public getAllPeople(): IPeopleData[] {
    return this.peopleData.people;
  }

  /**
   * 根据ID获取人物数据
   * @param {string} personId - 人物ID
   * @returns {IPeopleData | null} 人物数据或null
   */
  public getPersonById(personId: string): IPeopleData | null {
    return this.peopleData.people.find(person => person.id === personId) || null;
  }

  /**
   * 根据姓名获取人物数据
   * @param {string} personName - 人物姓名
   * @returns {IPeopleData | null} 人物数据或null
   */
  public getPersonByName(personName: string): IPeopleData | null {
    return this.peopleData.people.find(person => person.name === personName) || null;
  }

  /**
   * 根据条件查询人物数据
   * @param {IPeopleQueryConditions} conditions - 查询条件
   * @returns {IPeopleData[]} 符合条件的人物数据数组
   */
  public queryPeople(conditions: IPeopleQueryConditions): IPeopleData[] {
    let result = this.peopleData.people;

    // 按姓名筛选（模糊搜索）
    if (conditions.name) {
      result = result.filter(p => p.name.toLowerCase().includes(conditions.name!.toLowerCase()));
    }

    // 按道号筛选（模糊搜索）
    if (conditions.title0) {
      result = result.filter(p => p.title0.toLowerCase().includes(conditions.title0!.toLowerCase()));
    }

    // 按境界等级范围筛选
    if (conditions.realmLevelMin !== undefined) {
      result = result.filter(p => p.realmLevel >= conditions.realmLevelMin!);
    }
    if (conditions.realmLevelMax !== undefined) {
      result = result.filter(p => p.realmLevel <= conditions.realmLevelMax!);
    }

    // 按天赋值范围筛选
    if (conditions.talentValueMin !== undefined) {
      result = result.filter(p => p.talentValue >= conditions.talentValueMin!);
    }
    if (conditions.talentValueMax !== undefined) {
      result = result.filter(p => p.talentValue <= conditions.talentValueMax!);
    }

    // 按宗门筛选
    if (conditions.zongMenName) {
      result = result.filter(p => p.zongMenName === conditions.zongMenName);
    }

    // 按是否加入宗门筛选
    if (conditions.zongMenJoinBool !== undefined) {
      result = result.filter(p => p.zongMenJoinBool === conditions.zongMenJoinBool);
    }

    // 按是否在修炼筛选
    if (conditions.isCultivating !== undefined) {
      result = result.filter(p => p.isCultivating === conditions.isCultivating);
    }

    // 按是否在突破筛选
    if (conditions.breakThroughNow !== undefined) {
      result = result.filter(p => p.breakThroughNow === conditions.breakThroughNow);
    }

    // 按体质属性筛选
    if (conditions.physicalAttributes !== undefined) {
      result = result.filter(p => p.physicalAttributes === conditions.physicalAttributes);
    }

    return result;
  }

  /**
   * 对人物数据进行排序
   * @param {IPeopleData[]} people - 待排序的人物数据
   * @param {IPeopleSortOptions} sortOptions - 排序选项
   * @returns {IPeopleData[]} 排序后的人物数据
   */
  public sortPeople(people: IPeopleData[], sortOptions: IPeopleSortOptions): IPeopleData[] {
    return [...people].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortOptions.field) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'realmLevel':
          aValue = a.realmLevel;
          bValue = b.realmLevel;
          break;
        case 'talentValue':
          aValue = a.talentValue;
          bValue = b.talentValue;
          break;
        case 'cultivationValue':
          aValue = a.cultivationValue;
          bValue = b.cultivationValue;
          break;
        case 'joinDate':
          aValue = a.joinDate;
          bValue = b.joinDate;
          break;
        default:
          return 0;
      }

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }

      return sortOptions.order === 'desc' ? -comparison : comparison;
    });
  }

  /**
   * 添加新人物
   * @param {Omit<IPeopleData, 'id'>} personData - 人物数据（不包含ID）
   * @returns {IPeopleOperationResult} 操作结果
   */
  public addPerson(personData: Omit<IPeopleData, 'id'>): IPeopleOperationResult {
    try {
      // 生成新的人物ID
      const newId = this.generateNewPersonId();
      
      // 创建完整的人物数据
      const newPerson: IPeopleData = {
        ...personData,
        id: newId
      };

      // 验证人物数据
      const validationResult = this.validatePersonData(newPerson);
      if (!validationResult.success) {
        return validationResult;
      }

      // 检查姓名是否重复
      const existingPerson = this.getPersonByName(newPerson.name);
      if (existingPerson) {
        return {
          success: false,
          message: `人物姓名 "${newPerson.name}" 已存在`,
          error: 'DUPLICATE_NAME'
        };
      }

      // 添加到数据中
      this.peopleData.people.push(newPerson);
      this.updateMetadata();

      return {
        success: true,
        message: `成功添加人物: ${newPerson.name}`,
        data: newPerson
      };
    } catch (error) {
      return {
        success: false,
        message: '添加人物时发生错误',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * 更新人物数据
   * @param {string} personId - 人物ID
   * @param {Partial<IPeopleData>} updateData - 更新的数据
   * @returns {IPeopleOperationResult} 操作结果
   */
  public updatePerson(personId: string, updateData: Partial<IPeopleData>): IPeopleOperationResult {
    try {
      const personIndex = this.peopleData.people.findIndex(p => p.id === personId);
      if (personIndex === -1) {
        return {
          success: false,
          message: `未找到ID为 "${personId}" 的人物`,
          error: 'PERSON_NOT_FOUND'
        };
      }

      // 合并更新数据
      const updatedPerson: IPeopleData = {
        ...this.peopleData.people[personIndex],
        ...updateData,
        id: personId // 确保ID不被修改
      };

      // 验证更新后的数据
      const validationResult = this.validatePersonData(updatedPerson);
      if (!validationResult.success) {
        return validationResult;
      }

      // 如果更新了姓名，检查是否与其他人物重复
      if (updateData.name && updateData.name !== this.peopleData.people[personIndex].name) {
        const existingPerson = this.getPersonByName(updateData.name);
        if (existingPerson && existingPerson.id !== personId) {
          return {
            success: false,
            message: `人物姓名 "${updateData.name}" 已存在`,
            error: 'DUPLICATE_NAME'
          };
        }
      }

      // 更新数据
      this.peopleData.people[personIndex] = updatedPerson;
      this.updateMetadata();

      return {
        success: true,
        message: `成功更新人物: ${updatedPerson.name}`,
        data: updatedPerson
      };
    } catch (error) {
      return {
        success: false,
        message: '更新人物时发生错误',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * 删除人物
   * @param {string} personId - 人物ID
   * @returns {IPeopleOperationResult} 操作结果
   */
  public deletePerson(personId: string): IPeopleOperationResult {
    try {
      const personIndex = this.peopleData.people.findIndex(p => p.id === personId);
      if (personIndex === -1) {
        return {
          success: false,
          message: `未找到ID为 "${personId}" 的人物`,
          error: 'PERSON_NOT_FOUND'
        };
      }

      const deletedPerson = this.peopleData.people[personIndex];
      this.peopleData.people.splice(personIndex, 1);
      this.updateMetadata();

      return {
        success: true,
        message: `成功删除人物: ${deletedPerson.name}`,
        data: deletedPerson
      };
    } catch (error) {
      return {
        success: false,
        message: '删除人物时发生错误',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * 获取境界等级名称
   * @param {number} realmLevel - 境界等级
   * @returns {string} 境界名称
   */
  public getRealmLevelName(realmLevel: number): string {
    if (realmLevel >= 0 && realmLevel <= 9) return '凡人境界';
    if (realmLevel >= 10 && realmLevel <= 19) return '练气境界';
    if (realmLevel >= 20 && realmLevel <= 29) return '筑基境界';
    if (realmLevel >= 30 && realmLevel <= 39) return '金丹境界';
    if (realmLevel >= 40 && realmLevel <= 49) return '元婴境界';
    if (realmLevel >= 50 && realmLevel <= 59) return '化神境界';
    if (realmLevel >= 60 && realmLevel <= 63) return '合体境界';
    return '未知境界';
  }

  /**
   * 获取货币类型名称
   * @param {string} moneyKey - 货币键值
   * @returns {string} 货币名称
   */
  public getMoneyTypeName(moneyKey: string): string {
    const moneyTypes: Record<string, string> = {
      '1': '铜币',
      '2': '银币',
      '3': '金币',
      '4': '下品灵石',
      '5': '中品灵石',
      '6': '极品灵石',
      '7': '宗门贡献',
      '8': '区域贡献',
      '9': '世界贡献',
      '10': '特殊贡献.1',
      '11': '特殊贡献.2',
      '12': '特殊贡献.3'
    };
    return moneyTypes[moneyKey] || '未知货币';
  }

  /**
   * 获取技能类型名称
   * @param {string} skillKey - 技能键值
   * @returns {string} 技能类型名称
   */
  public getSkillTypeName(skillKey: string): string {
    const skillTypes: Record<string, string> = {
      '1': '心法',
      '2': '功法1',
      '3': '功法2',
      '4': '武技1',
      '5': '武技2',
      '6': '武技3',
      '7': '秘术/禁术1',
      '8': '秘术/禁术2',
      '9': '秘术/禁术3',
      '10': '秘术/禁术4'
    };
    return skillTypes[skillKey] || '未知技能';
  }

  /**
   * 生成新的人物ID
   * @private
   * @returns {string} 新的人物ID
   */
  private generateNewPersonId(): string {
    const existingIds = this.peopleData.people.map(person => {
      const match = person.id.match(/^person_(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    });
    
    const maxId = Math.max(...existingIds, 0);
    const newIdNumber = maxId + 1;
    return `person_${newIdNumber.toString().padStart(3, '0')}`;
  }

  /**
   * 验证人物数据
   * @private
   * @param {IPeopleData} personData - 人物数据
   * @returns {IPeopleOperationResult} 验证结果
   */
  private validatePersonData(personData: IPeopleData): IPeopleOperationResult {
    try {
      // 验证必填字段
      if (!personData.id || !personData.name || !personData.title0) {
        return {
          success: false,
          message: '人物数据缺少必填字段：id、name或title0',
          error: 'MISSING_REQUIRED_FIELDS'
        };
      }

      // 验证ID格式
      if (!PeopleDataValidator.isValidPersonId(personData.id)) {
        return {
          success: false,
          message: `人物ID格式无效: ${personData.id}`,
          error: 'INVALID_PERSON_ID'
        };
      }

      // 验证境界等级
      if (!PeopleDataValidator.isValidRealmLevel(personData.realmLevel)) {
        return {
          success: false,
          message: `境界等级无效: ${personData.realmLevel}`,
          error: 'INVALID_REALM_LEVEL'
        };
      }

      // 验证天赋值
      if (!PeopleDataValidator.isValidTalentValue(personData.talentValue)) {
        return {
          success: false,
          message: `天赋值无效: ${personData.talentValue}`,
          error: 'INVALID_TALENT_VALUE'
        };
      }

      // 验证体质属性
      if (!PeopleDataValidator.isValidPhysicalAttributes(personData.physicalAttributes)) {
        return {
          success: false,
          message: `体质属性无效: ${personData.physicalAttributes}`,
          error: 'INVALID_PHYSICAL_ATTRIBUTES'
        };
      }

      // 验证五行属性亲和度
      for (const [element, value] of Object.entries(personData.elementalAffinity)) {
        if (!PeopleDataValidator.isValidElementalAffinity(value)) {
          return {
            success: false,
            message: `${element}属性亲和度无效: ${value}`,
            error: 'INVALID_ELEMENTAL_AFFINITY'
          };
        }
      }

      // 验证数值字段
      if (personData.cultivationValue < 0 || personData.cultivationLimitAdd < 0 || 
          personData.cultivationSpeedAdd < 0 || personData.breakThroughFailNumb < 0) {
        return {
          success: false,
          message: '修炼相关数值不能为负数',
          error: 'INVALID_CULTIVATION_VALUES'
        };
      }

      return {
        success: true,
        message: '人物数据验证通过'
      };
    } catch (error) {
      return {
        success: false,
        message: '验证人物数据时发生错误',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * 更新元数据
   * @private
   */
  private updateMetadata(): void {
    this.peopleData.metadata.totalPeople = this.peopleData.people.length;
    this.peopleData.metadata.lastUpdated = new Date().toISOString().split('T')[0];
  }

  /**
   * 获取统计信息
   * @returns 统计数据对象
   */
  public getStatistics(): {
    totalPeople: number;
    realmDistribution: { [key: string]: number };
    sectDistribution: { [key: string]: number };
    averageTalent: number;
    averageCultivation: number;
    cultivatingCount: number;
    breakingThroughCount: number;
  } {
    const people = this.peopleData.people;
    const stats = {
      totalPeople: people.length,
      realmDistribution: {} as { [key: string]: number },
      sectDistribution: {} as { [key: string]: number },
      averageTalent: 0,
      averageCultivation: 0,
      cultivatingCount: 0,
      breakingThroughCount: 0
    };

    if (people.length === 0) {
      return stats;
    }

    let totalTalent = 0;
    let totalCultivation = 0;

    people.forEach(person => {
      // 统计境界分布
      const realmName = this.getRealmLevelName(person.realmLevel);
      stats.realmDistribution[realmName] = (stats.realmDistribution[realmName] || 0) + 1;

      // 统计宗门分布
      if (person.zongMenJoinBool && person.zongMenName) {
        stats.sectDistribution[person.zongMenName] = (stats.sectDistribution[person.zongMenName] || 0) + 1;
      }

      // 累计天赋值和修炼值
      totalTalent += person.talentValue;
      totalCultivation += person.cultivationValue;

      // 统计修炼和突破状态
      if (person.isCultivating) {
        stats.cultivatingCount++;
      }
      if (person.breakThroughNow) {
        stats.breakingThroughCount++;
      }
    });

    // 计算平均值
    stats.averageTalent = Math.round(totalTalent / people.length * 100) / 100;
    stats.averageCultivation = Math.round(totalCultivation / people.length * 100) / 100;

    return stats;
  }

  /**
   * 获取元数据信息
   * @returns {IPeopleDataMetadata} 元数据
   */
  public getMetadata(): IPeopleDataMetadata {
    return this.peopleData.metadata;
  }

  /**
   * 导出人物数据为JSON字符串
   * @returns {string} JSON字符串
   */
  public exportData(): string {
    return JSON.stringify(this.peopleData, null, 2);
  }
}

/**
 * 导出服务实例
 */
export const peopleDataService = PeopleDataService.getInstance();