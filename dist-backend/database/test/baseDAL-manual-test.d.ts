/**
 * BaseDAL 手动验证测试脚本
 * 测试基础数据访问层的核心功能
 */
/**
 * 测试工具类
 */
declare class BaseDALTester {
    private results;
    private characterBaseInfoDAL;
    private characterAffinitiesDAL;
    private itemDataDAL;
    private testCharacterId;
    constructor();
    /**
     * 执行单个测试
     */
    private runTest;
    /**
     * 测试数据库连接
     */
    private testDatabaseConnection;
    /**
     * 测试BaseDAL的findById方法
     */
    private testFindById;
    /**
     * 测试BaseDAL的findAll方法
     */
    private testFindAll;
    /**
     * 测试BaseDAL的findWhere方法
     */
    private testFindWhere;
    /**
     * 测试BaseDAL的findOneWhere方法
     */
    private testFindOneWhere;
    /**
     * 测试BaseDAL的分页查询
     */
    private testFindPaginated;
    /**
     * 测试BaseDAL的count方法
     */
    private testCount;
    /**
     * 测试BaseDAL的exists方法
     */
    private testExists;
    /**
     * 测试CharacterDAL的特殊方法
     */
    private testCharacterDALMethods;
    /**
     * 测试SQL注入防护
     */
    private testSQLInjectionProtection;
    /**
     * 运行所有测试
     */
    runAllTests(): Promise<void>;
    /**
     * 打印测试结果
     */
    private printTestResults;
}
export { BaseDALTester };
//# sourceMappingURL=baseDAL-manual-test.d.ts.map