/**
 * 功法映射相关类型定义
 */
/**
 * 功法属性接口
 * 定义功法的基础属性加成
 */
export interface CultivationMethodAttributes {
    attack: number;
    speed: number;
    defense: number;
    criticalRate: number;
}
/**
 * 功法修炼要求接口
 * 定义修炼功法的前置条件
 */
export interface CultivationRequirements {
    minPhysique: number;
    minSoul: number;
    requiredResources: string[];
}
/**
 * 功法信息接口
 * 定义功法的完整信息结构
 */
export interface CultivationMethod {
    id: number;
    name: string;
    type: string;
    grade: string;
    description: string;
    requiredRealmLevel: number;
    maxLevel: number;
    attributes: CultivationMethodAttributes;
    cultivationRequirements: CultivationRequirements;
}
/**
 * 功法映射接口
 * 键为功法ID字符串，值为功法信息
 */
export interface CultivationMethodMapping {
    [key: string]: CultivationMethod;
}
/**
 * 功法等级枚举
 * 定义功法的品级分类
 */
export declare enum CultivationMethodGrade {
    HUANG_LOWER = "\u9EC4\u7EA7\u4E0B\u54C1",
    HUANG_MIDDLE = "\u9EC4\u7EA7\u4E2D\u54C1",
    HUANG_UPPER = "\u9EC4\u7EA7\u4E0A\u54C1",
    XUAN_LOWER = "\u7384\u7EA7\u4E0B\u54C1",
    XUAN_MIDDLE = "\u7384\u7EA7\u4E2D\u54C1",
    XUAN_UPPER = "\u7384\u7EA7\u4E0A\u54C1",
    DI_LOWER = "\u5730\u7EA7\u4E0B\u54C1",
    DI_MIDDLE = "\u5730\u7EA7\u4E2D\u54C1",
    DI_UPPER = "\u5730\u7EA7\u4E0A\u54C1",
    TIAN_LOWER = "\u5929\u7EA7\u4E0B\u54C1",
    TIAN_MIDDLE = "\u5929\u7EA7\u4E2D\u54C1",
    TIAN_UPPER = "\u5929\u7EA7\u4E0A\u54C1",
    SHEN = "\u795E\u7EA7"
}
/**
 * 功法类型枚举
 * 定义功法的分类
 */
export declare enum CultivationMethodType {
    SWORD = "\u5251\u6CD5",
    PALM = "\u638C\u6CD5",
    FIST = "\u62F3\u6CD5",
    FINGER = "\u6307\u6CD5",
    LEG = "\u817F\u6CD5",
    HEART = "\u5FC3\u6CD5",
    INNER = "\u5185\u529F",
    SPELL = "\u6CD5\u672F",
    THUNDER = "\u96F7\u6CD5",
    FIRE = "\u706B\u6CD5",
    ICE = "\u51B0\u6CD5",
    WIND = "\u98CE\u6CD5",
    EARTH = "\u571F\u6CD5",
    CONTROL = "\u5FA1\u5668",
    BODY = "\u4F53\u4FEE",
    FORMATION = "\u5251\u9635",
    DIVINE = "\u795E\u7EA7\u529F\u6CD5"
}
//# sourceMappingURL=cultivationMethod.d.ts.map