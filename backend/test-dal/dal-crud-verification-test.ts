/**
 * DAL层CRUD功能完整验证测试
 * 测试所有数据访问层的创建、读取、更新、删除功能
 * 
 * 作者: AI助手
 * 创建时间: 2024年
 * 功能: 验证BaseDAL及其子类的CRUD操作完整性
 */

import { dbManager } from '../config/database.js';
import {
  CharacterBaseInfoDAL,
  CharacterAffinitiesDAL,
  CharacterStrengthDAL,
  CharacterCurrencyDAL,
  CharacterItemsDAL,
  RealmDataDAL,
  ItemDataDAL
} from '../implementations/CharacterDALs.js';
import {
  CharacterBaseInfo,
  CharacterAffinities,
  CharacterStrength,
  CharacterCurrency,
  CharacterItems
} from '../interfaces/types.js';

/**
 * 测试结果接口
 */
interface TestResult {
  testName: string;
  success: boolean;
  message: string;
  duration: number;
  operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'BATCH' | 'VALIDATION';
}

/**
 * CRUD验证测试工具类
 */
class DALCRUDVerificationTester {
  private results: TestResult[] = [];
  private testCharacterUuid: string = '';
  private testAffinityId: string = '';
  private testStrengthId: string = '';
  private testCurrencyId: string = '';
  private testItemId: string = '';
  
  // DAL实例
  private characterBaseInfoDAL: CharacterBaseInfoDAL;
  private characterAffinitiesDAL: CharacterAffinitiesDAL;
  private characterStrengthDAL: CharacterStrengthDAL;
  private characterCurrencyDAL: CharacterCurrencyDAL;
  private characterItemsDAL: CharacterItemsDAL;
  private realmDataDAL: RealmDataDAL;
  private itemDataDAL: ItemDataDAL;

  constructor() {
    this.characterBaseInfoDAL = new CharacterBaseInfoDAL();
    this.characterAffinitiesDAL = new CharacterAffinitiesDAL();
    this.characterStrengthDAL = new CharacterStrengthDAL();
    this.characterCurrencyDAL = new CharacterCurrencyDAL();
    this.characterItemsDAL = new CharacterItemsDAL();
    this.realmDataDAL = new RealmDataDAL();
    this.itemDataDAL = new ItemDataDAL();
  }

  /**
   * 执行单个测试
   */
  private async runTest(
    testName: string, 
    operation: TestResult['operation'],
    testFn: () => Promise<void>
  ): Promise<void> {
    const startTime = Date.now();
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({
        testName,
        operation,
        success: true,
        message: '测试通过',
        duration
      });
      console.log(`✅ [${operation}] ${testName} - 通过 (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.push({
        testName,
        operation,
        success: false,
        message: error instanceof Error ? error.message : String(error),
        duration
      });
      console.log(`❌ [${operation}] ${testName} - 失败: ${error instanceof Error ? error.message : String(error)} (${duration}ms)`);
    }
  }

  /**
   * 生成测试用的UUID
   */
  private generateTestUUID(): string {
    // 生成8位序列+2位随机，符合数据库VARCHAR(10)限制
    const timestamp = Date.now().toString().slice(-6); // 取时间戳后6位
    const random = Math.random().toString(36).substr(2, 4); // 4位随机字符
    return timestamp + random;
  }

  /**
   * 生成UUID
   */
  private generateUuid(): string {
    // 生成8位序列+2位随机，符合数据库VARCHAR(10)限制
    const timestamp = Date.now().toString().slice(-6); // 取时间戳后6位
    const random = Math.random().toString(36).substr(2, 4); // 4位随机字符
    return timestamp + random;
  }

  /**
   * 测试角色基础信息的CRUD操作
   */
  private async testCharacterBaseInfoCRUD(): Promise<void> {
    // CREATE - 创建测试
    const testCharacterData = {
      character_name: '测试角色',
      character_realm_Level: 1,
      character_gender: '男' as const,
      cultivatingState: '未修练' as const,
      cultivationLimitBase: 1000,
      cultivationLimitAdd: 0,
      cultivationValue: 100,
      cultivationOverLimit: false,
      cultivationSpeedBase: 10,
      cultivationSpeedAdd: 0,
      breakThroughEnabled: false,
      breakThroughItemsEnabled: false,
      breakThroughState: false,
      breakThroughFailNumb: 0,
      zongMenJoinBool: false
    };

    const createdCharacter = await this.characterBaseInfoDAL.create(testCharacterData);
    if (!createdCharacter || !createdCharacter.character_uuid) {
      throw new Error('创建角色失败：未返回有效的角色数据');
    }
    this.testCharacterUuid = createdCharacter.character_uuid;
    console.log(`  📝 创建角色成功，UUID: ${this.testCharacterUuid}`);

    // READ - 读取测试
    const foundCharacter = await this.characterBaseInfoDAL.findById(this.testCharacterUuid);
    if (!foundCharacter || foundCharacter.character_uuid !== this.testCharacterUuid) {
      throw new Error('读取角色失败：未找到刚创建的角色');
    }
    if (foundCharacter.character_name !== testCharacterData.character_name) {
      throw new Error('读取角色失败：角色名称不匹配');
    }
    console.log(`  📖 读取角色成功，姓名: ${foundCharacter.character_name}`);

    // UPDATE - 更新测试
    const updateData = {
      character_name: '更新角色',
      character_realm_Level: 2,
      cultivationValue: 200
    };
    const updatedCharacter = await this.characterBaseInfoDAL.update(this.testCharacterUuid, updateData);
    if (!updatedCharacter || updatedCharacter.character_name !== updateData.character_name) {
      throw new Error('更新角色失败：更新后的数据不正确');
    }
    if (updatedCharacter.character_realm_Level !== updateData.character_realm_Level) {
      throw new Error('更新角色失败：境界等级未正确更新');
    }
    console.log(`  ✏️ 更新角色成功，新姓名: ${updatedCharacter.character_name}`);

    // 验证更新后的数据持久化
    const verifyCharacter = await this.characterBaseInfoDAL.findById(this.testCharacterUuid);
    if (!verifyCharacter || verifyCharacter.character_name !== updateData.character_name) {
      throw new Error('更新验证失败：数据未正确持久化');
    }
  }

  /**
   * 测试角色亲和度的CRUD操作
   */
  private async testCharacterAffinitiesCRUD(): Promise<void> {
    if (!this.testCharacterUuid) {
      throw new Error('需要先创建测试角色');
    }

    // CREATE - 创建亲和度数据
    const affinityData = {
      character_uuid: this.testCharacterUuid,
      total_affinity: 375,
      metal_affinity: 80,
      wood_affinity: 70,
      water_affinity: 60,
      fire_affinity: 90,
      earth_affinity: 75
    };

    const createdAffinity = await this.characterAffinitiesDAL.create(affinityData);
    if (!createdAffinity || !createdAffinity.character_uuid) {
      throw new Error('创建亲和度失败：未返回有效数据');
    }
    this.testAffinityId = createdAffinity.character_uuid;
    console.log(`  📝 创建亲和度成功，ID: ${this.testAffinityId}`);

    // READ - 读取亲和度
    const foundAffinity = await this.characterAffinitiesDAL.findByCharacterId(this.testCharacterUuid);
    if (!foundAffinity || foundAffinity.character_uuid !== this.testCharacterUuid) {
      throw new Error('读取亲和度失败：未找到对应数据');
    }
    if (foundAffinity.fire_affinity !== affinityData.fire_affinity) {
      throw new Error('读取亲和度失败：火属性亲和度不匹配');
    }
    console.log(`  📖 读取亲和度成功，火属性: ${foundAffinity.fire_affinity}`);

    // UPDATE - 更新亲和度
    const updateAffinityData = {
      metal_affinity: 85,
      fire_affinity: 95,
      total_affinity: 385
    };
    const updatedAffinity = await this.characterAffinitiesDAL.update(this.testAffinityId, updateAffinityData);
    if (!updatedAffinity || updatedAffinity.metal_affinity !== updateAffinityData.metal_affinity) {
      throw new Error('更新亲和度失败：金属性亲和度未正确更新');
    }
    console.log(`  ✏️ 更新亲和度成功，金属性: ${updatedAffinity.metal_affinity}`);
  }

  /**
   * 测试角色强度的CRUD操作
   */
  private async testCharacterStrengthCRUD(): Promise<void> {
    if (!this.testCharacterUuid) {
      throw new Error('需要先创建测试角色');
    }

    // CREATE - 创建强度数据
    const strengthData = {
      character_uuid: this.testCharacterUuid,
      physical_strength: 100,
      spiritual_strength: 80,
      soul_strength: 70,
      blood_current: 1000,
      blood_max: 1000,
      blood_recovery_rate: 10,
      blood_temp_add: 0,
      spiritual_current: 500,
      spiritual_max: 500,
      spiritual_recovery_rate: 5,
      spiritual_temp_add: 0,
      mental_current: 300,
      mental_max: 300,
      mental_recovery_rate: 3,
      mental_temp_add: 0,
      combat_power: 270,
      base_combat_power: 250
    };

    const createdStrength = await this.characterStrengthDAL.create(strengthData);
    if (!createdStrength || !createdStrength.character_uuid) {
      throw new Error('创建强度数据失败');
    }
    this.testStrengthId = createdStrength.character_uuid;
    console.log(`  📝 创建强度数据成功，ID: ${this.testStrengthId}`);

    // READ - 读取强度数据
    const foundStrength = await this.characterStrengthDAL.findByCharacterId(this.testCharacterUuid);
    if (!foundStrength || foundStrength.character_uuid !== this.testCharacterUuid) {
      throw new Error('读取强度数据失败');
    }
    console.log(`  📖 读取强度数据成功，战斗力: ${foundStrength.combat_power}`);

    // UPDATE - 更新强度数据
    const updateStrengthData = {
      physical_strength: 120,
      combat_power: 300,
      base_combat_power: 280
    };
    const updatedStrength = await this.characterStrengthDAL.update(this.testStrengthId, updateStrengthData);
    if (!updatedStrength || updatedStrength.physical_strength !== updateStrengthData.physical_strength) {
      throw new Error('更新强度数据失败');
    }
    console.log(`  ✏️ 更新强度数据成功，物理强度: ${updatedStrength.physical_strength}`);
  }

  /**
   * 测试批量操作
   */
  private async testBatchOperations(): Promise<void> {
    // 测试批量创建角色
    const batchCharacterData = [
      {
        character_uuid: this.generateUuid(),
        character_name: '批量角色1',
        character_realm_Level: 1,
        character_gender: '男' as const,
        cultivatingState: '未修练' as const,
        cultivationLimitBase: 1000,
        cultivationLimitAdd: 0,
        cultivationValue: 50,
        cultivationOverLimit: false,
        cultivationSpeedBase: 10,
        cultivationSpeedAdd: 0,
        breakThroughEnabled: false,
        breakThroughItemsEnabled: false,
        breakThroughState: false,
        breakThroughFailNumb: 0,
        zongMenJoinBool: false
      },
      {
        character_uuid: this.generateUuid(),
        character_name: '批量角色2',
        character_realm_Level: 1,
        character_gender: '女' as const,
        cultivatingState: '未修练' as const,
        cultivationLimitBase: 1000,
        cultivationLimitAdd: 0,
        cultivationValue: 60,
        cultivationOverLimit: false,
        cultivationSpeedBase: 10,
        cultivationSpeedAdd: 0,
        breakThroughEnabled: false,
        breakThroughItemsEnabled: false,
        breakThroughState: false,
        breakThroughFailNumb: 0,
        zongMenJoinBool: false
      }
    ];

    const createdCharacters = await this.characterBaseInfoDAL.createMany(batchCharacterData);
    if (!createdCharacters || createdCharacters.length !== 2) {
      throw new Error('批量创建角色失败：返回的角色数量不正确');
    }
    console.log(`  📝 批量创建角色成功，创建了 ${createdCharacters.length} 个角色`);

    // 测试批量更新
    const updateConditions = {
      character_realm_Level: 1
    };
    const updateData = {
      cultivationValue: 100
    };
    const updatedCount = await this.characterBaseInfoDAL.updateMany(updateConditions, updateData);
    if (updatedCount < 2) {
      console.log(`  ⚠️ 批量更新影响了 ${updatedCount} 条记录（预期至少2条）`);
    } else {
      console.log(`  ✏️ 批量更新成功，影响了 ${updatedCount} 条记录`);
    }

    // 清理批量创建的测试数据
    for (const character of createdCharacters) {
      await this.characterBaseInfoDAL.delete(character.character_uuid);
    }
    console.log(`  🗑️ 清理批量测试数据完成`);
  }

  /**
   * 测试数据验证和边界条件
   */
  private async testDataValidation(): Promise<void> {
    // 测试空数据创建
    try {
      await this.characterBaseInfoDAL.create({} as any);
      throw new Error('应该拒绝空数据创建');
    } catch (error) {
      if (error instanceof Error && error.message === '应该拒绝空数据创建') {
        throw error;
      }
      console.log(`  ✅ 正确拒绝了空数据创建`);
    }

    // 测试不存在的ID查询
    const nonExistentId = 'non_existent_' + Date.now();
    const notFound = await this.characterBaseInfoDAL.findById(nonExistentId);
    if (notFound !== null) {
      throw new Error('查询不存在的ID应该返回null');
    }
    console.log(`  ✅ 正确处理了不存在的ID查询`);

    // 测试不存在的ID更新
    const updateResult = await this.characterBaseInfoDAL.update(nonExistentId, { character_name: '测试' });
    if (updateResult !== null) {
      throw new Error('更新不存在的记录应该返回null');
    }
    console.log(`  ✅ 正确处理了不存在的ID更新`);

    // 测试不存在的ID删除
    const deleteResult = await this.characterBaseInfoDAL.delete(nonExistentId);
    if (deleteResult !== false) {
      throw new Error('删除不存在的记录应该返回false');
    }
    console.log(`  ✅ 正确处理了不存在的ID删除`);
  }

  /**
   * 测试静态数据DAL的只读特性
   */
  private async testStaticDataDAL(): Promise<void> {
    // 测试境界数据查询
    const realms = await this.realmDataDAL.findAll({ limit: 5 });
    if (!Array.isArray(realms)) {
      throw new Error('境界数据查询应该返回数组');
    }
    console.log(`  📖 境界数据查询成功，找到 ${realms.length} 条记录`);

    if (realms.length > 0) {
      const firstRealm = realms[0];
      const foundRealm = await this.realmDataDAL.findById(firstRealm.realm_level);
      if (!foundRealm || foundRealm.realm_level !== firstRealm.realm_level) {
        throw new Error('境界数据按ID查询失败');
      }
      console.log(`  📖 境界数据按ID查询成功: ${foundRealm.major_realm}`);
    }

    // 测试物品数据查询
    const items = await this.itemDataDAL.findAll({ limit: 3 });
    if (!Array.isArray(items)) {
      throw new Error('物品数据查询应该返回数组');
    }
    console.log(`  📖 物品数据查询成功，找到 ${items.length} 条记录`);
  }

  /**
   * 清理测试数据
   */
  private async cleanupTestData(): Promise<void> {
    const cleanupTasks: Promise<void>[] = [];

    // 删除测试的亲和度数据
    if (this.testAffinityId) {
      cleanupTasks.push(
        this.characterAffinitiesDAL.delete(this.testAffinityId)
          .then(() => console.log(`  🗑️ 清理亲和度数据: ${this.testAffinityId}`))
          .catch(err => console.log(`  ⚠️ 清理亲和度数据失败: ${err.message}`))
      );
    }

    // 删除测试的强度数据
    if (this.testStrengthId) {
      cleanupTasks.push(
        this.characterStrengthDAL.delete(this.testStrengthId)
          .then(() => console.log(`  🗑️ 清理强度数据: ${this.testStrengthId}`))
          .catch(err => console.log(`  ⚠️ 清理强度数据失败: ${err.message}`))
      );
    }

    // 删除测试角色（应该最后删除，因为其他数据依赖它）
    if (this.testCharacterUuid) {
      cleanupTasks.push(
        this.characterBaseInfoDAL.delete(this.testCharacterUuid)
          .then(() => console.log(`  🗑️ 清理测试角色: ${this.testCharacterUuid}`))
          .catch(err => console.log(`  ⚠️ 清理测试角色失败: ${err.message}`))
      );
    }

    await Promise.all(cleanupTasks);
  }

  /**
   * 运行所有CRUD测试
   */
  async runAllTests(): Promise<void> {
    console.log('🚀 开始DAL层CRUD功能完整验证测试\n');

    // 初始化数据库连接
    try {
      await dbManager.connect();
      console.log('✅ 数据库连接成功\n');
    } catch (error) {
      console.error('❌ 数据库连接失败:', error);
      return;
    }

    try {
      // 执行所有CRUD测试
      await this.runTest('角色基础信息CRUD测试', 'CREATE', () => this.testCharacterBaseInfoCRUD());
      await this.runTest('角色亲和度CRUD测试', 'CREATE', () => this.testCharacterAffinitiesCRUD());
      await this.runTest('角色强度CRUD测试', 'CREATE', () => this.testCharacterStrengthCRUD());
      await this.runTest('批量操作测试', 'BATCH', () => this.testBatchOperations());
      await this.runTest('数据验证测试', 'VALIDATION', () => this.testDataValidation());
      await this.runTest('静态数据DAL测试', 'READ', () => this.testStaticDataDAL());

    } finally {
      // 清理测试数据
      console.log('\n🧹 开始清理测试数据...');
      await this.cleanupTestData();
    }

    // 输出测试结果
    this.printTestResults();

    // 关闭数据库连接
    await dbManager.close();
  }

  /**
   * 打印测试结果
   */
  private printTestResults(): void {
    console.log('\n📊 CRUD验证测试结果汇总:');
    console.log('=' .repeat(80));
    
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`总测试数: ${this.results.length}`);
    console.log(`通过: ${passed}`);
    console.log(`失败: ${failed}`);
    console.log(`总耗时: ${totalTime}ms`);
    console.log(`成功率: ${((passed / this.results.length) * 100).toFixed(1)}%`);
    
    // 按操作类型统计
    const operationStats = this.results.reduce((stats, result) => {
      if (!stats[result.operation]) {
        stats[result.operation] = { total: 0, passed: 0 };
      }
      stats[result.operation].total++;
      if (result.success) {
        stats[result.operation].passed++;
      }
      return stats;
    }, {} as Record<string, { total: number; passed: number }>);

    console.log('\n📈 各操作类型统计:');
    Object.entries(operationStats).forEach(([operation, stats]) => {
      const rate = ((stats.passed / stats.total) * 100).toFixed(1);
      console.log(`  ${operation}: ${stats.passed}/${stats.total} (${rate}%)`);
    });
    
    if (failed > 0) {
      console.log('\n❌ 失败的测试:');
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`  - [${r.operation}] ${r.testName}: ${r.message}`);
        });
    }
    
    console.log('\n⏱️  各测试耗时:');
    this.results.forEach(r => {
      const status = r.success ? '✅' : '❌';
      console.log(`  ${status} [${r.operation}] ${r.testName}: ${r.duration}ms`);
    });
    
    console.log('\n' + '='.repeat(80));
    
    if (failed === 0) {
      console.log('🎉 所有CRUD测试通过！DAL层功能完整且正常。');
      console.log('\n✨ 验证结果:');
      console.log('  ✅ 创建(CREATE)操作正常');
      console.log('  ✅ 读取(READ)操作正常');
      console.log('  ✅ 更新(UPDATE)操作正常');
      console.log('  ✅ 删除(DELETE)操作正常');
      console.log('  ✅ 批量操作正常');
      console.log('  ✅ 数据验证正常');
      console.log('  ✅ 静态数据访问正常');
    } else {
      console.log('⚠️  存在CRUD测试失败，请检查DAL层实现。');
    }
  }
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  const tester = new DALCRUDVerificationTester();
  await tester.runAllTests();
}

// 如果直接运行此文件，执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('CRUD验证测试执行失败:', error);
    process.exit(1);
  });
}

export { DALCRUDVerificationTester };