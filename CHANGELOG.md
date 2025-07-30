# 项目变更日志 (CHANGELOG)

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