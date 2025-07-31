# API v2 路由架构文档

## 概述

这是修仙应用的新版本API路由架构，采用模块化设计，提供更清晰的结构和更好的可维护性。

## 架构特点

### 🏗️ 模块化设计
- **角色管理** (`/character`): 处理角色相关的所有数据
- **静态数据** (`/static-data`): 管理游戏基础数据
- **系统管理** (`/system`): 系统状态和统计信息
- **兼容性** (`/legacy`): 保持与旧版API的兼容

### 📊 数据库表映射
每个模块都严格对应数据库表结构：

#### 角色管理模块
- `base-info.ts` → `character_base_info`
- `affinities.ts` → `character_affinities`
- `strength.ts` → `character_strength`
- `body-types.ts` → `character_body_types`
- `skills.ts` → `character_skills`
- `weapons.ts` → `character_weapons`
- `currency.ts` → `character_currency`
- `items.ts` → `character_items`

#### 静态数据模块
- `realms.ts` → `realm_data`
- `skills.ts` → `skill_data`
- `weapons.ts` → `weapon_data`
- `items.ts` → `item_data`
- `body-types.ts` → `body_type_data`
- `zongmen.ts` → `zongmen_data`
- `achievements.ts` → `achievement_data`
- `item-categories.ts` → `item_type_category`

### 🔄 RESTful API设计
所有接口遵循RESTful规范：
- `GET` - 查询数据
- `POST` - 创建数据
- `PUT` - 更新数据
- `DELETE` - 删除数据

## 目录结构

```
src/routes/v2/
├── index.ts                 # 主路由入口
├── character/               # 角色管理模块
│   ├── index.ts            # 角色模块主路由
│   ├── base-info.ts        # 角色基础信息
│   ├── affinities.ts       # 角色亲和度
│   ├── strength.ts         # 角色强度属性
│   ├── body-types.ts       # 角色体质类型
│   ├── skills.ts           # 角色技能
│   ├── weapons.ts          # 角色武器
│   ├── currency.ts         # 角色货币
│   └── items.ts            # 角色物品
├── static-data/            # 静态数据模块
│   ├── index.ts            # 静态数据主路由
│   ├── realms.ts           # 境界数据
│   ├── skills.ts           # 技能数据
│   ├── weapons.ts          # 武器数据
│   ├── items.ts            # 物品数据
│   ├── body-types.ts       # 体质类型数据
│   ├── zongmen.ts          # 宗门数据
│   ├── achievements.ts     # 成就数据
│   └── item-categories.ts  # 物品分类数据
├── system/                 # 系统管理模块
│   └── index.ts            # 系统管理路由
├── legacy/                 # 兼容性模块
│   └── index.ts            # 兼容旧版API
├── server-example.ts       # 服务器集成示例
└── README.md              # 本文档
```

## 使用方法

### 1. 基本集成

```typescript
import express from 'express';
import v2Routes from './routes/v2/index.js';

const app = express();

// 使用新版本路由
app.use('/', v2Routes);

app.listen(3001);
```

### 2. 完整集成示例

参考 `server-example.ts` 文件，包含：
- 中间件配置
- 错误处理
- 兼容性支持
- 优雅关闭

## API接口示例

### 角色管理

```bash
# 获取所有角色
GET /api/v2/character/base-info

# 获取特定角色信息
GET /api/v2/character/base-info/550e8400-e29b-41d4-a716-446655440000

# 创建新角色
POST /api/v2/character/base-info
{
  "character_name": "张三",
  "realm_level": 1,
  "cultivation_value": 0
}

# 更新角色信息
PUT /api/v2/character/base-info/550e8400-e29b-41d4-a716-446655440000
{
  "cultivation_value": 1000
}
```

### 静态数据

```bash
# 获取所有境界
GET /api/v2/static-data/realms

# 获取特定境界
GET /api/v2/static-data/realms/1

# 根据等级范围查询境界
GET /api/v2/static-data/realms/by-level-range?min_level=1&max_level=5
```

### 系统管理

```bash
# 健康检查
GET /api/v2/system/health

# 获取系统统计
GET /api/v2/system/stats

# 获取版本信息
GET /api/v2/system/version
```

## 迁移指南

### 从旧版API迁移

| 旧版接口 | 新版接口 | 说明 |
|---------|---------|------|
| `POST /get-person-info` | `GET /api/v2/character/base-info/:uuid` | 获取角色信息 |
| `POST /update-cultivation` | `PUT /api/v2/character/base-info/:uuid` | 更新修炼值 |
| `POST /get-zongmen-info` | `GET /api/v2/static-data/zongmen/:id` | 获取宗门信息 |
| `GET /character-affinities/:id` | `GET /api/v2/character/affinities/:uuid` | 获取角色亲和度 |

### 兼容性支持

所有旧版接口在 `/api/v2/legacy` 路径下仍然可用，但会返回过时警告：

```bash
# 兼容接口（不推荐）
POST /api/v2/legacy/get-person-info

# 响应头会包含：
X-API-Deprecated: true
X-API-Deprecation-Date: 2024-01-01
X-API-Sunset-Date: 2024-06-01
```

## 扩展指南

### 添加新模块

1. 在相应目录下创建新的路由文件
2. 实现CRUD操作
3. 在模块的 `index.ts` 中注册路由
4. 更新主路由文件

### 添加新接口

```typescript
// 在相应的路由文件中添加
router.get('/custom-endpoint', (req, res) => {
  // 实现逻辑
  databaseController.customMethod(req, res);
});
```

### 数据验证

建议使用中间件进行请求数据验证：

```typescript
import { body, validationResult } from 'express-validator';

const validateCharacter = [
  body('character_name').notEmpty().withMessage('角色名称不能为空'),
  body('realm_level').isInt({ min: 1 }).withMessage('境界等级必须是正整数'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

router.post('/base-info', validateCharacter, (req, res) => {
  databaseController.createCharacter(req, res);
});
```

## 最佳实践

### 1. 错误处理
- 统一的错误响应格式
- 适当的HTTP状态码
- 详细的错误信息

### 2. 性能优化
- 使用分页查询大量数据
- 实现缓存机制
- 数据库查询优化

### 3. 安全性
- 输入验证和清理
- 防止SQL注入
- 适当的权限控制

### 4. 文档维护
- 及时更新API文档
- 提供清晰的示例
- 版本变更记录

## 注意事项

1. **数据库连接**: 确保 `DatabaseController` 正确配置数据库连接
2. **环境变量**: 配置必要的环境变量（数据库连接、端口等）
3. **依赖管理**: 确保所有必要的npm包已安装
4. **类型安全**: 使用TypeScript类型定义确保类型安全
5. **测试**: 为新接口编写单元测试和集成测试

## 支持

如有问题或建议，请：
1. 查看本文档
2. 检查控制台错误信息
3. 使用健康检查接口验证系统状态
4. 联系开发团队

---

**版本**: 2.0.0  
**更新日期**: 2024年1月  
**维护者**: 开发团队