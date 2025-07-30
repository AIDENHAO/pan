#!/usr/bin/env node
/**
 * 数据库测试脚本
 * 用于验证数据库功能是否正常工作
 */
declare class DatabaseTest {
    /**
     * 运行基础测试
     */
    static runBasicTest(): Promise<void>;
    /**
     * 运行完整功能测试
     */
    static runFullTest(): Promise<void>;
    /**
     * 清理测试数据
     */
    static cleanup(): Promise<void>;
}
export { DatabaseTest };
//# sourceMappingURL=test.d.ts.map