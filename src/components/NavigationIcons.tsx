import React from 'react';

/**
 * 导航图标组件接口
 * 定义SVG图标的通用属性
 */
interface IconProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

/**
 * 掌门信息图标 - 用户头像
 */
export const NavLeaderIcon: React.FC<IconProps> = ({ 
  width = 24, 
  height = 24, 
  className = '', 
  color = 'currentColor' 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

/**
 * 弟子管理图标 - 多个用户
 */
export const NavDisciplesIcon: React.FC<IconProps> = ({ 
  width = 24, 
  height = 24, 
  className = '', 
  color = 'currentColor' 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    className={className}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

/**
 * 宗门资源图标 - 金币/财富
 */
export const NavResourcesIcon: React.FC<IconProps> = ({ 
  width = 24, 
  height = 24, 
  className = '', 
  color = 'currentColor' 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
    <path d="M16 8a6 6 0 0 0-8 0" />
    <path d="M8 16a6 6 0 0 0 8 0" />
  </svg>
);

/**
 * 修炼指南图标 - 书籍
 */
export const NavCultivationGuideIcon: React.FC<IconProps> = ({ 
  width = 24, 
  height = 24, 
  className = '', 
  color = 'currentColor' 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    className={className}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <path d="M8 7h8" />
    <path d="M8 11h8" />
  </svg>
);

/**
 * 任务系统图标 - 清单/任务板
 */
export const NavMissionsIcon: React.FC<IconProps> = ({ 
  width = 24, 
  height = 24, 
  className = '', 
  color = 'currentColor' 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    className={className}
  >
    <path d="M9 11l3 3 8-8" />
    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.07.74 5.61 1.98" />
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" />
    <path d="M9 9h6" />
    <path d="M9 13h6" />
  </svg>
);

/**
 * 修炼功法图标 - 闪电/能量
 */
export const NavCultivationMethodIcon: React.FC<IconProps> = ({ 
  width = 24, 
  height = 24, 
  className = '', 
  color = 'currentColor' 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    className={className}
  >
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
  </svg>
);

/**
 * 交易市场图标 - 商店
 */
export const NavMarketIcon: React.FC<IconProps> = ({ 
  width = 24, 
  height = 24, 
  className = '', 
  color = 'currentColor' 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    className={className}
  >
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4 8 4v14" />
    <path d="M9 9h6" />
    <path d="M9 12h6" />
    <path d="M9 15h6" />
    <rect x="10" y="17" width="4" height="4" />
  </svg>
);

/**
 * 宗门事件图标 - 日历
 */
export const NavEventsIcon: React.FC<IconProps> = ({ 
  width = 24, 
  height = 24, 
  className = '', 
  color = 'currentColor' 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
  </svg>
);

/**
 * 宗门图标图标 - 建筑/宫殿
 */
export const NavSectIconsIcon: React.FC<IconProps> = ({ 
  width = 24, 
  height = 24, 
  className = '', 
  color = 'currentColor' 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    className={className}
  >
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4 8 4v14" />
    <path d="M9 9h6" />
    <path d="M9 12h6" />
    <path d="M9 15h6" />
    <rect x="10" y="17" width="4" height="4" />
    <path d="M12 2l2 2-2 2-2-2z" />
  </svg>
);

/**
 * 宗门设置图标 - 齿轮
 */
export const NavSettingsIcon: React.FC<IconProps> = ({ 
  width = 24, 
  height = 24, 
  className = '', 
  color = 'currentColor' 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

/**
 * 图标映射对象
 * 根据导航项ID返回对应的SVG图标组件
 */
export const getNavigationIcon = (iconId: string): React.FC<IconProps> => {
  const iconMap: Record<string, React.FC<IconProps>> = {
    'leader': NavLeaderIcon,
    'disciples': NavDisciplesIcon,
    'resources': NavResourcesIcon,
    'cultivation-guide': NavCultivationGuideIcon,
    'missions': NavMissionsIcon,
    'cultivation': NavCultivationMethodIcon,
    'market': NavMarketIcon,
    'events': NavEventsIcon,
    'sect-icons': NavSectIconsIcon,
    'settings': NavSettingsIcon
  };
  
  return iconMap[iconId] || NavLeaderIcon;
};