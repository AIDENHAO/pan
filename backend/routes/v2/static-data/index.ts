/**
 * 静态数据模块路由
 * 管理所有基础数据表，如境界、技能、武器、物品、宗门等
 */
import { Router } from 'express';
import { DatabaseController } from '../../../controllers/DatabaseController.js';
import {
  validateRealmId,
  validateCreateRealmData,
  validateUpdateRealmData,
  validateRealmLevelRangeQuery,
  validateSkillId,
  validateCreateSkillData,
  validateSkillTypeQuery,
  validateWeaponId,
  validateCreateWeaponData,
  validateWeaponTypeQuery,
  validateItemId,
  validateCreateItemData,
  validateItemTypeQuery,
  validateZongmenId,
  validateCreateZongmenData,
  validateZongmenTypeQuery,
  validateStaticDataPaginationQuery
} from '../../../middleware/validation/static-data.js';
import realmsRoutes from './realms.js';
import skillsRoutes from './skills.js';
import weaponsRoutes from './weapons.js';
import itemsRoutes from './items.js';
import bodyTypesRoutes from './body-types.js';
import zongmenRoutes from './zongmen.js';
import achievementsRoutes from './achievements.js';
import itemCategoriesRoutes from './item-categories.js';

const router = Router();

// ==================== 静态数据模块信息 ====================
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '静态数据管理模块',
    description: '管理游戏中的基础数据，如境界、技能、武器、物品等',
    subModules: {
      realms: '境界数据管理',
      skills: '技能数据管理',
      weapons: '武器数据管理',
      items: '物品数据管理',
      bodyTypes: '体质类型数据管理',
      zongmen: '宗门数据管理',
      achievements: '成就数据管理',
      itemCategories: '物品分类管理'
    },
    endpoints: {
      realms: '/realms',
      skills: '/skills',
      weapons: '/weapons',
      items: '/items',
      bodyTypes: '/body-types',
      zongmen: '/zongmen',
      achievements: '/achievements',
      itemCategories: '/item-categories'
    }
  });
});

// ==================== 子模块路由挂载 ====================

// 境界数据 - realm_data 表
router.use('/realms', realmsRoutes);

// 技能数据 - skill_data 表
router.use('/skills', skillsRoutes);

// 武器数据 - weapon_data 表
router.use('/weapons', weaponsRoutes);

// 物品数据 - item_data 表
router.use('/items', itemsRoutes);

// 体质类型数据 - body_type_data 表
router.use('/body-types', bodyTypesRoutes);

// 宗门数据 - zongmen_data 表
router.use('/zongmen', zongmenRoutes);

// 成就数据 - achievement_data 表
router.use('/achievements', achievementsRoutes);

// 物品分类 - item_type_category 表
router.use('/item-categories', itemCategoriesRoutes);

export default router;