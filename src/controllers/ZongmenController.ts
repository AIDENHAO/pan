/**
 * 宗门控制器
 * 处理宗门相关的所有API请求
 */
import { Request, Response } from 'express';
import { BaseController, ValidationError, NotFoundError } from './BaseController.js';
import fs from 'fs';
import path from 'path';

/**
 * 宗门信息接口
 */
interface ZongmenInfo {
  id: string;
  name: string;
  level: number;
  reputation: number;
  disciples: number;
  resources: {
    spirit_stones: number;
    herbs: number;
    weapons: number;
  };
  buildings: any[];
  description: string;
}

/**
 * 宗门控制器类
 */
export class ZongmenController extends BaseController {
  private readonly zongmenDataPath: string;
  
  constructor() {
    super();
    // 获取当前文件的目录路径
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    this.zongmenDataPath = path.join(currentDir, '../data/zongmenInfoData.json');
  }
  
  /**
   * 读取JSON文件的通用方法
   * @param filePath 文件路径
   * @param fileName 文件名（用于错误日志）
   * @returns 解析后的JSON对象
   */
  private async readJsonFile<T>(filePath: string, fileName: string): Promise<T> {
    try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`读取${fileName}文件失败:`, error);
      throw new Error(`无法读取${fileName}文件`);
    }
  }
  
  /**
   * 写入JSON文件的通用方法
   * @param filePath 文件路径
   * @param data 要写入的数据
   * @param fileName 文件名（用于错误日志）
   */
  private async writeJsonFile<T>(filePath: string, data: T, fileName: string): Promise<void> {
    try {
      await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`${fileName}文件写入成功`);
    } catch (error) {
      console.error(`写入${fileName}文件失败:`, error);
      throw new Error(`无法写入${fileName}文件`);
    }
  }
  
  /**
   * 获取宗门信息
   * GET /api/zongmen/info
   * POST /api/get-zongmen-info (兼容旧接口)
   */
  public async getZongmenInfo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.body;
      console.log('收到获取宗门信息请求，ID:', id);
      
      // 读取宗门信息
      const zongmenInfo = await this.readJsonFile<ZongmenInfo>(this.zongmenDataPath, 'zongmenInfoData.json');
      
      // 组装响应数据
      const enrichedZongmenInfo = this.assembleZongmenInfoResponse(zongmenInfo);
      
      // 发送成功响应
      this.sendSuccess(res, enrichedZongmenInfo, '宗门信息获取成功');
      
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  /**
   * 更新宗门等级
   * POST /api/zongmen/level/update
   */
  public async updateZongmenLevel(req: Request, res: Response): Promise<void> {
    try {
      const { id, increaseValue } = req.body;
      console.log('收到宗门等级更新请求 - ID:', id, '增量:', increaseValue);
      
      // 参数验证
      this.validateRequiredParams(req.body, ['increaseValue']);
      this.validateNumberParam(increaseValue, '宗门等级增量');
      
      // 读取当前宗门信息
      const zongmenInfo = await this.readJsonFile<ZongmenInfo>(this.zongmenDataPath, 'zongmenInfoData.json');
      
      // 业务规则验证
      this.validateZongmenLevelIncrease(zongmenInfo, increaseValue);
      
      // 更新宗门等级
      const updatedZongmenInfo = {
        ...zongmenInfo,
        level: zongmenInfo.level + increaseValue
      };
      
      // 保存更新后的数据
      await this.writeJsonFile(this.zongmenDataPath, updatedZongmenInfo, 'zongmenInfoData.json');
      
      // 发送成功响应
      this.sendSuccess(res, updatedZongmenInfo, '宗门等级更新成功');
      
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  /**
   * 更新宗门声望
   * POST /api/zongmen/reputation/update
   */
  public async updateZongmenReputation(req: Request, res: Response): Promise<void> {
    try {
      const { id, increaseValue } = req.body;
      console.log('收到宗门声望更新请求 - ID:', id, '增量:', increaseValue);
      
      // 参数验证
      this.validateRequiredParams(req.body, ['increaseValue']);
      this.validateNumberParam(increaseValue, '宗门声望增量');
      
      // 读取当前宗门信息
      const zongmenInfo = await this.readJsonFile<ZongmenInfo>(this.zongmenDataPath, 'zongmenInfoData.json');
      
      // 业务规则验证
      this.validateZongmenReputationIncrease(zongmenInfo, increaseValue);
      
      // 更新宗门声望
      const updatedZongmenInfo = {
        ...zongmenInfo,
        reputation: Math.max(0, zongmenInfo.reputation + increaseValue) // 声望不能为负
      };
      
      // 保存更新后的数据
      await this.writeJsonFile(this.zongmenDataPath, updatedZongmenInfo, 'zongmenInfoData.json');
      
      // 发送成功响应
      this.sendSuccess(res, updatedZongmenInfo, '宗门声望更新成功');
      
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  /**
   * 更新宗门资源
   * POST /api/zongmen/resources/update
   */
  public async updateZongmenResources(req: Request, res: Response): Promise<void> {
    try {
      const { id, resourceType, increaseValue } = req.body;
      console.log('收到宗门资源更新请求 - ID:', id, '资源类型:', resourceType, '增量:', increaseValue);
      
      // 参数验证
      this.validateRequiredParams(req.body, ['resourceType', 'increaseValue']);
      this.validateStringParam(resourceType, '资源类型');
      this.validateNumberParam(increaseValue, '资源增量');
      
      // 读取当前宗门信息
      const zongmenInfo = await this.readJsonFile<ZongmenInfo>(this.zongmenDataPath, 'zongmenInfoData.json');
      
      // 业务规则验证
      this.validateResourceType(resourceType);
      this.validateResourceIncrease(zongmenInfo, resourceType, increaseValue);
      
      // 更新宗门资源
      const updatedZongmenInfo = {
        ...zongmenInfo,
        resources: {
          ...zongmenInfo.resources,
          [resourceType]: Math.max(0, zongmenInfo.resources[resourceType as keyof typeof zongmenInfo.resources] + increaseValue)
        }
      };
      
      // 保存更新后的数据
      await this.writeJsonFile(this.zongmenDataPath, updatedZongmenInfo, 'zongmenInfoData.json');
      
      // 发送成功响应
      this.sendSuccess(res, updatedZongmenInfo, '宗门资源更新成功');
      
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  /**
   * 组装宗门信息响应数据
   * @param zongmenInfo 宗门基础信息
   * @returns 组装后的宗门信息
   */
  private assembleZongmenInfoResponse(zongmenInfo: ZongmenInfo): ZongmenInfo {
    // 可以在这里添加额外的数据处理逻辑
    // 例如：计算总资源价值、添加等级描述等
    return {
      ...zongmenInfo,
      // 可以添加计算字段
      totalResourceValue: this.calculateTotalResourceValue(zongmenInfo.resources)
    } as ZongmenInfo & { totalResourceValue: number };
  }
  
  /**
   * 计算总资源价值
   * @param resources 资源对象
   * @returns 总价值
   */
  private calculateTotalResourceValue(resources: ZongmenInfo['resources']): number {
    // 简单的资源价值计算
    return resources.spirit_stones * 1 + resources.herbs * 2 + resources.weapons * 5;
  }
  
  /**
   * 验证宗门等级提升的业务规则
   * @param zongmenInfo 宗门信息
   * @param increaseValue 增加值
   */
  private validateZongmenLevelIncrease(zongmenInfo: ZongmenInfo, increaseValue: number): void {
    if (increaseValue < 0) {
      throw new ValidationError('宗门等级增量不能为负数');
    }
    
    const maxLevel = 100; // 最高宗门等级
    if (zongmenInfo.level + increaseValue > maxLevel) {
      throw new ValidationError(`宗门等级不能超过${maxLevel}`);
    }
  }
  
  /**
   * 验证宗门声望更新的业务规则
   * @param zongmenInfo 宗门信息
   * @param increaseValue 增加值
   */
  private validateZongmenReputationIncrease(zongmenInfo: ZongmenInfo, increaseValue: number): void {
    const maxReputation = 100000; // 最高声望值
    
    if (zongmenInfo.reputation + increaseValue > maxReputation) {
      throw new ValidationError(`宗门声望不能超过${maxReputation}`);
    }
  }
  
  /**
   * 验证资源类型
   * @param resourceType 资源类型
   */
  private validateResourceType(resourceType: string): void {
    const validResourceTypes = ['spirit_stones', 'herbs', 'weapons'];
    if (!validResourceTypes.includes(resourceType)) {
      throw new ValidationError(`无效的资源类型: ${resourceType}`);
    }
  }
  
  /**
   * 验证资源更新的业务规则
   * @param zongmenInfo 宗门信息
   * @param resourceType 资源类型
   * @param increaseValue 增加值
   */
  private validateResourceIncrease(zongmenInfo: ZongmenInfo, resourceType: string, increaseValue: number): void {
    const maxResourceValue = 999999; // 单项资源最大值
    const currentValue = zongmenInfo.resources[resourceType as keyof typeof zongmenInfo.resources];
    
    if (currentValue + increaseValue > maxResourceValue) {
      throw new ValidationError(`${resourceType}资源不能超过${maxResourceValue}`);
    }
    
    // 如果是减少资源，确保不会变成负数
    if (increaseValue < 0 && currentValue + increaseValue < 0) {
      throw new ValidationError(`${resourceType}资源不足`);
    }
  }
}