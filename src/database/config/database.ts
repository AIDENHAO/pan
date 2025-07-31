import mysql from 'mysql2/promise';
import { Connection, ConnectionOptions, Pool, PoolOptions } from 'mysql2/promise';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 数据库配置
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  charset?: string;
  timezone?: string;
  connectTimeout?: number;
  acquireTimeout?: number;
  connectionLimit?: number;
  queueLimit?: number;
  verbose?: boolean;
}

// 默认配置
export const defaultConfig: DatabaseConfig = {
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
  private static instance: DatabaseManager;
  private pool: Pool | null = null;
  private config: DatabaseConfig;
  private isConnected: boolean = false;

  private constructor(config: DatabaseConfig = defaultConfig) {
    this.config = config;
  }

  public static getInstance(config?: DatabaseConfig): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager(config);
    }
    return DatabaseManager.instance;
  }

  public async connect(): Promise<Pool> {
    if (this.pool && this.isConnected) {
      return this.pool;
    }

    try {
      const poolOptions: PoolOptions = {
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
    } catch (err) {
      console.error('数据库连接失败:', err);
      this.isConnected = false;
      throw err;
    }
  }

  public getPool(): Pool | null {
    return this.pool;
  }

  public isPoolConnected(): boolean {
    return this.isConnected && this.pool !== null;
  }

  public async close(): Promise<void> {
    if (this.pool) {
      try {
        await this.pool.end();
        if (this.config.verbose) {
          console.log('数据库连接池已关闭');
        }
        this.pool = null;
        this.isConnected = false;
      } catch (err) {
        console.error('关闭数据库连接池失败:', err);
        throw err;
      }
    }
  }

  public async run(sql: string, params: any[] = []): Promise<any> {
    const pool = await this.connect();
    try {
      const [result] = await pool.execute(sql, params);
      return result;
    } catch (err) {
      console.error('执行SQL失败:', { sql, params, error: err });
      throw err;
    }
  }

  public async get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    const pool = await this.connect();
    try {
      const [rows] = await pool.execute(sql, params);
      const result = rows as T[];
      return result.length > 0 ? result[0] : undefined;
    } catch (err) {
      console.error('查询SQL失败:', { sql, params, error: err });
      throw err;
    }
  }

  public async all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const pool = await this.connect();
    try {
      const [rows] = await pool.execute(sql, params);
      return rows as T[];
    } catch (err) {
      console.error('查询SQL失败:', { sql, params, error: err });
      throw err;
    }
  }

  public async exec(sql: string): Promise<void> {
    const pool = await this.connect();
    try {
      await pool.execute(sql);
    } catch (err) {
      console.error('执行SQL失败:', { sql, error: err });
      throw err;
    }
  }

  /**
   * 执行事务
   */
  public async transaction<T>(callback: (connection: Connection) => Promise<T>): Promise<T> {
    const pool = await this.connect();
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 获取连接池状态信息
   */
  public getPoolStatus(): { connected: boolean; connectionLimit?: number } {
    return {
      connected: this.isConnected,
      connectionLimit: this.config.connectionLimit
    };
  }

  /**
   * 健康检查
   */
  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.pool || !this.isConnected) {
        return false;
      }
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      return true;
    } catch (err) {
      console.error('数据库健康检查失败:', err);
      return false;
    }
  }
}

// 导出数据库管理器实例
export const dbManager = DatabaseManager.getInstance();