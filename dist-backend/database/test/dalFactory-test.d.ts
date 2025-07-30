/**
 * DALFactory.ts 测试套件
 * 测试工厂模式实现、事务管理和DAL实例缓存功能
 */
/**
 * DALFactory 测试器
 */
declare class DALFactoryTester {
    private results;
    private factory;
    constructor();
    /**
     * 运行单个测试
     */
    private runTest;
    /**
     * 测试单例模式
     */
    private testSingletonPattern;
    /**
     * 测试角色相关DAL创建
     */
    private testCharacterDALCreation;
    /**
     * 测试静态数据DAL创建
     */
    private testStaticDataDALCreation;
    /**
     * 测试缓存清理功能
     */
    private testCacheClear;
    /**
     * 测试事务创建
     */
    private testTransactionCreation;
    /**
     * 测试事务基本操作
     */
    private testTransactionBasicOperations;
    /**
     * 测试事务回滚操作
     */
    private testTransactionRollback;
    /**
     * 测试事务执行方法
     */
    private testTransactionExecute;
    /**
     * 测试事务错误处理
     */
    private testTransactionErrorHandling;
    /**
     * 测试DAL实例功能性
     */
    private testDALInstanceFunctionality;
    /**
     * 运行所有测试
     */
    runAllTests(): Promise<void>;
    /**
     * 打印测试结果
     */
    private printTestResults;
}
export { DALFactoryTester };
//# sourceMappingURL=dalFactory-test.d.ts.map