import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import {
  LeaderPage,
  DisciplesPage,
  ResourcesPage,
  SettingsPage,
  CultivationGuidePage,
  CultivationMethodPage,
  ComingSoonPage,
  PeopleDisplayPage
} from './pages';
import DatabaseManagementPage from './pages/DatabaseManagementPage';
import { getNavigationIcon } from './components/NavigationIcons';
import SectLogo from './components/SectLogo';

import SectIconsPage from './pages/SectIconsPage';

// 类型定义
/**
 * 导航项接口
 * 定义侧边栏导航的结构
 */
interface NavItem {
  id: string;
  label: string;
  iconId: string;
  path: string;
}

// 导航菜单配置
const navItems: NavItem[] = [
  { id: 'leader', label: '掌门信息', iconId: 'leader', path: '/' },
  { id: 'disciples', label: '弟子管理', iconId: 'disciples', path: '/disciples' },
  { id: 'people-display', label: '人物展示', iconId: 'disciples', path: '/people-display' },
  { id: 'resources', label: '宗门资源', iconId: 'resources', path: '/resources' },
  { id: 'cultivation-guide', label: '修炼指南', iconId: 'cultivation-guide', path: '/cultivation-guide' },
  { id: 'missions', label: '任务系统', iconId: 'missions', path: '/missions' },
  { id: 'cultivation', label: '修炼功法', iconId: 'cultivation', path: '/cultivation-methods' },
  { id: 'market', label: '交易市场', iconId: 'market', path: '/market' },
  { id: 'events', label: '宗门事件', iconId: 'events', path: '/events' },
  { id: 'database', label: '数据库管理', iconId: 'settings', path: '/database' },
  { id: 'sect-icons', label: '宗门图标', iconId: 'sect-icons', path: '/sect-icons' },
  { id: 'settings', label: '宗门设置', iconId: 'settings', path: '/settings' }
];

/**
 * 侧边栏导航组件
 * 使用React Router的Link组件实现路由导航
 * 支持折叠功能
 */
interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation();

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sect-name">
        <div className="sect-header">
          <SectLogo size={isCollapsed ? 24 : 32} className="sect-logo" />
          {!isCollapsed && <h1>青云宗</h1>}
        </div>
        <button 
          className="collapse-btn" 
          onClick={onToggleCollapse}
          title={isCollapsed ? '展开侧边栏' : '折叠侧边栏'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>
      <nav className="nav-list">
        {navItems.map((item) => {
          const IconComponent = getNavigationIcon(item.iconId);
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <span className="nav-icon">
                <IconComponent width={20} height={20} />
              </span>
              {!isCollapsed && <span className="nav-text">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

/**
 * 主应用组件
 * 使用React Router实现路由功能
 * 管理侧边栏折叠状态
 */
const App: React.FC = (): React.ReactElement => {
  // 侧边栏折叠状态管理
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  /**
   * 切换侧边栏折叠状态
   */
  const handleToggleSidebar = (): void => {
    setIsSidebarCollapsed(prev => !prev);
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggleCollapse={handleToggleSidebar} 
        />
        <main className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Routes>
            <Route path="/" element={<LeaderPage />} />
            <Route path="/disciples" element={<DisciplesPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/cultivation-guide" element={<CultivationGuidePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route 
              path="/missions" 
              element={
                <ComingSoonPage 
                  title="任务系统" 
                  description="宗门任务管理系统正在开发中"
                  features={[
                    '日常任务发布与管理',
                    '弟子任务分配系统',
                    '任务奖励自动发放',
                    '任务完成度统计'
                  ]}
                />
              } 
            />
            <Route 
              path="/cultivation-methods" 
              element={<CultivationMethodPage />} 
            />
            <Route 
              path="/market" 
              element={
                <ComingSoonPage 
                  title="交易市场" 
                  description="宗门交易系统正在开发中"
                  features={[
                    '物品交易平台',
                    '拍卖行系统',
                    '价格监控',
                    '交易记录管理'
                  ]}
                />
              } 
            />
            <Route 
              path="/events" 
              element={
                <ComingSoonPage 
                  title="宗门事件" 
                  description="事件管理系统正在开发中"
                  features={[
                    '宗门大事记录',
                    '重要事件提醒',
                    '事件影响分析',
                    '历史事件查询'
                  ]}
                />
              } 
            />

            <Route path="/people-display" element={<PeopleDisplayPage />} />
            <Route path="/database" element={<DatabaseManagementPage />} />
            <Route path="/sect-icons" element={<SectIconsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;