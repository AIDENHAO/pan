import React, { useState, useEffect } from 'react';
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

// 类型断言确保JSON数据符合PositionMapping接口
const positionMapping: PositionMapping = positionMappingJson as PositionMapping;

/**
 * 主应用组件
 * 负责渲染整个应用界面，包括侧边导航和主内容区域
 */
const App: React.FC = (): React.ReactElement => {
  // 状态管理
  const [selectedNavItem, setSelectedNavItem] = useState<string>('leader');
  const [leaderInfo, setLeaderInfo] = useState<LeaderInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAutoIncreasing, setIsAutoIncreasing] = useState<boolean>(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [canBreakthrough, setCanBreakthrough] = useState<boolean>(false);

  // 安全访问leaderInfo的辅助函数，确保返回完整的LeaderInfo对象
  const getSafeLeaderInfo = (): LeaderInfo => {
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
  };

  /**
   * 获取并设置掌门信息
   * 从服务层获取掌门数据，并处理状态更新和错误处理
   */
  const fetchAndSetLeaderInfo = async (): Promise<void> => {
    if (selectedNavItem !== 'leader') return;

    try {
      setLoading(true);
      const data = await fetchLeaderInfo();
      console.log('获取到的掌门原始数据:', data);

      // 全面验证数据格式和必要字段
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error(`掌门数据格式错误，预期为非数组对象，实际类型: ${typeof data}，数据: ${JSON.stringify(data)}`);
      }

      const requiredFields = ['realmLevel', 'cultivationValue', 'name', 'position'];
      const missingFields = requiredFields.filter(field => !(field in data));
      if (missingFields.length > 0) {
        throw new Error(`掌门数据缺少必要字段: ${missingFields.join(', ')}`);
      }

      if (typeof data.realmLevel !== 'number') {
        throw new Error(`realmLevel类型错误，预期为数字，实际为${typeof data.realmLevel}`);
      }

      // 使用realmLevel获取境界信息
      const stage = getCultivationStageByRealmLevel(data.realmLevel) || {
        stageDivision: '',
        majorRealm: '',
        minorRealm: '',
        stage: '',
        maxValue: 0
      };
      console.log('计算得到的境界信息:', stage);

      if (!stage.maxValue) {
        console.warn('境界信息中maxValue未定义或为0，可能导致突破逻辑异常');
      }

      setLeaderInfo({ ...data, cultivationStage: stage, maxValue: stage.maxValue });
      setError(null);
    } catch (err) {
      setError('获取掌门信息失败，请重试');
      console.error('Error fetching leader info:', err);
    } finally {
      setLoading(false);
    }
  };

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
  }, [selectedNavItem]);

  /**
   * 检查是否可以突破境界
   * 根据当前修炼值和境界上限更新突破状态
   */
  useEffect(() => {
    if (leaderInfo) {
      setCanBreakthrough(
        leaderInfo.cultivationValue >= leaderInfo.maxValue &&
        !(leaderInfo.cultivationOverLimit || false)
      );
    }
  }, [leaderInfo]);

  /**
   * 处理境界突破
   * 调用服务层更新境界等级，并更新本地状态
   */
  const handleRealmBreakthrough = async (): Promise<void> => {
    if (!leaderInfo) return;

    try {
      setLoading(true);
      const updatedInfo = await updateRealmLevel();
      setLeaderInfo(updatedInfo);
      alert('境界突破成功！');
    } catch (error) {
      console.error('突破失败:', error);
      alert('境界突破失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 开始自动增加修炼值
   * 设置定时器，每秒增加修炼值并更新状态
   */
  const startAutoCultivation = async (): Promise<void> => {
    if (isAutoIncreasing || !leaderInfo) return;

    try {
      const id: NodeJS.Timeout = setInterval(async () => {
        try {
          const updated = await increaseCultivationValue(20);
          const newStage = getCultivationStageByValue(updated.cultivationValue);
          setLeaderInfo(prev => prev ? {...prev, ...updated, cultivationStage: newStage, maxValue: newStage.maxValue} : updated);

          if (updated.cultivationValue >= newStage.maxValue) {
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
  };

  /**
   * 停止自动增加修炼值
   * 清除定时器并更新状态
   */
  const stopAutoCultivation = (): void => {
    setIsAutoIncreasing(false);
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };

  /**
   * 渲染主内容区域
   * 根据选中的导航项显示不同内容
   */
  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchAndSetLeaderInfo}>重试</button>
        </div>
      );
    }

    switch (selectedNavItem) {
      case 'leader':
        return (
          <div className="leader-info-container">
            <div className="leader-header">
              <div className="leader-avatar">
                <div className="avatar-frame">{leaderInfo?.name.charAt(0)}</div>
              </div>
              <div className="leader-basic-info">
                <h3>{leaderInfo?.name}<span className="title">{leaderInfo?.title}</span></h3>
                <p className="position">{positionMapping[getSafeLeaderInfo().position] || '未知职位'}</p>
              </div>
            </div>

            <div className="leader-stats">
              <div className="stat-card">
                <h4>修为境界</h4>
                <div className="realm-display">
                  {leaderInfo?.cultivationStage ? (
                    `${leaderInfo.cultivationStage.stageDivision} ${leaderInfo.cultivationStage.majorRealm} ${leaderInfo.cultivationStage.minorRealm} ${leaderInfo.cultivationStage.stage}`
                  ) : '未知境界'}
                </div>
              </div>
              <div className="stat-card">
                <h4>修炼进度</h4>
                <div className="cultivation-bar">
                  <div className="progress" style={{ width: `${(leaderInfo?.cultivationValue || 0) / (leaderInfo?.maxValue || 1) * 100}%` }}></div>
                </div>
                <div className="cultivation-value">
                  {leaderInfo?.cultivationValue}/{leaderInfo?.maxValue}
                </div>
                <div className="cultivation-controls">
                  <button 
                    onClick={isAutoIncreasing ? stopAutoCultivation : startAutoCultivation}
                    className={isAutoIncreasing ? 'stop-btn' : 'start-btn'}
                    disabled={getSafeLeaderInfo().cultivationValue >= getSafeLeaderInfo().maxValue}
                  >
                    {isAutoIncreasing ? '停止修炼' : '开始修炼'}
                  </button>
                  <button 
                    onClick={handleRealmBreakthrough}
                    className="start-btn"
                    disabled={!canBreakthrough || loading}
                  >
                    境界突破
                  </button>
                  {getSafeLeaderInfo().cultivationValue >= getSafeLeaderInfo().maxValue && (
                    <span className="max-reached">已达当前境界上限</span>
                  )}
                </div>
              </div>
            </div>

            <div className="leader-skills">
              <h4>绝学技能</h4>
              <div className="skills-list">
                {(leaderInfo?.skills || []).map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="leader-details">
              <h4>基本信息</h4>
              <div className="detail-item">
                <span className="label">加入日期:</span>
                <span className="value">{leaderInfo?.joinDate}</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="default-content">
            <h2>{navItems.find(item => item.id === selectedNavItem)?.name}</h2>
            <p>此功能模块正在开发中...</p>
          </div>
        );
    }
  };

  // 导航菜单数据
  const navItems: NavItem[] = [
    { id: 'leader', name: '掌门信息' },
    { id: 'sect', name: '宗门信息' },
    { id: 'disciples', name: '弟子管理' },
    { id: 'resources', name: '资源管理' },
    { id: 'missions', name: '任务发布' },
    { id: 'settings', name: '设置' }
  ];

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
        <div className="content-body">{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;