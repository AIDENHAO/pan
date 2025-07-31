/**
 * 数据验证中间件模块
 * 提供统一的数据验证架构，支持模块化扩展
 */
import { Request, Response, NextFunction } from 'express';
import { ValidationError, validationResult } from 'express-validator';

/**
 * 验证结果处理中间件
 * 统一处理验证错误并返回标准化的错误响应
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error: ValidationError) => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined,
      location: error.type === 'field' ? error.location : 'body'
    }));

    res.status(400).json({
      success: false,
      message: '数据验证失败',
      error_code: 'VALIDATION_ERROR',
      errors: formattedErrors,
      timestamp: new Date().toISOString()
    });
    return;
  }
  
  next();
};

/**
 * 创建验证中间件数组
 * @param validators 验证器数组
 * @returns 包含验证器和错误处理的中间件数组
 */
export const createValidationMiddleware = (
  validators: any[]
): any[] => {
  return [...validators, handleValidationErrors];
};

/**
 * UUID格式验证辅助函数
 * @param value UUID字符串
 * @returns 是否为有效的UUID格式
 */
export const isValidUUID = (value: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

/**
 * 自定义UUID验证器
 */
export const validateUUID = (value: string): boolean => {
  if (!value) {
    throw new Error('UUID不能为空');
  }
  if (!isValidUUID(value)) {
    throw new Error('UUID格式无效');
  }
  return true;
};

/**
 * 日期范围验证辅助函数
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 是否为有效的日期范围
 */
export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};

/**
 * 数值范围验证辅助函数
 * @param min 最小值
 * @param max 最大值
 * @returns 是否为有效的数值范围
 */
export const isValidNumberRange = (min: number, max: number): boolean => {
  return min <= max;
};

/**
 * 通用错误响应格式
 */
export interface ValidationErrorResponse {
  success: false;
  message: string;
  error_code: string;
  errors: Array<{
    field: string;
    message: string;
    value?: any;
    location: string;
  }>;
  timestamp: string;
}

/**
 * 验证器配置接口
 */
export interface ValidatorConfig {
  field: string;
  rules: any[];
  optional?: boolean;
  customMessage?: string;
}

/**
 * 创建动态验证器
 * @param configs 验证器配置数组
 * @returns 验证器数组
 */
export const createDynamicValidators = (configs: ValidatorConfig[]): any[] => {
  // 这里可以根据配置动态生成验证器
  // 具体实现将在各个验证模块中完成
  return [];
};

export default {
  handleValidationErrors,
  createValidationMiddleware,
  validateUUID,
  isValidUUID,
  isValidDateRange,
  isValidNumberRange,
  createDynamicValidators
};