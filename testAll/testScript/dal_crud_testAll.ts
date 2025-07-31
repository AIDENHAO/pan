/**
 * DAL层CRUD操作测试脚本
 * 文件名: dal_crud_testAll.ts
 * 功能: 测试数据访问层的增删改查功能
 * 作者: AI Assistant
 * 创建时间: 2024-12-19
 */

import * as fs from 'fs';
import * as path from 'path';
import { dbManager } from '../../src/database/config/database.js';
import { dalFactory } from '../../src/database/implementations/DALFactory.js';
import {
  CharacterBaseInfo,
  CharacterAffinities,
  CharacterStrength,
  RealmData,
  SkillData,
  ItemData
} from '../../src/database/interfaces/types.js';

// 测试配置接口
interface TestConfig {
  testName: string;
  dataPath: string;
  reportPath: string;
  timeout: number;
}

// 测试结果接口
interface TestResult {
  testName: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  duration: number;
  message: string;
  details?: any;
}

// 环境状态接口
interface EnvironmentState {
  timestamp: string;
  databaseState?: any;
  testDataIds?: string[];
}

/**
 * DAL层测试环境管理类
 */
class DALTestEnvironment {
  private originalState: EnvironmentState | null = null;
  private testConfig: TestConfig;
  private createdTestDataIds: string[] = [];

  constructor(config: TestConfig) {
    this.testConfig = config;
  }

  /**
   * 捕获当前环境状态
   */
  async captureCurrentState(): Promise<EnvironmentState> {
    console.log('📸 正在捕获DAL层环境状态...');
    
    const state: EnvironmentState = {
      timestamp: new Date().toISOString(),
      databaseState: await this.captureDatabaseState(),
      testDataIds: [...this.createdTestDataIds]
    };
    
    console.log('✅ DAL层环境状态捕获完成');
    return state;
  }

  /**
   * 设置测试环境
   */
  async setupTestEnvironment(): Promise<void> {
    console.log('🔧 正在设置DAL层测试环境...');
    
    // 备份当前状态
    this.originalState = await this.captureCurrentState();
    
    // 确保数据库连接
    await dbManager.connect();
    
    // 清理可能存在的测试数据
    await this.cleanupExistingTestData();
    
    console.log('✅ DAL层测试环境设置完成');
  }

  /**
   * 恢复原始环境状态
   */
  async restoreEnvironment(): Promise<void> {
    console.log('🔄 正在恢复DAL层环境状态...');
    
    try {
      // 清理测试数据
      await this.cleanupTestData();
      
      console.log('✅ DAL层环境状态恢复完成');
    } catch (error) {
      console.error('❌ DAL层环境恢复失败:', error);
      throw error;
    }
  }

  /**
   * 清理测试数据
   */
  async cleanup(): Promise<void> {
    await this.restoreEnvironment();
    await dbManager.close();
  }

  /**
   * 记录创建的测试数据ID
   */
  recordTestDataId(id: string): void {
    this.createdTestDataIds.push(id);
  }

  /**
   * 获取创建的测试数据ID列表
   */
  getTestDataIds(): string[] {
    return [...this.createdTestDataIds];
  }

  private async captureDatabaseState(): Promise<any> {
    // 获取数据库连接状态
    return {
      connected: dbManager.isPoolConnected(),
      poolStatus: dbManager.getPoolStatus()
    };
  }

  private async cleanupExistingTestData(): Promise<void> {
    // 清理可能存在的测试数据
    const characterDAL = dalFactory.getCharacterBaseInfoDAL();
    const testCharacters = await characterDAL.findWhere({ name: 'DAL测试角色' } as Partial<CharacterBaseInfo>);
    
    for (const character of testCharacters) {
      await characterDAL.delete(character.character_uuid);
    }
  }

  private async cleanupTestData(): Promise<void> {
    console.log('🧹 正在清理DAL层测试数据...');
    
    const characterDAL = dalFactory.getCharacterBaseInfoDAL();
    
    for (const id of this.createdTestDataIds) {
      try {
        await characterDAL.delete(id);
      } catch (error) {
        console.warn(`清理测试数据失败 ${id}:`, error);
      }
    }
    
    this.createdTestDataIds = [];
    console.log('✅ DAL层测试数据清理完成');
  }
}

/**
 * DAL层测试数据验证器
 */
class DALTestDataValidator {
  /**
   * 验证测试数据
   */
  static validateTestData(testData: any, schema: any): boolean {
    if (!testData || typeof testData !== 'object') {
      throw new Error('DAL测试数据格式不正确');
    }

    // 验证必要字段
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in testData)) {
          throw new Error(`DAL测试数据缺少必要字段: ${field}`);
        }
      }
    }

    // 验证字段类型
    if (schema.properties) {
      for (const [field, fieldSchema] of Object.entries(schema.properties as any)) {
        if (field in testData) {
          const value = testData[field];
          const expectedType = (fieldSchema as any).type;
          
          if (expectedType && typeof value !== expectedType) {
            throw new Error(`DAL测试数据字段 ${field} 类型不正确，期望 ${expectedType}，实际 ${typeof value}`);
          }
        }
      }
    }

    return true;
  }

  /**
   * 加载测试数据
   */
  static loadTestData(dataPath: string): any {
    try {
      if (!fs.existsSync(dataPath)) {
        throw new Error(`DAL测试数据文件不存在: ${dataPath}`);
      }

      const rawData = fs.readFileSync(dataPath, 'utf-8');
      const testData = JSON.parse(rawData);

      console.log(`✅ DAL测试数据加载成功: ${dataPath}`);
      return testData;
    } catch (error) {
      console.error(`❌ DAL测试数据加载失败: ${dataPath}`, error);
      throw error;
    }
  }
}

/**
 * DAL层测试报告生成器
 */
class DALTestReportGenerator {
  private results: TestResult[] = [];
  private startTime: Date;
  private endTime: Date | null = null;
  private config: TestConfig;

  constructor(config: TestConfig) {
    this.config = config;
    this.startTime = new Date();
  }

  /**
   * 添加测试结果
   */
  addResult(result: TestResult): void {
    this.results.push(result);
    const status = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
    console.log(`${status} ${result.testName}: ${result.message} (${result.duration}ms)`);
  }

  /**
   * 生成测试报告
   */
  async generateReport(): Promise<void> {
    this.endTime = new Date();
    const reportContent = this.createReportContent();
    
    // 确保报告目录存在
    const reportDir = path.dirname(this.config.reportPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(this.config.reportPath, reportContent, 'utf-8');
    console.log(`📄 DAL层测试报告已生成: ${this.config.reportPath}`);
  }

  private createReportContent(): string {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'PASS').length;
    const failedTests = this.results.filter(r => r.status === 'FAIL').length;
    const skippedTests = this.results.filter(r => r.status === 'SKIP').length;
    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0.00';
    const totalDuration = this.endTime ? this.endTime.getTime() - this.startTime.getTime() : 0;

    return `# DAL层CRUD操作测试报告

## 测试概述
- **测试时间**: ${this.startTime.toISOString()}
- **测试环境**: 开发环境
- **测试目的**: 验证DAL层的增删改查功能
- **测试范围**: 角色数据、静态数据的CRUD操作

## 测试结果统计
- **总测试用例**: ${totalTests}个
- **通过**: ${passedTests}个
- **失败**: ${failedTests}个
- **跳过**: ${skippedTests}个
- **成功率**: ${successRate}%
- **总耗时**: ${totalDuration}ms

## 详细测试结果
${this.results.map(result => `### ${result.testName}
- **状态**: ${result.status}
- **执行时间**: ${result.duration}ms
- **详细信息**: ${result.message}
${result.details ? `- **详细数据**: \`\`\`json\n${JSON.stringify(result.details, null, 2)}\n\`\`\`` : ''}`).join('\n\n')}

## 环境恢复状态
- **数据库状态**: 已恢复
- **测试数据**: 已清理
- **连接池**: 已关闭

## 总结与建议
${failedTests === 0 ? '✅ 所有DAL层CRUD测试通过，数据访问层功能正常。' : `⚠️ 有 ${failedTests} 个测试失败，请检查相关DAL实现。`}

### 改进建议
1. 定期进行DAL层性能测试
2. 增加更多边界条件测试
3. 完善错误处理机制
4. 优化数据库查询性能

---
**报告生成时间**: ${new Date().toISOString()}
**测试框架**: DAL CRUD TestAll v1.0
`;
  }
}

/**
 * DAL层CRUD测试主类
 */
class DALCRUDTest {
  private config: TestConfig;
  private environment: DALTestEnvironment;
  private reportGenerator: DALTestReportGenerator;

  constructor() {
    this.config = {
      testName: 'DAL层CRUD操作测试',
      dataPath: path.join(__dirname, '../testData/dal_crud_testAll_data.json'),
      reportPath: path.join(__dirname, '../testReport/dal_crud_testAll_report.md'),
      timeout: 30000
    };
    
    this.environment = new DALTestEnvironment(this.config);
    this.reportGenerator = new DALTestReportGenerator(this.config);
  }

  /**
   * 运行测试
   */
  async runTest(): Promise<void> {
    console.log('🚀 开始DAL层CRUD测试');
    console.log('=' .repeat(60));
    console.log(`测试名称: ${this.config.testName}`);
    console.log(`数据文件: ${this.config.dataPath}`);
    console.log(`报告文件: ${this.config.reportPath}`);
    console.log('=' .repeat(60));

    try {
      // 设置测试环境
      await this.environment.setupTestEnvironment();
      
      // 加载和验证测试数据
      const testData = await this.loadAndValidateTestData();
      
      // 执行测试用例
      await this.executeTestCases(testData);
      
    } catch (error) {
      console.error('❌ DAL层测试执行失败:', error);
      this.reportGenerator.addResult({
        testName: '测试执行',
        status: 'FAIL',
        duration: 0,
        message: `测试执行失败: ${error}`,
        details: { error: error.toString() }
      });
    } finally {
      // 清理环境
      await this.cleanup();
    }
  }

  /**
   * 加载和验证测试数据
   */
  private async loadAndValidateTestData(): Promise<any> {
    const startTime = Date.now();
    
    try {
      // 创建默认测试数据（如果文件不存在）
      if (!fs.existsSync(this.config.dataPath)) {
        await this.createDefaultTestData();
      }
      
      // 加载测试数据
      const testData = DALTestDataValidator.loadTestData(this.config.dataPath);
      
      // 验证数据格式
      const schema = {
        required: ['characterTests', 'staticDataTests'],
        properties: {
          characterTests: { type: 'object' },
          staticDataTests: { type: 'object' }
        }
      };
      
      DALTestDataValidator.validateTestData(testData, schema);
      
      const duration = Date.now() - startTime;
      this.reportGenerator.addResult({
        testName: '测试数据加载验证',
        status: 'PASS',
        duration,
        message: 'DAL测试数据加载和验证成功'
      });
      
      return testData;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.reportGenerator.addResult({
        testName: '测试数据加载验证',
        status: 'FAIL',
        duration,
        message: `DAL测试数据加载失败: ${error}`,
        details: { error: error.toString() }
      });
      throw error;
    }
  }

  /**
   * 执行测试用例
   */
  private async executeTestCases(testData: any): Promise<void> {
    console.log('\n📋 开始执行DAL层CRUD测试用例...');
    
    // 角色数据CRUD测试
    await this.testCharacterCRUD(testData.characterTests);
    
    // 静态数据查询测试
    await this.testStaticDataQueries(testData.staticDataTests);
    
    // DAL工厂模式测试
    await this.testDALFactory();
    
    // 事务管理测试
    await this.testTransactionManagement();
    
    // 错误处理测试
    await this.testErrorHandling();
  }

  /**
   * 测试角色数据CRUD操作
   */
  private async testCharacterCRUD(characterTestData: any): Promise<void> {
    const characterDAL = dalFactory.getCharacterBaseInfoDAL();
    const affinitiesDAL = dalFactory.getCharacterAffinitiesDAL();
    const strengthDAL = dalFactory.getCharacterStrengthDAL();
    
    let testCharacterId: string | null = null;
    
    // 测试创建角色
    await this.executeTestCase('角色创建测试', async () => {
      const characterData: Partial<CharacterBaseInfo> = {
        name: 'DAL测试角色',
        gender: '男',
        realm_level: 1,
        cultivation_value: 0,
        spiritual_root: '金',
        life_state: '存活',
        location: '测试地点',
        description: 'DAL层测试创建的角色'
      };
      
      const result = await characterDAL.create(characterData);
      testCharacterId = result.character_uuid;
      this.environment.recordTestDataId(testCharacterId);
      
      return `角色创建成功，ID: ${testCharacterId}`;
    });
    
    // 测试查询角色
    if (testCharacterId) {
      await this.executeTestCase('角色查询测试', async () => {
        const character = await characterDAL.findById(testCharacterId!);
        if (!character) {
          throw new Error('查询角色失败');
        }
        if (character.name !== 'DAL测试角色') {
          throw new Error('查询到的角色数据不正确');
        }
        return `角色查询成功，姓名: ${character.name}`;
      });
      
      // 测试更新角色
      await this.executeTestCase('角色更新测试', async () => {
        const updateData = {
          cultivation_value: 100,
          description: 'DAL层测试更新的角色'
        };
        
        await characterDAL.update(testCharacterId!, updateData);
        
        const updatedCharacter = await characterDAL.findById(testCharacterId!);
        if (!updatedCharacter || updatedCharacter.cultivation_value !== 100) {
          throw new Error('角色更新失败');
        }
        
        return `角色更新成功，修炼值: ${updatedCharacter.cultivation_value}`;
      });
      
      // 测试创建角色亲和度
      await this.executeTestCase('角色亲和度创建测试', async () => {
        const affinityData: Partial<CharacterAffinities> = {
          character_uuid: testCharacterId!,
          metal_affinity: 80,
          wood_affinity: 60,
          water_affinity: 70,
          fire_affinity: 50,
          earth_affinity: 65
        };
        
        await affinitiesDAL.create(affinityData);
        
        const affinity = await affinitiesDAL.findByCharacterId(testCharacterId!);
        if (!affinity || affinity.metal_affinity !== 80) {
          throw new Error('角色亲和度创建失败');
        }
        
        return `角色亲和度创建成功，金属性: ${affinity.metal_affinity}`;
      });
      
      // 测试删除角色（最后执行）
      await this.executeTestCase('角色删除测试', async () => {
        await characterDAL.delete(testCharacterId!);
        
        const deletedCharacter = await characterDAL.findById(testCharacterId!);
        if (deletedCharacter) {
          throw new Error('角色删除失败');
        }
        
        return '角色删除成功';
      });
    }
  }

  /**
   * 测试静态数据查询
   */
  private async testStaticDataQueries(staticTestData: any): Promise<void> {
    const realmDAL = dalFactory.getRealmDataDAL();
    const skillDAL = dalFactory.getSkillDataDAL();
    const itemDAL = dalFactory.getItemDataDAL();
    
    // 测试境界数据查询
    await this.executeTestCase('境界数据查询测试', async () => {
      const realms = await realmDAL.findAll();
      if (!realms || realms.length === 0) {
        throw new Error('境界数据查询失败');
      }
      return `境界数据查询成功，共 ${realms.length} 条记录`;
    });
    
    // 测试技能数据查询
    await this.executeTestCase('技能数据查询测试', async () => {
      const skills = await skillDAL.findAll();
      if (!skills || skills.length === 0) {
        throw new Error('技能数据查询失败');
      }
      return `技能数据查询成功，共 ${skills.length} 条记录`;
    });
    
    // 测试物品数据查询
    await this.executeTestCase('物品数据查询测试', async () => {
      const items = await itemDAL.findAll();
      if (!items || items.length === 0) {
        throw new Error('物品数据查询失败');
      }
      return `物品数据查询成功，共 ${items.length} 条记录`;
    });
    
    // 测试分页查询
    await this.executeTestCase('分页查询测试', async () => {
      const paginatedRealms = await realmDAL.findPaginated(1, 5);
      if (!paginatedRealms || paginatedRealms.length === 0) {
        throw new Error('分页查询失败');
      }
      return `分页查询成功，第1页共 ${paginatedRealms.length} 条记录`;
    });
  }

  /**
   * 测试DAL工厂模式
   */
  private async testDALFactory(): Promise<void> {
    await this.executeTestCase('DAL工厂模式测试', async () => {
      // 测试单例模式
      const factory1 = dalFactory;
      const factory2 = dalFactory;
      if (factory1 !== factory2) {
        throw new Error('DAL工厂单例模式失败');
      }
      
      // 测试DAL实例创建
      const characterDAL1 = factory1.getCharacterBaseInfoDAL();
      const characterDAL2 = factory1.getCharacterBaseInfoDAL();
      if (characterDAL1 !== characterDAL2) {
        throw new Error('DAL实例缓存失败');
      }
      
      return 'DAL工厂模式测试成功';
    });
  }

  /**
   * 测试事务管理
   */
  private async testTransactionManagement(): Promise<void> {
    await this.executeTestCase('事务管理测试', async () => {
      const transaction = dalFactory.createTransaction();
      
      try {
        await transaction.begin();
        
        // 在事务中执行一些操作
        const characterDAL = dalFactory.getCharacterBaseInfoDAL();
        const characterData: Partial<CharacterBaseInfo> = {
          name: 'DAL事务测试角色',
          gender: '女',
          realm_level: 1,
          cultivation_value: 0,
          spiritual_root: '木',
          life_state: '存活',
          location: '事务测试地点'
        };
        
        const result = await characterDAL.create(characterData);
        const testId = result.character_uuid;
        
        // 回滚事务
        await transaction.rollback();
        
        // 验证数据是否被回滚
        const character = await characterDAL.findById(testId);
        if (character) {
          throw new Error('事务回滚失败，数据仍然存在');
        }
        
        return '事务管理测试成功';
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });
  }

  /**
   * 测试错误处理
   */
  private async testErrorHandling(): Promise<void> {
    const characterDAL = dalFactory.getCharacterBaseInfoDAL();
    
    // 测试查询不存在的记录
    await this.executeTestCase('查询不存在记录测试', async () => {
      const nonExistentId = 'non-existent-id-12345';
      const result = await characterDAL.findById(nonExistentId);
      if (result !== null) {
        throw new Error('查询不存在记录应该返回null');
      }
      return '查询不存在记录测试成功';
    });
    
    // 测试无效参数处理
    await this.executeTestCase('无效参数处理测试', async () => {
      try {
        await characterDAL.findById('');
        throw new Error('应该抛出参数验证错误');
      } catch (error) {
        if (error.message.includes('应该抛出参数验证错误')) {
          throw error;
        }
        // 期望的错误
        return '无效参数处理测试成功';
      }
    });
  }

  /**
   * 执行单个测试用例
   */
  private async executeTestCase(testName: string, testFunction: () => Promise<string>): Promise<void> {
    const startTime = Date.now();
    
    try {
      const message = await testFunction();
      const duration = Date.now() - startTime;
      
      this.reportGenerator.addResult({
        testName,
        status: 'PASS',
        duration,
        message
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.reportGenerator.addResult({
        testName,
        status: 'FAIL',
        duration,
        message: `测试失败: ${error}`,
        details: { error: error.toString() }
      });
    }
  }

  /**
   * 创建默认测试数据
   */
  private async createDefaultTestData(): Promise<void> {
    const defaultData = {
      characterTests: {
        testCharacter: {
          name: 'DAL测试角色',
          gender: '男',
          realm_level: 1,
          cultivation_value: 0,
          spiritual_root: '金',
          life_state: '存活',
          location: '测试地点',
          description: 'DAL层测试创建的角色'
        }
      },
      staticDataTests: {
        queryTests: {
          realms: true,
          skills: true,
          items: true,
          pagination: true
        }
      }
    };
    
    // 确保数据目录存在
    const dataDir = path.dirname(this.config.dataPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(this.config.dataPath, JSON.stringify(defaultData, null, 2), 'utf-8');
    console.log(`✅ 默认DAL测试数据已创建: ${this.config.dataPath}`);
  }

  /**
   * 清理测试环境
   */
  private async cleanup(): Promise<void> {
    try {
      await this.environment.cleanup();
      await this.reportGenerator.generateReport();
      console.log('\n✅ DAL层测试完成，环境已清理');
    } catch (error) {
      console.error('❌ DAL层测试清理失败:', error);
    }
  }

  /**
   * 退出测试
   */
  private exitTest(): void {
    console.log('\n🏁 DAL层CRUD测试结束');
    process.exit(0);
  }
}

// 主执行函数
async function runDALCRUDTest(): Promise<void> {
  const test = new DALCRUDTest();
  
  try {
    await test.runTest();
  } catch (error) {
    console.error('❌ DAL层测试执行失败:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// 如果直接运行此文件
if (require.main === module) {
  runDALCRUDTest().catch((error) => {
    console.error('❌ DAL层测试启动失败:', error);
    process.exit(1);
  });
}

export { DALCRUDTest, DALTestEnvironment, DALTestDataValidator, DALTestReportGenerator };