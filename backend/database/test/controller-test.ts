import { DatabaseController } from '../../controllers/DatabaseController.js';
import { dbManager } from '../config/database.js';
import { Request, Response } from 'express';

/**
 * 控制器测试类
 */
class ControllerTest {
  private controller: DatabaseController;
  private testResults: { name: string; passed: boolean; error?: string; duration: number }[] = [];

  constructor() {
    this.controller = new DatabaseController();
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
   * 创建模拟的Request和Response对象
   */
  private createMockRequestResponse(body: any): { req: Request; res: Response; responseData: any } {
    const responseData: any = { statusCode: 200 }; // 默认状态码
    
    const req = {
      body: body
    } as Request;

    const res = {
      status: (code: number) => {
        responseData.statusCode = code;
        return res;
      },
      json: (data: any) => {
        responseData.data = data;
        return res;
      }
    } as Response;

    return { req, res, responseData };
  }

  /**
   * 测试控制器创建境界数据功能
   */
  private async testControllerCreateRealm(): Promise<void> {
    // 准备测试数据
    const testRealmData = {
      realm_level: 51, // 使用不同的境界等级避免冲突
      stage_division: '控制器测试阶段',
      major_realm: '控制器测试大境界',
      minor_realm: '控制器测试小境界',
      stage: '控制器测试期',
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

    console.log('准备通过控制器创建境界数据:', testRealmData);

    // 创建模拟的请求和响应对象
    const { req, res, responseData } = this.createMockRequestResponse(testRealmData);

    // 调用控制器方法
    await this.controller.createRealmData(req, res);

    console.log('控制器响应:', responseData);

    // 验证响应
    if (responseData.statusCode !== 200) {
      throw new Error(`期望状态码200，实际收到${responseData.statusCode}`);
    }

    if (!responseData.data || responseData.data.status !== 'success') {
      throw new Error('控制器响应表明操作失败');
    }

    if (!responseData.data.data) {
      throw new Error('控制器响应中缺少创建的数据');
    }

    const createdRealm = responseData.data.data;
    if (createdRealm.realm_level !== testRealmData.realm_level) {
      throw new Error(`境界等级不匹配: 期望 ${testRealmData.realm_level}, 实际 ${createdRealm.realm_level}`);
    }

    console.log('✅ 控制器境界数据创建验证通过');
  }

  /**
   * 测试控制器参数验证
   */
  private async testControllerValidation(): Promise<void> {
    // 测试缺少必需参数的情况
    const incompleteData = {
      realm_level: 52,
      // 缺少其他必需字段
    };

    console.log('测试控制器参数验证:', incompleteData);

    const { req, res, responseData } = this.createMockRequestResponse(incompleteData);

    // 调用控制器方法
    await this.controller.createRealmData(req, res);

    console.log('验证测试响应:', responseData);

    // 应该返回错误状态码
    if (responseData.statusCode === 200) {
      throw new Error('期望参数验证失败，但控制器返回了成功状态');
    }

    console.log('✅ 控制器参数验证测试通过');
  }

  /**
   * 清理测试数据
   */
  private async cleanupTestData(): Promise<void> {
    try {
      // 删除测试创建的数据
      const sql = 'DELETE FROM `realm_data` WHERE realm_level IN (51, 52)';
      await dbManager.run(sql, []);
      console.log('✅ 控制器测试数据清理完成');
    } catch (error) {
      console.log('⚠️ 控制器测试数据清理失败:', error);
    }
  }

  /**
   * 打印测试结果
   */
  private printTestResults(): void {
    console.log('\n=== 控制器测试结果 ===');
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
    console.log('开始控制器测试...');
    
    try {
      // 初始化数据库连接
      await dbManager.connect();
      console.log('✅ 数据库连接成功');

      // 运行测试
      await this.runTest('控制器创建境界数据测试', () => this.testControllerCreateRealm());
      await this.runTest('控制器参数验证测试', () => this.testControllerValidation());
      
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
  const test = new ControllerTest();
  test.runAllTests().catch(console.error);
}

export { ControllerTest };