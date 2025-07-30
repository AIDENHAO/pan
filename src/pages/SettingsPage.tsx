import React, { useState, useEffect } from 'react';
import ThemePreview from '../components/ThemePreview';
import '../styles/SettingsPage.css';

/**
 * 设置项接口
 */
interface SettingItem {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'select' | 'input' | 'slider';
  value: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
}

/**
 * 设置分组接口
 */
interface SettingGroup {
  title: string;
  description: string;
  items: SettingItem[];
}

/**
 * 宗门设置页面组件
 */
const SettingsPage: React.FC = (): React.ReactElement => {
  // 主题状态管理
  const [currentTheme, setCurrentTheme] = useState<string>('default');

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'default';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
    
    // 同步更新设置项中的主题值
    setSettings(prevSettings => {
      const newSettings = [...prevSettings];
      const themeGroup = newSettings.find(group => group.title === '界面主题设置');
      if (themeGroup) {
        const themeItem = themeGroup.items.find(item => item.id === 'colorTheme');
        if (themeItem) {
          themeItem.value = savedTheme;
        }
      }
      return newSettings;
    });
  }, []);

  /**
   * 应用主题
   * @param theme 主题名称
   */
  const applyTheme = (theme: string): void => {
    const root = document.documentElement;
    if (theme === 'default') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    localStorage.setItem('app-theme', theme);
  };

  /**
   * 切换主题
   * @param theme 新主题名称
   */
  const handleThemeChange = (theme: string): void => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  const [settings, setSettings] = useState<SettingGroup[]>([
    {
      title: '界面主题设置',
      description: '自定义应用的颜色主题和视觉风格',
      items: [
        {
          id: 'colorTheme',
          label: '颜色主题',
          description: '选择应用的整体颜色风格',
          type: 'select',
          value: currentTheme,
          options: [
            { label: '默认主题（金色）', value: 'default' },
            { label: '深色主题', value: 'dark' },
            { label: '蓝色主题', value: 'blue' },
            { label: '绿色主题', value: 'green' },
            { label: '紫色主题', value: 'purple' },
            { label: '蔚蓝圣洁', value: 'azure-holy' },
            { label: '白金圣洁', value: 'platinum-holy' },
            { label: '炙热火焰', value: 'blazing-flame' },
            { label: '苍林生机', value: 'forest-vitality' },
            { label: '深蓝大海', value: 'deep-ocean' },
            { label: '黑金土壤', value: 'black-gold-soil' }
          ]
        }
      ]
    },
    {
      title: '宗门基础设置',
      description: '配置宗门的基本信息和运行参数',
      items: [
        {
          id: 'sectName',
          label: '宗门名称',
          description: '设置宗门的正式名称',
          type: 'input',
          value: '青云宗'
        },
        {
          id: 'autoAcceptDisciples',
          label: '自动接收弟子',
          description: '是否自动接收符合条件的新弟子',
          type: 'toggle',
          value: true
        },
        {
          id: 'discipleLimit',
          label: '弟子数量上限',
          description: '设置宗门可接收的最大弟子数量',
          type: 'slider',
          value: 200,
          min: 50,
          max: 500
        }
      ]
    },
    {
      title: '修炼系统设置',
      description: '配置修炼相关的参数和规则',
      items: [
        {
          id: 'cultivationSpeed',
          label: '修炼速度倍率',
          description: '调整整体修炼速度的倍率',
          type: 'select',
          value: '1x',
          options: [
            { label: '0.5x (慢速)', value: '0.5x' },
            { label: '1x (正常)', value: '1x' },
            { label: '1.5x (快速)', value: '1.5x' },
            { label: '2x (极速)', value: '2x' }
          ]
        },
        {
          id: 'autoBreakthrough',
          label: '自动境界突破',
          description: '达到条件时自动进行境界突破',
          type: 'toggle',
          value: false
        },
        {
          id: 'resourceConsumption',
          label: '资源消耗率',
          description: '修炼时的资源消耗倍率',
          type: 'slider',
          value: 100,
          min: 50,
          max: 200
        }
      ]
    },
    {
      title: '界面显示设置',
      description: '自定义界面显示效果和交互方式',
      items: [
        {
          id: 'animations',
          label: '动画效果',
          description: '启用界面动画和过渡效果',
          type: 'toggle',
          value: true
        },
        {
          id: 'notifications',
          label: '系统通知',
          description: '显示重要事件的系统通知',
          type: 'toggle',
          value: true
        }
      ]
    },
    {
      title: '高级设置',
      description: '高级用户专用的系统配置选项',
      items: [
        {
          id: 'debugMode',
          label: '调试模式',
          description: '启用开发者调试功能',
          type: 'toggle',
          value: false
        },
        {
          id: 'dataBackup',
          label: '自动数据备份',
          description: '定期自动备份宗门数据',
          type: 'toggle',
          value: true
        },
        {
          id: 'performanceMode',
          label: '性能优化模式',
          description: '启用性能优化，可能影响视觉效果',
          type: 'toggle',
          value: false
        }
      ]
    }
  ]);

  /**
   * 更新设置项的值
   */
  const updateSetting = (groupIndex: number, itemIndex: number, newValue: any): void => {
    const newSettings = [...settings];
    const item = newSettings[groupIndex].items[itemIndex];
    
    // 特殊处理主题切换
    if (item.id === 'colorTheme') {
      handleThemeChange(newValue);
    }
    
    item.value = newValue;
    setSettings(newSettings);
  };

  /**
   * 渲染设置项控件
   */
  const renderSettingControl = (item: SettingItem, groupIndex: number, itemIndex: number): React.ReactElement => {
    switch (item.type) {
      case 'toggle':
        return (
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={item.value}
              onChange={(e) => updateSetting(groupIndex, itemIndex, e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        );
      
      case 'select':
        // 特殊处理主题选择
        if (item.id === 'colorTheme') {
          return (
            <div className="theme-dropdown-container">
              <select
                value={item.value}
                onChange={(e) => updateSetting(groupIndex, itemIndex, e.target.value)}
                className="setting-select theme-dropdown"
              >
                {item.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="theme-preview-container">
                <ThemePreview
                  theme={item.value}
                  isActive={true}
                  onClick={() => {}}
                />
              </div>
            </div>
          );
        }
        
        return (
          <select
            value={item.value}
            onChange={(e) => updateSetting(groupIndex, itemIndex, e.target.value)}
            className="setting-select"
          >
            {item.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'input':
        return (
          <input
            type="text"
            value={item.value}
            onChange={(e) => updateSetting(groupIndex, itemIndex, e.target.value)}
            className="setting-input"
          />
        );
      
      case 'slider':
        return (
          <div className="slider-container">
            <input
              type="range"
              min={item.min}
              max={item.max}
              value={item.value}
              onChange={(e) => updateSetting(groupIndex, itemIndex, parseInt(e.target.value))}
              className="setting-slider"
            />
            <span className="slider-value">{item.value}{item.id.includes('Rate') ? '%' : ''}</span>
          </div>
        );
      
      default:
        return <span>未知控件类型</span>;
    }
  };

  /**
   * 保存设置
   */
  const saveSettings = (): void => {
    // 这里可以调用API保存设置到后端
    console.log('保存设置:', settings);
    alert('设置已保存！');
  };

  /**
   * 重置设置
   */
  const resetSettings = (): void => {
    if (confirm('确定要重置所有设置到默认值吗？')) {
      // 这里可以重置到默认设置
      console.log('重置设置');
      alert('设置已重置！');
    }
  };

  return (
    <div className="settings-container">
      <div className="page-header">
        <h2>宗门设置</h2>
        <p>配置宗门的各项参数和偏好设置</p>
      </div>

      <div className="settings-content">
        {settings.map((group, groupIndex) => (
          <div key={group.title} className="setting-group">
            <div className="group-header">
              <h3>{group.title}</h3>
              <p>{group.description}</p>
            </div>
            
            <div className="group-items">
              {group.items.map((item, itemIndex) => (
                <div key={item.id} className="setting-item">
                  <div className="setting-info">
                    <label className="setting-label">{item.label}</label>
                    <p className="setting-description">{item.description}</p>
                  </div>
                  <div className="setting-control">
                    {renderSettingControl(item, groupIndex, itemIndex)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="settings-actions">
        <button onClick={saveSettings} className="action-btn primary">
          💾 保存设置
        </button>
        <button onClick={resetSettings} className="action-btn secondary">
          🔄 重置设置
        </button>
        <button className="action-btn secondary">
          📤 导出配置
        </button>
        <button className="action-btn secondary">
          📥 导入配置
        </button>
      </div>

      <div className="settings-info">
        <h4>💡 设置说明</h4>
        <ul>
          <li>修改设置后需要点击"保存设置"才能生效</li>
          <li>某些设置可能需要重启应用才能完全生效</li>
          <li>建议在修改重要设置前先导出当前配置作为备份</li>
          <li>如遇到问题，可以尝试重置设置到默认值</li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsPage;