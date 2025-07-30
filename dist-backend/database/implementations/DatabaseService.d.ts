import { CharacterBaseInfo, CharacterAffinities, CharacterStrength, CharacterBodyTypes, CharacterSkills, CharacterWeapons, CharacterCurrency, CharacterItems, QueryOptions, PaginatedResult } from '../interfaces/types.js';
/**
 * 完整的人物信息
 */
export interface CompleteCharacterInfo {
    baseInfo: CharacterBaseInfo;
    affinities?: CharacterAffinities;
    strength?: CharacterStrength;
    bodyTypes?: CharacterBodyTypes;
    skills?: CharacterSkills;
    weapons?: CharacterWeapons;
    currency?: CharacterCurrency;
    items?: CharacterItems[];
}
/**
 * 创建人物的数据
 */
export interface CreateCharacterData {
    baseInfo: Omit<CharacterBaseInfo, 'character_uuid' | 'create_time' | 'update_time'>;
    affinities?: Omit<CharacterAffinities, 'character_uuid'>;
    strength?: Omit<CharacterStrength, 'character_uuid'>;
    bodyTypes?: Omit<CharacterBodyTypes, 'character_uuid'>;
    skills?: Omit<CharacterSkills, 'character_uuid'>;
    weapons?: Omit<CharacterWeapons, 'character_uuid'>;
    currency?: Omit<CharacterCurrency, 'character_uuid'>;
}
/**
 * 数据库服务类
 * 提供高级业务逻辑操作
 */
export declare class DatabaseService {
    private static instance;
    private constructor();
    static getInstance(): DatabaseService;
    /**
     * 初始化数据库
     */
    initialize(): Promise<void>;
    /**
     * 重置数据库
     */
    reset(): Promise<void>;
    /**
     * 关闭数据库连接
     */
    close(): Promise<void>;
    /**
     * 创建完整的人物信息
     */
    createCharacter(data: CreateCharacterData): Promise<CompleteCharacterInfo>;
    /**
     * 获取完整的人物信息
     */
    getCompleteCharacterInfo(characterId: string): Promise<CompleteCharacterInfo | null>;
    /**
     * 删除人物及其所有相关数据
     */
    deleteCharacter(characterId: string): Promise<boolean>;
    /**
     * 分页获取人物列表
     */
    getCharacterList(page?: number, pageSize?: number, options?: QueryOptions): Promise<PaginatedResult<CharacterBaseInfo>>;
    /**
     * 搜索人物
     */
    searchCharacters(searchTerm: string, searchType?: 'name' | 'zongmen' | 'realm'): Promise<CharacterBaseInfo[]>;
    /**
     * 更新人物修炼值
     */
    updateCultivation(characterId: string, cultivationValue: number): Promise<boolean>;
    /**
     * 人物突破境界
     */
    breakthrough(characterId: string): Promise<boolean>;
    /**
     * 添加物品到人物背包
     */
    addItemToCharacter(characterId: string, itemId: string, count?: number, level?: number): Promise<CharacterItems>;
    /**
     * 装备物品
     */
    equipItem(characterId: string, itemInstanceId: number, slotPosition: number): Promise<boolean>;
    /**
     * 获取数据库统计信息
     */
    getStatistics(): Promise<{
        characterCount: number;
        realmCount: number;
        skillCount: number;
        weaponCount: number;
        itemCount: number;
    }>;
}
export declare const databaseService: DatabaseService;
//# sourceMappingURL=DatabaseService.d.ts.map