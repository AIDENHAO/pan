#!/usr/bin/env node
/**
 * CharacterDALs 测试运行器
 * 执行所有角色相关DAL的测试
 */
import { CharacterDALsTester } from './characterDALs-test.js';
/**
 * 运行CharacterDALs测试
 */
async function runTests() {
    console.log('CharacterDALs 功能测试');
    console.log('='.repeat(50));
    console.log('测试目标: 验证所有角色相关数据访问层功能');
    console.log('测试范围: 角色信息、属性、技能、物品、静态数据等');
    console.log('='.repeat(50));
    console.log('');
    const tester = new CharacterDALsTester();
    try {
        await tester.runAllTests();
    }
    catch (error) {
        console.error('\n❌ 测试执行过程中发生错误:', error);
        process.exit(1);
    }
}
// 执行测试
runTests();
//# sourceMappingURL=run-characterDALs-test.js.map