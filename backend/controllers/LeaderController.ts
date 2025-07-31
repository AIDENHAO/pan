/**
 * 掌门控制器
 * 处理掌门相关的所有API请求
 */
import { Request, Response } from 'express';
import { BaseController, ValidationError, BusinessRuleError } from './BaseController.js';
import fs from 'fs';
import path from 'path';

/**
 * 掌门信息接口
 */
interface LeaderInfo {
  id: string;
  name: string;
  title: string;
  realmLevel: number;
  cultivationValue: number;
  position: number;
  positionName?: string;
  joinDate: string;
  skills: any[];
}

/**
 * 职位映射接口
 */
interface PositionMapping {
  [key: string]: string;
}

/**
 * 掌门控制器类
 */
export class LeaderController extends BaseController {
  private readonly personDataPath: string;
  private readonly positionMappingPath: string;
  
  constructor() {
    super();
    // 获取当前文件的目录路径
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    this.personDataPath = path.join(currentDir, '../data/personInfoData.json');
    this.positionMappingPath = path.join(currentDir, '../data/positionMapping.json');
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
   * 获取掌门信息
   * GET /api/leader/info
   * POST /api/get-person-info (兼容旧接口)
   */
  public async getLeaderInfo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.body;
      console.log('收到获取掌门信息请求，ID:', id);
      
      // 读取掌门基础信息
      const personInfo = await this.readJsonFile<LeaderInfo>(this.personDataPath, 'personInfoData.json');
      
      // 读取职位映射数据
      const positionMapping = await this.readJsonFile<PositionMapping>(this.positionMappingPath, 'positionMapping.json');
      
      // 组装响应数据
      const enrichedPersonInfo = this.assembleLeaderInfoResponse(personInfo, positionMapping);
      
      // 发送成功响应
      this.sendSuccess(res, enrichedPersonInfo, '掌门信息获取成功');
      
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  /**
   * 更新修炼值
   * POST /api/leader/cultivation/update
   * POST /api/update-cultivation (兼容旧接口)
   */
  public async updateCultivationValue(req: Request, res: Response): Promise<void> {
    try {
      const { increaseValue, id } = req.body;
      console.log('收到修炼值更新请求 - ID:', id, '增量:', increaseValue);
      
      // 参数验证
      this.validateRequiredParams(req.body, ['increaseValue']);
      this.validateNumberParam(increaseValue, '修炼值增量');
      
      // 读取当前掌门信息
      const personInfo = await this.readJsonFile<LeaderInfo>(this.personDataPath, 'personInfoData.json');
      
      // 业务规则验证
      this.validateCultivationIncrease(personInfo, increaseValue);
      
      // 更新修炼值
      const updatedPersonInfo = {
        ...personInfo,
        cultivationValue: personInfo.cultivationValue + increaseValue
      };
      
      // 保存更新后的数据
      await this.writeJsonFile(this.personDataPath, updatedPersonInfo, 'personInfoData.json');
      
      // 发送成功响应
      this.sendSuccess(res, updatedPersonInfo, '修炼值更新成功');
      
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  /**
   * 更新境界等级
   * POST /api/leader/realm/update
   * POST /api/update-realm-level (兼容旧接口)
   */
  public async updateRealmLevel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.body;
      console.log('收到境界等级更新请求，ID:', id);
      
      // 读取当前掌门信息
      const personInfo = await this.readJsonFile<LeaderInfo>(this.personDataPath, 'personInfoData.json');
      
      // 业务规则验证
      this.validateRealmLevelIncrease(personInfo);
      
      // 更新境界等级
      const updatedPersonInfo = {
        ...personInfo,
        realmLevel: (personInfo.realmLevel || 0) + 1,
        cultivationValue: 0 // 突破后修炼值重置
      };
      
      // 保存更新后的数据
      await this.writeJsonFile(this.personDataPath, updatedPersonInfo, 'personInfoData.json');
      
      // 发送成功响应
      this.sendSuccess(res, updatedPersonInfo, '境界等级更新成功');
      
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  /**
   * 激活境界突破
   * POST /api/leader/breakthrough/activate
   * POST /api/activate-breakthrough (兼容旧接口)
   */
  public async activateBreakthrough(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.body;
      console.log('收到境界突破激活请求，ID:', id);
      
      // 参数验证
      this.validateRequiredParams(req.body, ['id']);
      
      // 读取当前掌门信息
      const personInfo = await this.readJsonFile<LeaderInfo>(this.personDataPath, 'personInfoData.json');
      
      // 业务规则验证
      this.validateBreakthroughConditions(personInfo);
      
      // 执行突破逻辑
      const updatedPersonInfo = this.executeBreakthrough(personInfo);
      
      // 保存更新后的数据
      await this.writeJsonFile(this.personDataPath, updatedPersonInfo, 'personInfoData.json');
      
      // 发送成功响应
      this.sendSuccess(res, updatedPersonInfo, '境界突破成功');
      
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  /**
   * 组装掌门信息响应数据
   * @param personInfo 掌门基础信息
   * @param positionMapping 职位映射
   * @returns 组装后的掌门信息
   */
  private assembleLeaderInfoResponse(personInfo: LeaderInfo, positionMapping: PositionMapping): LeaderInfo {
    return {
      ...personInfo,
      positionName: positionMapping[personInfo.position.toString()] || '未知职位'
    };
  }
  
  /**
   * 验证修炼值增加的业务规则
   * @param personInfo 掌门信息
   * @param increaseValue 增加值
   */
  private validateCultivationIncrease(personInfo: LeaderInfo, increaseValue: number): void {
    if (increaseValue < 0) {
      throw new ValidationError('修炼值增量不能为负数');
    }
    
    if (increaseValue > 1000) {
      throw new BusinessRuleError('单次修炼值增量不能超过1000');
    }
    
    // 可以添加更多业务规则，如境界上限检查等
  }
  
  /**
   * 验证境界等级提升的业务规则
   * @param personInfo 掌门信息
   */
  private validateRealmLevelIncrease(personInfo: LeaderInfo): void {
    const maxRealmLevel = 66; // 最高境界等级
    
    if (personInfo.realmLevel >= maxRealmLevel) {
      throw new BusinessRuleError('已达到最高境界等级');
    }
  }
  
  /**
   * 验证境界突破条件
   * @param personInfo 掌门信息
   */
  private validateBreakthroughConditions(personInfo: LeaderInfo): void {
    // 这里可以添加突破条件验证逻辑
    // 例如：修炼值是否达到要求、是否有足够的资源等
    
    if (personInfo.realmLevel >= 66) {
      throw new BusinessRuleError('已达到最高境界，无法继续突破');
    }
  }
  
  /**
   * 执行境界突破逻辑
   * @param personInfo 掌门信息
   * @returns 突破后的掌门信息
   */
  private executeBreakthrough(personInfo: LeaderInfo): LeaderInfo {
    return {
      ...personInfo,
      realmLevel: personInfo.realmLevel + 1,
      cultivationValue: 0 // 突破后修炼值重置
    };
  }
}