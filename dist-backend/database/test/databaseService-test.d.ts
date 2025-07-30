/**
 * DatabaseService.ts 测试文件
 * 测试高级业务逻辑操作
 */
/**
 * DatabaseService 测试类
 */
export declare class DatabaseServiceTester {
    private databaseService;
    private testResults;
    private testCharacterIds;
    constructor();
    /**
     * 运行单个测试
     */
    private runTest;
    /**
     * 测试数据库初始化
     */
    private testDatabaseInitialization;
    /**
     * 测试创建完整人物
     */
    private testCreateCompleteCharacter;
    /**
     * 测试获取完整人物信息
     */
    private testGetCompleteCharacterInfo;
    /**
     * 测试分页获取人物列表
     */
    private testGetCharacterList;
    /**
     * 测试搜索人物功能
     */
    private testSearchCharacters;
    /**
     * 测试更新修炼值
     */
    private testUpdateCultivation;
    /**
     * 测试添加物品到背包
     */
    private testAddItemToCharacter;
    /**
     * 测试获取数据库统计信息
     */
    private testGetStatistics;
    /**
     * 测试人物突破功能
     */
    private testBreakthrough;
    /**
     * 测试删除人物
     */
    private testDeleteCharacter;
    /**
     * 清理测试数据
     */
    private cleanupTestData;
    /**
     * 运行所有测试
     */
    runAllTests(): Promise<void>;
    /**
     * 打印测试结果汇总
     */
    private printTestSummary;
}
//# sourceMappingURL=databaseService-test.d.ts.map