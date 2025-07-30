import React from 'react';

/**
 * 线条风格图标组件接口
 */
interface LineIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * 掌门图标
 */
export const LeaderIcon: React.FC<LineIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    <path d="M12 2l2 3h3l-2.5 3.5L17 12l-5-1-5 1 2.5-3.5L7 5h3l2-3z" />
  </svg>
);

/**
 * 弟子图标
 */
export const DisciplesIcon: React.FC<LineIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

/**
 * 资源图标
 */
export const ResourcesIcon: React.FC<LineIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

/**
 * 修炼图标
 */
export const CultivationIcon: React.FC<LineIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
  </svg>
);

/**
 * 设置图标
 */
export const SettingsIcon: React.FC<LineIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

/**
 * 任务图标
 */
export const TasksIcon: React.FC<LineIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,10 8,9" />
  </svg>
);

/**
 * 市场图标
 */
export const MarketIcon: React.FC<LineIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M8 11h8" />
  </svg>
);

/**
 * 事件图标
 */
export const EventsIcon: React.FC<LineIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/**
 * 指南图标
 */
export const GuideIcon: React.FC<LineIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

/**
 * 主页图标
 */
export const HomeIcon: React.FC<LineIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

/**
 * 图标映射对象
 */
export const LineIconMap = {
  leader: LeaderIcon,
  disciples: DisciplesIcon,
  resources: ResourcesIcon,
  cultivation: CultivationIcon,
  settings: SettingsIcon,
  tasks: TasksIcon,
  market: MarketIcon,
  events: EventsIcon,
  guide: GuideIcon,
  home: HomeIcon
};

/**
 * 获取线条图标组件
 */
export const getLineIcon = (iconName: string, props?: LineIconProps) => {
  const IconComponent = LineIconMap[iconName as keyof typeof LineIconMap];
  return IconComponent ? <IconComponent {...props} /> : null;
};