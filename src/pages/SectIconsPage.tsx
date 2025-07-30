import React, { useState } from 'react';
import '../styles/SectIconsPage.css';
import { 
  SectGateIcon,
  TreasuryIcon,
  CultivationTowerIcon,
  AlchemyIcon,
  LibraryIcon,
  TrainingGroundIcon,
  SectTokenIcon,
  BellTowerIcon,
  SpiritStoneIcon,
  FormationIcon,
  RankingIcon,
  MeetingHallIcon
} from '../components/SectIcons';

/**
 * 宗门图标信息接口
 */
interface SectIconInfo {
  id: string;
  name: string;
  description: string;
  component: React.FC<any>;
  category: string;
}

/**
 * 宗门图标数据
 */
const sectIcons: SectIconInfo[] = [
  {
    id: 'gate',
    name: '宗门大门',
    description: '宗门入口，象征着宗门的威严与开放',
    component: SectGateIcon,
    category: '建筑'
  },
  {
    id: 'treasury',
    name: '宗门宝库',
    description: '存放宗门珍贵资源和宝物的地方',
    component: TreasuryIcon,
    category: '建筑'
  },
  {
    id: 'tower',
    name: '修炼塔',
    description: '弟子修炼的专用场所，层层递进',
    component: CultivationTowerIcon,
    category: '建筑'
  },
  {
    id: 'alchemy',
    name: '炼丹房',
    description: '炼制丹药的神圣之地',
    component: AlchemyIcon,
    category: '功能'
  },
  {
    id: 'library',
    name: '藏书阁',
    description: '收藏功法秘籍的知识宝库',
    component: LibraryIcon,
    category: '建筑'
  },
  {
    id: 'training',
    name: '演武场',
    description: '弟子切磋武艺的训练场地',
    component: TrainingGroundIcon,
    category: '功能'
  },
  {
    id: 'token',
    name: '宗门令牌',
    description: '代表宗门身份的重要凭证',
    component: SectTokenIcon,
    category: '物品'
  },
  {
    id: 'bell',
    name: '宗门钟楼',
    description: '传达宗门重要消息的钟楼',
    component: BellTowerIcon,
    category: '建筑'
  },
  {
    id: 'stone',
    name: '灵石矿脉',
    description: '宗门重要的灵力资源来源',
    component: SpiritStoneIcon,
    category: '资源'
  },
  {
    id: 'formation',
    name: '宗门阵法',
    description: '保护宗门的神秘阵法',
    component: FormationIcon,
    category: '功能'
  },
  {
    id: 'ranking',
    name: '宗门排行榜',
    description: '展示弟子实力排名的榜单',
    component: RankingIcon,
    category: '功能'
  },
  {
    id: 'meeting',
    name: '宗门会议厅',
    description: '宗门重要决策的讨论场所',
    component: MeetingHallIcon,
    category: '建筑'
  }
];

/**
 * 图标分类
 */
const categories = ['全部', '建筑', '功能', '物品', '资源'];

/**
 * 宗门图标展示页面组件
 */
const SectIconsPage: React.FC = (): React.ReactElement => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [iconSize, setIconSize] = useState<number>(32);
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [iconColor, setIconColor] = useState<string>('#333333');
  const [copiedIcon, setCopiedIcon] = useState<string>('');

  /**
   * 过滤图标
   */
  const filteredIcons = selectedCategory === '全部' 
    ? sectIcons 
    : sectIcons.filter(icon => icon.category === selectedCategory);

  /**
   * 处理分类选择
   */
  const handleCategorySelect = (category: string): void => {
    setSelectedCategory(category);
  };

  /**
   * 复制SVG代码
   */
  const copySvgCode = (iconId: string): void => {
    const icon = sectIcons.find(i => i.id === iconId);
    if (icon) {
      const IconComponent = icon.component;
      // 这里简化处理，实际应用中可以生成完整的SVG代码
      const svgCode = `<${icon.component.name} size={${iconSize}} color="${iconColor}" strokeWidth={${strokeWidth}} />`;
      navigator.clipboard.writeText(svgCode);
      setCopiedIcon(iconId);
      setTimeout(() => setCopiedIcon(''), 2000);
    }
  };

  /**
   * 下载SVG文件
   */
  const downloadSvg = (iconId: string): void => {
    const icon = sectIcons.find(i => i.id === iconId);
    if (icon) {
      // 这里简化处理，实际应用中需要渲染SVG并下载
      alert(`下载 ${icon.name} SVG文件功能开发中...`);
    }
  };

  return (
    <div className="sect-icons-page">
      <div className="page-header">
        <h2>宗门图标库</h2>
        <p>精心设计的宗门相关线条图标，适用于各种修仙主题应用</p>
      </div>

      {/* 控制面板 */}
      <div className="control-panel">
        <div className="control-group">
          <label>图标大小:</label>
          <input 
            type="range" 
            min="16" 
            max="64" 
            value={iconSize} 
            onChange={(e) => setIconSize(Number(e.target.value))}
          />
          <span>{iconSize}px</span>
        </div>
        
        <div className="control-group">
          <label>线条粗细:</label>
          <input 
            type="range" 
            min="1" 
            max="4" 
            step="0.5" 
            value={strokeWidth} 
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
          />
          <span>{strokeWidth}px</span>
        </div>
        
        <div className="control-group">
          <label>图标颜色:</label>
          <input 
            type="color" 
            value={iconColor} 
            onChange={(e) => setIconColor(e.target.value)}
          />
          <span>{iconColor}</span>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategorySelect(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 图标网格 */}
      <div className="icons-grid">
        {filteredIcons.map((icon) => {
          const IconComponent = icon.component;
          return (
            <div key={icon.id} className="icon-card">
              <div className="icon-preview">
                <IconComponent 
                  size={iconSize} 
                  color={iconColor} 
                  strokeWidth={strokeWidth} 
                />
              </div>
              
              <div className="icon-info">
                <h4>{icon.name}</h4>
                <p>{icon.description}</p>
                <span className="category-tag">{icon.category}</span>
              </div>
              
              <div className="icon-actions">
                <button 
                  className="action-btn copy-btn"
                  onClick={() => copySvgCode(icon.id)}
                  title="复制代码"
                >
                  {copiedIcon === icon.id ? '已复制!' : '复制'}
                </button>
                <button 
                  className="action-btn download-btn"
                  onClick={() => downloadSvg(icon.id)}
                  title="下载SVG"
                >
                  下载
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 使用说明 */}
      <div className="usage-guide">
        <h3>使用说明</h3>
        <div className="guide-content">
          <div className="guide-section">
            <h4>导入图标</h4>
            <pre><code>{`import { SectGateIcon } from '../components/SectIcons';`}</code></pre>
          </div>
          
          <div className="guide-section">
            <h4>使用图标</h4>
            <pre><code>{`<SectGateIcon size={24} color="#333" strokeWidth={2} />`}</code></pre>
          </div>
          
          <div className="guide-section">
            <h4>自定义属性</h4>
            <ul>
              <li><strong>size</strong>: 图标大小 (默认: 24)</li>
              <li><strong>color</strong>: 图标颜色 (默认: currentColor)</li>
              <li><strong>strokeWidth</strong>: 线条粗细 (默认: 2)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectIconsPage;