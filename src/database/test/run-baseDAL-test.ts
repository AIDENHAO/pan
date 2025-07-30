#!/usr/bin/env node
/**
 * BaseDAL 测试运行器
 * 简化的测试执行脚本
 */

import { BaseDALTester } from './baseDAL-manual-test.js';

/**
 * 运行BaseDAL测试
 */
async function runTests(): Promise<void> {
  console.log('BaseDAL 手动验证测试');
  console.log('='.repeat(50));
  console.log('测试目标: 验证BaseDAL基础数据访问层功能');
  console.log('测试范围: CRUD操作、分页、统计、SQL注入防护等');
  console.log('='.repeat(50));
  console.log('');

  const tester = new BaseDALTester();
  
  try {
    await tester.runAllTests();
  } catch (error) {
    console.error('\n❌ 测试执行过程中发生错误:', error);
    process.exit(1);
  }
}

// 执行测试
runTests();