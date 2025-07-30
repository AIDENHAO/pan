import { IBaseDAL, ICharacterDAL, IStaticDataDAL, QueryOptions, PaginatedResult } from '../interfaces/dal.js';
/**
 * 基础数据访问层实现
 */
export declare abstract class BaseDAL<T, K = string> implements IBaseDAL<T, K> {
    protected tableName: string;
    protected primaryKey: string;
    constructor(tableName: string, primaryKey?: string);
    /**
     * 构建WHERE子句
     */
    protected buildWhereClause(conditions: Partial<T>): {
        sql: string;
        params: any[];
    };
    /**
     * 构建ORDER BY子句
     */
    protected buildOrderClause(options?: QueryOptions): string;
    /**
     * 构建LIMIT子句
     */
    protected buildLimitClause(options?: QueryOptions): string;
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
    createMany(dataArray: Omit<T, 'id' | 'create_time' | 'update_time'>[]): Promise<T[]>;
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
 * 人物相关数据访问层基类
 */
export declare abstract class CharacterDAL<T> extends BaseDAL<T> implements ICharacterDAL<T> {
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
 * 静态数据访问层基类（只读）
 */
export declare abstract class StaticDataDAL<T, K = string> implements IStaticDataDAL<T, K> {
    protected tableName: string;
    protected primaryKey: string;
    constructor(tableName: string, primaryKey?: string);
    /**
     * 构建WHERE子句
     */
    protected buildWhereClause(conditions: Partial<T>): {
        sql: string;
        params: any[];
    };
    /**
     * 构建ORDER BY子句
     */
    protected buildOrderClause(options?: QueryOptions): string;
    /**
     * 构建LIMIT子句
     */
    protected buildLimitClause(options?: QueryOptions): string;
    findById(id: K): Promise<T | null>;
    findAll(options?: QueryOptions): Promise<T[]>;
    findPaginated(page: number, pageSize: number, options?: QueryOptions): Promise<PaginatedResult<T>>;
    findWhere(conditions: Partial<T>, options?: QueryOptions): Promise<T[]>;
    findOneWhere(conditions: Partial<T>): Promise<T | null>;
    count(conditions?: Partial<T>): Promise<number>;
    exists(conditions: Partial<T>): Promise<boolean>;
}
//# sourceMappingURL=BaseDAL.d.ts.map