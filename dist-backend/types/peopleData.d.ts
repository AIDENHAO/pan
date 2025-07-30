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
    "1"?: string | null;
    "2"?: string | null;
    "3"?: string | null;
    "4"?: string | null;
    "5"?: string | null;
}
/**
 * 五行属性亲和度接口
 * 每个属性值范围：0-100
 */
export interface IElementalAffinity {
    metal: number;
    wood: number;
    water: number;
    fire: number;
    earth: number;
}
/**
 * 成就称号接口
 * 支持5种不同类型的称号
 */
export interface ITitle {
    "1"?: string | null;
    "2"?: string | null;
    "3"?: string | null;
    "4"?: string | null;
    "5"?: string | null;
}
/**
 * 技能装备接口
 * 最多装备10种技能
 */
export interface ISkills {
    "1"?: string | null;
    "2"?: string | null;
    "3"?: string | null;
    "4"?: string | null;
    "5"?: string | null;
    "6"?: string | null;
    "7"?: string | null;
    "8"?: string | null;
    "9"?: string | null;
    "10"?: string | null;
}
/**
 * 货币系统接口
 * 支持12种不同类型的货币
 */
export interface IMoney {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
    "6": number;
    "7": number;
    "8": number;
    "9": number;
    "10": number;
    "11": number;
    "12": number;
}
/**
 * 人物数据主接口
 * 包含人物的所有属性和状态信息
 */
export interface IPeopleData {
    id: string;
    name: string;
    title0: string;
    realmLevel: number;
    cultivationValue: number;
    cultivationLimitAdd: number;
    cultivationOverLimit: boolean;
    cultivationSpeedAdd: number;
    breakThroughEnabled: boolean;
    breakThroughItems: boolean;
    breakThroughNow: boolean;
    breakThroughFailNumb: number;
    talentValue: number;
    isCultivating: boolean;
    reserved15?: any;
    reserved16?: any;
    bodyType: IBodyType;
    elementalAffinity: IElementalAffinity;
    physicalAttributes: number;
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
    zongMenJoinBool: boolean;
    zongMenName: string | null;
    joinDate: string | null;
    title: ITitle;
    reserved48?: any;
    reserved49?: any;
    reserved50?: any;
    reserved51?: any;
    reserved52?: any;
    reserved53?: any;
    reserved54?: any;
    reserved55?: any;
    skills: ISkills;
    money: IMoney;
}
/**
 * 人物数据文件元数据接口
 */
export interface IPeopleDataMetadata {
    version: string;
    lastUpdated: string;
    totalPeople: number;
    description: string;
    dataStructure: {
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
    people: IPeopleData[];
    metadata: IPeopleDataMetadata;
}
/**
 * 境界等级枚举
 * 定义0-63的境界等级常量
 */
export declare enum RealmLevel {
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
    INTEGRATION_1 = 60,
    INTEGRATION_2 = 61,
    INTEGRATION_3 = 62,
    INTEGRATION_4 = 63
}
/**
 * 体质属性等级枚举
 */
export declare enum PhysicalAttributeLevel {
    VERY_WEAK = 1,
    WEAK = 2,
    NORMAL = 3,
    STRONG = 4,
    VERY_STRONG = 5
}
/**
 * 人物数据验证工具类
 */
export declare class PeopleDataValidator {
    /**
     * 验证境界等级是否有效
     * @param realmLevel 境界等级
     * @returns 是否有效
     */
    static isValidRealmLevel(realmLevel: number): boolean;
    /**
     * 验证天赋值是否有效
     * @param talentValue 天赋值
     * @returns 是否有效
     */
    static isValidTalentValue(talentValue: number): boolean;
    /**
     * 验证体质属性是否有效
     * @param physicalAttributes 体质属性
     * @returns 是否有效
     */
    static isValidPhysicalAttributes(physicalAttributes: number): boolean;
    /**
     * 验证五行属性亲和度是否有效
     * @param affinity 属性亲和度
     * @returns 是否有效
     */
    static isValidElementalAffinity(affinity: number): boolean;
    /**
     * 验证人物ID格式是否有效
     * @param id 人物ID
     * @returns 是否有效
     */
    static isValidPersonId(id: string): boolean;
}
//# sourceMappingURL=peopleData.d.ts.map