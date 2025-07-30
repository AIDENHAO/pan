// 配置和初始化
export { dbManager } from './config/database.js';
export { dbInitializer } from './config/init.js';
export type { DatabaseConfig } from './config/database.js';
export { defaultConfig } from './config/database.js';
export { DatabaseInitializer } from './config/init.js';

// 类型定义
export * from './interfaces/types.js';
export * from './interfaces/dal.js';

// DAL实现
export { BaseDAL, CharacterDAL, StaticDataDAL } from './implementations/BaseDAL.js';
export * from './implementations/CharacterDALs.js';
export { dalFactory, DALFactory, Transaction } from './implementations/DALFactory.js';

// 服务层
export { 
  DatabaseService, 
  databaseService
} from './implementations/DatabaseService.js';
export type { 
  CompleteCharacterInfo, 
  CreateCharacterData 
} from './implementations/DatabaseService.js';

// 便捷的初始化函数
export async function initializeDatabase(): Promise<void> {
  const { databaseService } = await import('./implementations/DatabaseService.js');
  await databaseService.initialize();
}

// 便捷的关闭函数
export async function closeDatabase(): Promise<void> {
  const { databaseService } = await import('./implementations/DatabaseService.js');
  await databaseService.close();
}