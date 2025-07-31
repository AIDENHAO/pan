/**
 * 人物展示页面组件
 * @file PeopleDisplayPage.tsx
 * @description 展示peopleData.json中的人物数据，支持左右键切换人物
 */

import React, { useState, useEffect, useCallback } from 'react';
import { IPeopleData } from '../types/peopleData';
import { PeopleDataService } from '../../backend/services/peopleDataService';
import '../styles/PeopleDisplayPage.css';

/**
 * 人物展示页面组件
 * 提供现代化的人物信息展示界面，支持键盘导航和响应式设计
 */
const PeopleDisplayPage: React.FC = () => {
  // 状态管理
  const [peopleList, setPeopleList] = useState<IPeopleData[]>([]);
  const [currentPersonIndex, setCurrentPersonIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取人物数据服务实例
  const peopleService = PeopleDataService.getInstance();

  /**
   * 初始化加载人物数据
   */
  const loadPeopleData = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      
      const allPeople = peopleService.getAllPeople();
      
      if (allPeople.length === 0) {
        setError('暂无人物数据');
        return;
      }
      
      setPeopleList(allPeople);
      setCurrentPersonIndex(0);
    } catch (err) {
      console.error('加载人物数据失败:', err);
      setError('加载人物数据失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, [peopleService]);

  /**
   * 切换到上一个人物
   */
  const handlePreviousPerson = useCallback(() => {
    if (peopleList.length === 0) return;
    
    setCurrentPersonIndex(prevIndex => 
      prevIndex === 0 ? peopleList.length - 1 : prevIndex - 1
    );
  }, [peopleList.length]);

  /**
   * 切换到下一个人物
   */
  const handleNextPerson = useCallback(() => {
    if (peopleList.length === 0) return;
    
    setCurrentPersonIndex(prevIndex => 
      prevIndex === peopleList.length - 1 ? 0 : prevIndex + 1
    );
  }, [peopleList.length]);

  /**
   * 处理键盘事件
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        handlePreviousPerson();
        break;
      case 'ArrowRight':
        event.preventDefault();
        handleNextPerson();
        break;
      default:
        break;
    }
  }, [handlePreviousPerson, handleNextPerson]);

  /**
   * 组件挂载时的副作用
   */
  useEffect(() => {
    loadPeopleData();
  }, [loadPeopleData]);

  /**
   * 键盘事件监听副作用
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  /**
   * 获取境界等级显示名称
   */
  const getRealmLevelName = (level: number): string => {
    return peopleService.getRealmLevelName(level);
  };

  /**
   * 获取体质属性等级显示名称
   */
  const getPhysicalAttributeName = (level: number): string => {
    const levels = ['无', '下品', '中品', '上品', '极品', '完美'];
    return levels[level] || '未知';
  };

  /**
   * 渲染加载状态
   */
  if (isLoading) {
    return (
      <div className="people-display-page">
        <div className="page-header">
          <h1 className="page-title">人物展示</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>正在加载人物数据...</p>
        </div>
      </div>
    );
  }

  /**
   * 渲染错误状态
   */
  if (error) {
    return (
      <div className="people-display-page">
        <div className="page-header">
          <h1 className="page-title">人物展示</h1>
        </div>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error}</p>
          <button 
            className="retry-button"
            onClick={loadPeopleData}
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  /**
   * 渲染空数据状态
   */
  if (peopleList.length === 0) {
    return (
      <div className="people-display-page">
        <div className="page-header">
          <h1 className="page-title">人物展示</h1>
        </div>
        <div className="empty-container">
          <div className="empty-icon">👤</div>
          <p>暂无人物数据</p>
        </div>
      </div>
    );
  }

  // 获取当前显示的人物
  const currentPerson = peopleList[currentPersonIndex];

  return (
    <div className="people-display-page">
      {/* 大卡片容器 */}
      <div className="main-card">
        {/* 卡片右上角标题 */}
        <div className="card-corner-title">人物展示</div>
        
        {/* 页面头部区域 - 包含导航 */}
        <header className="card-header-section">
          <div className="navigation-controls">
            <span className="person-counter">
              <span className="current-index">{currentPersonIndex + 1}</span>
              <span className="separator">/</span>
              <span className="total-count">{peopleList.length}</span>
            </span>
            <div className="nav-buttons">
              <button 
                className="nav-btn nav-btn-prev"
                onClick={handlePreviousPerson}
                disabled={peopleList.length <= 1}
                title="上一个人物 (←)"
                aria-label="上一个人物"
              >
                <span className="nav-icon">‹</span>
              </button>
              <button 
                className="nav-btn nav-btn-next"
                onClick={handleNextPerson}
                disabled={peopleList.length <= 1}
                title="下一个人物 (→)"
                aria-label="下一个人物"
              >
                <span className="nav-icon">›</span>
              </button>
            </div>
          </div>
        </header>

        {/* 主要内容区域 - 网格布局 */}
        <main className="card-main-content">
        {/* 左侧大头像区域 */}
        <section className="avatar-section">
          <div className="person-avatar-large">
            <span className="avatar-text">{currentPerson.name.charAt(0)}</span>
          </div>
          <div className="avatar-info">
            <h2 className="person-name">{currentPerson.name}</h2>
            <p className="person-title">{currentPerson.title0}</p>
            <span className="person-id">ID: {currentPerson.id}</span>
          </div>
          
          {/* 特殊体质信息 */}
          <div className="body-types-section">
            <span className="section-label">特殊体质</span>
            <div className="tag-list">
              {Object.entries(currentPerson.bodyType)
                .filter(([_, value]) => value !== null)
                .map(([key, value]) => (
                  <span key={key} className="body-type-tag">{value}</span>
                ))
              }
              {Object.values(currentPerson.bodyType).every(v => v === null) && (
                <span className="no-data">无特殊体质</span>
              )}
            </div>
          </div>
          
          {/* 称号信息 */}
          <div className="titles-section">
            <span className="section-label">称号</span>
            <div className="tag-list">
              {Object.entries(currentPerson.title)
                .filter(([_, value]) => value !== null)
                .map(([key, value]) => (
                  <span key={key} className="title-tag">{value}</span>
                ))
              }
              {Object.values(currentPerson.title).every(v => v === null) && (
                <span className="no-data">无称号</span>
              )}
            </div>
          </div>
        </section>

        {/* 右侧信息网格区域 */}
        <section className="info-grid">
          {/* 第一行：修炼信息和体质信息 */}
          <article className="info-card cultivation-card">
            <header className="card-header">
              <h3 className="card-title">🧘 修炼信息</h3>
            </header>
            <div className="card-content">
              <div className="stat-row">
                <div className="stat-item">
                  <span className="stat-label">境界等级</span>
                  <span className="stat-value">{getRealmLevelName(currentPerson.realmLevel)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">修炼值</span>
                  <span className="stat-value">{currentPerson.cultivationValue.toLocaleString()}</span>
                </div>
              </div>
              <div className="stat-row">
                <div className="stat-item">
                  <span className="stat-label">天赋值</span>
                  <span className="stat-value">{currentPerson.talentValue}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">修炼状态</span>
                  <span className={`stat-value status ${currentPerson.isCultivating ? 'active' : 'inactive'}`}>
                    {currentPerson.isCultivating ? '修炼中' : '未修炼'}
                  </span>
                </div>
              </div>
              <div className="stat-row">
                <div className="stat-item">
                  <span className="stat-label">突破状态</span>
                  <span className={`stat-value status ${currentPerson.breakThroughEnabled ? 'enabled' : 'disabled'}`}>
                    {currentPerson.breakThroughEnabled ? '可突破' : '不可突破'}
                  </span>
                </div>
              </div>
            </div>
          </article>

          <article className="info-card physique-card">
            <header className="card-header">
              <h3 className="card-title">💪 体质信息</h3>
            </header>
            <div className="card-content">
              <div className="stat-row">
                <div className="stat-item">
                  <span className="stat-label">体质属性</span>
                  <span className="stat-value">{getPhysicalAttributeName(currentPerson.physicalAttributes)}</span>
                </div>
              </div>
            </div>
          </article>

          {/* 第二行：五行亲和度和宗门信息 */}
          <article className="info-card elemental-card">
            <header className="card-header">
              <h3 className="card-title">⚡ 五行亲和度</h3>
            </header>
            <div className="card-content">
              <div className="elemental-grid">
                {Object.entries(currentPerson.elementalAffinity).map(([element, value]) => {
                  const elementNames: Record<string, string> = {
                    metal: '金',
                    wood: '木',
                    water: '水',
                    fire: '火',
                    earth: '土'
                  };
                  return (
                    <div key={element} className="element-item">
                      <span className="element-name">{elementNames[element]}</span>
                      <div className="element-bar">
                        <div 
                          className="element-fill"
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                      <span className="element-value">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>

          {/* 宗门信息卡片 */}
          {currentPerson.zongMenJoinBool && (
            <article className="info-card sect-card">
              <header className="card-header">
                <h3 className="card-title">🏛️ 宗门信息</h3>
              </header>
              <div className="card-content">
                <div className="stat-row">
                  <div className="stat-item">
                    <span className="stat-label">宗门名称</span>
                    <span className="stat-value">{currentPerson.zongMenName}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">加入日期</span>
                    <span className="stat-value">{currentPerson.joinDate}</span>
                  </div>
                </div>

              </div>
            </article>
          )}

          {/* 第三行：技能信息和货币信息 */}
          <article className="info-card skills-card">
            <header className="card-header">
              <h3 className="card-title">⚔️ 技能信息</h3>
            </header>
            <div className="card-content">
              <div className="skills-grid">
                {Object.entries(currentPerson.skills)
                  .filter(([_, value]) => value !== null)
                  .map(([key, value]) => (
                    <div key={key} className="skill-item">
                      <span className="skill-name">{value}</span>
                    </div>
                  ))
                }
                {Object.values(currentPerson.skills).every(v => v === null) && (
                  <div className="no-data">暂无技能</div>
                )}
              </div>
            </div>
          </article>

          <article className="info-card currency-card">
            <header className="card-header">
              <h3 className="card-title">💰 货币信息</h3>
            </header>
            <div className="card-content">
              <div className="currency-grid">
                {Object.entries(currentPerson.money)
                  .filter(([_, value]) => value > 0)
                  .map(([key, value]) => {
                    const moneyNames: Record<string, string> = {
                      '1': '金币',
                      '2': '银币', 
                      '3': '铜币',
                      '4': '灵石',
                      '5': '仙石',
                      '6': '神石',
                      '7': '贡献点',
                      '8': '声望',
                      '9': '经验',
                      '10': '功德',
                      '11': '业力',
                      '12': '气运'
                    };
                    return (
                      <div key={key} className="currency-item">
                        <span className="currency-name">{moneyNames[key] || `货币${key}`}</span>
                        <span className="currency-amount">{value.toLocaleString()}</span>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </article>
        </section>
        </main>

        {/* 页面底部提示 */}
        <footer className="card-footer-section">
          <div className="operation-tips">
            <p>💡 使用左右方向键或点击按钮切换人物</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PeopleDisplayPage;