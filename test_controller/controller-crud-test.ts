/**
 * 控制器层CRUD操作测试脚本
 * 测试DatabaseController的各种CRUD操作
 * 
 * @author AI Assistant
 * @date 2024-01
 * @description 全面测试控制器层的增删改查功能
 */

import { Request, Response } from 'express';
import { DatabaseController } from '../src/controllers/DatabaseController.js';
import { DatabaseService } from '../src/database/implementations/DatabaseService.js';

// 模拟Request和Response对象
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
 * 控制器CRUD测试类
 */
class ControllerCRUDTest {
  private controller: DatabaseController;
  private testResults: Array<{name: string, passed: boolean, message: string, duration: number}> = [];
  
  constructor() {
    this.controller = new DatabaseController();
  }
  
  /**
   * 运行所有测试
   */
  public async runAllTests(): Promise<void> {
    console.log('🚀 开始控制器层CRUD测试...');
    console.log('=' .repeat(60));
    
    const startTime = Date.now();
    
    // 数据库连接测试
    await this.testDatabaseConnection();
    
    // 角色管理CRUD测试
    await this.testCharacterCRUD();
    
    // 静态数据查询测试
    await this.testStaticDataQueries();
    
    // 错误处理测试
    await this.testErrorHandling();
    
    // 参数验证测试
    await this.testParameterValidation();
    
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    
    this.printTestResults(totalDuration);
  }
  
  /**
   * 测试数据库连接
   */
  private async testDatabaseConnection(): Promise<void> {
    await this.runTest('数据库连接测试', async () => {
      const req = new MockRequest();
      const res = new MockResponse();
      
      await this.controller.getDatabaseStats(req as Request, res as unknown as Response);
      
      if (res.getStatusCode() !== 200) {
        throw new Error(`期望状态码200，实际得到${res.getStatusCode()}`);
      }
      
      const data = res.getResponseData();
      if (!data || data.status !== 'success') {
        throw new Error('数据库统计信息获取失败');
      }
      
      return '数据库连接正常，统计信息获取成功';
    });
  }
  
  /**
   * 测试角色CRUD操作
   */
  private async testCharacterCRUD(): Promise<void> {
    let createdCharacterId: string | null = null;
    
    // 测试创建角色
    await this.runTest('创建角色测试', async () => {
      const characterData = {
        character_name: '测试角色_' + Date.now(),
        character_realm_Level: 1,
        character_dao_hao: '测试道号_' + Date.now()
      };
      
      const req = new MockRequest({}, characterData);
      const res = new MockResponse();
      
      await this.controller.createCharacter(req as Request, res as unknown as Response);
      
      if (res.getStatusCode() !== 200) {
        throw new Error(`创建角色失败，状态码：${res.getStatusCode()}`);
      }
      
      const data = res.getResponseData();
      if (!data || data.status !== 'success' || !data.data) {
        throw new Error('创建角色响应数据格式错误');
      }
      
      createdCharacterId = data.data.character_id;
      return `角色创建成功，ID：${createdCharacterId}`;
    });
    
    // 测试获取所有角色
    await this.runTest('获取所有角色测试', async () => {
      const req = new MockRequest();
      const res = new MockResponse();
      
      await this.controller.getAllCharacters(req as Request, res as unknown as Response);
      
      if (res.getStatusCode() !== 200) {
        throw new Error(`获取角色列表失败，状态码：${res.getStatusCode()}`);
      }
      
      const data = res.getResponseData();
      if (!data || data.status !== 'success' || !Array.isArray(data.data)) {
        throw new Error('角色列表响应数据格式错误');
      }
      
      return `成功获取${data.data.length}个角色`;
    });
    
    // 测试根据ID获取角色
    if (createdCharacterId) {
      await this.runTest('根据ID获取角色测试', async () => {
        const req = new MockRequest({ id: createdCharacterId });
        const res = new MockResponse();
        
        await this.controller.getCharacterById(req as Request, res as unknown as Response);
        
        if (res.getStatusCode() !== 200) {
          throw new Error(`获取角色失败，状态码：${res.getStatusCode()}`);
        }
        
        const data = res.getResponseData();
        if (!data || data.status !== 'success' || !data.data) {
          throw new Error('角色详情响应数据格式错误');
        }
        
        return `成功获取角色：${data.data.character_name}`;
      });
      
      // 测试更新角色
      await this.runTest('更新角色测试', async () => {
        const updateData = {
          character_dao_hao: '更新后的道号_' + Date.now()
        };
        
        const req = new MockRequest({ id: createdCharacterId }, updateData);
        const res = new MockResponse();
        
        await this.controller.updateCharacter(req as Request, res as unknown as Response);
        
        if (res.getStatusCode() !== 200) {
          throw new Error(`更新角色失败，状态码：${res.getStatusCode()}`);
        }
        
        const data = res.getResponseData();
        if (!data || data.status !== 'success') {
          throw new Error('更新角色响应数据格式错误');
        }
        
        return '角色更新成功';
      });
      
      // 测试删除角色
      await this.runTest('删除角色测试', async () => {
        const req = new MockRequest({ id: createdCharacterId });
        const res = new MockResponse();
        
        await this.controller.deleteCharacter(req as Request, res as unknown as Response);
        
        if (res.getStatusCode() !== 200) {
          throw new Error(`删除角色失败，状态码：${res.getStatusCode()}`);
        }
        
        const data = res.getResponseData();
        if (!data || data.status !== 'success') {
          throw new Error('删除角色响应数据格式错误');
        }
        
        return '角色删除成功';
      });
    }
  }
  
  /**
   * 测试静态数据查询
   */
  private async testStaticDataQueries(): Promise<void> {
    // 测试获取所有境界
    await this.runTest('获取所有境界测试', async () => {
      const req = new MockRequest();
      const res = new MockResponse();
      
      await this.controller.getAllRealms(req as Request, res as unknown as Response);
      
      if (res.getStatusCode() !== 200) {
        throw new Error(`获取境界列表失败，状态码：${res.getStatusCode()}`);
      }
      
      const data = res.getResponseData();
      if (!data || data.status !== 'success' || !Array.isArray(data.data)) {
        throw new Error('境界列表响应数据格式错误');
      }
      
      return `成功获取${data.data.length}个境界`;
    });
    
    // 测试获取所有技能
    await this.runTest('获取所有技能测试', async () => {
      const req = new MockRequest();
      const res = new MockResponse();
      
      await this.controller.getAllSkills(req as Request, res as unknown as Response);
      
      if (res.getStatusCode() !== 200) {
        throw new Error(`获取技能列表失败，状态码：${res.getStatusCode()}`);
      }
      
      const data = res.getResponseData();
      if (!data || data.status !== 'success' || !Array.isArray(data.data)) {
        throw new Error('技能列表响应数据格式错误');
      }
      
      return `成功获取${data.data.length}个技能`;
    });
    
    // 测试获取所有武器
    await this.runTest('获取所有武器测试', async () => {
      const req = new MockRequest();
      const res = new MockResponse();
      
      await this.controller.getAllWeapons(req as Request, res as unknown as Response);
      
      if (res.getStatusCode() !== 200) {
        throw new Error(`获取武器列表失败，状态码：${res.getStatusCode()}`);
      }
      
      const data = res.getResponseData();
      if (!data || data.status !== 'success' || !Array.isArray(data.data)) {
        throw new Error('武器列表响应数据格式错误');
      }
      
      return `成功获取${data.data.length}个武器`;
    });
  }
  
  /**
   * 测试错误处理
   */
  private async testErrorHandling(): Promise<void> {
    // 测试获取不存在的角色
    await this.runTest('获取不存在角色测试', async () => {
      const req = new MockRequest({ id: 'non-existent-id' });
      const res = new MockResponse();
      
      await this.controller.getCharacterById(req as Request, res as unknown as Response);
      
      if (res.getStatusCode() !== 404) {
        throw new Error(`期望404状态码，实际得到${res.getStatusCode()}`);
      }
      
      const data = res.getResponseData();
      if (!data || data.status !== 'error') {
        throw new Error('错误响应格式不正确');
      }
      
      return '正确处理了不存在的角色请求';
    });
    
    // 测试删除不存在的角色
    await this.runTest('删除不存在角色测试', async () => {
      const req = new MockRequest({ id: 'non-existent-id' });
      const res = new MockResponse();
      
      await this.controller.deleteCharacter(req as Request, res as unknown as Response);
      
      if (res.getStatusCode() !== 404) {
        throw new Error(`期望404状态码，实际得到${res.getStatusCode()}`);
      }
      
      return '正确处理了删除不存在角色的请求';
    });
  }
  
  /**
   * 测试参数验证
   */
  private async testParameterValidation(): Promise<void> {
    // 测试创建角色时缺少必需参数
    await this.runTest('创建角色参数验证测试', async () => {
      const invalidData = {
        // 缺少character_name和character_realm_Level
        character_description: '无效的角色数据'
      };
      
      const req = new MockRequest({}, invalidData);
      const res = new MockResponse();
      
      await this.controller.createCharacter(req as Request, res as unknown as Response);
      
      if (res.getStatusCode() !== 400) {
        throw new Error(`期望400状态码，实际得到${res.getStatusCode()}`);
      }
      
      const data = res.getResponseData();
      if (!data || data.status !== 'error') {
        throw new Error('参数验证错误响应格式不正确');
      }
      
      return '正确验证了创建角色的必需参数';
    });
    
    // 测试获取角色时缺少ID参数
    await this.runTest('获取角色ID参数验证测试', async () => {
      const req = new MockRequest({}); // 空的params
      const res = new MockResponse();
      
      await this.controller.getCharacterById(req as Request, res as unknown as Response);
      
      if (res.getStatusCode() !== 400) {
        throw new Error(`期望400状态码，实际得到${res.getStatusCode()}`);
      }
      
      return '正确验证了获取角色的ID参数';
    });
  }
  
  /**
   * 运行单个测试
   */
  private async runTest(testName: string, testFunction: () => Promise<string>): Promise<void> {
    const startTime = Date.now();
    
    try {
      const message = await testFunction();
      const duration = Date.now() - startTime;
      
      this.testResults.push({
        name: testName,
        passed: true,
        message,
        duration
      });
      
      console.log(`✅ ${testName} - 通过 (${duration}ms)`);
      console.log(`   ${message}`);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      this.testResults.push({
        name: testName,
        passed: false,
        message: errorMessage,
        duration
      });
      
      console.log(`❌ ${testName} - 失败 (${duration}ms)`);
      console.log(`   错误: ${errorMessage}`);
    }
    
    console.log('');
  }
  
  /**
   * 打印测试结果
   */
  private printTestResults(totalDuration: number): void {
    console.log('=' .repeat(60));
    console.log('📊 测试结果汇总');
    console.log('=' .repeat(60));
    
    const passedTests = this.testResults.filter(result => result.passed);
    const failedTests = this.testResults.filter(result => !result.passed);
    
    console.log(`总测试数: ${this.testResults.length}`);
    console.log(`通过: ${passedTests.length}`);
    console.log(`失败: ${failedTests.length}`);
    console.log(`成功率: ${((passedTests.length / this.testResults.length) * 100).toFixed(2)}%`);
    console.log(`总耗时: ${totalDuration}ms`);
    
    if (failedTests.length > 0) {
      console.log('\n❌ 失败的测试:');
      failedTests.forEach(test => {
        console.log(`  - ${test.name}: ${test.message}`);
      });
    }
    
    console.log('\n🎉 控制器层CRUD测试完成!');
  }
}

/**
 * 主函数 - 运行测试
 */
async function runControllerCRUDTests(): Promise<void> {
  try {
    const tester = new ControllerCRUDTest();
    await tester.runAllTests();
    console.log('\n✅ 所有测试执行完成');
    process.exit(0);
  } catch (error) {
    console.error('❌ 测试运行失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此文件，则执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  runControllerCRUDTests();
}

export { ControllerCRUDTest, runControllerCRUDTests };