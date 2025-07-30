/**
 * 服务层接口定义
 * 定义业务逻辑层的接口规范
 */

import { CharacterBaseInfo, CharacterAffinities, CharacterStrength, CharacterBodyTypes, CharacterSkills, CharacterWeapons, CharacterCurrency, CharacterItems, PaginatedResult, QueryOptions } from './types';

/**
 * 数据库服务接口
 * 提供高级业务逻辑操作
 */
export interface IDatabaseService {
  // 人物管理
  createCharacter(characterData: Partial<CharacterBaseInfo>): Promise<string>;
  getCharacter(characterUuid: string): Promise<CharacterBaseInfo | null>;
  updateCharacter(characterUuid: string, updates: Partial<CharacterBaseInfo>): Promise<boolean>;
  deleteCharacter(characterUuid: string): Promise<boolean>;
  
  // 人物属性管理
  getCharacterAffinities(characterUuid: string): Promise<CharacterAffinities | null>;
  updateCharacterAffinities(characterUuid: string, affinities: Partial<CharacterAffinities>): Promise<boolean>;
  
  getCharacterStrength(characterUuid: string): Promise<CharacterStrength | null>;
  updateCharacterStrength(characterUuid: string, strength: Partial<CharacterStrength>): Promise<boolean>;
  
  getCharacterBodyTypes(characterUuid: string): Promise<CharacterBodyTypes | null>;
  updateCharacterBodyTypes(characterUuid: string, bodyTypes: Partial<CharacterBodyTypes>): Promise<boolean>;
  
  getCharacterSkills(characterUuid: string): Promise<CharacterSkills | null>;
  updateCharacterSkills(characterUuid: string, skills: Partial<CharacterSkills>): Promise<boolean>;
  
  getCharacterWeapons(characterUuid: string): Promise<CharacterWeapons | null>;
  updateCharacterWeapons(characterUuid: string, weapons: Partial<CharacterWeapons>): Promise<boolean>;
  
  getCharacterCurrency(characterUuid: string): Promise<CharacterCurrency | null>;
  updateCharacterCurrency(characterUuid: string, currency: Partial<CharacterCurrency>): Promise<boolean>;
  
  // 背包管理
  addItemToInventory(characterUuid: string, itemId: string, count: number, level?: number): Promise<string>;
  removeItemFromInventory(characterItemsId: string): Promise<boolean>;
  updateItemInInventory(characterItemsId: string, updates: Partial<CharacterItems>): Promise<boolean>;
  getCharacterInventory(characterUuid: string, options?: QueryOptions): Promise<PaginatedResult<CharacterItems>>;
  
  // 装备管理
  equipItem(characterUuid: string, characterItemsId: string, slotPosition: number): Promise<boolean>;
  unequipItem(characterUuid: string, slotPosition: number): Promise<boolean>;
  getEquippedItems(characterUuid: string): Promise<CharacterItems[]>;
  
  // 修炼系统
  startCultivation(characterUuid: string): Promise<boolean>;
  stopCultivation(characterUuid: string): Promise<boolean>;
  attemptBreakthrough(characterUuid: string): Promise<{ success: boolean; newRealm?: number; message: string }>;
  
  // 宗门系统
  joinZongmen(characterUuid: string, zongmenId: string): Promise<boolean>;
  leaveZongmen(characterUuid: string): Promise<boolean>;
  updateZongmenTitle(characterUuid: string, titleType: 'title_1_id' | 'title_2_id', newTitle: string): Promise<boolean>;
  
  // 统计和查询
  getCharacterCount(): Promise<number>;
  getCharactersByRealm(realmLevel: number, options?: QueryOptions): Promise<PaginatedResult<CharacterBaseInfo>>;
  getCharactersByZongmen(zongmenId: string, options?: QueryOptions): Promise<PaginatedResult<CharacterBaseInfo>>;
  searchCharacters(searchTerm: string, options?: QueryOptions): Promise<PaginatedResult<CharacterBaseInfo>>;
  
  // 数据库管理
  initializeDatabase(): Promise<boolean>;
  backupDatabase(backupPath: string): Promise<boolean>;
  restoreDatabase(backupPath: string): Promise<boolean>;
  validateDatabaseIntegrity(): Promise<{ isValid: boolean; errors: string[] }>;
}

/**
 * 缓存服务接口
 * 提供数据缓存功能
 */
export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<boolean>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<boolean>;
  exists(key: string): Promise<boolean>;
  keys(pattern?: string): Promise<string[]>;
}

/**
 * 事件服务接口
 * 提供事件发布订阅功能
 */
export interface IEventService {
  emit(event: string, data: any): Promise<void>;
  on(event: string, handler: (data: any) => void): void;
  off(event: string, handler?: (data: any) => void): void;
  once(event: string, handler: (data: any) => void): void;
}

/**
 * 日志服务接口
 * 提供日志记录功能
 */
export interface ILogService {
  debug(message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string, error?: Error, meta?: any): void;
  fatal(message: string, error?: Error, meta?: any): void;
}

/**
 * 验证服务接口
 * 提供数据验证功能
 */
export interface IValidationService {
  validateCharacterData(data: Partial<CharacterBaseInfo>): ValidationResult;
  validateItemData(data: Partial<CharacterItems>): ValidationResult;
  validateCurrencyData(data: Partial<CharacterCurrency>): ValidationResult;
  validateUuid(uuid: string): boolean;
  validateRealmLevel(level: number): boolean;
}

/**
 * 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}

/**
 * 验证错误接口
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

/**
 * 验证警告接口
 */
export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  value?: any;
}

/**
 * 业务规则引擎接口
 */
export interface IBusinessRuleEngine {
  canBreakthrough(character: CharacterBaseInfo, strength: CharacterStrength): Promise<{ canBreakthrough: boolean; reason?: string }>;
  calculateCombatPower(character: CharacterBaseInfo, strength: CharacterStrength, items: CharacterItems[]): Promise<number>;
  canJoinZongmen(character: CharacterBaseInfo, zongmenId: string): Promise<{ canJoin: boolean; reason?: string }>;
  canEquipItem(character: CharacterBaseInfo, item: CharacterItems): Promise<{ canEquip: boolean; reason?: string }>;
  calculateCultivationSpeed(character: CharacterBaseInfo, affinities: CharacterAffinities): Promise<number>;
}

/**
 * 数据同步服务接口
 */
export interface IDataSyncService {
  syncCharacterData(characterUuid: string): Promise<boolean>;
  syncAllCharacters(): Promise<{ success: number; failed: number; errors: string[] }>;
  exportCharacterData(characterUuid: string): Promise<string>;
  importCharacterData(data: string): Promise<{ success: boolean; characterUuid?: string; errors?: string[] }>;
}

/**
 * 性能监控服务接口
 */
export interface IPerformanceService {
  startTimer(operation: string): string;
  endTimer(timerId: string): number;
  recordMetric(name: string, value: number, tags?: Record<string, string>): void;
  getMetrics(timeRange?: { start: Date; end: Date }): Promise<PerformanceMetric[]>;
}

/**
 * 性能指标接口
 */
export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
}

/**
 * 服务容器接口
 * 依赖注入容器
 */
export interface IServiceContainer {
  register<T>(name: string, factory: () => T): void;
  registerSingleton<T>(name: string, factory: () => T): void;
  resolve<T>(name: string): T;
  isRegistered(name: string): boolean;
}

/**
 * 健康检查服务接口
 */
export interface IHealthCheckService {
  checkDatabase(): Promise<HealthStatus>;
  checkCache(): Promise<HealthStatus>;
  checkOverall(): Promise<OverallHealthStatus>;
}

/**
 * 健康状态接口
 */
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
  details?: Record<string, any>;
  timestamp: Date;
}

/**
 * 整体健康状态接口
 */
export interface OverallHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, HealthStatus>;
  timestamp: Date;
}