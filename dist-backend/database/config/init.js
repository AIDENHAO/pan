import { dbManager } from './database.js';
import fs from 'fs';
import path from 'path';
/**
 * 数据库初始化类
 */
export class DatabaseInitializer {
    constructor(sqlFilePath) {
        this.sqlFilePath = sqlFilePath || path.join(process.cwd(), 'datainfo', 'Untitled Diagram_2026-07-30T03_58_27.499Z.sql');
    }
    /**
     * 初始化数据库
     */
    async initialize() {
        try {
            console.log('开始初始化数据库...');
            // 确保数据目录存在
            const dataDir = path.join(process.cwd(), 'data');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
                console.log('创建数据目录:', dataDir);
            }
            // 连接数据库
            await dbManager.connect();
            // 读取SQL文件
            const sqlContent = await this.readSqlFile();
            // 执行SQL语句
            await this.executeSqlStatements(sqlContent);
            console.log('数据库初始化完成!');
        }
        catch (error) {
            console.error('数据库初始化失败:', error);
            throw error;
        }
    }
    /**
     * 读取SQL文件内容
     */
    async readSqlFile() {
        try {
            if (!fs.existsSync(this.sqlFilePath)) {
                throw new Error(`SQL文件不存在: ${this.sqlFilePath}`);
            }
            const content = fs.readFileSync(this.sqlFilePath, 'utf-8');
            console.log('成功读取SQL文件:', this.sqlFilePath);
            return content;
        }
        catch (error) {
            console.error('读取SQL文件失败:', error);
            throw error;
        }
    }
    /**
     * 执行SQL语句
     */
    async executeSqlStatements(sqlContent) {
        try {
            // 分割SQL语句（以分号分隔，但要考虑注释和字符串中的分号）
            const statements = this.splitSqlStatements(sqlContent);
            console.log(`准备执行 ${statements.length} 条SQL语句...`);
            for (let i = 0; i < statements.length; i++) {
                const statement = statements[i].trim();
                if (statement && !statement.startsWith('--')) {
                    try {
                        await dbManager.exec(statement);
                        console.log(`执行SQL语句 ${i + 1}/${statements.length} 成功`);
                    }
                    catch (error) {
                        console.error(`执行SQL语句 ${i + 1} 失败:`, statement.substring(0, 100) + '...');
                        console.error('错误详情:', error);
                        // 继续执行其他语句，不中断整个过程
                    }
                }
            }
        }
        catch (error) {
            console.error('执行SQL语句失败:', error);
            throw error;
        }
    }
    /**
     * 分割SQL语句
     */
    splitSqlStatements(sqlContent) {
        // 移除注释行
        const lines = sqlContent.split('\n');
        const cleanedLines = lines.filter(line => {
            const trimmed = line.trim();
            return trimmed && !trimmed.startsWith('--');
        });
        const cleanedContent = cleanedLines.join('\n');
        // 按分号分割，但保留完整的语句
        const statements = [];
        let currentStatement = '';
        let inString = false;
        let stringChar = '';
        for (let i = 0; i < cleanedContent.length; i++) {
            const char = cleanedContent[i];
            const prevChar = i > 0 ? cleanedContent[i - 1] : '';
            if (!inString && (char === '"' || char === "'")) {
                inString = true;
                stringChar = char;
            }
            else if (inString && char === stringChar && prevChar !== '\\') {
                inString = false;
                stringChar = '';
            }
            currentStatement += char;
            if (!inString && char === ';') {
                const statement = currentStatement.trim();
                if (statement) {
                    statements.push(statement);
                }
                currentStatement = '';
            }
        }
        // 添加最后一个语句（如果没有以分号结尾）
        const lastStatement = currentStatement.trim();
        if (lastStatement) {
            statements.push(lastStatement);
        }
        return statements;
    }
    /**
     * 检查数据库是否已初始化
     */
    async isInitialized() {
        try {
            await dbManager.connect();
            // 检查是否存在主要表
            const result = await dbManager.get("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'character_base_info'");
            return !!result;
        }
        catch (error) {
            console.error('检查数据库初始化状态失败:', error);
            return false;
        }
    }
    /**
     * 重置数据库（删除所有表）
     */
    async reset() {
        try {
            console.log('开始重置数据库...');
            await dbManager.connect();
            // 获取所有表名
            const tables = await dbManager.all("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()");
            // 删除所有表
            for (const table of tables) {
                await dbManager.run(`DROP TABLE IF EXISTS \`${table.name}\``);
                console.log(`删除表: ${table.name}`);
            }
            console.log('数据库重置完成!');
        }
        catch (error) {
            console.error('数据库重置失败:', error);
            throw error;
        }
    }
}
// 导出初始化器实例
export const dbInitializer = new DatabaseInitializer();
//# sourceMappingURL=init.js.map