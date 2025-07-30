// API基础URL - 使用相对路径通过Vite代理访问
const API_BASE_URL = '';

/**
 * 通用POST请求函数
 * @param {string} endpoint - API端点
 * @param {Object} data - 请求数据
 * @returns {Promise<any>} API响应数据
 */
const postRequest = async (endpoint: string, data: any = {}) => {
  try {
    console.log(`发起API请求: ${endpoint}`, data);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log(`API响应状态: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP错误详情:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
    }

    const result = await response.json();
    console.log(`API响应数据:`, result);
    
    if (result.status !== 'success') {
      console.error(`API业务错误:`, result);
      throw new Error(result.message || '请求失败');
    }

    return result.data;
  } catch (error) {
    console.error(`API请求失败 (${endpoint}):`, error);
    throw error;
  }
};

// 获取映射数据（职位映射、境界映射、修炼阶段）
export const getMappingData = async () => {
  return await postRequest('/api/get-mappings');
};

// 获取职位映射
export const getPositionMapping = async () => {
  const mappings = await getMappingData();
  return mappings.positionMapping;
};

// 获取境界映射数据（已移除，因为realmMapping.json文件已删除）
// export const getRealmMapping = async () => {
//   const mappings = await getMappingData();
//   return mappings.realmMapping;
// };

// 获取修炼阶段数据
/**
 * 获取修炼阶段数据
 * @returns {Promise<Array>} 修炼阶段数组
 */
export const getCultivationStages = async () => {
  try {
    console.log('获取修炼阶段数据');
    const mappings = await getMappingData();
    
    // 数据验证：确保mappings存在且包含cultivationStages
    if (!mappings || typeof mappings !== 'object') {
      console.error('映射数据格式错误:', mappings);
      throw new Error('映射数据格式错误');
    }
    
    if (!mappings.cultivationStages || !Array.isArray(mappings.cultivationStages)) {
      console.error('修炼阶段数据不存在或格式错误:', mappings.cultivationStages);
      throw new Error('修炼阶段数据不存在或格式错误');
    }
    
    console.log(`获取到${mappings.cultivationStages.length}个修炼阶段`);
    return mappings.cultivationStages;
  } catch (error) {
    console.error('获取修炼阶段数据失败:', error);
    throw error;
  }
};

// 获取功法映射数据
export const getCultivationMethodMapping = async () => {
  const mappings = await getMappingData();
  return mappings.cultivationMethodMapping;
};

/**
 * 获取掌门信息
 * @param {string} id - 掌门ID
 * @returns {Promise<any>} 掌门信息数据
 */
export const getLeaderInfo = async (id: string = 'leader_001') => {
  return await postRequest('/api/get-person-info', { id });
};

/**
 * 获取宗门信息
 * @param {string} id - 宗门ID
 * @returns {Promise<any>} 宗门信息数据（包含弟子和资源信息）
 */
export const getZongmenInfo = async (id: string = 'leader_001') => {
  return await postRequest('/api/get-zongmen-info', { id });
};

// 更新修炼值
export const updateCultivationValue = async (newValue: number, id: string = 'leader_001') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/update-cultivation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ increaseValue: newValue, id }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.status !== 'success') {
      throw new Error(result.message || '更新修炼值失败');
    }

    return result.data;
  } catch (error) {
    console.error('更新修炼值失败:', error);
    throw error;
  }
};

// 修炼值自增函数
// 更新修炼值
 export const increaseCultivationValue = async (increaseValue = 1, id: string = 'leader_001') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/update-cultivation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ increaseValue, id }),
    });

    // 检查响应状态
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `HTTP错误! 状态码: ${response.status}, 错误信息: ${errorData?.error || '未知错误'}`
      );
    }

    // 尝试解析JSON响应
    const data = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.error || '更新修炼值失败: 无效的响应格式');
    }

    return data.data;
  } catch (error) {
    console.error('更新修炼值时出错:', error);
    throw error; // 重新抛出错误以便前端处理
  }
};

/**
 * 获取弟子列表
 * @param {string} id - 宗门ID
 * @returns {Promise<any[]>} 弟子列表数据（包含境界名称）
 */
export const getDisciples = async (id: string = 'leader_001') => {
  try {
    const zongmenInfo = await getZongmenInfo(id);
    
    // 为每个弟子添加境界名称
    return (zongmenInfo.disciples || []).map((disciple: any) => ({
      id: disciple.id,
      name: disciple.name,
      realmLevel: disciple.realmLevel,
      cultivation: disciple.cultivation,
      status: disciple.status,
      realmName: getRealmNameByLevel(disciple.realmLevel)
    }));
  } catch (error) {
    console.error('获取弟子列表失败:', error);
    return [];
  }
};

/**
 * 获取宗门资源
 * @param {string} id - 宗门ID
 * @returns {Promise<any>} 宗门资源数据
 */
export const getResources = async (id: string = 'leader_001') => {
  try {
    const zongmenInfo = await getZongmenInfo(id);
    return {
      spiritStone: zongmenInfo.resources?.spiritStone || 0,
      herbs: zongmenInfo.resources?.herbs || 0,
      magicWeapons: zongmenInfo.resources?.magicWeapons || 0,
      treasures: zongmenInfo.resources?.treasures || 0
    };
  } catch (error) {
    console.error('获取宗门资源失败:', error);
    throw error;
  }
};

// 定义修炼阶段类型
interface CultivationStage {
  stageDivision: string;
  majorRealm: string;
  minorRealm: string;
  stage: string;
  minValue: number;
  maxValue: number;
}

// 根据修炼值获取当前修炼阶段信息
export const getCultivationStageByValue = async (value: number): Promise<CultivationStage | null> => {
  try {
    const cultivationStages = await getCultivationStages();
    
    // 按minValue排序境界列表
    const sortedStages = [...cultivationStages].sort((a, b) => a.minValue - b.minValue);
    
    // 查找匹配的修炼阶段
    let matchedStage = sortedStages.find(stage => 
      value >= stage.minValue && value <= stage.maxValue
    );
    
    // 如果修炼值超过当前阶段上限，查找下一个阶段
    if (!matchedStage) {
      // 找到第一个minValue大于当前值的阶段的前一个阶段
      const nextStageIndex = sortedStages.findIndex(stage => stage.minValue > value);
      if (nextStageIndex > 0) {
        matchedStage = sortedStages[nextStageIndex - 1];
      } else if (nextStageIndex === -1) {
        // 所有阶段的minValue都小于等于当前值，返回最高阶段
        matchedStage = sortedStages[sortedStages.length - 1];
      } else {
        // 如果修炼值小于所有阶段，返回第一个阶段
        matchedStage = sortedStages.length > 0 ? sortedStages[0] : null;
      }
    }
    
    return matchedStage || null;
  } catch (error) {
    console.error('获取修炼阶段信息失败:', error);
    throw error;
  }
};

/**
 * 境界等级到修炼阶段的映射配置（1-63对应完整修炼体系）
 * 每个境界等级唯一对应一个修炼阶段
 */
const REALM_LEVEL_TO_STAGE_MAPPING: { [key: number]: { minorRealm: string; stage: string } } = {
  // 凡人阶段 (0-6)
  0: { minorRealm: '未入仙途', stage: ' ' },
  1: { minorRealm: '练气', stage: '前期' },
  2: { minorRealm: '练气', stage: '中期' },
  3: { minorRealm: '练气', stage: '后期' },
  4: { minorRealm: '筑基', stage: '前期' },
  5: { minorRealm: '筑基', stage: '中期' },
  6: { minorRealm: '筑基', stage: '后期' },
  
  // 修士阶段 - 玄级
  7: { minorRealm: '开光', stage: '前期' },
  8: { minorRealm: '开光', stage: '中期' },
  9: { minorRealm: '开光', stage: '后期' },
  10: { minorRealm: '融合', stage: '前期' },
  11: { minorRealm: '融合', stage: '中期' },
  12: { minorRealm: '融合', stage: '后期' },
  13: { minorRealm: '心动', stage: '前期' },
  14: { minorRealm: '心动', stage: '中期' },
  15: { minorRealm: '心动', stage: '后期' },
  
  // 修士阶段 - 地级
  16: { minorRealm: '金丹', stage: '前期' },
  17: { minorRealm: '金丹', stage: '中期' },
  18: { minorRealm: '金丹', stage: '后期' },
  19: { minorRealm: '元婴', stage: '前期' },
  20: { minorRealm: '元婴', stage: '中期' },
  21: { minorRealm: '元婴', stage: '后期' },
  22: { minorRealm: '出窍', stage: '前期' },
  23: { minorRealm: '出窍', stage: '中期' },
  24: { minorRealm: '出窍', stage: '后期' },
  
  // 修士阶段 - 天级
  25: { minorRealm: '分神', stage: '前期' },
  26: { minorRealm: '分神', stage: '中期' },
  27: { minorRealm: '分神', stage: '后期' },
  28: { minorRealm: '合体', stage: '前期' },
  29: { minorRealm: '合体', stage: '中期' },
  30: { minorRealm: '合体', stage: '后期' },
  31: { minorRealm: '洞虚', stage: '前期' },
  32: { minorRealm: '洞虚', stage: '中期' },
  33: { minorRealm: '洞虚', stage: '后期' },
  
  // 修士阶段 - 帝级
  34: { minorRealm: '大乘', stage: '前期' },
  35: { minorRealm: '大乘', stage: '中期' },
  36: { minorRealm: '大乘', stage: '后期' },
  37: { minorRealm: '渡劫', stage: '前期' },
  38: { minorRealm: '渡劫', stage: '中期' },
  39: { minorRealm: '渡劫', stage: '后期' },
  
  // 仙神阶段 - 仙级
  40: { minorRealm: '仙人', stage: '前期' },
  41: { minorRealm: '仙人', stage: '中期' },
  42: { minorRealm: '仙人', stage: '后期' },
  43: { minorRealm: '仙君', stage: '前期' },
  44: { minorRealm: '仙君', stage: '中期' },
  45: { minorRealm: '仙君', stage: '后期' },
  46: { minorRealm: '仙王', stage: '前期' },
  47: { minorRealm: '仙王', stage: '中期' },
  48: { minorRealm: '仙王', stage: '后期' },
  49: { minorRealm: '仙帝', stage: '前期' },
  50: { minorRealm: '仙帝', stage: '中期' },
  51: { minorRealm: '仙帝', stage: '后期' },
  52: { minorRealm: '仙尊', stage: '前期' },
  53: { minorRealm: '仙尊', stage: '中期' },
  54: { minorRealm: '仙尊', stage: '后期' },
  
  // 仙神阶段 - 神级
  55: { minorRealm: '仙神', stage: '前期' },
  56: { minorRealm: '仙神', stage: '中期' },
  57: { minorRealm: '仙神', stage: '后期' },
  58: { minorRealm: '古神', stage: '前期' },
  59: { minorRealm: '古神', stage: '中期' },
  60: { minorRealm: '古神', stage: '后期' },
  61: { minorRealm: '祖神', stage: '前期' },
  62: { minorRealm: '祖神', stage: '中期' },
  63: { minorRealm: '祖神', stage: '后期' }
};

/**
 * 根据境界等级唯一确定对应的修炼阶段
 * @param {number} realmLevel - 境界等级 (1-8)
 * @returns {Promise<CultivationStage | undefined>} 对应的修炼阶段
 */
/**
 * 根据境界等级获取修炼阶段信息
 * @param {number} realmLevel - 境界等级
 * @returns {Promise<CultivationStage | undefined>} 修炼阶段信息
 */
export async function getCultivationStageByRealmLevel(realmLevel: number): Promise<CultivationStage | undefined> {
  try {
    console.log(`根据境界等级获取修炼阶段: ${realmLevel}`);
    
    // 参数验证
    if (typeof realmLevel !== 'number' || realmLevel < 0) {
      console.warn(`无效的境界等级参数: ${realmLevel}`);
      return undefined;
    }
    
    const cultivationStages = await getCultivationStages();
    
    // 确保获取到了修炼阶段数据
    if (!cultivationStages || !Array.isArray(cultivationStages)) {
      console.error('修炼阶段数据无效');
      return undefined;
    }
    
    const targetStage = REALM_LEVEL_TO_STAGE_MAPPING[realmLevel];
    if (!targetStage) {
      console.warn(`无效的境界等级: ${realmLevel}，支持的范围为0-63`);
      return undefined;
    }

    console.log(`查找境界映射: ${targetStage.minorRealm} ${targetStage.stage}`);
    
    // 查找对应的修炼阶段
    const foundStage = cultivationStages.find((stage: any) => 
      stage.minorRealm === targetStage.minorRealm && stage.stage === targetStage.stage
    );
    
    if (!foundStage) {
      console.warn(`未找到对应的修炼阶段: ${targetStage.minorRealm} ${targetStage.stage}`);
    } else {
      console.log(`找到修炼阶段:`, foundStage);
    }
    
    return foundStage;
  } catch (error) {
    console.error('根据境界等级获取修炼阶段失败:', error);
    throw error;
  }
}

/**
 * 获取境界等级映射表
 * @returns {Object} 境界等级到修炼阶段的映射关系
 */
export function getRealmLevelMapping(): { [key: number]: { minorRealm: string; stage: string } } {
  return REALM_LEVEL_TO_STAGE_MAPPING;
}

/**
 * 根据境界等级获取境界名称
 * @param {number} realmLevel - 境界等级 (0-63)
 * @returns {string} 境界名称，如"练气前期"或"未入仙途凡人"
 */
export function getRealmNameByLevel(realmLevel: number): string {
  // 验证境界等级范围
  if (realmLevel < 0 || realmLevel > 63) {
    return '未知境界';
  }
  
  const mapping = REALM_LEVEL_TO_STAGE_MAPPING[realmLevel];
  if (!mapping) {
    return `未知境界(${realmLevel})`;
  }
  return `${mapping.minorRealm}${mapping.stage}`;
}

// 更新境界等级
export const updateRealmLevel = async (id: string = 'leader_001') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/update-realm-level`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `HTTP错误! 状态码: ${response.status}, 错误信息: ${errorData?.error || '未知错误'}`
      );
    }

    const data = await response.json();
    if (!data.success || !data.data) {
      throw new Error(data.error || '更新境界等级失败: 无效的响应格式');
    }

    return data.data;
  } catch (error) {
    console.error('更新境界等级时出错:', error);
    throw error;
  }
};

// 激活境界突破按钮
/**
 * 激活境界突破
 * @param {string} id - 修炼者ID
 * @returns {Promise<Object>} 激活结果数据
 */
export const activateBreakthrough = async (id: string = 'leader_001') => {
  try {
    console.log(`发起激活境界突破请求: ${id}`);
    const response = await fetch(`${API_BASE_URL}/api/activate-breakthrough`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    console.log(`激活境界突破响应状态: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error(`激活境界突破HTTP错误:`, errorData);
      throw new Error(
        `HTTP错误! 状态码: ${response.status}, 错误信息: ${errorData?.error || '未知错误'}`
      );
    }

    const result = await response.json();
    console.log(`激活境界突破响应数据:`, result);
    
    // 修正：后端返回的是 success 字段，不是 status
    if (!result.success) {
      console.error(`激活境界突破业务错误:`, result);
      throw new Error(result.error || '激活境界突破失败: 无效的响应格式');
    }

    return result.data;
  } catch (error) {
    console.error('激活境界突破时出错:', error);
    throw error;
  }
};