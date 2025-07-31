# 项目变更日志 (CHANGELOG)

## [v2.1.0] - 2025-07-30

### 🚀 新功能

#### 静态数据CRUD API实现
- **[NEW]** 为静态数据添加完整的CRUD API支持
- **[NEW]** 实现境界、技能、武器、物品数据的增删改查接口
- **[NEW]** 实现体质、宗门、成就、物品分类数据的增删改查接口
- **[IMPROVED]** 扩展StaticDataDAL类，继承BaseDAL获得完整CRUD功能
- **[NEW]** 添加前端CRUD操作按钮和样式
- **[NEW]** 前端静态数据CRUD操作完全指向正确的API端点

### 📋 API端点新增

#### 境界数据管理
- `POST /api/database/realms` - 创建境界数据
- `PUT /api/database/realms/:id` - 更新境界数据
- `DELETE /api/database/realms/:id` - 删除境界数据

#### 技能数据管理
- `POST /api/database/skills` - 创建技能数据
- `PUT /api/database/skills/:id` - 更新技能数据
- `DELETE /api/database/skills/:id` - 删除技能数据

#### 武器数据管理
- `POST /api/database/weapons` - 创建武器数据
- `PUT /api/database/weapons/:id` - 更新武器数据
- `DELETE /api/database/weapons/:id` - 删除武器数据

#### 物品数据管理
- `POST /api/database/items` - 创建物品数据
- `PUT /api/database/items/:id` - 更新物品数据
- `DELETE /api/database/items/:id` - 删除物品数据

#### 体质数据管理
- `POST /api/database/body-types` - 创建体质数据
- `PUT /api/database/body-types/:id` - 更新体质数据
- `DELETE /api/database/body-types/:id` - 删除体质数据

#### 宗门数据管理
- `POST /api/database/zongmen` - 创建宗门数据
- `PUT /api/database/zongmen/:id` - 更新宗门数据
- `DELETE /api/database/zongmen/:id` - 删除宗门数据

#### 成就数据管理
- `POST /api/database/achievements` - 创建成就数据
- `PUT /api/database/achievements/:id` - 更新成就数据
- `DELETE /api/database/achievements/:id` - 删除成就数据

#### 物品分类管理
- `POST /api/database/item-categories` - 创建物品分类
- `PUT /api/database/item-categories/:id` - 更新物品分类
- `DELETE /api/database/item-categories/:id` - 删除物品分类

### 📁 文件变更详情

#### 修改文件
- `src/database/implementations/BaseDAL.ts`
  - 修改StaticDataDAL类继承BaseDAL
  - 移除重复的查询方法实现
  - 添加完整CRUD功能支持

- `src/controllers/DatabaseController.ts`
  - 添加静态数据CRUD控制器方法
  - 新增体质、宗门、成就、物品分类的完整CRUD方法
  - 包含参数验证和错误处理
  - 实现createRealmData、updateRealmData、deleteRealmData等方法
  - 添加完整的错误处理和HTTP状态码

- `src/routes/databaseRoutes.ts`
  - 添加静态数据CRUD路由配置
  - 支持POST/PUT/DELETE操作
  - 新增体质、宗门、成就、物品分类的完整路由
  - 支持RESTful API设计规范
  - 统一路由命名和参数格式

- `src/pages/DatabaseManagementPage.tsx`
  - 实现前端CRUD操作界面
  - 添加编辑、删除、新增功能按钮
  - 完善handleEdit和handleAdd函数实现
  - 支持所有静态数据类型的CRUD操作
  - 添加CRUD操作按钮（新增、编辑、删除）
  - 实现删除功能的API调用和确认对话框
  - 添加数据刷新和错误处理机制

- `src/styles/DatabaseManagementPage.css`
  - 添加CRUD按钮样式定义
  - 实现响应式设计和悬停效果
  - 支持高对比度模式

### 🔧 技术特点
- **类型安全**：完整的TypeScript类型定义
- **错误处理**：统一的错误处理和HTTP状态码
- **RESTful设计**：遵循REST API设计规范
- **用户体验**：友好的确认对话框和操作反馈
- **可扩展性**：为新增和编辑功能预留接口

---

## [v2.0.0] - 2025-07-30

### 🚀 重大更新

#### 数据库架构全面优化
- **[BREAKING]** 将MySQL数据库连接从单连接模式升级为连接池架构
- **[NEW]** 添加连接池配置参数：`connectionLimit`、`queueLimit`
- **[NEW]** 实现数据库健康检查和连接池状态监控
- **[IMPROVED]** 优化错误处理和连接重试机制

#### 代码清理与文档更新
- **[REMOVED]** 清理所有SQLite相关的残余代码和配置
- **[UPDATED]** 更新数据库相关文档，统一为MySQL配置
- **[FIXED]** 修复TypeScript编译错误（缺少gender字段）

### 📁 文件变更详情

#### 新增文件
- `docs/数据库架构优化方案.md` - 数据库优化方案文档
- `docs/数据库优化完成报告.md` - 优化完成总结报告
- `CHANGELOG.md` - 项目变更日志（本文件）

#### 修改文件
- `src/database/config/database.ts`
  - 重构DatabaseManager类，支持连接池
  - 添加健康检查和状态监控方法
  - 优化错误处理机制

- `src/database/README.md`
  - 移除SQLite相关安装说明
  - 更新为MySQL配置示例

- `docs/四层架构应用建议文档.md`
  - 替换SQLite配置为MySQL
  - 更新数据库层描述

- `src/database/examples/usage.ts`
  - 修复缺少gender字段的编译错误

### 🔧 技术改进

#### 连接池配置
```typescript
// 新的连接池默认配置
connectionLimit: 10,     // 最大并发连接数
queueLimit: 0,          // 队列限制
connectTimeout: 60000   // 连接超时时间
```

#### 新增方法
- `DatabaseManager.getPool()` - 获取连接池实例
- `DatabaseManager.isPoolConnected()` - 检查连接池状态
- `DatabaseManager.getPoolStatus()` - 获取连接池状态信息
- `DatabaseManager.healthCheck()` - 数据库健康检查

### 📊 性能提升

1. **并发处理能力** - 连接池支持多个并发数据库操作
2. **资源管理优化** - 自动管理连接资源，防止连接泄漏
3. **错误恢复机制** - 改进的错误处理和重连机制
4. **向后兼容性** - 保持所有现有DAL方法不变

### 🧪 测试验证

- ✅ 数据库连接池测试通过
- ✅ TypeScript编译无错误
- ✅ 前端React开发服务器正常运行
- ✅ 后端API服务器正常提供接口
- ✅ 数据库查询和统计功能正常

### 🔄 向后兼容性

- 所有现有的DAL方法保持不变
- 服务层接口完全兼容
- 控制器层无需修改
- 现有测试代码可正常运行

---

## [v1.0.0] - 2025-07-29

### 🎉 初始版本

#### 核心功能
- **[NEW]** React + TypeScript 前端框架
- **[NEW]** Express.js 后端API服务
- **[NEW]** MySQL数据库集成
- **[NEW]** 四层架构设计（控制器-服务-DAL-数据库）

#### 修仙游戏系统
- **[NEW]** 角色管理系统（创建、查询、更新、删除）
- **[NEW]** 修炼系统（境界、突破、修炼值）
- **[NEW]** 物品装备系统
- **[NEW]** 宗门管理系统
- **[NEW]** 技能武器系统

#### 数据库表结构
- 角色相关表：8个（character_base_info等）
- 静态数据表：9个（realm_data、skill_data等）
- 完整的外键约束和级联操作

#### 前端页面
- 掌门信息页面
- 弟子管理页面
- 数据库管理页面
- 修炼指南页面
- 资源管理页面
- 设置页面

---

## 版本说明

- **[BREAKING]** - 破坏性变更，可能需要代码修改
- **[NEW]** - 新功能
- **[IMPROVED]** - 功能改进
- **[FIXED]** - 错误修复
- **[REMOVED]** - 移除功能
- **[UPDATED]** - 文档或配置更新