/**
 * 功法映射相关类型定义
 */

/**
 * 功法属性接口
 * 定义功法的基础属性加成
 */
export interface CultivationMethodAttributes {
  attack: number;        // 攻击力加成
  speed: number;         // 速度加成
  defense: number;       // 防御力加成
  criticalRate: number;  // 暴击率加成
}

/**
 * 功法修炼要求接口
 * 定义修炼功法的前置条件
 */
export interface CultivationRequirements {
  minPhysique: number;           // 最低体质要求
  minSoul: number;               // 最低神魂要求
  requiredResources: string[];   // 所需修炼资源
}

/**
 * 功法信息接口
 * 定义功法的完整信息结构
 */
export interface CultivationMethod {
  id: number;                                    // 功法ID
  name: string;                                  // 功法名称
  type: string;                                  // 功法类型（剑法、掌法、心法等）
  grade: string;                                 // 功法品级（黄级、玄级、地级、天级、神级）
  description: string;                           // 功法描述
  requiredRealmLevel: number;                    // 修炼所需境界等级
  maxLevel: number;                              // 功法最高等级
  attributes: CultivationMethodAttributes;       // 功法属性加成
  cultivationRequirements: CultivationRequirements; // 修炼要求
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
export enum CultivationMethodGrade {
  HUANG_LOWER = '黄级下品',
  HUANG_MIDDLE = '黄级中品', 
  HUANG_UPPER = '黄级上品',
  XUAN_LOWER = '玄级下品',
  XUAN_MIDDLE = '玄级中品',
  XUAN_UPPER = '玄级上品',
  DI_LOWER = '地级下品',
  DI_MIDDLE = '地级中品',
  DI_UPPER = '地级上品',
  TIAN_LOWER = '天级下品',
  TIAN_MIDDLE = '天级中品',
  TIAN_UPPER = '天级上品',
  SHEN = '神级'
}

/**
 * 功法类型枚举
 * 定义功法的分类
 */
export enum CultivationMethodType {
  SWORD = '剑法',
  PALM = '掌法',
  FIST = '拳法',
  FINGER = '指法',
  LEG = '腿法',
  HEART = '心法',
  INNER = '内功',
  SPELL = '法术',
  THUNDER = '雷法',
  FIRE = '火法',
  ICE = '冰法',
  WIND = '风法',
  EARTH = '土法',
  CONTROL = '御器',
  BODY = '体修',
  FORMATION = '剑阵',
  DIVINE = '神级功法'
}