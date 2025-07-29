import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import { increaseCultivationValue, getCultivationStageByValue, getCultivationStageByRealmLevel, getLeaderInfo as fetchLeaderInfo } from './services/leaderService';
import { updateRealmLevel } from './services/leaderService';
import positionMappingJson from './data/positionMapping.json';
import realmMapping from './data/realmMapping.json';

// 声明NodeJS命名空间以解决类型错误
declare namespace NodeJS {
  interface Timeout {
    _idleTimeout?: number;
  }
}

// 类型定义
/**
 * 职位映射接口
 * 键为职位ID，值为职位名称
 */
interface PositionMapping {
  [key: number]: string;
}

/**
 * 导航项接口
 * 定义侧边栏导航菜单的结构
 */
interface NavItem {
  id: string;
  name: string;
  icon?: string;
}

/**
 * 境界映射接口
 * 键为境界等级，值为境界名称
 */
interface RealmMapping {
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
interface LeaderInfo {
  name: string;
  title: string;
  realmLevel: number;
  cultivationValue: number;
  maxValue: number;
  position: number;
  joinDate: string;
  skills: string[];
  cultivationOverLimit?: boolean;
  cultivationStage: CultivationStage;
}

// 静态数据 - 导航菜单配置
const navItems: NavItem[] = [
  { id: 'leader', name: '掌门信息' },
  { id: 'sect', name: '宗门信息' },
  { id: 'disciples', name: '弟子管理' },
  { id: 'resources', name: '资源管理' },
  { id: 'missions', name: '任务发布' },
  { id: 'settings', name: '设置' }
];

// 类型断言确保JSON数据符合PositionMapping接口
const positionMapping: PositionMapping = positionMappingJson as PositionMapping;

/**
 * 加载状态组件
 * 独立封装加载指示器，避免重复代码
 */
const LoadingIndicator: React.FC = () => (
  <div className="loading">
    <div className="spinner"></div>
    <p>加载中...</p>
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
  // 添加调试日志，跟踪修炼值和最大值变化
  useEffect(() => {
    console.log(`修炼值更新: ${cultivationValue}/${maxValue}`);
  }, [cultivationValue, maxValue]);

  // 缓存修炼进度百分比计算结果
  const progressPercentage = useMemo(() => {
    if (maxValue <= 0) return 0;
    // 确保百分比不会超过100%
    return Math.min((cultivationValue / maxValue) * 100, 100);
  }, [cultivationValue, maxValue]);

  // 计算是否达到修炼上限
  const isAtMax = useMemo(() => {
    return cultivationValue >= maxValue;
  }, [cultivationValue, maxValue]);

  return (
    <div className="stat-card">
      <h4>修炼进度</h4>
      <div className="cultivation-bar">
        <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      <div className="cultivation-value">
        {cultivationValue}/{maxValue}
      </div>
      <div className="cultivation-controls">
        <button 
          onClick={onToggleAutoCultivation}
          className={isAutoIncreasing ? 'stop-btn' : 'start-btn'}
          disabled={isAtMax}
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
        {isAtMax && (
          <span className="max-reached">已达当前境界上限</span>
        )}
      </div>
    </div>
  );
});

/**
 * 绝学技能列表组件
 * 独立封装技能标签展示
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
 * 主应用组件
 * 负责渲染整个应用界面，包括侧边导航和主内容区域
 */
const App: React.FC = (): React.ReactElement => {
  // 状态管理
  const [selectedNavItem, setSelectedNavItem] = useState<string>('leader');
  const [leaderInfo, setLeaderInfo] = useState<LeaderInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isAutoIncreasing, setIsAutoIncreasing] = useState<boolean>(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [canBreakthrough, setCanBreakthrough] = useState<boolean>(false);

  // 安全访问leaderInfo的辅助函数，使用useMemo缓存结果
  const safeLeaderInfo = useMemo<LeaderInfo>(() => {
    if (!leaderInfo) {
      return {
        name: '',
        title: '',
        realmLevel: 0,
        cultivationValue: 0,
        maxValue: 0,
        position: 0,
        joinDate: '',
        skills: [],
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
    if (selectedNavItem !== 'leader') return;

    try {
      setLoading(true);
      setError(false);
      const data = await fetchLeaderInfo();

      // 数据验证逻辑保持不变
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error(`掌门数据格式错误`);
      }

      const requiredFields = ['realmLevel', 'cultivationValue', 'name', 'position'];
      const missingFields = requiredFields.filter(field => !(field in data));
      if (missingFields.length > 0) {
        throw new Error(`掌门数据缺少必要字段: ${missingFields.join(', ')}`);
      }

      if (typeof data.realmLevel !== 'number') {
        throw new Error(`realmLevel类型错误`);
      }

      const stage = getCultivationStageByRealmLevel(data.realmLevel) || {
        stageDivision: '',
        majorRealm: '',
        minorRealm: '',
        stage: '',
        maxValue: 0
      };

      setLeaderInfo({ ...data, cultivationStage: stage, maxValue: stage.maxValue });
    } catch (err) {
      setError(true);
      console.error('Error fetching leader info:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedNavItem]);

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
   * 根据当前修炼值和境界上限更新突破状态
   */
  useEffect(() => {
    setCanBreakthrough(
      safeLeaderInfo.cultivationValue >= safeLeaderInfo.maxValue &&
      !(safeLeaderInfo.cultivationOverLimit || false)
    );
  }, [safeLeaderInfo]);

  /**
   * 处理境界突破
   * 调用服务层更新境界等级，并更新本地状态
   */
  const handleRealmBreakthrough = useCallback(async (): Promise<void> => {
    if (!safeLeaderInfo.name) return;

    try {
      setLoading(true);
      const updatedInfo = await updateRealmLevel();
      // 突破成功后重置修炼超限状态
      setLeaderInfo(prev => prev ? {
        ...prev,
        ...updatedInfo,
        cultivationOverLimit: false
      } : updatedInfo);
      alert('境界突破成功！');
    } catch (error) {
      console.error('突破失败:', error);
      alert('境界突破失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [safeLeaderInfo.name]);

  /**
   * 切换自动修炼状态
   * 根据当前状态启动或停止自动修炼
   */
  const toggleAutoCultivation = useCallback(async (): Promise<void> => {
    if (isAutoIncreasing) {
      stopAutoCultivation();
    } else {
      startAutoCultivation();
    }
  }, [isAutoIncreasing]);

  /**
   * 开始自动增加修炼值
   * 设置定时器，每秒增加修炼值并更新状态
   */
  const startAutoCultivation = useCallback(async (): Promise<void> => {
    if (isAutoIncreasing || !leaderInfo) return;
  
    try {
      const id: NodeJS.Timeout = setInterval(async () => {
        try {
          const updated = await increaseCultivationValue(20);
          const newStage = getCultivationStageByValue(updated.cultivationValue);
          // 检查是否超过当前阶段最大值
          const isOverLimit = updated.cultivationValue > newStage.maxValue;
          // 如果超过，将修炼值设为最大值
          const clampedValue = isOverLimit ? newStage.maxValue : updated.cultivationValue;
  
          setLeaderInfo(prev => prev ? {
            ...prev,
            ...updated,
            cultivationValue: clampedValue,
            cultivationStage: newStage,
            maxValue: newStage.maxValue,
            cultivationOverLimit: isOverLimit
          } : {
            ...updated,
            cultivationValue: clampedValue,
            cultivationStage: newStage,
            maxValue: newStage.maxValue,
            cultivationOverLimit: isOverLimit
          });
  
          if (clampedValue >= newStage.maxValue) {
            stopAutoCultivation();
          }
        } catch (error) {
          console.error('修炼错误:', error);
          stopAutoCultivation();
          alert('修炼过程中发生错误，已自动停止');
        }
      }, 1000);
  
      setTimerId(id);
      setIsAutoIncreasing(true);
    } catch (error) {
      console.error('启动修炼失败:', error);
      alert('无法启动修炼，请重试');
    }
  }, [isAutoIncreasing, leaderInfo]);

  /**
   * 停止自动增加修炼值
   * 清除定时器并更新状态
   */
  const stopAutoCultivation = useCallback(() => {
    setIsAutoIncreasing(false);
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  }, [timerId]);

  // 渲染掌门信息内容
  const renderLeaderInfo = useMemo(() => {
    if (loading) return <LoadingIndicator />;
    if (error) return <ErrorDisplay onRetry={fetchAndSetLeaderInfo} />;

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
              {safeLeaderInfo.cultivationStage ? (
                `${safeLeaderInfo.cultivationStage.stageDivision} ${safeLeaderInfo.cultivationStage.majorRealm} ${safeLeaderInfo.cultivationStage.minorRealm} ${safeLeaderInfo.cultivationStage.stage}`
              ) : '未知境界'}
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
  }, [loading, error, safeLeaderInfo, isAutoIncreasing, canBreakthrough, toggleAutoCultivation, handleRealmBreakthrough, fetchAndSetLeaderInfo]);

  // 渲染默认内容（未开发模块）
  const renderDefaultContent = useMemo(() => {
    const currentNavItem = navItems.find(item => item.id === selectedNavItem);
    return (
      <div className="default-content">
        <h2>{currentNavItem?.name}</h2>
        <p>此功能模块正在开发中...</p>
      </div>
    );
  }, [selectedNavItem]);

  return (
    <div className="app-container">
      {/* 侧边导航栏 */}
      <aside className="sidebar">
        <div className="sect-name">
          <h1>青云宗</h1>
        </div>
        <div className="nav-list">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${selectedNavItem === item.id ? 'active' : ''}`}
              onClick={() => setSelectedNavItem(item.id)}
            >
              <span className="nav-icon">{item.icon || '📄'}</span>
              <span className="nav-text">{item.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* 主内容区域 */}
      <main className="main-content">
        <header className="content-header">
          <h1>{navItems.find(item => item.id === selectedNavItem)?.name}</h1>
        </header>
        <div className="content-body">
          {selectedNavItem === 'leader' ? renderLeaderInfo : renderDefaultContent}
        </div>
      </main>
    </div>
  );
};

export default App;