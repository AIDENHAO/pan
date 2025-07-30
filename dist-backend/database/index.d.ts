export { dbManager } from './config/database.js';
export { dbInitializer } from './config/init.js';
export type { DatabaseConfig } from './config/database.js';
export { defaultConfig } from './config/database.js';
export { DatabaseInitializer } from './config/init.js';
export * from './interfaces/types.js';
export * from './interfaces/dal.js';
export { BaseDAL, CharacterDAL, StaticDataDAL } from './implementations/BaseDAL.js';
export * from './implementations/CharacterDALs.js';
export { dalFactory, DALFactory, Transaction } from './implementations/DALFactory.js';
export { DatabaseService, databaseService } from './implementations/DatabaseService.js';
export type { CompleteCharacterInfo, CreateCharacterData } from './implementations/DatabaseService.js';
export declare function initializeDatabase(): Promise<void>;
export declare function closeDatabase(): Promise<void>;
//# sourceMappingURL=index.d.ts.map