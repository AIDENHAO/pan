import { Pool } from 'mysql2/promise';
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
export declare const defaultConfig: DatabaseConfig;
export declare class DatabaseManager {
    private static instance;
    private pool;
    private config;
    private isConnected;
    private constructor();
    static getInstance(config?: DatabaseConfig): DatabaseManager;
    connect(): Promise<Pool>;
    getPool(): Pool | null;
    isPoolConnected(): boolean;
    close(): Promise<void>;
    run(sql: string, params?: any[]): Promise<any>;
    get<T = any>(sql: string, params?: any[]): Promise<T | undefined>;
    all<T = any>(sql: string, params?: any[]): Promise<T[]>;
    exec(sql: string): Promise<void>;
    /**
     * 获取连接池状态信息
     */
    getPoolStatus(): {
        connected: boolean;
        connectionLimit?: number;
    };
    /**
     * 健康检查
     */
    healthCheck(): Promise<boolean>;
}
export declare const dbManager: DatabaseManager;
//# sourceMappingURL=database.d.ts.map