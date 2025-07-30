/**
 * 基础控制器类
 * 提供通用的错误处理、响应格式化和参数验证功能
 */
import { Request, Response } from 'express';

/**
 * 标准API响应格式接口
 */
interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

/**
 * 自定义错误类型
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource}不存在`);
    this.name = 'NotFoundError';
  }
}

export class BusinessRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleError';
  }
}

/**
 * 基础控制器抽象类
 * 所有具体控制器都应继承此类
 */
export abstract class BaseController {
  /**
   * 通用错误处理方法
   * @param res Express响应对象
   * @param error 错误对象
   */
  protected handleError(res: Response, error: any): void {
    console.error('Controller错误:', error);
    
    let statusCode = 500;
    let message = '服务器内部错误';
    
    // 根据错误类型设置状态码和消息
    if (error instanceof ValidationError) {
      statusCode = 400;
      message = error.message;
    } else if (error instanceof NotFoundError) {
      statusCode = 404;
      message = error.message;
    } else if (error instanceof BusinessRuleError) {
      statusCode = 422;
      message = error.message;
    } else if (error.message) {
      message = error.message;
    }
    
    res.status(statusCode).json(this.formatErrorResponse(message));
  }
  
  /**
   * 格式化成功响应
   * @param data 响应数据
   * @param message 成功消息
   * @returns 格式化的成功响应
   */
  protected formatSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
      status: 'success',
      data,
      message: message || '操作成功',
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * 格式化错误响应
   * @param message 错误消息
   * @returns 格式化的错误响应
   */
  protected formatErrorResponse(message: string): ApiResponse {
    return {
      status: 'error',
      message,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * 发送成功响应
   * @param res Express响应对象
   * @param data 响应数据
   * @param message 成功消息
   */
  protected sendSuccess<T>(res: Response, data: T, message?: string): void {
    res.json(this.formatSuccessResponse(data, message));
  }
  
  /**
   * 验证必需参数
   * @param params 参数对象
   * @param requiredFields 必需字段数组
   * @throws ValidationError 当缺少必需参数时
   */
  protected validateRequiredParams(params: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (params[field] === undefined || params[field] === null || params[field] === '') {
        throw new ValidationError(`缺少必需参数: ${field}`);
      }
    }
  }
  
  /**
   * 验证数值参数
   * @param value 要验证的值
   * @param fieldName 字段名称
   * @param min 最小值（可选）
   * @param max 最大值（可选）
   * @throws ValidationError 当数值无效时
   */
  protected validateNumberParam(value: any, fieldName: string, min?: number, max?: number): void {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new ValidationError(`${fieldName}必须是有效的数字`);
    }
    
    if (min !== undefined && value < min) {
      throw new ValidationError(`${fieldName}不能小于${min}`);
    }
    
    if (max !== undefined && value > max) {
      throw new ValidationError(`${fieldName}不能大于${max}`);
    }
  }
  
  /**
   * 验证字符串参数
   * @param value 要验证的值
   * @param fieldName 字段名称
   * @param maxLength 最大长度（可选）
   * @throws ValidationError 当字符串无效时
   */
  protected validateStringParam(value: any, fieldName: string, maxLength?: number): void {
    if (typeof value !== 'string') {
      throw new ValidationError(`${fieldName}必须是字符串`);
    }
    
    if (maxLength !== undefined && value.length > maxLength) {
      throw new ValidationError(`${fieldName}长度不能超过${maxLength}个字符`);
    }
  }
}