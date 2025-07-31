/**
 * 映射控制器
 * 处理各种映射数据的API请求
 */
import { Request, Response } from 'express';
import { BaseController, NotFoundError } from './BaseController.js';
import fs from 'fs';
import path from 'path';

/**
 * 映射数据接口
 */
interface MappingData {
  [key: string]: string | number;
}

/**
 * 映射控制器类
 */
export class MappingController extends BaseController {
  private readonly mappingDataPaths: { [key: string]: string };
  
  constructor() {
    super();
    // 获取当前文件的目录路径
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    
    // 定义各种映射文件路径
    this.mappingDataPaths = {
      position: path.join(currentDir, '../data/positionMapping.json'),
      realm: path.join(currentDir, '../data/realmMapping.json'),
      skill: path.join(currentDir, '../data/skillMapping.json'),
      building: path.join(currentDir, '../data/buildingMapping.json')
    };
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
   * 获取所有映射数据
   * GET /api/mappings/all
   * POST /api/get-mappings (兼容旧接口)
   */
  public async getAllMappings(req: Request, res: Response): Promise<void> {
    try {
      console.log('收到获取所有映射数据请求');
      
      // 并行读取所有映射文件
      const mappingPromises = Object.entries(this.mappingDataPaths).map(async ([key, filePath]) => {
        try {
          const data = await this.readJsonFile<MappingData>(filePath, `${key}Mapping.json`);
          return { [key]: data };
        } catch (error) {
          console.warn(`读取${key}映射文件失败，使用空对象:`, error);
          return { [key]: {} };
        }
      });
      
      const mappingResults = await Promise.all(mappingPromises);
      
      // 合并所有映射数据
      const allMappings = mappingResults.reduce((acc, mapping) => ({ ...acc, ...mapping }), {});
      
      // 发送成功响应
      this.sendSuccess(res, allMappings, '映射数据获取成功');
      
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  /**
   * 获取职位映射数据
   * GET /api/mappings/position
   */
  public async getPositionMapping(req: Request, res: Response): Promise<void> {
    try {
      console.log('收到获取职位映射数据请求');
      
      const positionMapping = await this.readJsonFile<MappingData>(
        this.mappingDataPaths.position,
        'positionMapping.json'
      );
      
      this.sendSuccess(res, positionMapping, '职位映射数据获取成功');
      
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  /**
   * 获取境界映射数据
   * GET /api/mappings/realm
   */
  public async getRealmMapping(req: Request, res: Response): Promise<void> {
    try {
      console.log('收到获取境界映射数据请求');
      
      const realmMapping = await this.readJsonFile<MappingData>(
        this.mappingDataPaths.realm,
        'realmMapping.json'
      );
      
      this.sendSuccess(res, realmMapping, '境界映射数据获取成功');
      
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  /**
   * 获取技能映射数据
   * GET /api/mappings/skill
   */
  public async getSkillMapping(req: Request, res: Response): Promise<void> {
    try {
      console.log('收到获取技能映射数据请求');
      
      const skillMapping = await this.readJsonFile<MappingData>(
        this.mappingDataPaths.skill,
        'skillMapping.json'
      );
      
      this.sendSuccess(res, skillMapping, '技能映射数据获取成功');
      
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  /**
   * 获取建筑映射数据
   * GET /api/mappings/building
   */
  public async getBuildingMapping(req: Request, res: Response): Promise<void> {
    try {
      console.log('收到获取建筑映射数据请求');
      
      const buildingMapping = await this.readJsonFile<MappingData>(
        this.mappingDataPaths.building,
        'buildingMapping.json'
      );
      
      this.sendSuccess(res, buildingMapping, '建筑映射数据获取成功');
      
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  /**
   * 根据类型获取特定映射数据
   * GET /api/mappings/:type
   */
  public async getMappingByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      console.log('收到获取特定映射数据请求，类型:', type);
      
      // 验证映射类型
      if (!this.mappingDataPaths[type]) {
        throw new NotFoundError(`不支持的映射类型: ${type}`);
      }
      
      const mappingData = await this.readJsonFile<MappingData>(
        this.mappingDataPaths[type],
        `${type}Mapping.json`
      );
      
      this.sendSuccess(res, mappingData, `${type}映射数据获取成功`);
      
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  /**
   * 根据映射类型和键获取特定值
   * GET /api/mappings/:type/:key
   */
  public async getMappingValue(req: Request, res: Response): Promise<void> {
    try {
      const { type, key } = req.params;
      console.log('收到获取映射值请求，类型:', type, '键:', key);
      
      // 验证映射类型
      if (!this.mappingDataPaths[type]) {
        throw new NotFoundError(`不支持的映射类型: ${type}`);
      }
      
      const mappingData = await this.readJsonFile<MappingData>(
        this.mappingDataPaths[type],
        `${type}Mapping.json`
      );
      
      // 检查键是否存在
      if (!(key in mappingData)) {
        throw new NotFoundError(`在${type}映射中未找到键: ${key}`);
      }
      
      const value = mappingData[key];
      
      this.sendSuccess(res, { key, value, type }, '映射值获取成功');
      
    } catch (error) {
      this.handleError(res, error);
    }
  }
  
  /**
   * 批量获取映射值
   * POST /api/mappings/batch
   */
  public async getBatchMappingValues(req: Request, res: Response): Promise<void> {
    try {
      const { requests } = req.body;
      console.log('收到批量获取映射值请求:', requests);
      
      // 参数验证
      this.validateRequiredParams(req.body, ['requests']);
      
      if (!Array.isArray(requests)) {
        throw new Error('requests必须是数组');
      }
      
      // 处理批量请求
      const results = await Promise.all(
        requests.map(async (request: { type: string; key: string }) => {
          try {
            const { type, key } = request;
            
            if (!this.mappingDataPaths[type]) {
              return { type, key, value: null, error: `不支持的映射类型: ${type}` };
            }
            
            const mappingData = await this.readJsonFile<MappingData>(
              this.mappingDataPaths[type],
              `${type}Mapping.json`
            );
            
            const value = mappingData[key] || null;
            
            return { type, key, value, error: value === null ? `未找到键: ${key}` : null };
            
          } catch (error) {
            return {
              type: request.type,
              key: request.key,
              value: null,
              error: error instanceof Error ? error.message : '未知错误'
            };
          }
        })
      );
      
      this.sendSuccess(res, { results }, '批量映射值获取完成');
      
    } catch (error) {
      this.handleError(res, error);
    }
  }
}