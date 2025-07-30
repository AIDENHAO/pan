/**
 * 人物数据类型定义文件
 * 定义修仙游戏中人物的完整数据结构
 * @author AI Assistant
 * @version 1.0
 * @date 2024-12-19
 */

/**
 * 特殊体质类型接口
 * 最多支持5种特殊体质
 */
export interface IBodyType {
  "1"?: string | null; // 特殊体质1
  "2"?: string | null; // 特殊体质2
  "3"?: string | null; // 特殊体质3
  "4"?: string | null; // 特殊体质4
  "5"?: string | null; // 特殊体质5
}

/**
 * 五行属性亲和度接口
 * 每个属性值范围：0-100
 */
export interface IElementalAffinity {
  metal: number;  // 金属性亲和度
  wood: number;   // 木属性亲和度
  water: number;  // 水属性亲和度
  fire: number;   // 火属性亲和度
  earth: number;  // 土属性亲和度
}

/**
 * 成就称号接口
 * 支持5种不同类型的称号
 */
export interface ITitle {
  "1"?: string | null; // 宗门身份
  "2"?: string | null; // 宗门成就
  "3"?: string | null; // 区域成就
  "4"?: string | null; // 世界成就
  "5"?: string | null; // 特殊成就
}

/**
 * 技能装备接口
 * 最多装备10种技能
 */
export interface ISkills {
  "1"?: string | null;  // 装备的心法
  "2"?: string | null;  // 装备的功法1
  "3"?: string | null;  // 装备的功法2
  "4"?: string | null;  // 装备的武技1
  "5"?: string | null;  // 装备的武技2
  "6"?: string | null;  // 装备的武技3
  "7"?: string | null;  // 装备的秘术/禁术1
  "8"?: string | null;  // 装备的秘术/禁术2
  "9"?: string | null;  // 装备的秘术/禁术3
  "10"?: string | null; // 装备的秘术/禁术4
}

/**
 * 货币系统接口
 * 支持12种不同类型的货币
 */
export interface IMoney {
  "1": number;  // 铜币
  "2": number;  // 银币
  "3": number;  // 金币
  "4": number;  // 下品灵石
  "5": number;  // 中品灵石
  "6": number;  // 极品灵石
  "7": number;  // 宗门贡献
  "8": number;  // 区域贡献
  "9": number;  // 世界贡献
  "10": number; // 特殊贡献.1
  "11": number; // 特殊贡献.2
  "12": number; // 特殊贡献.3
}

/**
 * 人物数据主接口
 * 包含人物的所有属性和状态信息
 */
export interface IPeopleData {
  // 基础信息
  id: string;                    // 人物唯一标识符
  name: string;                  // 人物姓名
  title0: string;                // 道号
  
  // 修炼相关属性
  realmLevel: number;            // 境界等级（0-63）
  cultivationValue: number;      // 当前修炼值
  cultivationLimitAdd: number;   // 额外修炼值上限加成
  cultivationOverLimit: boolean; // 是否允许超出修炼上限
  cultivationSpeedAdd: number;   // 额外修炼速度加成
  
  // 突破相关状态
  breakThroughEnabled: boolean;  // 修炼值是否达到突破条件
  breakThroughItems: boolean;    // 突破物品或条件是否满足
  breakThroughNow: boolean;      // 是否正在突破中
  breakThroughFailNumb: number;  // 突破失败次数统计
  
  // 天赋和状态
  talentValue: number;           // 天赋值（0-100）
  isCultivating: boolean;        // 是否正在修炼中
  
  // 预留属性位
  reserved15?: any;              // 人物属性预留位15
  reserved16?: any;              // 人物属性预留位16
  
  // 体质和属性
  bodyType: IBodyType;           // 特殊体质集合
  elementalAffinity: IElementalAffinity; // 五行属性亲和度
  physicalAttributes: number;    // 体质属性（1-5）
  
  // 更多预留属性位（28-39）
  reserved28?: any;
  reserved29?: any;
  reserved30?: any;
  reserved31?: any;
  reserved32?: any;
  reserved33?: any;
  reserved34?: any;
  reserved35?: any;
  reserved36?: any;
  reserved37?: any;
  reserved38?: any;
  reserved39?: any;
  
  // 宗门相关信息
  zongMenJoinBool: boolean;      // 是否已加入宗门
  zongMenName: string | null;    // 所属宗门名称
  joinDate: string | null;       // 加入宗门日期
  title: ITitle;                 // 各类成就称号
  
  // 更多预留属性位（48-55）
  reserved48?: any;
  reserved49?: any;
  reserved50?: any;
  reserved51?: any;
  reserved52?: any;
  reserved53?: any;
  reserved54?: any;
  reserved55?: any;
  
  // 技能和财富
  skills: ISkills;               // 装备的技能集合
  money: IMoney;                 // 各类货币资产
}

/**
 * 人物数据文件元数据接口
 */
export interface IPeopleDataMetadata {
  version: string;               // 数据版本号
  lastUpdated: string;           // 最后更新时间
  totalPeople: number;           // 总人物数量
  description: string;           // 数据文件描述
  dataStructure: {               // 数据结构说明
    realmLevels: string;
    talentValue: string;
    physicalAttributes: string;
    elementalAffinity: string;
    bodyTypes: string;
    skills: string;
    money: string;
    titles: string;
  };
}

/**
 * 完整的人物数据文件接口
 */
export interface IPeopleDataFile {
  people: IPeopleData[];         // 人物数据数组
  metadata: IPeopleDataMetadata; // 元数据信息
}

/**
 * 境界等级枚举
 * 定义0-63的境界等级常量
 */
export enum RealmLevel {
  // 凡人境界 (0-9)
  MORTAL_1 = 0,
  MORTAL_2 = 1,
  MORTAL_3 = 2,
  MORTAL_4 = 3,
  MORTAL_5 = 4,
  MORTAL_6 = 5,
  MORTAL_7 = 6,
  MORTAL_8 = 7,
  MORTAL_9 = 8,
  MORTAL_10 = 9,
  
  // 练气境界 (10-19)
  QI_REFINING_1 = 10,
  QI_REFINING_2 = 11,
  QI_REFINING_3 = 12,
  QI_REFINING_4 = 13,
  QI_REFINING_5 = 14,
  QI_REFINING_6 = 15,
  QI_REFINING_7 = 16,
  QI_REFINING_8 = 17,
  QI_REFINING_9 = 18,
  QI_REFINING_10 = 19,
  
  // 筑基境界 (20-29)
  FOUNDATION_1 = 20,
  FOUNDATION_2 = 21,
  FOUNDATION_3 = 22,
  FOUNDATION_4 = 23,
  FOUNDATION_5 = 24,
  FOUNDATION_6 = 25,
  FOUNDATION_7 = 26,
  FOUNDATION_8 = 27,
  FOUNDATION_9 = 28,
  FOUNDATION_10 = 29,
  
  // 金丹境界 (30-39)
  GOLDEN_CORE_1 = 30,
  GOLDEN_CORE_2 = 31,
  GOLDEN_CORE_3 = 32,
  GOLDEN_CORE_4 = 33,
  GOLDEN_CORE_5 = 34,
  GOLDEN_CORE_6 = 35,
  GOLDEN_CORE_7 = 36,
  GOLDEN_CORE_8 = 37,
  GOLDEN_CORE_9 = 38,
  GOLDEN_CORE_10 = 39,
  
  // 元婴境界 (40-49)
  NASCENT_SOUL_1 = 40,
  NASCENT_SOUL_2 = 41,
  NASCENT_SOUL_3 = 42,
  NASCENT_SOUL_4 = 43,
  NASCENT_SOUL_5 = 44,
  NASCENT_SOUL_6 = 45,
  NASCENT_SOUL_7 = 46,
  NASCENT_SOUL_8 = 47,
  NASCENT_SOUL_9 = 48,
  NASCENT_SOUL_10 = 49,
  
  // 化神境界 (50-59)
  SPIRIT_TRANSFORMATION_1 = 50,
  SPIRIT_TRANSFORMATION_2 = 51,
  SPIRIT_TRANSFORMATION_3 = 52,
  SPIRIT_TRANSFORMATION_4 = 53,
  SPIRIT_TRANSFORMATION_5 = 54,
  SPIRIT_TRANSFORMATION_6 = 55,
  SPIRIT_TRANSFORMATION_7 = 56,
  SPIRIT_TRANSFORMATION_8 = 57,
  SPIRIT_TRANSFORMATION_9 = 58,
  SPIRIT_TRANSFORMATION_10 = 59,
  
  // 合体境界 (60-63)
  INTEGRATION_1 = 60,
  INTEGRATION_2 = 61,
  INTEGRATION_3 = 62,
  INTEGRATION_4 = 63
}

/**
 * 体质属性等级枚举
 */
export enum PhysicalAttributeLevel {
  VERY_WEAK = 1,    // 极弱
  WEAK = 2,         // 弱
  NORMAL = 3,       // 普通
  STRONG = 4,       // 强
  VERY_STRONG = 5   // 极强
}

/**
 * 人物数据验证工具类
 */
export class PeopleDataValidator {
  /**
   * 验证境界等级是否有效
   * @param realmLevel 境界等级
   * @returns 是否有效
   */
  static isValidRealmLevel(realmLevel: number): boolean {
    return realmLevel >= 0 && realmLevel <= 63 && Number.isInteger(realmLevel);
  }
  
  /**
   * 验证天赋值是否有效
   * @param talentValue 天赋值
   * @returns 是否有效
   */
  static isValidTalentValue(talentValue: number): boolean {
    return talentValue >= 0 && talentValue <= 100;
  }
  
  /**
   * 验证体质属性是否有效
   * @param physicalAttributes 体质属性
   * @returns 是否有效
   */
  static isValidPhysicalAttributes(physicalAttributes: number): boolean {
    return physicalAttributes >= 1 && physicalAttributes <= 5 && Number.isInteger(physicalAttributes);
  }
  
  /**
   * 验证五行属性亲和度是否有效
   * @param affinity 属性亲和度
   * @returns 是否有效
   */
  static isValidElementalAffinity(affinity: number): boolean {
    return affinity >= 0 && affinity <= 100;
  }
  
  /**
   * 验证人物ID格式是否有效
   * @param id 人物ID
   * @returns 是否有效
   */
  static isValidPersonId(id: string): boolean {
    return /^person_\d{3,}$/.test(id);
  }
}

// 所有类型和类已在上方直接导出，无需重复声明