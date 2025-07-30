import React from 'react';
import '../styles/ComingSoonPage.css';

/**
 * 开发中页面组件属性接口
 */
interface ComingSoonPageProps {
  title: string;
  description?: string;
  features?: string[];
}

/**
 * 开发中页面组件
 * 用于显示尚未实现的功能模块
 */
const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title,
  description = '该功能正在紧张开发中，敬请期待！',
  features = []
}): React.ReactElement => {
  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        <div className="coming-soon-icon">
          🚧
        </div>
        
        <h2 className="coming-soon-title">{title}</h2>
        
        <p className="coming-soon-description">{description}</p>
        
        {features.length > 0 && (
          <div className="planned-features">
            <h3>计划功能</h3>
            <ul className="features-list">
              {features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <span className="feature-icon">✨</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="development-status">
          <div className="status-item">
            <span className="status-label">开发进度:</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '25%' }}></div>
            </div>
            <span className="status-value">25%</span>
          </div>
          
          <div className="status-item">
            <span className="status-label">预计完成:</span>
            <span className="status-value">下个版本</span>
          </div>
        </div>
        
        <div className="coming-soon-actions">
          <button className="action-btn secondary" onClick={() => window.history.back()}>
            ← 返回上一页
          </button>
          <button className="action-btn primary" onClick={() => window.location.reload()}>
            🔄 刷新页面
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;