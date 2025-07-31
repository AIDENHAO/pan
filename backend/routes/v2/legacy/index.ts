/**
 * 兼容性模块路由
 * 保持与旧版API的兼容性，提供向后兼容的接口
 */
import { Router, Request, Response } from 'express';
import { LeaderController } from '../../../controllers/LeaderController.js';
import { ZongmenController } from '../../../controllers/ZongmenController.js';
import { MappingController } from '../../../controllers/MappingController.js';
import { DatabaseController } from '../../../controllers/DatabaseController.js';
import {
  validateLegacyLeaderId,
  validateLegacyLeaderData,
  validateLegacyLeaderQuery,
  validateLegacyZongmenId,
  validateLegacyZongmenData,
  validateLegacyZongmenQuery,
  validateLegacyMappingId,
  validateLegacyMappingData,
  validateLegacyMappingQuery,
  validateLegacyTableName,
  validateLegacyDatabaseQuery,
  validateLegacyApiVersion,
  validateLegacyPaginationQuery,
  validateLegacyDataConversion
} from '../../../middleware/validation/legacy.js';

const router = Router();

// 创建控制器实例
const leaderController = new LeaderController();
const zongmenController = new ZongmenController();
const mappingController = new MappingController();
const databaseController = new DatabaseController();

// ==================== 兼容性模块信息 ====================
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: '兼容性模块',
    description: '提供与旧版API的兼容性支持',
    warning: '这些接口已被标记为过时，建议使用新版本的API',
    migration: {
      leader: '请使用 /api/v2/character/* 替代',
      zongmen: '请使用 /api/v2/static-data/zongmen 替代',
      mappings: '请使用相应的静态数据接口替代',
      database: '请使用 /api/v2/character/* 和 /api/v2/static-data/* 替代'
    },
    endpoints: {
      leader: '掌门相关的兼容接口',
      zongmen: '宗门相关的兼容接口',
      mappings: '映射数据的兼容接口',
      database: '数据库操作的兼容接口'
    }
  });
});

// ==================== 掌门相关兼容接口 ====================

/**
 * 获取掌门信息 (兼容旧接口)
 * POST /api/v2/legacy/get-person-info
 * @deprecated 请使用 GET /api/v2/character/base-info/:character_uuid
 */
router.post('/get-person-info', validateLegacyLeaderQuery, (req: Request, res: Response) => {
  console.warn('⚠️  使用了过时的API: POST /api/v2/legacy/get-person-info');
  leaderController.getLeaderInfo(req, res);
});

/**
 * 更新修炼值 (兼容旧接口)
 * POST /api/v2/legacy/update-cultivation
 * @deprecated 请使用 PUT /api/v2/character/base-info/:character_uuid
 */
router.post('/update-cultivation', validateLegacyLeaderData, (req: Request, res: Response) => {
  console.warn('⚠️  使用了过时的API: POST /api/v2/legacy/update-cultivation');
  leaderController.updateCultivationValue(req, res);
});

/**
 * 更新境界等级 (兼容旧接口)
 * POST /api/v2/legacy/update-realm-level
 * @deprecated 请使用 PUT /api/v2/character/base-info/:character_uuid
 */
router.post('/update-realm-level', validateLegacyLeaderData, (req: Request, res: Response) => {
  console.warn('⚠️  使用了过时的API: POST /api/v2/legacy/update-realm-level');
  leaderController.updateRealmLevel(req, res);
});

/**
 * 激活境界突破 (兼容旧接口)
 * POST /api/v2/legacy/activate-breakthrough
 * @deprecated 请使用相应的新版本接口
 */
router.post('/activate-breakthrough', validateLegacyLeaderData, (req: Request, res: Response) => {
  console.warn('⚠️  使用了过时的API: POST /api/v2/legacy/activate-breakthrough');
  leaderController.activateBreakthrough(req, res);
});

// ==================== 宗门相关兼容接口 ====================

/**
 * 获取宗门信息 (兼容旧接口)
 * POST /api/v2/legacy/get-zongmen-info
 * @deprecated 请使用 GET /api/v2/static-data/zongmen/:zongmen_id
 */
router.post('/get-zongmen-info', validateLegacyZongmenQuery, (req: Request, res: Response) => {
  console.warn('⚠️  使用了过时的API: POST /api/v2/legacy/get-zongmen-info');
  zongmenController.getZongmenInfo(req, res);
});

// ==================== 映射数据兼容接口 ====================

/**
 * 获取映射数据 (兼容旧接口)
 * POST /api/v2/legacy/get-mappings
 * @deprecated 请使用相应的静态数据接口
 */
router.post('/get-mappings', validateLegacyMappingQuery, (req: Request, res: Response) => {
  console.warn('⚠️  使用了过时的API: POST /api/v2/legacy/get-mappings');
  mappingController.getAllMappings(req, res);
});

// ==================== 数据库操作兼容接口 ====================

/**
 * 获取角色亲和度 (兼容旧接口)
 * GET /api/v2/legacy/character-affinities/:characterId
 * @deprecated 请使用 GET /api/v2/character/affinities/:character_uuid
 */
router.get('/character-affinities/:characterId', validateLegacyDatabaseQuery, (req: Request, res: Response) => {
  console.warn('⚠️  使用了过时的API: GET /api/v2/legacy/character-affinities/:characterId');
  databaseController.getCharacterAffinities(req, res);
});

/**
 * 创建或更新角色亲和度 (兼容旧接口)
 * POST /api/v2/legacy/character-affinities
 * @deprecated 请使用 POST /api/v2/character/affinities
 */
router.post('/character-affinities', validateLegacyDatabaseQuery, (req: Request, res: Response) => {
  console.warn('⚠️  使用了过时的API: POST /api/v2/legacy/character-affinities');
  databaseController.createOrUpdateCharacterAffinities(req, res);
});

/**
 * 获取所有角色 (兼容旧接口)
 * GET /api/v2/legacy/characters
 * @deprecated 请使用 GET /api/v2/character/base-info
 */
router.get('/characters', validateLegacyPaginationQuery, (req: Request, res: Response) => {
  console.warn('⚠️  使用了过时的API: GET /api/v2/legacy/characters');
  databaseController.getAllCharacters(req, res);
});

/**
 * 获取所有境界 (兼容旧接口)
 * GET /api/v2/legacy/realms
 * @deprecated 请使用 GET /api/v2/static-data/realms
 */
router.get('/realms', validateLegacyPaginationQuery, (req: Request, res: Response) => {
  console.warn('⚠️  使用了过时的API: GET /api/v2/legacy/realms');
  databaseController.getAllRealms(req, res);
});

// ==================== 中间件：过时警告 ====================

/**
 * 为所有兼容接口添加过时警告头
 */
router.use((req, res, next) => {
  res.setHeader('X-API-Deprecated', 'true');
  res.setHeader('X-API-Deprecation-Date', '2024-01-01');
  res.setHeader('X-API-Sunset-Date', '2024-06-01');
  res.setHeader('X-API-Migration-Guide', 'https://docs.example.com/api/v2/migration');
  next();
});

export default router;