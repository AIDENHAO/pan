import React, { useState, useEffect, useMemo } from 'react';
import { getDisciples } from '../../backend/services/leaderService';
import '../styles/DisciplesPage.css';

/**
 * 弟子信息接口
 * 定义弟子的基本信息结构
 */
interface Disciple {
  character_uuid: string;
  character_name: string;
  character_realm_Level: number;
  cultivation: number;
  status: string;
  // 前端计算字段
  realmName?: string;
}

/**
 * 排序类型枚举
 */
type SortType = 'character_name' | 'character_realm_Level' | 'cultivation' | 'status';
type SortOrder = 'asc' | 'desc';

/**
 * 弟子管理页面组件
 */
const DisciplesPage: React.FC = (): React.ReactElement => {
  const [disciples, setDisciples] = useState<Disciple[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortType, setSortType] = useState<SortType>('character_name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  /**
   * 获取弟子列表
   */
  const fetchDisciples = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDisciples('leader_001');
      setDisciples(data);
    } catch (err) {
      setError('获取弟子信息失败');
      console.error('Error fetching disciples:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理排序
   */
  const handleSort = (type: SortType): void => {
    if (sortType === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortType(type);
      setSortOrder('asc');
    }
  };

  /**
   * 获取状态列表
   */
  const statusList = useMemo(() => {
    const statuses = Array.from(new Set(disciples.map(d => d.status)));
    return ['all', ...statuses];
  }, [disciples]);

  /**
   * 过滤和排序后的弟子列表
   */
  const filteredAndSortedDisciples = useMemo(() => {
    let filtered = disciples.filter(disciple => {
      const matchesSearch = disciple.character_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (disciple.realmName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || disciple.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let aValue: any = a[sortType];
      let bValue: any = b[sortType];

      if (sortType === 'character_name' || sortType === 'status') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [disciples, searchTerm, statusFilter, sortType, sortOrder]);

  /**
   * 获取排序图标
   */
  const getSortIcon = (type: SortType): string => {
    if (sortType !== type) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  useEffect(() => {
    fetchDisciples();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="loading-text">加载弟子信息中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchDisciples}>重试</button>
      </div>
    );
  }

  return (
    <div className="disciples-container">
      <div className="page-header">
        <h2>弟子管理</h2>
        <p>管理宗门弟子信息</p>
      </div>

      {/* 主内容区域 */}
      <div className="disciples-main-content">
        {/* 统计数据卡片容器 */}
        <div className="stats-wrapper-card">
          <div className="stats-card-header">
            <h3>宗门统计</h3>
            <p>弟子数据概览</p>
          </div>
          <div className="disciples-stats">
            <div className="stat-card">
              <h4>弟子总数</h4>
              <div className="stat-value">{filteredAndSortedDisciples.length}</div>
            </div>
            <div className="stat-card">
              <h4>平均修为</h4>
              <div className="stat-value">
                {filteredAndSortedDisciples.length > 0 
                  ? Math.round(filteredAndSortedDisciples.reduce((sum, d) => sum + d.cultivation, 0) / filteredAndSortedDisciples.length)
                  : 0
                }
              </div>
            </div>
            <div className="stat-card">
              <h4>修炼中弟子</h4>
              <div className="stat-value">
                {filteredAndSortedDisciples.filter(d => d.status === '修炼中').length}
              </div>
            </div>
          </div>
        </div>

        {/* 弟子列表区域 */}
        <div className="disciples-list-section">
          <div className="disciples-list">
            <div className="list-header">
              <h3>弟子列表</h3>
              <div className="results-info">
                显示 {filteredAndSortedDisciples.length} / {disciples.length} 名弟子
              </div>
            </div>
            
            {/* 搜索和过滤控件 */}
            <div className="disciples-controls">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="搜索弟子姓名或境界..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="filter-container">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="status-filter"
                >
                  <option value="all">全部状态</option>
                  {statusList.filter(status => status !== 'all').map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 弟子列表 */}
            <div className="disciples-table">
              <div className="table-header">
                <div 
                  className={`header-cell sortable ${sortType === 'character_name' ? 'active' : ''}`}
                  onClick={() => handleSort('character_name')}
                >
                  姓名 <span className="sort-icon">{getSortIcon('character_name')}</span>
                </div>
                <div 
                  className={`header-cell sortable ${sortType === 'character_realm_Level' ? 'active' : ''}`}
                  onClick={() => handleSort('character_realm_Level')}
                >
                  境界 <span className="sort-icon">{getSortIcon('character_realm_Level')}</span>
                </div>
                <div 
                  className={`header-cell sortable ${sortType === 'cultivation' ? 'active' : ''}`}
                  onClick={() => handleSort('cultivation')}
                >
                  修为值 <span className="sort-icon">{getSortIcon('cultivation')}</span>
                </div>
                <div 
                  className={`header-cell sortable ${sortType === 'status' ? 'active' : ''}`}
                  onClick={() => handleSort('status')}
                >
                  状态 <span className="sort-icon">{getSortIcon('status')}</span>
                </div>
              </div>
              
              {filteredAndSortedDisciples.length === 0 ? (
                <div className="no-results">
                  {searchTerm || statusFilter !== 'all' ? '没有找到符合条件的弟子' : '暂无弟子数据'}
                </div>
              ) : (
                filteredAndSortedDisciples.map((disciple) => (
                  <div key={disciple.character_uuid} className="table-row">
                    <div className="table-cell">
                      <div className="disciple-name">
                        <div className="disciple-avatar">{disciple.character_name.charAt(0)}</div>
                        <span>{disciple.character_name}</span>
                      </div>
                      <div className="disciple-id">ID: {disciple.character_uuid}</div>
                    </div>
                    <div className="table-cell">
                      <div className="realm-info">
                        <span className="realm-name">{disciple.realmName}</span>
                        <span className="realm-level">第{disciple.character_realm_Level}层</span>
                      </div>
                    </div>
                    <div className="table-cell">
                      <div className="cultivation-info">
                        <span className="cultivation-value">{disciple.cultivation}</span>
                        <div className="cultivation-bar-mini">
                          <div 
                            className="cultivation-progress-mini"
                            style={{ width: `${Math.min((disciple.cultivation % 100), 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="table-cell">
                      <span className={`status-badge status-${disciple.status.replace(/[^a-zA-Z0-9]/g, '')}`}>
                        {disciple.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisciplesPage;