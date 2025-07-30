/**
 * 配置管理接口定义
 * 定义系统配置相关的接口和类型
 */

/**
 * 数据库配置接口
 */
export interface IDatabaseConfig {
  // 基础配置
  filename: string;
  mode?: number;
  verbose?: boolean;
  
  // 连接配置
  timeout?: number;
  busyTimeout?: number;
  
  // 性能配置
  cacheSize?: number;
  pageSize?: number;
  maxConnections?: number;
  
  // 安全配置
  enableWAL?: boolean;
  enableForeignKeys?: boolean;
  enableTriggers?: boolean;
  
  // 备份配置
  autoBackup?: boolean;
  backupInterval?: number;
  backupRetention?: number;
  backupPath?: string;
  
  // 日志配置
  enableQueryLogging?: boolean;
  slowQueryThreshold?: number;
}

/**
 * 缓存配置接口
 */
export interface ICacheConfig {
  // 基础配置
  enabled: boolean;
  provider: 'memory' | 'redis' | 'file';
  
  // 内存缓存配置
  maxSize?: number;
  defaultTTL?: number;
  
  // Redis配置
  redis?: {
    host: string;
    port: number;
    password?: string;
    database?: number;
    keyPrefix?: string;
  };
  
  // 文件缓存配置
  file?: {
    directory: string;
    maxFileSize?: number;
    cleanupInterval?: number;
  };
}

/**
 * 日志配置接口
 */
export interface ILogConfig {
  // 基础配置
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  enableConsole: boolean;
  enableFile: boolean;
  
  // 文件日志配置
  file?: {
    filename: string;
    maxSize?: string;
    maxFiles?: number;
    datePattern?: string;
  };
  
  // 格式配置
  format?: {
    timestamp?: boolean;
    level?: boolean;
    message?: boolean;
    meta?: boolean;
    stack?: boolean;
  };
  
  // 过滤配置
  filters?: {
    excludeFields?: string[];
    maskFields?: string[];
    maxDepth?: number;
  };
}

/**
 * 性能监控配置接口
 */
export interface IPerformanceConfig {
  // 基础配置
  enabled: boolean;
  sampleRate: number;
  
  // 指标配置
  metrics: {
    enableDatabaseMetrics: boolean;
    enableCacheMetrics: boolean;
    enableMemoryMetrics: boolean;
    enableCPUMetrics: boolean;
  };
  
  // 阈值配置
  thresholds: {
    slowQueryMs: number;
    highMemoryMB: number;
    highCPUPercent: number;
  };
  
  // 报告配置
  reporting: {
    interval: number;
    retentionDays: number;
    enableAlerts: boolean;
  };
}

/**
 * 安全配置接口
 */
export interface ISecurityConfig {
  // 加密配置
  encryption: {
    enabled: boolean;
    algorithm?: string;
    keySize?: number;
    saltRounds?: number;
  };
  
  // 访问控制
  accessControl: {
    enableRBAC: boolean;
    defaultRole?: string;
    sessionTimeout?: number;
  };
  
  // 审计配置
  audit: {
    enabled: boolean;
    logLevel: 'minimal' | 'standard' | 'detailed';
    retentionDays: number;
  };
  
  // 限流配置
  rateLimit: {
    enabled: boolean;
    maxRequests: number;
    windowMs: number;
    skipSuccessfulRequests?: boolean;
  };
}

/**
 * 业务规则配置接口
 */
export interface IBusinessRuleConfig {
  // 人物配置
  character: {
    maxNameLength: number;
    minNameLength: number;
    allowedGenders: string[];
    maxRealmLevel: number;
    defaultCultivationState: string;
  };
  
  // 修炼配置
  cultivation: {
    baseSpeed: number;
    speedMultiplier: number;
    breakthroughFailureRate: number;
    maxBreakthroughAttempts: number;
  };
  
  // 宗门配置
  zongmen: {
    maxMembersPerZongmen: number;
    minRealmToJoin: number;
    contributionDecayRate: number;
  };
  
  // 物品配置
  items: {
    maxStackSize: number;
    defaultDurability: number;
    repairCostMultiplier: number;
  };
  
  // 货币配置
  currency: {
    exchangeRates: Record<string, number>;
    maxTransactionAmount: number;
    transactionFeeRate: number;
  };
}

/**
 * 开发配置接口
 */
export interface IDevelopmentConfig {
  // 调试配置
  debug: {
    enabled: boolean;
    verboseLogging: boolean;
    enableProfiler: boolean;
    showStackTrace: boolean;
  };
  
  // 测试配置
  testing: {
    enableTestData: boolean;
    resetDatabaseOnStart: boolean;
    mockExternalServices: boolean;
  };
  
  // 热重载配置
  hotReload: {
    enabled: boolean;
    watchPaths: string[];
    excludePaths: string[];
  };
}

/**
 * 主配置接口
 */
export interface IApplicationConfig {
  // 环境配置
  environment: 'development' | 'testing' | 'staging' | 'production';
  version: string;
  
  // 子配置
  database: IDatabaseConfig;
  cache: ICacheConfig;
  logging: ILogConfig;
  performance: IPerformanceConfig;
  security: ISecurityConfig;
  businessRules: IBusinessRuleConfig;
  development?: IDevelopmentConfig;
  
  // 自定义配置
  custom?: Record<string, any>;
}

/**
 * 配置提供者接口
 */
export interface IConfigProvider {
  get<T>(key: string): T;
  set<T>(key: string, value: T): void;
  has(key: string): boolean;
  getAll(): IApplicationConfig;
  reload(): Promise<void>;
  watch(key: string, callback: (newValue: any, oldValue: any) => void): void;
  unwatch(key: string, callback?: (newValue: any, oldValue: any) => void): void;
}

/**
 * 配置验证器接口
 */
export interface IConfigValidator {
  validate(config: IApplicationConfig): ValidationResult;
  validateSection<T>(sectionName: string, config: T): ValidationResult;
}

/**
 * 配置验证结果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ConfigValidationError[];
  warnings: ConfigValidationWarning[];
}

/**
 * 配置验证错误
 */
export interface ConfigValidationError {
  path: string;
  message: string;
  value: any;
  expectedType?: string;
}

/**
 * 配置验证警告
 */
export interface ConfigValidationWarning {
  path: string;
  message: string;
  value: any;
  suggestion?: string;
}

/**
 * 配置加载器接口
 */
export interface IConfigLoader {
  load(source: string): Promise<IApplicationConfig>;
  loadFromFile(filePath: string): Promise<IApplicationConfig>;
  loadFromEnvironment(): Promise<Partial<IApplicationConfig>>;
  loadFromObject(obj: any): Promise<IApplicationConfig>;
}

/**
 * 配置合并器接口
 */
export interface IConfigMerger {
  merge(...configs: Partial<IApplicationConfig>[]): IApplicationConfig;
  mergeWithDefaults(config: Partial<IApplicationConfig>): IApplicationConfig;
}

/**
 * 配置监听器接口
 */
export interface IConfigWatcher {
  watch(filePath: string, callback: (config: IApplicationConfig) => void): void;
  unwatch(filePath: string): void;
  isWatching(filePath: string): boolean;
}

/**
 * 配置管理器接口
 */
export interface IConfigManager {
  // 基础操作
  initialize(sources: string[]): Promise<void>;
  getConfig(): IApplicationConfig;
  updateConfig(updates: Partial<IApplicationConfig>): Promise<void>;
  reloadConfig(): Promise<void>;
  
  // 监听操作
  onConfigChange(callback: (config: IApplicationConfig) => void): void;
  offConfigChange(callback: (config: IApplicationConfig) => void): void;
  
  // 验证操作
  validateConfig(): ValidationResult;
  
  // 导入导出
  exportConfig(format: 'json' | 'yaml' | 'toml'): string;
  importConfig(data: string, format: 'json' | 'yaml' | 'toml'): Promise<void>;
}

/**
 * 默认配置常量
 */
export const DEFAULT_CONFIG: IApplicationConfig = {
  environment: 'development',
  version: '1.0.0',
  
  database: {
    filename: './data/game.db',
    verbose: false,
    timeout: 5000,
    busyTimeout: 30000,
    cacheSize: 2000,
    pageSize: 4096,
    maxConnections: 10,
    enableWAL: true,
    enableForeignKeys: true,
    enableTriggers: true,
    autoBackup: true,
    backupInterval: 3600000, // 1 hour
    backupRetention: 7, // 7 days
    backupPath: './backups',
    enableQueryLogging: false,
    slowQueryThreshold: 1000
  },
  
  cache: {
    enabled: true,
    provider: 'memory',
    maxSize: 1000,
    defaultTTL: 300000 // 5 minutes
  },
  
  logging: {
    level: 'info',
    enableConsole: true,
    enableFile: true,
    file: {
      filename: './logs/app.log',
      maxSize: '10m',
      maxFiles: 5,
      datePattern: 'YYYY-MM-DD'
    },
    format: {
      timestamp: true,
      level: true,
      message: true,
      meta: true,
      stack: true
    }
  },
  
  performance: {
    enabled: true,
    sampleRate: 0.1,
    metrics: {
      enableDatabaseMetrics: true,
      enableCacheMetrics: true,
      enableMemoryMetrics: true,
      enableCPUMetrics: true
    },
    thresholds: {
      slowQueryMs: 1000,
      highMemoryMB: 512,
      highCPUPercent: 80
    },
    reporting: {
      interval: 60000, // 1 minute
      retentionDays: 30,
      enableAlerts: true
    }
  },
  
  security: {
    encryption: {
      enabled: false,
      algorithm: 'aes-256-gcm',
      keySize: 256,
      saltRounds: 12
    },
    accessControl: {
      enableRBAC: false,
      defaultRole: 'user',
      sessionTimeout: 3600000 // 1 hour
    },
    audit: {
      enabled: false,
      logLevel: 'standard',
      retentionDays: 90
    },
    rateLimit: {
      enabled: false,
      maxRequests: 100,
      windowMs: 60000, // 1 minute
      skipSuccessfulRequests: true
    }
  },
  
  businessRules: {
    character: {
      maxNameLength: 20,
      minNameLength: 1,
      allowedGenders: ['男', '女', '其他'],
      maxRealmLevel: 63,
      defaultCultivationState: '未修练'
    },
    cultivation: {
      baseSpeed: 1,
      speedMultiplier: 1.5,
      breakthroughFailureRate: 0.1,
      maxBreakthroughAttempts: 3
    },
    zongmen: {
      maxMembersPerZongmen: 1000,
      minRealmToJoin: 5,
      contributionDecayRate: 0.01
    },
    items: {
      maxStackSize: 999,
      defaultDurability: 100,
      repairCostMultiplier: 0.1
    },
    currency: {
      exchangeRates: {
        'copper_to_silver': 100,
        'silver_to_gold': 100,
        'gold_to_spirit_stone': 1000
      },
      maxTransactionAmount: 1000000,
      transactionFeeRate: 0.01
    }
  }
};

/**
 * 配置路径常量
 */
export const CONFIG_PATHS = {
  DATABASE: 'database',
  CACHE: 'cache',
  LOGGING: 'logging',
  PERFORMANCE: 'performance',
  SECURITY: 'security',
  BUSINESS_RULES: 'businessRules',
  DEVELOPMENT: 'development'
} as const;

/**
 * 环境变量映射
 */
export const ENV_MAPPINGS = {
  NODE_ENV: 'environment',
  DB_FILENAME: 'database.filename',
  DB_VERBOSE: 'database.verbose',
  CACHE_ENABLED: 'cache.enabled',
  LOG_LEVEL: 'logging.level',
  PERFORMANCE_ENABLED: 'performance.enabled'
} as const;