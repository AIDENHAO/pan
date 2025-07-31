import { RealmDataDAL } from '../implementations/CharacterDALs.js';
import { dbManager } from '../config/database.js';
import { RealmData } from '../interfaces/types.js';

/**
 * 境界数据DAL测试类
 */
class RealmDALTest {
  private realmDAL: RealmDataDAL;
  private testResults: { name: string; passed: boolean; error?: string; duration: number }[] = [];

  constructor() {
    this.realmDAL = new RealmDataDAL();
  }

  /**
   * 运行单个测试
   */
  private async runTest(testName: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.testResults.push({ name: testName, passed: true, duration });
      console.log(`✅ ${testName} - 通过 (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.testResults.push({ name: testName, passed: false, error: errorMessage, duration });
      console.log(`❌ ${testName} - 失败: ${errorMessage} (${duration}ms)`);
    }
  }

  /**
   * 测试境界数据创建功能
   */
  private async testCreateRealmData(): Promise<void> {
    // 准备测试数据
    const testRealmData = {
      realm_level: 50, // 使用一个合理的境界等级
      stage_division: '测试阶段',
      major_realm: '测试大境界',
      minor_realm: '测试小境界',
      stage: '测试期',
      cultivation_start_value: 0,
      base_cultivation_limit: 1000,
      base_cultivation_speed: 10,
      base_physical_strength: 100,
      base_spiritual_strength: 100,
      base_soul_strength: 100,
      base_spiritual_storage: 500,
      base_blood_storage: 500,
      base_mental_storage: 500,
      base_spiritual_recovery_rate: 5,
      base_blood_recovery_rate: 5,
      base_mental_recovery_rate: 5
    };

    console.log('准备创建境界数据:', testRealmData);

    // 执行创建操作
    const createdRealm = await this.realmDAL.create(testRealmData);
    
    console.log('创建结果:', createdRealm);

    // 验证创建结果
    if (!createdRealm) {
      throw new Error('创建境界数据失败，返回值为空');
    }

    if (createdRealm.realm_level !== testRealmData.realm_level) {
      throw new Error(`境界等级不匹配: 期望 ${testRealmData.realm_level}, 实际 ${createdRealm.realm_level}`);
    }

    if (createdRealm.major_realm !== testRealmData.major_realm) {
      throw new Error(`大境界不匹配: 期望 ${testRealmData.major_realm}, 实际 ${createdRealm.major_realm}`);
    }

    if (createdRealm.minor_realm !== testRealmData.minor_realm) {
      throw new Error(`小境界不匹配: 期望 ${testRealmData.minor_realm}, 实际 ${createdRealm.minor_realm}`);
    }

    console.log('✅ 境界数据创建验证通过');
  }

  /**
   * 测试境界数据查询功能
   */
  private async testQueryRealmData(): Promise<void> {
    // 查询刚创建的测试数据
    const realms = await this.realmDAL.findByMajorRealm('测试大境界');
    
    if (!Array.isArray(realms)) {
      throw new Error('查询结果应该是数组');
    }

    if (realms.length === 0) {
      throw new Error('未找到刚创建的测试境界数据');
    }

    const testRealm = realms.find(r => r.realm_level === 50);
    if (!testRealm) {
      throw new Error('未找到境界等级为50的测试数据');
    }

    console.log('✅ 境界数据查询验证通过');
  }

  /**
   * 清理测试数据
   */
  private async cleanupTestData(): Promise<void> {
    try {
      // 删除测试创建的数据
      const sql = 'DELETE FROM `realm_data` WHERE realm_level = 50';
      await dbManager.run(sql, []);
      console.log('✅ 测试数据清理完成');
    } catch (error) {
      console.log('⚠️ 测试数据清理失败:', error);
    }
  }

  /**
   * 打印测试结果
   */
  private printTestResults(): void {
    console.log('\n=== 境界DAL测试结果 ===');
    const passedTests = this.testResults.filter(r => r.passed).length;
    const totalTests = this.testResults.length;
    
    console.log(`总测试数: ${totalTests}`);
    console.log(`通过: ${passedTests}`);
    console.log(`失败: ${totalTests - passedTests}`);
    
    if (totalTests > 0) {
      const successRate = (passedTests / totalTests * 100).toFixed(1);
      console.log(`成功率: ${successRate}%`);
    }

    // 显示失败的测试详情
    const failedTests = this.testResults.filter(r => !r.passed);
    if (failedTests.length > 0) {
      console.log('\n失败测试详情:');
      failedTests.forEach(test => {
        console.log(`- ${test.name}: ${test.error}`);
      });
    }
  }

  /**
   * 运行所有测试
   */
  public async runAllTests(): Promise<void> {
    console.log('开始境界DAL测试...');
    
    try {
      // 初始化数据库连接
      await dbManager.connect();
      console.log('✅ 数据库连接成功');

      // 运行测试
      await this.runTest('境界数据创建测试', () => this.testCreateRealmData());
      await this.runTest('境界数据查询测试', () => this.testQueryRealmData());
      
      // 清理测试数据
      await this.cleanupTestData();

      // 输出测试结果
      this.printTestResults();

    } catch (error) {
      console.error('测试运行失败:', error);
    } finally {
      // 关闭数据库连接
      await dbManager.close();
      console.log('✅ 数据库连接已关闭');
    }
  }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  const test = new RealmDALTest();
  test.runAllTests().catch(console.error);
}

export { RealmDALTest };