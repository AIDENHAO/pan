#!/usr/bin/env node
import { DatabaseUsageExample } from './examples/usage.js';
import { databaseService } from './index.js';
/**
 * 数据库测试脚本
 * 用于验证数据库功能是否正常工作
 */
class DatabaseTest {
    /**
     * 运行基础测试
     */
    static async runBasicTest() {
        console.log('🚀 开始数据库基础测试...');
        try {
            // 1. 测试数据库初始化
            console.log('\n📊 测试数据库初始化...');
            await databaseService.initialize();
            console.log('✅ 数据库初始化成功');
            // 2. 测试统计信息
            console.log('\n📈 获取数据库统计信息...');
            const stats = await databaseService.getStatistics();
            console.log('📊 数据库统计:', stats);
            // 3. 测试人物列表（应该为空）
            console.log('\n👥 测试人物列表查询...');
            const characterList = await databaseService.getCharacterList(1, 5);
            console.log(`📋 当前人物数量: ${characterList.total}`);
            console.log('\n✅ 基础测试完成！');
        }
        catch (error) {
            console.error('❌ 基础测试失败:', error);
            throw error;
        }
    }
    /**
     * 运行完整功能测试
     */
    static async runFullTest() {
        console.log('🎮 开始完整功能测试...');
        try {
            await DatabaseUsageExample.fullExample();
            console.log('\n🎉 完整功能测试成功！');
        }
        catch (error) {
            console.error('❌ 完整功能测试失败:', error);
            throw error;
        }
    }
    /**
     * 清理测试数据
     */
    static async cleanup() {
        try {
            console.log('\n🧹 清理测试数据...');
            await databaseService.reset();
            console.log('✅ 测试数据清理完成');
        }
        catch (error) {
            console.error('❌ 清理失败:', error);
        }
        finally {
            await databaseService.close();
            console.log('🔒 数据库连接已关闭');
        }
    }
}
/**
 * 主函数
 */
async function main() {
    const args = process.argv.slice(2);
    const testType = args[0] || 'basic';
    console.log('🎯 MySQL数据库测试工具');
    console.log('='.repeat(50));
    try {
        switch (testType) {
            case 'basic':
                await DatabaseTest.runBasicTest();
                break;
            case 'full':
                await DatabaseTest.runFullTest();
                break;
            case 'cleanup':
                await DatabaseTest.cleanup();
                return; // cleanup已经关闭了连接
            default:
                console.log('❓ 未知的测试类型:', testType);
                console.log('💡 可用的测试类型:');
                console.log('   - basic: 基础功能测试');
                console.log('   - full: 完整功能测试');
                console.log('   - cleanup: 清理测试数据');
                break;
        }
    }
    catch (error) {
        console.error('\n💥 测试执行失败:', error);
        process.exit(1);
    }
    finally {
        // 确保连接被关闭
        try {
            await databaseService.close();
        }
        catch (error) {
            // 忽略关闭错误
        }
    }
    console.log('\n🏁 测试完成！');
}
// 如果直接运行此文件，执行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((error) => {
        console.error('💥 程序异常退出:', error);
        process.exit(1);
    });
}
export { DatabaseTest };
//# sourceMappingURL=test.js.map