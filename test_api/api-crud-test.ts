#!/usr/bin/env ts-node
/**
 * API层CRUD功能测试脚本
 * 测试所有API端点的增删改查操作
 * 
 * 测试范围：
 * 1. 角色管理API (Character API)
 * 2. 静态数据API (Static Data API)
 * 3. 系统管理API (System API)
 * 4. 错误处理和参数验证
 * 
 * @author AI Assistant
 * @date 2024-01-15
 */

import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 测试配置
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const TEST_TIMEOUT = 10000; // 10秒超时

// 测试结果接口
interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
  details?: string;
}

// API响应接口
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

/**
 * API CRUD测试类
 */
class ApiCrudTest {
  private results: TestResult[] = [];
  private testCharacterId: string | null = null;
  private testRealmId: number | null = null;
  private testSkillId: number | null = null;

  /**
   * 运行单个测试
   */
  private async runTest(name: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({
        name,
        passed: true,
        duration,
        details: `测试通过，耗时 ${duration}ms`
      });
      console.log(`✅ ${name} - 通过 (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.results.push({
        name,
        passed: false,
        duration,
        error: errorMessage
      });
      console.log(`❌ ${name} - 失败 (${duration}ms)`);
      console.log(`   错误: ${errorMessage}`);
    }
  }

  /**
   * 测试服务器连接
   */
  private async testServerConnection(): Promise<void> {
    const response = await axios.get(`${API_BASE_URL}/`, { timeout: TEST_TIMEOUT });
    if (response.status !== 200) {
      throw new Error(`服务器连接失败，状态码: ${response.status}`);
    }
    console.log('   服务器连接正常');
  }

  /**
   * 测试角色基础信息API
   */
  private async testCharacterBaseInfoApi(): Promise<void> {
    // 测试获取所有角色
    const getAllResponse = await axios.get(`${API_BASE_URL}/api/v2/character/base-info`, { timeout: TEST_TIMEOUT });
    if (getAllResponse.status !== 200) {
      throw new Error(`获取所有角色失败，状态码: ${getAllResponse.status}`);
    }
    console.log(`   获取到 ${getAllResponse.data.data?.length || 0} 个角色`);

    // 如果有角色，测试获取单个角色
    if (getAllResponse.data.data && getAllResponse.data.data.length > 0) {
      const characterUuid = getAllResponse.data.data[0].character_uuid;
      const getOneResponse = await axios.get(`${API_BASE_URL}/api/v2/character/base-info/${characterUuid}`, { timeout: TEST_TIMEOUT });
      if (getOneResponse.status !== 200) {
        throw new Error(`获取单个角色失败，状态码: ${getOneResponse.status}`);
      }
      console.log(`   成功获取角色: ${getOneResponse.data.data?.character_name || '未知'}`);
    }
  }

  /**
   * 测试角色创建API
   */
  private async testCharacterCreateApi(): Promise<void> {
    const testCharacterData = {
      character_name: `测试角色_${Date.now()}`,
      character_realm_Level: 1,
      character_cultivation_value: 0,
      character_strength: 100,
      character_agility: 100,
      character_intelligence: 100,
      character_constitution: 100,
      character_charisma: 100,
      character_luck: 100
    };

    const response = await axios.post(`${API_BASE_URL}/api/v2/character/base-info`, testCharacterData, { timeout: TEST_TIMEOUT });
    if (response.status !== 201 && response.status !== 200) {
      throw new Error(`创建角色失败，状态码: ${response.status}`);
    }

    const responseData = response.data as ApiResponse;
    if (!responseData.success) {
      throw new Error(`创建角色失败: ${responseData.error?.message || '未知错误'}`);
    }

    this.testCharacterId = responseData.data?.character_uuid;
    console.log(`   成功创建角色: ${testCharacterData.character_name}`);
  }

  /**
   * 测试角色更新API
   */
  private async testCharacterUpdateApi(): Promise<void> {
    if (!this.testCharacterId) {
      throw new Error('没有可用的测试角色ID');
    }

    const updateData = {
      character_cultivation_value: 500,
      character_strength: 150
    };

    const response = await axios.put(`${API_BASE_URL}/api/v2/character/base-info/${this.testCharacterId}`, updateData, { timeout: TEST_TIMEOUT });
    if (response.status !== 200) {
      throw new Error(`更新角色失败，状态码: ${response.status}`);
    }

    const responseData = response.data as ApiResponse;
    if (!responseData.success) {
      throw new Error(`更新角色失败: ${responseData.error?.message || '未知错误'}`);
    }

    console.log('   角色更新成功');
  }

  /**
   * 测试角色删除API
   */
  private async testCharacterDeleteApi(): Promise<void> {
    if (!this.testCharacterId) {
      throw new Error('没有可用的测试角色ID');
    }

    const response = await axios.delete(`${API_BASE_URL}/api/v2/character/base-info/${this.testCharacterId}`, { timeout: TEST_TIMEOUT });
    if (response.status !== 200) {
      throw new Error(`删除角色失败，状态码: ${response.status}`);
    }

    const responseData = response.data as ApiResponse;
    if (!responseData.success) {
      throw new Error(`删除角色失败: ${responseData.error?.message || '未知错误'}`);
    }

    console.log('   角色删除成功');
    this.testCharacterId = null;
  }

  /**
   * 测试境界数据API
   */
  private async testRealmDataApi(): Promise<void> {
    // 测试获取所有境界
    const getAllResponse = await axios.get(`${API_BASE_URL}/api/v2/static-data/realms`, { timeout: TEST_TIMEOUT });
    if (getAllResponse.status !== 200) {
      throw new Error(`获取所有境界失败，状态码: ${getAllResponse.status}`);
    }
    console.log(`   获取到 ${getAllResponse.data.data?.length || 0} 个境界`);

    // 如果有境界，测试获取单个境界
    if (getAllResponse.data.data && getAllResponse.data.data.length > 0) {
      const realmId = getAllResponse.data.data[0].realm_id;
      const getOneResponse = await axios.get(`${API_BASE_URL}/api/v2/static-data/realms/${realmId}`, { timeout: TEST_TIMEOUT });
      if (getOneResponse.status !== 200) {
        throw new Error(`获取单个境界失败，状态码: ${getOneResponse.status}`);
      }
      console.log(`   成功获取境界: ${getOneResponse.data.data?.realm_name || '未知'}`);
    }
  }

  /**
   * 测试技能数据API
   */
  private async testSkillDataApi(): Promise<void> {
    // 测试获取所有技能
    const getAllResponse = await axios.get(`${API_BASE_URL}/api/v2/static-data/skills`, { timeout: TEST_TIMEOUT });
    if (getAllResponse.status !== 200) {
      throw new Error(`获取所有技能失败，状态码: ${getAllResponse.status}`);
    }
    console.log(`   获取到 ${getAllResponse.data.data?.length || 0} 个技能`);

    // 如果有技能，测试获取单个技能
    if (getAllResponse.data.data && getAllResponse.data.data.length > 0) {
      const skillId = getAllResponse.data.data[0].skill_id;
      const getOneResponse = await axios.get(`${API_BASE_URL}/api/v2/static-data/skills/${skillId}`, { timeout: TEST_TIMEOUT });
      if (getOneResponse.status !== 200) {
        throw new Error(`获取单个技能失败，状态码: ${getOneResponse.status}`);
      }
      console.log(`   成功获取技能: ${getOneResponse.data.data?.skill_name || '未知'}`);
    }
  }

  /**
   * 测试武器数据API
   */
  private async testWeaponDataApi(): Promise<void> {
    // 测试获取所有武器
    const getAllResponse = await axios.get(`${API_BASE_URL}/api/v2/static-data/weapons`, { timeout: TEST_TIMEOUT });
    if (getAllResponse.status !== 200) {
      throw new Error(`获取所有武器失败，状态码: ${getAllResponse.status}`);
    }
    console.log(`   获取到 ${getAllResponse.data.data?.length || 0} 个武器`);

    // 如果有武器，测试获取单个武器
    if (getAllResponse.data.data && getAllResponse.data.data.length > 0) {
      const weaponId = getAllResponse.data.data[0].weapon_id;
      const getOneResponse = await axios.get(`${API_BASE_URL}/api/v2/static-data/weapons/${weaponId}`, { timeout: TEST_TIMEOUT });
      if (getOneResponse.status !== 200) {
        throw new Error(`获取单个武器失败，状态码: ${getOneResponse.status}`);
      }
      console.log(`   成功获取武器: ${getOneResponse.data.data?.weapon_name || '未知'}`);
    }
  }

  /**
   * 测试物品数据API
   */
  private async testItemDataApi(): Promise<void> {
    // 测试获取所有物品
    const getAllResponse = await axios.get(`${API_BASE_URL}/api/v2/static-data/items`, { timeout: TEST_TIMEOUT });
    if (getAllResponse.status !== 200) {
      throw new Error(`获取所有物品失败，状态码: ${getAllResponse.status}`);
    }
    console.log(`   获取到 ${getAllResponse.data.data?.length || 0} 个物品`);

    // 如果有物品，测试获取单个物品
    if (getAllResponse.data.data && getAllResponse.data.data.length > 0) {
      const itemId = getAllResponse.data.data[0].item_id;
      const getOneResponse = await axios.get(`${API_BASE_URL}/api/v2/static-data/items/${itemId}`, { timeout: TEST_TIMEOUT });
      if (getOneResponse.status !== 200) {
        throw new Error(`获取单个物品失败，状态码: ${getOneResponse.status}`);
      }
      console.log(`   成功获取物品: ${getOneResponse.data.data?.item_name || '未知'}`);
    }
  }

  /**
   * 测试错误处理
   */
  private async testErrorHandling(): Promise<void> {
    try {
      // 测试不存在的端点
      await axios.get(`${API_BASE_URL}/api/v2/non-existent-endpoint`, { timeout: TEST_TIMEOUT });
      throw new Error('应该返回404错误，但请求成功了');
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.log('   正确处理了404错误');
      } else {
        throw new Error(`期望404错误，但得到: ${error.message}`);
      }
    }

    try {
      // 测试无效的角色ID
      await axios.get(`${API_BASE_URL}/api/v2/character/base-info/invalid-uuid`, { timeout: TEST_TIMEOUT });
      throw new Error('应该返回错误，但请求成功了');
    } catch (error: any) {
      if (error.response && (error.response.status === 400 || error.response.status === 404)) {
        console.log('   正确处理了无效UUID错误');
      } else {
        throw new Error(`期望400或404错误，但得到: ${error.message}`);
      }
    }
  }

  /**
   * 测试参数验证
   */
  private async testParameterValidation(): Promise<void> {
    try {
      // 测试创建角色时缺少必需参数
      await axios.post(`${API_BASE_URL}/api/v2/character/base-info`, {}, { timeout: TEST_TIMEOUT });
      throw new Error('应该返回参数验证错误，但请求成功了');
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        console.log('   正确验证了创建角色的必需参数');
      } else {
        throw new Error(`期望400错误，但得到: ${error.message}`);
      }
    }
  }

  /**
   * 运行所有测试
   */
  public async runAllTests(): Promise<void> {
    console.log('🚀 开始API CRUD测试...');
    console.log(`📡 API服务器: ${API_BASE_URL}`);
    console.log('============================================================');

    // 基础连接测试
    await this.runTest('服务器连接测试', () => this.testServerConnection());

    // 角色管理API测试
    await this.runTest('角色基础信息查询测试', () => this.testCharacterBaseInfoApi());
    await this.runTest('角色创建测试', () => this.testCharacterCreateApi());
    await this.runTest('角色更新测试', () => this.testCharacterUpdateApi());
    await this.runTest('角色删除测试', () => this.testCharacterDeleteApi());

    // 静态数据API测试
    await this.runTest('境界数据查询测试', () => this.testRealmDataApi());
    await this.runTest('技能数据查询测试', () => this.testSkillDataApi());
    await this.runTest('武器数据查询测试', () => this.testWeaponDataApi());
    await this.runTest('物品数据查询测试', () => this.testItemDataApi());

    // 错误处理和参数验证测试
    await this.runTest('错误处理测试', () => this.testErrorHandling());
    await this.runTest('参数验证测试', () => this.testParameterValidation());

    // 输出测试结果
    this.printTestResults();
  }

  /**
   * 打印测试结果
   */
  private printTestResults(): void {
    console.log('\n============================================================');
    console.log('📊 测试结果汇总');
    console.log('============================================================');

    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0.00';
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`总测试数: ${totalTests}`);
    console.log(`通过: ${passedTests}`);
    console.log(`失败: ${failedTests}`);
    console.log(`成功率: ${successRate}%`);
    console.log(`总耗时: ${totalDuration}ms`);

    if (failedTests > 0) {
      console.log('\n❌ 失败的测试:');
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`   ${result.name}: ${result.error}`);
      });
    }

    console.log('\n🎉 API CRUD测试完成!');
  }
}

/**
 * 运行API CRUD测试
 */
export async function runApiCrudTests(): Promise<void> {
  const tester = new ApiCrudTest();
  await tester.runAllTests();
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runApiCrudTests().catch(error => {
    console.error('❌ 测试运行失败:', error);
    process.exit(1);
  });
}