import React from 'react';

/**
 * 主题预览组件的属性接口
 */
interface ThemePreviewProps {
  theme: string;
  isActive: boolean;
  onClick: () => void;
}

/**
 * 主题预览组件
 * 显示主题的颜色预览和名称
 */
const ThemePreview: React.FC<ThemePreviewProps> = ({ theme, isActive, onClick }) => {
  /**
   * 获取主题的颜色配置
   * @param themeName 主题名称
   * @returns 主题颜色对象
   */
  const getThemeColors = (themeName: string) => {
    const themes = {
      default: {
        primary: '#d4a574',
        secondary: '#1a2332',
        background: '#f0f2f5',
        name: '默认主题（金色）'
      },
      dark: {
        primary: '#ffd700',
        secondary: '#2d3748',
        background: '#1a202c',
        name: '深色主题'
      },
      blue: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        background: '#f0f9ff',
        name: '蓝色主题'
      },
      green: {
        primary: '#10b981',
        secondary: '#047857',
        background: '#f0fdf4',
        name: '绿色主题'
      },
      purple: {
        primary: '#8b5cf6',
        secondary: '#7c3aed',
        background: '#faf5ff',
        name: '紫色主题'
      },
      'azure-holy': {
        primary: '#4DA6FF',
        secondary: '#2980B9',
        background: '#E6F4FF',
        name: '蔚蓝圣洁'
      },
      'platinum-holy': {
        primary: '#D4AF37',
        secondary: '#E5E7EB',
        background: '#F8FAFC',
        name: '白金圣洁'
      },
      'blazing-flame': {
        primary: '#DC2626',
        secondary: '#1F0A0A',
        background: '#2D1B1B',
        name: '炙热火焰'
      },
      'forest-vitality': {
        primary: '#166534',
        secondary: '#A7F3D0',
        background: '#F0FDF4',
        name: '苍林生机'
      },
      'deep-ocean': {
        primary: '#1E40AF',
        secondary: '#0F172A',
        background: '#1E293B',
        name: '深蓝大海'
      },
      'black-gold-soil': {
        primary: '#B49106',
        secondary: '#121212',
        background: '#27272A',
        name: '黑金土壤'
      }
    };
    
    return themes[themeName as keyof typeof themes] || themes.default;
  };

  const colors = getThemeColors(theme);

  return (
    <div 
      className={`theme-preview ${isActive ? 'active' : ''}`}
      onClick={onClick}
      title={`切换到${colors.name}`}
    >
      <div className="color-palette">
        <div 
          className="color-circle primary" 
          style={{ backgroundColor: colors.primary }}
        ></div>
        <div 
          className="color-circle secondary" 
          style={{ backgroundColor: colors.secondary }}
        ></div>
        <div 
          className="color-circle background" 
          style={{ backgroundColor: colors.background }}
        ></div>
      </div>
      <span className="theme-name">{colors.name}</span>
      {isActive && <div className="active-indicator">✓</div>}
    </div>
  );
};

export default ThemePreview;