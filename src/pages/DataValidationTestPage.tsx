import React, { useState, useEffect } from 'react';
import {
  getLeaderInfo,
  getCultivationStages,
  getMappingData,
  activateBreakthrough
} from '../services/leaderService';

/**
 * 数据验证测试页面
 * 用于测试前端对JSON数据格式的校验规则
 */
const DataValidationTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * 添加测试结果
   * @param testName 测试名称
   * @param success 是否成功
   * @param data 测试数据
   * @param error 错误信息
   */
  const addTestResult = (testName: string, success: boolean, data?: any, error?: string) => {
    const result = {
      testName,
      success,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [...prev, result]);
  };

  /**
   * 测试获取掌门信息API
   */
  const testGetLeaderInfo = async () => {
    try {
      console.log('=== 测试获取掌门信息 ===');
      const data = await getLeaderInfo('leader_001');
      addTestResult('获取掌门信息', true, data);
      console.log('掌门信息测试成功:', data);
    } catch (error) {
      addTestResult('获取掌门信息', false, null, error instanceof Error ? error.message : String(error));
      console.error('掌门信息测试失败:', error);
    }
  };

  /**
   * 测试获取修炼阶段数据
   */
  const testGetCultivationStages = async () => {
    try {
      console.log('=== 测试获取修炼阶段数据 ===');
      const data = await getCultivationStages();
      addTestResult('获取修炼阶段数据', true, { count: data?.length, sample: data?.[0] });
      console.log('修炼阶段数据测试成功:', data);
    } catch (error) {
      addTestResult('获取修炼阶段数据', false, null, error instanceof Error ? error.message : String(error));
      console.error('修炼阶段数据测试失败:', error);
    }
  };

  /**
   * 测试获取映射数据
   */
  const testGetMappingData = async () => {
    try {
      console.log('=== 测试获取映射数据 ===');
      const data = await getMappingData();
      addTestResult('获取映射数据', true, {
        hasPositionMapping: !!data?.positionMapping,
        hasCultivationStages: !!data?.cultivationStages,
        hasCultivationMethodMapping: !!data?.cultivationMethodMapping
      });
      console.log('映射数据测试成功:', data);
    } catch (error) {
      addTestResult('获取映射数据', false, null, error instanceof Error ? error.message : String(error));
      console.error('映射数据测试失败:', error);
    }
  };

  /**
   * 测试激活境界突破
   */
  const testActivateBreakthrough = async () => {
    try {
      console.log('=== 测试激活境界突破 ===');
      const data = await activateBreakthrough('leader_001');
      addTestResult('激活境界突破', true, data);
      console.log('激活境界突破测试成功:', data);
    } catch (error) {
      addTestResult('激活境界突破', false, null, error instanceof Error ? error.message : String(error));
      console.error('激活境界突破测试失败:', error);
    }
  };

  /**
   * 运行所有测试
   */
  const runAllTests = async () => {
    setLoading(true);
    setTestResults([]);
    
    console.log('开始运行数据验证测试...');
    
    await testGetMappingData();
    await new Promise(resolve => setTimeout(resolve, 500)); // 延迟500ms
    
    await testGetCultivationStages();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testGetLeaderInfo();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testActivateBreakthrough();
    
    setLoading(false);
    console.log('所有测试完成');
  };

  /**
   * 清空测试结果
   */
  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>数据验证测试页面</h1>
      <p>此页面用于测试前端对JSON数据格式的校验规则是否准确</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runAllTests} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '测试中...' : '运行所有测试'}
        </button>
        
        <button 
          onClick={clearResults}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          清空结果
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>单独测试</h3>
        <button onClick={testGetMappingData} style={{ margin: '5px', padding: '5px 10px' }}>测试映射数据</button>
        <button onClick={testGetCultivationStages} style={{ margin: '5px', padding: '5px 10px' }}>测试修炼阶段</button>
        <button onClick={testGetLeaderInfo} style={{ margin: '5px', padding: '5px 10px' }}>测试掌门信息</button>
        <button onClick={testActivateBreakthrough} style={{ margin: '5px', padding: '5px 10px' }}>测试境界突破</button>
      </div>

      <div>
        <h3>测试结果 ({testResults.length})</h3>
        {testResults.length === 0 ? (
          <p style={{ color: '#666' }}>暂无测试结果</p>
        ) : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {testResults.map((result, index) => (
              <div 
                key={index} 
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '10px',
                  marginBottom: '10px',
                  backgroundColor: result.success ? '#d4edda' : '#f8d7da'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  <span style={{ color: result.success ? '#155724' : '#721c24' }}>
                    {result.success ? '✅' : '❌'} {result.testName}
                  </span>
                  <span style={{ float: 'right', fontSize: '12px', color: '#666' }}>
                    {result.timestamp}
                  </span>
                </div>
                
                {result.error && (
                  <div style={{ color: '#721c24', marginBottom: '5px' }}>
                    <strong>错误:</strong> {result.error}
                  </div>
                )}
                
                {result.data && (
                  <details>
                    <summary style={{ cursor: 'pointer', color: '#007bff' }}>查看数据</summary>
                    <pre style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '10px', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      overflow: 'auto',
                      maxHeight: '200px'
                    }}>
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataValidationTestPage;