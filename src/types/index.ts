/**
 * 类型定义统一导出文件
 * 集中管理所有TypeScript类型定义
 * @author AI Assistant
 * @version 1.0
 * @date 2024-12-19
 */

// 导出人物数据相关类型
export type {
  IPeopleData,
  IPeopleDataFile,
  IPeopleDataMetadata,
  IBodyType,
  IElementalAffinity,
  ITitle,
  ISkills,
  IMoney
} from './peopleData';

// 导出枚举类型
export {
  RealmLevel,
  PhysicalAttributeLevel,
  PeopleDataValidator
} from './peopleData';

// 导出修炼方法相关类型
export type {
  CultivationMethod
} from './cultivationMethod';

// 导出JSON声明（如果存在）
// export * from './json.d';

// 重新导出常用类型别名
export type PersonId = string;
export type PersonName = string;
export type RealmLevelType = number;
export type TalentValueType = number;
export type CultivationValueType = number;
export type MoneyAmountType = number;

/**
 * 通用操作结果接口
 */
export interface IOperationResult<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  code?: string;
}

/**
 * 分页查询参数接口
 */
export interface IPaginationParams {
  page: number;          // 当前页码（从1开始）
  pageSize: number;      // 每页数量
  total?: number;        // 总数量
}

/**
 * 分页查询结果接口
 */
export interface IPaginationResult<T> {
  data: T[];             // 当前页数据
  pagination: {
    page: number;        // 当前页码
    pageSize: number;    // 每页数量
    total: number;       // 总数量
    totalPages: number;  // 总页数
    hasNext: boolean;    // 是否有下一页
    hasPrev: boolean;    // 是否有上一页
  };
}

/**
 * 排序方向枚举
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

/**
 * 通用排序参数接口
 */
export interface ISortParams {
  field: string;
  direction: SortDirection;
}

/**
 * 通用筛选参数接口
 */
export interface IFilterParams {
  [key: string]: any;
}

/**
 * API响应基础接口
 */
export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: number;
  timestamp?: string;
}

/**
 * 表单验证规则接口
 */
export interface IValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
  validator?: (value: any) => boolean | string;
}

/**
 * 表单字段配置接口
 */
export interface IFormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date';
  placeholder?: string;
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
  rules?: IValidationRule[];
  disabled?: boolean;
  hidden?: boolean;
}

/**
 * 主题配置接口
 */
export interface IThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  fontSize: {
    small: string;
    medium: string;
    large: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}

/**
 * 应用配置接口
 */
export interface IAppConfig {
  appName: string;
  version: string;
  apiBaseUrl: string;
  theme: IThemeConfig;
  features: {
    [featureName: string]: boolean;
  };
  debug: boolean;
}

/**
 * 用户权限枚举
 */
export enum UserPermission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin'
}

/**
 * 用户角色枚举
 */
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

/**
 * 用户信息接口
 */
export interface IUserInfo {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  permissions: UserPermission[];
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

/**
 * 导航菜单项接口
 */
export interface IMenuItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  children?: IMenuItem[];
  disabled?: boolean;
  hidden?: boolean;
  permission?: UserPermission;
}

/**
 * 通知消息接口
 */
export interface INotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  timestamp: string;
  read?: boolean;
}

/**
 * 模态框配置接口
 */
export interface IModalConfig {
  title: string;
  content: React.ReactNode;
  width?: number | string;
  height?: number | string;
  closable?: boolean;
  maskClosable?: boolean;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
}

/**
 * 表格列配置接口
 */
export interface ITableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  fixed?: 'left' | 'right';
}

/**
 * 表格配置接口
 */
export interface ITableConfig<T = any> {
  columns: ITableColumn<T>[];
  dataSource: T[];
  rowKey: string | ((record: T) => string);
  pagination?: IPaginationParams;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  bordered?: boolean;
  striped?: boolean;
  onRowClick?: (record: T, index: number) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
}

// 导出默认配置常量
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGINATION: IPaginationParams = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE
};

export const DEFAULT_SORT: ISortParams = {
  field: 'id',
  direction: SortDirection.ASC
};

/**
 * 常用正则表达式
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^1[3-9]\d{9}$/,
  ID_CARD: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  CHINESE: /^[\u4e00-\u9fa5]+$/,
  NUMBER: /^\d+$/,
  DECIMAL: /^\d+(\.\d+)?$/
};

/**
 * 错误代码常量
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT'
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

/**
 * 成功消息常量
 */
export const SUCCESS_MESSAGES = {
  CREATE_SUCCESS: '创建成功',
  UPDATE_SUCCESS: '更新成功',
  DELETE_SUCCESS: '删除成功',
  SAVE_SUCCESS: '保存成功',
  SUBMIT_SUCCESS: '提交成功',
  IMPORT_SUCCESS: '导入成功',
  EXPORT_SUCCESS: '导出成功'
} as const;

/**
 * 错误消息常量
 */
export const ERROR_MESSAGES = {
  VALIDATION_FAILED: '数据验证失败',
  NETWORK_ERROR: '网络连接错误',
  SERVER_ERROR: '服务器错误',
  NOT_FOUND: '资源未找到',
  UNAUTHORIZED: '未授权访问',
  FORBIDDEN: '禁止访问',
  TIMEOUT: '请求超时',
  UNKNOWN_ERROR: '未知错误'
} as const;

/**
 * 应用状态枚举
 */
export enum AppStatus {
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
  OFFLINE = 'offline'
}

/**
 * 数据加载状态枚举
 */
export enum LoadingStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

/**
 * 组件尺寸枚举
 */
export enum ComponentSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

/**
 * 组件变体枚举
 */
export enum ComponentVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info'
}

// 导出React相关类型
export type ReactComponent = React.ComponentType<any>;
export type ReactNode = React.ReactNode;
export type ReactElement = React.ReactElement;
export type ReactChildren = React.ReactChildren;
export type ReactProps<T = {}> = React.PropsWithChildren<T>;
export type ReactRef<T = any> = React.Ref<T>;
export type ReactEvent<T = Element> = React.SyntheticEvent<T>;
export type ReactMouseEvent<T = Element> = React.MouseEvent<T>;
export type ReactKeyboardEvent<T = Element> = React.KeyboardEvent<T>;
export type ReactChangeEvent<T = Element> = React.ChangeEvent<T>;
export type ReactFormEvent<T = Element> = React.FormEvent<T>;

/**
 * 工具类型
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;
export type NonEmptyArray<T> = [T, ...T[]];
export type KeyOf<T> = keyof T;
export type ValueOf<T> = T[keyof T];
export type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};
export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

/**
 * 函数类型
 */
export type VoidFunction = () => void;
export type AsyncVoidFunction = () => Promise<void>;
export type Callback<T = any> = (value: T) => void;
export type AsyncCallback<T = any> = (value: T) => Promise<void>;
export type Predicate<T = any> = (value: T) => boolean;
export type AsyncPredicate<T = any> = (value: T) => Promise<boolean>;
export type Transformer<T, U> = (value: T) => U;
export type AsyncTransformer<T, U> = (value: T) => Promise<U>;
export type Comparator<T> = (a: T, b: T) => number;
export type EventHandler<T = any> = (event: T) => void;
export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;

/**
 * 时间相关类型
 */
export type Timestamp = number;
export type DateString = string; // ISO 8601 format
export type TimeString = string; // HH:mm:ss format
export type DateTimeString = string; // ISO 8601 datetime format

/**
 * ID类型
 */
export type ID = string | number;
export type UUID = string;
export type EntityId = string;

/**
 * 状态管理相关类型
 */
export type StateUpdater<T> = (prevState: T) => T;
export type StateAction<T> = T | StateUpdater<T>;
export type Reducer<S, A> = (state: S, action: A) => S;
export type Dispatch<A> = (action: A) => void;

/**
 * 网络请求相关类型
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
export type HttpStatus = number;
export type HttpHeaders = Record<string, string>;
export type QueryParams = Record<string, string | number | boolean | undefined>;
export type RequestBody = any;
export type ResponseData = any;

/**
 * 存储相关类型
 */
export type StorageKey = string;
export type StorageValue = string;
export type StorageData = Record<StorageKey, StorageValue>;

/**
 * 环境变量类型
 */
export interface IEnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  REACT_APP_API_BASE_URL: string;
  REACT_APP_VERSION: string;
  REACT_APP_DEBUG: string;
  [key: string]: string;
}

/**
 * 构建信息类型
 */
export interface IBuildInfo {
  version: string;
  buildTime: string;
  gitCommit: string;
  gitBranch: string;
  environment: string;
}

// 导出默认值
export const DEFAULT_BUILD_INFO: IBuildInfo = {
  version: '1.0.0',
  buildTime: new Date().toISOString(),
  gitCommit: 'unknown',
  gitBranch: 'main',
  environment: 'development'
};

/**
 * 导出所有类型定义
 */
export default {
  // 重新导出所有类型以便统一访问
  ERROR_CODES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  REGEX_PATTERNS,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION,
  DEFAULT_SORT,
  DEFAULT_BUILD_INFO
};