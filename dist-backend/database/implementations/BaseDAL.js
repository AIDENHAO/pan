import { dbManager } from '../config/database.js';
/**
 * 基础数据访问层实现
 */
export class BaseDAL {
    constructor(tableName, primaryKey = 'id') {
        this.tableName = tableName;
        this.primaryKey = primaryKey;
    }
    /**
     * 构建WHERE子句
     */
    buildWhereClause(conditions) {
        const keys = Object.keys(conditions).filter(key => conditions[key] !== undefined);
        if (keys.length === 0) {
            return { sql: '', params: [] };
        }
        const whereClauses = keys.map(key => `\`${key}\` = ?`);
        const params = keys.map(key => conditions[key]);
        return {
            sql: `WHERE ${whereClauses.join(' AND ')}`,
            params
        };
    }
    /**
     * 构建ORDER BY子句
     */
    buildOrderClause(options) {
        if (!options?.orderBy) {
            return '';
        }
        const direction = options.orderDirection || 'ASC';
        return `ORDER BY \`${options.orderBy}\` ${direction}`;
    }
    /**
     * 构建LIMIT子句
     */
    buildLimitClause(options) {
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
    async findById(id) {
        const sql = `SELECT * FROM \`${this.tableName}\` WHERE \`${this.primaryKey}\` = ?`;
        const result = await dbManager.get(sql, [id]);
        return result || null;
    }
    /**
     * 查找所有记录
     */
    async findAll(options) {
        let sql = `SELECT * FROM \`${this.tableName}\``;
        const orderClause = this.buildOrderClause(options);
        const limitClause = this.buildLimitClause(options);
        if (orderClause)
            sql += ` ${orderClause}`;
        if (limitClause)
            sql += ` ${limitClause}`;
        return await dbManager.all(sql);
    }
    /**
     * 分页查询
     */
    async findPaginated(page, pageSize, options) {
        const offset = (page - 1) * pageSize;
        // 查询总数
        const countSql = `SELECT COUNT(*) as total FROM \`${this.tableName}\``;
        const countResult = await dbManager.get(countSql);
        const total = countResult?.total || 0;
        // 查询数据
        let sql = `SELECT * FROM \`${this.tableName}\``;
        const orderClause = this.buildOrderClause(options);
        if (orderClause)
            sql += ` ${orderClause}`;
        sql += ` LIMIT ${pageSize} OFFSET ${offset}`;
        const data = await dbManager.all(sql);
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
    async findWhere(conditions, options) {
        const { sql: whereClause, params } = this.buildWhereClause(conditions);
        let sql = `SELECT * FROM \`${this.tableName}\``;
        if (whereClause)
            sql += ` ${whereClause}`;
        const orderClause = this.buildOrderClause(options);
        const limitClause = this.buildLimitClause(options);
        if (orderClause)
            sql += ` ${orderClause}`;
        if (limitClause)
            sql += ` ${limitClause}`;
        return await dbManager.all(sql, params);
    }
    /**
     * 根据条件查找单个记录
     */
    async findOneWhere(conditions) {
        const { sql: whereClause, params } = this.buildWhereClause(conditions);
        let sql = `SELECT * FROM \`${this.tableName}\``;
        if (whereClause)
            sql += ` ${whereClause}`;
        sql += ' LIMIT 1';
        const result = await dbManager.get(sql, params);
        return result || null;
    }
    /**
     * 创建新记录
     */
    async create(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map(() => '?').join(', ');
        const columns = keys.map(key => `\`${key}\``).join(', ');
        const sql = `INSERT INTO \`${this.tableName}\` (${columns}) VALUES (${placeholders})`;
        const result = await dbManager.run(sql, values);
        // 检查插入是否成功
        if (result.affectedRows > 0) {
            // 对于自增主键，使用insertId
            const insertId = result.insertId;
            if (insertId) {
                return await this.findById(insertId);
            }
            // 对于非自增主键，使用传入数据中的主键值
            const primaryKeyValue = data[this.primaryKey];
            if (primaryKeyValue) {
                return await this.findById(primaryKeyValue);
            }
        }
        throw new Error('创建记录失败');
    }
    /**
     * 更新记录
     */
    async update(id, data) {
        const keys = Object.keys(data).filter(key => key !== this.primaryKey);
        const values = keys.map(key => data[key]);
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
    async delete(id) {
        const sql = `DELETE FROM \`${this.tableName}\` WHERE \`${this.primaryKey}\` = ?`;
        const result = await dbManager.run(sql, [id]);
        return (result.changes || 0) > 0;
    }
    /**
     * 批量创建
     */
    async createMany(dataArray) {
        if (dataArray.length === 0) {
            return [];
        }
        const results = [];
        // 使用事务批量插入
        await dbManager.exec('BEGIN TRANSACTION');
        try {
            for (const data of dataArray) {
                const created = await this.create(data);
                results.push(created);
            }
            await dbManager.exec('COMMIT');
            return results;
        }
        catch (error) {
            await dbManager.exec('ROLLBACK');
            throw error;
        }
    }
    /**
     * 批量更新
     */
    async updateMany(conditions, data) {
        const { sql: whereClause, params: whereParams } = this.buildWhereClause(conditions);
        const keys = Object.keys(data).filter(key => key !== this.primaryKey);
        const values = keys.map(key => data[key]);
        const setClause = keys.map(key => `\`${key}\` = ?`).join(', ');
        if (keys.length === 0) {
            return 0;
        }
        let sql = `UPDATE \`${this.tableName}\` SET ${setClause}`;
        if (whereClause)
            sql += ` ${whereClause}`;
        const result = await dbManager.run(sql, [...values, ...whereParams]);
        return result.changes || 0;
    }
    /**
     * 批量删除
     */
    async deleteMany(conditions) {
        const { sql: whereClause, params } = this.buildWhereClause(conditions);
        let sql = `DELETE FROM \`${this.tableName}\``;
        if (whereClause)
            sql += ` ${whereClause}`;
        const result = await dbManager.run(sql, params);
        return result.changes || 0;
    }
    /**
     * 统计记录数量
     */
    async count(conditions) {
        let sql = `SELECT COUNT(*) as total FROM \`${this.tableName}\``;
        let params = [];
        if (conditions) {
            const { sql: whereClause, params: whereParams } = this.buildWhereClause(conditions);
            if (whereClause) {
                sql += ` ${whereClause}`;
                params = whereParams;
            }
        }
        const result = await dbManager.get(sql, params);
        return result?.total || 0;
    }
    /**
     * 检查记录是否存在
     */
    async exists(conditions) {
        const count = await this.count(conditions);
        return count > 0;
    }
}
/**
 * 人物相关数据访问层基类
 */
export class CharacterDAL extends BaseDAL {
    /**
     * 根据人物ID查找相关数据
     */
    async findByCharacterId(characterId) {
        return await this.findOneWhere({ character_uuid: characterId });
    }
    /**
     * 根据人物ID删除相关数据
     */
    async deleteByCharacterId(characterId) {
        const result = await this.deleteMany({ character_uuid: characterId });
        return result > 0;
    }
}
/**
 * 静态数据访问层基类（只读）
 */
export class StaticDataDAL {
    constructor(tableName, primaryKey = 'id') {
        this.tableName = tableName;
        this.primaryKey = primaryKey;
    }
    /**
     * 构建WHERE子句
     */
    buildWhereClause(conditions) {
        const keys = Object.keys(conditions).filter(key => conditions[key] !== undefined);
        if (keys.length === 0) {
            return { sql: '', params: [] };
        }
        const whereClauses = keys.map(key => `\`${key}\` = ?`);
        const params = keys.map(key => conditions[key]);
        return {
            sql: `WHERE ${whereClauses.join(' AND ')}`,
            params
        };
    }
    /**
     * 构建ORDER BY子句
     */
    buildOrderClause(options) {
        if (!options?.orderBy) {
            return '';
        }
        const direction = options.orderDirection || 'ASC';
        return `ORDER BY \`${options.orderBy}\` ${direction}`;
    }
    /**
     * 构建LIMIT子句
     */
    buildLimitClause(options) {
        if (!options?.limit) {
            return '';
        }
        let limitClause = `LIMIT ${options.limit}`;
        if (options.offset) {
            limitClause += ` OFFSET ${options.offset}`;
        }
        return limitClause;
    }
    async findById(id) {
        const sql = `SELECT * FROM \`${this.tableName}\` WHERE \`${this.primaryKey}\` = ?`;
        const result = await dbManager.get(sql, [id]);
        return result || null;
    }
    async findAll(options) {
        let sql = `SELECT * FROM \`${this.tableName}\``;
        const orderClause = this.buildOrderClause(options);
        const limitClause = this.buildLimitClause(options);
        if (orderClause)
            sql += ` ${orderClause}`;
        if (limitClause)
            sql += ` ${limitClause}`;
        return await dbManager.all(sql);
    }
    async findPaginated(page, pageSize, options) {
        const offset = (page - 1) * pageSize;
        // 查询总数
        const countSql = `SELECT COUNT(*) as total FROM \`${this.tableName}\``;
        const countResult = await dbManager.get(countSql);
        const total = countResult?.total || 0;
        // 查询数据
        let sql = `SELECT * FROM \`${this.tableName}\``;
        const orderClause = this.buildOrderClause(options);
        if (orderClause)
            sql += ` ${orderClause}`;
        sql += ` LIMIT ${pageSize} OFFSET ${offset}`;
        const data = await dbManager.all(sql);
        return {
            data,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        };
    }
    async findWhere(conditions, options) {
        const { sql: whereClause, params } = this.buildWhereClause(conditions);
        let sql = `SELECT * FROM \`${this.tableName}\``;
        if (whereClause)
            sql += ` ${whereClause}`;
        const orderClause = this.buildOrderClause(options);
        const limitClause = this.buildLimitClause(options);
        if (orderClause)
            sql += ` ${orderClause}`;
        if (limitClause)
            sql += ` ${limitClause}`;
        return await dbManager.all(sql, params);
    }
    async findOneWhere(conditions) {
        const { sql: whereClause, params } = this.buildWhereClause(conditions);
        let sql = `SELECT * FROM \`${this.tableName}\``;
        if (whereClause)
            sql += ` ${whereClause}`;
        sql += ' LIMIT 1';
        const result = await dbManager.get(sql, params);
        return result || null;
    }
    async count(conditions) {
        let sql = `SELECT COUNT(*) as total FROM \`${this.tableName}\``;
        let params = [];
        if (conditions) {
            const { sql: whereClause, params: whereParams } = this.buildWhereClause(conditions);
            if (whereClause) {
                sql += ` ${whereClause}`;
                params = whereParams;
            }
        }
        const result = await dbManager.get(sql, params);
        return result?.total || 0;
    }
    async exists(conditions) {
        const count = await this.count(conditions);
        return count > 0;
    }
}
//# sourceMappingURL=BaseDAL.js.map