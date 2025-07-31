/**
 * 角色亲和度CRUD测试
 * 分别测试DAL层、控制器层和API层的功能
 */

import { Request, Response } from 'express';
import { DatabaseController } from '../controllers/DatabaseController.js';
import { CharacterAffinitiesDAL, CharacterBaseInfoDAL } from '../dal/implementations/CharacterDALs.js';
import { CharacterAffinities, CharacterBaseInfo } from '../database/interfaces/types.js';
import { dbManager } from '../database/config/database.js';

/**
 * 模拟请求对象
 */
class MockRequest {
  public params: any = {};
  public body: any = {};
  public query: any = {};

  constructor(params?: any, body?: any, query?: any) {
    this.params = params || {};
    this.body = body || {};
    this.query = query || {};
  }
}

/**
 * 模拟响应对象
 */
class MockResponse {
  private statusCode: number = 200;
  private responseData: any = null;
  private headers: any = {};

  status(code: number): MockResponse {
    this.statusCode = code;
    return this;
  }

  json(data: any): MockResponse {
    this.responseData = data;
    return this;
  }

  setHeader(name: string, value: string): MockResponse {
    this.headers[name] = value;
    return this;
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  getResponseData(): any {
    return this.responseData;
  }

  getHeaders(): any {
    return this.headers;
  }
}

/**
 * 角色亲和度CRUD测试类
 */
class CharacterAffinitiesTest {
  private dalInstance: CharacterAffinitiesDAL;
  private characterDAL: CharacterBaseInfoDAL;
  private controllerInstance: DatabaseController;
  private testResults: Array<{name: string, passed: boolean, message: string, duration: number}> = [];
  private testCharacterUuid: string = 'test' + Math.random().toString(36).substr(2, 6); // 生成10位以内的测试UUID

  constructor() {
    this.dalInstance = new CharacterAffinitiesDAL();
    this.characterDAL = new CharacterBaseInfoDAL();
    this.controllerInstance = new DatabaseController();
  }

  /**
   * 运行所有测试
   */
  public async runAllTests(): Promise<void> {
    console.log('\n=== 角色亲和度CRUD测试开始 ===\n');
    const startTime = Date.now();

    try {
      // 测试数据库连接
      await this.testDatabaseConnection();
      
      // 创建测试角色
      await this.createTestCharacter();
      
      // 测试DAL层
      await this.testDALLayer();
      
      // 测试控制器层
      await this.testControllerLayer();
      
      // 测试API层
      await this.testAPILayer();
      
      // 清理测试数据
      await this.cleanupTestData();
      
      // 删除测试角色
      await this.deleteTestCharacter();
      
    } catch (error) {
      console.error('测试过程中发生错误:', error);
    } finally {
      const totalDuration = Date.now() - startTime;
      this.printTestResults(totalDuration);
    }
  }

  /**
   * 测试数据库连接
   */
  private async testDatabaseConnection(): Promise<void> {
    await this.runTest('数据库连接测试', async () => {
      try {
        await dbManager.get('SELECT 1 as test');
        return '数据库连接正常';
      } catch (error) {
        throw new Error(`数据库连接失败: ${error}`);
      }
    });
  }

  /**
   * 测试DAL层CRUD操作
   */
  private async testDALLayer(): Promise<void> {
    console.log('\n--- DAL层测试 ---');
    
    // 测试创建亲和度数据
    await this.runTest('DAL - 创建亲和度数据', async () => {
      const testData: Omit<CharacterAffinities, 'character_uuid'> = {
        total_affinity: 100,
        metal_affinity: 20,
        wood_affinity: 20,
        water_affinity: 20,
        fire_affinity: 20,
        earth_affinity: 20
      };
      
      const result = await this.dalInstance.create({
        character_uuid: this.testCharacterUuid,
        ...testData
      });
      
      if (!result || result.character_uuid !== this.testCharacterUuid) {
        throw new Error('创建亲和度数据失败');
      }
      
      return `创建成功，角色UUID: ${result.character_uuid}`;
    });

    // 测试查询亲和度数据
    await this.runTest('DAL - 查询亲和度数据', async () => {
      const result = await this.dalInstance.findByCharacterId(this.testCharacterUuid);
      
      if (!result || result.character_uuid !== this.testCharacterUuid) {
        throw new Error('查询亲和度数据失败');
      }
      
      return `查询成功，总亲和度: ${result.total_affinity}`;
    });

    // 测试更新亲和度数据
    await this.runTest('DAL - 更新亲和度数据', async () => {
      const updateData = {
        total_affinity: 150,
        metal_affinity: 30
      };
      
      const result = await this.dalInstance.update(this.testCharacterUuid, updateData);
      
      if (!result || result.total_affinity !== 150) {
        throw new Error('更新亲和度数据失败');
      }
      
      return `更新成功，新总亲和度: ${result.total_affinity}`;
    });

    // 测试按亲和度范围查询
    await this.runTest('DAL - 按亲和度范围查询', async () => {
      const results = await this.dalInstance.findByAffinityRange(100, 200);
      
      if (!Array.isArray(results)) {
        throw new Error('按亲和度范围查询应返回数组');
      }
      
      const foundTestData = results.find(item => item.character_uuid === this.testCharacterUuid);
      if (!foundTestData) {
        throw new Error('未找到测试数据');
      }
      
      return `范围查询成功，找到 ${results.length} 条记录`;
    });
  }

  /**
   * 测试控制器层
   */
  private async testControllerLayer(): Promise<void> {
    console.log('\n--- 控制器层测试 ---');
    
    // 测试获取亲和度数据
    await this.runTest('控制器 - 获取亲和度数据', async () => {
      const req = new MockRequest({ characterId: this.testCharacterUuid });
      const res = new MockResponse();
      
      await this.controllerInstance.getCharacterAffinities(req as Request, res as unknown as Response);
      
      const responseData = res.getResponseData();
      if (!responseData || responseData.status !== 'success') {
        throw new Error('控制器获取亲和度数据失败');
      }
      
      return `控制器获取成功，总亲和度: ${responseData.data.total_affinity}`;
    });

    // 测试创建/更新亲和度数据
    await this.runTest('控制器 - 更新亲和度数据', async () => {
      const updateData = {
        character_uuid: this.testCharacterUuid,
        total_affinity: 200,
        metal_affinity: 40,
        wood_affinity: 40,
        water_affinity: 40,
        fire_affinity: 40,
        earth_affinity: 40
      };
      
      const req = new MockRequest({}, updateData);
      const res = new MockResponse();
      
      await this.controllerInstance.createOrUpdateCharacterAffinities(req as Request, res as unknown as Response);
      
      const responseData = res.getResponseData();
      if (!responseData || responseData.status !== 'success') {
        throw new Error('控制器更新亲和度数据失败');
      }
      
      return `控制器更新成功，新总亲和度: ${responseData.data.total_affinity}`;
    });

    // 测试参数验证
    await this.runTest('控制器 - 参数验证测试', async () => {
      const req = new MockRequest({}, {}); // 空数据
      const res = new MockResponse();
      
      await this.controllerInstance.createOrUpdateCharacterAffinities(req as Request, res as unknown as Response);
      
      const responseData = res.getResponseData();
      if (!responseData || responseData.status !== 'error') {
        throw new Error('参数验证应该失败');
      }
      
      return `参数验证正常，错误信息: ${responseData.error}`;
    });
  }

  /**
   * 测试API层（通过HTTP请求）
   */
  private async testAPILayer(): Promise<void> {
    console.log('\n--- API层测试 ---');
    
    // 测试GET请求
    await this.runTest('API - GET 亲和度数据', async () => {
      try {
        const response = await fetch(`http://localhost:3015/api/database/character-affinities/${this.testCharacterUuid}`);
        const data: any = await response.json();
        
        if (!response.ok || data.status !== 'success') {
          throw new Error(`API GET请求失败: ${data.error || response.statusText}`);
        }
        
        return `API GET成功，总亲和度: ${data.data.total_affinity}`;
      } catch (error) {
        if (error instanceof Error && error.message.includes('fetch')) {
          return 'API测试跳过（服务器未运行）';
        }
        throw error;
      }
    });

    // 测试POST请求
    await this.runTest('API - POST 更新亲和度数据', async () => {
      try {
        const updateData = {
          character_uuid: this.testCharacterUuid,
          total_affinity: 250,
          metal_affinity: 50,
          wood_affinity: 50,
          water_affinity: 50,
          fire_affinity: 50,
          earth_affinity: 50
        };
        
        const response = await fetch('http://localhost:3015/api/database/character-affinities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });
        
        const data: any = await response.json();
        
        if (!response.ok || data.status !== 'success') {
          throw new Error(`API POST请求失败: ${data.error || response.statusText}`);
        }
        
        return `API POST成功，新总亲和度: ${data.data.total_affinity}`;
      } catch (error) {
        if (error instanceof Error && error.message.includes('fetch')) {
          return 'API测试跳过（服务器未运行）';
        }
        throw error;
      }
    });
  }

  /**
   * 创建测试角色
   */
  private async createTestCharacter(): Promise<void> {
    await this.runTest('创建测试角色', async () => {
      const testCharacterData = {
         character_name: '测试角色',
         character_gender: '其他' as const,
         character_realm_Level: 1,
         cultivatingState: '未修练' as const,
         cultivationLimitBase: 1000,
         cultivationLimitAdd: 0,
         cultivationValue: 0,
         cultivationOverLimit: false,
         cultivationSpeedBase: 10,
         cultivationSpeedAdd: 0,
         breakThroughEnabled: false,
         breakThroughItemsEnabled: false,
         breakThroughState: false,
         breakThroughFailNumb: 0,
         zongMenJoinBool: false
       };
       
       const createdCharacter = await this.characterDAL.create(testCharacterData);
       this.testCharacterUuid = createdCharacter.character_uuid;
      return '测试角色创建成功';
    });
  }

  /**
   * 删除测试角色
   */
  private async deleteTestCharacter(): Promise<void> {
    await this.runTest('删除测试角色', async () => {
      try {
        await this.characterDAL.delete(this.testCharacterUuid);
        return '测试角色删除成功';
      } catch (error) {
        return '测试角色删除完成（可能不存在）';
      }
    });
  }

  /**
   * 清理测试数据
   */
  private async cleanupTestData(): Promise<void> {
    await this.runTest('清理测试数据', async () => {
      const result = await this.dalInstance.deleteByCharacterId(this.testCharacterUuid);
      return result ? '测试数据清理成功' : '测试数据清理完成（无数据需要清理）';
    });
  }

  /**
   * 运行单个测试
   */
  private async runTest(testName: string, testFunction: () => Promise<string>): Promise<void> {
    const startTime = Date.now();
    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;
      this.testResults.push({
        name: testName,
        passed: true,
        message: result,
        duration
      });
      console.log(`✅ ${testName}: ${result} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.testResults.push({
        name: testName,
        passed: false,
        message: errorMessage,
        duration
      });
      console.log(`❌ ${testName}: ${errorMessage} (${duration}ms)`);
    }
  }

  /**
   * 打印测试结果
   */
  private printTestResults(totalDuration: number): void {
    const passedTests = this.testResults.filter(test => test.passed);
    const failedTests = this.testResults.filter(test => !test.passed);
    
    console.log('\n=== 测试结果汇总 ===');
    console.log(`总测试数: ${this.testResults.length}`);
    console.log(`通过: ${passedTests.length}`);
    console.log(`失败: ${failedTests.length}`);
    console.log(`总耗时: ${totalDuration}ms`);
    
    if (failedTests.length > 0) {
      console.log('\n失败的测试:');
      failedTests.forEach(test => {
        console.log(`  ❌ ${test.name}: ${test.message}`);
      });
    }
    
    console.log('\n=== 角色亲和度CRUD测试完成 ===\n');
  }
}

/**
 * 运行亲和度CRUD测试
 */
export async function runCharacterAffinitiesTest(): Promise<void> {
  const test = new CharacterAffinitiesTest();
  await test.runAllTests();
}

// 如果直接运行此文件，则执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  runCharacterAffinitiesTest().catch(console.error);
}

export { CharacterAffinitiesTest };