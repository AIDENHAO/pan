/**
 * 直接测试 createRealmData 方法
 * 不通过 API 端点，直接调用控制器方法
 */
import { DatabaseController } from './src/controllers/DatabaseController.js';

// 模拟 Request 和 Response 对象
class MockRequest {
  public body: any;
  
  constructor(body: any) {
    this.body = body;
  }
}

class MockResponse {
  private statusCode: number = 200;
  private responseData: any = null;
  
  status(code: number) {
    this.statusCode = code;
    return this;
  }
  
  json(data: any) {
    this.responseData = data;
    console.log('📊 响应状态码:', this.statusCode);
    console.log('📦 响应数据:', JSON.stringify(data, null, 2));
    return this;
  }
  
  getStatus() {
    return this.statusCode;
  }
  
  getData() {
    return this.responseData;
  }
}

/**
 * 测试 createRealmData 方法
 */
async function testCreateRealmData() {
  console.log('🚀 开始测试 createRealmData 方法...');
  
  try {
    // 创建控制器实例
    const controller = new DatabaseController();
    
    // 准备测试数据
    const testRealmData = {
      realm_level: 1,
      stage_division: "初期",
      major_realm: "练气",
      minor_realm: "练气",
      stage: "前期",
      cultivation_start_value: 0,
      base_cultivation_limit: 100,
      base_cultivation_speed: 1,
      base_physical_strength: 10,
      base_spiritual_strength: 10,
      base_soul_strength: 10,
      base_spiritual_storage: 100,
      base_blood_storage: 100,
      base_mental_storage: 100,
      base_spiritual_recovery_rate: 1,
      base_blood_recovery_rate: 1,
      base_mental_recovery_rate: 1
    };
    
    console.log('📋 测试数据:', JSON.stringify(testRealmData, null, 2));
    
    // 创建模拟的 Request 和 Response 对象
    const mockReq = new MockRequest(testRealmData) as any;
    const mockRes = new MockResponse() as any;
    
    // 调用 createRealmData 方法
    console.log('🎯 调用 createRealmData 方法...');
    await controller.createRealmData(mockReq, mockRes);
    
    // 检查结果
    const status = mockRes.getStatus();
    const data = mockRes.getData();
    
    if (status === 200 || status === 201) {
      console.log('✅ 测试成功！createRealmData 方法正常工作');
      console.log('🎉 创建的境界数据:', data);
    } else {
      console.log('❌ 测试失败！状态码:', status);
      console.log('📄 错误信息:', data);
    }
    
  } catch (error) {
    console.error('💥 测试过程中发生错误:', error);
    if (error instanceof Error) {
      console.error('📍 错误堆栈:', error.stack);
    }
  }
}

// 运行测试
testCreateRealmData().then(() => {
  console.log('🏁 测试完成');
  process.exit(0);
}).catch((error) => {
  console.error('💀 测试失败:', error);
  process.exit(1);
});