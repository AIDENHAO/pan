/**
 * 事件系统接口定义
 * 定义事件发布订阅、事件处理和事件流相关的接口
 */

import { CharacterBaseInfo, CharacterItems, CharacterCurrency } from './types';

/**
 * 基础事件接口
 */
export interface IBaseEvent {
  id: string;
  type: string;
  timestamp: Date;
  source: string;
  version: string;
  correlationId?: string;
  causationId?: string;
  metadata?: Record<string, any>;
}

/**
 * 领域事件接口
 */
export interface IDomainEvent<T = any> extends IBaseEvent {
  aggregateId: string;
  aggregateType: string;
  aggregateVersion: number;
  data: T;
}

/**
 * 人物相关事件数据类型
 */
export interface CharacterCreatedEventData {
  characterUuid: string;
  characterName: string;
  characterGender: string;
  realmLevel: number;
  createdBy?: string;
}

export interface CharacterUpdatedEventData {
  characterUuid: string;
  previousData: Partial<CharacterBaseInfo>;
  newData: Partial<CharacterBaseInfo>;
  updatedFields: string[];
  updatedBy?: string;
}

export interface CharacterDeletedEventData {
  characterUuid: string;
  characterName: string;
  deletedBy?: string;
  deletionReason?: string;
}

export interface CharacterRealmBreakthroughEventData {
  characterUuid: string;
  previousRealm: number;
  newRealm: number;
  breakthroughType: 'success' | 'failure';
  attempts: number;
}

export interface CharacterCultivationStateChangedEventData {
  characterUuid: string;
  previousState: string;
  newState: string;
  cultivationValue: number;
  stateChangedAt: Date;
}

/**
 * 宗门相关事件数据类型
 */
export interface CharacterJoinedZongmenEventData {
  characterUuid: string;
  zongmenId: string;
  joinDate: Date;
  initialTitle?: string;
}

export interface CharacterLeftZongmenEventData {
  characterUuid: string;
  zongmenId: string;
  leaveDate: Date;
  reason?: string;
}

export interface ZongmenTitleChangedEventData {
  characterUuid: string;
  zongmenId: string;
  previousTitle?: string;
  newTitle: string;
  titleType: string;
  changedBy?: string;
}

/**
 * 物品相关事件数据类型
 */
export interface ItemAddedToInventoryEventData {
  characterUuid: string;
  itemId: string;
  characterItemsId: string;
  itemCount: number;
  itemLevel: number;
  addedBy?: string;
}

export interface ItemRemovedFromInventoryEventData {
  characterUuid: string;
  itemId: string;
  characterItemsId: string;
  itemCount: number;
  removedBy?: string;
  removalReason?: string;
}

export interface ItemEquippedEventData {
  characterUuid: string;
  itemId: string;
  characterItemsId: string;
  slotPosition: number;
  previousItem?: string;
}

export interface ItemUnequippedEventData {
  characterUuid: string;
  itemId: string;
  characterItemsId: string;
  slotPosition: number;
}

export interface ItemUpgradedEventData {
  characterUuid: string;
  itemId: string;
  characterItemsId: string;
  previousLevel: number;
  newLevel: number;
  upgradeCost?: Record<string, number>;
}

/**
 * 货币相关事件数据类型
 */
export interface CurrencyChangedEventData {
  characterUuid: string;
  currencyType: string;
  previousAmount: number;
  newAmount: number;
  changeAmount: number;
  changeReason: string;
  transactionId?: string;
}

export interface CurrencyTransactionEventData {
  transactionId: string;
  fromCharacterUuid?: string;
  toCharacterUuid?: string;
  currencyType: string;
  amount: number;
  transactionType: 'transfer' | 'earn' | 'spend' | 'exchange';
  description?: string;
}

/**
 * 系统相关事件数据类型
 */
export interface DatabaseBackupEventData {
  backupPath: string;
  backupSize: number;
  duration: number;
  success: boolean;
  error?: string;
}

export interface DatabaseRestoreEventData {
  backupPath: string;
  restoreSize: number;
  duration: number;
  success: boolean;
  error?: string;
}

export interface PerformanceMetricEventData {
  metricName: string;
  value: number;
  unit: string;
  tags?: Record<string, string>;
  threshold?: number;
  isAlert: boolean;
}

/**
 * 具体事件类型定义
 */
export type CharacterCreatedEvent = IDomainEvent<CharacterCreatedEventData>;
export type CharacterUpdatedEvent = IDomainEvent<CharacterUpdatedEventData>;
export type CharacterDeletedEvent = IDomainEvent<CharacterDeletedEventData>;
export type CharacterRealmBreakthroughEvent = IDomainEvent<CharacterRealmBreakthroughEventData>;
export type CharacterCultivationStateChangedEvent = IDomainEvent<CharacterCultivationStateChangedEventData>;

export type CharacterJoinedZongmenEvent = IDomainEvent<CharacterJoinedZongmenEventData>;
export type CharacterLeftZongmenEvent = IDomainEvent<CharacterLeftZongmenEventData>;
export type ZongmenTitleChangedEvent = IDomainEvent<ZongmenTitleChangedEventData>;

export type ItemAddedToInventoryEvent = IDomainEvent<ItemAddedToInventoryEventData>;
export type ItemRemovedFromInventoryEvent = IDomainEvent<ItemRemovedFromInventoryEventData>;
export type ItemEquippedEvent = IDomainEvent<ItemEquippedEventData>;
export type ItemUnequippedEvent = IDomainEvent<ItemUnequippedEventData>;
export type ItemUpgradedEvent = IDomainEvent<ItemUpgradedEventData>;

export type CurrencyChangedEvent = IDomainEvent<CurrencyChangedEventData>;
export type CurrencyTransactionEvent = IDomainEvent<CurrencyTransactionEventData>;

export type DatabaseBackupEvent = IDomainEvent<DatabaseBackupEventData>;
export type DatabaseRestoreEvent = IDomainEvent<DatabaseRestoreEventData>;
export type PerformanceMetricEvent = IDomainEvent<PerformanceMetricEventData>;

/**
 * 联合事件类型
 */
export type DomainEvent = 
  | CharacterCreatedEvent
  | CharacterUpdatedEvent
  | CharacterDeletedEvent
  | CharacterRealmBreakthroughEvent
  | CharacterCultivationStateChangedEvent
  | CharacterJoinedZongmenEvent
  | CharacterLeftZongmenEvent
  | ZongmenTitleChangedEvent
  | ItemAddedToInventoryEvent
  | ItemRemovedFromInventoryEvent
  | ItemEquippedEvent
  | ItemUnequippedEvent
  | ItemUpgradedEvent
  | CurrencyChangedEvent
  | CurrencyTransactionEvent
  | DatabaseBackupEvent
  | DatabaseRestoreEvent
  | PerformanceMetricEvent;

/**
 * 事件处理器接口
 */
export interface IEventHandler<T extends IDomainEvent = IDomainEvent> {
  handle(event: T): Promise<void>;
  canHandle(event: IDomainEvent): boolean;
  getEventType(): string;
  getPriority(): number;
}

/**
 * 事件发布器接口
 */
export interface IEventPublisher {
  publish(event: IDomainEvent): Promise<void>;
  publishBatch(events: IDomainEvent[]): Promise<void>;
  publishAsync(event: IDomainEvent): void;
}

/**
 * 事件订阅器接口
 */
export interface IEventSubscriber {
  subscribe<T extends IDomainEvent>(eventType: string, handler: IEventHandler<T>): void;
  unsubscribe(eventType: string, handler?: IEventHandler): void;
  getSubscriptions(eventType?: string): IEventHandler[];
}

/**
 * 事件总线接口
 */
export interface IEventBus extends IEventPublisher, IEventSubscriber {
  start(): Promise<void>;
  stop(): Promise<void>;
  isRunning(): boolean;
  getEventCount(): number;
  clearEvents(): void;
}

/**
 * 事件存储接口
 */
export interface IEventStore {
  append(event: IDomainEvent): Promise<void>;
  appendBatch(events: IDomainEvent[]): Promise<void>;
  getEvents(aggregateId: string, fromVersion?: number): Promise<IDomainEvent[]>;
  getEventsByType(eventType: string, limit?: number, offset?: number): Promise<IDomainEvent[]>;
  getEventsByTimeRange(start: Date, end: Date, limit?: number, offset?: number): Promise<IDomainEvent[]>;
  getLastEvent(aggregateId: string): Promise<IDomainEvent | null>;
  deleteEvents(aggregateId: string, toVersion?: number): Promise<number>;
  getEventCount(aggregateId?: string): Promise<number>;
}

/**
 * 事件快照接口
 */
export interface IEventSnapshot {
  aggregateId: string;
  aggregateType: string;
  version: number;
  data: any;
  timestamp: Date;
}

/**
 * 事件快照存储接口
 */
export interface ISnapshotStore {
  save(snapshot: IEventSnapshot): Promise<void>;
  load(aggregateId: string): Promise<IEventSnapshot | null>;
  delete(aggregateId: string): Promise<boolean>;
  getLatestSnapshot(aggregateType: string): Promise<IEventSnapshot | null>;
}

/**
 * 事件重放接口
 */
export interface IEventReplayer {
  replay(aggregateId: string, fromVersion?: number, toVersion?: number): Promise<any>;
  replayAll(aggregateType: string): Promise<any[]>;
  replayByTimeRange(start: Date, end: Date): Promise<IDomainEvent[]>;
}

/**
 * 事件投影接口
 */
export interface IEventProjection {
  project(event: IDomainEvent): Promise<void>;
  rebuild(): Promise<void>;
  getProjectionName(): string;
  getLastProcessedEventId(): Promise<string | null>;
  setLastProcessedEventId(eventId: string): Promise<void>;
}

/**
 * 事件投影管理器接口
 */
export interface IProjectionManager {
  register(projection: IEventProjection): void;
  unregister(projectionName: string): void;
  start(): Promise<void>;
  stop(): Promise<void>;
  rebuild(projectionName?: string): Promise<void>;
  getProjections(): IEventProjection[];
}

/**
 * 事件流接口
 */
export interface IEventStream {
  subscribe(handler: (event: IDomainEvent) => void): string;
  unsubscribe(subscriptionId: string): void;
  filter(predicate: (event: IDomainEvent) => boolean): IEventStream;
  map<T>(mapper: (event: IDomainEvent) => T): IEventStream;
  take(count: number): IEventStream;
  skip(count: number): IEventStream;
}

/**
 * 事件聚合器接口
 */
export interface IEventAggregator {
  aggregate(events: IDomainEvent[]): any;
  getAggregateType(): string;
  getInitialState(): any;
}

/**
 * 事件中间件接口
 */
export interface IEventMiddleware {
  process(event: IDomainEvent, next: (event: IDomainEvent) => Promise<void>): Promise<void>;
  getPriority(): number;
}

/**
 * 事件过滤器接口
 */
export interface IEventFilter {
  filter(event: IDomainEvent): boolean;
  getFilterName(): string;
}

/**
 * 事件转换器接口
 */
export interface IEventTransformer {
  transform(event: IDomainEvent): IDomainEvent;
  canTransform(event: IDomainEvent): boolean;
}

/**
 * 事件验证器接口
 */
export interface IEventValidator {
  validate(event: IDomainEvent): { isValid: boolean; errors: string[] };
  getValidationRules(): Record<string, any>;
}

/**
 * 事件序列化器接口
 */
export interface IEventSerializer {
  serialize(event: IDomainEvent): string;
  deserialize(data: string): IDomainEvent;
  getContentType(): string;
}

/**
 * 事件配置接口
 */
export interface IEventConfig {
  // 基础配置
  enabled: boolean;
  batchSize: number;
  maxRetries: number;
  retryDelay: number;
  
  // 存储配置
  storage: {
    type: 'memory' | 'file' | 'database';
    connectionString?: string;
    retentionDays?: number;
    compressionEnabled?: boolean;
  };
  
  // 性能配置
  performance: {
    enableAsync: boolean;
    maxConcurrentHandlers: number;
    handlerTimeout: number;
    enableMetrics: boolean;
  };
  
  // 错误处理配置
  errorHandling: {
    enableDeadLetterQueue: boolean;
    maxDeadLetterRetries: number;
    enableErrorNotification: boolean;
  };
  
  // 快照配置
  snapshots: {
    enabled: boolean;
    frequency: number;
    retentionCount: number;
  };
}

/**
 * 事件统计接口
 */
export interface IEventStatistics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsByHour: Array<{ hour: string; count: number }>;
  averageProcessingTime: number;
  failedEvents: number;
  retryCount: number;
}

/**
 * 事件监控接口
 */
export interface IEventMonitor {
  getStatistics(timeRange?: { start: Date; end: Date }): Promise<IEventStatistics>;
  getFailedEvents(limit?: number): Promise<IDomainEvent[]>;
  retryFailedEvent(eventId: string): Promise<boolean>;
  getEventProcessingTime(eventType: string): Promise<number>;
}

/**
 * 事件常量
 */
export const EVENT_TYPES = {
  // 人物事件
  CHARACTER_CREATED: 'character.created',
  CHARACTER_UPDATED: 'character.updated',
  CHARACTER_DELETED: 'character.deleted',
  CHARACTER_REALM_BREAKTHROUGH: 'character.realm.breakthrough',
  CHARACTER_CULTIVATION_STATE_CHANGED: 'character.cultivation.state.changed',
  
  // 宗门事件
  CHARACTER_JOINED_ZONGMEN: 'character.zongmen.joined',
  CHARACTER_LEFT_ZONGMEN: 'character.zongmen.left',
  ZONGMEN_TITLE_CHANGED: 'zongmen.title.changed',
  
  // 物品事件
  ITEM_ADDED_TO_INVENTORY: 'item.inventory.added',
  ITEM_REMOVED_FROM_INVENTORY: 'item.inventory.removed',
  ITEM_EQUIPPED: 'item.equipped',
  ITEM_UNEQUIPPED: 'item.unequipped',
  ITEM_UPGRADED: 'item.upgraded',
  
  // 货币事件
  CURRENCY_CHANGED: 'currency.changed',
  CURRENCY_TRANSACTION: 'currency.transaction',
  
  // 系统事件
  DATABASE_BACKUP: 'database.backup',
  DATABASE_RESTORE: 'database.restore',
  PERFORMANCE_METRIC: 'performance.metric'
} as const;

/**
 * 事件优先级
 */
export enum EventPriority {
  LOW = 1,
  NORMAL = 5,
  HIGH = 10,
  CRITICAL = 20
}

/**
 * 事件状态
 */
export enum EventStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  RETRYING = 'retrying',
  DEAD_LETTER = 'dead_letter'
}