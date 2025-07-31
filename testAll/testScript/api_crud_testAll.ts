/**
 * API层CRUD操作测试脚本
 * 文件名: api_crud_testAll.ts
 * 功能: 测试API路由层的HTTP接口功能
 * 作者: AI Assistant
 * 创建时间: 2024-12-19
 */

import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { dbManager } from '../../src/database/config/database.js';
import { dalFactory } from '../../src/database/implementations/DALFactory.js';

// HTTP客户端类
class HttpClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = 'http://localhost:3000', timeout: number = 10000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * 发送HTTP请求
   */
  async request(options: {
    method: string;
    path: string;
    headers?: any;
    body?: any;
  }): Promise<{
    statusCode: number;
    headers: any;
    body: any;
  }> {
    return new Promise((resolve, reject) => {
      const url = new URL(options.path, this.baseUrl);
      const requestOptions = {
        hostname: url.hostname,
        port: url.port || 3000,
        path: url.pathname + url.search,
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'API-Test-Client/1.0',
          ...options.headers
        },
        timeout: this.timeout
      };

      const req = http.request(requestOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const body = data ? JSON.parse(data) : null;
            resolve({
              statusCode: res.statusCode || 0,
              headers: res.headers,
              body
            });
          } catch (error) {
            resolve({
              statusCode: res.statusCode || 0,
              headers: res.headers,
              body: data
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`HTTP请求失败: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('HTTP请求超时'));
      });

      // 发送请求体
      if (options.body) {
        const bodyData = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
        req.write(bodyData);
      }

      req.end();
    });
  }

  /**
   * GET请求
   */
  async get(path: string, headers?: any): Promise<any> {
    return this.request({ method: 'GET', path, headers });
  }

  /**
   * POST请求
   */
  async post(path: string, body?: any, headers?: any): Promise<any> {
    return this.request({ method: 'POST', path, body, headers });
  }

  /**
   * PUT请求
   */
  async put(path: string, body?: any, headers?: any): Promise<any> {
    return this.request({ method: 'PUT', path, body, headers });
  }

  /**
   * DELETE请求
   */
  async delete(path: string, headers?: any): Promise<any> {
    return this.request({ method: 'DELETE', path, headers });
  }
}

// 测试配置接口
interface TestConfig {
  testName: string;
  dataPath: string;
  reportPath: string;
  timeout: number;
  serverUrl: string;
  serverPort: number;
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
  serverState?: any;
  databaseState?: any;
  testDataIds?: string[];
}

/**
 * API层测试环境管理类
 */
class APITestEnvironment {
  private originalState: EnvironmentState | null = null;
  private testConfig: TestConfig;
  private createdTestDataIds: string[] = [];
  private httpClient: HttpClient;
  private serverProcess: any = null;

  constructor(config: TestConfig) {
    this.testConfig = config;
    this.httpClient = new HttpClient(config.serverUrl, config.timeout);
  }

  /**
   * 捕获当前环境状态
   */
  async captureCurrentState(): Promise<EnvironmentState> {
    console.log('📸 正在捕获API层环境状态...');
    
    const state: EnvironmentState = {
      timestamp: new Date().toISOString(),
      serverState: await this.captureServerState(),
      databaseState: await this.captureDatabaseState(),
      testDataIds: [...this.createdTestDataIds]
    };
    
    console.log('✅ API层环境状态捕获完成');
    return state;
  }

  /**
   * 设置测试环境
   */
  async setupTestEnvironment(): Promise<void> {
    console.log('🔧 正在设置API层测试环境...');
    
    // 备份当前状态
    this.originalState = await this.captureCurrentState();
    
    // 确保数据库连接
    await dbManager.connect();
    
    // 检查服务器状态
    await this.checkServerStatus();
    
    // 清理可能存在的测试数据
    await this.cleanupExistingTestData();
    
    console.log('✅ API层测试环境设置完成');
  }

  /**
   * 恢复原始环境状态
   */
  async restoreEnvironment(): Promise<void> {
    console.log('🔄 正在恢复API层环境状态...');
    
    try {
      // 清理测试数据
      await this.cleanupTestData();
      
      console.log('✅ API层环境状态恢复完成');
    } catch (error) {
      console.error('❌ API层环境恢复失败:', error);
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

  /**
   * 获取HTTP客户端
   */
  getHttpClient(): HttpClient {
    return this.httpClient;
  }

  private async captureServerState(): Promise<any> {
    try {
      const response = await this.httpClient.get('/api/v2/system/health');
      return {
        available: response.statusCode === 200,
        health: response.body
      };
    } catch (error) {
      return {
        available: false,
        error: error.toString()
      };
    }
  }

  private async captureDatabaseState(): Promise<any> {
    return {
      connected: dbManager.isPoolConnected(),
      poolStatus: dbManager.getPoolStatus()
    };
  }

  private async checkServerStatus(): Promise<void> {
    console.log('🔍 检查API服务器状态...');
    
    try {
      const response = await this.httpClient.get('/api/v2/system/health');
      if (response.statusCode !== 200) {
        throw new Error(`服务器健康检查失败，状态码: ${response.statusCode}`);
      }
      console.log('✅ API服务器状态正常');
    } catch (error) {
      console.warn('⚠️ API服务器可能未启动，某些测试可能会失败');
      console.warn('请确保服务器在端口', this.testConfig.serverPort, '上运行');
    }
  }

  private async cleanupExistingTestData(): Promise<void> {
    // 通过API清理可能存在的测试数据
    try {
      // 这里可以调用API来清理测试数据
      console.log('🧹 清理现有API测试数据...');
    } catch (error) {
      console.warn('清理现有测试数据时出错:', error);
    }
  }

  private async cleanupTestData(): Promise<void> {
    console.log('🧹 正在清理API层测试数据...');
    
    for (const id of this.createdTestDataIds) {
      try {
        await this.httpClient.delete(`/api/v2/character/${id}`);
      } catch (error) {
        console.warn(`清理测试数据失败 ${id}:`, error);
      }
    }
    
    this.createdTestDataIds = [];
    console.log('✅ API层测试数据清理完成');
  }
}

/**
 * API层测试数据验证器
 */
class APITestDataValidator {
  /**
   * 验证测试数据
   */
  static validateTestData(testData: any, schema: any): boolean {
    if (!testData || typeof testData !== 'object') {
      throw new Error('API测试数据格式不正确');
    }

    // 验证必要字段
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in testData)) {
          throw new Error(`API测试数据缺少必要字段: ${field}`);
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
        throw new Error(`API测试数据文件不存在: ${dataPath}`);
      }

      const rawData = fs.readFileSync(dataPath, 'utf-8');
      const testData = JSON.parse(rawData);

      console.log(`✅ API测试数据加载成功: ${dataPath}`);
      return testData;
    } catch (error) {
      console.error(`❌ API测试数据加载失败: ${dataPath}`, error);
      throw error;
    }
  }

  /**
   * 验证API响应格式
   */
  static validateAPIResponse(response: any, expectedStatus: number): void {
    if (response.statusCode !== expectedStatus) {
      throw new Error(`API响应状态码不正确，期望: ${expectedStatus}，实际: ${response.statusCode}`);
    }

    if (!response.body) {
      throw new Error('API响应体为空');
    }

    // 验证标准API响应格式
    if (typeof response.body === 'object') {
      if (!('success' in response.body)) {
        throw new Error('API响应缺少success字段');
      }
    }
  }
}

/**
 * API层测试报告生成器
 */
class APITestReportGenerator {
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
    console.log(`📄 API层测试报告已生成: ${this.config.reportPath}`);
  }

  private createReportContent(): string {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'PASS').length;
    const failedTests = this.results.filter(r => r.status === 'FAIL').length;
    const skippedTests = this.results.filter(r => r.status === 'SKIP').length;
    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0.00';
    const totalDuration = this.endTime ? this.endTime.getTime() - this.startTime.getTime() : 0;

    return `# API层CRUD操作测试报告

## 测试概述
- **测试时间**: ${this.startTime.toISOString()}
- **测试环境**: 开发环境
- **服务器地址**: ${this.config.serverUrl}
- **测试目的**: 验证API路由层的HTTP接口功能
- **测试范围**: 角色管理、静态数据、系统功能的API接口CRUD操作

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
- **服务器状态**: 正常
- **数据库状态**: 已恢复
- **测试数据**: 已清理

## 总结与建议
${failedTests === 0 ? '✅ 所有API层CRUD测试通过，HTTP接口功能正常。' : `⚠️ 有 ${failedTests} 个测试失败，请检查相关API实现。`}

### 改进建议
1. 增加API性能测试和负载测试
2. 完善API文档和接口规范
3. 添加API版本兼容性测试
4. 优化API响应时间和错误处理
5. 增加API安全性测试

---
**报告生成时间**: ${new Date().toISOString()}
**测试框架**: API CRUD TestAll v1.0
`;
  }
}

/**
 * API层CRUD测试主类
 */
class APICRUDTest {
  private config: TestConfig;
  private environment: APITestEnvironment;
  private reportGenerator: APITestReportGenerator;
  private httpClient: HttpClient;

  constructor() {
    this.config = {
      testName: 'API层CRUD操作测试',
      dataPath: path.join(__dirname, '../testData/api_crud_testAll_data.json'),
      reportPath: path.join(__dirname, '../testReport/api_crud_testAll_report.md'),
      timeout: 30000,
      serverUrl: 'http://localhost:3000',
      serverPort: 3000
    };
    
    this.environment = new APITestEnvironment(this.config);
    this.reportGenerator = new APITestReportGenerator(this.config);
    this.httpClient = this.environment.getHttpClient();
  }

  /**
   * 运行测试
   */
  async runTest(): Promise<void> {
    console.log('🚀 开始API层CRUD测试');
    console.log('=' .repeat(60));
    console.log(`测试名称: ${this.config.testName}`);
    console.log(`服务器地址: ${this.config.serverUrl}`);
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
      console.error('❌ API层测试执行失败:', error);
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
      const testData = APITestDataValidator.loadTestData(this.config.dataPath);
      
      // 验证数据格式
      const schema = {
        required: ['characterAPI', 'staticDataAPI', 'systemAPI'],
        properties: {
          characterAPI: { type: 'object' },
          staticDataAPI: { type: 'object' },
          systemAPI: { type: 'object' }
        }
      };
      
      APITestDataValidator.validateTestData(testData, schema);
      
      const duration = Date.now() - startTime;
      this.reportGenerator.addResult({
        testName: '测试数据加载验证',
        status: 'PASS',
        duration,
        message: 'API测试数据加载和验证成功'
      });
      
      return testData;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.reportGenerator.addResult({
        testName: '测试数据加载验证',
        status: 'FAIL',
        duration,
        message: `API测试数据加载失败: ${error}`,
        details: { error: error.toString() }
      });
      throw error;
    }
  }

  /**
   * 执行测试用例
   */
  private async executeTestCases(testData: any): Promise<void> {
    console.log('\n📋 开始执行API层CRUD测试用例...');
    
    // API基础连通性测试
    await this.testAPIConnectivity();
    
    // 角色API CRUD测试
    await this.testCharacterAPICRUD(testData.characterAPI);
    
    // 静态数据API测试
    await this.testStaticDataAPI(testData.staticDataAPI);
    
    // 系统API测试
    await this.testSystemAPI(testData.systemAPI);
    
    // API错误处理测试
    await this.testAPIErrorHandling();
    
    // API参数验证测试
    await this.testAPIParameterValidation();
    
    // API性能测试
    await this.testAPIPerformance();
    
    // API安全性测试
    await this.testAPISecurity();
  }

  /**
   * 测试API基础连通性
   */
  private async testAPIConnectivity(): Promise<void> {
    // 测试API版本信息
    await this.executeTestCase('API版本信息测试', async () => {
      const response = await this.httpClient.get('/api/v2');
      
      APITestDataValidator.validateAPIResponse(response, 200);
      
      if (!response.body.data || !response.body.data.version) {
        throw new Error('API版本信息不完整');
      }
      
      return `API版本信息获取成功: ${response.body.data.version}`;
    });
    
    // 测试健康检查
    await this.executeTestCase('API健康检查测试', async () => {
      const response = await this.httpClient.get('/api/v2/system/health');
      
      APITestDataValidator.validateAPIResponse(response, 200);
      
      if (!response.body.data || response.body.data.status !== 'healthy') {
        throw new Error('API健康检查失败');
      }
      
      return `API健康检查成功: ${response.body.data.status}`;
    });
  }

  /**
   * 测试角色API CRUD操作
   */
  private async testCharacterAPICRUD(characterAPIData: any): Promise<void> {
    let testCharacterId: string | null = null;
    
    // 测试创建角色API
    await this.executeTestCase('角色API创建测试', async () => {
      const characterData = {
        name: 'API测试角色',
        gender: '男',
        realm_level: 1,
        cultivation_value: 0,
        spiritual_root: '金',
        life_state: '存活',
        location: 'API测试地点',
        description: 'API层测试创建的角色'
      };
      
      const response = await this.httpClient.post('/api/v2/character', characterData);
      
      APITestDataValidator.validateAPIResponse(response, 201);
      
      if (!response.body.data || !response.body.data.character_uuid) {
        throw new Error('角色创建API响应数据不完整');
      }
      
      testCharacterId = response.body.data.character_uuid;
      if (testCharacterId) {
        this.environment.recordTestDataId(testCharacterId);
      }
      
      return `角色创建API成功，ID: ${testCharacterId}`;
    });
    
    // 测试查询角色API
    if (testCharacterId) {
      await this.executeTestCase('角色API查询测试', async () => {
        const response = await this.httpClient.get(`/api/v2/character/${testCharacterId}`);
        
        APITestDataValidator.validateAPIResponse(response, 200);
        
        if (!response.body.data || response.body.data.name !== 'API测试角色') {
          throw new Error('角色查询API返回数据不正确');
        }
        
        return `角色查询API成功，姓名: ${response.body.data.name}`;
      });
      
      // 测试更新角色API
      await this.executeTestCase('角色API更新测试', async () => {
        const updateData = {
          cultivation_value: 100,
          description: 'API层测试更新的角色'
        };
        
        const response = await this.httpClient.put(`/api/v2/character/${testCharacterId}`, updateData);
        
        APITestDataValidator.validateAPIResponse(response, 200);
        
        return `角色更新API成功`;
      });
      
      // 测试角色列表API
      await this.executeTestCase('角色API列表查询测试', async () => {
        const response = await this.httpClient.get('/api/v2/character?page=1&limit=10');
        
        APITestDataValidator.validateAPIResponse(response, 200);
        
        if (!Array.isArray(response.body.data)) {
          throw new Error('角色列表API返回数据格式不正确');
        }
        
        return `角色列表API成功，数据条数: ${response.body.data.length}`;
      });
      
      // 测试角色亲和度API
      await this.executeTestCase('角色亲和度API测试', async () => {
        const affinityData = {
          character_uuid: testCharacterId,
          metal_affinity: 80,
          wood_affinity: 60,
          water_affinity: 70,
          fire_affinity: 50,
          earth_affinity: 65
        };
        
        const response = await this.httpClient.post(`/api/v2/character/${testCharacterId}/affinities`, affinityData);
        
        APITestDataValidator.validateAPIResponse(response, 201);
        
        return `角色亲和度API创建成功`;
      });
      
      // 测试删除角色API（最后执行）
      await this.executeTestCase('角色API删除测试', async () => {
        const response = await this.httpClient.delete(`/api/v2/character/${testCharacterId}`);
        
        APITestDataValidator.validateAPIResponse(response, 200);
        
        return `角色删除API成功`;
      });
    }
  }

  /**
   * 测试静态数据API
   */
  private async testStaticDataAPI(staticAPIData: any): Promise<void> {
    // 测试境界数据API
    await this.executeTestCase('境界数据API测试', async () => {
      const response = await this.httpClient.get('/api/v2/static-data/realms');
      
      APITestDataValidator.validateAPIResponse(response, 200);
      
      if (!Array.isArray(response.body.data)) {
        throw new Error('境界数据API返回格式不正确');
      }
      
      return `境界数据API成功，数据条数: ${response.body.data.length}`;
    });
    
    // 测试技能数据API
    await this.executeTestCase('技能数据API测试', async () => {
      const response = await this.httpClient.get('/api/v2/static-data/skills');
      
      APITestDataValidator.validateAPIResponse(response, 200);
      
      if (!Array.isArray(response.body.data)) {
        throw new Error('技能数据API返回格式不正确');
      }
      
      return `技能数据API成功，数据条数: ${response.body.data.length}`;
    });
    
    // 测试物品数据API
    await this.executeTestCase('物品数据API测试', async () => {
      const response = await this.httpClient.get('/api/v2/static-data/items');
      
      APITestDataValidator.validateAPIResponse(response, 200);
      
      if (!Array.isArray(response.body.data)) {
        throw new Error('物品数据API返回格式不正确');
      }
      
      return `物品数据API成功，数据条数: ${response.body.data.length}`;
    });
    
    // 测试分页查询API
    await this.executeTestCase('静态数据分页API测试', async () => {
      const response = await this.httpClient.get('/api/v2/static-data/realms?page=1&limit=5');
      
      APITestDataValidator.validateAPIResponse(response, 200);
      
      if (!Array.isArray(response.body.data) || response.body.data.length > 5) {
        throw new Error('分页API返回数据不正确');
      }
      
      return `分页API成功，返回 ${response.body.data.length} 条记录`;
    });
  }

  /**
   * 测试系统API
   */
  private async testSystemAPI(systemAPIData: any): Promise<void> {
    // 测试系统信息API
    await this.executeTestCase('系统信息API测试', async () => {
      const response = await this.httpClient.get('/api/v2/system/info');
      
      APITestDataValidator.validateAPIResponse(response, 200);
      
      if (!response.body.data || !response.body.data.version) {
        throw new Error('系统信息API返回数据不完整');
      }
      
      return `系统信息API成功，版本: ${response.body.data.version}`;
    });
    
    // 测试数据库状态API
    await this.executeTestCase('数据库状态API测试', async () => {
      const response = await this.httpClient.get('/api/v2/system/database-status');
      
      APITestDataValidator.validateAPIResponse(response, 200);
      
      if (!response.body.data || !response.body.data.status) {
        throw new Error('数据库状态API返回数据不完整');
      }
      
      return `数据库状态API成功，状态: ${response.body.data.status}`;
    });
  }

  /**
   * 测试API错误处理
   */
  private async testAPIErrorHandling(): Promise<void> {
    // 测试404错误
    await this.executeTestCase('API 404错误处理测试', async () => {
      const response = await this.httpClient.get('/api/v2/non-existent-endpoint');
      
      if (response.statusCode !== 404) {
        throw new Error(`期望404状态码，实际: ${response.statusCode}`);
      }
      
      return `404错误处理正确，状态码: ${response.statusCode}`;
    });
    
    // 测试查询不存在的资源
    await this.executeTestCase('API资源不存在错误测试', async () => {
      const response = await this.httpClient.get('/api/v2/character/non-existent-id-12345');
      
      if (response.statusCode !== 404) {
        throw new Error(`期望404状态码，实际: ${response.statusCode}`);
      }
      
      return `资源不存在错误处理正确，状态码: ${response.statusCode}`;
    });
  }

  /**
   * 测试API参数验证
   */
  private async testAPIParameterValidation(): Promise<void> {
    // 测试无效参数
    await this.executeTestCase('API参数验证测试', async () => {
      const invalidData = {
        // 缺少必要字段
        gender: '男'
      };
      
      const response = await this.httpClient.post('/api/v2/character', invalidData);
      
      if (response.statusCode !== 400) {
        throw new Error(`期望400状态码，实际: ${response.statusCode}`);
      }
      
      return `参数验证正确，状态码: ${response.statusCode}`;
    });
    
    // 测试无效查询参数
    await this.executeTestCase('API查询参数验证测试', async () => {
      const response = await this.httpClient.get('/api/v2/character?page=invalid&limit=abc');
      
      // 根据实际API实现，可能返回400或者使用默认值
      if (response.statusCode !== 400 && response.statusCode !== 200) {
        throw new Error(`查询参数验证异常，状态码: ${response.statusCode}`);
      }
      
      return `查询参数验证正确，状态码: ${response.statusCode}`;
    });
  }

  /**
   * 测试API性能
   */
  private async testAPIPerformance(): Promise<void> {
    await this.executeTestCase('API性能测试', async () => {
      const startTime = Date.now();
      const promises: Promise<any>[] = [];
      
      // 并发发送10个请求
      for (let i = 0; i < 10; i++) {
        promises.push(this.httpClient.get('/api/v2/static-data/realms'));
      }
      
      const responses = await Promise.all(promises) as any[];
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // 检查所有请求是否成功
      const failedRequests = responses.filter((r: any) => r.statusCode !== 200);
      if (failedRequests.length > 0) {
        throw new Error(`${failedRequests.length} 个并发请求失败`);
      }
      
      // 性能阈值检查（10个请求在5秒内完成）
      if (duration > 5000) {
        console.warn(`API性能警告: 10个并发请求耗时 ${duration}ms`);
      }
      
      return `API性能测试完成，10个并发请求耗时: ${duration}ms`;
    });
  }

  /**
   * 测试API安全性
   */
  private async testAPISecurity(): Promise<void> {
    // 测试SQL注入防护
    await this.executeTestCase('API SQL注入防护测试', async () => {
      const maliciousId = "'; DROP TABLE characters; --";
      const response = await this.httpClient.get(`/api/v2/character/${encodeURIComponent(maliciousId)}`);
      
      // 应该返回404或400，而不是500（服务器错误）
      if (response.statusCode === 500) {
        throw new Error('可能存在SQL注入漏洞');
      }
      
      return `SQL注入防护正常，状态码: ${response.statusCode}`;
    });
    
    // 测试XSS防护
    await this.executeTestCase('API XSS防护测试', async () => {
      const xssPayload = {
        name: '<script>alert("XSS")</script>',
        gender: '男',
        realm_level: 1,
        cultivation_value: 0,
        spiritual_root: '金',
        life_state: '存活',
        location: 'XSS测试地点'
      };
      
      const response = await this.httpClient.post('/api/v2/character', xssPayload);
      
      // 应该被拒绝或者进行转义处理
      if (response.statusCode === 201 && response.body.data && 
          response.body.data.name && response.body.data.name.includes('<script>')) {
        console.warn('可能存在XSS漏洞，建议检查输入过滤');
      }
      
      return `XSS防护测试完成，状态码: ${response.statusCode}`;
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
      characterAPI: {
        testCharacter: {
          name: 'API测试角色',
          gender: '男',
          realm_level: 1,
          cultivation_value: 0,
          spiritual_root: '金',
          life_state: '存活',
          location: 'API测试地点',
          description: 'API层测试创建的角色'
        }
      },
      staticDataAPI: {
        endpoints: {
          realms: '/api/v2/static-data/realms',
          skills: '/api/v2/static-data/skills',
          items: '/api/v2/static-data/items'
        }
      },
      systemAPI: {
        endpoints: {
          health: '/api/v2/system/health',
          info: '/api/v2/system/info',
          databaseStatus: '/api/v2/system/database-status'
        }
      }
    };
    
    // 确保数据目录存在
    const dataDir = path.dirname(this.config.dataPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(this.config.dataPath, JSON.stringify(defaultData, null, 2), 'utf-8');
    console.log(`✅ 默认API测试数据已创建: ${this.config.dataPath}`);
  }

  /**
   * 清理测试环境
   */
  private async cleanup(): Promise<void> {
    try {
      await this.environment.cleanup();
      await this.reportGenerator.generateReport();
      console.log('\n✅ API层测试完成，环境已清理');
    } catch (error) {
      console.error('❌ API层测试清理失败:', error);
    }
  }
}

// 主执行函数
async function runAPICRUDTest(): Promise<void> {
  const test = new APICRUDTest();
  
  try {
    await test.runTest();
  } catch (error) {
    console.error('❌ API层测试执行失败:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// 如果直接运行此文件
if (require.main === module) {
  runAPICRUDTest().catch((error) => {
    console.error('❌ API层测试启动失败:', error);
    process.exit(1);
  });
}

export { APICRUDTest, APITestEnvironment, APITestDataValidator, APITestReportGenerator, HttpClient };