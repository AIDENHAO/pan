import { CompleteCharacterInfo } from '../index.js';
/**
 * 数据库使用示例
 */
export declare class DatabaseUsageExample {
    /**
     * 初始化数据库示例
     */
    static initializeExample(): Promise<void>;
    /**
     * 创建人物示例
     */
    static createCharacterExample(): Promise<CompleteCharacterInfo>;
    /**
     * 查询人物示例
     */
    static queryCharacterExample(characterId: string): Promise<CompleteCharacterInfo | null>;
    /**
     * 修炼示例
     */
    static cultivationExample(characterId: string): Promise<void>;
    /**
     * 物品管理示例
     */
    static itemManagementExample(characterId: string): Promise<void>;
    /**
     * 搜索示例
     */
    static searchExample(): Promise<void>;
    /**
     * 统计信息示例
     */
    static statisticsExample(): Promise<void>;
    /**
     * 完整的使用流程示例
     */
    static fullExample(): Promise<void>;
}
//# sourceMappingURL=usage.d.ts.map