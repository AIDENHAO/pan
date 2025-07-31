/**
 * API核心模块
 * 统一封装前端API请求方法，提供标准化的HTTP请求接口
 * 
 * 功能特性：
 * 1. 统一的请求/响应处理
 * 2. 错误处理和重试机制
 * 3. 请求拦截器和响应拦截器
 * 4. TypeScript类型安全
 * 5. 日志记录和调试支持
 * 
 * @author AI Assistant
 * @version 1.0.0
 * @date 2025-01-31
 */

import { IApiResponse, HttpMethod, HttpHeaders, QueryParams } from '../types';

// ==================== 常量定义 ====================

/**
 * API基础配置
 */
const API_CONFIG = {
  /** API基础URL - 使用相对路径通过Vite代理访问 */
  BASE_URL: '',
  /** 请求超时时间（毫秒） */
  TIMEOUT: 30000,
  /** 默认请求头 */
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  /** 重试配置 */
  RETRY: {
    /** 最大重试次数 */
    MAX_ATTEMPTS: 3,
    /** 重试延迟（毫秒） */
    DELAY: 1000
  }
} as const;

/**
 * API端点枚举
 */
export const API_ENDPOINTS = {
  // 健康检查
  HEALTH: '/api/health',
  
  // 掌门相关API
  LEADER: {
    INFO: '/api/leader/info',
    CULTIVATION_UPDATE: '/api/leader/cultivation/update',
    REALM_UPDATE: '/api/leader/realm/update'
  },
  
  // 宗门相关API
  ZONGMEN: {
    INFO: '/api/zongmen/info'
  },
  
  // 映射数据API
  MAPPINGS: {
    ALL: '/api/mappings/all'
  },
  
  // 数据库管理API
  DATABASE: {
    STATS: '/api/database/stats',
    CHARACTERS: '/api/database/characters',
    REALMS: '/api/database/realms',
    SKILLS: '/api/database/skills',
    WEAPONS: '/api/database/weapons',
    ITEMS: '/api/database/items'
  }
} as const;

// ==================== 类型定义 ====================

/**
 * API请求配置接口
 */
export interface IApiRequestConfig {
  /** 请求方法 */
  method?: HttpMethod;
  /** 请求头 */
  headers?: HttpHeaders;
  /** 查询参数 */
  params?: QueryParams;
  /** 请求体数据 */
  data?: any;
  /** 请求超时时间 */
  timeout?: number;
  /** 是否启用重试 */
  retry?: boolean;
  /** 是否显示加载状态 */
  showLoading?: boolean;
}

/**
 * API错误信息接口
 */
export interface IApiError {
  /** 错误代码 */
  code: string;
  /** 错误消息 */
  message: string;
  /** HTTP状态码 */
  status?: number;
  /** 详细错误信息 */
  details?: any;
  /** 请求ID */
  requestId?: string;
}

/**
 * 请求拦截器函数类型
 */
export type RequestInterceptorFunction = (config: IApiRequestConfig) => IApiRequestConfig | Promise<IApiRequestConfig>;

/**
 * 响应拦截器函数类型
 */
export type ResponseInterceptorFunction<T = any> = (response: IApiResponse<T>) => IApiResponse<T> | Promise<IApiResponse<T>>;

/**
 * 错误拦截器函数类型
 */
export type ErrorInterceptorFunction = (error: IApiError) => IApiError | Promise<IApiError>;

// ==================== 工具函数 ====================

/**
 * 构建完整的API URL
 * @param endpoint - API端点
 * @param params - 查询参数
 * @returns 完整的URL字符串
 */
function buildApiUrl(endpoint: string, params?: QueryParams): string {
  const baseUrl = API_CONFIG.BASE_URL;
  const fullUrl = `${baseUrl}${endpoint}`;
  
  if (!params || Object.keys(params).length === 0) {
    return fullUrl;
  }
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  return `${fullUrl}?${searchParams.toString()}`;
}

/**
 * 延迟函数
 * @param ms - 延迟毫秒数
 * @returns Promise
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 生成请求ID
 * @returns 唯一请求ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 日志记录函数
 * @param level - 日志级别
 * @param message - 日志消息
 * @param data - 附加数据
 */
function logApiCall(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [API] ${message}`;
  
  switch (level) {
    case 'info':
      console.log(logMessage, data || '');
      break;
    case 'warn':
      console.warn(logMessage, data || '');
      break;
    case 'error':
      console.error(logMessage, data || '');
      break;
  }
}

// ==================== API核心类 ====================

/**
 * API核心类
 * 提供统一的HTTP请求接口和拦截器管理
 */
export class ApiCore {
  /** 请求拦截器列表 */
  private requestInterceptors: RequestInterceptorFunction[] = [];
  
  /** 响应拦截器列表 */
  private responseInterceptors: ResponseInterceptorFunction[] = [];
  
  /** 错误拦截器列表 */
  private errorInterceptors: ErrorInterceptorFunction[] = [];
  
  /**
   * 添加请求拦截器
   * @param interceptor - 拦截器函数
   */
  public addRequestInterceptor(interceptor: RequestInterceptorFunction): void {
    this.requestInterceptors.push(interceptor);
  }
  
  /**
   * 添加响应拦截器
   * @param interceptor - 拦截器函数
   */
  public addResponseInterceptor(interceptor: ResponseInterceptorFunction): void {
    this.responseInterceptors.push(interceptor);
  }
  
  /**
   * 添加错误拦截器
   * @param interceptor - 拦截器函数
   */
  public addErrorInterceptor(interceptor: ErrorInterceptorFunction): void {
    this.errorInterceptors.push(interceptor);
  }
  
  /**
   * 执行请求拦截器
   * @param config - 请求配置
   * @returns 处理后的请求配置
   */
  private async executeRequestInterceptors(config: IApiRequestConfig): Promise<IApiRequestConfig> {
    let processedConfig = config;
    
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }
    
    return processedConfig;
  }
  
  /**
   * 执行响应拦截器
   * @param response - API响应
   * @returns 处理后的响应
   */
  private async executeResponseInterceptors<T>(response: IApiResponse<T>): Promise<IApiResponse<T>> {
    let processedResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse);
    }
    
    return processedResponse;
  }
  
  /**
   * 执行错误拦截器
   * @param error - API错误
   * @returns 处理后的错误
   */
  private async executeErrorInterceptors(error: IApiError): Promise<IApiError> {
    let processedError = error;
    
    for (const interceptor of this.errorInterceptors) {
      processedError = await interceptor(processedError);
    }
    
    return processedError;
  }
  
  /**
   * 执行HTTP请求
   * @param endpoint - API端点
   * @param config - 请求配置
   * @returns API响应Promise
   */
  public async request<T = any>(endpoint: string, config: IApiRequestConfig = {}): Promise<T> {
    const requestId = generateRequestId();
    const startTime = Date.now();
    
    try {
      // 执行请求拦截器
      const processedConfig = await this.executeRequestInterceptors({
        method: 'GET',
        timeout: API_CONFIG.TIMEOUT,
        retry: true,
        showLoading: false,
        ...config
      });
      
      // 构建请求URL
      const url = buildApiUrl(endpoint, processedConfig.params);
      
      // 构建请求头
      const headers = {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...processedConfig.headers
      };
      
      // 记录请求开始日志
      logApiCall('info', `发起API请求: ${processedConfig.method} ${endpoint}`, {
        requestId,
        url,
        data: processedConfig.data
      });
      
      // 执行请求（带重试机制）
      const response = await this.executeRequestWithRetry(url, {
        method: processedConfig.method,
        headers,
        body: processedConfig.data ? JSON.stringify(processedConfig.data) : undefined,
        signal: AbortSignal.timeout(processedConfig.timeout!)
      }, processedConfig.retry ? API_CONFIG.RETRY.MAX_ATTEMPTS : 1);
      
      // 解析响应
      const responseData: IApiResponse<T> = await response.json();
      
      // 记录响应日志
      const responseTime = Date.now() - startTime;
      logApiCall('info', `API响应成功: ${response.status} ${endpoint}`, {
        requestId,
        responseTime: `${responseTime}ms`,
        status: responseData.success ? 'success' : 'error'
      });
      
      // 检查HTTP状态码
      if (!response.ok) {
        throw this.createApiError({
          code: `HTTP_${response.status}`,
          message: `HTTP错误: ${response.status} ${response.statusText}`,
          status: response.status,
          requestId
        });
      }
      
      // 检查业务状态
      if (!responseData.success) {
        throw this.createApiError({
          code: responseData.error?.code || 'BUSINESS_ERROR',
          message: responseData.error?.message || '业务处理失败',
          details: responseData.error?.details,
          requestId
        });
      }
      
      // 执行响应拦截器
      const processedResponse = await this.executeResponseInterceptors(responseData);
      
      return processedResponse.data as T;
      
    } catch (error) {
      // 记录错误日志
      const responseTime = Date.now() - startTime;
      logApiCall('error', `API请求失败: ${endpoint}`, {
        requestId,
        responseTime: `${responseTime}ms`,
        error: error instanceof Error ? error.message : String(error),
        code: this.isApiError(error) ? error.code : 'UNKNOWN_ERROR',
        details: this.isApiError(error) ? error.details : undefined
      });
      
      // 处理错误
      const apiError = this.isApiError(error)
        ? error
        : this.createApiError({
            code: 'UNKNOWN_ERROR',
            message: error instanceof Error ? error.message : '未知错误',
            requestId
          });
      
      // 执行错误拦截器
      const processedError = await this.executeErrorInterceptors(apiError);
      
      throw processedError;
    }
  }
  
  /**
   * 执行带重试机制的请求
   * @param url - 请求URL
   * @param init - 请求配置
   * @param maxAttempts - 最大重试次数
   * @returns Response对象
   */
  private async executeRequestWithRetry(url: string, init: RequestInit, maxAttempts: number): Promise<Response> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(url, init);
        
        // 如果是服务器错误且还有重试机会，则重试
        if (response.status >= 500 && attempt < maxAttempts) {
          logApiCall('warn', `请求失败，准备重试 (${attempt}/${maxAttempts})`, {
            status: response.status,
            url
          });
          await delay(API_CONFIG.RETRY.DELAY * attempt);
          continue;
        }
        
        return response;
        
      } catch (error) {
        lastError = error as Error;
        
        // 如果还有重试机会，则重试
        if (attempt < maxAttempts) {
          logApiCall('warn', `网络错误，准备重试 (${attempt}/${maxAttempts})`, {
            error: lastError.message,
            url
          });
          await delay(API_CONFIG.RETRY.DELAY * attempt);
          continue;
        }
      }
    }
    
    throw lastError!;
  }
  
  /**
   * 检查是否为API错误对象
   * @param error - 错误对象
   * @returns 是否为API错误
   */
  private isApiError(error: any): error is IApiError {
    return error && typeof error === 'object' && 'code' in error && 'message' in error;
  }
  
  /**
   * 创建API错误对象
   * @param errorInfo - 错误信息
   * @returns API错误对象
   */
  private createApiError(errorInfo: Partial<IApiError>): IApiError {
    const error = new Error(errorInfo.message || '未知错误') as Error & IApiError;
    error.code = errorInfo.code || 'UNKNOWN_ERROR';
    error.message = errorInfo.message || '未知错误';
    error.status = errorInfo.status;
    error.details = errorInfo.details;
    error.requestId = errorInfo.requestId;
    return error;
  }
  
  // ==================== HTTP方法快捷方式 ====================
  
  /**
   * GET请求
   * @param endpoint - API端点
   * @param params - 查询参数
   * @param config - 请求配置
   * @returns API响应Promise
   */
  public async get<T = any>(endpoint: string, params?: QueryParams, config?: Omit<IApiRequestConfig, 'method' | 'params'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'GET',
      params
    });
  }
  
  /**
   * POST请求
   * @param endpoint - API端点
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns API响应Promise
   */
  public async post<T = any>(endpoint: string, data?: any, config?: Omit<IApiRequestConfig, 'method' | 'data'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      data
    });
  }
  
  /**
   * PUT请求
   * @param endpoint - API端点
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns API响应Promise
   */
  public async put<T = any>(endpoint: string, data?: any, config?: Omit<IApiRequestConfig, 'method' | 'data'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      data
    });
  }
  
  /**
   * DELETE请求
   * @param endpoint - API端点
   * @param config - 请求配置
   * @returns API响应Promise
   */
  public async delete<T = any>(endpoint: string, config?: Omit<IApiRequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'DELETE'
    });
  }
  
  /**
   * PATCH请求
   * @param endpoint - API端点
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns API响应Promise
   */
  public async patch<T = any>(endpoint: string, data?: any, config?: Omit<IApiRequestConfig, 'method' | 'data'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      data
    });
  }
}

// ==================== 单例实例 ====================

/**
 * API核心单例实例
 */
export const apiCore = new ApiCore();

// ==================== 业务API方法 ====================

/**
 * 健康检查API
 * @returns 健康状态信息
 */
export const healthCheckApi = {
  /**
   * 获取系统健康状态
   * @returns 健康状态信息
   */
  getHealthStatus: (): Promise<{ status: string; timestamp: string }> => {
    return apiCore.get(API_ENDPOINTS.HEALTH);
  }
};

/**
 * 掌门相关API
 */
export const leaderApi = {
  /**
   * 获取掌门信息
   * @param leaderId - 掌门ID（可选，默认为'leader_001'）
   * @returns 掌门信息
   */
  getLeaderInfo: (leaderId?: string): Promise<any> => {
    return apiCore.get(API_ENDPOINTS.LEADER.INFO, leaderId ? { id: leaderId } : undefined);
  },
  
  /**
   * 更新掌门修炼值
   * @param cultivationValue - 新的修炼值
   * @param leaderId - 掌门ID（可选）
   * @returns 更新结果
   */
  updateCultivationValue: (cultivationValue: number, leaderId?: string): Promise<any> => {
    return apiCore.post(API_ENDPOINTS.LEADER.CULTIVATION_UPDATE, {
      cultivationValue,
      id: leaderId || 'leader_001'
    });
  },
  
  /**
   * 更新掌门境界等级
   * @param realmLevel - 新的境界等级
   * @param leaderId - 掌门ID（可选）
   * @returns 更新结果
   */
  updateRealmLevel: (realmLevel: number, leaderId?: string): Promise<any> => {
    return apiCore.post(API_ENDPOINTS.LEADER.REALM_UPDATE, {
      realmLevel,
      id: leaderId || 'leader_001'
    });
  }
};

/**
 * 宗门相关API
 */
export const zongmenApi = {
  /**
   * 获取宗门信息
   * @param zongmenId - 宗门ID（可选）
   * @returns 宗门信息
   */
  getZongmenInfo: (zongmenId?: string): Promise<any> => {
    return apiCore.get(API_ENDPOINTS.ZONGMEN.INFO, zongmenId ? { id: zongmenId } : undefined);
  }
};

/**
 * 映射数据API
 */
export const mappingApi = {
  /**
   * 获取所有映射数据
   * @returns 映射数据集合
   */
  getAllMappings: (): Promise<any> => {
    return apiCore.get(API_ENDPOINTS.MAPPINGS.ALL);
  }
};

/**
 * 数据库管理API
 */
export const databaseApi = {
  /**
   * 获取数据库统计信息
   * @returns 数据库统计数据
   */
  getDatabaseStats: (): Promise<any> => {
    return apiCore.get(API_ENDPOINTS.DATABASE.STATS);
  },
  
  /**
   * 获取所有角色数据
   * @param params - 查询参数（分页、排序等）
   * @returns 角色数据列表
   */
  getAllCharacters: (params?: QueryParams): Promise<any> => {
    return apiCore.get(API_ENDPOINTS.DATABASE.CHARACTERS, params);
  },
  
  /**
   * 获取所有境界数据
   * @param params - 查询参数
   * @returns 境界数据列表
   */
  getAllRealms: (params?: QueryParams): Promise<any> => {
    return apiCore.get(API_ENDPOINTS.DATABASE.REALMS, params);
  },
  
  /**
   * 获取所有技能数据
   * @param params - 查询参数
   * @returns 技能数据列表
   */
  getAllSkills: (params?: QueryParams): Promise<any> => {
    return apiCore.get(API_ENDPOINTS.DATABASE.SKILLS, params);
  },
  
  /**
   * 获取所有武器数据
   * @param params - 查询参数
   * @returns 武器数据列表
   */
  getAllWeapons: (params?: QueryParams): Promise<any> => {
    return apiCore.get(API_ENDPOINTS.DATABASE.WEAPONS, params);
  },
  
  /**
   * 获取所有物品数据
   * @param params - 查询参数
   * @returns 物品数据列表
   */
  getAllItems: (params?: QueryParams): Promise<any> => {
    return apiCore.get(API_ENDPOINTS.DATABASE.ITEMS, params);
  }
};

// ==================== 默认导出 ====================

export default {
  apiCore,
  API_ENDPOINTS,
  healthCheckApi,
  leaderApi,
  zongmenApi,
  mappingApi,
  databaseApi
};