/**
 * 数据库管理控制器
 * 提供数据库CRUD操作的API接口
 */
import { Request, Response } from 'express';
import { BaseController, ValidationError, NotFoundError } from './BaseController.js';
import { DatabaseService } from '../dal/implementations/DatabaseService.js';
import {
  CharacterBaseInfoDAL,
  CharacterAffinitiesDAL,
  CharacterStrengthDAL,
  CharacterBodyTypesDAL,
  CharacterSkillsDAL,
  CharacterWeaponsDAL,
  CharacterCurrencyDAL,
  CharacterItemsDAL,
  RealmDataDAL,
  BodyTypeDataDAL,
  SkillDataDAL,
  WeaponDataDAL,
  ZongmenDataDAL,
  AchievementDataDAL,
  ItemDataDAL,
  ItemTypeCategoryDAL,
  ItemTypeRelationsDAL
} from '../dal/implementations/CharacterDALs.js';

/**
 * 数据库管理控制器类
 * 处理前端发送的数据库操作请求
 */
export class DatabaseController extends BaseController {
  private databaseService: DatabaseService;
  
  // 角色相关DAL
  private characterDAL: CharacterBaseInfoDAL;
  private characterAffinitiesDAL: CharacterAffinitiesDAL;
  private characterStrengthDAL: CharacterStrengthDAL;
  private characterBodyTypesDAL: CharacterBodyTypesDAL;
  private characterSkillsDAL: CharacterSkillsDAL;
  private characterWeaponsDAL: CharacterWeaponsDAL;
  private characterCurrencyDAL: CharacterCurrencyDAL;
  private characterItemsDAL: CharacterItemsDAL;
  
  // 静态数据DAL
  private realmDAL: RealmDataDAL;
  private bodyTypeDAL: BodyTypeDataDAL;
  private skillDAL: SkillDataDAL;
  private weaponDAL: WeaponDataDAL;
  private zongmenDAL: ZongmenDataDAL;
  private achievementDAL: AchievementDataDAL;
  private itemDAL: ItemDataDAL;
  private itemTypeCategoryDAL: ItemTypeCategoryDAL;
  private itemTypeRelationsDAL: ItemTypeRelationsDAL;

  constructor() {
    super();
    this.databaseService = DatabaseService.getInstance();
    
    // 初始化角色相关DAL
    this.characterDAL = new CharacterBaseInfoDAL();
    this.characterAffinitiesDAL = new CharacterAffinitiesDAL();
    this.characterStrengthDAL = new CharacterStrengthDAL();
    this.characterBodyTypesDAL = new CharacterBodyTypesDAL();
    this.characterSkillsDAL = new CharacterSkillsDAL();
    this.characterWeaponsDAL = new CharacterWeaponsDAL();
    this.characterCurrencyDAL = new CharacterCurrencyDAL();
    this.characterItemsDAL = new CharacterItemsDAL();
    
    // 初始化静态数据DAL
    this.realmDAL = new RealmDataDAL();
    this.bodyTypeDAL = new BodyTypeDataDAL();
    this.skillDAL = new SkillDataDAL();
    this.weaponDAL = new WeaponDataDAL();
    this.zongmenDAL = new ZongmenDataDAL();
    this.achievementDAL = new AchievementDataDAL();
    this.itemDAL = new ItemDataDAL();
    this.itemTypeCategoryDAL = new ItemTypeCategoryDAL();
    this.itemTypeRelationsDAL = new ItemTypeRelationsDAL();
  }

  /**
   * 获取数据库统计信息
   * GET /api/database/stats
   */
  public async getDatabaseStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.databaseService.getStatistics();
      this.sendSuccess(res, stats, '获取数据库统计信息成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 角色管理 ====================

  /**
   * 获取所有角色
   * GET /api/database/characters
   */
  public async getAllCharacters(req: Request, res: Response): Promise<void> {
    try {
      const characters = await this.characterDAL.findAll();
      this.sendSuccess(res, characters, '获取角色列表成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 根据ID获取角色
   * GET /api/database/characters/:id
   */
  public async getCharacterById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const character = await this.characterDAL.findById(id);
      if (!character) {
        throw new NotFoundError('角色');
      }
      
      this.sendSuccess(res, character, '获取角色信息成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 创建新角色
   * POST /api/database/characters
   */
  public async createCharacter(req: Request, res: Response): Promise<void> {
    try {
      const characterData = req.body;
      console.log('🔍 接收到的角色数据:', JSON.stringify(characterData, null, 2));
      
      // 验证必需字段
      this.validateRequiredParams(characterData, ['character_name', 'character_realm_Level']);
      this.validateStringParam(characterData.character_name, 'character_name', 50);
      this.validateNumberParam(characterData.character_realm_Level, 'character_realm_Level', 1);
      
      const newCharacter = await this.characterDAL.create(characterData);
      this.sendSuccess(res, newCharacter, '创建角色成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 更新角色信息
   * PUT /api/database/characters/:id
   */
  public async updateCharacter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      this.validateRequiredParams({ id }, ['id']);
      
      const updatedCharacter = await this.characterDAL.update(id, updateData);
      if (!updatedCharacter) {
        throw new NotFoundError('角色');
      }
      
      this.sendSuccess(res, updatedCharacter, '更新角色信息成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 删除角色
   * DELETE /api/database/characters/:id
   */
  public async deleteCharacter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      // 先检查角色是否存在
      const existingCharacter = await this.characterDAL.findById(id);
      if (!existingCharacter) {
        throw new NotFoundError('角色');
      }
      
      // 执行删除操作
      const deleteResult = await this.characterDAL.delete(id);
      
      // 检查删除是否成功 - 删除成功后再次查询应该返回null
      const verifyDeleted = await this.characterDAL.findById(id);
      if (verifyDeleted !== null) {
        throw new Error('删除角色失败');
      }
      
      this.sendSuccess(res, { deleted: true }, '删除角色成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 境界管理 ====================

  /**
   * 获取所有境界
   * GET /api/database/realms
   */
  public async getAllRealms(req: Request, res: Response): Promise<void> {
    try {
      const realms = await this.realmDAL.findAll();
      this.sendSuccess(res, realms, '获取境界列表成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 根据ID获取境界
   * GET /api/database/realms/:id
   */
  public async getRealmById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const realm = await this.realmDAL.findById(parseInt(id));
      if (!realm) {
        throw new NotFoundError('境界');
      }
      
      this.sendSuccess(res, realm, '获取境界信息成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 创建境界数据
   * POST /api/database/realms
   */
  public async createRealmData(req: Request, res: Response): Promise<void> {
    try {
      const realmData = req.body;
      this.validateRequiredParams(realmData, ['realm_level', 'stage_division', 'major_realm', 'minor_realm', 'stage']);
      
      const newRealm = await this.realmDAL.create(realmData);
      this.sendSuccess(res, newRealm, '创建境界数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 更新境界数据
   * PUT /api/database/realms/:id
   */
  public async updateRealmData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const realmData = req.body;
      this.validateRequiredParams({ id }, ['id']);
      
      const updatedRealm = await this.realmDAL.update(parseInt(id), realmData);
      if (!updatedRealm) {
        throw new NotFoundError('境界数据');
      }
      
      this.sendSuccess(res, updatedRealm, '更新境界数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 删除境界数据
   * DELETE /api/database/realms/:id
   */
  public async deleteRealmData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const success = await this.realmDAL.delete(parseInt(id));
      if (!success) {
        throw new NotFoundError('境界数据');
      }
      
      this.sendSuccess(res, null, '删除境界数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 技能管理 ====================

  /**
   * 获取所有技能
   * GET /api/database/skills
   */
  public async getAllSkills(req: Request, res: Response): Promise<void> {
    try {
      const skills = await this.skillDAL.findAll();
      this.sendSuccess(res, skills, '获取技能列表成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 根据ID获取技能
   * GET /api/database/skills/:id
   */
  public async getSkillById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const skill = await this.skillDAL.findById(id);
      if (!skill) {
        throw new NotFoundError('技能');
      }
      
      this.sendSuccess(res, skill, '获取技能信息成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 创建技能数据
   * POST /api/database/skills
   */
  public async createSkillData(req: Request, res: Response): Promise<void> {
    try {
      const skillData = req.body;
      this.validateRequiredParams(skillData, ['skill_id', 'skill_name']);
      
      const newSkill = await this.skillDAL.create(skillData);
      this.sendSuccess(res, newSkill, '创建技能数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 更新技能数据
   * PUT /api/database/skills/:id
   */
  public async updateSkillData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const skillData = req.body;
      this.validateRequiredParams({ id }, ['id']);
      
      const updatedSkill = await this.skillDAL.update(id, skillData);
      if (!updatedSkill) {
        throw new NotFoundError('技能数据');
      }
      
      this.sendSuccess(res, updatedSkill, '更新技能数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 删除技能数据
   * DELETE /api/database/skills/:id
   */
  public async deleteSkillData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const success = await this.skillDAL.delete(id);
      if (!success) {
        throw new NotFoundError('技能数据');
      }
      
      this.sendSuccess(res, null, '删除技能数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 武器管理 ====================

  /**
   * 获取所有武器
   * GET /api/database/weapons
   */
  public async getAllWeapons(req: Request, res: Response): Promise<void> {
    try {
      const weapons = await this.weaponDAL.findAll();
      this.sendSuccess(res, weapons, '获取武器列表成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 根据ID获取武器
   * GET /api/database/weapons/:id
   */
  public async getWeaponById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const weapon = await this.weaponDAL.findById(id);
      if (!weapon) {
        throw new NotFoundError('武器');
      }
      
      this.sendSuccess(res, weapon, '获取武器信息成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 创建武器数据
   * POST /api/database/weapons
   */
  public async createWeaponData(req: Request, res: Response): Promise<void> {
    try {
      const weaponData = req.body;
      this.validateRequiredParams(weaponData, ['weapon_id', 'weapon_name']);
      
      const newWeapon = await this.weaponDAL.create(weaponData);
      this.sendSuccess(res, newWeapon, '创建武器数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 更新武器数据
   * PUT /api/database/weapons/:id
   */
  public async updateWeaponData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const weaponData = req.body;
      this.validateRequiredParams({ id }, ['id']);
      
      const updatedWeapon = await this.weaponDAL.update(id, weaponData);
      if (!updatedWeapon) {
        throw new NotFoundError('武器数据');
      }
      
      this.sendSuccess(res, updatedWeapon, '更新武器数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 删除武器数据
   * DELETE /api/database/weapons/:id
   */
  public async deleteWeaponData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const success = await this.weaponDAL.delete(id);
      if (!success) {
        throw new NotFoundError('武器数据');
      }
      
      this.sendSuccess(res, null, '删除武器数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 物品管理 ====================

  /**
   * 获取所有物品
   * GET /api/database/items
   */
  public async getAllItems(req: Request, res: Response): Promise<void> {
    try {
      const items = await this.itemDAL.findAll();
      this.sendSuccess(res, items, '获取物品列表成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 根据ID获取物品
   * GET /api/database/items/:id
   */
  public async getItemById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const item = await this.itemDAL.findById(id);
      if (!item) {
        throw new NotFoundError('物品');
      }
      
      this.sendSuccess(res, item, '获取物品信息成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 创建物品数据
   * POST /api/database/items
   */
  public async createItemData(req: Request, res: Response): Promise<void> {
    try {
      const itemData = req.body;
      this.validateRequiredParams(itemData, ['item_id', 'item_name']);
      
      const newItem = await this.itemDAL.create(itemData);
      this.sendSuccess(res, newItem, '创建物品数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 更新物品数据
   * PUT /api/database/items/:id
   */
  public async updateItemData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const itemData = req.body;
      this.validateRequiredParams({ id }, ['id']);
      
      const updatedItem = await this.itemDAL.update(id, itemData);
      if (!updatedItem) {
        throw new NotFoundError('物品数据');
      }
      
      this.sendSuccess(res, updatedItem, '更新物品数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 删除物品数据
   * DELETE /api/database/items/:id
   */
  public async deleteItemData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const success = await this.itemDAL.delete(id);
      if (!success) {
        throw new NotFoundError('物品数据');
      }
      
      this.sendSuccess(res, null, '删除物品数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 通用搜索 ====================

  /**
   * 搜索角色
   * GET /api/database/search/characters
   */
  public async searchCharacters(req: Request, res: Response): Promise<void> {
    try {
      const { query, type = 'name' } = req.query;
      
      this.validateRequiredParams({ query }, ['query']);
      this.validateStringParam(query, 'query', 100);
      
      let results: any[] = [];
      
      switch (type) {
        case 'name':
          results = await this.characterDAL.findByName(query as string);
          break;
        case 'zongmen':
          results = await this.characterDAL.findByZongmen(query as string);
          break;
        case 'realm':
          const realmLevel = parseInt(query as string);
          if (!isNaN(realmLevel)) {
            results = await this.characterDAL.findByRealmLevel(realmLevel);
          }
          break;
        default:
          results = await this.characterDAL.findByName(query as string);
      }
      
      this.sendSuccess(res, results, '搜索角色完成');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 角色亲和度管理 ====================

  /**
   * 获取角色亲和度
   * GET /api/database/character-affinities/:characterId
   */
  public async getCharacterAffinities(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;
      this.validateRequiredParams({ characterId }, ['characterId']);
      
      const affinities = await this.characterAffinitiesDAL.findByCharacterId(characterId);
      if (!affinities) {
        throw new NotFoundError('角色亲和度');
      }
      
      this.sendSuccess(res, affinities, '获取角色亲和度成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 创建或更新角色亲和度
   * POST /api/database/character-affinities
   */
  public async createOrUpdateCharacterAffinities(req: Request, res: Response): Promise<void> {
    try {
      const affinitiesData = req.body;
      this.validateRequiredParams(affinitiesData, ['character_uuid']);
      
      const existing = await this.characterAffinitiesDAL.findByCharacterId(affinitiesData.character_uuid);
      let result;
      
      if (existing) {
        result = await this.characterAffinitiesDAL.update(affinitiesData.character_uuid, affinitiesData);
      } else {
        result = await this.characterAffinitiesDAL.create(affinitiesData);
      }
      
      this.sendSuccess(res, result, existing ? '更新角色亲和度成功' : '创建角色亲和度成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 角色强度管理 ====================

  /**
   * 获取角色强度
   * GET /api/database/character-strength/:characterId
   */
  public async getCharacterStrength(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;
      this.validateRequiredParams({ characterId }, ['characterId']);
      
      const strength = await this.characterStrengthDAL.findByCharacterId(characterId);
      if (!strength) {
        throw new NotFoundError('角色强度');
      }
      
      this.sendSuccess(res, strength, '获取角色强度成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 创建或更新角色强度
   * POST /api/database/character-strength
   */
  public async createOrUpdateCharacterStrength(req: Request, res: Response): Promise<void> {
    try {
      const strengthData = req.body;
      this.validateRequiredParams(strengthData, ['character_uuid']);
      
      const existing = await this.characterStrengthDAL.findByCharacterId(strengthData.character_uuid);
      let result;
      
      if (existing) {
        result = await this.characterStrengthDAL.update(strengthData.character_uuid, strengthData);
      } else {
        result = await this.characterStrengthDAL.create(strengthData);
      }
      
      this.sendSuccess(res, result, existing ? '更新角色强度成功' : '创建角色强度成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 角色体质管理 ====================

  /**
   * 获取角色体质
   * GET /api/database/character-body-types/:characterId
   */
  public async getCharacterBodyTypes(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;
      this.validateRequiredParams({ characterId }, ['characterId']);
      
      const bodyTypes = await this.characterBodyTypesDAL.findByCharacterId(characterId);
      if (!bodyTypes) {
        throw new NotFoundError('角色体质');
      }
      
      this.sendSuccess(res, bodyTypes, '获取角色体质成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 创建或更新角色体质
   * POST /api/database/character-body-types
   */
  public async createOrUpdateCharacterBodyTypes(req: Request, res: Response): Promise<void> {
    try {
      const bodyTypesData = req.body;
      this.validateRequiredParams(bodyTypesData, ['character_uuid']);
      
      const existing = await this.characterBodyTypesDAL.findByCharacterId(bodyTypesData.character_uuid);
      let result;
      
      if (existing) {
        result = await this.characterBodyTypesDAL.update(bodyTypesData.character_uuid, bodyTypesData);
      } else {
        result = await this.characterBodyTypesDAL.create(bodyTypesData);
      }
      
      this.sendSuccess(res, result, existing ? '更新角色体质成功' : '创建角色体质成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 角色技能管理 ====================

  /**
   * 获取角色技能
   * GET /api/database/character-skills/:characterId
   */
  public async getCharacterSkills(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;
      this.validateRequiredParams({ characterId }, ['characterId']);
      
      const skills = await this.characterSkillsDAL.findByCharacterId(characterId);
      if (!skills) {
        throw new NotFoundError('角色技能');
      }
      
      this.sendSuccess(res, skills, '获取角色技能成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 创建或更新角色技能
   * POST /api/database/character-skills
   */
  public async createOrUpdateCharacterSkills(req: Request, res: Response): Promise<void> {
    try {
      const skillsData = req.body;
      this.validateRequiredParams(skillsData, ['character_uuid']);
      
      const existing = await this.characterSkillsDAL.findByCharacterId(skillsData.character_uuid);
      let result;
      
      if (existing) {
        result = await this.characterSkillsDAL.update(skillsData.character_uuid, skillsData);
      } else {
        result = await this.characterSkillsDAL.create(skillsData);
      }
      
      this.sendSuccess(res, result, existing ? '更新角色技能成功' : '创建角色技能成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 角色武器管理 ====================

  /**
   * 获取角色武器
   * GET /api/database/character-weapons/:characterId
   */
  public async getCharacterWeapons(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;
      this.validateRequiredParams({ characterId }, ['characterId']);
      
      const weapons = await this.characterWeaponsDAL.findByCharacterId(characterId);
      if (!weapons) {
        throw new NotFoundError('角色武器');
      }
      
      this.sendSuccess(res, weapons, '获取角色武器成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 创建或更新角色武器
   * POST /api/database/character-weapons
   */
  public async createOrUpdateCharacterWeapons(req: Request, res: Response): Promise<void> {
    try {
      const weaponsData = req.body;
      this.validateRequiredParams(weaponsData, ['character_uuid']);
      
      const existing = await this.characterWeaponsDAL.findByCharacterId(weaponsData.character_uuid);
      let result;
      
      if (existing) {
        result = await this.characterWeaponsDAL.update(weaponsData.character_uuid, weaponsData);
      } else {
        result = await this.characterWeaponsDAL.create(weaponsData);
      }
      
      this.sendSuccess(res, result, existing ? '更新角色武器成功' : '创建角色武器成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 角色货币管理 ====================

  /**
   * 获取角色货币
   * GET /api/database/character-currency/:characterId
   */
  public async getCharacterCurrency(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;
      this.validateRequiredParams({ characterId }, ['characterId']);
      
      const currency = await this.characterCurrencyDAL.findByCharacterId(characterId);
      if (!currency) {
        throw new NotFoundError('角色货币');
      }
      
      this.sendSuccess(res, currency, '获取角色货币成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 创建或更新角色货币
   * POST /api/database/character-currency
   */
  public async createOrUpdateCharacterCurrency(req: Request, res: Response): Promise<void> {
    try {
      const currencyData = req.body;
      this.validateRequiredParams(currencyData, ['character_uuid']);
      
      const existing = await this.characterCurrencyDAL.findByCharacterId(currencyData.character_uuid);
      let result;
      
      if (existing) {
        result = await this.characterCurrencyDAL.update(currencyData.character_uuid, currencyData);
      } else {
        result = await this.characterCurrencyDAL.create(currencyData);
      }
      
      this.sendSuccess(res, result, existing ? '更新角色货币成功' : '创建角色货币成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 角色物品管理 ====================

  /**
   * 获取所有角色物品
   * GET /api/database/character-items
   */
  public async getAllCharacterItems(req: Request, res: Response): Promise<void> {
    try {
      const items = await this.characterItemsDAL.findAll();
      this.sendSuccess(res, items, '获取所有角色物品成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 获取角色物品列表
   * GET /api/database/character-items/:characterId
   */
  public async getCharacterItems(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;
      this.validateRequiredParams({ characterId }, ['characterId']);
      
      const items = await this.characterItemsDAL.findByCharacterId(characterId);
      this.sendSuccess(res, items, '获取角色物品列表成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 创建角色物品
   * POST /api/database/character-items
   */
  public async createCharacterItem(req: Request, res: Response): Promise<void> {
    try {
      const itemData = req.body;
      this.validateRequiredParams(itemData, ['character_uuid', 'item_id']);
      
      const newItem = await this.characterItemsDAL.create(itemData);
      this.sendSuccess(res, newItem, '创建角色物品成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 更新角色物品
   * PUT /api/database/character-items/:id
   */
  public async updateCharacterItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const itemData = req.body;
      this.validateRequiredParams({ id }, ['id']);
      
      const updatedItem = await this.characterItemsDAL.update(id, itemData);
      if (!updatedItem) {
        throw new NotFoundError('角色物品');
      }
      
      this.sendSuccess(res, updatedItem, '更新角色物品成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 删除角色物品
   * DELETE /api/database/character-items/:id
   */
  public async deleteCharacterItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const success = await this.characterItemsDAL.delete(id);
      if (!success) {
        throw new NotFoundError('角色物品');
      }
      
      this.sendSuccess(res, null, '删除角色物品成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 体质数据管理 ====================

  /**
   * 获取所有体质数据
   * GET /api/database/body-types
   */
  public async getAllBodyTypes(req: Request, res: Response): Promise<void> {
    try {
      const bodyTypes = await this.bodyTypeDAL.findAll();
      this.sendSuccess(res, bodyTypes, '获取体质数据列表成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 根据ID获取体质数据
   * GET /api/database/body-types/:id
   */
  public async getBodyTypeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const bodyType = await this.bodyTypeDAL.findById(id);
      if (!bodyType) {
        throw new NotFoundError('体质数据');
      }
      
      this.sendSuccess(res, bodyType, '获取体质数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 创建体质数据
   * POST /api/database/body-types
   */
  public async createBodyTypeData(req: Request, res: Response): Promise<void> {
    try {
      const bodyTypeData = req.body;
      this.validateRequiredParams(bodyTypeData, ['body_type_id', 'body_type_name']);
      
      const newBodyType = await this.bodyTypeDAL.create(bodyTypeData);
      this.sendSuccess(res, newBodyType, '创建体质数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 更新体质数据
   * PUT /api/database/body-types/:id
   */
  public async updateBodyTypeData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const bodyTypeData = req.body;
      this.validateRequiredParams({ id }, ['id']);
      
      const updatedBodyType = await this.bodyTypeDAL.update(id, bodyTypeData);
      if (!updatedBodyType) {
        throw new NotFoundError('体质数据');
      }
      
      this.sendSuccess(res, updatedBodyType, '更新体质数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 删除体质数据
   * DELETE /api/database/body-types/:id
   */
  public async deleteBodyTypeData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const success = await this.bodyTypeDAL.delete(id);
      if (!success) {
        throw new NotFoundError('体质数据');
      }
      
      this.sendSuccess(res, null, '删除体质数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 宗门数据管理 ====================

  /**
   * 获取所有宗门数据
   * GET /api/database/zongmen
   */
  public async getAllZongmen(req: Request, res: Response): Promise<void> {
    try {
      const zongmen = await this.zongmenDAL.findAll();
      this.sendSuccess(res, zongmen, '获取宗门数据列表成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 根据ID获取宗门数据
   * GET /api/database/zongmen/:id
   */
  public async getZongmenById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const zongmen = await this.zongmenDAL.findById(id);
      if (!zongmen) {
        throw new NotFoundError('宗门数据');
      }
      
      this.sendSuccess(res, zongmen, '获取宗门数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 创建宗门数据
   * POST /api/database/zongmen
   */
  public async createZongmenData(req: Request, res: Response): Promise<void> {
    try {
      const zongmenData = req.body;
      this.validateRequiredParams(zongmenData, ['zongmen_id', 'zongmen_name']);
      
      const newZongmen = await this.zongmenDAL.create(zongmenData);
      this.sendSuccess(res, newZongmen, '创建宗门数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 更新宗门数据
   * PUT /api/database/zongmen/:id
   */
  public async updateZongmenData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const zongmenData = req.body;
      this.validateRequiredParams({ id }, ['id']);
      
      const updatedZongmen = await this.zongmenDAL.update(id, zongmenData);
      if (!updatedZongmen) {
        throw new NotFoundError('宗门数据');
      }
      
      this.sendSuccess(res, updatedZongmen, '更新宗门数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 删除宗门数据
   * DELETE /api/database/zongmen/:id
   */
  public async deleteZongmenData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const success = await this.zongmenDAL.delete(id);
      if (!success) {
        throw new NotFoundError('宗门数据');
      }
      
      this.sendSuccess(res, null, '删除宗门数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 成就数据管理 ====================

  /**
   * 获取所有成就数据
   * GET /api/database/achievements
   */
  public async getAllAchievements(req: Request, res: Response): Promise<void> {
    try {
      const achievements = await this.achievementDAL.findAll();
      this.sendSuccess(res, achievements, '获取成就数据列表成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 根据ID获取成就数据
   * GET /api/database/achievements/:id
   */
  public async getAchievementById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const achievement = await this.achievementDAL.findById(id);
      if (!achievement) {
        throw new NotFoundError('成就数据');
      }
      
      this.sendSuccess(res, achievement, '获取成就数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 创建成就数据
   * POST /api/database/achievements
   */
  public async createAchievementData(req: Request, res: Response): Promise<void> {
    try {
      const achievementData = req.body;
      this.validateRequiredParams(achievementData, ['achievement_id', 'achievement_name']);
      
      const newAchievement = await this.achievementDAL.create(achievementData);
      this.sendSuccess(res, newAchievement, '创建成就数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 更新成就数据
   * PUT /api/database/achievements/:id
   */
  public async updateAchievementData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const achievementData = req.body;
      this.validateRequiredParams({ id }, ['id']);
      
      const updatedAchievement = await this.achievementDAL.update(id, achievementData);
      if (!updatedAchievement) {
        throw new NotFoundError('成就数据');
      }
      
      this.sendSuccess(res, updatedAchievement, '更新成就数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 删除成就数据
   * DELETE /api/database/achievements/:id
   */
  public async deleteAchievementData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const success = await this.achievementDAL.delete(id);
      if (!success) {
        throw new NotFoundError('成就数据');
      }
      
      this.sendSuccess(res, null, '删除成就数据成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // ==================== 物品类型分类管理 ====================

  /**
   * 获取所有物品类型分类
   * GET /api/database/item-categories
   */
  public async getAllItemCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.itemTypeCategoryDAL.findAll();
      this.sendSuccess(res, categories, '获取物品类型分类列表成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 根据ID获取物品类型分类
   * GET /api/database/item-categories/:id
   */
  public async getItemCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const category = await this.itemTypeCategoryDAL.findById(parseInt(id));
      if (!category) {
        throw new NotFoundError('物品类型分类');
      }
      
      this.sendSuccess(res, category, '获取物品类型分类成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 创建物品类型分类
   * POST /api/database/item-categories
   */
  public async createItemCategoryData(req: Request, res: Response): Promise<void> {
    try {
      const categoryData = req.body;
      this.validateRequiredParams(categoryData, ['category_name']);
      
      const newCategory = await this.itemTypeCategoryDAL.create(categoryData);
      this.sendSuccess(res, newCategory, '创建物品类型分类成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 更新物品类型分类
   * PUT /api/database/item-categories/:id
   */
  public async updateItemCategoryData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const categoryData = req.body;
      this.validateRequiredParams({ id }, ['id']);
      
      const updatedCategory = await this.itemTypeCategoryDAL.update(parseInt(id), categoryData);
      if (!updatedCategory) {
        throw new NotFoundError('物品类型分类');
      }
      
      this.sendSuccess(res, updatedCategory, '更新物品类型分类成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * 删除物品类型分类
   * DELETE /api/database/item-categories/:id
   */
  public async deleteItemCategoryData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.validateRequiredParams({ id }, ['id']);
      
      const success = await this.itemTypeCategoryDAL.delete(parseInt(id));
      if (!success) {
        throw new NotFoundError('物品类型分类');
      }
      
      this.sendSuccess(res, null, '删除物品类型分类成功');
    } catch (error) {
      this.handleError(res, error);
    }
  }
}