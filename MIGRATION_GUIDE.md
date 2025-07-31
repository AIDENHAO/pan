# 路由架构迁移指南

## 概述

本指南将帮助您从旧的路由架构迁移到新的模块化路由架构。新架构提供了更清晰的结构、更好的可维护性和更符合RESTful规范的API设计。

## 主要变更

### 🗂️ 文件结构变更

#### 旧架构
```
src/routes/
├── index.ts           # 混合了所有路由
└── databaseRoutes.ts  # 数据库相关路由
```

#### 新架构
```
src/routes/
├── index.ts           # 主路由入口
└── v2/                # 新版本路由
    ├── character/     # 角色管理模块
    ├── static-data/   # 静态数据模块
    ├── system/        # 系统管理模块
    ├── legacy/        # 兼容性模块
    └── README.md      # 详细文档
```

### 🔄 API路径变更

| 功能分类 | 旧路径 | 新路径 | 状态 |
|---------|--------|--------|------|
| **角色基础信息** |
| 获取角色信息 | `POST /api/get-person-info` | `GET /api/v2/character/base-info/:uuid` | ✅ 推荐 |
| 更新修炼值 | `POST /api/update-cultivation` | `PUT /api/v2/character/base-info/:uuid` | ✅ 推荐 |
| 更新境界等级 | `POST /api/update-realm-level` | `PUT /api/v2/character/base-info/:uuid` | ✅ 推荐 |
| **角色属性** |
| 角色亲和度 | `GET /api/database/character-affinities/:id` | `GET /api/v2/character/affinities/:uuid` | ✅ 推荐 |
| 角色强度 | `GET /api/database/character-strength/:id` | `GET /api/v2/character/strength/:uuid` | ✅ 推荐 |
| 角色技能 | `GET /api/database/character-skills/:id` | `GET /api/v2/character/skills/:uuid` | ✅ 推荐 |
| 角色武器 | `GET /api/database/character-weapons/:id` | `GET /api/v2/character/weapons/:uuid` | ✅ 推荐 |
| 角色货币 | `GET /api/database/character-currency/:id` | `GET /api/v2/character/currency/:uuid` | ✅ 推荐 |
| 角色物品 | `GET /api/database/character-items/:id` | `GET /api/v2/character/items/:uuid` | ✅ 推荐 |
| **静态数据** |
| 境界数据 | `GET /api/database/realms` | `GET /api/v2/static-data/realms` | ✅ 推荐 |
| 技能数据 | `GET /api/database/skills` | `GET /api/v2/static-data/skills` | ✅ 推荐 |
| 武器数据 | `GET /api/database/weapons` | `GET /api/v2/static-data/weapons` | ✅ 推荐 |
| 物品数据 | `GET /api/database/items` | `GET /api/v2/static-data/items` | ✅ 推荐 |
| 宗门数据 | `POST /api/get-zongmen-info` | `GET /api/v2/static-data/zongmen` | ✅ 推荐 |
| **系统管理** |
| 健康检查 | `GET /api/health` | `GET /api/v2/system/health` | ✅ 推荐 |
| 数据库统计 | `GET /api/database/stats` | `GET /api/v2/system/stats` | ✅ 推荐 |

### 🔧 HTTP方法规范化

新架构严格遵循RESTful规范：

| 操作 | HTTP方法 | 示例 |
|------|----------|------|
| 查询 | `GET` | `GET /api/v2/character/base-info/:uuid` |
| 创建 | `POST` | `POST /api/v2/character/base-info` |
| 更新 | `PUT` | `PUT /api/v2/character/base-info/:uuid` |
| 删除 | `DELETE` | `DELETE /api/v2/character/base-info/:uuid` |

## 迁移步骤

### 1. 前端代码迁移

#### 旧代码示例
```typescript
// 获取角色信息
const response = await fetch('/api/get-person-info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ character_id: '123' })
});

// 更新修炼值
const updateResponse = await fetch('/api/update-cultivation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    character_id: '123',
    cultivation_value: 1000 
  })
});
```

#### 新代码示例
```typescript
// 获取角色信息
const characterUuid = '550e8400-e29b-41d4-a716-446655440000';
const response = await fetch(`/api/v2/character/base-info/${characterUuid}`, {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
});

// 更新修炼值
const updateResponse = await fetch(`/api/v2/character/base-info/${characterUuid}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    cultivation_value: 1000 
  })
});
```

### 2. 服务器集成

#### 旧代码
```typescript
import express from 'express';
import routes from './routes/index.js';

const app = express();
app.use('/', routes);
```

#### 新代码
```typescript
import express from 'express';
import routes from './routes/index.js'; // 现在是新的v2架构

const app = express();
app.use('/', routes); // 自动包含兼容性支持
```

### 3. 渐进式迁移策略

#### 阶段1：保持兼容性（推荐）
- 新架构已包含兼容性模块 (`/api/v2/legacy/*`)
- 旧接口仍然可用，但会返回过时警告
- 可以逐步迁移前端代码

#### 阶段2：逐步迁移
1. **角色管理模块**：先迁移角色相关接口
2. **静态数据模块**：迁移境界、技能、武器等数据接口
3. **系统管理模块**：最后迁移系统相关接口

#### 阶段3：完全迁移
- 移除对兼容性接口的依赖
- 更新所有前端代码使用新接口
- 可选择性移除兼容性模块

## 兼容性支持

### 自动兼容
所有旧接口在新架构中仍然可用：

```bash
# 这些接口仍然工作，但会返回过时警告
POST /api/v2/legacy/get-person-info
POST /api/v2/legacy/update-cultivation
POST /api/v2/legacy/get-zongmen-info
```

### 过时警告
兼容接口会在响应头中包含过时信息：

```http
X-API-Deprecated: true
X-API-Deprecation-Date: 2024-01-01
X-API-Sunset-Date: 2024-06-01
X-API-Migration-Guide: https://docs.example.com/api/v2/migration
```

## 新功能优势

### 1. 更好的数据查询
```typescript
// 按范围查询境界
GET /api/v2/static-data/realms/by-level-range?min_level=1&max_level=5

// 按亲和度范围查询角色
GET /api/v2/character/affinities/by-range?min_fire=80&max_water=20

// 财富排行榜
GET /api/v2/character/currency/wealth-leaderboard?limit=10
```

### 2. 统计信息接口
```typescript
// 系统统计
GET /api/v2/system/stats

// 角色背包统计
GET /api/v2/character/items/inventory-stats/:character_uuid

// 宗门统计
GET /api/v2/static-data/zongmen/stats
```

### 3. 更好的错误处理
```json
{
  "success": false,
  "message": "角色不存在",
  "error_code": "CHARACTER_NOT_FOUND",
  "details": {
    "character_uuid": "invalid-uuid",
    "suggestion": "请检查角色UUID是否正确"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 测试迁移

### 1. 健康检查
```bash
# 检查新API是否正常工作
curl http://localhost:3001/api/v2/system/health
```

### 2. 兼容性测试
```bash
# 测试旧接口是否仍然工作
curl -X POST http://localhost:3001/api/v2/legacy/get-person-info \
  -H "Content-Type: application/json" \
  -d '{"character_id": "123"}'
```

### 3. 新接口测试
```bash
# 测试新接口
curl http://localhost:3001/api/v2/character/base-info
```

## 常见问题

### Q: 旧接口什么时候会被移除？
A: 兼容性接口计划在2024年6月1日后移除，建议在此之前完成迁移。

### Q: 如何处理UUID格式的角色ID？
A: 新架构使用UUID格式的角色标识符，如果您的系统使用数字ID，需要建立映射关系或更新数据库结构。

### Q: 新架构是否支持批量操作？
A: 是的，新架构提供了批量查询和操作的接口，详见各模块的API文档。

### Q: 如何监控迁移进度？
A: 可以通过检查服务器日志中的过时警告来监控哪些旧接口仍在使用。

## 支持资源

- 📚 **详细文档**: `/workspace/React-TypeScript/src/routes/v2/README.md`
- 🔧 **服务器示例**: `/workspace/React-TypeScript/src/routes/v2/server-example.ts`
- 🆘 **技术支持**: 联系开发团队
- 🐛 **问题报告**: 通过项目issue系统报告问题

---

**迁移建议**: 建议采用渐进式迁移策略，先在开发环境中测试新接口，确认无误后再逐步在生产环境中部署。