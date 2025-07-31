/**
 * 错误处理和异常定义接口
 * 定义系统中所有错误类型和异常处理规范
 */

/**
 * 基础错误接口
 */
export interface IBaseError {
  code: string;
  message: string;
  timestamp: Date;
  stack?: string;
  context?: Record<string, any>;
}

/**
 * 数据库错误接口
 */
export interface IDatabaseError extends IBaseError {
  type: 'DATABASE_ERROR';
  operation: string;
  table?: string;
  query?: string;
  sqliteCode?: number;
}

/**
 * 验证错误接口
 */
export interface IValidationError extends IBaseError {
  type: 'VALIDATION_ERROR';
  field: string;
  value: any;
  constraint: string;
}

/**
 * 业务逻辑错误接口
 */
export interface IBusinessError extends IBaseError {
  type: 'BUSINESS_ERROR';
  businessRule: string;
  entity?: string;
  entityId?: string;
}

/**
 * 权限错误接口
 */
export interface IPermissionError extends IBaseError {
  type: 'PERMISSION_ERROR';
  requiredPermission: string;
  currentPermission?: string;
  resource: string;
}

/**
 * 资源未找到错误接口
 */
export interface INotFoundError extends IBaseError {
  type: 'NOT_FOUND_ERROR';
  resource: string;
  identifier: string;
}

/**
 * 冲突错误接口
 */
export interface IConflictError extends IBaseError {
  type: 'CONFLICT_ERROR';
  resource: string;
  conflictingField: string;
  conflictingValue: any;
}

/**
 * 系统错误接口
 */
export interface ISystemError extends IBaseError {
  type: 'SYSTEM_ERROR';
  component: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * 网络错误接口
 */
export interface INetworkError extends IBaseError {
  type: 'NETWORK_ERROR';
  url?: string;
  method?: string;
  statusCode?: number;
  timeout?: boolean;
}

/**
 * 配置错误接口
 */
export interface IConfigurationError extends IBaseError {
  type: 'CONFIGURATION_ERROR';
  configKey: string;
  expectedType?: string;
  actualType?: string;
}

/**
 * 并发错误接口
 */
export interface IConcurrencyError extends IBaseError {
  type: 'CONCURRENCY_ERROR';
  resource: string;
  operation: string;
  conflictingOperation?: string;
}

/**
 * 联合错误类型
 */
export type ApplicationError = 
  | IDatabaseError 
  | IValidationError 
  | IBusinessError 
  | IPermissionError 
  | INotFoundError 
  | IConflictError 
  | ISystemError 
  | INetworkError 
  | IConfigurationError 
  | IConcurrencyError;

/**
 * 错误处理器接口
 */
export interface IErrorHandler {
  handle(error: ApplicationError): Promise<void>;
  canHandle(error: ApplicationError): boolean;
  priority: number;
}

/**
 * 错误报告接口
 */
export interface IErrorReporter {
  report(error: ApplicationError): Promise<void>;
  reportBatch(errors: ApplicationError[]): Promise<void>;
}

/**
 * 错误恢复策略接口
 */
export interface IErrorRecoveryStrategy {
  canRecover(error: ApplicationError): boolean;
  recover(error: ApplicationError): Promise<{ success: boolean; result?: any }>;
}

/**
 * 错误上下文接口
 */
export interface IErrorContext {
  userId?: string;
  characterId?: string;
  operation: string;
  requestId?: string;
  sessionId?: string;
  userAgent?: string;
  ip?: string;
  timestamp: Date;
  additionalData?: Record<string, any>;
}

/**
 * 错误统计接口
 */
export interface IErrorStatistics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsByCode: Record<string, number>;
  errorsByTimeRange: Array<{
    timeRange: string;
    count: number;
  }>;
  topErrors: Array<{
    code: string;
    message: string;
    count: number;
    lastOccurrence: Date;
  }>;
}

/**
 * 错误监控服务接口
 */
export interface IErrorMonitoringService {
  logError(error: ApplicationError, context?: IErrorContext): Promise<void>;
  getErrorStatistics(timeRange?: { start: Date; end: Date }): Promise<IErrorStatistics>;
  getErrorsByType(type: string, limit?: number): Promise<ApplicationError[]>;
  clearOldErrors(olderThan: Date): Promise<number>;
}

/**
 * 错误代码枚举
 */
export enum ErrorCodes {
  // 数据库错误 (DB_xxx)
  DB_CONNECTION_FAILED = 'DB_CONNECTION_FAILED',
  DB_QUERY_FAILED = 'DB_QUERY_FAILED',
  DB_TRANSACTION_FAILED = 'DB_TRANSACTION_FAILED',
  DB_CONSTRAINT_VIOLATION = 'DB_CONSTRAINT_VIOLATION',
  DB_FOREIGN_KEY_VIOLATION = 'DB_FOREIGN_KEY_VIOLATION',
  DB_UNIQUE_CONSTRAINT_VIOLATION = 'DB_UNIQUE_CONSTRAINT_VIOLATION',
  DB_NOT_NULL_VIOLATION = 'DB_NOT_NULL_VIOLATION',
  DB_CHECK_CONSTRAINT_VIOLATION = 'DB_CHECK_CONSTRAINT_VIOLATION',
  
  // 验证错误 (VAL_xxx)
  VAL_REQUIRED_FIELD = 'VAL_REQUIRED_FIELD',
  VAL_INVALID_FORMAT = 'VAL_INVALID_FORMAT',
  VAL_OUT_OF_RANGE = 'VAL_OUT_OF_RANGE',
  VAL_INVALID_LENGTH = 'VAL_INVALID_LENGTH',
  VAL_INVALID_TYPE = 'VAL_INVALID_TYPE',
  VAL_INVALID_UUID = 'VAL_INVALID_UUID',
  VAL_INVALID_DATE = 'VAL_INVALID_DATE',
  VAL_INVALID_ENUM = 'VAL_INVALID_ENUM',
  
  // 业务逻辑错误 (BIZ_xxx)
  BIZ_CHARACTER_NOT_FOUND = 'BIZ_CHARACTER_NOT_FOUND',
  BIZ_CHARACTER_ALREADY_EXISTS = 'BIZ_CHARACTER_ALREADY_EXISTS',
  BIZ_INSUFFICIENT_CULTIVATION = 'BIZ_INSUFFICIENT_CULTIVATION',
  BIZ_BREAKTHROUGH_NOT_ALLOWED = 'BIZ_BREAKTHROUGH_NOT_ALLOWED',
  BIZ_ALREADY_IN_ZONGMEN = 'BIZ_ALREADY_IN_ZONGMEN',
  BIZ_NOT_IN_ZONGMEN = 'BIZ_NOT_IN_ZONGMEN',
  BIZ_INSUFFICIENT_REALM = 'BIZ_INSUFFICIENT_REALM',
  BIZ_ITEM_NOT_FOUND = 'BIZ_ITEM_NOT_FOUND',
  BIZ_INSUFFICIENT_ITEMS = 'BIZ_INSUFFICIENT_ITEMS',
  BIZ_EQUIPMENT_SLOT_OCCUPIED = 'BIZ_EQUIPMENT_SLOT_OCCUPIED',
  BIZ_CANNOT_EQUIP_ITEM = 'BIZ_CANNOT_EQUIP_ITEM',
  BIZ_INSUFFICIENT_CURRENCY = 'BIZ_INSUFFICIENT_CURRENCY',
  BIZ_CULTIVATION_IN_PROGRESS = 'BIZ_CULTIVATION_IN_PROGRESS',
  BIZ_CULTIVATION_NOT_STARTED = 'BIZ_CULTIVATION_NOT_STARTED',
  
  // 权限错误 (PERM_xxx)
  PERM_ACCESS_DENIED = 'PERM_ACCESS_DENIED',
  PERM_INSUFFICIENT_PRIVILEGES = 'PERM_INSUFFICIENT_PRIVILEGES',
  PERM_RESOURCE_FORBIDDEN = 'PERM_RESOURCE_FORBIDDEN',
  
  // 系统错误 (SYS_xxx)
  SYS_INTERNAL_ERROR = 'SYS_INTERNAL_ERROR',
  SYS_SERVICE_UNAVAILABLE = 'SYS_SERVICE_UNAVAILABLE',
  SYS_TIMEOUT = 'SYS_TIMEOUT',
  SYS_MEMORY_LIMIT_EXCEEDED = 'SYS_MEMORY_LIMIT_EXCEEDED',
  SYS_DISK_SPACE_FULL = 'SYS_DISK_SPACE_FULL',
  
  // 网络错误 (NET_xxx)
  NET_CONNECTION_TIMEOUT = 'NET_CONNECTION_TIMEOUT',
  NET_REQUEST_FAILED = 'NET_REQUEST_FAILED',
  NET_INVALID_RESPONSE = 'NET_INVALID_RESPONSE',
  
  // 配置错误 (CFG_xxx)
  CFG_MISSING_REQUIRED = 'CFG_MISSING_REQUIRED',
  CFG_INVALID_VALUE = 'CFG_INVALID_VALUE',
  CFG_FILE_NOT_FOUND = 'CFG_FILE_NOT_FOUND',
  CFG_PARSE_ERROR = 'CFG_PARSE_ERROR',
  
  // 并发错误 (CONC_xxx)
  CONC_RESOURCE_LOCKED = 'CONC_RESOURCE_LOCKED',
  CONC_DEADLOCK_DETECTED = 'CONC_DEADLOCK_DETECTED',
  CONC_OPTIMISTIC_LOCK_FAILED = 'CONC_OPTIMISTIC_LOCK_FAILED'
}

/**
 * 错误严重级别
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * 错误分类
 */
export enum ErrorCategory {
  DATABASE = 'database',
  VALIDATION = 'validation',
  BUSINESS = 'business',
  PERMISSION = 'permission',
  SYSTEM = 'system',
  NETWORK = 'network',
  CONFIGURATION = 'configuration',
  CONCURRENCY = 'concurrency'
}

/**
 * 错误工厂接口
 */
export interface IErrorFactory {
  createDatabaseError(code: ErrorCodes, message: string, context?: Record<string, any>): IDatabaseError;
  createValidationError(code: ErrorCodes, field: string, value: any, message: string): IValidationError;
  createBusinessError(code: ErrorCodes, message: string, businessRule: string, context?: Record<string, any>): IBusinessError;
  createNotFoundError(resource: string, identifier: string): INotFoundError;
  createConflictError(resource: string, conflictingField: string, conflictingValue: any): IConflictError;
  createSystemError(code: ErrorCodes, message: string, component: string, severity: ErrorSeverity): ISystemError;
}

/**
 * 错误处理配置接口
 */
export interface IErrorHandlingConfig {
  enableErrorReporting: boolean;
  enableErrorRecovery: boolean;
  maxRetryAttempts: number;
  retryDelayMs: number;
  errorLogLevel: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  enableStackTrace: boolean;
  enableErrorStatistics: boolean;
  errorRetentionDays: number;
}

/**
 * 重试策略接口
 */
export interface IRetryStrategy {
  shouldRetry(error: ApplicationError, attemptNumber: number): boolean;
  getDelayMs(attemptNumber: number): number;
  getMaxAttempts(): number;
}

/**
 * 断路器接口
 */
export interface ICircuitBreaker {
  execute<T>(operation: () => Promise<T>): Promise<T>;
  getState(): 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  getFailureCount(): number;
  reset(): void;
}