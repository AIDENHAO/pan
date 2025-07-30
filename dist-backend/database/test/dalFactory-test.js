/**
 * DALFactory.ts 测试套件
 * 测试工厂模式实现、事务管理和DAL实例缓存功能
 */
import { dbManager } from '../config/database.js';
import { DALFactory, Transaction, dalFactory } from '../implementations/DALFactory.js';
/**
 * DALFactory 测试器
 */
class DALFactoryTester {
    constructor() {
        this.results = [];
        this.factory = DALFactory.getInstance();
    }
    /**
     * 运行单个测试
     */
    async runTest(testName, testFn) {
        const startTime = Date.now();
        try {
            await testFn();
            const duration = Date.now() - startTime;
            this.results.push({
                testName,
                success: true,
                message: '测试通过',
                duration
            });
            console.log(`✅ ${testName} - 通过 (${duration}ms)`);
        }
        catch (error) {
            const duration = Date.now() - startTime;
            const message = error instanceof Error ? error.message : '未知错误';
            this.results.push({
                testName,
                success: false,
                message,
                duration
            });
            console.log(`❌ ${testName} - 失败: ${message} (${duration}ms)`);
        }
    }
    /**
     * 测试单例模式
     */
    async testSingletonPattern() {
        const factory1 = DALFactory.getInstance();
        const factory2 = DALFactory.getInstance();
        if (factory1 !== factory2) {
            throw new Error('DALFactory不是单例模式');
        }
        if (factory1 !== this.factory) {
            throw new Error('工厂实例不一致');
        }
        // 测试导出的单例实例
        if (dalFactory !== factory1) {
            throw new Error('导出的dalFactory实例不正确');
        }
    }
    /**
     * 测试角色相关DAL创建
     */
    async testCharacterDALCreation() {
        // 测试角色基础信息DAL
        const characterBaseInfoDAL1 = this.factory.getCharacterBaseInfoDAL();
        const characterBaseInfoDAL2 = this.factory.getCharacterBaseInfoDAL();
        if (!characterBaseInfoDAL1) {
            throw new Error('CharacterBaseInfoDAL创建失败');
        }
        if (characterBaseInfoDAL1 !== characterBaseInfoDAL2) {
            throw new Error('CharacterBaseInfoDAL缓存机制失效');
        }
        // 测试角色亲和度DAL
        const characterAffinitiesDAL = this.factory.getCharacterAffinitiesDAL();
        if (!characterAffinitiesDAL) {
            throw new Error('CharacterAffinitiesDAL创建失败');
        }
        // 测试角色实力DAL
        const characterStrengthDAL = this.factory.getCharacterStrengthDAL();
        if (!characterStrengthDAL) {
            throw new Error('CharacterStrengthDAL创建失败');
        }
        // 测试角色体质DAL
        const characterBodyTypesDAL = this.factory.getCharacterBodyTypesDAL();
        if (!characterBodyTypesDAL) {
            throw new Error('CharacterBodyTypesDAL创建失败');
        }
        // 测试角色技能DAL
        const characterSkillsDAL = this.factory.getCharacterSkillsDAL();
        if (!characterSkillsDAL) {
            throw new Error('CharacterSkillsDAL创建失败');
        }
        // 测试角色武器DAL
        const characterWeaponsDAL = this.factory.getCharacterWeaponsDAL();
        if (!characterWeaponsDAL) {
            throw new Error('CharacterWeaponsDAL创建失败');
        }
        // 测试角色货币DAL
        const characterCurrencyDAL = this.factory.getCharacterCurrencyDAL();
        if (!characterCurrencyDAL) {
            throw new Error('CharacterCurrencyDAL创建失败');
        }
        // 测试角色物品DAL
        const characterItemsDAL = this.factory.getCharacterItemsDAL();
        if (!characterItemsDAL) {
            throw new Error('CharacterItemsDAL创建失败');
        }
    }
    /**
     * 测试静态数据DAL创建
     */
    async testStaticDataDALCreation() {
        // 测试境界数据DAL
        const realmDataDAL = this.factory.getRealmDataDAL();
        if (!realmDataDAL) {
            throw new Error('RealmDataDAL创建失败');
        }
        // 测试体质数据DAL
        const bodyTypeDataDAL = this.factory.getBodyTypeDataDAL();
        if (!bodyTypeDataDAL) {
            throw new Error('BodyTypeDataDAL创建失败');
        }
        // 测试技能数据DAL
        const skillDataDAL = this.factory.getSkillDataDAL();
        if (!skillDataDAL) {
            throw new Error('SkillDataDAL创建失败');
        }
        // 测试武器数据DAL
        const weaponDataDAL = this.factory.getWeaponDataDAL();
        if (!weaponDataDAL) {
            throw new Error('WeaponDataDAL创建失败');
        }
        // 测试宗门数据DAL
        const zongmenDataDAL = this.factory.getZongmenDataDAL();
        if (!zongmenDataDAL) {
            throw new Error('ZongmenDataDAL创建失败');
        }
        // 测试成就数据DAL
        const achievementDataDAL = this.factory.getAchievementDataDAL();
        if (!achievementDataDAL) {
            throw new Error('AchievementDataDAL创建失败');
        }
        // 测试物品数据DAL
        const itemDataDAL = this.factory.getItemDataDAL();
        if (!itemDataDAL) {
            throw new Error('ItemDataDAL创建失败');
        }
        // 测试物品分类DAL
        const itemTypeCategoryDAL = this.factory.getItemTypeCategoryDAL();
        if (!itemTypeCategoryDAL) {
            throw new Error('ItemTypeCategoryDAL创建失败');
        }
        // 测试物品分类关系DAL
        const itemTypeRelationsDAL = this.factory.getItemTypeRelationsDAL();
        if (!itemTypeRelationsDAL) {
            throw new Error('ItemTypeRelationsDAL创建失败');
        }
    }
    /**
     * 测试缓存清理功能
     */
    async testCacheClear() {
        // 先创建一些DAL实例
        const dal1 = this.factory.getCharacterBaseInfoDAL();
        const dal2 = this.factory.getSkillDataDAL();
        // 清理缓存
        this.factory.clearCache();
        // 重新获取实例，应该是新的实例
        const newDal1 = this.factory.getCharacterBaseInfoDAL();
        const newDal2 = this.factory.getSkillDataDAL();
        if (dal1 === newDal1) {
            throw new Error('缓存清理失败 - CharacterBaseInfoDAL实例未更新');
        }
        if (dal2 === newDal2) {
            throw new Error('缓存清理失败 - SkillDataDAL实例未更新');
        }
    }
    /**
     * 测试事务创建
     */
    async testTransactionCreation() {
        const transaction = this.factory.createTransaction();
        if (!transaction) {
            throw new Error('事务创建失败');
        }
        if (!(transaction instanceof Transaction)) {
            throw new Error('事务类型不正确');
        }
        // 测试事务初始状态
        if (transaction.isTransactionActive()) {
            throw new Error('新创建的事务不应该是活动状态');
        }
    }
    /**
     * 测试事务基本操作
     */
    async testTransactionBasicOperations() {
        const transaction = new Transaction();
        // 测试初始状态
        if (transaction.isTransactionActive()) {
            throw new Error('新事务不应该是活动状态');
        }
        // 测试开始事务
        await transaction.begin();
        if (!transaction.isTransactionActive()) {
            throw new Error('事务开始后应该是活动状态');
        }
        // 测试提交事务
        await transaction.commit();
        if (transaction.isTransactionActive()) {
            throw new Error('事务提交后不应该是活动状态');
        }
    }
    /**
     * 测试事务回滚操作
     */
    async testTransactionRollback() {
        const transaction = new Transaction();
        // 开始事务
        await transaction.begin();
        if (!transaction.isTransactionActive()) {
            throw new Error('事务开始后应该是活动状态');
        }
        // 回滚事务
        await transaction.rollback();
        if (transaction.isTransactionActive()) {
            throw new Error('事务回滚后不应该是活动状态');
        }
    }
    /**
     * 测试事务执行方法
     */
    async testTransactionExecute() {
        const transaction = new Transaction();
        // 测试成功执行
        const result = await transaction.execute(async () => {
            return 'success';
        });
        if (result !== 'success') {
            throw new Error('事务执行结果不正确');
        }
        if (transaction.isTransactionActive()) {
            throw new Error('事务执行完成后不应该是活动状态');
        }
        // 测试异常处理
        try {
            await transaction.execute(async () => {
                throw new Error('测试异常');
            });
            throw new Error('应该抛出异常');
        }
        catch (error) {
            if (error instanceof Error && error.message !== '测试异常') {
                throw new Error('异常处理不正确');
            }
        }
        if (transaction.isTransactionActive()) {
            throw new Error('异常发生后事务应该被回滚');
        }
    }
    /**
     * 测试事务错误处理
     */
    async testTransactionErrorHandling() {
        const transaction = new Transaction();
        // 测试重复开始事务
        await transaction.begin();
        try {
            await transaction.begin();
            throw new Error('应该抛出重复开始事务的异常');
        }
        catch (error) {
            if (error instanceof Error && !error.message.includes('事务已经开始')) {
                throw new Error('重复开始事务的错误信息不正确');
            }
        }
        await transaction.rollback();
        // 测试在没有活动事务时提交
        try {
            await transaction.commit();
            throw new Error('应该抛出没有活动事务的异常');
        }
        catch (error) {
            if (error instanceof Error && !error.message.includes('没有活动的事务')) {
                throw new Error('没有活动事务时提交的错误信息不正确');
            }
        }
        // 测试在没有活动事务时回滚
        try {
            await transaction.rollback();
            throw new Error('应该抛出没有活动事务的异常');
        }
        catch (error) {
            if (error instanceof Error && !error.message.includes('没有活动的事务')) {
                throw new Error('没有活动事务时回滚的错误信息不正确');
            }
        }
    }
    /**
     * 测试DAL实例功能性
     */
    async testDALInstanceFunctionality() {
        // 测试CharacterBaseInfoDAL的基本功能
        const characterBaseInfoDAL = this.factory.getCharacterBaseInfoDAL();
        const characters = await characterBaseInfoDAL.findAll({ limit: 1 });
        if (!Array.isArray(characters)) {
            throw new Error('CharacterBaseInfoDAL.findAll应该返回数组');
        }
        // 测试RealmDataDAL的基本功能
        const realmDataDAL = this.factory.getRealmDataDAL();
        const realms = await realmDataDAL.findAll({ limit: 1 });
        if (!Array.isArray(realms)) {
            throw new Error('RealmDataDAL.findAll应该返回数组');
        }
        // 测试SkillDataDAL的基本功能
        const skillDataDAL = this.factory.getSkillDataDAL();
        const skills = await skillDataDAL.findAll({ limit: 1 });
        if (!Array.isArray(skills)) {
            throw new Error('SkillDataDAL.findAll应该返回数组');
        }
    }
    /**
     * 运行所有测试
     */
    async runAllTests() {
        console.log('\n==================================================');
        console.log('DALFactory.ts 测试');
        console.log('==================================================');
        console.log('测试目标: 验证工厂模式、事务管理和DAL实例缓存功能');
        console.log('测试范围: 单例模式、DAL创建、缓存机制、事务操作等');
        console.log('==================================================\n');
        console.log('🚀 开始DALFactory测试\n');
        // 确保数据库连接
        try {
            await dbManager.connect();
            console.log('✅ 数据库连接成功\n');
        }
        catch (error) {
            console.error('❌ 数据库连接失败:', error);
            return;
        }
        // 运行所有测试
        await this.runTest('单例模式测试', () => this.testSingletonPattern());
        await this.runTest('角色相关DAL创建测试', () => this.testCharacterDALCreation());
        await this.runTest('静态数据DAL创建测试', () => this.testStaticDataDALCreation());
        await this.runTest('缓存清理功能测试', () => this.testCacheClear());
        await this.runTest('事务创建测试', () => this.testTransactionCreation());
        await this.runTest('事务基本操作测试', () => this.testTransactionBasicOperations());
        await this.runTest('事务回滚测试', () => this.testTransactionRollback());
        await this.runTest('事务执行方法测试', () => this.testTransactionExecute());
        await this.runTest('事务错误处理测试', () => this.testTransactionErrorHandling());
        await this.runTest('DAL实例功能性测试', () => this.testDALInstanceFunctionality());
        this.printTestResults();
        // 关闭数据库连接
        await dbManager.close();
        console.log('数据库连接池已关闭');
    }
    /**
     * 打印测试结果
     */
    printTestResults() {
        const totalTests = this.results.length;
        const passedTests = this.results.filter(r => r.success).length;
        const failedTests = totalTests - passedTests;
        const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
        const successRate = totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : '0.0';
        console.log('\n📊 DALFactory测试结果汇总:');
        console.log('============================================================');
        console.log(`总测试数: ${totalTests}`);
        console.log(`通过: ${passedTests}`);
        console.log(`失败: ${failedTests}`);
        console.log(`总耗时: ${totalDuration}ms`);
        console.log(`成功率: ${successRate}%`);
        if (this.results.length > 0) {
            console.log('\n⏱️  各测试耗时:');
            this.results.forEach(result => {
                const status = result.success ? '✅' : '❌';
                console.log(`  ${status} ${result.testName}: ${result.duration}ms`);
                if (!result.success) {
                    console.log(`     错误: ${result.message}`);
                }
            });
        }
        console.log('\n============================================================');
        if (failedTests === 0) {
            console.log('🎉 所有DALFactory测试通过！工厂模式和事务管理功能正常。');
        }
        else {
            console.log(`⚠️  有 ${failedTests} 个测试失败，请检查相关功能。`);
        }
    }
}
/**
 * 主函数
 */
async function main() {
    const tester = new DALFactoryTester();
    await tester.runAllTests();
}
// 如果直接运行此文件，则执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}
export { DALFactoryTester };
//# sourceMappingURL=dalFactory-test.js.map