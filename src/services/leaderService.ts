import positionMapping from '../data/positionMapping.json';
import realmMapping from '../data/realmMapping.json';
import cultivationStages from '../data/cultivationStages.json';
import leaderInfo from '../data/leaderInfo.json';

// 获取职位映射
export const getPositionMapping = async () => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  return { ...positionMapping };
};

// 获取修炼境界映射
export const getRealmMapping = async () => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  return { ...realmMapping };
};

// 获取掌门信息（包含职位名称和境界名称）
export const getLeaderInfo = async () => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    ...leaderInfo,
    positionName: positionMapping[leaderInfo.position.toString()],
    realmName: realmMapping[leaderInfo.realmLevel.toString()]
  };
};

// 更新修炼值
export const updateCultivationValue = async (newValue: number) => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 在实际应用中，这里会发送API请求更新服务器数据
  // 这里仅做本地模拟
  const updatedInfo = { ...leaderInfo, cultivationValue: newValue };
  
  return updatedInfo;
};

// 修炼值自增函数
// 更新修炼值
 export const increaseCultivationValue = async (increaseValue = 1) => {
  try {
    const response = await fetch('/api/update-cultivation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ increaseValue }),
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

// 获取弟子列表（包含境界名称）
export const getDisciples = async () => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 600));
  return (leaderInfo.disciples || []).map(disciple => ({
    ...disciple,
    realmName: realmMapping[disciple.realmLevel.toString()]
  }));
};

// 获取宗门资源
export const getResources = async () => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 600));
  return leaderInfo.resources || {};
};

// 根据修炼值获取当前修炼阶段信息
export const getCultivationStageByValue = (value: number): {
  stageDivision: string;
  majorRealm: string;
  minorRealm: string;
  stage: string;
  minValue: number;
  maxValue: number;
} | null => {
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
};

export function getCultivationStageByRealmLevel(realmLevel: number): CultivationStage | undefined {
  // 获取境界名称映射
  const minorRealm = realmMapping[realmLevel.toString()];
  if (!minorRealm) return undefined;

  // 查找对应境界的第一个阶段
  return cultivationStages.find(stage => stage.minorRealm === minorRealm);
}

// 更新境界等级
export const updateRealmLevel = async () => {
  try {
    const response = await fetch('/api/update-realm-level', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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