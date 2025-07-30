/**
 * DALFactory.ts 测试运行脚本
 */
import { DALFactoryTester } from './dalFactory-test.js';
/**
 * 主函数 - 运行DALFactory测试
 */
async function main() {
    const tester = new DALFactoryTester();
    await tester.runAllTests();
}
// 运行测试
main().catch(console.error);
//# sourceMappingURL=run-dalFactory-test.js.map