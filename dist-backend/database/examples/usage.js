import { databaseService } from '../index.js';
/**
 * 数据库使用示例
 */
export class DatabaseUsageExample {
    /**
     * 初始化数据库示例
     */
    static async initializeExample() {
        try {
            console.log('正在初始化数据库...');
            await databaseService.initialize();
            console.log('数据库初始化完成');
        }
        catch (error) {
            console.error('数据库初始化失败:', error);
            throw error;
        }
    }
    /**
     * 创建人物示例
     */
    static async createCharacterExample() {
        const characterData = {
            baseInfo: {
                character_name: '张三',
                character_gender: '男',
                character_realm_Level: 1,
                cultivatingState: '未修练',
                cultivationLimitBase: 1000,
                cultivationLimitAdd: 0,
                cultivationValue: 0,
                cultivationOverLimit: false,
                cultivationSpeedBase: 10,
                cultivationSpeedAdd: 0,
                breakThroughEnabled: false,
                breakThroughItemsEnabled: false,
                breakThroughState: false,
                breakThroughFailNumb: 0,
                character_physicalAttributes: '金',
                zongMenJoinBool: false
            },
            affinities: {
                total_affinity: 100,
                metal_affinity: 20,
                wood_affinity: 15,
                water_affinity: 25,
                fire_affinity: 10,
                earth_affinity: 30
            },
            strength: {
                physical_strength: 100,
                spiritual_strength: 80,
                soul_strength: 60,
                blood_current: 100,
                blood_max: 100,
                blood_recovery_rate: 1,
                blood_temp_add: 0,
                spiritual_current: 80,
                spiritual_max: 80,
                spiritual_recovery_rate: 1,
                spiritual_temp_add: 0,
                mental_current: 60,
                mental_max: 60,
                mental_recovery_rate: 1,
                mental_temp_add: 0,
                combat_power: 240,
                base_combat_power: 240
            },
            bodyTypes: {
                body_type_1_id: '1'
            },
            skills: {
                skill_1_id: '1'
            },
            weapons: {
                weapon_1_id: '1'
            },
            currency: {
                copper_coin: 0,
                silver_coin: 0,
                gold_coin: 500,
                low_spirit_stone: 1000,
                medium_spirit_stone: 0,
                high_spirit_stone: 0,
                zongmen_contribution: 0,
                region_contribution: 0,
                world_contribution: 0,
                special_contribution_1: 0,
                special_contribution_2: 0,
                special_contribution_3: 0
            }
        };
        try {
            console.log('正在创建人物...');
            const character = await databaseService.createCharacter(characterData);
            console.log('人物创建成功:', character.baseInfo.character_name);
            return character;
        }
        catch (error) {
            console.error('创建人物失败:', error);
            throw error;
        }
    }
    /**
     * 查询人物示例
     */
    static async queryCharacterExample(characterId) {
        try {
            console.log('正在查询人物信息...');
            const character = await databaseService.getCompleteCharacterInfo(characterId);
            if (character) {
                console.log('查询成功:', {
                    name: character.baseInfo.character_name,
                    realm: character.baseInfo.character_realm_Level,
                    cultivation: character.baseInfo.cultivationValue,
                    affinities: character.affinities,
                    strength: character.strength
                });
            }
            else {
                console.log('人物不存在');
            }
            return character;
        }
        catch (error) {
            console.error('查询人物失败:', error);
            throw error;
        }
    }
    /**
     * 修炼示例
     */
    static async cultivationExample(characterId) {
        try {
            console.log('开始修炼...');
            // 获取当前修炼值
            const character = await databaseService.getCompleteCharacterInfo(characterId);
            if (!character) {
                throw new Error('人物不存在');
            }
            const currentCultivation = character.baseInfo.cultivationValue;
            const newCultivation = currentCultivation + 100; // 增加100修炼值
            // 更新修炼值
            await databaseService.updateCultivation(characterId, newCultivation);
            console.log(`修炼完成，修炼值从 ${currentCultivation} 提升到 ${newCultivation}`);
            // 检查是否可以突破
            const updatedCharacter = await databaseService.getCompleteCharacterInfo(characterId);
            if (updatedCharacter?.baseInfo.breakThroughEnabled) {
                console.log('可以突破境界！');
                await databaseService.breakthrough(characterId);
                console.log('突破成功！');
            }
        }
        catch (error) {
            console.error('修炼失败:', error);
            throw error;
        }
    }
    /**
     * 物品管理示例
     */
    static async itemManagementExample(characterId) {
        try {
            console.log('开始物品管理示例...');
            // 添加物品到背包
            const item = await databaseService.addItemToCharacter(characterId, 'item_001', 5, 1);
            console.log('添加物品成功:', item);
            // 装备物品
            await databaseService.equipItem(characterId, parseInt(item.character_items_id), 1);
            console.log('装备物品成功');
        }
        catch (error) {
            console.error('物品管理失败:', error);
            throw error;
        }
    }
    /**
     * 搜索示例
     */
    static async searchExample() {
        try {
            console.log('开始搜索示例...');
            // 按名字搜索
            const charactersByName = await databaseService.searchCharacters('张', 'name');
            console.log('按名字搜索结果:', charactersByName.length, '个人物');
            // 按境界搜索
            const charactersByRealm = await databaseService.searchCharacters('1', 'realm');
            console.log('按境界搜索结果:', charactersByRealm.length, '个人物');
            // 分页获取人物列表
            const characterList = await databaseService.getCharacterList(1, 10);
            console.log('人物列表:', {
                total: characterList.total,
                page: characterList.page,
                pageSize: characterList.pageSize,
                characters: characterList.data.length
            });
        }
        catch (error) {
            console.error('搜索失败:', error);
            throw error;
        }
    }
    /**
     * 统计信息示例
     */
    static async statisticsExample() {
        try {
            console.log('获取统计信息...');
            const stats = await databaseService.getStatistics();
            console.log('数据库统计:', stats);
        }
        catch (error) {
            console.error('获取统计信息失败:', error);
            throw error;
        }
    }
    /**
     * 完整的使用流程示例
     */
    static async fullExample() {
        try {
            // 1. 初始化数据库
            await this.initializeExample();
            // 2. 创建人物
            const character = await this.createCharacterExample();
            const characterId = character.baseInfo.character_uuid;
            // 3. 查询人物
            await this.queryCharacterExample(characterId);
            // 4. 修炼
            await this.cultivationExample(characterId);
            // 5. 物品管理
            await this.itemManagementExample(characterId);
            // 6. 搜索
            await this.searchExample();
            // 7. 统计信息
            await this.statisticsExample();
            console.log('所有示例执行完成！');
        }
        catch (error) {
            console.error('示例执行失败:', error);
        }
        finally {
            // 关闭数据库连接
            await databaseService.close();
            console.log('数据库连接已关闭');
        }
    }
}
// 如果直接运行此文件，执行完整示例
if (import.meta.url === `file://${process.argv[1]}`) {
    DatabaseUsageExample.fullExample().catch(console.error);
}
//# sourceMappingURL=usage.js.map