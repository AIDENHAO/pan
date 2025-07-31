#!/usr/bin/env ts-node
/**
 * 角色CRUD测试脚本
 * 测试角色的创建、读取、更新、删除操作
 * 
 * @author AI Assistant
 * @date 2025-07-31
 */

import axios from 'axios';

// 测试配置
const API_BASE_URL = 'http://localhost:3015';
const TEST_TIMEOUT = 5000;

/**
 * 角色数据接口
 */
interface CharacterData {
  character_uuid?: string;
  character_name: string;
  character_gender: '男' | '女' | '其他';
  character_birthday?: string;
  character_dao_hao?: string;
  character_realm_Level: number;
  cultivatingState: '未修练' | '正在修炼' | '闭关中' | '受伤修炼中' | '顿悟中';
  cultivationLimitBase: number;
  cultivationLimitAdd: number;
  cultivationValue: number;
  cultivationOverLimit: boolean;
  cultivationSpeedBase: number;
  cultivationSpeedAdd: number;
  breakThroughEnabled: boolean;
  breakThroughItemsEnabled: boolean;
  breakThroughState: boolean;
  breakThroughFailNumb: number;
  character_physicalAttributes?: '金' | '木' | '水' | '火' | '土';
  zongMenJoinBool: boolean;
  zongMen_id?: string;
  zongMenJoinDate?: string;
  title_1_id?: '外门弟子' | '内门弟子' | '核心弟子' | '长老' | '掌门';
  title_2_id?: '初入宗门' | '略有小成' | '宗门栋梁' | '宗门支柱' | '宗门传奇';
  title_3_id?: string;
  title_4_id?: string;
  title_5_id?: string;
  create_time?: string;
  update_time?: string;
}

/**
 * 测试结果接口
 */
interface TestResult {
  operation: string;
  status: 'PASS' | 'FAIL';
  duration: number;
  error?: string;
  data?: any;
}

/**
 * 角色CRUD测试类
 */
class CharacterCrudTest {
  private results: TestResult[] = [];
  private testCharacterUuid: string | null = null;

  /**
   * 执行测试操作
   */
  private async runTest(operation: string, testFn: () => Promise<any>): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log(`\n🔍 测试: ${operation}`);
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      this.results.push({
        operation,
        status: 'PASS',
        duration,
        data: result
      });
      
      console.log(`   ✅ 通过 - 耗时: ${duration}ms`);
      
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      this.results.push({
        operation,
        status: 'FAIL',
        duration,
        error: error.message
      });
      
      console.log(`   ❌ 失败 - 错误: ${error.message}`);
    }
  }

  /**
   * 测试获取所有角色
   */
  private async testGetAllCharacters(): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/api/database/characters`, { timeout: TEST_TIMEOUT });
    
    if (response.status !== 200) {
      throw new Error(`获取角色列表失败，状态码: ${response.status}`);
    }
    
    console.log(`   📦 获取到 ${response.data?.length || 0} 个角色`);
    return response.data;
  }

  /**
   * 测试创建角色
   */
  private async testCreateCharacter(): Promise<any> {
    const testCharacterData: CharacterData = {
      character_name: `测试角色_${Date.now()}`,
      character_gender: '男' as const,
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
      character_physicalAttributes: '金' as const,
      zongMenJoinBool: false
    };
    
    // 尝试不同的API端点
    const endpoints = [
      '/api/v2/character/base-info',
      '/api/database/characters',
      '/api/characters'
    ];
    
    let lastError;
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, testCharacterData, { timeout: TEST_TIMEOUT });
        
        if (response.status === 200 || response.status === 201) {
          this.testCharacterUuid = response.data?.character_uuid || response.data?.data?.character_uuid;
          console.log(`   📦 角色创建成功，UUID: ${this.testCharacterUuid}`);
          return response.data;
        }
      } catch (error: any) {
        lastError = error;
        console.log(`   ⚠️  端点 ${endpoint} 失败: ${error.message}`);
      }
    }
    
    throw lastError || new Error('所有创建端点都失败');
  }

  /**
   * 测试获取单个角色
   */
  private async testGetCharacterById(): Promise<any> {
    if (!this.testCharacterUuid) {
      throw new Error('没有可用的角色UUID进行测试');
    }
    
    const endpoints = [
      `/api/v2/character/base-info/${this.testCharacterUuid}`,
      `/api/database/characters/${this.testCharacterUuid}`,
      `/api/characters/${this.testCharacterUuid}`
    ];
    
    let lastError;
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, { timeout: TEST_TIMEOUT });
        
        if (response.status === 200) {
          console.log(`   📦 获取角色成功: ${response.data?.character_name || '未知'}`);
          return response.data;
        }
      } catch (error: any) {
        lastError = error;
        console.log(`   ⚠️  端点 ${endpoint} 失败: ${error.message}`);
      }
    }
    
    throw lastError || new Error('所有获取端点都失败');
  }

  /**
   * 测试更新角色
   */
  private async testUpdateCharacter(): Promise<any> {
    if (!this.testCharacterUuid) {
      throw new Error('没有可用的角色UUID进行测试');
    }
    
    const updateData = {
      character_name: `更新角色_${Date.now()}`,
      cultivationValue: 500,
      cultivationSpeedAdd: 5
    };
    
    const endpoints = [
      `/api/v2/character/base-info/${this.testCharacterUuid}`,
      `/api/database/characters/${this.testCharacterUuid}`,
      `/api/characters/${this.testCharacterUuid}`
    ];
    
    let lastError;
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.put(`${API_BASE_URL}${endpoint}`, updateData, { timeout: TEST_TIMEOUT });
        
        if (response.status === 200) {
          console.log(`   📦 角色更新成功`);
          return response.data;
        }
      } catch (error: any) {
        lastError = error;
        console.log(`   ⚠️  端点 ${endpoint} 失败: ${error.message}`);
      }
    }
    
    throw lastError || new Error('所有更新端点都失败');
  }

  /**
   * 测试删除角色
   */
  private async testDeleteCharacter(): Promise<any> {
    if (!this.testCharacterUuid) {
      throw new Error('没有可用的角色UUID进行测试');
    }
    
    const endpoints = [
      `/api/v2/character/base-info/${this.testCharacterUuid}`,
      `/api/database/characters/${this.testCharacterUuid}`,
      `/api/characters/${this.testCharacterUuid}`
    ];
    
    let lastError;
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.delete(`${API_BASE_URL}${endpoint}`, { timeout: TEST_TIMEOUT });
        
        if (response.status === 200 || response.status === 204) {
          console.log(`   📦 角色删除成功`);
          return response.data;
        }
      } catch (error: any) {
        lastError = error;
        console.log(`   ⚠️  端点 ${endpoint} 失败: ${error.message}`);
      }
    }
    
    throw lastError || new Error('所有删除端点都失败');
  }

  /**
   * 运行所有CRUD测试
   */
  public async runAllTests(): Promise<void> {
    console.log('🚀 开始角色CRUD测试...');
    console.log('=' .repeat(60));
    
    // 1. 测试读取操作 (Read)
    await this.runTest('获取所有角色', () => this.testGetAllCharacters());
    
    // 2. 测试创建操作 (Create)
    await this.runTest('创建角色', () => this.testCreateCharacter());
    
    // 3. 测试读取单个角色 (Read)
    await this.runTest('获取单个角色', () => this.testGetCharacterById());
    
    // 4. 测试更新操作 (Update)
    await this.runTest('更新角色', () => this.testUpdateCharacter());
    
    // 5. 测试删除操作 (Delete)
    await this.runTest('删除角色', () => this.testDeleteCharacter());
    
    // 输出测试汇总
    this.printSummary();
  }

  /**
   * 打印测试汇总
   */
  private printSummary(): void {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 角色CRUD测试结果汇总');
    console.log('=' .repeat(60));
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'PASS').length;
    const failedTests = totalTests - passedTests;
    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0.00';
    
    console.log(`总测试数: ${totalTests}`);
    console.log(`通过: ${passedTests}`);
    console.log(`失败: ${failedTests}`);
    console.log(`成功率: ${successRate}%`);
    
    // 显示详细结果
    console.log('\n📋 详细结果:');
    this.results.forEach((result, index) => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${result.operation} (${result.duration}ms)`);
      if (result.error) {
        console.log(`   错误: ${result.error}`);
      }
    });
    
    console.log('\n🎉 角色CRUD测试完成!');
  }
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  try {
    const tester = new CharacterCrudTest();
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

export { main as runCharacterCrudTest };