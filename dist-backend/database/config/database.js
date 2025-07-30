import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
// 加载环境变量
dotenv.config();
// 默认配置
export const defaultConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cultivation_db',
    charset: 'utf8mb4',
    timezone: '+00:00',
    connectTimeout: 60000,
    acquireTimeout: 60000,
    connectionLimit: 10,
    queueLimit: 0,
    verbose: process.env.NODE_ENV === 'development'
};
// 数据库连接管理器
export class DatabaseManager {
    constructor(config = defaultConfig) {
        this.pool = null;
        this.isConnected = false;
        this.config = config;
    }
    static getInstance(config) {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager(config);
        }
        return DatabaseManager.instance;
    }
    async connect() {
        if (this.pool && this.isConnected) {
            return this.pool;
        }
        try {
            const poolOptions = {
                host: this.config.host,
                port: this.config.port,
                user: this.config.user,
                password: this.config.password,
                database: this.config.database,
                charset: this.config.charset,
                timezone: this.config.timezone,
                connectTimeout: this.config.connectTimeout,
                connectionLimit: this.config.connectionLimit,
                queueLimit: this.config.queueLimit
            };
            this.pool = mysql.createPool(poolOptions);
            // 测试连接
            const connection = await this.pool.getConnection();
            await connection.ping();
            connection.release();
            this.isConnected = true;
            if (this.config.verbose) {
                console.log('MySQL连接池创建成功');
            }
            return this.pool;
        }
        catch (err) {
            console.error('数据库连接失败:', err);
            this.isConnected = false;
            throw err;
        }
    }
    getPool() {
        return this.pool;
    }
    isPoolConnected() {
        return this.isConnected && this.pool !== null;
    }
    async close() {
        if (this.pool) {
            try {
                await this.pool.end();
                if (this.config.verbose) {
                    console.log('数据库连接池已关闭');
                }
                this.pool = null;
                this.isConnected = false;
            }
            catch (err) {
                console.error('关闭数据库连接池失败:', err);
                throw err;
            }
        }
    }
    async run(sql, params = []) {
        const pool = await this.connect();
        try {
            const [result] = await pool.execute(sql, params);
            return result;
        }
        catch (err) {
            console.error('执行SQL失败:', { sql, params, error: err });
            throw err;
        }
    }
    async get(sql, params = []) {
        const pool = await this.connect();
        try {
            const [rows] = await pool.execute(sql, params);
            const result = rows;
            return result.length > 0 ? result[0] : undefined;
        }
        catch (err) {
            console.error('查询SQL失败:', { sql, params, error: err });
            throw err;
        }
    }
    async all(sql, params = []) {
        const pool = await this.connect();
        try {
            const [rows] = await pool.execute(sql, params);
            return rows;
        }
        catch (err) {
            console.error('查询SQL失败:', { sql, params, error: err });
            throw err;
        }
    }
    async exec(sql) {
        const pool = await this.connect();
        try {
            await pool.execute(sql);
        }
        catch (err) {
            console.error('执行SQL失败:', { sql, error: err });
            throw err;
        }
    }
    /**
     * 获取连接池状态信息
     */
    getPoolStatus() {
        return {
            connected: this.isConnected,
            connectionLimit: this.config.connectionLimit
        };
    }
    /**
     * 健康检查
     */
    async healthCheck() {
        try {
            if (!this.pool || !this.isConnected) {
                return false;
            }
            const connection = await this.pool.getConnection();
            await connection.ping();
            connection.release();
            return true;
        }
        catch (err) {
            console.error('数据库健康检查失败:', err);
            return false;
        }
    }
}
// 导出数据库管理器实例
export const dbManager = DatabaseManager.getInstance();
//# sourceMappingURL=database.js.map