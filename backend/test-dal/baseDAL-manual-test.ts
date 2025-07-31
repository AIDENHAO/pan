/**
 * BaseDAL 手动验证测试脚本
 * 测试基础数据访问层的核心功能
 */

import { dbManager } from '../database/config/database.js';
import { CharacterBaseInfoDAL, CharacterAffinitiesDAL, ItemDataDAL } from '../dal/implementations/CharacterDALs.js';
import { CharacterBaseInfo, CharacterAffinities, ItemData } from '../database/interfaces/types.js';

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
 * 测试工具类
 */
class BaseDALTester {
  private results: TestResult[] = [];
  private characterBaseInfoDAL: CharacterBaseInfoDAL;
  private characterAffinitiesDAL: CharacterAffinitiesDAL;
  private itemDataDAL: ItemDataDAL;
  private testCharacterId: string = 'test_char_001';

  constructor() {
    this.characterBaseInfoDAL = new CharacterBaseInfoDAL();
    this.characterAffinitiesDAL = new CharacterAffinitiesDAL();
    this.itemDataDAL = new ItemDataDAL();
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
   * 测试数据库连接
   */
  private async testDatabaseConnection(): Promise<void> {
    const pool = dbManager.getPool();
    if (!pool) {
      throw new Error('数据库连接池未初始化');
    }

    // 测试简单查询
    const result = await dbManager.get('SELECT 1 as test');
    if (!result || (result as any).test !== 1) {
      throw new Error('数据库查询测试失败');
    }
  }

  /**
   * 测试BaseDAL的findById方法
   */
  private async testFindById(): Promise<void> {
    // 测试查找存在的记录
    const items = await this.itemDataDAL.findAll({ limit: 1 });
    if (items.length === 0) {
      throw new Error('没有找到测试数据');
    }

    const itemId = items[0].item_id;
    const foundItem = await this.itemDataDAL.findById(itemId);
    
    if (!foundItem) {
      throw new Error('findById 应该返回存在的记录');
    }

    if (foundItem.item_id !== itemId) {
      throw new Error('返回的记录ID不匹配');
    }

    // 测试查找不存在的记录
    const notFoundItem = await this.itemDataDAL.findById('non_existent_id');
    if (notFoundItem !== null) {
      throw new Error('findById 对不存在的记录应该返回null');
    }
  }

  /**
   * 测试BaseDAL的findAll方法
   */
  private async testFindAll(): Promise<void> {
    // 测试无条件查询
    const allItems = await this.itemDataDAL.findAll();
    if (!Array.isArray(allItems)) {
      throw new Error('findAll 应该返回数组');
    }

    // 测试带限制的查询
    const limitedItems = await this.itemDataDAL.findAll({ limit: 3 });
    if (limitedItems.length > 3) {
      throw new Error('limit 参数未生效');
    }

    // 测试排序
    const sortedItems = await this.itemDataDAL.findAll({ 
      orderBy: 'item_name', 
      orderDirection: 'ASC',
      limit: 5
    });
    
    if (sortedItems.length > 1) {
      for (let i = 1; i < sortedItems.length; i++) {
        if (sortedItems[i].item_name < sortedItems[i-1].item_name) {
          throw new Error('排序功能未正确工作');
        }
      }
    }
  }

  /**
   * 测试BaseDAL的findWhere方法
   */
  private async testFindWhere(): Promise<void> {
    // 测试条件查询
    const weaponItems = await this.itemDataDAL.findWhere({ 
      item_type: '武器' as ItemData['item_type']
    });
    
    for (const item of weaponItems) {
      if (item.item_type !== '武器') {
        throw new Error('findWhere 条件过滤未正确工作');
      }
    }

    // 测试多条件查询
    const qualityWeapons = await this.itemDataDAL.findWhere({
      item_type: '武器' as ItemData['item_type'],
      quality: '普通' as ItemData['quality']
    });

    for (const item of qualityWeapons) {
      if (item.item_type !== '武器' || item.quality !== '普通') {
        throw new Error('多条件查询未正确工作');
      }
    }
  }

  /**
   * 测试BaseDAL的findOneWhere方法
   */
  private async testFindOneWhere(): Promise<void> {
    const firstWeapon = await this.itemDataDAL.findOneWhere({
      item_type: '武器' as ItemData['item_type']
    });

    if (firstWeapon && firstWeapon.item_type !== '武器') {
      throw new Error('findOneWhere 返回的记录不符合条件');
    }

    // 测试不存在的条件
    const notFound = await this.itemDataDAL.findOneWhere({
      item_name: 'non_existent_item_name_12345'
    });

    if (notFound !== null) {
      throw new Error('findOneWhere 对不存在的条件应该返回null');
    }
  }

  /**
   * 测试BaseDAL的分页查询
   */
  private async testFindPaginated(): Promise<void> {
    const pageSize = 5;
    const page1 = await this.itemDataDAL.findPaginated(1, pageSize);
    
    if (!page1.data || !Array.isArray(page1.data)) {
      throw new Error('分页查询应该返回data数组');
    }

    if (page1.data.length > pageSize) {
      throw new Error('分页大小控制失效');
    }

    if (page1.page !== 1 || page1.pageSize !== pageSize) {
      throw new Error('分页信息不正确');
    }

    if (typeof page1.total !== 'number' || page1.total < 0) {
      throw new Error('总数信息不正确');
    }

    if (page1.totalPages !== Math.ceil(page1.total / pageSize)) {
      throw new Error('总页数计算错误');
    }

    // 测试第二页
    if (page1.total > pageSize) {
      const page2 = await this.itemDataDAL.findPaginated(2, pageSize);
      
      if (page2.page !== 2) {
        throw new Error('第二页页码不正确');
      }

      // 确保两页数据不重复
      const page1Ids = page1.data.map(item => item.item_id);
      const page2Ids = page2.data.map(item => item.item_id);
      const intersection = page1Ids.filter(id => page2Ids.includes(id));
      
      if (intersection.length > 0) {
        throw new Error('分页数据出现重复');
      }
    }
  }

  /**
   * 测试BaseDAL的count方法
   */
  private async testCount(): Promise<void> {
    // 测试总数统计
    const totalCount = await this.itemDataDAL.count();
    if (typeof totalCount !== 'number' || totalCount < 0) {
      throw new Error('count 应该返回非负数字');
    }

    // 测试条件统计
    const weaponCount = await this.itemDataDAL.count({
      item_type: '武器' as ItemData['item_type']
    });
    
    if (typeof weaponCount !== 'number' || weaponCount < 0) {
      throw new Error('条件count 应该返回非负数字');
    }

    if (weaponCount > totalCount) {
      throw new Error('条件count 不应该大于总count');
    }

    // 验证count与实际查询结果一致
    const actualWeapons = await this.itemDataDAL.findWhere({
      item_type: '武器' as ItemData['item_type']
    });
    
    if (weaponCount !== actualWeapons.length) {
      throw new Error('count结果与实际查询数量不一致');
    }
  }

  /**
   * 测试BaseDAL的exists方法
   */
  private async testExists(): Promise<void> {
    // 测试存在的记录
    const items = await this.itemDataDAL.findAll({ limit: 1 });
    if (items.length > 0) {
      const exists = await this.itemDataDAL.exists({
        item_id: items[0].item_id
      });
      
      if (!exists) {
        throw new Error('exists 应该对存在的记录返回true');
      }
    }

    // 测试不存在的记录
    const notExists = await this.itemDataDAL.exists({
      item_id: 'definitely_not_exists_12345'
    });
    
    if (notExists) {
      throw new Error('exists 应该对不存在的记录返回false');
    }
  }

  /**
   * 测试CharacterDAL的特殊方法
   */
  private async testCharacterDALMethods(): Promise<void> {
    // 查找测试角色
    const characters = await this.characterBaseInfoDAL.findAll({ limit: 1 });
    if (characters.length === 0) {
      throw new Error('没有找到测试角色数据');
    }

    const characterId = characters[0].character_uuid;

    // 测试findByCharacterId
    const affinities = await this.characterAffinitiesDAL.findByCharacterId(characterId);
    if (affinities && affinities.character_uuid !== characterId) {
      throw new Error('findByCharacterId 返回的数据character_uuid不匹配');
    }
  }

  /**
   * 测试SQL注入防护
   */
  private async testSQLInjectionProtection(): Promise<void> {
    // 尝试SQL注入攻击
    const maliciousInput = "'; DROP TABLE item_data; --";
    
    try {
      const result = await this.itemDataDAL.findById(maliciousInput);
      // 应该返回null而不是抛出错误或执行恶意SQL
      if (result !== null) {
        throw new Error('SQL注入防护可能存在问题');
      }
    } catch (error) {
      // 如果是数据库错误，可能存在SQL注入风险
      if (error instanceof Error && error.message.includes('DROP')) {
        throw new Error('SQL注入防护失效');
      }
      // 其他错误可以接受
    }

    // 测试条件查询的SQL注入防护
    try {
      const result = await this.itemDataDAL.findWhere({
        item_name: maliciousInput
      });
      // 应该返回空数组
      if (!Array.isArray(result)) {
        throw new Error('条件查询SQL注入防护可能存在问题');
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('DROP')) {
        throw new Error('条件查询SQL注入防护失效');
      }
    }
  }

  /**
   * 运行所有测试
   */
  async runAllTests(): Promise<void> {
    console.log('🚀 开始BaseDAL手动验证测试\n');

    // 初始化数据库连接
    try {
      await dbManager.connect();
      console.log('✅ 数据库连接成功\n');
    } catch (error) {
      console.error('❌ 数据库连接失败:', error);
      return;
    }

    // 执行所有测试
    await this.runTest('数据库连接测试', () => this.testDatabaseConnection());
    await this.runTest('findById方法测试', () => this.testFindById());
    await this.runTest('findAll方法测试', () => this.testFindAll());
    await this.runTest('findWhere方法测试', () => this.testFindWhere());
    await this.runTest('findOneWhere方法测试', () => this.testFindOneWhere());
    await this.runTest('分页查询测试', () => this.testFindPaginated());
    await this.runTest('count方法测试', () => this.testCount());
    await this.runTest('exists方法测试', () => this.testExists());
    await this.runTest('CharacterDAL特殊方法测试', () => this.testCharacterDALMethods());
    await this.runTest('SQL注入防护测试', () => this.testSQLInjectionProtection());

    // 输出测试结果
    this.printTestResults();

    // 关闭数据库连接
    await dbManager.close();
  }

  /**
   * 打印测试结果
   */
  private printTestResults(): void {
    console.log('\n📊 测试结果汇总:');
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
      console.log('🎉 所有测试通过！BaseDAL功能正常。');
    } else {
      console.log('⚠️  存在测试失败，请检查BaseDAL实现。');
    }
  }
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  const tester = new BaseDALTester();
  await tester.runAllTests();
}

// 如果直接运行此文件，执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('测试执行失败:', error);
    process.exit(1);
  });
}

export { BaseDALTester };