import React from 'react';

/**
 * 宗门图标组件接口
 */
interface SectIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * 宗门大门图标
 */
export const SectGateIcon: React.FC<SectIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4 8 4v14" />
    <path d="M9 9h6" />
    <path d="M9 12h6" />
    <path d="M9 15h6" />
    <rect x="10" y="17" width="4" height="4" />
  </svg>
);

/**
 * 宗门宝库图标
 */
export const TreasuryIcon: React.FC<SectIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <circle cx="14" cy="12" r="2" />
    <path d="M12 8h6" />
    <path d="M12 16h6" />
  </svg>
);

/**
 * 修炼塔图标
 */
export const CultivationTowerIcon: React.FC<SectIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <path d="M12 2l-2 4h4l-2-4z" />
    <rect x="8" y="6" width="8" height="4" />
    <rect x="6" y="10" width="12" height="4" />
    <rect x="4" y="14" width="16" height="4" />
    <rect x="2" y="18" width="20" height="4" />
    <circle cx="12" cy="8" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="16" r="1" />
  </svg>
);

/**
 * 炼丹房图标
 */
export const AlchemyIcon: React.FC<SectIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <path d="M9 2v6l-2 4h10l-2-4V2" />
    <circle cx="12" cy="17" r="5" />
    <path d="M12 12v5" />
    <path d="M6 16l3 1" />
    <path d="M18 16l-3 1" />
    <circle cx="12" cy="4" r="1" />
  </svg>
);

/**
 * 藏书阁图标
 */
export const LibraryIcon: React.FC<SectIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <path d="M8 7h8" />
    <path d="M8 11h8" />
    <path d="M8 15h5" />
  </svg>
);

/**
 * 演武场图标
 */
export const TrainingGroundIcon: React.FC<SectIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8" />
    <path d="M12 8v8" />
    <path d="M16.24 7.76l-8.48 8.48" />
    <path d="M7.76 7.76l8.48 8.48" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

/**
 * 宗门令牌图标
 */
export const SectTokenIcon: React.FC<SectIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
    <path d="M8 8l8 8" />
    <path d="M16 8l-8 8" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/**
 * 宗门钟楼图标
 */
export const BellTowerIcon: React.FC<SectIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <path d="M6 19h12" />
    <path d="M12 3v3" />
    <path d="M12 19v2" />
    <path d="M7.5 6.5C8.83 5.17 10.35 4.5 12 4.5s3.17.67 4.5 2" />
    <path d="M7.5 17.5C8.83 18.83 10.35 19.5 12 19.5s3.17-.67 4.5-2" />
    <path d="M6 13a6 6 0 0 0 12 0c0-3-2.7-5-6-5s-6 2-6 5" />
    <circle cx="12" cy="13" r="1" />
  </svg>
);

/**
 * 灵石矿脉图标
 */
export const SpiritStoneIcon: React.FC<SectIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
    <path d="M11 3L8 9l4 12 4-12-3-6" />
    <path d="M2 9h20" />
    <circle cx="12" cy="15" r="2" />
  </svg>
);

/**
 * 宗门阵法图标
 */
export const FormationIcon: React.FC<SectIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <path d="M4.93 4.93l2.83 2.83" />
    <path d="M16.24 16.24l2.83 2.83" />
    <path d="M19.07 4.93l-2.83 2.83" />
    <path d="M7.76 16.24l-2.83 2.83" />
  </svg>
);

/**
 * 宗门排行榜图标
 */
export const RankingIcon: React.FC<SectIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <path d="M3 3v18h18" />
    <path d="M7 16l4-4 4 4 6-6" />
    <circle cx="7" cy="16" r="1" />
    <circle cx="11" cy="12" r="1" />
    <circle cx="15" cy="16" r="1" />
    <circle cx="21" cy="10" r="1" />
    <path d="M17 7l3-3" />
    <path d="M17 4h3v3" />
  </svg>
);

/**
 * 宗门会议厅图标
 */
export const MeetingHallIcon: React.FC<SectIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 8h10" />
    <path d="M7 12h10" />
    <path d="M7 16h6" />
    <circle cx="6" cy="8" r="1" />
    <circle cx="6" cy="12" r="1" />
    <circle cx="6" cy="16" r="1" />
  </svg>
);

/**
 * 宗门图标映射对象
 */
export const SectIconMap = {
  gate: SectGateIcon,
  treasury: TreasuryIcon,
  tower: CultivationTowerIcon,
  alchemy: AlchemyIcon,
  library: LibraryIcon,
  training: TrainingGroundIcon,
  token: SectTokenIcon,
  bell: BellTowerIcon,
  stone: SpiritStoneIcon,
  formation: FormationIcon,
  ranking: RankingIcon,
  meeting: MeetingHallIcon
};

/**
 * 获取宗门图标组件
 */
export const getSectIcon = (iconName: string, props?: SectIconProps) => {
  const IconComponent = SectIconMap[iconName as keyof typeof SectIconMap];
  return IconComponent ? <IconComponent {...props} /> : null;
};