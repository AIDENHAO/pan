import type { QueryOptions, PaginatedResult } from './types.js';
export type { QueryOptions, PaginatedResult };
/**
 * 基础数据访问层接口
 */
export interface IBaseDAL<T, K = string> {
    /**
     * 根据ID查找单个记录
     */
    findById(id: K): Promise<T | null>;
    /**
     * 查找所有记录
     */
    findAll(options?: QueryOptions): Promise<T[]>;
    /**
     * 分页查询
     */
    findPaginated(page: number, pageSize: number, options?: QueryOptions): Promise<PaginatedResult<T>>;
    /**
     * 根据条件查找记录
     */
    findWhere(conditions: Partial<T>, options?: QueryOptions): Promise<T[]>;
    /**
     * 根据条件查找单个记录
     */
    findOneWhere(conditions: Partial<T>): Promise<T | null>;
    /**
     * 创建新记录
     */
    create(data: Omit<T, 'id' | 'create_time' | 'update_time'>): Promise<T>;
    /**
     * 更新记录
     */
    update(id: K, data: Partial<T>): Promise<T | null>;
    /**
     * 删除记录
     */
    delete(id: K): Promise<boolean>;
    /**
     * 批量创建
     */
    createMany(data: Omit<T, 'id' | 'create_time' | 'update_time'>[]): Promise<T[]>;
    /**
     * 批量更新
     */
    updateMany(conditions: Partial<T>, data: Partial<T>): Promise<number>;
    /**
     * 批量删除
     */
    deleteMany(conditions: Partial<T>): Promise<number>;
    /**
     * 统计记录数量
     */
    count(conditions?: Partial<T>): Promise<number>;
    /**
     * 检查记录是否存在
     */
    exists(conditions: Partial<T>): Promise<boolean>;
}
/**
 * 人物相关数据访问层接口
 */
export interface ICharacterDAL<T> extends IBaseDAL<T> {
    /**
     * 根据人物ID查找相关数据
     */
    findByCharacterId(characterId: string): Promise<T | null>;
    /**
     * 根据人物ID删除相关数据
     */
    deleteByCharacterId(characterId: string): Promise<boolean>;
}
/**
 * 静态数据访问层接口（只读）
 */
export interface IStaticDataDAL<T, K = string> {
    /**
     * 根据ID查找单个记录
     */
    findById(id: K): Promise<T | null>;
    /**
     * 查找所有记录
     */
    findAll(options?: QueryOptions): Promise<T[]>;
    /**
     * 分页查询
     */
    findPaginated(page: number, pageSize: number, options?: QueryOptions): Promise<PaginatedResult<T>>;
    /**
     * 根据条件查找记录
     */
    findWhere(conditions: Partial<T>, options?: QueryOptions): Promise<T[]>;
    /**
     * 根据条件查找单个记录
     */
    findOneWhere(conditions: Partial<T>): Promise<T | null>;
    /**
     * 统计记录数量
     */
    count(conditions?: Partial<T>): Promise<number>;
    /**
     * 检查记录是否存在
     */
    exists(conditions: Partial<T>): Promise<boolean>;
}
/**
 * 事务接口
 */
export interface ITransaction {
    /**
     * 开始事务
     */
    begin(): Promise<void>;
    /**
     * 提交事务
     */
    commit(): Promise<void>;
    /**
     * 回滚事务
     */
    rollback(): Promise<void>;
    /**
     * 在事务中执行操作
     */
    execute<T>(operation: () => Promise<T>): Promise<T>;
}
/**
 * 数据访问层工厂接口
 */
export interface IDALFactory {
    /**
     * 获取人物基础信息DAL
     */
    getCharacterBaseInfoDAL(): IBaseDAL<any>;
    /**
     * 获取人物亲和度DAL
     */
    getCharacterAffinitiesDAL(): ICharacterDAL<any>;
    /**
     * 获取人物强度DAL
     */
    getCharacterStrengthDAL(): ICharacterDAL<any>;
    /**
     * 获取人物体质DAL
     */
    getCharacterBodyTypesDAL(): ICharacterDAL<any>;
    /**
     * 获取人物技能DAL
     */
    getCharacterSkillsDAL(): ICharacterDAL<any>;
    /**
     * 获取人物武器DAL
     */
    getCharacterWeaponsDAL(): ICharacterDAL<any>;
    /**
     * 获取人物货币DAL
     */
    getCharacterCurrencyDAL(): ICharacterDAL<any>;
    /**
     * 获取人物物品数据访问层
     */
    getCharacterItemsDAL(): IBaseDAL<any, string>;
    /**
     * 获取境界数据DAL
     */
    getRealmDataDAL(): IStaticDataDAL<any, number>;
    /**
     * 获取体质数据DAL
     */
    getBodyTypeDataDAL(): IStaticDataDAL<any>;
    /**
     * 获取技能数据DAL
     */
    getSkillDataDAL(): IStaticDataDAL<any>;
    /**
     * 获取武器数据DAL
     */
    getWeaponDataDAL(): IStaticDataDAL<any>;
    /**
     * 获取宗门数据DAL
     */
    getZongmenDataDAL(): IStaticDataDAL<any>;
    /**
     * 获取成就数据DAL
     */
    getAchievementDataDAL(): IStaticDataDAL<any>;
    /**
     * 获取物品数据DAL
     */
    getItemDataDAL(): IStaticDataDAL<any>;
    /**
     * 获取物品类型分类DAL
     */
    getItemTypeCategoryDAL(): IStaticDataDAL<any, number>;
    /**
     * 获取物品类型关系DAL
     */
    getItemTypeRelationsDAL(): IBaseDAL<any>;
    /**
     * 创建事务
     */
    createTransaction(): ITransaction;
}
//# sourceMappingURL=dal.d.ts.map