/**
 * 运行角色亲和度CRUD测试脚本
 */

import { runCharacterAffinitiesTest } from './character-affinities-test.js';

/**
 * 主函数
 */
async function main(): Promise<void> {
  console.log('开始运行角色亲和度CRUD测试...');
  
  try {
    await runCharacterAffinitiesTest();
    console.log('测试完成！');
  } catch (error) {
    console.error('测试运行失败:', error);
    process.exit(1);
  }
}

// 运行测试
main();