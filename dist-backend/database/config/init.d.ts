/**
 * 数据库初始化类
 */
export declare class DatabaseInitializer {
    private sqlFilePath;
    constructor(sqlFilePath?: string);
    /**
     * 初始化数据库
     */
    initialize(): Promise<void>;
    /**
     * 读取SQL文件内容
     */
    private readSqlFile;
    /**
     * 执行SQL语句
     */
    private executeSqlStatements;
    /**
     * 分割SQL语句
     */
    private splitSqlStatements;
    /**
     * 检查数据库是否已初始化
     */
    isInitialized(): Promise<boolean>;
    /**
     * 重置数据库（删除所有表）
     */
    reset(): Promise<void>;
}
export declare const dbInitializer: DatabaseInitializer;
//# sourceMappingURL=init.d.ts.map