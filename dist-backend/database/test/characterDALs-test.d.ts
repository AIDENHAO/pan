/**
 * CharacterDALs 测试脚本
 * 测试所有角色相关的数据访问层功能
 */
/**
 * CharacterDALs测试工具类
 */
declare class CharacterDALsTester {
    private results;
    private characterBaseInfoDAL;
    private characterAffinitiesDAL;
    private characterStrengthDAL;
    private characterBodyTypesDAL;
    private characterSkillsDAL;
    private characterWeaponsDAL;
    private characterCurrencyDAL;
    private characterItemsDAL;
    private realmDataDAL;
    private bodyTypeDataDAL;
    private skillDataDAL;
    private weaponDataDAL;
    private zongmenDataDAL;
    private achievementDataDAL;
    private itemDataDAL;
    private itemTypeCategoryDAL;
    private itemTypeRelationsDAL;
    private testCharacterId;
    private testItemId;
    constructor();
    /**
     * 执行单个测试
     */
    private runTest;
    /**
     * 测试CharacterBaseInfoDAL
     */
    private testCharacterBaseInfoDAL;
    /**
     * 测试CharacterAffinitiesDAL
     */
    private testCharacterAffinitiesDAL;
    /**
     * 测试CharacterStrengthDAL
     */
    private testCharacterStrengthDAL;
    /**
     * 测试CharacterBodyTypesDAL
     */
    private testCharacterBodyTypesDAL;
    /**
     * 测试CharacterSkillsDAL
     */
    private testCharacterSkillsDAL;
    /**
     * 测试CharacterWeaponsDAL
     */
    private testCharacterWeaponsDAL;
    /**
     * 测试CharacterCurrencyDAL
     */
    private testCharacterCurrencyDAL;
    /**
     * 测试CharacterItemsDAL
     */
    private testCharacterItemsDAL;
    /**
     * 测试RealmDataDAL
     */
    private testRealmDataDAL;
    /**
     * 测试BodyTypeDataDAL
     */
    private testBodyTypeDataDAL;
    /**
     * 测试SkillDataDAL
     */
    private testSkillDataDAL;
    /**
     * 测试WeaponDataDAL
     */
    private testWeaponDataDAL;
    /**
     * 测试ZongmenDataDAL
     */
    private testZongmenDataDAL;
    /**
     * 测试AchievementDataDAL
     */
    private testAchievementDataDAL;
    /**
     * 测试ItemDataDAL
     */
    private testItemDataDAL;
    /**
     * 测试ItemTypeCategoryDAL
     */
    private testItemTypeCategoryDAL;
    /**
     * 测试ItemTypeRelationsDAL
     */
    private testItemTypeRelationsDAL;
    /**
     * 运行所有测试
     */
    runAllTests(): Promise<void>;
    /**
     * 打印测试结果
     */
    private printTestResults;
}
export { CharacterDALsTester };
//# sourceMappingURL=characterDALs-test.d.ts.map