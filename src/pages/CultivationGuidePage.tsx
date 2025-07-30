import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getRealmLevelMapping } from '../services/leaderService';
import './CultivationGuidePage.css';

/**
 * 境界映射显示组件
 * 分组显示境界等级与修炼阶段的对应关系（1-63）
 */
const RealmMappingDisplay: React.FC<{ currentRealmLevel?: number }> = React.memo(({ currentRealmLevel = 0 }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const realmMapping = getRealmLevelMapping();
  
  // 按修炼阶段分组境界等级
  const groupedRealms = useMemo(() => {
    const groups: { [key: string]: Array<{ level: number; stage: { minorRealm: string; stage: string } }> } = {
      '凡人阶段': [],
      '修士阶段-玄级': [],
      '修士阶段-地级': [],
      '修士阶段-天级': [],
      '修士阶段-帝级': [],
      '仙神阶段-仙级': [],
      '仙神阶段-神级': []
    };
    
    Object.entries(realmMapping).forEach(([level, stage]) => {
      const levelNum = parseInt(level);
      if (levelNum >= 0 && levelNum <= 6) {
        groups['凡人阶段'].push({ level: levelNum, stage });
      } else if (levelNum >= 7 && levelNum <= 15) {
        groups['修士阶段-玄级'].push({ level: levelNum, stage });
      } else if (levelNum >= 16 && levelNum <= 24) {
        groups['修士阶段-地级'].push({ level: levelNum, stage });
      } else if (levelNum >= 25 && levelNum <= 33) {
        groups['修士阶段-天级'].push({ level: levelNum, stage });
      } else if (levelNum >= 34 && levelNum <= 39) {
        groups['修士阶段-帝级'].push({ level: levelNum, stage });
      } else if (levelNum >= 40 && levelNum <= 54) {
        groups['仙神阶段-仙级'].push({ level: levelNum, stage });
      } else if (levelNum >= 55 && levelNum <= 63) {
        groups['仙神阶段-神级'].push({ level: levelNum, stage });
      }
    });
    
    return groups;
  }, [realmMapping]);
  
  // 切换分组展开状态
  const toggleSection = useCallback((sectionName: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName);
      } else {
        newSet.add(sectionName);
      }
      return newSet;
    });
  }, []);
  
  // 判断当前境界所在的分组
  const getCurrentSection = useCallback((level: number): string => {
    if (level >= 1 && level <= 6) return '凡人阶段';
    if (level >= 7 && level <= 15) return '修士阶段-玄级';
    if (level >= 16 && level <= 24) return '修士阶段-地级';
    if (level >= 25 && level <= 33) return '修士阶段-天级';
    if (level >= 34 && level <= 39) return '修士阶段-帝级';
    if (level >= 40 && level <= 54) return '仙神阶段-仙级';
    if (level >= 55 && level <= 63) return '仙神阶段-神级';
    return '';
  }, []);
  
  // 自动展开当前境界所在的分组
  useEffect(() => {
    const currentSection = getCurrentSection(currentRealmLevel);
    if (currentSection) {
      setExpandedSections(prev => new Set([...prev, currentSection]));
    }
  }, [currentRealmLevel, getCurrentSection]);
  
  return (
    <div className="realm-mapping-display">
      <h3>境界等级映射表 (1-63)</h3>
      <div className="mapping-sections">
        {Object.entries(groupedRealms).map(([sectionName, realms]) => {
          const isExpanded = expandedSections.has(sectionName);
          const hasCurrentLevel = realms.some(realm => realm.level === currentRealmLevel);
          
          return (
            <div key={sectionName} className={`mapping-section ${hasCurrentLevel ? 'has-current' : ''}`}>
              <div 
                className="section-header" 
                onClick={() => toggleSection(sectionName)}
              >
                <span className="section-title">{sectionName}</span>
                <span className="section-range">({realms[0]?.level}-{realms[realms.length - 1]?.level})</span>
                <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
              </div>
              
              {isExpanded && (
                <div className="mapping-grid">
                  {realms.map(({ level, stage }) => {
                    const isCurrentLevel = level === currentRealmLevel;
                    return (
                      <div 
                        key={level} 
                        className={`mapping-item ${isCurrentLevel ? 'current' : ''}`}
                      >
                        <span className="level">等级{level}</span>
                        <span className="arrow">→</span>
                        <span className="stage">{stage.minorRealm} {stage.stage}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

/**
 * 修炼阶段卡片组件
 */
const CultivationStageCard: React.FC<{
  title: string;
  levelRange: string;
  icon: string;
  description: string;
  stages: string[];
}> = ({ title, levelRange, icon, description, stages }) => (
  <div className="cultivation-stage-card">
    <div className="stage-icon">{icon}</div>
    <div className="stage-info">
      <h4>{title}</h4>
      <div className="stage-range">
        {levelRange} <span className="range-label">等级</span>
      </div>
      <p className="stage-description">{description}</p>
      <div className="stage-list">
        {stages.map((stage, index) => (
          <span key={index} className="stage-item">{stage}</span>
        ))}
      </div>
    </div>
  </div>
);

/**
 * 修炼指南页面组件
 * 提供修炼体系的详细说明和境界等级映射表
 */
const CultivationGuidePage: React.FC = () => {
  // 计算修炼体系统计信息
  const cultivationStats = {
    totalLevels: 64,
    majorStages: 3,
    minorRealms: 19,
    maxLevel: 63
  };

  return (
    <div className="cultivation-guide-container">
      <div className="page-header">
        <h2>修炼指南</h2>
        <p>掌握修炼体系，踏上仙途之路</p>
      </div>

      <div className="cultivation-overview">
        <div className="overview-card">
          <h3>修炼体系总览</h3>
          <div className="total-stats">
            <div className="stat-item">
              <span className="label">总等级数:</span>
              <span className="value">{cultivationStats.totalLevels} 级</span>
            </div>
            <div className="stat-item">
              <span className="label">主要阶段:</span>
              <span className="value">{cultivationStats.majorStages} 个</span>
            </div>
            <div className="stat-item">
              <span className="label">境界数量:</span>
              <span className="value">{cultivationStats.minorRealms} 个</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cultivation-stages-grid">
        <CultivationStageCard
          title="凡人阶段"
          levelRange="0-6"
          icon="🌱"
          description="修炼起始阶段，从凡人到感知天地灵气，筑建修炼根基"
          stages={["未入仙途", "练气境", "筑基境"]}
        />
        
        <CultivationStageCard
          title="修士阶段"
          levelRange="7-39"
          icon="⚔️"
          description="真正的修炼者阶段，分为玄地天帝四个等级"
          stages={["玄级(7-15)", "地级(16-24)", "天级(25-33)", "帝级(34-39)"]}
        />
        
        <CultivationStageCard
          title="仙神阶段"
          levelRange="40-63"
          icon="✨"
          description="超凡脱俗的仙神境界，拥有通天彻地之能"
          stages={["仙级(40-54)", "神级(55-63)"]}
        />
      </div>

      <div className="cultivation-management">
        <div className="management-section">
          <h3>修炼指导</h3>
          <div className="management-actions">
            <button className="action-btn primary">
              📊 查看境界详情
            </button>
            <button className="action-btn secondary">
              📈 修炼进度分析
            </button>
            <button className="action-btn secondary">
              🎯 突破指导
            </button>
            <button className="action-btn secondary">
              💡 修炼建议
            </button>
          </div>
        </div>

        <div className="cultivation-tips">
          <h4>💡 修炼要诀</h4>
          <ul>
            <li>稳固根基，每个境界都要修炼到圆满再突破</li>
            <li>天赋重要，可通过各种机缘和资源提升天赋值</li>
            <li>资源积累，灵石、丹药等能大幅提升修炼效率</li>
            <li>境界突破，达到当前境界上限后方可尝试突破</li>
          </ul>
        </div>
      </div>

      <RealmMappingDisplay />
    </div>
  );
};

export default CultivationGuidePage;