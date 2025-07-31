/**
 * 角色管理模块路由
 * 处理所有与角色相关的操作，包括基础信息和关联数据
 */
import { Router } from 'express';
import baseInfoRoutes from './base-info.js';
import affinitiesRoutes from './affinities.js';
import strengthRoutes from './strength.js';
import bodyTypesRoutes from './body-types.js';
import skillsRoutes from './skills.js';
import weaponsRoutes from './weapons.js';
import currencyRoutes from './currency.js';
import itemsRoutes from './items.js';

const router = Router();

// ==================== 角色模块信息 ====================
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '角色管理模块',
    subModules: {
      baseInfo: '基础信息管理',
      affinities: '五行亲和度管理',
      strength: '强度属性管理',
      bodyTypes: '体质类型管理',
      skills: '技能管理',
      weapons: '武器管理',
      currency: '货币管理',
      items: '物品管理'
    },
    endpoints: {
      baseInfo: '/base-info',
      affinities: '/affinities',
      strength: '/strength',
      bodyTypes: '/body-types',
      skills: '/skills',
      weapons: '/weapons',
      currency: '/currency',
      items: '/items'
    }
  });
});

// ==================== 子模块路由挂载 ====================

// 角色基础信息 - character_base_info 表
router.use('/base-info', baseInfoRoutes);

// 角色五行亲和度 - character_affinities 表
router.use('/affinities', affinitiesRoutes);

// 角色强度属性 - character_strength 表
router.use('/strength', strengthRoutes);

// 角色体质类型 - character_body_types 表
router.use('/body-types', bodyTypesRoutes);

// 角色技能 - character_skills 表
router.use('/skills', skillsRoutes);

// 角色武器 - character_weapons 表
router.use('/weapons', weaponsRoutes);

// 角色货币 - character_currency 表
router.use('/currency', currencyRoutes);

// 角色物品 - character_items 表
router.use('/items', itemsRoutes);

export default router;