import { dbManager } from '../config/database.js';
import { IBaseDAL, ICharacterDAL, IStaticDataDAL, QueryOptions, PaginatedResult } from '../interfaces/dal.js';

/**
 * 基础数据访问层实现
 */
export abstract class BaseDAL<T, K = string> implements IBaseDAL<T, K> {
  protected tableName: string;
  protected primaryKey: string;

  constructor(tableName: string, primaryKey: string = 'id') {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
  }

  /**
   * 构建WHERE子句
   */
  protected buildWhereClause(conditions: Partial<T>): { sql: string; params: any[] } {
    const keys = Object.keys(conditions).filter(key => conditions[key as keyof T] !== undefined);
    if (keys.length === 0) {
      return { sql: '', params: [] };
    }

    const whereClauses = keys.map(key => `\`${key}\` = ?`);
    const params = keys.map(key => conditions[key as keyof T]);

    return {
      sql: `WHERE ${whereClauses.join(' AND ')}`,
      params
    };
  }

  /**
   * 构建ORDER BY子句
   */
  protected buildOrderClause(options?: QueryOptions): string {
    if (!options?.orderBy) {
      return '';
    }

    const direction = options.orderDirection || 'ASC';
    return `ORDER BY \`${options.orderBy}\` ${direction}`;
  }

  /**
   * 构建LIMIT子句
   */
  protected buildLimitClause(options?: QueryOptions): string {
    if (!options?.limit) {
      return '';
    }

    let limitClause = `LIMIT ${options.limit}`;
    if (options.offset) {
      limitClause += ` OFFSET ${options.offset}`;
    }

    return limitClause;
  }

  /**
   * 根据ID查找单个记录
   */
  async findById(id: K): Promise<T | null> {
    const sql = `SELECT * FROM \`${this.tableName}\` WHERE \`${this.primaryKey}\` = ?`;
    const result = await dbManager.get<T>(sql, [id]);
    return result || null;
  }

  /**
   * 查找所有记录
   */
  async findAll(options?: QueryOptions): Promise<T[]> {
    let sql = `SELECT * FROM \`${this.tableName}\``;
    
    const orderClause = this.buildOrderClause(options);
    const limitClause = this.buildLimitClause(options);
    
    if (orderClause) sql += ` ${orderClause}`;
    if (limitClause) sql += ` ${limitClause}`;

    return await dbManager.all<T>(sql);
  }

  /**
   * 分页查询
   */
  async findPaginated(page: number, pageSize: number, options?: QueryOptions): Promise<PaginatedResult<T>> {
    const offset = (page - 1) * pageSize;
    
    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM \`${this.tableName}\``;
    const countResult = await dbManager.get<{ total: number }>(countSql);
    const total = countResult?.total || 0;
    
    // 查询数据
    let sql = `SELECT * FROM \`${this.tableName}\``;
    const orderClause = this.buildOrderClause(options);
    
    if (orderClause) sql += ` ${orderClause}`;
    sql += ` LIMIT ${pageSize} OFFSET ${offset}`;
    
    const data = await dbManager.all<T>(sql);
    
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  /**
   * 根据条件查找记录
   */
  async findWhere(conditions: Partial<T>, options?: QueryOptions): Promise<T[]> {
    const { sql: whereClause, params } = this.buildWhereClause(conditions);
    
    let sql = `SELECT * FROM \`${this.tableName}\``;
    if (whereClause) sql += ` ${whereClause}`;
    
    const orderClause = this.buildOrderClause(options);
    const limitClause = this.buildLimitClause(options);
    
    if (orderClause) sql += ` ${orderClause}`;
    if (limitClause) sql += ` ${limitClause}`;

    return await dbManager.all<T>(sql, params);
  }

  /**
   * 根据条件查找单个记录
   */
  async findOneWhere(conditions: Partial<T>): Promise<T | null> {
    const { sql: whereClause, params } = this.buildWhereClause(conditions);
    
    let sql = `SELECT * FROM \`${this.tableName}\``;
    if (whereClause) sql += ` ${whereClause}`;
    sql += ' LIMIT 1';

    const result = await dbManager.get<T>(sql, params);
    return result || null;
  }

  /**
   * 创建新记录
   */
  async create(data: Omit<T, 'id' | 'create_time' | 'update_time'>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    const columns = keys.map(key => `\`${key}\``).join(', ');

    const sql = `INSERT INTO \`${this.tableName}\` (${columns}) VALUES (${placeholders})`;
    const result = await dbManager.run(sql, values);

    // 检查插入是否成功
    if ((result as any).affectedRows > 0) {
      // 对于自增主键，使用insertId
      const insertId = (result as any).insertId;
      if (insertId) {
        return await this.findById(insertId as K) as T;
      }
      
      // 对于非自增主键，使用传入数据中的主键值
      const primaryKeyValue = (data as any)[this.primaryKey];
      if (primaryKeyValue) {
        return await this.findById(primaryKeyValue as K) as T;
      }
    }
    
    throw new Error('创建记录失败');
  }

  /**
   * 更新记录
   */
  async update(id: K, data: Partial<T>): Promise<T | null> {
    const keys = Object.keys(data).filter(key => key !== this.primaryKey);
    const values = keys.map(key => data[key as keyof T]);
    const setClause = keys.map(key => `\`${key}\` = ?`).join(', ');

    if (keys.length === 0) {
      return await this.findById(id);
    }

    const sql = `UPDATE \`${this.tableName}\` SET ${setClause} WHERE \`${this.primaryKey}\` = ?`;
    await dbManager.run(sql, [...values, id]);

    return await this.findById(id);
  }

  /**
   * 删除记录
   */
  async delete(id: K): Promise<boolean> {
    const sql = `DELETE FROM \`${this.tableName}\` WHERE \`${this.primaryKey}\` = ?`;
    const result = await dbManager.run(sql, [id]);
    return (result.changes || 0) > 0;
  }

  /**
   * 批量创建
   */
  async createMany(dataArray: Omit<T, 'id' | 'create_time' | 'update_time'>[]): Promise<T[]> {
    if (dataArray.length === 0) {
      return [];
    }

    const results: T[] = [];
    
    // 使用事务批量插入
    await dbManager.exec('BEGIN TRANSACTION');
    
    try {
      for (const data of dataArray) {
        const created = await this.create(data);
        results.push(created);
      }
      
      await dbManager.exec('COMMIT');
      return results;
    } catch (error) {
      await dbManager.exec('ROLLBACK');
      throw error;
    }
  }

  /**
   * 批量更新
   */
  async updateMany(conditions: Partial<T>, data: Partial<T>): Promise<number> {
    const { sql: whereClause, params: whereParams } = this.buildWhereClause(conditions);
    
    const keys = Object.keys(data).filter(key => key !== this.primaryKey);
    const values = keys.map(key => data[key as keyof T]);
    const setClause = keys.map(key => `\`${key}\` = ?`).join(', ');

    if (keys.length === 0) {
      return 0;
    }

    let sql = `UPDATE \`${this.tableName}\` SET ${setClause}`;
    if (whereClause) sql += ` ${whereClause}`;

    const result = await dbManager.run(sql, [...values, ...whereParams]);
    return result.changes || 0;
  }

  /**
   * 批量删除
   */
  async deleteMany(conditions: Partial<T>): Promise<number> {
    const { sql: whereClause, params } = this.buildWhereClause(conditions);
    
    let sql = `DELETE FROM \`${this.tableName}\``;
    if (whereClause) sql += ` ${whereClause}`;

    const result = await dbManager.run(sql, params);
    return result.changes || 0;
  }

  /**
   * 统计记录数量
   */
  async count(conditions?: Partial<T>): Promise<number> {
    let sql = `SELECT COUNT(*) as total FROM \`${this.tableName}\``;
    let params: any[] = [];
    
    if (conditions) {
      const { sql: whereClause, params: whereParams } = this.buildWhereClause(conditions);
      if (whereClause) {
        sql += ` ${whereClause}`;
        params = whereParams;
      }
    }

    const result = await dbManager.get<{ total: number }>(sql, params);
    return result?.total || 0;
  }

  /**
   * 检查记录是否存在
   */
  async exists(conditions: Partial<T>): Promise<boolean> {
    const count = await this.count(conditions);
    return count > 0;
  }
}

/**
 * 人物相关数据访问层基类
 */
export abstract class CharacterDAL<T> extends BaseDAL<T> implements ICharacterDAL<T> {
  /**
   * 根据人物ID查找相关数据
   */
  async findByCharacterId(characterId: string): Promise<T | null> {
    return await this.findOneWhere({ character_uuid: characterId } as unknown as Partial<T>);
  }

  /**
   * 根据人物ID删除相关数据
   */
  async deleteByCharacterId(characterId: string): Promise<boolean> {
    const result = await this.deleteMany({ character_uuid: characterId } as unknown as Partial<T>);
    return result > 0;
  }
}

/**
 * 静态数据访问层基类（只读）
 */
export abstract class StaticDataDAL<T, K = string> extends BaseDAL<T, K> implements IStaticDataDAL<T, K> {
  constructor(tableName: string, primaryKey: string = 'id') {
    super(tableName, primaryKey);
  }

  // StaticDataDAL现在继承自BaseDAL，拥有完整的CRUD功能
}