/**
 * API接口定义
 * 定义前后端交互的API接口规范
 */

import { CharacterBaseInfo, CharacterAffinities, CharacterStrength, CharacterBodyTypes, CharacterSkills, CharacterWeapons, CharacterCurrency, CharacterItems, PaginatedResult, QueryOptions } from './types';
import { ApplicationError } from './errors';

/**
 * API响应基础接口
 */
export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId?: string;
}

/**
 * API分页响应接口
 */
export interface IApiPaginatedResponse<T> extends IApiResponse<PaginatedResult<T>> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * API请求基础接口
 */
export interface IApiRequest {
  requestId?: string;
  timestamp?: string;
  clientVersion?: string;
}

/**
 * 人物管理API接口
 */
export interface ICharacterApi {
  // 创建人物
  createCharacter(request: CreateCharacterRequest): Promise<IApiResponse<CreateCharacterResponse>>;
  
  // 获取人物信息
  getCharacter(characterUuid: string): Promise<IApiResponse<GetCharacterResponse>>;
  
  // 更新人物信息
  updateCharacter(characterUuid: string, request: UpdateCharacterRequest): Promise<IApiResponse<UpdateCharacterResponse>>;
  
  // 删除人物
  deleteCharacter(characterUuid: string): Promise<IApiResponse<DeleteCharacterResponse>>;
  
  // 获取人物列表
  getCharacters(request: GetCharactersRequest): Promise<IApiPaginatedResponse<CharacterSummary>>;
  
  // 搜索人物
  searchCharacters(request: SearchCharactersRequest): Promise<IApiPaginatedResponse<CharacterSummary>>;
}

/**
 * 人物属性API接口
 */
export interface ICharacterAttributesApi {
  // 获取人物亲和度
  getAffinities(characterUuid: string): Promise<IApiResponse<CharacterAffinities>>;
  
  // 更新人物亲和度
  updateAffinities(characterUuid: string, request: UpdateAffinitiesRequest): Promise<IApiResponse<CharacterAffinities>>;
  
  // 获取人物强度
  getStrength(characterUuid: string): Promise<IApiResponse<CharacterStrength>>;
  
  // 更新人物强度
  updateStrength(characterUuid: string, request: UpdateStrengthRequest): Promise<IApiResponse<CharacterStrength>>;
  
  // 获取人物体质
  getBodyTypes(characterUuid: string): Promise<IApiResponse<CharacterBodyTypes>>;
  
  // 更新人物体质
  updateBodyTypes(characterUuid: string, request: UpdateBodyTypesRequest): Promise<IApiResponse<CharacterBodyTypes>>;
  
  // 获取人物技能
  getSkills(characterUuid: string): Promise<IApiResponse<CharacterSkills>>;
  
  // 更新人物技能
  updateSkills(characterUuid: string, request: UpdateSkillsRequest): Promise<IApiResponse<CharacterSkills>>;
  
  // 获取人物武器
  getWeapons(characterUuid: string): Promise<IApiResponse<CharacterWeapons>>;
  
  // 更新人物武器
  updateWeapons(characterUuid: string, request: UpdateWeaponsRequest): Promise<IApiResponse<CharacterWeapons>>;
}

/**
 * 背包管理API接口
 */
export interface IInventoryApi {
  // 获取背包物品
  getInventory(characterUuid: string, request?: GetInventoryRequest): Promise<IApiPaginatedResponse<CharacterItems>>;
  
  // 添加物品到背包
  addItem(characterUuid: string, request: AddItemRequest): Promise<IApiResponse<AddItemResponse>>;
  
  // 从背包移除物品
  removeItem(characterItemsId: string, request: RemoveItemRequest): Promise<IApiResponse<RemoveItemResponse>>;
  
  // 更新背包物品
  updateItem(characterItemsId: string, request: UpdateItemRequest): Promise<IApiResponse<UpdateItemResponse>>;
  
  // 装备物品
  equipItem(characterUuid: string, request: EquipItemRequest): Promise<IApiResponse<EquipItemResponse>>;
  
  // 卸下装备
  unequipItem(characterUuid: string, request: UnequipItemRequest): Promise<IApiResponse<UnequipItemResponse>>;
  
  // 获取已装备物品
  getEquippedItems(characterUuid: string): Promise<IApiResponse<CharacterItems[]>>;
}

/**
 * 货币管理API接口
 */
export interface ICurrencyApi {
  // 获取货币信息
  getCurrency(characterUuid: string): Promise<IApiResponse<CharacterCurrency>>;
  
  // 更新货币
  updateCurrency(characterUuid: string, request: UpdateCurrencyRequest): Promise<IApiResponse<CharacterCurrency>>;
  
  // 货币交易
  transferCurrency(request: TransferCurrencyRequest): Promise<IApiResponse<TransferCurrencyResponse>>;
  
  // 货币兑换
  exchangeCurrency(characterUuid: string, request: ExchangeCurrencyRequest): Promise<IApiResponse<ExchangeCurrencyResponse>>;
}

/**
 * 修炼系统API接口
 */
export interface ICultivationApi {
  // 开始修炼
  startCultivation(characterUuid: string): Promise<IApiResponse<CultivationResponse>>;
  
  // 停止修炼
  stopCultivation(characterUuid: string): Promise<IApiResponse<CultivationResponse>>;
  
  // 尝试突破
  attemptBreakthrough(characterUuid: string): Promise<IApiResponse<BreakthroughResponse>>;
  
  // 获取修炼状态
  getCultivationStatus(characterUuid: string): Promise<IApiResponse<CultivationStatusResponse>>;
}

/**
 * 宗门系统API接口
 */
export interface IZongmenApi {
  // 加入宗门
  joinZongmen(characterUuid: string, request: JoinZongmenRequest): Promise<IApiResponse<JoinZongmenResponse>>;
  
  // 离开宗门
  leaveZongmen(characterUuid: string): Promise<IApiResponse<LeaveZongmenResponse>>;
  
  // 更新宗门职位
  updateZongmenTitle(characterUuid: string, request: UpdateZongmenTitleRequest): Promise<IApiResponse<UpdateZongmenTitleResponse>>;
  
  // 获取宗门信息
  getZongmenInfo(zongmenId: string): Promise<IApiResponse<ZongmenInfoResponse>>;
  
  // 获取宗门成员
  getZongmenMembers(zongmenId: string, request?: GetZongmenMembersRequest): Promise<IApiPaginatedResponse<ZongmenMember>>;
}

/**
 * 统计分析API接口
 */
export interface IStatisticsApi {
  // 获取人物统计
  getCharacterStatistics(): Promise<IApiResponse<CharacterStatistics>>;
  
  // 获取境界分布
  getRealmDistribution(): Promise<IApiResponse<RealmDistribution>>;
  
  // 获取宗门统计
  getZongmenStatistics(): Promise<IApiResponse<ZongmenStatistics>>;
  
  // 获取物品统计
  getItemStatistics(): Promise<IApiResponse<ItemStatistics>>;
}

/**
 * 系统管理API接口
 */
export interface ISystemApi {
  // 获取系统状态
  getSystemStatus(): Promise<IApiResponse<SystemStatus>>;
  
  // 数据库备份
  backupDatabase(request: BackupDatabaseRequest): Promise<IApiResponse<BackupDatabaseResponse>>;
  
  // 数据库恢复
  restoreDatabase(request: RestoreDatabaseRequest): Promise<IApiResponse<RestoreDatabaseResponse>>;
  
  // 验证数据库完整性
  validateDatabase(): Promise<IApiResponse<ValidateDatabaseResponse>>;
  
  // 获取性能指标
  getPerformanceMetrics(request?: GetPerformanceMetricsRequest): Promise<IApiResponse<PerformanceMetrics>>;
}

/**
 * 请求数据类型定义
 */
export interface CreateCharacterRequest extends IApiRequest {
  characterName: string;
  characterGender: '男' | '女' | '其他';
  characterBirthday?: string;
  characterDaoHao?: string;
  characterPhysicalAttributes?: '金' | '木' | '水' | '火' | '土';
}

export interface UpdateCharacterRequest extends IApiRequest {
  characterName?: string;
  characterDaoHao?: string;
  cultivatingState?: '未修练' | '正在修炼' | '闭关中' | '受伤修炼中' | '顿悟中';
  cultivationOverLimit?: boolean;
}

export interface GetCharactersRequest extends IApiRequest {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  realmLevel?: number;
  zongmenId?: string;
  cultivatingState?: string;
}

export interface SearchCharactersRequest extends IApiRequest {
  searchTerm: string;
  page?: number;
  pageSize?: number;
  searchFields?: string[];
}

export interface UpdateAffinitiesRequest extends IApiRequest {
  metalAffinity?: number;
  woodAffinity?: number;
  waterAffinity?: number;
  fireAffinity?: number;
  earthAffinity?: number;
}

export interface UpdateStrengthRequest extends IApiRequest {
  physicalStrength?: number;
  spiritualStrength?: number;
  soulStrength?: number;
  bloodCurrent?: number;
  spiritualCurrent?: number;
  mentalCurrent?: number;
}

export interface UpdateBodyTypesRequest extends IApiRequest {
  bodyType1Id?: string;
  bodyType2Id?: string;
  bodyType3Id?: string;
  bodyType4Id?: string;
  bodyType5Id?: string;
}

export interface UpdateSkillsRequest extends IApiRequest {
  skill1Id?: string;
  skill2Id?: string;
  skill3Id?: string;
  skill4Id?: string;
  skill5Id?: string;
  skill6Id?: string;
  skill7Id?: string;
  skill8Id?: string;
  skill9Id?: string;
  skill10Id?: string;
}

export interface UpdateWeaponsRequest extends IApiRequest {
  weapon1Id?: string;
  weapon2Id?: string;
  weapon3Id?: string;
  weapon4Id?: string;
  weapon5Id?: string;
}

export interface GetInventoryRequest extends IApiRequest {
  page?: number;
  pageSize?: number;
  itemType?: string;
  isEquipped?: boolean;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export interface AddItemRequest extends IApiRequest {
  itemId: string;
  itemCount: number;
  itemLevel?: number;
}

export interface RemoveItemRequest extends IApiRequest {
  itemCount?: number;
  reason?: string;
}

export interface UpdateItemRequest extends IApiRequest {
  itemCount?: number;
  itemLevel?: number;
  durability?: number;
}

export interface EquipItemRequest extends IApiRequest {
  characterItemsId: string;
  slotPosition: number;
}

export interface UnequipItemRequest extends IApiRequest {
  slotPosition: number;
}

export interface UpdateCurrencyRequest extends IApiRequest {
  copperCoin?: number;
  silverCoin?: number;
  goldCoin?: number;
  lowSpiritStone?: number;
  mediumSpiritStone?: number;
  highSpiritStone?: number;
  zongmenContribution?: number;
  regionContribution?: number;
  worldContribution?: number;
}

export interface TransferCurrencyRequest extends IApiRequest {
  fromCharacterUuid: string;
  toCharacterUuid: string;
  currencyType: string;
  amount: number;
  description?: string;
}

export interface ExchangeCurrencyRequest extends IApiRequest {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

export interface JoinZongmenRequest extends IApiRequest {
  zongmenId: string;
}

export interface UpdateZongmenTitleRequest extends IApiRequest {
  titleType: 'title_1_id' | 'title_2_id';
  newTitle: string;
}

export interface GetZongmenMembersRequest extends IApiRequest {
  page?: number;
  pageSize?: number;
  titleFilter?: string;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export interface BackupDatabaseRequest extends IApiRequest {
  backupPath?: string;
  includeTestData?: boolean;
}

export interface RestoreDatabaseRequest extends IApiRequest {
  backupPath: string;
  overwriteExisting?: boolean;
}

export interface GetPerformanceMetricsRequest extends IApiRequest {
  startTime?: string;
  endTime?: string;
  metricTypes?: string[];
}

/**
 * 响应数据类型定义
 */
export interface CreateCharacterResponse {
  characterUuid: string;
  characterName: string;
  createdAt: string;
}

export interface GetCharacterResponse {
  character: CharacterBaseInfo;
  affinities?: CharacterAffinities;
  strength?: CharacterStrength;
  bodyTypes?: CharacterBodyTypes;
  skills?: CharacterSkills;
  weapons?: CharacterWeapons;
  currency?: CharacterCurrency;
}

export interface UpdateCharacterResponse {
  characterUuid: string;
  updatedFields: string[];
  updatedAt: string;
}

export interface DeleteCharacterResponse {
  characterUuid: string;
  deletedAt: string;
}

export interface CharacterSummary {
  characterUuid: string;
  characterName: string;
  characterGender: string;
  characterRealmLevel: number;
  cultivatingState: string;
  zongmenName?: string;
  combatPower?: number;
  createTime: string;
  updateTime: string;
}

export interface AddItemResponse {
  characterItemsId: string;
  itemId: string;
  itemCount: number;
  addedAt: string;
}

export interface RemoveItemResponse {
  characterItemsId: string;
  removedCount: number;
  removedAt: string;
}

export interface UpdateItemResponse {
  characterItemsId: string;
  updatedFields: string[];
  updatedAt: string;
}

export interface EquipItemResponse {
  characterItemsId: string;
  slotPosition: number;
  previousItem?: string;
  equippedAt: string;
}

export interface UnequipItemResponse {
  slotPosition: number;
  unequippedItem: string;
  unequippedAt: string;
}

export interface CultivationResponse {
  characterUuid: string;
  cultivatingState: string;
  cultivationValue: number;
  stateChangedAt: string;
}

export interface BreakthroughResponse {
  success: boolean;
  characterUuid: string;
  previousRealm: number;
  newRealm?: number;
  message: string;
  attemptedAt: string;
}

export interface CultivationStatusResponse {
  characterUuid: string;
  cultivatingState: string;
  cultivationValue: number;
  cultivationLimit: number;
  cultivationSpeed: number;
  breakthroughEnabled: boolean;
  breakthroughItemsEnabled: boolean;
  breakthroughFailCount: number;
}

export interface TransferCurrencyResponse {
  transactionId: string;
  fromCharacterUuid: string;
  toCharacterUuid: string;
  currencyType: string;
  amount: number;
  transferredAt: string;
}

export interface ExchangeCurrencyResponse {
  characterUuid: string;
  fromCurrency: string;
  toCurrency: string;
  exchangedAmount: number;
  receivedAmount: number;
  exchangeRate: number;
  exchangedAt: string;
}

export interface JoinZongmenResponse {
  characterUuid: string;
  zongmenId: string;
  zongmenName: string;
  initialTitle: string;
  joinedAt: string;
}

export interface LeaveZongmenResponse {
  characterUuid: string;
  zongmenId: string;
  leftAt: string;
}

export interface UpdateZongmenTitleResponse {
  characterUuid: string;
  titleType: string;
  previousTitle?: string;
  newTitle: string;
  updatedAt: string;
}

export interface ZongmenInfoResponse {
  zongmenId: string;
  zongmenName: string;
  description?: string;
  founder?: string;
  establishedDate?: string;
  realmLevelRequired: number;
  memberCount: number;
  averageRealm: number;
}

export interface ZongmenMember {
  characterUuid: string;
  characterName: string;
  realmLevel: number;
  title1Id?: string;
  title2Id?: string;
  joinDate: string;
  contribution: number;
}

export interface CharacterStatistics {
  totalCharacters: number;
  activeCharacters: number;
  averageRealm: number;
  genderDistribution: Record<string, number>;
  cultivationStateDistribution: Record<string, number>;
  topCharactersByRealm: CharacterSummary[];
}

export interface RealmDistribution {
  realmLevels: Array<{
    level: number;
    count: number;
    percentage: number;
  }>;
  majorRealms: Array<{
    majorRealm: string;
    count: number;
    percentage: number;
  }>;
}

export interface ZongmenStatistics {
  totalZongmens: number;
  totalMembers: number;
  averageMembersPerZongmen: number;
  topZongmensByMembers: Array<{
    zongmenId: string;
    zongmenName: string;
    memberCount: number;
    averageRealm: number;
  }>;
}

export interface ItemStatistics {
  totalItems: number;
  itemsByType: Record<string, number>;
  itemsByQuality: Record<string, number>;
  mostPopularItems: Array<{
    itemId: string;
    itemName: string;
    count: number;
  }>;
}

export interface SystemStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  database: {
    status: 'connected' | 'disconnected';
    size: number;
    lastBackup?: string;
  };
  cache: {
    status: 'enabled' | 'disabled';
    hitRate?: number;
    size?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  performance: {
    averageResponseTime: number;
    requestsPerSecond: number;
    errorRate: number;
  };
}

export interface BackupDatabaseResponse {
  backupPath: string;
  backupSize: number;
  duration: number;
  createdAt: string;
}

export interface RestoreDatabaseResponse {
  restoredFrom: string;
  duration: number;
  restoredAt: string;
}

export interface ValidateDatabaseResponse {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  checkedAt: string;
}

export interface PerformanceMetrics {
  timeRange: {
    start: string;
    end: string;
  };
  database: {
    queryCount: number;
    averageQueryTime: number;
    slowQueries: number;
  };
  cache: {
    hitCount: number;
    missCount: number;
    hitRate: number;
  };
  memory: {
    averageUsage: number;
    peakUsage: number;
  };
  requests: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
  };
}

/**
 * API错误代码
 */
export enum ApiErrorCodes {
  // 通用错误
  INVALID_REQUEST = 'INVALID_REQUEST',
  MISSING_PARAMETER = 'MISSING_PARAMETER',
  INVALID_PARAMETER = 'INVALID_PARAMETER',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // 人物相关错误
  CHARACTER_NOT_FOUND = 'CHARACTER_NOT_FOUND',
  CHARACTER_ALREADY_EXISTS = 'CHARACTER_ALREADY_EXISTS',
  INVALID_CHARACTER_DATA = 'INVALID_CHARACTER_DATA',
  
  // 物品相关错误
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  INSUFFICIENT_ITEMS = 'INSUFFICIENT_ITEMS',
  INVALID_ITEM_DATA = 'INVALID_ITEM_DATA',
  
  // 货币相关错误
  INSUFFICIENT_CURRENCY = 'INSUFFICIENT_CURRENCY',
  INVALID_CURRENCY_TYPE = 'INVALID_CURRENCY_TYPE',
  
  // 修炼相关错误
  CULTIVATION_NOT_ALLOWED = 'CULTIVATION_NOT_ALLOWED',
  BREAKTHROUGH_NOT_ALLOWED = 'BREAKTHROUGH_NOT_ALLOWED',
  
  // 宗门相关错误
  ZONGMEN_NOT_FOUND = 'ZONGMEN_NOT_FOUND',
  ALREADY_IN_ZONGMEN = 'ALREADY_IN_ZONGMEN',
  NOT_IN_ZONGMEN = 'NOT_IN_ZONGMEN',
  INSUFFICIENT_REALM_FOR_ZONGMEN = 'INSUFFICIENT_REALM_FOR_ZONGMEN'
}

/**
 * HTTP状态码映射
 */
export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

/**
 * API版本信息
 */
export const API_VERSION = {
  CURRENT: 'v1',
  SUPPORTED: ['v1'],
  DEPRECATED: []
} as const;

/**
 * API限制配置
 */
export const API_LIMITS = {
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 20,
  MAX_SEARCH_RESULTS: 1000,
  MAX_BATCH_SIZE: 50,
  REQUEST_TIMEOUT: 30000, // 30 seconds
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000
  }
} as const;