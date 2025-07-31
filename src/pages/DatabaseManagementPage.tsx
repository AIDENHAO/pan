/**
 * 数据库管理页面
 * 基于新的数据库结构重构，提供完整的CRUD操作界面
 */
import React, { useState, useEffect, useCallback } from 'react';
import '../styles/DatabaseManagementPage.css';

// 数据库统计信息接口
interface DatabaseStats {
  characterCount: number;
  realmCount: number;
  skillCount: number;
  weaponCount: number;
  itemCount: number;
  bodyTypeCount?: number;
  zongmenCount?: number;
  achievementCount?: number;
  itemCategoryCount?: number;
}

// 角色基础信息接口 - 对应 character_base_info 表
interface CharacterBaseInfo {
  character_uuid: string;
  character_name: string;
  character_gender: '男' | '女' | '其他';
  character_birthday?: string;
  character_dao_hao?: string;
  character_realm_Level: number;
  cultivatingState: '未修练' | '正在修炼' | '闭关中' | '受伤修炼中' | '顿悟中';
  cultivationLimitBase: number;
  cultivationLimitAdd: number;
  cultivationValue: number;
  cultivationOverLimit: boolean;
  cultivationSpeedBase: number;
  cultivationSpeedAdd: number;
  breakThroughEnabled: boolean;
  breakThroughItemsEnabled: boolean;
  breakThroughState: boolean;
  breakThroughFailNumb: number;
  character_physicalAttributes?: '金' | '木' | '水' | '火' | '土';
  zongMenJoinBool: boolean;
  zongMen_id?: string;
  zongMenJoinDate?: string;
  title_1_id?: '外门弟子' | '内门弟子' | '核心弟子' | '长老' | '掌门';
  title_2_id?: '初入宗门' | '略有小成' | '宗门栋梁' | '宗门支柱' | '宗门传奇';
  title_3_id?: string;
  title_4_id?: string;
  title_5_id?: string;
  create_time?: string;
  update_time?: string;
}

// 角色亲和度接口 - 对应 character_affinities 表
interface CharacterAffinities {
  character_uuid: string;
  total_affinity: number;
  metal_affinity: number;
  wood_affinity: number;
  water_affinity: number;
  fire_affinity: number;
  earth_affinity: number;
}

// 角色力量接口 - 对应 character_strength 表
interface CharacterStrength {
  character_uuid: string;
  physical_strength: number;
  spiritual_strength: number;
  soul_strength: number;
  blood_current: number;
  blood_max: number;
  blood_recovery_rate: number;
  blood_temp_add: number;
  spiritual_current: number;
  spiritual_max: number;
  spiritual_recovery_rate: number;
  spiritual_temp_add: number;
  mental_current: number;
  mental_max: number;
  mental_recovery_rate: number;
  mental_temp_add: number;
  combat_power: number;
  base_combat_power: number;
}

// 角色体质接口 - 对应 character_body_types 表
interface CharacterBodyTypes {
  character_uuid: string;
  body_type_1_id?: string;
  body_type_2_id?: string;
  body_type_3_id?: string;
  body_type_4_id?: string;
  body_type_5_id?: string;
}

// 角色技能接口 - 对应 character_skills 表
interface CharacterSkills {
  character_uuid: string;
  skill_1_id?: string;
  skill_2_id?: string;
  skill_3_id?: string;
  skill_4_id?: string;
  skill_5_id?: string;
  skill_6_id?: string;
  skill_7_id?: string;
  skill_8_id?: string;
  skill_9_id?: string;
  skill_10_id?: string;
}

// 角色武器接口 - 对应 character_weapons 表
interface CharacterWeapons {
  character_uuid: string;
  weapon_1_id?: string;
  weapon_2_id?: string;
  weapon_3_id?: string;
  weapon_4_id?: string;
  weapon_5_id?: string;
}

// 角色货币接口 - 对应 character_currency 表
interface CharacterCurrency {
  character_uuid: string;
  copper_coin: number;
  silver_coin: number;
  gold_coin: number;
  low_spirit_stone: number;
  medium_spirit_stone: number;
  high_spirit_stone: number;
  zongmen_contribution: number;
  region_contribution: number;
  world_contribution: number;
  special_contribution_1: number;
  special_contribution_2: number;
  special_contribution_3: number;
}

// 角色物品接口 - 对应 character_items 表
interface CharacterItems {
  character_items_id: string;
  character_uuid: string;
  item_id: string;
  item_count: number;
  item_level: number;
  is_equipped: boolean;
  slot_position?: number;
  durability?: number;
  create_time?: string;
  update_time?: string;
}

// 境界数据接口 - 对应 realm_data 表
interface RealmData {
  realm_level: number;
  stage_division: string;
  major_realm: string;
  minor_realm: string;
  stage: string;
  cultivation_start_value: number;
  base_cultivation_limit: number;
  base_cultivation_speed: number;
  base_physical_strength: number;
  base_spiritual_strength: number;
  base_soul_strength: number;
  base_spiritual_storage: number;
  base_blood_storage: number;
  base_mental_storage: number;
  base_spiritual_recovery_rate: number;
  base_blood_recovery_rate: number;
  base_mental_recovery_rate: number;
}

// 体质数据接口 - 对应 body_type_data 表
interface BodyTypeData {
  body_type_id: string;
  body_type_name: string;
  description?: string;
  physical_bonus: number;
  spiritual_bonus: number;
  soul_bonus: number;
}

// 技能数据接口 - 对应 skill_data 表
interface SkillData {
  skill_id: string;
  skill_name: string;
  skill_type: '心法' | '功法' | '武技' | '秘术' | '禁术';
  skill_realm_requirement: number;
  skill_description?: string;
  skill_power: number;
}

// 武器数据接口 - 对应 weapon_data 表
interface WeaponData {
  weapon_id: string;
  weapon_name: string;
  weapon_type: '剑' | '刀' | '棍' | '枪' | '鞭' | '锤' | '扇' | '笛' | '其他';
  weapon_realm_requirement: number;
  weapon_description?: string;
  weapon_attack_power: number;
  weapon_special_effect?: string;
}

// 宗门数据接口 - 对应 zongmen_data 表
interface ZongmenData {
  zongmen_id: string;
  zongmen_name: string;
  description?: string;
  founder?: string;
  established_date?: string;
  realm_level_required: number;
}

// 成就数据接口 - 对应 achievement_data 表
interface AchievementData {
  achievement_id: string;
  achievement_name: string;
  achievement_type: '区域' | '世界' | '特殊';
  description?: string;
  reward?: string;
  difficulty: number;
}

// 物品数据接口 - 对应 item_data 表
interface ItemData {
  item_id: string;
  item_name: string;
  item_type: '武器' | '防具' | '饰品' | '消耗品' | '材料' | '任务物品' | '法宝';
  quality: '普通' | '优秀' | '稀有' | '史诗' | '传说' | '神器';
  description?: string;
  realm_requirement?: number;
  attack_power?: number;
  defense_power?: number;
  health_bonus?: number;
  mana_bonus?: number;
  special_effect?: string;
  is_stackable: boolean;
  max_stack_size: number;
  sell_price: number;
  buy_price?: number;
  is_bind_on_pickup: boolean;
  is_bind_on_equip: boolean;
  create_time?: string;
  update_time?: string;
}

// 物品分类接口 - 对应 item_type_category 表
interface ItemTypeCategory {
  category_id: number;
  category_name: string;
  parent_category_id?: number;
  description?: string;
}

// API响应接口
interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
}

/**
 * 数据库管理页面组件
 */
const DatabaseManagementPage: React.FC = () => {
  // 状态管理
  const [activeTab, setActiveTab] = useState<string>('stats');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');
  
  // 数据状态
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [characters, setCharacters] = useState<CharacterBaseInfo[]>([]);
  const [characterAffinities, setCharacterAffinities] = useState<CharacterAffinities[]>([]);
  const [characterStrength, setCharacterStrength] = useState<CharacterStrength[]>([]);
  const [characterBodyTypes, setCharacterBodyTypes] = useState<CharacterBodyTypes[]>([]);
  const [characterSkills, setCharacterSkills] = useState<CharacterSkills[]>([]);
  const [characterWeapons, setCharacterWeapons] = useState<CharacterWeapons[]>([]);
  const [characterCurrency, setCharacterCurrency] = useState<CharacterCurrency[]>([]);
  const [characterItems, setCharacterItems] = useState<CharacterItems[]>([]);
  const [realms, setRealms] = useState<RealmData[]>([]);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [weapons, setWeapons] = useState<WeaponData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [bodyTypes, setBodyTypes] = useState<BodyTypeData[]>([]);
  const [zongmen, setZongmen] = useState<ZongmenData[]>([]);
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [itemCategories, setItemCategories] = useState<ItemTypeCategory[]>([]);
  
  // 搜索状态
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('name');
  const [searchResults, setSearchResults] = useState<CharacterBaseInfo[]>([]);
  
  // 表单状态
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newCharacter, setNewCharacter] = useState<Partial<CharacterBaseInfo>>({
    character_name: '',
    character_dao_hao: '',
    character_realm_Level: 1,
    cultivatingState: '未修练',
    cultivationLimitBase: 0,
    cultivationLimitAdd: 0,
    cultivationValue: 0,
    cultivationOverLimit: false,
    cultivationSpeedBase: 0,
    cultivationSpeedAdd: 0,
    breakThroughEnabled: false,
    breakThroughItemsEnabled: false,
    breakThroughState: false,
    breakThroughFailNumb: 0,
    character_gender: '其他',
    zongMenJoinBool: false
  });

  // 境界数据表单状态
  const [showRealmForm, setShowRealmForm] = useState<boolean>(false);
  const [editingRealm, setEditingRealm] = useState<RealmData | null>(null);
  const [realmFormData, setRealmFormData] = useState<Partial<RealmData>>({
    realm_level: 1,
    stage_division: '初期',
    major_realm: '',
    minor_realm: '',
    stage: '初期',
    cultivation_start_value: 0,
    base_cultivation_limit: 100,
    base_cultivation_speed: 1,
    base_physical_strength: 10,
    base_spiritual_strength: 10,
    base_soul_strength: 10,
    base_spiritual_storage: 100,
    base_blood_storage: 100,
    base_mental_storage: 100,
    base_spiritual_recovery_rate: 1,
    base_blood_recovery_rate: 1,
    base_mental_recovery_rate: 1
  });

  // 列宽调整相关状态
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizingColumn, setResizingColumn] = useState<number | null>(null);
  const [startX, setStartX] = useState<number>(0);
  const [startWidth, setStartWidth] = useState<number>(0);
  const [currentTable, setCurrentTable] = useState<HTMLTableElement | null>(null);

  /**
   * 处理鼠标移动事件
   * @param e 鼠标事件
   */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || resizingColumn === null || !currentTable) return;
    
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + deltaX); // 最小宽度50px
    
    // 只更新当前表格的列宽
    const th = currentTable.querySelectorAll('th')[resizingColumn];
    const tds = currentTable.querySelectorAll(`td:nth-child(${resizingColumn + 1})`);
    
    if (th) {
      (th as HTMLElement).style.width = `${newWidth}px`;
      (th as HTMLElement).style.minWidth = `${newWidth}px`;
      (th as HTMLElement).style.maxWidth = `${newWidth}px`;
    }
    
    tds.forEach((td: Element) => {
      (td as HTMLElement).style.width = `${newWidth}px`;
      (td as HTMLElement).style.minWidth = `${newWidth}px`;
      (td as HTMLElement).style.maxWidth = `${newWidth}px`;
    });
  }, [isResizing, resizingColumn, startX, startWidth, currentTable]);
  
  /**
   * 处理鼠标释放事件
   */
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizingColumn(null);
    setCurrentTable(null);
    
    // 移除全局事件监听
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // 恢复文本选择
    document.body.style.userSelect = '';
  }, [handleMouseMove]);

  /**
   * 处理列宽调整开始
   * @param e 鼠标事件
   * @param columnIndex 列索引
   */
  const handleColumnResize = useCallback((e: React.MouseEvent, columnIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const table = (e.target as HTMLElement).closest('table') as HTMLTableElement;
    if (!table) return;
    
    const th = table.querySelectorAll('th')[columnIndex];
    if (!th) return;
    
    setIsResizing(true);
    setResizingColumn(columnIndex);
    setCurrentTable(table);
    setStartX(e.clientX);
    setStartWidth(th.offsetWidth);
    
    // 防止文本选择
    document.body.style.userSelect = 'none';
    
    // 记录初始宽度
     const initialWidth = th.offsetWidth;
     const initialX = e.clientX;
     
     // 添加调整状态样式
      table.classList.add('resizing');
      
      // 创建事件处理函数
      const mouseMoveHandler = (event: MouseEvent) => {
        if (!table) return;
        
        const deltaX = event.clientX - initialX;
        const newWidth = Math.max(30, initialWidth + deltaX); // 使用初始宽度计算，最小宽度30px
        
        const targetTh = table.querySelectorAll('th')[columnIndex];
        const targetTds = table.querySelectorAll(`td:nth-child(${columnIndex + 1})`);
        
        if (targetTh) {
          (targetTh as HTMLElement).style.width = `${newWidth}px`;
          (targetTh as HTMLElement).style.minWidth = `${newWidth}px`;
          (targetTh as HTMLElement).style.maxWidth = `${newWidth}px`;
        }
        
        targetTds.forEach((td: Element) => {
          (td as HTMLElement).style.width = `${newWidth}px`;
          (td as HTMLElement).style.minWidth = `${newWidth}px`;
          (td as HTMLElement).style.maxWidth = `${newWidth}px`;
        });
      };
    
    const mouseUpHandler = () => {
       setIsResizing(false);
       setResizingColumn(null);
       setCurrentTable(null);
       
       // 移除调整状态样式
       table.classList.remove('resizing');
       
       // 移除事件监听
       document.removeEventListener('mousemove', mouseMoveHandler);
       document.removeEventListener('mouseup', mouseUpHandler);
       
       // 恢复文本选择
       document.body.style.userSelect = '';
     };
    
    // 添加全局鼠标事件监听
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }, []);
  
  // 组件卸载时清理事件监听
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [handleMouseMove, handleMouseUp]);

  /**
   * 处理境界表单提交
   */
  const handleRealmFormSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 验证必填字段
      if (!realmFormData.major_realm || !realmFormData.minor_realm || !realmFormData.realm_level) {
        setError('请填写所有必填字段');
        return;
      }
      
      const endpoint = '/api/database/realms';
      
      if (editingRealm) {
        // 编辑模式
        await apiCall(`${endpoint}/${editingRealm.realm_level}`, {
          method: 'PUT',
          body: JSON.stringify(realmFormData)
        });
        setSuccess('境界数据更新成功');
      } else {
        // 新增模式
        await apiCall(endpoint, {
          method: 'POST',
          body: JSON.stringify(realmFormData)
        });
        setSuccess('境界数据创建成功');
      }
      
      // 刷新数据并关闭表单
      await fetchRealms();
      setShowRealmForm(false);
      setEditingRealm(null);
      
    } catch (err) {
      setError(`操作失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * 取消境界表单编辑
   */
  const handleRealmFormCancel = () => {
    setShowRealmForm(false);
    setEditingRealm(null);
    setRealmFormData({
      realm_level: 1,
      stage_division: '初期',
      major_realm: '',
      minor_realm: '',
      stage: '初期',
      cultivation_start_value: 0,
      base_cultivation_limit: 100,
      base_cultivation_speed: 1,
      base_physical_strength: 10,
      base_spiritual_strength: 10,
      base_soul_strength: 10,
      base_spiritual_storage: 100,
      base_blood_storage: 100,
      base_mental_storage: 100,
      base_spiritual_recovery_rate: 1,
      base_blood_recovery_rate: 1,
      base_mental_recovery_rate: 1
    });
  };

  /**
   * 加载选中角色的关联数据
   */
  const loadCharacterRelatedData = async (characterId: string, dataType: string) => {
    if (!characterId) {
      setError('请先选择一个角色');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      switch (dataType) {
        case 'character-affinities':
          await fetchCharacterAffinities(characterId);
          break;
        case 'character-strength':
          await fetchCharacterStrength(characterId);
          break;
        case 'character-body-types':
          await fetchCharacterBodyTypes(characterId);
          break;
        case 'character-skills':
          await fetchCharacterSkills(characterId);
          break;
        case 'character-weapons':
          await fetchCharacterWeapons(characterId);
          break;
        case 'character-currency':
          await fetchCharacterCurrency(characterId);
          break;
        default:
          setError('未知的数据类型');
      }
    } catch (error) {
      console.error('加载角色关联数据失败:', error);
      setError('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * API调用函数
   */
  const apiCall = async <T,>(url: string, options?: RequestInit): Promise<T> => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<T> = await response.json();
      
      if (result.status === 'error') {
        throw new Error(result.error || '请求失败');
      }
      
      return result.data as T;
    } catch (err) {
      console.error('API调用失败:', err);
      throw err;
    }
  };

  /**
   * 获取数据库统计信息
   */
  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await apiCall<DatabaseStats>('/api/database/stats');
      setStats(data);
    } catch (err) {
      setError(`获取统计信息失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取角色基础信息列表
   */
  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const data = await apiCall<CharacterBaseInfo[]>('/api/database/character-base-info');
      setCharacters(data);
    } catch (err) {
      setError(`获取角色列表失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取境界数据列表
   */
  const fetchRealms = async () => {
    try {
      setLoading(true);
      const data = await apiCall<RealmData[]>('/api/database/realms');
      setRealms(data);
    } catch (err) {
      setError(`获取境界列表失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取技能数据列表
   */
  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await apiCall<SkillData[]>('/api/database/skills');
      setSkills(data);
    } catch (err) {
      setError(`获取技能列表失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取武器数据列表
   */
  const fetchWeapons = async () => {
    try {
      setLoading(true);
      const data = await apiCall<WeaponData[]>('/api/database/weapons');
      setWeapons(data);
    } catch (err) {
      setError(`获取武器列表失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取物品数据列表
   */
  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await apiCall<ItemData[]>('/api/database/items');
      setItems(data);
    } catch (err) {
      setError(`获取物品列表失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取体质数据列表
   */
  const fetchBodyTypes = async () => {
    try {
      setLoading(true);
      const data = await apiCall<BodyTypeData[]>('/api/database/body-types');
      setBodyTypes(data);
    } catch (err) {
      setError(`获取体质列表失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取宗门数据列表
   */
  const fetchZongmen = async () => {
    try {
      setLoading(true);
      const data = await apiCall<ZongmenData[]>('/api/database/zongmen');
      setZongmen(data);
    } catch (err) {
      setError(`获取宗门列表失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取成就数据列表
   */
  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const data = await apiCall<AchievementData[]>('/api/database/achievements');
      setAchievements(data);
    } catch (err) {
      setError(`获取成就列表失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取物品分类列表
   */
  const fetchItemCategories = async () => {
    try {
      setLoading(true);
      const data = await apiCall<ItemTypeCategory[]>('/api/database/item-categories');
      setItemCategories(data);
    } catch (err) {
      setError(`获取物品分类列表失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取角色亲和度
   */
  const fetchCharacterAffinities = async (characterId: string) => {
    try {
      setLoading(true);
      const data = await apiCall<CharacterAffinities>(`/api/database/character-affinities/${characterId}`);
      setCharacterAffinities([data]); // 包装为数组以保持界面兼容性
    } catch (err) {
      setError(`获取角色亲和度失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取角色力量
   */
  const fetchCharacterStrength = async (characterId: string) => {
    try {
      setLoading(true);
      const data = await apiCall<CharacterStrength>(`/api/database/character-strength/${characterId}`);
      setCharacterStrength([data]); // 包装为数组以保持界面兼容性
    } catch (err) {
      setError(`获取角色力量失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取角色体质
   */
  const fetchCharacterBodyTypes = async (characterId: string) => {
    try {
      setLoading(true);
      const data = await apiCall<CharacterBodyTypes>(`/api/database/character-body-types/${characterId}`);
      setCharacterBodyTypes([data]); // 包装为数组以保持界面兼容性
    } catch (err) {
      setError(`获取角色体质失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取角色技能
   */
  const fetchCharacterSkills = async (characterId: string) => {
    try {
      setLoading(true);
      const data = await apiCall<CharacterSkills>(`/api/database/character-skills/${characterId}`);
      setCharacterSkills([data]); // 包装为数组以保持界面兼容性
    } catch (err) {
      setError(`获取角色技能失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取角色武器
   */
  const fetchCharacterWeapons = async (characterId: string) => {
    try {
      setLoading(true);
      const data = await apiCall<CharacterWeapons>(`/api/database/character-weapons/${characterId}`);
      setCharacterWeapons([data]); // 包装为数组以保持界面兼容性
    } catch (err) {
      setError(`获取角色武器失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取角色货币
   */
  const fetchCharacterCurrency = async (characterId: string) => {
    try {
      setLoading(true);
      const data = await apiCall<CharacterCurrency>(`/api/database/character-currency/${characterId}`);
      setCharacterCurrency([data]); // 包装为数组以保持界面兼容性
    } catch (err) {
      setError(`获取角色货币失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取角色物品列表
   */
  const fetchCharacterItems = async () => {
    try {
      setLoading(true);
      const data = await apiCall<CharacterItems[]>('/api/database/character-items');
      setCharacterItems(data);
    } catch (err) {
      setError(`获取角色物品列表失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 创建新角色
   */
  const createCharacter = async () => {
    try {
      setLoading(true);
      
      // 生成角色ID (8位序列+2位随机)
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      const characterId = timestamp + random;
      
      const characterData = {
        ...newCharacter,
        character_uuid: characterId
      };
      
      await apiCall('/api/database/character-base-info', {
        method: 'POST',
        body: JSON.stringify(characterData),
      });
      
      setSuccess('角色创建成功!');
      setShowCreateForm(false);
      setNewCharacter({
        character_name: '',
        character_dao_hao: '',
        character_realm_Level: 1,
        cultivatingState: '未修练',
        cultivationLimitBase: 0,
        cultivationLimitAdd: 0,
        cultivationValue: 0,
        cultivationOverLimit: false,
        cultivationSpeedBase: 0,
        cultivationSpeedAdd: 0,
        breakThroughEnabled: false,
        breakThroughItemsEnabled: false,
        breakThroughState: false,
        breakThroughFailNumb: 0,
        character_gender: '其他',
        zongMenJoinBool: false
      });
      
      // 刷新角色列表
      await fetchCharacters();
    } catch (err) {
      setError(`创建角色失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 删除角色
   */
  const deleteCharacter = async (characterId: string) => {
    if (!confirm('确定要删除这个角色吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      setLoading(true);
      await apiCall(`/api/database/character-base-info/${characterId}`, {
        method: 'DELETE',
      });
      
      setSuccess('角色删除成功!');
      await fetchCharacters();
    } catch (err) {
      setError(`删除角色失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 搜索角色
   */
  const searchCharacters = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setLoading(true);
      const results = characters.filter(character => {
        switch (searchType) {
          case 'name':
            return character.character_name.toLowerCase().includes(searchQuery.toLowerCase());
          case 'dao_hao':
            return character.character_dao_hao?.toLowerCase().includes(searchQuery.toLowerCase());
          case 'id':
            return character.character_uuid.includes(searchQuery);
          default:
            return false;
        }
      });
      setSearchResults(results);
    } catch (err) {
      setError(`搜索失败: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 清除消息
   */
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  /**
   * 页面初始化
   */
  useEffect(() => {
    fetchStats();
  }, []);

  /**
   * 根据活动标签加载数据
   */
  useEffect(() => {
    clearMessages();
    
    switch (activeTab) {
      case 'characters':
        fetchCharacters();
        break;
      // 角色关联数据需要特定角色ID，不在此处自动加载
      case 'character-affinities':
      case 'character-strength':
      case 'character-body-types':
      case 'character-skills':
      case 'character-weapons':
      case 'character-currency':
        // 这些数据需要选择特定角色后才能加载
        break;
      case 'character-items':
        fetchCharacterItems();
        break;
      case 'realms':
        fetchRealms();
        break;
      case 'skills':
        fetchSkills();
        break;
      case 'weapons':
        fetchWeapons();
        break;
      case 'items':
        fetchItems();
        break;
      case 'body-types':
        fetchBodyTypes();
        break;
      case 'zongmen':
        fetchZongmen();
        break;
      case 'achievements':
        fetchAchievements();
        break;
      case 'item-categories':
        fetchItemCategories();
        break;
    }
  }, [activeTab]);

  /**
   * 监听选中角色变化，自动加载角色关联数据
   */
  useEffect(() => {
    if (selectedCharacterId) {
      // 自动加载所有角色相关数据
      const loadAllCharacterData = async () => {
        try {
          await Promise.all([
            fetchCharacterAffinities(selectedCharacterId),
            fetchCharacterStrength(selectedCharacterId),
            fetchCharacterBodyTypes(selectedCharacterId),
            fetchCharacterSkills(selectedCharacterId),
            fetchCharacterWeapons(selectedCharacterId),
            fetchCharacterCurrency(selectedCharacterId)
          ]);
          // 获取角色物品（如果需要的话）
          if (characterItems.length === 0) {
            await fetchCharacterItems();
          }
        } catch (error) {
          console.error('加载角色相关数据失败:', error);
        }
      };
      
      loadAllCharacterData();
    }
    
    // 如果当前标签是角色相关数据且有选中角色，也要加载对应数据
    if (selectedCharacterId && [
      'character-affinities',
      'character-strength', 
      'character-body-types',
      'character-skills',
      'character-weapons',
      'character-currency'
    ].includes(activeTab)) {
      loadCharacterRelatedData(selectedCharacterId, activeTab);
    }
  }, [selectedCharacterId, activeTab]);

  /**
   * 渲染统计信息
   */
  const renderStats = () => (
    <div>
      {/* 统计信息部分 */}
      <div className="stats-container">
        <h2>数据库统计信息</h2>
        {stats ? (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>角色总数</h3>
              <p className="stat-number">{stats.characterCount}</p>
            </div>
            <div className="stat-card">
              <h3>境界总数</h3>
              <p className="stat-number">{stats.realmCount}</p>
            </div>
            <div className="stat-card">
              <h3>技能总数</h3>
              <p className="stat-number">{stats.skillCount}</p>
            </div>
            <div className="stat-card">
              <h3>武器总数</h3>
              <p className="stat-number">{stats.weaponCount}</p>
            </div>
            <div className="stat-card">
              <h3>物品总数</h3>
              <p className="stat-number">{stats.itemCount}</p>
            </div>
            {stats.bodyTypeCount !== undefined && (
              <div className="stat-card">
                <h3>体质总数</h3>
                <p className="stat-number">{stats.bodyTypeCount}</p>
              </div>
            )}
            {stats.zongmenCount !== undefined && (
              <div className="stat-card">
                <h3>宗门总数</h3>
                <p className="stat-number">{stats.zongmenCount}</p>
              </div>
            )}
            {stats.achievementCount !== undefined && (
              <div className="stat-card">
                <h3>成就总数</h3>
                <p className="stat-number">{stats.achievementCount}</p>
              </div>
            )}
            {stats.itemCategoryCount !== undefined && (
              <div className="stat-card">
                <h3>物品分类总数</h3>
                <p className="stat-number">{stats.itemCategoryCount}</p>
              </div>
            )}
          </div>
        ) : (
          <p>加载中...</p>
        )}
      </div>
      
      {/* 角色基础信息管理部分 */}
      <div className="data-container">
        <div className="data-header">
          <h2>角色基础信息管理</h2>
          <div className="header-actions">
            <button 
              className="btn btn-primary" 
              onClick={() => setShowCreateForm(true)}
            >
              创建新角色
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={fetchCharacters}
            >
              刷新列表
            </button>
          </div>
        </div>
        
        {/* 搜索功能 */}
        <div className="search-container">
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
            className="search-select"
          >
            <option value="name">按姓名搜索</option>
            <option value="dao_hao">按道号搜索</option>
            <option value="id">按ID搜索</option>
          </select>
          <input
            type="text"
            placeholder="输入搜索关键词..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button 
            className="btn btn-primary" 
            onClick={searchCharacters}
          >
            搜索
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}
          >
            清除
          </button>
        </div>
        
        {/* 创建角色表单 */}
        {showCreateForm && (
          <div className="create-form">
            <h3>创建新角色</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>姓名 *</label>
                <input
                  type="text"
                  value={newCharacter.character_name || ''}
                  onChange={(e) => setNewCharacter({...newCharacter, character_name: e.target.value})}
                  placeholder="输入角色姓名"
                  required
                />
              </div>
              <div className="form-group">
                <label>道号</label>
                <input
                  type="text"
                  value={newCharacter.character_dao_hao || ''}
                  onChange={(e) => setNewCharacter({...newCharacter, character_dao_hao: e.target.value})}
                  placeholder="输入道号"
                />
              </div>
              <div className="form-group">
                <label>性别</label>
                <select
                  value={newCharacter.character_gender || '其他'}
                  onChange={(e) => setNewCharacter({...newCharacter, character_gender: e.target.value as '男' | '女' | '其他'})}
                >
                  <option value="其他">其他</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
              <div className="form-group">
                <label>出生日期</label>
                <input
                  type="date"
                  value={newCharacter.character_birthday || ''}
                  onChange={(e) => setNewCharacter({...newCharacter, character_birthday: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>境界等级</label>
                <input
                  type="number"
                  min="0"
                  max="63"
                  value={newCharacter.character_realm_Level || 1}
                  onChange={(e) => setNewCharacter({...newCharacter, character_realm_Level: parseInt(e.target.value) || 1})}
                />
              </div>
              <div className="form-group">
                <label>修炼状态</label>
                <select
                  value={newCharacter.cultivatingState || '未修练'}
                  onChange={(e) => setNewCharacter({...newCharacter, cultivatingState: e.target.value as any})}
                >
                  <option value="未修练">未修练</option>
                  <option value="正在修炼">正在修炼</option>
                  <option value="闭关中">闭关中</option>
                  <option value="受伤修炼中">受伤修炼中</option>
                  <option value="顿悟中">顿悟中</option>
                </select>
              </div>
              <div className="form-group">
                <label>体质属性</label>
                <select
                  value={newCharacter.character_physicalAttributes || ''}
                  onChange={(e) => setNewCharacter({...newCharacter, character_physicalAttributes: e.target.value as any})}
                >
                  <option value="">无</option>
                  <option value="金">金</option>
                  <option value="木">木</option>
                  <option value="水">水</option>
                  <option value="火">火</option>
                  <option value="土">土</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button 
                className="btn btn-primary" 
                onClick={createCharacter}
                disabled={!newCharacter.character_name || !newCharacter.character_realm_Level || newCharacter.character_realm_Level < 1}
              >
                创建角色
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowCreateForm(false)}
              >
                取消
              </button>
            </div>
          </div>
        )}
        
        {/* 选中角色信息卡片 */}
        {selectedCharacterId && (() => {
          const selectedCharacter = (searchResults.length > 0 ? searchResults : characters)
            .find(char => char.character_uuid === selectedCharacterId);
          
          if (!selectedCharacter) return null;
          
          // 获取角色相关数据
          const selectedAffinities = characterAffinities.find(a => a.character_uuid === selectedCharacterId);
          const selectedStrength = characterStrength.find(s => s.character_uuid === selectedCharacterId);
          const selectedBodyTypes = characterBodyTypes.find(b => b.character_uuid === selectedCharacterId);
          const selectedSkills = characterSkills.find(s => s.character_uuid === selectedCharacterId);
          const selectedWeapons = characterWeapons.find(w => w.character_uuid === selectedCharacterId);
          const selectedCurrency = characterCurrency.find(c => c.character_uuid === selectedCharacterId);
          const selectedItems = characterItems.filter(i => i.character_uuid === selectedCharacterId);
          
          return (
            <div className="selected-character-card">
              <div className="character-card-header">
                <h3 className="character-card-title">选中角色详细信息</h3>
                <button 
                  className="btn-deselect"
                  onClick={() => setSelectedCharacterId('')}
                >
                  取消选择
                </button>
              </div>
              
              <div className="character-card-content">
                {/* 基础信息 */}
                <div className="character-info-section">
                  <h4>基础信息</h4>
                  <div className="character-info-item">
                    <span className="character-info-label">角色ID:</span>
                    <span className="character-info-value">{selectedCharacter.character_uuid}</span>
                  </div>
                  <div className="character-info-item">
                    <span className="character-info-label">姓名:</span>
                    <span className="character-info-value">{selectedCharacter.character_name}</span>
                  </div>
                  <div className="character-info-item">
                    <span className="character-info-label">道号:</span>
                    <span className="character-info-value">{selectedCharacter.character_dao_hao || '无'}</span>
                  </div>
                  <div className="character-info-item">
                    <span className="character-info-label">性别:</span>
                    <span className="character-info-value">{selectedCharacter.character_gender}</span>
                  </div>
                  <div className="character-info-item">
                    <span className="character-info-label">出生日期:</span>
                    <span className="character-info-value">
                      {selectedCharacter.character_birthday 
                        ? new Date(selectedCharacter.character_birthday).toLocaleDateString() 
                        : '未设置'
                      }
                    </span>
                  </div>
                  <div className="character-info-item">
                    <span className="character-info-label">体质属性:</span>
                    <span className="character-info-value">{selectedCharacter.character_physicalAttributes || '无'}</span>
                  </div>
                </div>
                
                {/* 修炼信息 */}
                <div className="character-info-section">
                  <h4>修炼信息</h4>
                  <div className="character-info-item">
                    <span className="character-info-label">境界等级:</span>
                    <span className="character-info-value">{selectedCharacter.character_realm_Level}</span>
                  </div>
                  <div className="character-info-item">
                    <span className="character-info-label">修炼状态:</span>
                    <span className="character-info-value">{selectedCharacter.cultivatingState}</span>
                  </div>
                  <div className="character-info-item">
                    <span className="character-info-label">修炼值:</span>
                    <span className="character-info-value">{selectedCharacter.cultivationValue || 0}</span>
                  </div>
                  <div className="character-info-item">
                    <span className="character-info-label">修炼上限:</span>
                    <span className="character-info-value">
                      {(selectedCharacter.cultivationLimitBase || 0) + (selectedCharacter.cultivationLimitAdd || 0)}
                    </span>
                  </div>
                  <div className="character-info-item">
                    <span className="character-info-label">修炼速度:</span>
                    <span className="character-info-value">
                      {(selectedCharacter.cultivationSpeedBase || 0) + (selectedCharacter.cultivationSpeedAdd || 0)}
                    </span>
                  </div>
                  <div className="character-info-item">
                    <span className="character-info-label">突破状态:</span>
                    <span className="character-info-value">
                      {selectedCharacter.breakThroughState ? '可突破' : '不可突破'}
                    </span>
                  </div>
                  <div className="character-info-item">
                    <span className="character-info-label">突破失败次数:</span>
                    <span className="character-info-value">{selectedCharacter.breakThroughFailNumb || 0}</span>
                  </div>
                </div>
                
                {/* 亲和度信息 */}
                <div className="character-info-section">
                  <h4>亲和度信息</h4>
                  {selectedAffinities ? (
                    <>
                      <div className="character-info-item">
                        <span className="character-info-label">总亲和度:</span>
                        <span className="character-info-value">{selectedAffinities.total_affinity}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">金属性:</span>
                        <span className="character-info-value">{selectedAffinities.metal_affinity}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">木属性:</span>
                        <span className="character-info-value">{selectedAffinities.wood_affinity}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">水属性:</span>
                        <span className="character-info-value">{selectedAffinities.water_affinity}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">火属性:</span>
                        <span className="character-info-value">{selectedAffinities.fire_affinity}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">土属性:</span>
                        <span className="character-info-value">{selectedAffinities.earth_affinity}</span>
                      </div>
                    </>
                  ) : (
                    <div className="character-info-item">
                      <span className="character-info-label">亲和度数据:</span>
                      <span className="character-info-value">暂无数据</span>
                    </div>
                  )}
                </div>
                
                {/* 力量信息 */}
                <div className="character-info-section">
                  <h4>力量信息</h4>
                  {selectedStrength ? (
                    <>
                      <div className="character-info-item">
                        <span className="character-info-label">体质强度:</span>
                        <span className="character-info-value">{selectedStrength.physical_strength}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">灵力强度:</span>
                        <span className="character-info-value">{selectedStrength.spiritual_strength}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">灵魂强度:</span>
                        <span className="character-info-value">{selectedStrength.soul_strength}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">当前血量:</span>
                        <span className="character-info-value">{selectedStrength.blood_current}/{selectedStrength.blood_max}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">当前灵力:</span>
                        <span className="character-info-value">{selectedStrength.spiritual_current}/{selectedStrength.spiritual_max}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">当前精神:</span>
                        <span className="character-info-value">{selectedStrength.mental_current}/{selectedStrength.mental_max}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">战斗力:</span>
                        <span className="character-info-value">{selectedStrength.combat_power}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">基础战斗力:</span>
                        <span className="character-info-value">{selectedStrength.base_combat_power}</span>
                      </div>
                    </>
                  ) : (
                    <div className="character-info-item">
                      <span className="character-info-label">力量数据:</span>
                      <span className="character-info-value">暂无数据</span>
                    </div>
                  )}
                </div>
                
                {/* 体质信息 */}
                <div className="character-info-section">
                  <h4>体质信息</h4>
                  {selectedBodyTypes ? (
                    [1, 2, 3, 4, 5].map(i => {
                      const bodyTypeId = selectedBodyTypes[`body_type_${i}_id` as keyof CharacterBodyTypes];
                      const bodyTypeData = bodyTypes.find(b => b.body_type_id === bodyTypeId);
                      return bodyTypeId ? (
                        <div key={i} className="character-info-item">
                          <span className="character-info-label">体质{i}:</span>
                          <span className="character-info-value">
                            {bodyTypeData ? `${bodyTypeData.body_type_name} (体质+${bodyTypeData.physical_bonus}, 灵力+${bodyTypeData.spiritual_bonus}, 灵魂+${bodyTypeData.soul_bonus})` : '未知'}
                          </span>
                        </div>
                      ) : null;
                    }).filter(Boolean).length > 0 ? 
                      [1, 2, 3, 4, 5].map(i => {
                        const bodyTypeId = selectedBodyTypes[`body_type_${i}_id` as keyof CharacterBodyTypes];
                        const bodyTypeData = bodyTypes.find(b => b.body_type_id === bodyTypeId);
                        return bodyTypeId ? (
                          <div key={i} className="character-info-item">
                            <span className="character-info-label">体质{i}:</span>
                            <span className="character-info-value">
                              {bodyTypeData ? `${bodyTypeData.body_type_name} (体质+${bodyTypeData.physical_bonus}, 灵力+${bodyTypeData.spiritual_bonus}, 灵魂+${bodyTypeData.soul_bonus})` : '未知'}
                            </span>
                          </div>
                        ) : null;
                      }) : 
                      <div className="character-info-item">
                        <span className="character-info-value">暂无数据</span>
                      </div>
                  ) : (
                    <div className="character-info-item">
                      <span className="character-info-value">暂无数据</span>
                    </div>
                  )}
                </div>
                
                {/* 技能信息 */}
                <div className="character-info-section">
                  <h4>技能信息</h4>
                  {selectedSkills ? (
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
                      const skillId = selectedSkills[`skill_${i}_id` as keyof CharacterSkills];
                      const skillData = skills.find(s => s.skill_id === skillId);
                      return skillId ? (
                        <div key={i} className="character-info-item">
                          <span className="character-info-label">技能{i}:</span>
                          <span className="character-info-value">
                            {skillData ? `${skillData.skill_name} (${skillData.skill_type})` : '未知'}
                          </span>
                        </div>
                      ) : null;
                    })
                  ) : (
                    <div className="character-info-item">
                      <span className="character-info-label">技能数据:</span>
                      <span className="character-info-value">暂无数据</span>
                    </div>
                  )}
                </div>
                
                {/* 武器信息 */}
                <div className="character-info-section">
                  <h4>武器信息</h4>
                  {selectedWeapons ? (
                    [1, 2, 3, 4, 5].map(i => {
                      const weaponId = selectedWeapons[`weapon_${i}_id` as keyof CharacterWeapons];
                      const weaponData = weapons.find(w => w.weapon_id === weaponId);
                      return weaponId ? (
                        <div key={i} className="character-info-item">
                          <span className="character-info-label">武器{i}:</span>
                          <span className="character-info-value">
                            {weaponData ? `${weaponData.weapon_name} (${weaponData.weapon_type})` : '未知'}
                          </span>
                        </div>
                      ) : null;
                    })
                  ) : (
                    <div className="character-info-item">
                      <span className="character-info-label">武器数据:</span>
                      <span className="character-info-value">暂无数据</span>
                    </div>
                  )}
                </div>
                
                {/* 货币信息 */}
                <div className="character-info-section">
                  <h4>货币信息</h4>
                  {selectedCurrency ? (
                    <>
                      <div className="character-info-item">
                        <span className="character-info-label">铜币:</span>
                        <span className="character-info-value">{selectedCurrency.copper_coin}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">银币:</span>
                        <span className="character-info-value">{selectedCurrency.silver_coin}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">金币:</span>
                        <span className="character-info-value">{selectedCurrency.gold_coin}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">下品灵石:</span>
                        <span className="character-info-value">{selectedCurrency.low_spirit_stone}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">中品灵石:</span>
                        <span className="character-info-value">{selectedCurrency.medium_spirit_stone}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">上品灵石:</span>
                        <span className="character-info-value">{selectedCurrency.high_spirit_stone}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">宗门贡献:</span>
                        <span className="character-info-value">{selectedCurrency.zongmen_contribution}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">区域贡献:</span>
                        <span className="character-info-value">{selectedCurrency.region_contribution}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">世界贡献:</span>
                        <span className="character-info-value">{selectedCurrency.world_contribution}</span>
                      </div>
                    </>
                  ) : (
                    <div className="character-info-item">
                      <span className="character-info-label">货币数据:</span>
                      <span className="character-info-value">暂无数据</span>
                    </div>
                  )}
                </div>
                
                {/* 物品信息 */}
                <div className="character-info-section">
                  <h4>物品信息</h4>
                  {selectedItems && selectedItems.length > 0 ? (
                    <>
                      <div className="character-info-item">
                        <span className="character-info-label">物品总数:</span>
                        <span className="character-info-value">{selectedItems.length}件</span>
                      </div>
                      {selectedItems.slice(0, 10).map((item, index) => {
                        const itemData = items.find(i => i.item_id === item.item_id);
                        return (
                          <div key={item.character_items_id} className="character-info-item">
                            <span className="character-info-label">物品{index + 1}:</span>
                            <span className="character-info-value">
                              {itemData ? `${itemData.item_name} (${itemData.item_type})` : '未知'} 
                              - 数量: {item.item_count}, 等级: {item.item_level}
                              {item.is_equipped ? ', 已装备' : ''}
                              {item.slot_position ? `, 位置: ${item.slot_position}` : ''}
                              {item.durability ? `, 耐久: ${item.durability}` : ''}
                            </span>
                          </div>
                        );
                      })}
                      {selectedItems.length > 10 && (
                        <div className="character-info-item">
                          <span className="character-info-label">...</span>
                          <span className="character-info-value">还有 {selectedItems.length - 10} 件物品</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="character-info-item">
                      <span className="character-info-label">物品数据:</span>
                      <span className="character-info-value">暂无数据</span>
                    </div>
                  )}
                </div>
                
                {/* 宗门信息 */}
                <div className="character-info-section">
                  <h4>宗门信息</h4>
                  <div className="character-info-item">
                    <span className="character-info-label">宗门状态:</span>
                    <span className="character-info-value">{selectedCharacter.zongMenJoinBool ? '已加入' : '未加入'}</span>
                  </div>
                  {selectedCharacter.zongMenJoinBool && (
                    <>
                      <div className="character-info-item">
                        <span className="character-info-label">宗门ID:</span>
                        <span className="character-info-value">{selectedCharacter.zongMen_id || '未知'}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">加入日期:</span>
                        <span className="character-info-value">
                          {selectedCharacter.zongMenJoinDate 
                            ? new Date(selectedCharacter.zongMenJoinDate).toLocaleDateString() 
                            : '未知'
                          }
                        </span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">职位等级:</span>
                        <span className="character-info-value">{selectedCharacter.title_1_id || '无'}</span>
                      </div>
                      <div className="character-info-item">
                        <span className="character-info-label">成就等级:</span>
                        <span className="character-info-value">{selectedCharacter.title_2_id || '无'}</span>
                      </div>
                    </>
                  )}
                </div>
                
                {/* 时间信息 */}
                <div className="character-info-section">
                  <h4>时间信息</h4>
                  <div className="character-info-item">
                    <span className="character-info-label">创建时间:</span>
                    <span className="character-info-value">
                      {selectedCharacter.create_time 
                        ? new Date(selectedCharacter.create_time).toLocaleString() 
                        : '未知'
                      }
                    </span>
                  </div>
                  <div className="character-info-item">
                    <span className="character-info-label">更新时间:</span>
                    <span className="character-info-value">
                      {selectedCharacter.update_time 
                        ? new Date(selectedCharacter.update_time).toLocaleString() 
                        : '未更新'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
        

        
        {/* 角色列表 */}
        <div className={`data-table ${isResizing ? 'resizing' : ''}`}>
          <table>
            <thead>
              <tr>
                {[
                  {key: 'character_uuid', label: 'ID'},
                  {key: 'character_name', label: '姓名'},
                  {key: 'character_dao_hao', label: '道号'},
                  {key: 'character_gender', label: '性别'},
                  {key: 'character_birthday', label: '出生日期'},
                  {key: 'character_realm_Level', label: '境界等级'},
                  {key: 'cultivatingState', label: '修炼状态'},
                  {key: 'character_physicalAttributes', label: '体质属性'},
                  {key: 'zongMenJoinBool', label: '宗门状态'},
                  {key: 'create_time', label: '创建时间'}
                ].map((column, index) => (
                  <th key={column.key} className="resizable-th">
                    <div className="th-content">
                      <span>{column.label}</span>
                      {index < 9 && (
                        <div 
                          className="column-resizer"
                          onMouseDown={(e) => handleColumnResize(e, index)}
                        />
                      )}
                    </div>
                  </th>
                ))}
                <th className="resizable-th">
                  <div className="th-content">
                    <span>操作</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {(searchResults.length > 0 ? searchResults : characters).map((character) => (
                <tr 
                  key={character.character_uuid}
                  className={selectedCharacterId === character.character_uuid ? 'selected' : ''}
                >
                  <td>{character.character_uuid}</td>
                  <td>{character.character_name}</td>
                  <td>{character.character_dao_hao || '-'}</td>
                  <td>{character.character_gender}</td>
                  <td>{character.character_birthday ? new Date(character.character_birthday).toLocaleDateString() : '-'}</td>
                  <td>{character.character_realm_Level}</td>
                  <td>{character.cultivatingState}</td>
                  <td>{character.character_physicalAttributes || '-'}</td>
                  <td>{character.zongMenJoinBool ? '已加入' : '未加入'}</td>
                  <td>{character.create_time ? new Date(character.create_time).toLocaleString() : '-'}</td>
                  <td>
                    <button 
                      className={`btn btn-sm ${selectedCharacterId === character.character_uuid ? 'btn-success' : 'btn-primary'}`}
                      onClick={() => setSelectedCharacterId(character.character_uuid)}
                    >
                      {selectedCharacterId === character.character_uuid ? '已选中' : '选择'}
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => deleteCharacter(character.character_uuid)}
                      style={{marginLeft: '5px'}}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /**
   * 渲染角色基础信息
   */
  const renderCharacters = () => (
    <div className="data-container">
      <div className="data-header">
        <h2>角色基础信息管理</h2>
        <div className="header-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowCreateForm(true)}
          >
            创建新角色
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={fetchCharacters}
          >
            刷新列表
          </button>
        </div>
      </div>
      
      {/* 搜索功能 */}
      <div className="search-container">
        <select 
          value={searchType} 
          onChange={(e) => setSearchType(e.target.value)}
          className="search-select"
        >
          <option value="name">按姓名搜索</option>
          <option value="dao_hao">按道号搜索</option>
          <option value="id">按ID搜索</option>
        </select>
        <input
          type="text"
          placeholder="输入搜索关键词..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button 
          className="btn btn-primary" 
          onClick={searchCharacters}
        >
          搜索
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => {
            setSearchQuery('');
            setSearchResults([]);
          }}
        >
          清除
        </button>
      </div>
      
      {/* 创建角色表单 */}
      {showCreateForm && (
        <div className="create-form">
          <h3>创建新角色</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>姓名 *</label>
              <input
                type="text"
                value={newCharacter.character_name || ''}
                onChange={(e) => setNewCharacter({...newCharacter, character_name: e.target.value})}
                placeholder="输入角色姓名"
                required
              />
            </div>
            <div className="form-group">
              <label>道号</label>
              <input
                type="text"
                value={newCharacter.character_dao_hao || ''}
                onChange={(e) => setNewCharacter({...newCharacter, character_dao_hao: e.target.value})}
                placeholder="输入道号"
              />
            </div>
            <div className="form-group">
              <label>性别</label>
              <select
                value={newCharacter.character_gender || '其他'}
                onChange={(e) => setNewCharacter({...newCharacter, character_gender: e.target.value as '男' | '女' | '其他'})}
              >
                <option value="其他">其他</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div className="form-group">
              <label>出生日期</label>
              <input
                type="date"
                value={newCharacter.character_birthday || ''}
                onChange={(e) => setNewCharacter({...newCharacter, character_birthday: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>境界等级</label>
              <input
                type="number"
                min="0"
                max="63"
                value={newCharacter.character_realm_Level || 1}
                onChange={(e) => setNewCharacter({...newCharacter, character_realm_Level: parseInt(e.target.value) || 1})}
              />
            </div>
            <div className="form-group">
              <label>修炼状态</label>
              <select
                value={newCharacter.cultivatingState || '未修练'}
                onChange={(e) => setNewCharacter({...newCharacter, cultivatingState: e.target.value as any})}
              >
                <option value="未修练">未修练</option>
                <option value="正在修炼">正在修炼</option>
                <option value="闭关中">闭关中</option>
                <option value="受伤修炼中">受伤修炼中</option>
                <option value="顿悟中">顿悟中</option>
              </select>
            </div>
            <div className="form-group">
              <label>体质属性</label>
              <select
                value={newCharacter.character_physicalAttributes || ''}
                onChange={(e) => setNewCharacter({...newCharacter, character_physicalAttributes: e.target.value as any})}
              >
                <option value="">无</option>
                <option value="金">金</option>
                <option value="木">木</option>
                <option value="水">水</option>
                <option value="火">火</option>
                <option value="土">土</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button 
              className="btn btn-primary" 
              onClick={createCharacter}
              disabled={!newCharacter.character_name || !newCharacter.character_realm_Level || newCharacter.character_realm_Level < 1}
            >
              创建角色
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowCreateForm(false)}
            >
              取消
            </button>
          </div>
        </div>
      )}
      
      {/* 角色列表 */}
      <div className={`data-table ${isResizing ? 'resizing' : ''}`}>
        <table>
          <thead>
            <tr>
              {[
                {key: 'character_uuid', label: 'ID'},
                {key: 'character_name', label: '姓名'},
                {key: 'character_dao_hao', label: '道号'},
                {key: 'character_gender', label: '性别'},
                {key: 'character_birthday', label: '出生日期'},
                {key: 'character_realm_Level', label: '境界等级'},
                {key: 'cultivatingState', label: '修炼状态'},
                {key: 'character_physicalAttributes', label: '体质属性'},
                {key: 'zongMenJoinBool', label: '宗门状态'},
                {key: 'create_time', label: '创建时间'}
              ].map((column, index) => (
                <th key={column.key} className="resizable-th">
                  <div className="th-content">
                    <span>{column.label}</span>
                    {index < 9 && (
                      <div 
                        className="column-resizer"
                        onMouseDown={(e) => handleColumnResize(e, index)}
                      />
                    )}
                  </div>
                </th>
              ))}
              <th className="resizable-th">
                <div className="th-content">
                  <span>操作</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {(searchResults.length > 0 ? searchResults : characters).map((character) => (
              <tr 
                key={character.character_uuid}
                className={selectedCharacterId === character.character_uuid ? 'selected' : ''}
              >
                <td>{character.character_uuid}</td>
                <td>{character.character_name}</td>
                <td>{character.character_dao_hao || '-'}</td>
                <td>{character.character_gender}</td>
                <td>{character.character_birthday ? new Date(character.character_birthday).toLocaleDateString() : '-'}</td>
                <td>{character.character_realm_Level}</td>
                <td>{character.cultivatingState}</td>
                <td>{character.character_physicalAttributes || '-'}</td>
                <td>{character.zongMenJoinBool ? '已加入' : '未加入'}</td>
                <td>{character.create_time ? new Date(character.create_time).toLocaleString() : '-'}</td>
                <td>
                  <button 
                    className={`btn btn-sm ${selectedCharacterId === character.character_uuid ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => setSelectedCharacterId(character.character_uuid)}
                  >
                    {selectedCharacterId === character.character_uuid ? '已选中' : '选择'}
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => deleteCharacter(character.character_uuid)}
                    style={{marginLeft: '5px'}}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(searchResults.length > 0 ? searchResults : characters).length === 0 && (
          <p className="no-data">暂无数据</p>
        )}
      </div>
    </div>
  );

  /**
   * 渲染通用数据表格
   */
  const renderDataTable = (title: string, data: any[], columns: {key: string, label: string}[]) => {
    // 检查是否为角色关联数据
    const isCharacterRelatedData = [
      'character-affinities',
      'character-strength', 
      'character-body-types',
      'character-skills',
      'character-weapons',
      'character-currency'
    ].includes(activeTab);

    // 检查是否为静态数据（需要CRUD操作）
    const isStaticData = [
      'realms',
      'skills', 
      'weapons',
      'items',
      'body-types',
      'zongmen',
      'achievements',
      'item-categories'
    ].includes(activeTab);

    // 获取选中角色信息
    const selectedCharacter = selectedCharacterId ? 
      characters.find(char => char.character_uuid === selectedCharacterId) : null;

    /**
     * 处理编辑操作
     */
    const handleEdit = async (item: any) => {
      try {
        // 根据数据类型确定更新的API端点和ID字段
        let endpoint = '';
        let idField = '';
        
        switch (activeTab) {
          case 'realms':
            // 显示境界编辑表单
            setEditingRealm(item);
            setRealmFormData({ ...item });
            setShowRealmForm(true);
            return;
          case 'skills':
            endpoint = '/api/database/skills';
            idField = 'skill_id';
            break;
          case 'weapons':
            endpoint = '/api/database/weapons';
            idField = 'weapon_id';
            break;
          case 'items':
            endpoint = '/api/database/items';
            idField = 'item_id';
            break;
          case 'body-types':
            endpoint = '/api/database/body-types';
            idField = 'body_type_id';
            break;
          case 'zongmen':
            endpoint = '/api/database/zongmen';
            idField = 'zongmen_id';
            break;
          case 'achievements':
            endpoint = '/api/database/achievements';
            idField = 'achievement_id';
            break;
          case 'item-categories':
            endpoint = '/api/database/item-categories';
            idField = 'category_id';
            break;
          default:
            throw new Error('不支持的数据类型');
        }
        
        // 简单的编辑实现：弹出提示框让用户输入新值
        const newName = prompt(`请输入新的名称:`, item[Object.keys(item).find(key => key.includes('name')) || '']);
        if (newName === null) return; // 用户取消
        
        const updateData = { ...item };
        const nameField = Object.keys(item).find(key => key.includes('name'));
        if (nameField) {
          updateData[nameField] = newName;
        }
        
        const itemId = item[idField];
        await apiCall(`${endpoint}/${itemId}`, {
          method: 'PUT',
          body: JSON.stringify(updateData)
        });
        
        // 更新成功后刷新数据
        switch (activeTab) {
          case 'skills':
            fetchSkills();
            break;
          case 'weapons':
            fetchWeapons();
            break;
          case 'items':
            fetchItems();
            break;
          case 'body-types':
            fetchBodyTypes();
            break;
          case 'zongmen':
            fetchZongmen();
            break;
          case 'achievements':
            fetchAchievements();
            break;
          case 'item-categories':
            fetchItemCategories();
            break;
        }
        
        setError('');
      } catch (err) {
        setError(`编辑失败: ${err}`);
      }
    };

    /**
     * 处理删除操作
     */
    const handleDelete = async (item: any) => {
      if (!confirm('确定要删除这条记录吗？')) {
        return;
      }
      
      try {
        // 根据数据类型确定删除的API端点和ID字段
        let endpoint = '';
        let idField = '';
        
        switch (activeTab) {
          case 'realms':
            endpoint = '/api/database/realms';
            idField = 'realm_level';
            break;
          case 'skills':
            endpoint = '/api/database/skills';
            idField = 'skill_id';
            break;
          case 'weapons':
            endpoint = '/api/database/weapons';
            idField = 'weapon_id';
            break;
          case 'items':
            endpoint = '/api/database/items';
            idField = 'item_id';
            break;
          case 'body-types':
            endpoint = '/api/database/body-types';
            idField = 'body_type_id';
            break;
          case 'zongmen':
            endpoint = '/api/database/zongmen';
            idField = 'zongmen_id';
            break;
          case 'achievements':
            endpoint = '/api/database/achievements';
            idField = 'achievement_id';
            break;
          case 'item-categories':
            endpoint = '/api/database/item-categories';
            idField = 'category_id';
            break;
          default:
            throw new Error('不支持的数据类型');
        }
        
        const itemId = item[idField];
         await apiCall(`${endpoint}/${itemId}`, { method: 'DELETE' });
        
        // 删除成功后刷新数据
        switch (activeTab) {
          case 'realms':
            fetchRealms();
            break;
          case 'skills':
            fetchSkills();
            break;
          case 'weapons':
            fetchWeapons();
            break;
          case 'items':
            fetchItems();
            break;
          case 'body-types':
            fetchBodyTypes();
            break;
          case 'zongmen':
            fetchZongmen();
            break;
          case 'achievements':
            fetchAchievements();
            break;
          case 'item-categories':
            fetchItemCategories();
            break;
        }
        
        setError('');
      } catch (err) {
        setError(`删除失败: ${err}`);
      }
    };

    /**
     * 处理新增操作
     */
    const handleAdd = async () => {
      try {
        // 根据数据类型确定创建的API端点
        let endpoint = '';
        let newData: any = {};
        
        switch (activeTab) {
          case 'realms':
            // 显示境界新增表单
            setEditingRealm(null);
            setRealmFormData({
              realm_level: 1,
              stage_division: '初期',
              major_realm: '',
              minor_realm: '',
              stage: '初期',
              cultivation_start_value: 0,
              base_cultivation_limit: 100,
              base_cultivation_speed: 1,
              base_physical_strength: 10,
              base_spiritual_strength: 10,
              base_soul_strength: 10,
              base_spiritual_storage: 100,
              base_blood_storage: 100,
              base_mental_storage: 100,
              base_spiritual_recovery_rate: 1,
              base_blood_recovery_rate: 1,
              base_mental_recovery_rate: 1
            });
            setShowRealmForm(true);
            return;
          case 'skills':
            endpoint = '/api/database/skills';
            const skillName = prompt('请输入技能名称:');
            const skillType = prompt('请输入技能类型 (心法/功法/武技/秘术/禁术):');
            if (!skillName || !skillType) return;
            newData = {
              skill_id: `skill_${Date.now()}`,
              skill_name: skillName,
              skill_type: skillType,
              skill_realm_requirement: 1,
              skill_description: '',
              skill_power: 10
            };
            break;
          case 'weapons':
            endpoint = '/api/database/weapons';
            const weaponName = prompt('请输入武器名称:');
            const weaponType = prompt('请输入武器类型 (剑/刀/棍/枪/鞭/锤/扇/笛/其他):');
            if (!weaponName || !weaponType) return;
            newData = {
              weapon_id: `weapon_${Date.now()}`,
              weapon_name: weaponName,
              weapon_type: weaponType,
              weapon_realm_requirement: 1,
              weapon_description: '',
              weapon_attack_power: 10,
              weapon_special_effect: ''
            };
            break;
          case 'items':
            endpoint = '/api/database/items';
            const itemName = prompt('请输入物品名称:');
            const itemType = prompt('请输入物品类型 (武器/防具/饰品/消耗品/材料/任务物品/法宝):');
            if (!itemName || !itemType) return;
            newData = {
              item_id: `item_${Date.now()}`,
              item_name: itemName,
              item_type: itemType,
              quality: '普通',
              description: '',
              realm_requirement: 1,
              attack_power: 0,
              defense_power: 0,
              health_bonus: 0,
              mana_bonus: 0,
              special_effect: '',
              is_stackable: true,
              max_stack_size: 99,
              sell_price: 1,
              buy_price: 1,
              is_bind_on_pickup: false,
              is_bind_on_equip: false
            };
            break;
          case 'body-types':
            endpoint = '/api/database/body-types';
            const bodyTypeName = prompt('请输入体质名称:');
            if (!bodyTypeName) return;
            newData = {
              body_type_id: `body_type_${Date.now()}`,
              body_type_name: bodyTypeName,
              description: '',
              physical_bonus: 0,
              spiritual_bonus: 0,
              soul_bonus: 0
            };
            break;
          case 'zongmen':
            endpoint = '/api/database/zongmen';
            const zongmenName = prompt('请输入宗门名称:');
            if (!zongmenName) return;
            newData = {
              zongmen_id: `zongmen_${Date.now()}`,
              zongmen_name: zongmenName,
              description: '',
              founder: '',
              established_date: new Date().toISOString().split('T')[0],
              realm_level_required: 1
            };
            break;
          case 'achievements':
            endpoint = '/api/database/achievements';
            const achievementName = prompt('请输入成就名称:');
            const achievementType = prompt('请输入成就类型 (区域/世界/特殊):');
            if (!achievementName || !achievementType) return;
            newData = {
              achievement_id: `achievement_${Date.now()}`,
              achievement_name: achievementName,
              achievement_type: achievementType,
              description: '',
              reward: '',
              difficulty: 1
            };
            break;
          case 'item-categories':
            endpoint = '/api/database/item-categories';
            const categoryName = prompt('请输入分类名称:');
            if (!categoryName) return;
            newData = {
              category_id: Date.now(),
              category_name: categoryName,
              parent_category_id: null,
              description: ''
            };
            break;
          default:
            throw new Error('不支持的数据类型');
        }
        
        await apiCall(endpoint, {
          method: 'POST',
          body: JSON.stringify(newData)
        });
        
        // 创建成功后刷新数据
        switch (activeTab) {
          case 'skills':
            fetchSkills();
            break;
          case 'weapons':
            fetchWeapons();
            break;
          case 'items':
            fetchItems();
            break;
          case 'body-types':
            fetchBodyTypes();
            break;
          case 'zongmen':
            fetchZongmen();
            break;
          case 'achievements':
            fetchAchievements();
            break;
          case 'item-categories':
            fetchItemCategories();
            break;
        }
        
        setError('');
      } catch (err) {
        setError(`新增失败: ${err}`);
      }
    };

    return (
      <div className="data-container">
        <div className="data-header">
          <h2>{title}</h2>
          {isCharacterRelatedData && selectedCharacter && (
            <div className="selected-character-info">
              <span>当前角色: {selectedCharacter.character_name} ({selectedCharacter.character_uuid})</span>
            </div>
          )}
          <div className="header-buttons">
            {isStaticData && (
              <button 
                className="btn btn-primary" 
                onClick={handleAdd}
              >
                新增{title.replace('数据', '')}
              </button>
            )}
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                // 根据当前标签重新获取数据
                switch (activeTab) {
                  case 'character-affinities':
                  case 'character-strength':
                  case 'character-body-types':
                  case 'character-skills':
                  case 'character-weapons':
                  case 'character-currency':
                    if (selectedCharacterId) {
                      loadCharacterRelatedData(selectedCharacterId, activeTab);
                    } else {
                      setError('请先选择一个角色来查看其关联数据');
                    }
                    break;
                  case 'character-items':
                    fetchCharacterItems();
                    break;
                  case 'realms':
                    fetchRealms();
                    break;
                  case 'skills':
                    fetchSkills();
                    break;
                  case 'weapons':
                    fetchWeapons();
                    break;
                  case 'items':
                    fetchItems();
                    break;
                  case 'body-types':
                    fetchBodyTypes();
                    break;
                  case 'zongmen':
                    fetchZongmen();
                    break;
                  case 'achievements':
                    fetchAchievements();
                    break;
                  case 'item-categories':
                    fetchItemCategories();
                    break;
                }
              }}
            >
              刷新列表
            </button>
          </div>
        </div>
      
      <div className={`data-table ${isResizing ? 'resizing' : ''}`}>
          <table>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={column.key} className="resizable-th">
                    <div className="th-content">
                      <span>{column.label}</span>
                      {index < columns.length - 1 && (
                        <div 
                          className="column-resizer"
                          onMouseDown={(e) => handleColumnResize(e, index)}
                        />
                      )}
                    </div>
                  </th>
                ))}
                {isStaticData && (
                  <th className="resizable-th">
                    <div className="th-content">
                      <span>操作</span>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {columns.map(column => (
                    <td key={column.key}>
                      {item[column.key] !== undefined && item[column.key] !== null 
                        ? String(item[column.key]) 
                        : '-'
                      }
                    </td>
                  ))}
                  {isStaticData && (
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEdit(item)}
                          title="编辑"
                        >
                          编辑
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item)}
                          title="删除"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <p className="no-data">暂无数据</p>
          )}
        </div>
      </div>
    );
  };

  /**
   * 渲染主要内容
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return renderStats();
      case 'characters':
        return renderCharacters();
      case 'character-affinities':
        return renderDataTable('角色亲和度数据', characterAffinities, [
          {key: 'character_uuid', label: '角色ID'},
          {key: 'total_affinity', label: '总亲和度'},
          {key: 'metal_affinity', label: '金属性'},
          {key: 'wood_affinity', label: '木属性'},
          {key: 'water_affinity', label: '水属性'},
          {key: 'fire_affinity', label: '火属性'},
          {key: 'earth_affinity', label: '土属性'}
        ]);
      case 'character-strength':
        return renderDataTable('角色力量数据', characterStrength, [
          {key: 'character_uuid', label: '角色ID'},
          {key: 'physical_strength', label: '体质强度'},
          {key: 'spiritual_strength', label: '灵力强度'},
          {key: 'soul_strength', label: '灵魂强度'},
          {key: 'combat_power', label: '战斗力'},
          {key: 'base_combat_power', label: '基础战斗力'}
        ]);
      case 'character-body-types':
        return renderDataTable('角色体质数据', characterBodyTypes, [
          {key: 'character_uuid', label: '角色ID'},
          {key: 'body_type_1_id', label: '体质1'},
          {key: 'body_type_2_id', label: '体质2'},
          {key: 'body_type_3_id', label: '体质3'},
          {key: 'body_type_4_id', label: '体质4'},
          {key: 'body_type_5_id', label: '体质5'}
        ]);
      case 'character-skills':
        return renderDataTable('角色技能数据', characterSkills, [
          {key: 'character_uuid', label: '角色ID'},
          {key: 'skill_1_id', label: '技能1'},
          {key: 'skill_2_id', label: '技能2'},
          {key: 'skill_3_id', label: '技能3'},
          {key: 'skill_4_id', label: '技能4'},
          {key: 'skill_5_id', label: '技能5'}
        ]);
      case 'character-weapons':
        return renderDataTable('角色武器数据', characterWeapons, [
          {key: 'character_uuid', label: '角色ID'},
          {key: 'weapon_1_id', label: '武器1'},
          {key: 'weapon_2_id', label: '武器2'},
          {key: 'weapon_3_id', label: '武器3'},
          {key: 'weapon_4_id', label: '武器4'},
          {key: 'weapon_5_id', label: '武器5'}
        ]);
      case 'character-currency':
        return renderDataTable('角色货币数据', characterCurrency, [
          {key: 'character_uuid', label: '角色ID'},
          {key: 'copper_coin', label: '铜币'},
          {key: 'silver_coin', label: '银币'},
          {key: 'gold_coin', label: '金币'},
          {key: 'low_spirit_stone', label: '下品灵石'},
          {key: 'medium_spirit_stone', label: '中品灵石'},
          {key: 'high_spirit_stone', label: '极品灵石'}
        ]);
      case 'character-items':
        return renderDataTable('角色物品数据', characterItems, [
          {key: 'character_items_id', label: 'ID'},
          {key: 'character_uuid', label: '角色ID'},
          {key: 'item_id', label: '物品ID'},
          {key: 'item_count', label: '数量'},
          {key: 'item_level', label: '等级'},
          {key: 'is_equipped', label: '是否装备'},
          {key: 'slot_position', label: '装备位置'},
          {key: 'durability', label: '耐久度'},
          {key: 'create_time', label: '创建时间'},
          {key: 'update_time', label: '更新时间'}
        ]);
      case 'realms':
        return (
          <div>
            {/* 境界表单 */}
            {showRealmForm && (
              <div className="realm-form-container">
                <div className="form-header">
                  <h3>{editingRealm ? '编辑境界' : '新增境界'}</h3>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleRealmFormCancel}
                  >
                    取消
                  </button>
                </div>
                <form onSubmit={handleRealmFormSubmit} className="realm-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>境界等级:</label>
                      <input
                        type="number"
                        value={realmFormData.realm_level}
                        onChange={(e) => setRealmFormData({...realmFormData, realm_level: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>阶段划分:</label>
                      <input
                        type="text"
                        value={realmFormData.stage_division}
                        onChange={(e) => setRealmFormData({...realmFormData, stage_division: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>大境界:</label>
                      <input
                        type="text"
                        value={realmFormData.major_realm}
                        onChange={(e) => setRealmFormData({...realmFormData, major_realm: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>小境界:</label>
                      <input
                        type="text"
                        value={realmFormData.minor_realm}
                        onChange={(e) => setRealmFormData({...realmFormData, minor_realm: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>阶段:</label>
                      <input
                        type="text"
                        value={realmFormData.stage}
                        onChange={(e) => setRealmFormData({...realmFormData, stage: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>修炼起始值:</label>
                      <input
                        type="number"
                        value={realmFormData.cultivation_start_value}
                        onChange={(e) => setRealmFormData({...realmFormData, cultivation_start_value: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>基础修炼上限:</label>
                      <input
                        type="number"
                        value={realmFormData.base_cultivation_limit}
                        onChange={(e) => setRealmFormData({...realmFormData, base_cultivation_limit: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>基础修炼速度:</label>
                      <input
                        type="number"
                        value={realmFormData.base_cultivation_speed}
                        onChange={(e) => setRealmFormData({...realmFormData, base_cultivation_speed: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>基础体质力量:</label>
                      <input
                        type="number"
                        value={realmFormData.base_physical_strength}
                        onChange={(e) => setRealmFormData({...realmFormData, base_physical_strength: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>基础灵力强度:</label>
                      <input
                        type="number"
                        value={realmFormData.base_spiritual_strength}
                        onChange={(e) => setRealmFormData({...realmFormData, base_spiritual_strength: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>基础灵魂强度:</label>
                      <input
                        type="number"
                        value={realmFormData.base_soul_strength}
                        onChange={(e) => setRealmFormData({...realmFormData, base_soul_strength: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>基础灵力储存:</label>
                      <input
                        type="number"
                        value={realmFormData.base_spiritual_storage}
                        onChange={(e) => setRealmFormData({...realmFormData, base_spiritual_storage: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>基础血气储存:</label>
                      <input
                        type="number"
                        value={realmFormData.base_blood_storage}
                        onChange={(e) => setRealmFormData({...realmFormData, base_blood_storage: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>基础精神储存:</label>
                      <input
                        type="number"
                        value={realmFormData.base_mental_storage}
                        onChange={(e) => setRealmFormData({...realmFormData, base_mental_storage: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>基础灵力恢复率:</label>
                      <input
                        type="number"
                        value={realmFormData.base_spiritual_recovery_rate}
                        onChange={(e) => setRealmFormData({...realmFormData, base_spiritual_recovery_rate: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>基础血气恢复率:</label>
                      <input
                        type="number"
                        value={realmFormData.base_blood_recovery_rate}
                        onChange={(e) => setRealmFormData({...realmFormData, base_blood_recovery_rate: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>基础精神恢复率:</label>
                      <input
                        type="number"
                        value={realmFormData.base_mental_recovery_rate}
                        onChange={(e) => setRealmFormData({...realmFormData, base_mental_recovery_rate: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      {editingRealm ? '更新' : '创建'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={handleRealmFormCancel}
                    >
                      取消
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* 境界数据表格 */}
            {renderDataTable('境界数据', realms, [
              {key: 'realm_level', label: '境界等级'},
              {key: 'stage_division', label: '阶段划分'},
              {key: 'major_realm', label: '大境界'},
              {key: 'minor_realm', label: '小境界'},
              {key: 'stage', label: '阶段'},
              {key: 'base_cultivation_limit', label: '基础修炼上限'}
            ])}
          </div>
        );
      case 'skills':
        return renderDataTable('技能数据', skills, [
          {key: 'skill_id', label: '技能ID'},
          {key: 'skill_name', label: '技能名称'},
          {key: 'skill_type', label: '技能类型'},
          {key: 'skill_realm_requirement', label: '境界要求'},
          {key: 'skill_power', label: '威力'},
          {key: 'skill_description', label: '描述'}
        ]);
      case 'weapons':
        return renderDataTable('武器数据', weapons, [
          {key: 'weapon_id', label: '武器ID'},
          {key: 'weapon_name', label: '武器名称'},
          {key: 'weapon_type', label: '武器类型'},
          {key: 'weapon_realm_requirement', label: '境界要求'},
          {key: 'weapon_attack_power', label: '攻击力'},
          {key: 'weapon_description', label: '描述'}
        ]);
      case 'items':
        return renderDataTable('物品数据', items, [
          {key: 'item_id', label: '物品ID'},
          {key: 'item_name', label: '物品名称'},
          {key: 'item_type', label: '物品类型'},
          {key: 'quality', label: '品质'},
          {key: 'sell_price', label: '售价'},
          {key: 'description', label: '描述'}
        ]);
      case 'body-types':
        return renderDataTable('体质数据', bodyTypes, [
          {key: 'body_type_id', label: '体质ID'},
          {key: 'body_type_name', label: '体质名称'},
          {key: 'physical_bonus', label: '体质加成'},
          {key: 'spiritual_bonus', label: '灵力加成'},
          {key: 'soul_bonus', label: '灵魂加成'},
          {key: 'description', label: '描述'}
        ]);
      case 'zongmen':
        return renderDataTable('宗门数据', zongmen, [
          {key: 'zongmen_id', label: '宗门ID'},
          {key: 'zongmen_name', label: '宗门名称'},
          {key: 'founder', label: '创始人'},
          {key: 'established_date', label: '创建日期'},
          {key: 'realm_level_required', label: '加入要求'},
          {key: 'description', label: '描述'}
        ]);
      case 'achievements':
        return renderDataTable('成就数据', achievements, [
          {key: 'achievement_id', label: '成就ID'},
          {key: 'achievement_name', label: '成就名称'},
          {key: 'achievement_type', label: '成就类型'},
          {key: 'difficulty', label: '难度'},
          {key: 'reward', label: '奖励'},
          {key: 'description', label: '描述'}
        ]);
      case 'item-categories':
        return renderDataTable('物品分类', itemCategories, [
          {key: 'category_id', label: '分类ID'},
          {key: 'category_name', label: '分类名称'},
          {key: 'parent_category_id', label: '父分类ID'},
          {key: 'description', label: '描述'}
        ]);
      default:
        return <div>请选择一个标签页</div>;
    }
  };

  return (
    <div className="database-management-page">
      <div className="page-header">
        <h1>数据库管理系统</h1>
        <p>基于新数据库结构的完整管理界面</p>
      </div>
      
      {/* 消息提示 */}
      {error && (
        <div className="message error">
          <span>{error}</span>
          <button onClick={clearMessages}>×</button>
        </div>
      )}
      
      {success && (
        <div className="message success">
          <span>{success}</span>
          <button onClick={clearMessages}>×</button>
        </div>
      )}
      
      {/* 标签页导航 */}
      <div className="tab-navigation">
        <div className="tab-group">
          <h3>概览</h3>
          <button 
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            统计信息
          </button>
        </div>
        
        <div className="tab-group">
          <h3>角色相关</h3>
          <button 
            className={`tab-button ${activeTab === 'characters' ? 'active' : ''}`}
            onClick={() => setActiveTab('characters')}
          >
            角色基础信息
          </button>
          <button 
            className={`tab-button ${activeTab === 'character-affinities' ? 'active' : ''}`}
            onClick={() => setActiveTab('character-affinities')}
          >
            角色亲和度
          </button>
          <button 
            className={`tab-button ${activeTab === 'character-strength' ? 'active' : ''}`}
            onClick={() => setActiveTab('character-strength')}
          >
            角色力量
          </button>
          <button 
            className={`tab-button ${activeTab === 'character-body-types' ? 'active' : ''}`}
            onClick={() => setActiveTab('character-body-types')}
          >
            角色体质
          </button>
          <button 
            className={`tab-button ${activeTab === 'character-skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('character-skills')}
          >
            角色技能
          </button>
          <button 
            className={`tab-button ${activeTab === 'character-weapons' ? 'active' : ''}`}
            onClick={() => setActiveTab('character-weapons')}
          >
            角色武器
          </button>
          <button 
            className={`tab-button ${activeTab === 'character-currency' ? 'active' : ''}`}
            onClick={() => setActiveTab('character-currency')}
          >
            角色货币
          </button>
          <button 
            className={`tab-button ${activeTab === 'character-items' ? 'active' : ''}`}
            onClick={() => setActiveTab('character-items')}
          >
            角色物品
          </button>
        </div>
        
        <div className="tab-group">
          <h3>基础数据</h3>
          <button 
            className={`tab-button ${activeTab === 'realms' ? 'active' : ''}`}
            onClick={() => setActiveTab('realms')}
          >
            境界数据
          </button>
          <button 
            className={`tab-button ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            技能数据
          </button>
          <button 
            className={`tab-button ${activeTab === 'weapons' ? 'active' : ''}`}
            onClick={() => setActiveTab('weapons')}
          >
            武器数据
          </button>
          <button 
            className={`tab-button ${activeTab === 'items' ? 'active' : ''}`}
            onClick={() => setActiveTab('items')}
          >
            物品数据
          </button>
          <button 
            className={`tab-button ${activeTab === 'body-types' ? 'active' : ''}`}
            onClick={() => setActiveTab('body-types')}
          >
            体质数据
          </button>
          <button 
            className={`tab-button ${activeTab === 'zongmen' ? 'active' : ''}`}
            onClick={() => setActiveTab('zongmen')}
          >
            宗门数据
          </button>
          <button 
            className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            成就数据
          </button>
          <button 
            className={`tab-button ${activeTab === 'item-categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('item-categories')}
          >
            物品分类
          </button>
        </div>
      </div>
      
      {/* 主要内容区域 */}
      <div className="main-content">
        {loading && <div className="loading">加载中...</div>}
        {!loading && renderContent()}
      </div>
    </div>
  );
};

export default DatabaseManagementPage;