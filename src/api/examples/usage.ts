/**
 * API Core 使用示例
 * 展示如何使用统一的API调用接口
 * 
 * @author AI Assistant
 * @version 1.0.0
 * @date 2025-01-31
 */

import { 
  apiCore, 
  healthCheckApi, 
  leaderApi, 
  zongmenApi, 
  mappingApi, 
  databaseApi,
  type IApiRequestConfig 
} from '../index';

/**
 * 基础API调用示例
 */
export class ApiUsageExamples {
  
  /**
   * 健康检查示例
   */
  static async healthCheckExample(): Promise<void> {
    try {
      console.log('🔍 执行健康检查...');
      const result = await healthCheckApi.getHealthStatus();
      console.log('✅ 健康检查成功:', result);
    } catch (error) {
      console.error('❌ 健康检查失败:', error);
    }
  }

  /**
   * 掌门信息获取示例
   */
  static async leaderInfoExample(): Promise<void> {
    try {
      console.log('🔍 获取掌门信息...');
      const leaderInfo = await leaderApi.getLeaderInfo();
      console.log('✅ 掌门信息:', leaderInfo);
    } catch (error) {
      console.error('❌ 获取掌门信息失败:', error);
    }
  }

  /**
   * 修炼值更新示例
   */
  static async updateCultivationExample(): Promise<void> {
    try {
      console.log('🔍 更新修炼值...');
      const updateData = {
        cultivationValue: 1000,
        cultivationType: 'qi_cultivation'
      };
      const result = await leaderApi.updateCultivationValue(updateData.cultivationValue);
      console.log('✅ 修炼值更新成功:', result);
    } catch (error) {
      console.error('❌ 修炼值更新失败:', error);
    }
  }

  /**
   * 境界等级更新示例
   */
  static async updateRealmExample(): Promise<void> {
    try {
      console.log('🔍 更新境界等级...');
      const realmData = {
        realmLevel: 5,
        realmName: '筑基期'
      };
      const result = await leaderApi.updateRealmLevel(realmData.realmLevel);
      console.log('✅ 境界等级更新成功:', result);
    } catch (error) {
      console.error('❌ 境界等级更新失败:', error);
    }
  }

  /**
   * 宗门信息获取示例
   */
  static async zongmenInfoExample(): Promise<void> {
    try {
      console.log('🔍 获取宗门信息...');
      const zongmenInfo = await zongmenApi.getZongmenInfo();
      console.log('✅ 宗门信息:', zongmenInfo);
    } catch (error) {
      console.error('❌ 获取宗门信息失败:', error);
    }
  }

  /**
   * 映射数据获取示例
   */
  static async mappingDataExample(): Promise<void> {
    try {
      console.log('🔍 获取映射数据...');
      const mappingData = await mappingApi.getAllMappings();
      console.log('✅ 映射数据:', mappingData);
    } catch (error) {
      console.error('❌ 获取映射数据失败:', error);
    }
  }

  /**
   * 数据库统计信息示例
   */
  static async databaseStatsExample(): Promise<void> {
    try {
      console.log('🔍 获取数据库统计...');
      const stats = await databaseApi.getDatabaseStats();
      console.log('✅ 数据库统计:', stats);
    } catch (error) {
      console.error('❌ 获取数据库统计失败:', error);
    }
  }

  /**
   * 获取所有角色示例
   */
  static async getAllCharactersExample(): Promise<void> {
    try {
      console.log('🔍 获取所有角色...');
      const characters = await databaseApi.getAllCharacters();
      console.log('✅ 角色数据:', characters);
    } catch (error) {
      console.error('❌ 获取角色数据失败:', error);
    }
  }

  /**
   * 自定义请求配置示例
   */
  static async customRequestExample(): Promise<void> {
    try {
      console.log('🔍 执行自定义请求...');
      
      // 自定义请求配置
      const config: IApiRequestConfig = {
        timeout: 10000,
        headers: {
          'Custom-Header': 'custom-value'
        }
      };
      
      const result = await apiCore.get('/api/health', {}, config);
      console.log('✅ 自定义请求成功:', result);
    } catch (error) {
      console.error('❌ 自定义请求失败:', error);
    }
  }

  /**
   * 批量API调用示例
   */
  static async batchApiCallsExample(): Promise<void> {
    console.log('🚀 开始批量API调用示例...');
    
    const apiCalls = [
      this.healthCheckExample(),
      this.leaderInfoExample(),
      this.zongmenInfoExample(),
      this.mappingDataExample(),
      this.databaseStatsExample()
    ];
    
    try {
      await Promise.allSettled(apiCalls);
      console.log('✅ 批量API调用完成');
    } catch (error) {
      console.error('❌ 批量API调用出现错误:', error);
    }
  }

  /**
   * 运行所有示例
   */
  static async runAllExamples(): Promise<void> {
    console.log('🎯 开始运行API使用示例...');
    console.log('=' .repeat(50));
    
    await this.healthCheckExample();
    console.log('-'.repeat(30));
    
    await this.leaderInfoExample();
    console.log('-'.repeat(30));
    
    await this.updateCultivationExample();
    console.log('-'.repeat(30));
    
    await this.updateRealmExample();
    console.log('-'.repeat(30));
    
    await this.zongmenInfoExample();
    console.log('-'.repeat(30));
    
    await this.mappingDataExample();
    console.log('-'.repeat(30));
    
    await this.databaseStatsExample();
    console.log('-'.repeat(30));
    
    await this.getAllCharactersExample();
    console.log('-'.repeat(30));
    
    await this.customRequestExample();
    console.log('-'.repeat(30));
    
    console.log('🎉 所有API示例运行完成!');
    console.log('=' .repeat(50));
  }
}

// 如果直接运行此文件，则执行所有示例
if (import.meta.url === `file://${process.argv[1]}`) {
  ApiUsageExamples.runAllExamples().catch(console.error);
}

export default ApiUsageExamples;