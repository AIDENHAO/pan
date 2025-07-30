/**
 * 类型定义统一导出文件
 * 集中管理所有TypeScript类型定义
 * @author AI Assistant
 * @version 1.0
 * @date 2024-12-19
 */
// 导出枚举类型
export { RealmLevel, PhysicalAttributeLevel, PeopleDataValidator } from './peopleData';
/**
 * 排序方向枚举
 */
export var SortDirection;
(function (SortDirection) {
    SortDirection["ASC"] = "asc";
    SortDirection["DESC"] = "desc";
})(SortDirection || (SortDirection = {}));
/**
 * 用户权限枚举
 */
export var UserPermission;
(function (UserPermission) {
    UserPermission["READ"] = "read";
    UserPermission["WRITE"] = "write";
    UserPermission["DELETE"] = "delete";
    UserPermission["ADMIN"] = "admin";
})(UserPermission || (UserPermission = {}));
/**
 * 用户角色枚举
 */
export var UserRole;
(function (UserRole) {
    UserRole["GUEST"] = "guest";
    UserRole["USER"] = "user";
    UserRole["MODERATOR"] = "moderator";
    UserRole["ADMIN"] = "admin";
})(UserRole || (UserRole = {}));
// 导出默认配置常量
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGINATION = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
};
export const DEFAULT_SORT = {
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
};
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
};
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
};
/**
 * 应用状态枚举
 */
export var AppStatus;
(function (AppStatus) {
    AppStatus["LOADING"] = "loading";
    AppStatus["READY"] = "ready";
    AppStatus["ERROR"] = "error";
    AppStatus["OFFLINE"] = "offline";
})(AppStatus || (AppStatus = {}));
/**
 * 数据加载状态枚举
 */
export var LoadingStatus;
(function (LoadingStatus) {
    LoadingStatus["IDLE"] = "idle";
    LoadingStatus["LOADING"] = "loading";
    LoadingStatus["SUCCESS"] = "success";
    LoadingStatus["ERROR"] = "error";
})(LoadingStatus || (LoadingStatus = {}));
/**
 * 组件尺寸枚举
 */
export var ComponentSize;
(function (ComponentSize) {
    ComponentSize["SMALL"] = "small";
    ComponentSize["MEDIUM"] = "medium";
    ComponentSize["LARGE"] = "large";
})(ComponentSize || (ComponentSize = {}));
/**
 * 组件变体枚举
 */
export var ComponentVariant;
(function (ComponentVariant) {
    ComponentVariant["PRIMARY"] = "primary";
    ComponentVariant["SECONDARY"] = "secondary";
    ComponentVariant["SUCCESS"] = "success";
    ComponentVariant["WARNING"] = "warning";
    ComponentVariant["ERROR"] = "error";
    ComponentVariant["INFO"] = "info";
})(ComponentVariant || (ComponentVariant = {}));
// 导出默认值
export const DEFAULT_BUILD_INFO = {
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
//# sourceMappingURL=index.js.map