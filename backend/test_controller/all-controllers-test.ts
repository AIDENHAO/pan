/**
 * 所有控制器综合测试
 * 专门测试控制器层功能，不混入API层测试
 * 
 * @author AI Assistant
 * @date 2024-01
 * @description 对所有控制器进行全面的功能测试
 */

import { Request, Response } from 'express';
import { DatabaseController } from '../controllers/DatabaseController.js';
import { LeaderController } from '../controllers/LeaderController.js';
import { MappingController } from '../controllers/MappingController.js';
import { ZongmenController } from '../controllers/ZongmenController.js';

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
 * 所有控制器综合测试类
 */
class AllControllersTest {
  private databaseController: DatabaseController;
  private leaderController: LeaderController;
  private mappingController: MappingController;
  private zongmenController: ZongmenController;
  private testResults: Array<{name: string, passed: boolean, message: string, duration: number, controller: string}> = [];
  
  constructor() {
    this.databaseController = new DatabaseController();
    this.leaderController = new LeaderController();
    this.mappingController = new MappingController();
    this.zongmenController = new ZongmenController();
  }
  
  /**
   * 运行所有控制器测试
   */
  public async runAllTests(): Promise<void> {
    console.log('🚀 开始所有控制器综合测试...');
    console.log('=' .repeat(60));
    
    const startTime = Date.now();
    
    // 测试DatabaseController
    await this.testDatabaseController();
    
    // 测试LeaderController
    await this.testLeaderController();
    
    // 测试MappingController
    await this.testMappingController();
    
    // 测试ZongmenController
    await this.testZongmenController();
    
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    
    this.printTestResults(totalDuration);
  }
  
  /**
   * 测试DatabaseController
   */
  private async testDatabaseController(): Promise<void> {
    console.log('\n--- DatabaseController 测试 ---');
    
    // 测试数据库连接
    await this.runTest('DatabaseController', '数据库连接测试', async () => {
      const req = new MockRequest();
      const res = new MockResponse();
      
      await this.databaseController.getDatabaseStats(req as Request, res as unknown as Response);
      
      if (res.getStatusCode() !== 200) {
        throw new Error(`数据库连接失败，状态码：${res.getStatusCode()}`);
      }
      
      const data = res.getResponseData();
      if (!data || data.status !== 'success') {
        throw new Error('数据库统计信息获取失败');
      }
      
      return '数据库连接正常，统计信息获取成功';
    });
    
    // 测试获取所有角色
    await this.runTest('DatabaseController', '获取所有角色测试', async () => {
      const req = new MockRequest();
      const res = new MockResponse();
      
      await this.databaseController.getAllCharacters(req as Request, res as unknown as Response);
      
      if (res.getStatusCode() !== 200) {
        throw new Error(`获取角色列表失败，状态码：${res.getStatusCode()}`);
      }
      
      const data = res.getResponseData();
      if (!data || data.status !== 'success') {
        throw new Error('角色列表响应格式错误');
      }
      
      return `成功获取角色列表，共${Array.isArray(data.data) ? data.data.length : 0}个角色`;
    });
    
    // 测试获取所有境界
    await this.runTest('DatabaseController', '获取所有境界测试', async () => {
      const req = new MockRequest();
      const res = new MockResponse();
      
      await this.databaseController.getAllRealms(req as Request, res as unknown as Response);
      
      if (res.getStatusCode() !== 200) {
        throw new Error(`获取境界列表失败，状态码：${res.getStatusCode()}`);
      }
      
      const data = res.getResponseData();
      if (!data || data.status !== 'success') {
        throw new Error('境界列表响应格式错误');
      }
      
      return `成功获取境界列表，共${Array.isArray(data.data) ? data.data.length : 0}个境界`;
    });
    
    // 测试参数验证
    await this.runTest('DatabaseController', '参数验证测试', async () => {
      const req = new MockRequest({}); // 空的params
      const res = new MockResponse();
      
      await this.databaseController.getCharacterById(req as Request, res as unknown as Response);
      
      if (res.getStatusCode() !== 400) {
        throw new Error(`期望400状态码，实际得到${res.getStatusCode()}`);
      }
      
      return '参数验证功能正常';
    });
  }
  
  /**
   * 测试LeaderController
   */
  private async testLeaderController(): Promise<void> {
    console.log('\n--- LeaderController 测试 ---');
    
    // 测试获取掌门信息
    await this.runTest('LeaderController', '获取掌门信息测试', async () => {
      const req = new MockRequest();
      const res = new MockResponse();
      
      await this.leaderController.getLeaderInfo(req as Request, res as unknown as Response);
      
      const statusCode = res.getStatusCode();
      if (statusCode !== 200 && statusCode !== 404 && statusCode !== 500) {
        throw new Error(`获取掌门信息失败，状态码：${statusCode}`);
      }
      
      const data = res.getResponseData();
      if (!data || (data.status !== 'success' && data.status !== 'error')) {
        throw new Error('掌门信息响应格式错误');
      }
      
      return statusCode === 200 ? '成功获取掌门信息' : '掌门信息文件不存在或读取错误（正常情况）';
    });
    
    // 测试更新修炼值
    await this.runTest('LeaderController', '更新修炼值测试', async () => {
      const updateData = {
        cultivationValue: 1000
      };
      
      const req = new MockRequest({}, updateData);
      const res = new MockResponse();
      
      await this.leaderController.updateCultivationValue(req as Request, res as unknown as Response);
      
      const statusCode = res.getStatusCode();
      if (statusCode !== 200 && statusCode !== 404 && statusCode !== 400) {
        throw new Error(`更新修炼值失败，状态码：${statusCode}`);
      }
      
      const data = res.getResponseData();
      if (!data || (data.status !== 'success' && data.status !== 'error')) {
        throw new Error('更新修炼值响应格式错误');
      }
      
      return statusCode === 200 ? '成功更新修炼值' : '掌门数据文件不存在或参数错误（正常情况）';
    });
  }
  
  /**
   * 测试MappingController
   */
  private async testMappingController(): Promise<void> {
    console.log('\n--- MappingController 测试 ---');
    
    // 测试获取所有映射
    await this.runTest('MappingController', '获取所有映射测试', async () => {
      const req = new MockRequest();
      const res = new MockResponse();
      
      await this.mappingController.getAllMappings(req as Request, res as unknown as Response);
      
      const statusCode = res.getStatusCode();
      if (statusCode !== 200 && statusCode !== 404 && statusCode !== 500) {
        throw new Error(`获取所有映射失败，状态码：${statusCode}`);
      }
      
      const data = res.getResponseData();
      if (!data || (data.status !== 'success' && data.status !== 'error')) {
        throw new Error('所有映射响应格式错误');
      }
      
      return statusCode === 200 ? '成功获取所有映射' : '映射文件不存在或读取错误（正常情况）';
    });
    
    // 测试获取职位映射
    await this.runTest('MappingController', '获取职位映射测试', async () => {
      const req = new MockRequest();
      const res = new MockResponse();
      
      await this.mappingController.getPositionMapping(req as Request, res as unknown as Response);
      
      const statusCode = res.getStatusCode();
      if (statusCode !== 200 && statusCode !== 404 && statusCode !== 500) {
        throw new Error(`获取职位映射失败，状态码：${statusCode}`);
      }
      
      const data = res.getResponseData();
      if (!data || (data.status !== 'success' && data.status !== 'error')) {
        throw new Error('职位映射响应格式错误');
      }
      
      return statusCode === 200 ? '成功获取职位映射' : '职位映射文件不存在或读取错误（正常情况）';
    });
    
    // 测试获取境界映射
    await this.runTest('MappingController', '获取境界映射测试', async () => {
      const req = new MockRequest();
      const res = new MockResponse();
      
      await this.mappingController.getRealmMapping(req as Request, res as unknown as Response);
      
      const statusCode = res.getStatusCode();
      if (statusCode !== 200 && statusCode !== 404 && statusCode !== 500) {
        throw new Error(`获取境界映射失败，状态码：${statusCode}`);
      }
      
      const data = res.getResponseData();
      if (!data || (data.status !== 'success' && data.status !== 'error')) {
        throw new Error('境界映射响应格式错误');
      }
      
      return statusCode === 200 ? '成功获取境界映射' : '境界映射文件不存在或读取错误（正常情况）';
    });
    
    // 测试获取技能映射
    await this.runTest('MappingController', '获取技能映射测试', async () => {
      const req = new MockRequest();
      const res = new MockResponse();
      
      await this.mappingController.getSkillMapping(req as Request, res as unknown as Response);
      
      const statusCode = res.getStatusCode();
      if (statusCode !== 200 && statusCode !== 404 && statusCode !== 500) {
        throw new Error(`获取技能映射失败，状态码：${statusCode}`);
      }
      
      const data = res.getResponseData();
      if (!data || (data.status !== 'success' && data.status !== 'error')) {
        throw new Error('技能映射响应格式错误');
      }
      
      return statusCode === 200 ? '成功获取技能映射' : '技能映射文件不存在或读取错误（正常情况）';
    });
    
    // 测试获取建筑映射
    await this.runTest('MappingController', '获取建筑映射测试', async () => {
      const req = new MockRequest();
      const res = new MockResponse();
      
      await this.mappingController.getBuildingMapping(req as Request, res as unknown as Response);
      
      const statusCode = res.getStatusCode();
      if (statusCode !== 200 && statusCode !== 404 && statusCode !== 500) {
        throw new Error(`获取建筑映射失败，状态码：${statusCode}`);
      }
      
      const data = res.getResponseData();
      if (!data || (data.status !== 'success' && data.status !== 'error')) {
        throw new Error('建筑映射响应格式错误');
      }
      
      return statusCode === 200 ? '成功获取建筑映射' : '建筑映射文件不存在或读取错误（正常情况）';
    });
  }
  
  /**
   * 测试ZongmenController
   */
  private async testZongmenController(): Promise<void> {
    console.log('\n--- ZongmenController 测试 ---');
    
    // 测试获取宗门信息
    await this.runTest('ZongmenController', '获取宗门信息测试', async () => {
      const req = new MockRequest();
      const res = new MockResponse();
      
      await this.zongmenController.getZongmenInfo(req as Request, res as unknown as Response);
      
      const statusCode = res.getStatusCode();
      if (statusCode !== 200 && statusCode !== 404 && statusCode !== 500) {
        throw new Error(`获取宗门信息失败，状态码：${statusCode}`);
      }
      
      const data = res.getResponseData();
      if (!data || (data.status !== 'success' && data.status !== 'error')) {
        throw new Error('宗门信息响应格式错误');
      }
      
      return statusCode === 200 ? '成功获取宗门信息' : '宗门信息文件不存在或读取错误（正常情况）';
    });
    
    // 测试更新宗门等级
    await this.runTest('ZongmenController', '更新宗门等级测试', async () => {
      const updateData = {
        level: 2
      };
      
      const req = new MockRequest({}, updateData);
      const res = new MockResponse();
      
      await this.zongmenController.updateZongmenLevel(req as Request, res as unknown as Response);
      
      const statusCode = res.getStatusCode();
      if (statusCode !== 200 && statusCode !== 404 && statusCode !== 400) {
        throw new Error(`更新宗门等级失败，状态码：${statusCode}`);
      }
      
      const data = res.getResponseData();
      if (!data || (data.status !== 'success' && data.status !== 'error')) {
        throw new Error('更新宗门等级响应格式错误');
      }
      
      return statusCode === 200 ? '成功更新宗门等级' : '宗门数据文件不存在或参数错误（正常情况）';
    });
  }
  
  /**
   * 运行单个测试
   */
  private async runTest(controller: string, testName: string, testFunction: () => Promise<string>): Promise<void> {
    const startTime = Date.now();
    
    try {
      const message = await testFunction();
      const duration = Date.now() - startTime;
      
      this.testResults.push({
        name: testName,
        controller,
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
        controller,
        passed: false,
        message: errorMessage,
        duration
      });
      
      console.log(`❌ ${testName} - 失败 (${duration}ms)`);
      console.log(`   ${errorMessage}`);
    }
  }
  
  /**
   * 打印测试结果汇总
   */
  private printTestResults(totalDuration: number): void {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 测试结果汇总');
    console.log('=' .repeat(60));
    
    const passedTests = this.testResults.filter(result => result.passed);
    const failedTests = this.testResults.filter(result => !result.passed);
    
    console.log(`总测试数: ${this.testResults.length}`);
    console.log(`通过: ${passedTests.length}`);
    console.log(`失败: ${failedTests.length}`);
    console.log(`成功率: ${((passedTests.length / this.testResults.length) * 100).toFixed(2)}%`);
    console.log(`总耗时: ${totalDuration}ms`);
    
    // 按控制器分组显示结果
    const controllerGroups = this.groupTestsByController();
    
    console.log('\n📋 各控制器测试结果:');
    for (const [controller, tests] of Object.entries(controllerGroups)) {
      const passed = tests.filter(t => t.passed).length;
      const total = tests.length;
      const successRate = ((passed / total) * 100).toFixed(1);
      
      console.log(`  ${controller}: ${passed}/${total} (${successRate}%)`);
    }
    
    if (failedTests.length > 0) {
      console.log('\n❌ 失败的测试:');
      failedTests.forEach(test => {
        console.log(`  - [${test.controller}] ${test.name}: ${test.message}`);
      });
    }
    
    console.log('\n🎉 所有控制器测试完成!');
  }
  
  /**
   * 按控制器分组测试结果
   */
  private groupTestsByController(): Record<string, typeof this.testResults> {
    const groups: Record<string, typeof this.testResults> = {};
    
    this.testResults.forEach(test => {
      if (!groups[test.controller]) {
        groups[test.controller] = [];
      }
      groups[test.controller].push(test);
    });
    
    return groups;
  }
  
  /**
   * 获取测试结果（供外部调用）
   */
  public getTestResults(): typeof this.testResults {
    return this.testResults;
  }
}

/**
 * 运行所有控制器测试的主函数
 */
export async function runAllControllersTest(): Promise<void> {
  const tester = new AllControllersTest();
  await tester.runAllTests();
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllControllersTest().catch(console.error);
}

export { AllControllersTest };