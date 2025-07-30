/**
 * DatabaseService.ts 测试运行脚本
 */
import { DatabaseServiceTester } from './databaseService-test.js';
/**
 * 主函数 - 运行DatabaseService测试
 */
async function main() {
    const tester = new DatabaseServiceTester();
    await tester.runAllTests();
}
// 运行测试
main().catch(console.error);
//# sourceMappingURL=run-databaseService-test.js.map