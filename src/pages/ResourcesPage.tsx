import React, { useState, useEffect } from 'react';
import { getResources } from '../../backend/services/leaderService';
import '../styles/ResourcesPage.css';

/**
 * 宗门资源接口
 */
interface SectResources {
  spiritStone: number;
  herbs: number;
  magicWeapons: number;
  treasures: number;
}

/**
 * 资源卡片组件
 */
const ResourceCard: React.FC<{
  title: string;
  value: number;
  unit: string;
  icon: string;
  description: string;
}> = ({ title, value, unit, icon, description }) => (
  <div className="resource-card">
    <div className="resource-icon">{icon}</div>
    <div className="resource-info">
      <h4>{title}</h4>
      <div className="resource-value">
        {value.toLocaleString()} <span className="unit">{unit}</span>
      </div>
      <p className="resource-description">{description}</p>
    </div>
  </div>
);

/**
 * 宗门资源页面组件
 */
const ResourcesPage: React.FC = (): React.ReactElement => {
  const [resources, setResources] = useState<SectResources | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 获取宗门资源
   */
  const fetchResources = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResources('leader_001');
      setResources(data);
    } catch (err) {
      setError('获取宗门资源失败');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="loading-text">加载资源信息中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchResources}>重试</button>
      </div>
    );
  }

  if (!resources) {
    return (
      <div className="error-message">
        <p>暂无资源数据</p>
        <button onClick={fetchResources}>重新加载</button>
      </div>
    );
  }

  // 计算总价值（简单估算）
  const totalValue = 
    resources.spiritStone + 
    resources.herbs * 10 + 
    resources.magicWeapons * 100 + 
    resources.treasures * 1000;

  return (
    <div className="resources-container">
      <div className="page-header">
        <h2>宗门资源</h2>
        <p>管理宗门的各类资源储备</p>
      </div>

      <div className="resources-overview">
        <div className="overview-card">
          <h3>资源总览</h3>
          <div className="total-value">
            <span className="label">估算总价值:</span>
            <span className="value">{totalValue.toLocaleString()} 灵石</span>
          </div>
        </div>
      </div>

      <div className="resources-grid">
        <ResourceCard
          title="灵石"
          value={resources.spiritStone}
          unit="枚"
          icon="💎"
          description="宗门的基础货币，用于各种交易和修炼"
        />
        
        <ResourceCard
          title="灵草药材"
          value={resources.herbs}
          unit="株"
          icon="🌿"
          description="炼制丹药的珍贵材料，提升修炼效果"
        />
        
        <ResourceCard
          title="法器"
          value={resources.magicWeapons}
          unit="件"
          icon="⚔️"
          description="增强战斗力的神兵利器"
        />
        
        <ResourceCard
          title="宝物"
          value={resources.treasures}
          unit="件"
          icon="🏺"
          description="稀世珍宝，具有特殊功效"
        />
      </div>

      <div className="resource-management">
        <div className="management-section">
          <h3>资源管理</h3>
          <div className="management-actions">
            <button className="action-btn primary">
              📊 查看详细清单
            </button>
            <button className="action-btn secondary">
              📈 资源统计报告
            </button>
            <button className="action-btn secondary">
              🔄 资源调配
            </button>
            <button className="action-btn secondary">
              💰 市场交易
            </button>
          </div>
        </div>

        <div className="resource-tips">
          <h4>💡 资源管理建议</h4>
          <ul>
            <li>定期检查资源储备，确保宗门正常运转</li>
            <li>合理分配资源，优先满足弟子修炼需求</li>
            <li>关注市场行情，适时进行资源交易</li>
            <li>建立资源预警机制，避免关键资源短缺</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;