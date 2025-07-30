/**
 * CharacterDALs 测试脚本
 * 测试所有角色相关的数据访问层功能
 */

import { dbManager } from '../config/database.js';
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
} from '../implementations/CharacterDALs.js';
import {
  CharacterBaseInfo,
  CharacterAffinities,
  CharacterStrength,
  CharacterBodyTypes,
  CharacterSkills,
  CharacterWeapons,
  CharacterCurrency,
  CharacterItems,
  RealmData,
  BodyTypeData,
  SkillData,
  WeaponData,
  ZongmenData,
  AchievementData,
  ItemData,
  ItemTypeCategory,
  ItemTypeRelations
} from '../interfaces/types.js';

/**
 * 测试结果接口
 */
interface TestResult {
  testName: string;
  success: boolean;
  message: string;
  duration: number;
}

/**
 * CharacterDALs测试工具类
 */
class CharacterDALsTester {
  private results: TestResult[] = [];
  
  // 角色相关DAL实例
  private characterBaseInfoDAL: CharacterBaseInfoDAL;
  private characterAffinitiesDAL: CharacterAffinitiesDAL;
  private characterStrengthDAL: CharacterStrengthDAL;
  private characterBodyTypesDAL: CharacterBodyTypesDAL;
  private characterSkillsDAL: CharacterSkillsDAL;
  private characterWeaponsDAL: CharacterWeaponsDAL;
  private characterCurrencyDAL: CharacterCurrencyDAL;
  private characterItemsDAL: CharacterItemsDAL;
  
  // 静态数据DAL实例
  private realmDataDAL: RealmDataDAL;
  private bodyTypeDataDAL: BodyTypeDataDAL;
  private skillDataDAL: SkillDataDAL;
  private weaponDataDAL: WeaponDataDAL;
  private zongmenDataDAL: ZongmenDataDAL;
  private achievementDataDAL: AchievementDataDAL;
  private itemDataDAL: ItemDataDAL;
  private itemTypeCategoryDAL: ItemTypeCategoryDAL;
  private itemTypeRelationsDAL: ItemTypeRelationsDAL;
  
  // 测试用数据
  private testCharacterId: string = '';
  private testItemId: string = '';

  constructor() {
    // 初始化所有DAL实例
    this.characterBaseInfoDAL = new CharacterBaseInfoDAL();
    this.characterAffinitiesDAL = new CharacterAffinitiesDAL();
    this.characterStrengthDAL = new CharacterStrengthDAL();
    this.characterBodyTypesDAL = new CharacterBodyTypesDAL();
    this.characterSkillsDAL = new CharacterSkillsDAL();
    this.characterWeaponsDAL = new CharacterWeaponsDAL();
    this.characterCurrencyDAL = new CharacterCurrencyDAL();
    this.characterItemsDAL = new CharacterItemsDAL();
    
    this.realmDataDAL = new RealmDataDAL();
    this.bodyTypeDataDAL = new BodyTypeDataDAL();
    this.skillDataDAL = new SkillDataDAL();
    this.weaponDataDAL = new WeaponDataDAL();
    this.zongmenDataDAL = new ZongmenDataDAL();
    this.achievementDataDAL = new AchievementDataDAL();
    this.itemDataDAL = new ItemDataDAL();
    this.itemTypeCategoryDAL = new ItemTypeCategoryDAL();
    this.itemTypeRelationsDAL = new ItemTypeRelationsDAL();
  }

  /**
   * 执行单个测试
   */
  private async runTest(testName: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({
        testName,
        success: true,
        message: '测试通过',
        duration
      });
      console.log(`✅ ${testName} - 通过 (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.push({
        testName,
        success: false,
        message: error instanceof Error ? error.message : String(error),
        duration
      });
      console.log(`❌ ${testName} - 失败: ${error instanceof Error ? error.message : String(error)} (${duration}ms)`);
    }
  }

  /**
   * 测试CharacterBaseInfoDAL
   */
  private async testCharacterBaseInfoDAL(): Promise<void> {
    // 测试查找所有角色
    const allCharacters = await this.characterBaseInfoDAL.findAll({ limit: 5 });
    if (!Array.isArray(allCharacters)) {
      throw new Error('findAll应该返回数组');
    }
    
    if (allCharacters.length > 0) {
      this.testCharacterId = allCharacters[0].character_uuid;
      
      // 测试根据ID查找
      const character = await this.characterBaseInfoDAL.findById(this.testCharacterId);
      if (!character || character.character_uuid !== this.testCharacterId) {
        throw new Error('findById返回的角色ID不匹配');
      }
      
      // 测试根据姓名查找
      const charactersByName = await this.characterBaseInfoDAL.findByName(character.character_name);
      if (!charactersByName.some(c => c.character_uuid === this.testCharacterId)) {
        throw new Error('findByName未找到对应角色');
      }
      
      // 测试根据境界查找
      const charactersByRealm = await this.characterBaseInfoDAL.findByRealmLevel(character.character_realm_Level);
      if (!Array.isArray(charactersByRealm)) {
        throw new Error('findByRealmLevel应该返回数组');
      }
      
      // 如果有宗门，测试根据宗门查找
      if (character.zongMen_id) {
        const charactersByZongmen = await this.characterBaseInfoDAL.findByZongmen(character.zongMen_id);
        if (!Array.isArray(charactersByZongmen)) {
          throw new Error('findByZongmen应该返回数组');
        }
      }
    }
  }

  /**
   * 测试CharacterAffinitiesDAL
   */
  private async testCharacterAffinitiesDAL(): Promise<void> {
    if (!this.testCharacterId) {
      throw new Error('需要先设置测试角色ID');
    }
    
    // 测试根据角色ID查找
    const affinities = await this.characterAffinitiesDAL.findByCharacterId(this.testCharacterId);
    if (affinities && affinities.character_uuid !== this.testCharacterId) {
      throw new Error('findByCharacterId返回的角色ID不匹配');
    }
    
    // 测试根据亲和度范围查找
    const affinitiesInRange = await this.characterAffinitiesDAL.findByAffinityRange(0, 100);
    if (!Array.isArray(affinitiesInRange)) {
      throw new Error('findByAffinityRange应该返回数组');
    }
  }

  /**
   * 测试CharacterStrengthDAL
   */
  private async testCharacterStrengthDAL(): Promise<void> {
    if (!this.testCharacterId) {
      throw new Error('需要先设置测试角色ID');
    }
    
    // 测试根据角色ID查找
    const strength = await this.characterStrengthDAL.findByCharacterId(this.testCharacterId);
    if (strength && strength.character_uuid !== this.testCharacterId) {
      throw new Error('findByCharacterId返回的角色ID不匹配');
    }
    
    // 测试根据战斗力范围查找
    const strengthInRange = await this.characterStrengthDAL.findByCombatPowerRange(0, 10000);
    if (!Array.isArray(strengthInRange)) {
      throw new Error('findByCombatPowerRange应该返回数组');
    }
  }

  /**
   * 测试CharacterBodyTypesDAL
   */
  private async testCharacterBodyTypesDAL(): Promise<void> {
    if (!this.testCharacterId) {
      throw new Error('需要先设置测试角色ID');
    }
    
    // 测试根据角色ID查找
    const bodyTypes = await this.characterBodyTypesDAL.findByCharacterId(this.testCharacterId);
    if (bodyTypes && bodyTypes.character_uuid !== this.testCharacterId) {
      throw new Error('findByCharacterId返回的角色ID不匹配');
    }
  }

  /**
   * 测试CharacterSkillsDAL
   */
  private async testCharacterSkillsDAL(): Promise<void> {
    if (!this.testCharacterId) {
      throw new Error('需要先设置测试角色ID');
    }
    
    // 测试根据角色ID查找
    const skills = await this.characterSkillsDAL.findByCharacterId(this.testCharacterId);
    if (skills && skills.character_uuid !== this.testCharacterId) {
      throw new Error('findByCharacterId返回的角色ID不匹配');
    }
    
    // 获取一个技能ID进行测试
    const allSkills = await this.skillDataDAL.findAll({ limit: 1 });
    if (allSkills.length > 0) {
      const skillId = allSkills[0].skill_id;
      const charactersWithSkill = await this.characterSkillsDAL.findBySkillId(skillId);
      if (!Array.isArray(charactersWithSkill)) {
        throw new Error('findBySkillId应该返回数组');
      }
    }
  }

  /**
   * 测试CharacterWeaponsDAL
   */
  private async testCharacterWeaponsDAL(): Promise<void> {
    if (!this.testCharacterId) {
      throw new Error('需要先设置测试角色ID');
    }
    
    // 测试根据角色ID查找
    const weapons = await this.characterWeaponsDAL.findByCharacterId(this.testCharacterId);
    if (weapons && weapons.character_uuid !== this.testCharacterId) {
      throw new Error('findByCharacterId返回的角色ID不匹配');
    }
    
    // 获取一个武器ID进行测试
    const allWeapons = await this.weaponDataDAL.findAll({ limit: 1 });
    if (allWeapons.length > 0) {
      const weaponId = allWeapons[0].weapon_id;
      const charactersWithWeapon = await this.characterWeaponsDAL.findByWeaponId(weaponId);
      if (!Array.isArray(charactersWithWeapon)) {
        throw new Error('findByWeaponId应该返回数组');
      }
    }
  }

  /**
   * 测试CharacterCurrencyDAL
   */
  private async testCharacterCurrencyDAL(): Promise<void> {
    if (!this.testCharacterId) {
      throw new Error('需要先设置测试角色ID');
    }
    
    // 测试根据角色ID查找
    const currency = await this.characterCurrencyDAL.findByCharacterId(this.testCharacterId);
    if (currency && currency.character_uuid !== this.testCharacterId) {
      throw new Error('findByCharacterId返回的角色ID不匹配');
    }
    
    // 测试货币更新（如果存在货币记录）
    if (currency) {
      const originalGoldCoin = currency.gold_coin || 0;
      const updateResult = await this.characterCurrencyDAL.updateCurrency(this.testCharacterId, 'gold_coin', 10);
      
      // 验证更新
      const updatedCurrency = await this.characterCurrencyDAL.findByCharacterId(this.testCharacterId);
      if (updatedCurrency && (updatedCurrency.gold_coin || 0) !== originalGoldCoin + 10) {
        throw new Error('货币更新失败');
      }
      
      // 恢复原值
      await this.characterCurrencyDAL.updateCurrency(this.testCharacterId, 'gold_coin', -10);
    }
  }

  /**
   * 测试CharacterItemsDAL
   */
  private async testCharacterItemsDAL(): Promise<void> {
    if (!this.testCharacterId) {
      throw new Error('需要先设置测试角色ID');
    }
    
    // 测试根据角色ID查找物品
    const items = await this.characterItemsDAL.findByCharacterId(this.testCharacterId);
    if (!Array.isArray(items)) {
      throw new Error('findByCharacterId应该返回数组');
    }
    
    // 如果有物品，进行更多测试
    if (items.length > 0) {
      const item = items[0];
      this.testItemId = item.item_id;
      
      // 测试根据角色和物品ID查找
      const specificItems = await this.characterItemsDAL.findByCharacterAndItem(this.testCharacterId, this.testItemId);
      if (!Array.isArray(specificItems)) {
        throw new Error('findByCharacterAndItem应该返回数组');
      }
      
      // 测试查找已装备物品
      const equippedItems = await this.characterItemsDAL.findEquippedItems(this.testCharacterId);
      if (!Array.isArray(equippedItems)) {
        throw new Error('findEquippedItems应该返回数组');
      }
      
      // 测试装备/卸下物品（如果物品未装备）
      if (!item.is_equipped) {
        const equipResult = await this.characterItemsDAL.equipItem(item.character_items_id, 1);
        if (!equipResult) {
          throw new Error('装备物品失败');
        }
        
        // 卸下物品
        const unequipResult = await this.characterItemsDAL.unequipItem(item.character_items_id);
        if (!unequipResult) {
          throw new Error('卸下物品失败');
        }
      }
    }
  }

  /**
   * 测试RealmDataDAL
   */
  private async testRealmDataDAL(): Promise<void> {
    // 测试查找所有境界
    const allRealms = await this.realmDataDAL.findAll({ limit: 5 });
    if (!Array.isArray(allRealms)) {
      throw new Error('findAll应该返回数组');
    }
    
    if (allRealms.length > 0) {
      const realm = allRealms[0];
      
      // 测试根据大境界查找
      const majorRealms = await this.realmDataDAL.findByMajorRealm(realm.major_realm);
      if (!Array.isArray(majorRealms)) {
        throw new Error('findByMajorRealm应该返回数组');
      }
      
      // 测试根据小境界查找
      const minorRealms = await this.realmDataDAL.findByMinorRealm(realm.minor_realm);
      if (!Array.isArray(minorRealms)) {
        throw new Error('findByMinorRealm应该返回数组');
      }
      
      // 测试根据阶段查找
      const stageRealms = await this.realmDataDAL.findByStage(realm.stage);
      if (!Array.isArray(stageRealms)) {
        throw new Error('findByStage应该返回数组');
      }
    }
  }

  /**
   * 测试BodyTypeDataDAL
   */
  private async testBodyTypeDataDAL(): Promise<void> {
    // 测试查找所有体质
    const allBodyTypes = await this.bodyTypeDataDAL.findAll({ limit: 5 });
    if (!Array.isArray(allBodyTypes)) {
      throw new Error('findAll应该返回数组');
    }
    
    if (allBodyTypes.length > 0) {
      const bodyType = allBodyTypes[0];
      
      // 测试根据名称查找
      const foundBodyType = await this.bodyTypeDataDAL.findByName(bodyType.body_type_name);
      if (!foundBodyType || foundBodyType.body_type_id !== bodyType.body_type_id) {
        throw new Error('findByName返回的体质不匹配');
      }
    }
  }

  /**
   * 测试SkillDataDAL
   */
  private async testSkillDataDAL(): Promise<void> {
    // 测试查找所有技能
    const allSkills = await this.skillDataDAL.findAll({ limit: 5 });
    if (!Array.isArray(allSkills)) {
      throw new Error('findAll应该返回数组');
    }
    
    if (allSkills.length > 0) {
      const skill = allSkills[0];
      
      // 测试根据类型查找
      const skillsByType = await this.skillDataDAL.findByType(skill.skill_type);
      if (!Array.isArray(skillsByType)) {
        throw new Error('findByType应该返回数组');
      }
      
      // 测试根据境界要求查找
      const skillsByRealm = await this.skillDataDAL.findByRealmRequirement(skill.skill_realm_requirement || 1);
      if (!Array.isArray(skillsByRealm)) {
        throw new Error('findByRealmRequirement应该返回数组');
      }
    }
  }

  /**
   * 测试WeaponDataDAL
   */
  private async testWeaponDataDAL(): Promise<void> {
    // 测试查找所有武器
    const allWeapons = await this.weaponDataDAL.findAll({ limit: 5 });
    if (!Array.isArray(allWeapons)) {
      throw new Error('findAll应该返回数组');
    }
    
    if (allWeapons.length > 0) {
      const weapon = allWeapons[0];
      
      // 测试根据类型查找
      const weaponsByType = await this.weaponDataDAL.findByType(weapon.weapon_type);
      if (!Array.isArray(weaponsByType)) {
        throw new Error('findByType应该返回数组');
      }
      
      // 测试根据境界要求查找
      const weaponsByRealm = await this.weaponDataDAL.findByRealmRequirement(weapon.weapon_realm_requirement || 1);
      if (!Array.isArray(weaponsByRealm)) {
        throw new Error('findByRealmRequirement应该返回数组');
      }
    }
  }

  /**
   * 测试ZongmenDataDAL
   */
  private async testZongmenDataDAL(): Promise<void> {
    // 测试查找所有宗门
    const allZongmen = await this.zongmenDataDAL.findAll({ limit: 5 });
    if (!Array.isArray(allZongmen)) {
      throw new Error('findAll应该返回数组');
    }
    
    if (allZongmen.length > 0) {
      const zongmen = allZongmen[0];
      
      // 测试根据名称查找
      const foundZongmen = await this.zongmenDataDAL.findByName(zongmen.zongmen_name);
      if (!foundZongmen || foundZongmen.zongmen_id !== zongmen.zongmen_id) {
        throw new Error('findByName返回的宗门不匹配');
      }
    }
  }

  /**
   * 测试AchievementDataDAL
   */
  private async testAchievementDataDAL(): Promise<void> {
    // 测试查找所有成就
    const allAchievements = await this.achievementDataDAL.findAll({ limit: 5 });
    if (!Array.isArray(allAchievements)) {
      throw new Error('findAll应该返回数组');
    }
    
    if (allAchievements.length > 0) {
      const achievement = allAchievements[0];
      
      // 测试根据类型查找
      const achievementsByType = await this.achievementDataDAL.findByType(achievement.achievement_type);
      if (!Array.isArray(achievementsByType)) {
        throw new Error('findByType应该返回数组');
      }
      
      // 测试根据难度查找
      const achievementsByDifficulty = await this.achievementDataDAL.findByDifficulty(achievement.difficulty);
      if (!Array.isArray(achievementsByDifficulty)) {
        throw new Error('findByDifficulty应该返回数组');
      }
    }
  }

  /**
   * 测试ItemDataDAL
   */
  private async testItemDataDAL(): Promise<void> {
    // 测试查找所有物品
    const allItems = await this.itemDataDAL.findAll({ limit: 5 });
    if (!Array.isArray(allItems)) {
      throw new Error('findAll应该返回数组');
    }
    
    if (allItems.length > 0) {
      const item = allItems[0];
      
      // 测试根据类型查找
      const itemsByType = await this.itemDataDAL.findByType(item.item_type);
      if (!Array.isArray(itemsByType)) {
        throw new Error('findByType应该返回数组');
      }
      
      // 测试根据品质查找
      const itemsByQuality = await this.itemDataDAL.findByQuality(item.quality);
      if (!Array.isArray(itemsByQuality)) {
        throw new Error('findByQuality应该返回数组');
      }
      
      // 测试根据境界要求查找
      const itemsByRealm = await this.itemDataDAL.findByRealmRequirement(item.realm_requirement || 1);
      if (!Array.isArray(itemsByRealm)) {
        throw new Error('findByRealmRequirement应该返回数组');
      }
    }
  }

  /**
   * 测试ItemTypeCategoryDAL
   */
  private async testItemTypeCategoryDAL(): Promise<void> {
    // 测试查找所有分类
    const allCategories = await this.itemTypeCategoryDAL.findAll({ limit: 5 });
    if (!Array.isArray(allCategories)) {
      throw new Error('findAll应该返回数组');
    }
    
    // 测试查找顶级分类
    const topCategories = await this.itemTypeCategoryDAL.findTopLevel();
    if (!Array.isArray(topCategories)) {
      throw new Error('findTopLevel应该返回数组');
    }
    
    // 如果有顶级分类，测试查找子分类
    if (topCategories.length > 0) {
      const parentCategory = topCategories[0];
      const childCategories = await this.itemTypeCategoryDAL.findChildren(parentCategory.category_id);
      if (!Array.isArray(childCategories)) {
        throw new Error('findChildren应该返回数组');
      }
    }
  }

  /**
   * 测试ItemTypeRelationsDAL
   */
  private async testItemTypeRelationsDAL(): Promise<void> {
    // 测试查找所有关系
    const allRelations = await this.itemTypeRelationsDAL.findAll({ limit: 5 });
    if (!Array.isArray(allRelations)) {
      throw new Error('findAll应该返回数组');
    }
    
    if (allRelations.length > 0) {
      const relation = allRelations[0];
      
      // 测试根据物品ID查找分类
      const categoriesByItem = await this.itemTypeRelationsDAL.findCategoriesByItem(relation.item_id);
      if (!Array.isArray(categoriesByItem)) {
        throw new Error('findCategoriesByItem应该返回数组');
      }
      
      // 测试根据分类ID查找物品
      const itemsByCategory = await this.itemTypeRelationsDAL.findItemsByCategory(relation.category_id);
      if (!Array.isArray(itemsByCategory)) {
        throw new Error('findItemsByCategory应该返回数组');
      }
    }
  }

  /**
   * 运行所有测试
   */
  async runAllTests(): Promise<void> {
    console.log('🚀 开始CharacterDALs测试\n');

    // 初始化数据库连接
    try {
      await dbManager.connect();
      console.log('✅ 数据库连接成功\n');
    } catch (error) {
      console.error('❌ 数据库连接失败:', error);
      return;
    }

    // 执行所有测试
    await this.runTest('CharacterBaseInfoDAL测试', () => this.testCharacterBaseInfoDAL());
    await this.runTest('CharacterAffinitiesDAL测试', () => this.testCharacterAffinitiesDAL());
    await this.runTest('CharacterStrengthDAL测试', () => this.testCharacterStrengthDAL());
    await this.runTest('CharacterBodyTypesDAL测试', () => this.testCharacterBodyTypesDAL());
    await this.runTest('CharacterSkillsDAL测试', () => this.testCharacterSkillsDAL());
    await this.runTest('CharacterWeaponsDAL测试', () => this.testCharacterWeaponsDAL());
    await this.runTest('CharacterCurrencyDAL测试', () => this.testCharacterCurrencyDAL());
    await this.runTest('CharacterItemsDAL测试', () => this.testCharacterItemsDAL());
    await this.runTest('RealmDataDAL测试', () => this.testRealmDataDAL());
    await this.runTest('BodyTypeDataDAL测试', () => this.testBodyTypeDataDAL());
    await this.runTest('SkillDataDAL测试', () => this.testSkillDataDAL());
    await this.runTest('WeaponDataDAL测试', () => this.testWeaponDataDAL());
    await this.runTest('ZongmenDataDAL测试', () => this.testZongmenDataDAL());
    await this.runTest('AchievementDataDAL测试', () => this.testAchievementDataDAL());
    await this.runTest('ItemDataDAL测试', () => this.testItemDataDAL());
    await this.runTest('ItemTypeCategoryDAL测试', () => this.testItemTypeCategoryDAL());
    await this.runTest('ItemTypeRelationsDAL测试', () => this.testItemTypeRelationsDAL());

    // 输出测试结果
    this.printTestResults();

    // 关闭数据库连接
    await dbManager.close();
  }

  /**
   * 打印测试结果
   */
  private printTestResults(): void {
    console.log('\n📊 CharacterDALs测试结果汇总:');
    console.log('=' .repeat(60));
    
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`总测试数: ${this.results.length}`);
    console.log(`通过: ${passed}`);
    console.log(`失败: ${failed}`);
    console.log(`总耗时: ${totalTime}ms`);
    console.log(`成功率: ${((passed / this.results.length) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ 失败的测试:');
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`  - ${r.testName}: ${r.message}`);
        });
    }
    
    console.log('\n⏱️  各测试耗时:');
    this.results.forEach(r => {
      const status = r.success ? '✅' : '❌';
      console.log(`  ${status} ${r.testName}: ${r.duration}ms`);
    });
    
    console.log('\n' + '='.repeat(60));
    
    if (failed === 0) {
      console.log('🎉 所有CharacterDALs测试通过！功能正常。');
    } else {
      console.log('⚠️  存在测试失败，请检查CharacterDALs实现。');
    }
  }
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  const tester = new CharacterDALsTester();
  await tester.runAllTests();
}

// 如果直接运行此文件，执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('测试执行失败:', error);
    process.exit(1);
  });
}

export { CharacterDALsTester };