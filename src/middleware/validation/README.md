# 数据验证中间件使用指南

本文档介绍如何在v2路由中使用数据验证中间件，提供清晰的结构和强大的扩展性。

## 目录结构

```
src/middleware/validation/
├── index.ts          # 核心验证工具和通用验证器
├── character.ts      # 角色管理模块验证器
├── static-data.ts    # 静态数据模块验证器
├── system.ts         # 系统管理模块验证器
├── legacy.ts         # 兼容性模块验证器
└── README.md         # 使用指南（本文件）
```

## 核心功能

### 1. 统一验证结果处理

所有验证器都使用统一的错误处理机制：

```typescript
import { handleValidationErrors } from '../middleware/validation/index.js';

// 验证错误会自动返回400状态码和详细错误信息
```

### 2. 模块化验证器

每个模块都有专门的验证器文件，包含：
- 参数验证（路径参数）
- 请求体验证（POST/PUT数据）
- 查询参数验证（GET查询条件）

### 3. 动态验证器生成

支持根据需求动态生成验证器：

```typescript
import { createDynamicValidators } from '../middleware/validation/index.js';

const customValidators = createDynamicValidators({
  requiredFields: ['name', 'level'],
  optionalFields: ['description'],
  numericFields: ['level'],
  stringFields: ['name', 'description']
});
```

## 使用方法

### 1. 在路由中导入验证器

```typescript
import {
  validateCharacterUUID,
  validateCreateCharacterBaseInfo,
  validatePaginationQuery
} from '../../../middleware/validation/character.js';
```

### 2. 应用验证中间件

```typescript
// 单个验证器
router.get('/:character_id', validateCharacterUUID, async (req, res) => {
  // 路由处理逻辑
});

// 多个验证器
router.post('/', 
  validateCreateCharacterBaseInfo,
  validateAdditionalData,
  async (req, res) => {
    // 路由处理逻辑
  }
);

// 查询参数验证
router.get('/', validatePaginationQuery, async (req, res) => {
  // 路由处理逻辑
});
```

### 3. 验证器组合

```typescript
import { createValidationMiddleware } from '../../../middleware/validation/index.js';
import { body, param } from 'express-validator';

// 创建组合验证器
const validateComplexOperation = createValidationMiddleware([
  param('id').isUUID().withMessage('ID必须是有效的UUID'),
  body('data').isObject().withMessage('数据必须是对象'),
  body('data.name').notEmpty().withMessage('名称不能为空')
]);
```

## 验证器类型

### 1. 角色管理验证器 (character.ts)

- `validateCharacterUUID` - 角色UUID验证
- `validateCreateCharacterBaseInfo` - 创建角色基础信息验证
- `validateUpdateCharacterBaseInfo` - 更新角色基础信息验证
- `validateCharacterAffinities` - 角色亲和度验证
- `validateCharacterStrength` - 角色实力验证
- `validateCharacterSkills` - 角色技能验证
- `validateCharacterCurrency` - 角色货币验证
- `validateAffinityRangeQuery` - 亲和度范围查询验证
- `validatePaginationQuery` - 分页查询验证
- `validateDateRangeQuery` - 日期范围查询验证

### 2. 静态数据验证器 (static-data.ts)

- `validateRealmId` - 境界ID验证
- `validateCreateRealmData` - 创建境界数据验证
- `validateSkillId` - 技能ID验证
- `validateCreateSkillData` - 创建技能数据验证
- `validateWeaponId` - 武器ID验证
- `validateCreateWeaponData` - 创建武器数据验证
- `validateItemId` - 物品ID验证
- `validateCreateItemData` - 创建物品数据验证
- `validateZongmenId` - 宗门ID验证
- `validateCreateZongmenData` - 创建宗门数据验证
- `validateStaticDataPaginationQuery` - 静态数据分页查询验证

### 3. 系统管理验证器 (system.ts)

- `validateHealthCheckQuery` - 健康检查查询验证
- `validateDatabaseHealthQuery` - 数据库健康检查验证
- `validateDatabaseStatsQuery` - 数据库统计查询验证
- `validateSystemStatsQuery` - 系统统计查询验证
- `validateVersionQuery` - 版本信息查询验证
- `validateSystemStatusQuery` - 系统状态查询验证
- `validateSystemConfigUpdate` - 系统配置更新验证
- `validateLogQuery` - 日志查询验证
- `validateCacheOperation` - 缓存操作验证

### 4. 兼容性验证器 (legacy.ts)

- `validateLegacyLeaderId` - 旧版掌门ID验证
- `validateLegacyLeaderData` - 旧版掌门数据验证
- `validateLegacyZongmenId` - 旧版宗门ID验证
- `validateLegacyZongmenData` - 旧版宗门数据验证
- `validateLegacyMappingData` - 旧版映射数据验证
- `validateLegacyDatabaseQuery` - 旧版数据库查询验证
- `validateLegacyPaginationQuery` - 旧版分页查询验证

## 验证规则示例

### 1. 基础数据类型验证

```typescript
// 字符串验证
body('name')
  .notEmpty().withMessage('名称不能为空')
  .isLength({ min: 1, max: 50 }).withMessage('名称长度必须在1-50个字符之间')
  .matches(/^[\u4e00-\u9fa5a-zA-Z0-9_\-\s]+$/).withMessage('名称格式无效')

// 数值验证
body('level')
  .isInt({ min: 1, max: 100 }).withMessage('等级必须是1-100之间的整数')

// 布尔值验证
body('is_active')
  .isBoolean().withMessage('激活状态必须是布尔值')

// 日期验证
body('created_at')
  .isISO8601().withMessage('日期格式无效，请使用ISO8601格式')
```

### 2. 复杂数据验证

```typescript
// 数组验证
body('skills')
  .isArray().withMessage('技能列表必须是数组格式')
  .custom((skills) => {
    if (skills.length > 10) {
      throw new Error('技能数量不能超过10个');
    }
    return true;
  })

// 对象验证
body('affinities')
  .isObject().withMessage('亲和度必须是对象格式')
  .custom((affinities) => {
    const requiredKeys = ['fire', 'water', 'earth', 'wood', 'metal'];
    for (const key of requiredKeys) {
      if (!(key in affinities)) {
        throw new Error(`缺少${key}属性亲和度`);
      }
    }
    return true;
  })
```

### 3. 自定义验证器

```typescript
// UUID验证
const validateUUID = (value: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

body('character_uuid')
  .custom((value) => {
    if (!validateUUID(value)) {
      throw new Error('角色UUID格式无效');
    }
    return true;
  })
```

## 错误处理

### 1. 验证错误响应格式

```json
{
  "success": false,
  "message": "数据验证失败",
  "errors": [
    {
      "field": "name",
      "message": "名称不能为空",
      "value": ""
    },
    {
      "field": "level",
      "message": "等级必须是1-100之间的整数",
      "value": "abc"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. 自定义错误处理

```typescript
import { validationResult } from 'express-validator';

const customErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '自定义验证错误',
      errors: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }
  next();
};
```

## 扩展指南

### 1. 添加新的验证器

```typescript
// 在相应的模块文件中添加新验证器
export const validateNewFeature = createValidationMiddleware([
  body('new_field')
    .notEmpty()
    .withMessage('新字段不能为空'),
  body('another_field')
    .isInt({ min: 1 })
    .withMessage('另一个字段必须是正整数')
]);
```

### 2. 创建新的验证模块

```typescript
// 创建新文件：src/middleware/validation/new-module.ts
import { body, param, query } from 'express-validator';
import { createValidationMiddleware } from './index.js';

export const validateNewModuleData = createValidationMiddleware([
  // 验证规则
]);

export default {
  validateNewModuleData
};
```

### 3. 条件验证

```typescript
// 根据条件应用不同的验证规则
const conditionalValidation = (req: Request, res: Response, next: NextFunction) => {
  const userRole = req.user?.role;
  
  if (userRole === 'admin') {
    // 管理员验证规则
    return validateAdminData(req, res, next);
  } else {
    // 普通用户验证规则
    return validateUserData(req, res, next);
  }
};
```

## 性能优化

### 1. 验证器缓存

```typescript
// 缓存常用的验证器
const validatorCache = new Map();

const getCachedValidator = (key: string, factory: () => ValidationChain[]) => {
  if (!validatorCache.has(key)) {
    validatorCache.set(key, createValidationMiddleware(factory()));
  }
  return validatorCache.get(key);
};
```

### 2. 异步验证优化

```typescript
// 对于需要数据库查询的验证，使用异步验证
body('email')
  .isEmail()
  .withMessage('邮箱格式无效')
  .custom(async (email) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('邮箱已被使用');
    }
    return true;
  })
```

## 最佳实践

1. **模块化组织**：按功能模块组织验证器，保持代码清晰
2. **复用验证规则**：提取通用验证规则，避免重复代码
3. **清晰的错误消息**：提供用户友好的错误提示
4. **性能考虑**：避免过度验证，合理使用异步验证
5. **文档维护**：及时更新验证规则文档
6. **测试覆盖**：为验证器编写单元测试
7. **向后兼容**：在兼容性模块中保持旧版验证规则

## 注意事项

1. 验证器顺序很重要，先验证格式，再验证业务逻辑
2. 使用适当的HTTP状态码（400用于验证错误）
3. 避免在验证器中暴露敏感信息
4. 考虑国际化支持，错误消息支持多语言
5. 定期审查和更新验证规则，确保安全性

通过遵循这些指南，您可以构建一个强大、灵活且易于维护的数据验证系统。