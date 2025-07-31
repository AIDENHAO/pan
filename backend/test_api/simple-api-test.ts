#!/usr/bin/env ts-node
/**
 * 简化的API CRUD测试脚本
 * 测试当前可用的API端点
 * 
 * @author AI Assistant
 * @date 2025-07-31
 */

import axios from 'axios';

// 测试配置
const API_BASE_URL = 'http://localhost:3015';
const TEST_TIMEOUT = 5000;

/**
 * 测试结果接口
 */
interface TestResult {
  endpoint: string;
  method: string;
  status: 'PASS' | 'FAIL';
  statusCode?: number;
  responseTime: number;
  error?: string;
  data?: any;
}

/**
 * API测试类
 */
class SimpleApiTest {
  private results: TestResult[] = [];

  /**
   * 执行单个API测试
   */
  private async testEndpoint(
    endpoint: string, 
    method: 'GET' | 'POST' = 'GET', 
    data?: any
  ): Promise<TestResult> {
    const startTime = Date.now();
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      let response;
      
      if (method === 'GET') {
        response = await axios.get(url, { timeout: TEST_TIMEOUT });
      } else {
        response = await axios.post(url, data, { timeout: TEST_TIMEOUT });
      }
      
      const responseTime = Date.now() - startTime;
      
      return {
        endpoint,
        method,
        status: 'PASS',
        statusCode: response.status,
        responseTime,
        data: response.data
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      return {
        endpoint,
        method,
        status: 'FAIL',
        statusCode: error.response?.status,
        responseTime,
        error: error.message
      };
    }
  }

  /**
   * 运行所有API测试
   */
  public async runAllTests(): Promise<void> {
    console.log('🚀 开始API CRUD测试...');
    console.log('=' .repeat(60));
    
    // 定义要测试的API端点
    const endpoints = [
      // 健康检查和基础API
      { path: '/api/health', method: 'GET' as const },
      
      // 数据库管理API
      { path: '/api/database/stats', method: 'GET' as const },
      { path: '/api/database/characters', method: 'GET' as const },
      { path: '/api/database/realms', method: 'GET' as const },
      { path: '/api/database/skills', method: 'GET' as const },
      { path: '/api/database/weapons', method: 'GET' as const },
      { path: '/api/database/items', method: 'GET' as const },
      
      // 掌门和宗门API
      { path: '/api/leader/info', method: 'GET' as const },
      { path: '/api/zongmen/info', method: 'GET' as const },
      { path: '/api/mappings/all', method: 'GET' as const },
      
      // 兼容旧接口 (POST)
      { path: '/api/get-person-info', method: 'POST' as const, data: {} },
      { path: '/api/get-zongmen-info', method: 'POST' as const, data: {} },
      { path: '/api/get-mappings', method: 'POST' as const, data: {} },
    ];
    
    // 执行测试
    for (const endpoint of endpoints) {
      console.log(`\n🔍 测试: ${endpoint.method} ${endpoint.path}`);
      
      const result = await this.testEndpoint(
        endpoint.path, 
        endpoint.method, 
        endpoint.data
      );
      
      this.results.push(result);
      
      // 输出测试结果
      if (result.status === 'PASS') {
        console.log(`   ✅ 通过 - 状态码: ${result.statusCode}, 响应时间: ${result.responseTime}ms`);
        if (result.data && typeof result.data === 'object') {
          console.log(`   📦 响应数据: ${JSON.stringify(result.data).substring(0, 100)}...`);
        }
      } else {
        console.log(`   ❌ 失败 - 状态码: ${result.statusCode || 'N/A'}, 错误: ${result.error}`);
      }
    }
    
    // 输出测试汇总
    this.printSummary();
  }

  /**
   * 打印测试汇总
   */
  private printSummary(): void {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 测试结果汇总');
    console.log('=' .repeat(60));
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'PASS').length;
    const failedTests = totalTests - passedTests;
    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0.00';
    
    console.log(`总测试数: ${totalTests}`);
    console.log(`通过: ${passedTests}`);
    console.log(`失败: ${failedTests}`);
    console.log(`成功率: ${successRate}%`);
    
    // 按状态分组显示结果
    const passedResults = this.results.filter(r => r.status === 'PASS');
    const failedResults = this.results.filter(r => r.status === 'FAIL');
    
    if (passedResults.length > 0) {
      console.log('\n✅ 通过的测试:');
      passedResults.forEach(result => {
        console.log(`   ${result.method} ${result.endpoint} (${result.responseTime}ms)`);
      });
    }
    
    if (failedResults.length > 0) {
      console.log('\n❌ 失败的测试:');
      failedResults.forEach(result => {
        console.log(`   ${result.method} ${result.endpoint} - ${result.error}`);
      });
    }
    
    console.log('\n🎉 API CRUD测试完成!');
  }
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  try {
    const tester = new SimpleApiTest();
    await tester.runAllTests();
  } catch (error) {
    console.error('❌ 测试运行失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as runSimpleApiTest };