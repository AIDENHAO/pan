import React from 'react';

/**
 * 宗门标志图标组件接口
 * 定义宗门Logo的属性
 */
interface SectLogoProps {
  size?: number;
  className?: string;
}

/**
 * 宗门标志图标组件
 * 圆角正方形背景，填充主题色，内部显示"宗"字
 */
export const SectLogo: React.FC<SectLogoProps> = ({ 
  size = 32, 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 32 32" 
    className={className}
    style={{ flexShrink: 0 }}
  >
    {/* 圆角正方形背景，使用主题色填充 */}
    <rect 
      x="2" 
      y="2" 
      width="28" 
      height="28" 
      rx="6" 
      ry="6" 
      fill="var(--primary-color)" 
      stroke="none"
    />
    
    {/* "宗"字，使用导航栏颜色 */}
    <text 
      x="16" 
      y="22" 
      textAnchor="middle" 
      fontSize="16" 
      fontWeight="bold" 
      fill="var(--sidebar-bg)" 
      fontFamily="'Microsoft YaHei', 'SimHei', sans-serif"
    >
      宗
    </text>
  </svg>
);

export default SectLogo;