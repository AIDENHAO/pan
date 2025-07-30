import React, { useState, useEffect } from 'react';
import { getCultivationMethodMapping } from '../services/leaderService';
import { CultivationMethod, CultivationMethodMapping } from '../types/cultivationMethod';
import '../styles/CultivationMethodPage.css';

/**
 * 功法管理页面组件
 * 用于展示和管理修仙功法信息
 */
const CultivationMethodPage: React.FC = (): React.ReactElement => {
  const [cultivationMethods, setCultivationMethods] = useState<CultivationMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<CultivationMethod | null>(null);
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  /**
   * 获取功法映射数据
   */
  const fetchCultivationMethods = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const methodMapping: CultivationMethodMapping = await getCultivationMethodMapping();
      const methodsArray = Object.values(methodMapping);
      
      setCultivationMethods(methodsArray);
    } catch (err) {
      console.error('获取功法数据失败:', err);
      setError('获取功法数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 组件挂载时获取数据
   */
  useEffect(() => {
    fetchCultivationMethods();
  }, []);

  /**
   * 过滤功法列表
   */
  const filteredMethods = cultivationMethods.filter(method => {
    const matchesGrade = filterGrade === 'all' || method.grade === filterGrade;
    const matchesType = filterType === 'all' || method.type === filterType;
    const matchesSearch = method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         method.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesGrade && matchesType && matchesSearch;
  });

  /**
   * 获取功法品级颜色
   */
  const getGradeColor = (grade: string): string => {
    if (grade.includes('黄级')) return 'var(--grade-huang)';
    if (grade.includes('玄级')) return 'var(--grade-xuan)';
    if (grade.includes('地级')) return 'var(--grade-di)';
    if (grade.includes('天级')) return 'var(--grade-tian)';
    if (grade.includes('神级')) return 'var(--grade-shen)';
    return 'var(--grade-default)';
  };

  /**
   * 获取功法类型图标
   */
  const getTypeIcon = (type: string): string => {
    const iconMap: { [key: string]: string } = {
      '剑法': '⚔️',
      '掌法': '👋',
      '拳法': '👊',
      '指法': '👆',
      '腿法': '🦵',
      '心法': '💖',
      '内功': '🔥',
      '法术': '✨',
      '雷法': '⚡',
      '火法': '🔥',
      '冰法': '❄️',
      '风法': '💨',
      '土法': '🌍',
      '御器': '🗡️',
      '体修': '💪',
      '剑阵': '⚔️',
      '神级功法': '🌟'
    };
    return iconMap[type] || '📜';
  };

  /**
   * 渲染功法详情
   */
  const renderMethodDetails = (method: CultivationMethod): React.ReactElement => (
    <div className="method-details">
      <div className="method-header">
        <h3 className="method-name">
          {getTypeIcon(method.type)} {method.name}
        </h3>
        <span 
          className="method-grade"
          style={{ color: getGradeColor(method.grade) }}
        >
          {method.grade}
        </span>
      </div>
      
      <div className="method-info">
        <p className="method-description">{method.description}</p>
        
        <div className="method-requirements">
          <h4>修炼要求</h4>
          <div className="requirement-item">
            <span>境界等级: {method.requiredRealmLevel}</span>
          </div>
          <div className="requirement-item">
            <span>体质要求: {method.cultivationRequirements.minPhysique}</span>
          </div>
          <div className="requirement-item">
            <span>神魂要求: {method.cultivationRequirements.minSoul}</span>
          </div>
          <div className="requirement-item">
            <span>所需资源: {method.cultivationRequirements.requiredResources.join(', ')}</span>
          </div>
        </div>
        
        <div className="method-attributes">
          <h4>属性加成</h4>
          <div className="attributes-grid">
            <div className="attribute-item">
              <span className="attribute-label">攻击力:</span>
              <span className="attribute-value">+{method.attributes.attack}</span>
            </div>
            <div className="attribute-item">
              <span className="attribute-label">速度:</span>
              <span className="attribute-value">+{method.attributes.speed}</span>
            </div>
            <div className="attribute-item">
              <span className="attribute-label">防御力:</span>
              <span className="attribute-value">+{method.attributes.defense}</span>
            </div>
            <div className="attribute-item">
              <span className="attribute-label">暴击率:</span>
              <span className="attribute-value">+{(method.attributes.criticalRate * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
        
        <div className="method-level">
          <span>最高等级: {method.maxLevel}</span>
        </div>
      </div>
    </div>
  );

  // 加载状态组件 - 与掌门信息页面保持一致
  const LoadingIndicator: React.FC = () => (
    <div className="loading">
      <div className="spinner"></div>
      <p className="loading-text">加载中...</p>
    </div>
  );

  // 错误提示组件 - 与掌门信息页面保持一致
  const ErrorDisplay: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
    <div className="error-message">
      <p>获取功法信息失败，请重试</p>
      <button onClick={onRetry}>重试</button>
    </div>
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay onRetry={fetchCultivationMethods} />;
  }

  return (
    <div className="cultivation-method-page">
      <div className="page-header">
        <h2>📚 功法典籍</h2>
        <p>管理和查看宗门功法信息</p>
      </div>
      
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索功法名称或描述..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="filter-select"
          >
            <option value="all">所有品级</option>
            <option value="黄级下品">黄级下品</option>
            <option value="黄级中品">黄级中品</option>
            <option value="黄级上品">黄级上品</option>
            <option value="玄级下品">玄级下品</option>
            <option value="玄级中品">玄级中品</option>
            <option value="玄级上品">玄级上品</option>
            <option value="地级下品">地级下品</option>
            <option value="地级中品">地级中品</option>
            <option value="地级上品">地级上品</option>
            <option value="天级下品">天级下品</option>
            <option value="天级中品">天级中品</option>
            <option value="天级上品">天级上品</option>
            <option value="神级">神级</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">所有类型</option>
            <option value="剑法">剑法</option>
            <option value="掌法">掌法</option>
            <option value="心法">心法</option>
            <option value="御器">御器</option>
            <option value="法术">法术</option>
            <option value="雷法">雷法</option>
            <option value="体修">体修</option>
            <option value="内功">内功</option>
            <option value="剑阵">剑阵</option>
            <option value="神级功法">神级功法</option>
          </select>
        </div>
      </div>
      
      <div className="methods-container">
        <div className="methods-list">
          <div className="methods-grid">
            {filteredMethods.map((method) => (
              <div
                key={method.id}
                className={`method-card ${selectedMethod?.id === method.id ? 'selected' : ''}`}
                onClick={() => setSelectedMethod(method)}
              >
                <div className="method-card-header">
                  <span className="method-icon">{getTypeIcon(method.type)}</span>
                  <h4 className="method-card-name">{method.name}</h4>
                </div>
                
                <div className="method-card-info">
                  <span 
                    className="method-card-grade"
                    style={{ color: getGradeColor(method.grade) }}
                  >
                    {method.grade}
                  </span>
                  <span className="method-card-type">{method.type}</span>
                </div>
                
                <div className="method-card-stats">
                  <div className="stat-item">
                    <span>攻击: +{method.attributes.attack}</span>
                  </div>
                  <div className="stat-item">
                    <span>防御: +{method.attributes.defense}</span>
                  </div>
                </div>
                
                <div className="method-card-level">
                  <span>最高等级: {method.maxLevel}</span>
                </div>
              </div>
            ))}
          </div>
          
          {filteredMethods.length === 0 && (
            <div className="no-methods">
              <p>未找到符合条件的功法</p>
            </div>
          )}
        </div>
        
        <div className="method-detail-panel">
          {selectedMethod ? (
            renderMethodDetails(selectedMethod)
          ) : (
            <div className="no-selection">
              <p>请选择一个功法查看详细信息</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CultivationMethodPage;