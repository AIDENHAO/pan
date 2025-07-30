/**
 * 人物数据类型定义文件
 * 定义修仙游戏中人物的完整数据结构
 * @author AI Assistant
 * @version 1.0
 * @date 2024-12-19
 */
/**
 * 境界等级枚举
 * 定义0-63的境界等级常量
 */
export var RealmLevel;
(function (RealmLevel) {
    // 凡人境界 (0-9)
    RealmLevel[RealmLevel["MORTAL_1"] = 0] = "MORTAL_1";
    RealmLevel[RealmLevel["MORTAL_2"] = 1] = "MORTAL_2";
    RealmLevel[RealmLevel["MORTAL_3"] = 2] = "MORTAL_3";
    RealmLevel[RealmLevel["MORTAL_4"] = 3] = "MORTAL_4";
    RealmLevel[RealmLevel["MORTAL_5"] = 4] = "MORTAL_5";
    RealmLevel[RealmLevel["MORTAL_6"] = 5] = "MORTAL_6";
    RealmLevel[RealmLevel["MORTAL_7"] = 6] = "MORTAL_7";
    RealmLevel[RealmLevel["MORTAL_8"] = 7] = "MORTAL_8";
    RealmLevel[RealmLevel["MORTAL_9"] = 8] = "MORTAL_9";
    RealmLevel[RealmLevel["MORTAL_10"] = 9] = "MORTAL_10";
    // 练气境界 (10-19)
    RealmLevel[RealmLevel["QI_REFINING_1"] = 10] = "QI_REFINING_1";
    RealmLevel[RealmLevel["QI_REFINING_2"] = 11] = "QI_REFINING_2";
    RealmLevel[RealmLevel["QI_REFINING_3"] = 12] = "QI_REFINING_3";
    RealmLevel[RealmLevel["QI_REFINING_4"] = 13] = "QI_REFINING_4";
    RealmLevel[RealmLevel["QI_REFINING_5"] = 14] = "QI_REFINING_5";
    RealmLevel[RealmLevel["QI_REFINING_6"] = 15] = "QI_REFINING_6";
    RealmLevel[RealmLevel["QI_REFINING_7"] = 16] = "QI_REFINING_7";
    RealmLevel[RealmLevel["QI_REFINING_8"] = 17] = "QI_REFINING_8";
    RealmLevel[RealmLevel["QI_REFINING_9"] = 18] = "QI_REFINING_9";
    RealmLevel[RealmLevel["QI_REFINING_10"] = 19] = "QI_REFINING_10";
    // 筑基境界 (20-29)
    RealmLevel[RealmLevel["FOUNDATION_1"] = 20] = "FOUNDATION_1";
    RealmLevel[RealmLevel["FOUNDATION_2"] = 21] = "FOUNDATION_2";
    RealmLevel[RealmLevel["FOUNDATION_3"] = 22] = "FOUNDATION_3";
    RealmLevel[RealmLevel["FOUNDATION_4"] = 23] = "FOUNDATION_4";
    RealmLevel[RealmLevel["FOUNDATION_5"] = 24] = "FOUNDATION_5";
    RealmLevel[RealmLevel["FOUNDATION_6"] = 25] = "FOUNDATION_6";
    RealmLevel[RealmLevel["FOUNDATION_7"] = 26] = "FOUNDATION_7";
    RealmLevel[RealmLevel["FOUNDATION_8"] = 27] = "FOUNDATION_8";
    RealmLevel[RealmLevel["FOUNDATION_9"] = 28] = "FOUNDATION_9";
    RealmLevel[RealmLevel["FOUNDATION_10"] = 29] = "FOUNDATION_10";
    // 金丹境界 (30-39)
    RealmLevel[RealmLevel["GOLDEN_CORE_1"] = 30] = "GOLDEN_CORE_1";
    RealmLevel[RealmLevel["GOLDEN_CORE_2"] = 31] = "GOLDEN_CORE_2";
    RealmLevel[RealmLevel["GOLDEN_CORE_3"] = 32] = "GOLDEN_CORE_3";
    RealmLevel[RealmLevel["GOLDEN_CORE_4"] = 33] = "GOLDEN_CORE_4";
    RealmLevel[RealmLevel["GOLDEN_CORE_5"] = 34] = "GOLDEN_CORE_5";
    RealmLevel[RealmLevel["GOLDEN_CORE_6"] = 35] = "GOLDEN_CORE_6";
    RealmLevel[RealmLevel["GOLDEN_CORE_7"] = 36] = "GOLDEN_CORE_7";
    RealmLevel[RealmLevel["GOLDEN_CORE_8"] = 37] = "GOLDEN_CORE_8";
    RealmLevel[RealmLevel["GOLDEN_CORE_9"] = 38] = "GOLDEN_CORE_9";
    RealmLevel[RealmLevel["GOLDEN_CORE_10"] = 39] = "GOLDEN_CORE_10";
    // 元婴境界 (40-49)
    RealmLevel[RealmLevel["NASCENT_SOUL_1"] = 40] = "NASCENT_SOUL_1";
    RealmLevel[RealmLevel["NASCENT_SOUL_2"] = 41] = "NASCENT_SOUL_2";
    RealmLevel[RealmLevel["NASCENT_SOUL_3"] = 42] = "NASCENT_SOUL_3";
    RealmLevel[RealmLevel["NASCENT_SOUL_4"] = 43] = "NASCENT_SOUL_4";
    RealmLevel[RealmLevel["NASCENT_SOUL_5"] = 44] = "NASCENT_SOUL_5";
    RealmLevel[RealmLevel["NASCENT_SOUL_6"] = 45] = "NASCENT_SOUL_6";
    RealmLevel[RealmLevel["NASCENT_SOUL_7"] = 46] = "NASCENT_SOUL_7";
    RealmLevel[RealmLevel["NASCENT_SOUL_8"] = 47] = "NASCENT_SOUL_8";
    RealmLevel[RealmLevel["NASCENT_SOUL_9"] = 48] = "NASCENT_SOUL_9";
    RealmLevel[RealmLevel["NASCENT_SOUL_10"] = 49] = "NASCENT_SOUL_10";
    // 化神境界 (50-59)
    RealmLevel[RealmLevel["SPIRIT_TRANSFORMATION_1"] = 50] = "SPIRIT_TRANSFORMATION_1";
    RealmLevel[RealmLevel["SPIRIT_TRANSFORMATION_2"] = 51] = "SPIRIT_TRANSFORMATION_2";
    RealmLevel[RealmLevel["SPIRIT_TRANSFORMATION_3"] = 52] = "SPIRIT_TRANSFORMATION_3";
    RealmLevel[RealmLevel["SPIRIT_TRANSFORMATION_4"] = 53] = "SPIRIT_TRANSFORMATION_4";
    RealmLevel[RealmLevel["SPIRIT_TRANSFORMATION_5"] = 54] = "SPIRIT_TRANSFORMATION_5";
    RealmLevel[RealmLevel["SPIRIT_TRANSFORMATION_6"] = 55] = "SPIRIT_TRANSFORMATION_6";
    RealmLevel[RealmLevel["SPIRIT_TRANSFORMATION_7"] = 56] = "SPIRIT_TRANSFORMATION_7";
    RealmLevel[RealmLevel["SPIRIT_TRANSFORMATION_8"] = 57] = "SPIRIT_TRANSFORMATION_8";
    RealmLevel[RealmLevel["SPIRIT_TRANSFORMATION_9"] = 58] = "SPIRIT_TRANSFORMATION_9";
    RealmLevel[RealmLevel["SPIRIT_TRANSFORMATION_10"] = 59] = "SPIRIT_TRANSFORMATION_10";
    // 合体境界 (60-63)
    RealmLevel[RealmLevel["INTEGRATION_1"] = 60] = "INTEGRATION_1";
    RealmLevel[RealmLevel["INTEGRATION_2"] = 61] = "INTEGRATION_2";
    RealmLevel[RealmLevel["INTEGRATION_3"] = 62] = "INTEGRATION_3";
    RealmLevel[RealmLevel["INTEGRATION_4"] = 63] = "INTEGRATION_4";
})(RealmLevel || (RealmLevel = {}));
/**
 * 体质属性等级枚举
 */
export var PhysicalAttributeLevel;
(function (PhysicalAttributeLevel) {
    PhysicalAttributeLevel[PhysicalAttributeLevel["VERY_WEAK"] = 1] = "VERY_WEAK";
    PhysicalAttributeLevel[PhysicalAttributeLevel["WEAK"] = 2] = "WEAK";
    PhysicalAttributeLevel[PhysicalAttributeLevel["NORMAL"] = 3] = "NORMAL";
    PhysicalAttributeLevel[PhysicalAttributeLevel["STRONG"] = 4] = "STRONG";
    PhysicalAttributeLevel[PhysicalAttributeLevel["VERY_STRONG"] = 5] = "VERY_STRONG"; // 极强
})(PhysicalAttributeLevel || (PhysicalAttributeLevel = {}));
/**
 * 人物数据验证工具类
 */
export class PeopleDataValidator {
    /**
     * 验证境界等级是否有效
     * @param realmLevel 境界等级
     * @returns 是否有效
     */
    static isValidRealmLevel(realmLevel) {
        return realmLevel >= 0 && realmLevel <= 63 && Number.isInteger(realmLevel);
    }
    /**
     * 验证天赋值是否有效
     * @param talentValue 天赋值
     * @returns 是否有效
     */
    static isValidTalentValue(talentValue) {
        return talentValue >= 0 && talentValue <= 100;
    }
    /**
     * 验证体质属性是否有效
     * @param physicalAttributes 体质属性
     * @returns 是否有效
     */
    static isValidPhysicalAttributes(physicalAttributes) {
        return physicalAttributes >= 1 && physicalAttributes <= 5 && Number.isInteger(physicalAttributes);
    }
    /**
     * 验证五行属性亲和度是否有效
     * @param affinity 属性亲和度
     * @returns 是否有效
     */
    static isValidElementalAffinity(affinity) {
        return affinity >= 0 && affinity <= 100;
    }
    /**
     * 验证人物ID格式是否有效
     * @param id 人物ID
     * @returns 是否有效
     */
    static isValidPersonId(id) {
        return /^person_\d{3,}$/.test(id);
    }
}
// 所有类型和类已在上方直接导出，无需重复声明
//# sourceMappingURL=peopleData.js.map