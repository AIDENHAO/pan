import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getLeaderInfo as fetchLeaderInfo,
  increaseCultivationValue,
  updateRealmLevel,
  getCultivationStageByRealmLevel,
  getPositionMapping,
  getRealmNameByLevel,
  activateBreakthrough
} from '../services/leaderService';
import positionMappingJson from '../data/positionMapping.json';
import '../styles/LeaderPage.css';

// 类型定义
/**
 * 职位映射接口
 * 键为职位ID，值为职位名称
 */
interface PositionMapping {
  [key: number]: string;
}

/**
 * 修炼阶段接口
 * 定义修炼境界的详细信息
 */
interface CultivationStage {
  stageDivision: string;
  majorRealm: string;
  minorRealm: string;
  stage: string;
  maxValue: number;
}

/**
 * 掌门信息接口
 * 定义掌门的基本信息和修炼状态
 */
/**
 * 掌门信息接口
 * 定义掌门的完整信息结构
 */
interface LeaderInfo {
  id: string;
  name: string;
  title: string;
  realmLevel: number;
  cultivationValue: number;
  cultivationLimitAdd?: number;
  cultivationOverLimit?: boolean;
  talentValue?: number;
  position: number;
  positionName?: string;
  joinDate: string;
  skills: string[];
  // 境界突破控制字段
  canBreakthrough?: boolean;
  breakthroughEnabled?: boolean;
  breakthroughCooldown?: number;
  lastBreakthroughTime?: string | null;
  // 前端计算字段
  maxValue: number;
  cultivationStage: CultivationStage;
}

// 类型断言确保JSON数据符合PositionMapping接口
const positionMapping: PositionMapping = positionMappingJson as PositionMapping;

/**
 * 加载状态组件
 * 独立封装加载指示器，避免重复代码
 */
const LoadingIndicator: React.FC = () => (
  <div className="loading">
    <div className="spinner"></div>
    <p className="loading-text">加载中...</p>
  </div>
);

/**
 * 错误提示组件
 * 独立封装错误显示和重试逻辑
 */
const ErrorDisplay: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="error-message">
    <p>获取掌门信息失败，请重试</p>
    <button onClick={onRetry}>重试</button>
  </div>
);

/**
 * 修炼进度条组件
 * 独立封装修炼进度显示和控制逻辑
 */
const CultivationProgress: React.FC<{
  cultivationValue: number;
  maxValue: number;
  isAutoIncreasing: boolean;
  canBreakthrough: boolean;
  loading: boolean;
  onToggleAutoCultivation: () => void;
  onBreakthrough: () => void;
}> = React.memo(({
  cultivationValue,
  maxValue,
  isAutoIncreasing,
  canBreakthrough,
  loading,
  onToggleAutoCultivation,
  onBreakthrough
}) => {
  const progressPercentage = useMemo(() => {
    return maxValue > 0 ? Math.min((cultivationValue / maxValue) * 100, 100) : 0;
  }, [cultivationValue, maxValue]);

  return (
    <div className="stat-card">
      <h4>修炼进度</h4>
      <div className="cultivation-bar">
        <div 
          className="progress" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="cultivation-value">
        {cultivationValue}/{maxValue}
      </div>
      <div className="cultivation-controls">
        <button 
          onClick={onToggleAutoCultivation}
          className={isAutoIncreasing ? 'stop-btn' : 'start-btn'}
          disabled={cultivationValue >= maxValue}
        >
          {isAutoIncreasing ? '停止修炼' : '开始修炼'}
        </button>
        <button 
          onClick={onBreakthrough}
          className="start-btn"
          disabled={!canBreakthrough || loading}
        >
          境界突破
        </button>
        {cultivationValue >= maxValue && (
          <span className="max-reached">已达当前境界上限</span>
        )}
      </div>
    </div>
  );
});

/**
 * 技能列表组件
 * 独立封装技能显示逻辑，使用React.memo优化性能
 */
const SkillList: React.FC<{ skills: string[] }> = React.memo(({ skills }) => (
  <div className="leader-skills">
    <h4>绝学技能</h4>
    <div className="skills-list">
      {skills.map((skill, index) => (
        <span key={index} className="skill-tag">{skill}</span>
      ))}
    </div>
  </div>
));



/**
 * 掌门信息页面组件
 * 负责显示和管理掌门的详细信息
 */
const LeaderPage: React.FC = (): React.ReactElement => {
  // 状态管理
  const [leaderInfo, setLeaderInfo] = useState<LeaderInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isAutoIncreasing, setIsAutoIncreasing] = useState<boolean>(false);
  const [timerId, setTimerId] = useState<number | null>(null);
  const [canBreakthrough, setCanBreakthrough] = useState<boolean>(false);

  // 安全访问leaderInfo的辅助函数，使用useMemo缓存结果
  const safeLeaderInfo = useMemo<LeaderInfo>(() => {
    if (!leaderInfo) {
      return {
        id: '',
        name: '',
        title: '',
        realmLevel: 0,
        cultivationValue: 0,
        cultivationLimitAdd: 0,
        cultivationOverLimit: false,
        talentValue: 0,
        position: 0,
        positionName: '',
        joinDate: '',
        skills: [],
        maxValue: 0,
        cultivationStage: {
          stageDivision: '',
          majorRealm: '',
          minorRealm: '',
          stage: '',
          maxValue: 0
        }
      };
    }
    return leaderInfo;
  }, [leaderInfo]);

  /**
   * 获取并设置掌门信息
   * 从服务层获取掌门数据，并处理状态更新和错误处理
   */
  const fetchAndSetLeaderInfo = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(false);
      const data = await fetchLeaderInfo('leader_001');

      // 数据验证逻辑
      console.log('开始验证掌门数据:', data);
      
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        console.error('掌门数据格式错误:', data);
        throw new Error(`掌门数据格式错误: 期望对象类型，实际收到 ${typeof data}`);
      }

      const requiredFields = ['id', 'realmLevel', 'cultivationValue', 'name', 'position'];
      const missingFields = requiredFields.filter(field => !(field in data));
      if (missingFields.length > 0) {
        console.error('掌门数据缺少必要字段:', missingFields, '实际数据:', data);
        throw new Error(`掌门数据缺少必要字段: ${missingFields.join(', ')}`);
      }

      // 类型验证
      if (typeof data.realmLevel !== 'number') {
        console.error('realmLevel类型错误:', typeof data.realmLevel, data.realmLevel);
        throw new Error(`realmLevel类型错误: 期望number，实际收到 ${typeof data.realmLevel}`);
      }
      
      if (typeof data.cultivationValue !== 'number') {
        console.error('cultivationValue类型错误:', typeof data.cultivationValue, data.cultivationValue);
        throw new Error(`cultivationValue类型错误: 期望number，实际收到 ${typeof data.cultivationValue}`);
      }
      
      if (typeof data.name !== 'string') {
        console.error('name类型错误:', typeof data.name, data.name);
        throw new Error(`name类型错误: 期望string，实际收到 ${typeof data.name}`);
      }
      
      if (typeof data.position !== 'number') {
        console.error('position类型错误:', typeof data.position, data.position);
        throw new Error(`position类型错误: 期望number，实际收到 ${typeof data.position}`);
      }
      
      console.log('掌门数据验证通过');

      // 获取修炼阶段信息
      console.log(`获取境界等级 ${data.realmLevel} 对应的修炼阶段`);
      let stage;
      try {
        stage = await getCultivationStageByRealmLevel(data.realmLevel);
        if (!stage) {
          console.warn(`未找到境界等级 ${data.realmLevel} 对应的修炼阶段，使用默认值`);
          stage = {
            stageDivision: '未知阶段',
            majorRealm: '未知境界',
            minorRealm: '未知',
            stage: '未知',
            maxValue: 1000
          };
        } else {
          console.log('成功获取修炼阶段:', stage);
        }
      } catch (stageError) {
        console.error('获取修炼阶段失败，使用默认值:', stageError);
        stage = {
          stageDivision: '未知阶段',
          majorRealm: '未知境界',
          minorRealm: '未知',
          stage: '未知',
          maxValue: 1000
        };
      }

      // 构建完整的掌门信息对象
      const leaderInfoData: LeaderInfo = {
        id: data.id,
        name: data.name,
        title: data.title || '',
        realmLevel: data.realmLevel,
        cultivationValue: data.cultivationValue,
        cultivationLimitAdd: data.cultivationLimitAdd || 0,
        cultivationOverLimit: data.cultivationOverLimit || false,
        talentValue: data.talentValue || 0,
        position: data.position,
        positionName: data.positionName || positionMapping[data.position] || '未知职位',
        joinDate: data.joinDate || '',
        skills: data.skills || [],
        // 境界突破控制字段
        canBreakthrough: data.canBreakthrough || false,
        breakthroughEnabled: data.breakthroughEnabled !== undefined ? data.breakthroughEnabled : true,
        breakthroughCooldown: data.breakthroughCooldown || 0,
        lastBreakthroughTime: data.lastBreakthroughTime || null,
        maxValue: stage.maxValue,
        cultivationStage: stage
      };

      setLeaderInfo(leaderInfoData);
    } catch (err) {
      setError(true);
      console.error('Error fetching leader info:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 初始化和清理副作用
   * 处理掌门信息获取和定时器清理
   */
  useEffect(() => {
    fetchAndSetLeaderInfo();

    // 清理函数
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [fetchAndSetLeaderInfo]);

  /**
   * 检查是否可以突破境界
   * 根据修炼值、境界上限和控制字段更新突破状态
   */
  useEffect(() => {
    const canBreakthroughByValue = safeLeaderInfo.cultivationValue >= safeLeaderInfo.maxValue;
    const isNotOverLimit = !(safeLeaderInfo.cultivationOverLimit || false);
    const isBreakthroughEnabled = safeLeaderInfo.breakthroughEnabled !== false;
    const hasBreakthroughPermission = safeLeaderInfo.canBreakthrough !== false;
    
    setCanBreakthrough(
      canBreakthroughByValue && 
      isNotOverLimit && 
      isBreakthroughEnabled && 
      hasBreakthroughPermission
    );
  }, [safeLeaderInfo]);

  /**
   * 监听修炼值变化，当达到最大值时自动激活境界突破
   */
  useEffect(() => {
    const shouldActivateBreakthrough = 
      safeLeaderInfo.cultivationValue >= safeLeaderInfo.maxValue &&
      !safeLeaderInfo.canBreakthrough &&
      safeLeaderInfo.breakthroughEnabled !== false;

    if (shouldActivateBreakthrough) {
      const activateBreakthroughAsync = async () => {
        try {
          await activateBreakthrough('leader_001');
          // 重新获取掌门信息以更新状态
          await fetchAndSetLeaderInfo();
        } catch (error) {
          console.error('自动激活境界突破失败:', error);
        }
      };
      
      activateBreakthroughAsync();
    }
  }, [safeLeaderInfo.cultivationValue, safeLeaderInfo.maxValue, safeLeaderInfo.canBreakthrough, safeLeaderInfo.breakthroughEnabled]);

  /**
   * 处理境界突破
   * 调用服务层API更新境界等级
   */
  const handleRealmBreakthrough = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const updatedData = await updateRealmLevel('leader_001');
      const newStage = await getCultivationStageByRealmLevel(updatedData.realmLevel) || {
        stageDivision: '',
        majorRealm: '',
        minorRealm: '',
        stage: '',
        maxValue: 0
      };
      setLeaderInfo({ ...updatedData, cultivationStage: newStage, maxValue: newStage.maxValue });
      setCanBreakthrough(false);
    } catch (error) {
      console.error('境界突破失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 开始自动修炼
   * 启动定时器自动增加修炼值
   */
  const handleStartAutoIncrease = useCallback(async (): Promise<void> => {
    if (isAutoIncreasing || safeLeaderInfo.cultivationValue >= safeLeaderInfo.maxValue) {
      return;
    }

    setIsAutoIncreasing(true);
    const intervalId = window.setInterval(async () => {
      try {
        const updatedData = await increaseCultivationValue(1, 'leader_001');
        const newStage = await getCultivationStageByRealmLevel(updatedData.realmLevel) || {
          stageDivision: '',
          majorRealm: '',
          minorRealm: '',
          stage: '',
          maxValue: 0
        };
        setLeaderInfo({ ...updatedData, cultivationStage: newStage, maxValue: newStage.maxValue });

        // 检查是否达到上限
        if (updatedData.cultivationValue >= newStage.maxValue) {
          setIsAutoIncreasing(false);
          window.clearInterval(intervalId);
          setTimerId(null);
        }
      } catch (error) {
        console.error('修炼值增加失败:', error);
        setIsAutoIncreasing(false);
        window.clearInterval(intervalId);
        setTimerId(null);
      }
    }, 1000);

    setTimerId(intervalId);
  }, [isAutoIncreasing, safeLeaderInfo.cultivationValue, safeLeaderInfo.maxValue]);

  /**
   * 停止自动修炼
   * 清除定时器并更新状态
   */
  const handleStopAutoIncrease = useCallback((): void => {
    setIsAutoIncreasing(false);
    if (timerId) {
      window.clearInterval(timerId);
      setTimerId(null);
    }
  }, [timerId]);

  /**
   * 切换自动修炼状态
   * 根据当前状态启动或停止自动修炼
   */
  const toggleAutoCultivation = useCallback((): void => {
    if (isAutoIncreasing) {
      handleStopAutoIncrease();
    } else {
      handleStartAutoIncrease();
    }
  }, [isAutoIncreasing, handleStopAutoIncrease, handleStartAutoIncrease]);

  // 渲染加载状态
  if (loading) {
    return <LoadingIndicator />;
  }

  // 渲染错误状态
  if (error) {
    return <ErrorDisplay onRetry={fetchAndSetLeaderInfo} />;
  }

  // 渲染掌门信息内容
  return (
    <div className="leader-info-container">
      <div className="leader-header">
        <div className="leader-avatar">
          <div className="avatar-frame">{safeLeaderInfo.name.charAt(0)}</div>
        </div>
        <div className="leader-basic-info">
          <h3>{safeLeaderInfo.name}<span className="title">{safeLeaderInfo.title}</span></h3>
          <p className="position">{positionMapping[safeLeaderInfo.position] || '未知职位'}</p>
        </div>
      </div>

      <div className="leader-stats">
        <div className="stat-card">
          <h4>修为境界</h4>
          <div className="realm-display">
            <div className="realm-level">境界等级: {safeLeaderInfo.realmLevel}</div>
            <div className="realm-name">{getRealmNameByLevel(safeLeaderInfo.realmLevel)}</div>
            {safeLeaderInfo.cultivationStage && (
              <div className="realm-details">
                {safeLeaderInfo.cultivationStage.stageDivision} {safeLeaderInfo.cultivationStage.majorRealm}
              </div>
            )}
          </div>
        </div>

        <CultivationProgress
          key={`${safeLeaderInfo.cultivationValue}-${safeLeaderInfo.maxValue}`}
          cultivationValue={safeLeaderInfo.cultivationValue}
          maxValue={safeLeaderInfo.maxValue}
          isAutoIncreasing={isAutoIncreasing}
          canBreakthrough={canBreakthrough}
          loading={loading}
          onToggleAutoCultivation={toggleAutoCultivation}
          onBreakthrough={handleRealmBreakthrough}
        />
      </div>

      <SkillList skills={safeLeaderInfo.skills} />

      <div className="leader-details">
        <h4>基本信息</h4>
        <div className="detail-item">
          <span className="label">加入日期:</span>
          <span className="value">{safeLeaderInfo.joinDate}</span>
        </div>
      </div>
    </div>
  );
};

export default LeaderPage;