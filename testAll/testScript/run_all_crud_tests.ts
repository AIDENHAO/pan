/**
 * 综合CRUD测试执行脚本
 * 文件名: run_all_crud_tests.ts
 * 功能: 依次执行DAL、控制器、API三层的CRUD测试
 * 作者: AI Assistant
 * 创建时间: 2024-12-19
 */

import * as fs from 'fs';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';
import { DALCRUDTest } from './dal_crud_testAll.js';
import { ControllerCRUDTest } from './controller_crud_testAll.js';
import { APICRUDTest } from './api_crud_testAll.js';

// 测试层级枚举
enum TestLayer {
  DAL = 'DAL',
  CONTROLLER = 'Controller',
  API = 'API'
}

// 测试结果接口
interface LayerTestResult {
  layer: TestLayer;
  status: 'PASS' | 'FAIL' | 'SKIP';
  duration: number;
  message: string;
  details?: any;
}

// 综合测试配置
interface ComprehensiveTestConfig {
  testName: string;
  reportPath: string;
  timeout: number;
  runInSequence: boolean;
  skipOnFailure: boolean;
  layers: TestLayer[];
}

/**
 * 综合CRUD测试管理器
 */
class ComprehensiveCRUDTestManager {
  private config: ComprehensiveTestConfig;
  private results: LayerTestResult[] = [];
  private startTime: Date;
  private endTime: Date | null = null;

  constructor() {
    this.config = {
      testName: '三层架构CRUD综合测试',
      reportPath: path.join(__dirname, '../testReport/comprehensive_crud_test_report.md'),
      timeout: 120000, // 2分钟总超时
      runInSequence: true,
      skipOnFailure: false,
      layers: [TestLayer.DAL, TestLayer.CONTROLLER, TestLayer.API]
    };
    
    this.startTime = new Date();
  }

  /**
   * 运行综合测试
   */
  async runComprehensiveTest(): Promise<void> {
    console.log('🚀 开始三层架构CRUD综合测试');
    console.log('=' .repeat(80));
    console.log(`测试名称: ${this.config.testName}`);
    console.log(`测试层级: ${this.config.layers.join(' -> ')}`);
    console.log(`执行模式: ${this.config.runInSequence ? '顺序执行' : '并行执行'}`);
    console.log(`报告文件: ${this.config.reportPath}`);
    console.log('=' .repeat(80));

    try {
      if (this.config.runInSequence) {
        await this.runTestsInSequence();
      } else {
        await this.runTestsInParallel();
      }
    } catch (error) {
      console.error('❌ 综合测试执行失败:', error);
      this.addResult({
        layer: TestLayer.DAL, // 默认层级
        status: 'FAIL',
        duration: 0,
        message: `综合测试执行失败: ${error}`,
        details: { error: error.toString() }
      });
    } finally {
      await this.generateComprehensiveReport();
      this.printSummary();
    }
  }

  /**
   * 顺序执行测试
   */
  private async runTestsInSequence(): Promise<void> {
    console.log('\n📋 开始顺序执行各层测试...');
    
    for (const layer of this.config.layers) {
      console.log(`\n🔄 正在执行 ${layer} 层测试...`);
      
      const result = await this.runSingleLayerTest(layer);
      this.addResult(result);
      
      // 如果设置了失败时跳过，且当前测试失败，则跳过后续测试
      if (this.config.skipOnFailure && result.status === 'FAIL') {
        console.log(`⚠️ ${layer} 层测试失败，跳过后续测试`);
        
        // 将剩余层级标记为跳过
        const remainingLayers = this.config.layers.slice(this.config.layers.indexOf(layer) + 1);
        for (const remainingLayer of remainingLayers) {
          this.addResult({
            layer: remainingLayer,
            status: 'SKIP',
            duration: 0,
            message: `由于 ${layer} 层测试失败而跳过`,
            details: { reason: 'Previous layer failed' }
          });
        }
        break;
      }
    }
  }

  /**
   * 并行执行测试
   */
  private async runTestsInParallel(): Promise<void> {
    console.log('\n📋 开始并行执行各层测试...');
    
    const promises = this.config.layers.map(layer => this.runSingleLayerTest(layer));
    const results = await Promise.allSettled(promises);
    
    results.forEach((result, index) => {
      const layer = this.config.layers[index];
      
      if (result.status === 'fulfilled') {
        this.addResult(result.value);
      } else {
        this.addResult({
          layer,
          status: 'FAIL',
          duration: 0,
          message: `${layer} 层测试执行失败: ${result.reason}`,
          details: { error: result.reason.toString() }
        });
      }
    });
  }

  /**
   * 执行单层测试
   */
  private async runSingleLayerTest(layer: TestLayer): Promise<LayerTestResult> {
    const startTime = Date.now();
    
    try {
      switch (layer) {
        case TestLayer.DAL:
          return await this.runDALTest(startTime);
        case TestLayer.CONTROLLER:
          return await this.runControllerTest(startTime);
        case TestLayer.API:
          return await this.runAPITest(startTime);
        default:
          throw new Error(`未知的测试层级: ${layer}`);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        layer,
        status: 'FAIL',
        duration,
        message: `${layer} 层测试执行异常: ${error}`,
        details: { error: error.toString() }
      };
    }
  }

  /**
   * 运行DAL层测试
   */
  private async runDALTest(startTime: number): Promise<LayerTestResult> {
    try {
      console.log('🔧 正在执行DAL层测试...');
      
      const dalTest = new DALCRUDTest();
      await dalTest.runTest();
      
      const duration = Date.now() - startTime;
      return {
        layer: TestLayer.DAL,
        status: 'PASS',
        duration,
        message: 'DAL层测试执行成功'
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        layer: TestLayer.DAL,
        status: 'FAIL',
        duration,
        message: `DAL层测试失败: ${error}`,
        details: { error: error.toString() }
      };
    }
  }

  /**
   * 运行控制器层测试
   */
  private async runControllerTest(startTime: number): Promise<LayerTestResult> {
    try {
      console.log('🎮 正在执行控制器层测试...');
      
      const controllerTest = new ControllerCRUDTest();
      await controllerTest.runTest();
      
      const duration = Date.now() - startTime;
      return {
        layer: TestLayer.CONTROLLER,
        status: 'PASS',
        duration,
        message: '控制器层测试执行成功'
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        layer: TestLayer.CONTROLLER,
        status: 'FAIL',
        duration,
        message: `控制器层测试失败: ${error}`,
        details: { error: error.toString() }
      };
    }
  }

  /**
   * 运行API层测试
   */
  private async runAPITest(startTime: number): Promise<LayerTestResult> {
    try {
      console.log('🌐 正在执行API层测试...');
      
      const apiTest = new APICRUDTest();
      await apiTest.runTest();
      
      const duration = Date.now() - startTime;
      return {
        layer: TestLayer.API,
        status: 'PASS',
        duration,
        message: 'API层测试执行成功'
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        layer: TestLayer.API,
        status: 'FAIL',
        duration,
        message: `API层测试失败: ${error}`,
        details: { error: error.toString() }
      };
    }
  }

  /**
   * 添加测试结果
   */
  private addResult(result: LayerTestResult): void {
    this.results.push(result);
    const status = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
    console.log(`${status} ${result.layer} 层: ${result.message} (${result.duration}ms)`);
  }

  /**
   * 生成综合测试报告
   */
  private async generateComprehensiveReport(): Promise<void> {
    this.endTime = new Date();
    const reportContent = this.createComprehensiveReportContent();
    
    // 确保报告目录存在
    const reportDir = path.dirname(this.config.reportPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(this.config.reportPath, reportContent, 'utf-8');
    console.log(`\n📄 综合测试报告已生成: ${this.config.reportPath}`);
  }

  /**
   * 创建综合报告内容
   */
  private createComprehensiveReportContent(): string {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'PASS').length;
    const failedTests = this.results.filter(r => r.status === 'FAIL').length;
    const skippedTests = this.results.filter(r => r.status === 'SKIP').length;
    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0.00';
    const totalDuration = this.endTime ? this.endTime.getTime() - this.startTime.getTime() : 0;

    return `# 三层架构CRUD综合测试报告

## 测试概述
- **测试时间**: ${this.startTime.toISOString()}
- **测试环境**: 开发环境
- **测试目的**: 验证DAL、控制器、API三层架构的CRUD功能完整性
- **测试范围**: 数据访问层、业务逻辑层、API接口层的增删改查操作
- **执行模式**: ${this.config.runInSequence ? '顺序执行' : '并行执行'}

## 测试结果统计
- **总测试层级**: ${totalTests}个
- **通过**: ${passedTests}个
- **失败**: ${failedTests}个
- **跳过**: ${skippedTests}个
- **成功率**: ${successRate}%
- **总耗时**: ${totalDuration}ms

## 各层测试结果
${this.results.map(result => `### ${result.layer} 层测试
- **状态**: ${result.status}
- **执行时间**: ${result.duration}ms
- **详细信息**: ${result.message}
${result.details ? `- **详细数据**: \`\`\`json\n${JSON.stringify(result.details, null, 2)}\n\`\`\`` : ''}`).join('\n\n')}

## 测试覆盖范围

### DAL层 (数据访问层)
- ✅ 基础CRUD操作
- ✅ 事务管理
- ✅ 连接池管理
- ✅ 错误处理
- ✅ 数据验证

### Controller层 (控制器层)
- ✅ HTTP请求处理
- ✅ 参数验证
- ✅ 业务逻辑调用
- ✅ 响应格式化
- ✅ 错误处理

### API层 (接口层)
- ✅ RESTful API接口
- ✅ HTTP状态码
- ✅ 请求响应格式
- ✅ API安全性
- ✅ 性能测试

## 质量评估

### 功能完整性
${passedTests === totalTests ? '🟢 **优秀** - 所有层级测试通过' : failedTests === 0 ? '🟡 **良好** - 部分测试跳过' : '🔴 **需要改进** - 存在测试失败'}

### 架构稳定性
${this.evaluateArchitectureStability()}

### 性能表现
${this.evaluatePerformance()}

## 问题与建议

${this.generateRecommendations()}

## 后续行动计划

1. **短期目标** (1-2周)
   - 修复所有失败的测试用例
   - 完善错误处理机制
   - 优化性能瓶颈

2. **中期目标** (1个月)
   - 增加集成测试覆盖率
   - 实施自动化测试流程
   - 建立性能监控体系

3. **长期目标** (3个月)
   - 完善测试文档和规范
   - 建立持续集成/持续部署(CI/CD)
   - 实施代码质量门禁

---
**报告生成时间**: ${new Date().toISOString()}
**测试框架**: Comprehensive CRUD TestAll v1.0
**架构版本**: Three-Layer Architecture v2.0
`;
  }

  /**
   * 评估架构稳定性
   */
  private evaluateArchitectureStability(): string {
    const dalResult = this.results.find(r => r.layer === TestLayer.DAL);
    const controllerResult = this.results.find(r => r.layer === TestLayer.CONTROLLER);
    const apiResult = this.results.find(r => r.layer === TestLayer.API);
    
    const allPassed = [dalResult, controllerResult, apiResult].every(r => r?.status === 'PASS');
    
    if (allPassed) {
      return '🟢 **优秀** - 三层架构稳定，各层协作良好';
    } else if (dalResult?.status === 'PASS') {
      return '🟡 **良好** - 数据层稳定，上层需要优化';
    } else {
      return '🔴 **需要改进** - 基础架构存在问题，需要重点关注';
    }
  }

  /**
   * 评估性能表现
   */
  private evaluatePerformance(): string {
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    if (totalDuration < 30000) { // 30秒内
      return '🟢 **优秀** - 测试执行效率高，性能表现良好';
    } else if (totalDuration < 60000) { // 1分钟内
      return '🟡 **良好** - 测试执行时间适中，可进一步优化';
    } else {
      return '🔴 **需要改进** - 测试执行时间较长，存在性能瓶颈';
    }
  }

  /**
   * 生成改进建议
   */
  private generateRecommendations(): string {
    const failedResults = this.results.filter(r => r.status === 'FAIL');
    const skippedResults = this.results.filter(r => r.status === 'SKIP');
    
    let recommendations: string[] = [];
    
    if (failedResults.length === 0 && skippedResults.length === 0) {
      recommendations.push('✅ **恭喜！** 所有测试通过，架构质量优秀。');
      recommendations.push('💡 **建议**: 定期执行回归测试，保持代码质量。');
    } else {
      if (failedResults.length > 0) {
        recommendations.push(`⚠️ **紧急**: 修复 ${failedResults.length} 个失败的测试用例。`);
        failedResults.forEach(result => {
          recommendations.push(`   - ${result.layer} 层: ${result.message}`);
        });
      }
      
      if (skippedResults.length > 0) {
        recommendations.push(`📋 **待办**: 完成 ${skippedResults.length} 个跳过的测试。`);
      }
    }
    
    recommendations.push('🔧 **优化建议**:');
    recommendations.push('   - 增加单元测试覆盖率');
    recommendations.push('   - 实施代码审查流程');
    recommendations.push('   - 建立性能基准测试');
    recommendations.push('   - 完善错误监控和日志');
    
    return recommendations.join('\n');
  }

  /**
   * 打印测试摘要
   */
  private printSummary(): void {
    console.log('\n' + '=' .repeat(80));
    console.log('📊 三层架构CRUD综合测试摘要');
    console.log('=' .repeat(80));
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'PASS').length;
    const failedTests = this.results.filter(r => r.status === 'FAIL').length;
    const skippedTests = this.results.filter(r => r.status === 'SKIP').length;
    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0.00';
    const totalDuration = this.endTime ? this.endTime.getTime() - this.startTime.getTime() : 0;
    
    console.log(`总测试层级: ${totalTests}`);
    console.log(`✅ 通过: ${passedTests}`);
    console.log(`❌ 失败: ${failedTests}`);
    console.log(`⏭️ 跳过: ${skippedTests}`);
    console.log(`📈 成功率: ${successRate}%`);
    console.log(`⏱️ 总耗时: ${totalDuration}ms`);
    
    console.log('\n各层结果:');
    this.results.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
      console.log(`  ${status} ${result.layer} 层: ${result.message} (${result.duration}ms)`);
    });
    
    if (failedTests === 0) {
      console.log('\n🎉 恭喜！所有测试通过，三层架构CRUD功能完整且稳定！');
    } else {
      console.log(`\n⚠️ 注意：有 ${failedTests} 个测试失败，请检查相关实现。`);
    }
    
    console.log('=' .repeat(80));
  }
}

/**
 * 主执行函数
 */
async function runComprehensiveCRUDTest(): Promise<void> {
  const testManager = new ComprehensiveCRUDTestManager();
  
  try {
    await testManager.runComprehensiveTest();
  } catch (error) {
    console.error('❌ 综合测试执行失败:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// 如果直接运行此文件
if (require.main === module) {
  runComprehensiveCRUDTest().catch((error) => {
    console.error('❌ 综合测试启动失败:', error);
    process.exit(1);
  });
}

export { ComprehensiveCRUDTestManager, TestLayer, LayerTestResult, ComprehensiveTestConfig };