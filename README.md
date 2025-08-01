# 修仙宗门管理系统

一个基于 React + TypeScript + Express + MySQL 构建的现代化修仙宗门管理应用，提供完整的前后端分离架构、数据库连接池和丰富的功能模块。

## 🌟 项目特色

- **现代化技术栈**: React 18 + TypeScript + Express + MySQL + Vite
- **完整的前后端分离**: RESTful API 设计
- **类型安全**: 全面的 TypeScript 类型定义
- **四层架构设计**: 控制器-服务-DAL-数据库分层架构
- **数据库连接池**: MySQL连接池优化，支持高并发
- **响应式界面**: 现代化的修仙主题 UI
- **热模块替换**: 开发环境下的快速迭代
- **完整的数据持久化**: 17个数据库表，支持复杂业务逻辑

## 🚀 技术栈

### 前端
- **React 18**: 现代化的用户界面库
- **TypeScript**: 类型安全的 JavaScript 超集
- **Vite**: 快速的前端构建工具
- **React Router**: 单页应用路由管理
- **CSS3**: 现代化样式设计

### 后端
- **Node.js**: JavaScript 运行时环境
- **Express**: 轻量级 Web 应用框架
- **TypeScript**: 服务端类型安全
- **MySQL**: 关系型数据库，支持连接池
- **mysql2**: 高性能MySQL驱动
- **CORS**: 跨域资源共享支持

### 数据库
- **MySQL 8.0+**: 主数据库系统
- **连接池架构**: 支持并发连接，最大10个连接
- **事务支持**: 完整的ACID事务处理
- **17个数据表**: 完整的修仙游戏数据模型

## 📁 项目结构

```
React-TypeScript/
├── src/
│   ├── components/          # 可复用组件
│   ├── pages/              # 页面组件
│   │   ├── LeaderPage.tsx      # 掌门信息页面
│   │   ├── DisciplesPage.tsx   # 弟子管理页面
│   │   ├── ResourcesPage.tsx   # 宗门资源页面
│   │   └── ...
│   ├── controllers/        # 后端控制器层
│   │   ├── BaseController.ts   # 基础控制器
│   │   ├── LeaderController.ts # 掌门控制器
│   │   ├── ZongmenController.ts # 宗门控制器
│   │   └── DatabaseController.ts # 数据库控制器
│   ├── routes/             # API 路由层
│   ├── services/           # 业务逻辑服务层
│   ├── database/           # 数据库层
│   │   ├── config/             # 数据库配置
│   │   │   ├── database.ts         # 连接池配置
│   │   │   └── init.ts            # 数据库初始化
│   │   ├── implementations/    # DAL实现层
│   │   │   ├── DatabaseService.ts  # 数据库服务
│   │   │   ├── DALFactory.ts      # DAL工厂
│   │   │   └── CharacterDALs/     # 角色数据访问层
│   │   ├── interfaces/         # 数据库接口定义
│   │   ├── examples/          # 使用示例
│   │   └── README.md          # 数据库文档
│   ├── data/              # 静态数据文件
│   ├── types/             # TypeScript 类型定义
│   ├── styles/            # 样式文件
│   └── server/            # 服务器配置
├── public/                # 静态资源
├── docs/                  # 项目文档
│   ├── 数据库架构优化方案.md
│   ├── 数据库优化完成报告.md
│   └── 四层架构应用建议文档.md
├── CHANGELOG.md           # 项目变更日志
└── package.json          # 项目依赖配置
```

## 🛠️ 安装与运行

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0
- MySQL >= 8.0.0

### 数据库配置

1. **安装MySQL**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install mysql-server
   
   # macOS (使用Homebrew)
   brew install mysql
   
   # Windows: 下载MySQL安装包
   ```

2. **创建数据库**
   ```sql
   CREATE DATABASE xiuxian_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'xiuxian_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON xiuxian_db.* TO 'xiuxian_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **配置数据库连接**
   
   在 `src/database/config/database.ts` 中配置数据库连接信息：
   ```typescript
   const config = {
     host: 'localhost',
     user: 'xiuxian_user',
     password: 'your_password',
     database: 'xiuxian_db',
     connectionLimit: 10,
     queueLimit: 0
   };
   ```

### 安装依赖
```bash
npm install
```

### 开发环境运行

#### 启动前端开发服务器
```bash
npm run dev
```
前端服务将运行在: http://localhost:3004

#### 启动后端 TypeScript 服务器
```bash
npm run server
```
后端 API 服务将运行在: http://localhost:3015

#### 启动后端开发模式（带热重载）
```bash
npm run server:dev
```

#### 启动旧版 JavaScript 服务器（兼容模式）
```bash
npm run server:old
```

### 生产环境构建
```bash
npm run build
```

## 📚 API 文档

### 基础信息
- **Base URL**: `http://localhost:3015`
- **Content-Type**: `application/json`
- **请求方法**: 主要使用 POST

### API 端点

#### 1. 健康检查
```http
GET /api/health
```
**响应示例**:
```json
{
  "status": "ok",
  "timestamp": "2025-07-29T09:31:17.126Z",
  "port": 3015
}
```

#### 2. 获取掌门信息
```http
POST /api/get-person-info
```
**请求体**:
```json
{
  "id": "leader001"
}
```
**响应示例**:
```json
{
  "status": "success",
  "data": {
    "id": "leader_001",
    "name": "张青云",
    "title": "青云真人",
    "realmLevel": 20,
    "cultivationValue": 17,
    "skills": ["青云剑诀", "御剑术", "清心诀"],
    "canBreakthrough": true,
    "positionName": "宗主"
  },
  "message": "人物信息获取成功"
}
```

#### 3. 获取宗门信息
```http
POST /api/get-zongmen-info
```
**请求体**:
```json
{
  "id": "zongmen001"
}
```
**响应示例**:
```json
{
  "status": "success",
  "data": {
    "discipleCount": 156,
    "sectLevel": 4,
    "sectReputation": 8750,
    "disciples": [...],
    "resources": {
      "spiritStone": 15000,
      "herbs": 350,
      "magicWeapons": 42,
      "treasures": 18
    }
  },
  "message": "宗门信息获取成功"
}
```

#### 4. 更新修炼值
```http
POST /api/update-cultivation
```
**请求体**:
```json
{
  "id": "leader001",
  "increaseValue": 5
}
```

#### 5. 激活突破
```http
POST /api/activate-breakthrough
```
**请求体**:
```json
{
  "id": "leader001"
}
```

#### 6. 获取映射数据
```http
POST /api/get-mappings
```
**响应包含**: 境界等级映射、职位映射、功法技能数据

#### 7. 数据库统计信息
```http
GET /api/database/stats
```
**响应示例**:
```json
{
  "status": "success",
  "data": {
    "connectionPool": {
      "totalConnections": 10,
      "activeConnections": 2,
      "idleConnections": 8
    },
    "tables": {
      "character_base_info": 156,
      "character_cultivation": 156,
      "realm_data": 20
    },
    "health": "healthy"
  }
}
```

#### 8. 数据库健康检查
```http
GET /api/database/health
```
**响应示例**:
```json
{
  "status": "success",
  "data": {
    "database": "connected",
    "connectionPool": "healthy",
    "lastCheck": "2025-07-30T10:30:00.000Z"
  }
}
```

## 🎮 功能模块

### 掌门管理
- 查看掌门基本信息（姓名、称号、境界等级）
- 修炼值管理和增长
- 境界突破功能
- 技能展示

### 宗门管理
- 宗门基本信息展示
- 弟子数量和等级统计
- 宗门资源管理（灵石、草药、法器、宝物）
- 核心弟子信息

### 功法系统
- 功法技能大全
- 技能等级和属性展示
- 修炼要求和资源需求
- 技能分类和品级

### 其他功能
- 修炼指南
- 任务系统（开发中）
- 交易市场（开发中）
- 宗门事件（开发中）
- 系统设置

## 🔧 开发指南

### 代码规范
- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 代码规范
- 组件和函数命名采用驼峰命名法
- 接口和类型定义使用 PascalCase
- 常量使用 UPPER_SNAKE_CASE

### 项目架构

本项目采用四层架构设计，确保代码的可维护性和扩展性：

#### 1. 控制器层 (Controllers)
- 处理 HTTP 请求和响应
- 参数验证和错误处理
- 调用服务层进行业务处理
- 位置：`src/controllers/`

#### 2. 服务层 (Services)
- 业务逻辑处理和编排
- 跨DAL的复杂操作
- 数据转换和业务规则
- 位置：`src/services/`

#### 3. 数据访问层 (DAL)
- 数据库操作的抽象
- SQL查询和事务管理
- 数据模型映射
- 位置：`src/database/implementations/`

#### 4. 数据库层 (Database)
- MySQL连接池管理
- 数据库配置和初始化
- 连接健康检查
- 位置：`src/database/config/`

#### 数据库表结构

**角色相关表 (8个)**:
- `character_base_info` - 角色基础信息
- `character_cultivation` - 修炼信息
- `character_equipment` - 装备信息
- `character_inventory` - 背包物品
- `character_skills` - 角色技能
- `character_sect` - 宗门信息
- `character_relationships` - 人物关系
- `character_achievements` - 成就系统

**静态数据表 (9个)**:
- `realm_data` - 境界数据
- `skill_data` - 技能数据
- `item_data` - 物品数据
- `equipment_data` - 装备数据
- `sect_data` - 宗门数据
- `achievement_data` - 成就数据
- `cultivation_method_data` - 功法数据
- `location_data` - 地点数据
- `npc_data` - NPC数据

### 添加新功能
1. 在 `src/types/` 中定义相关类型
2. 在 `src/controllers/` 中创建控制器
3. 在 `src/routes/` 中添加路由
4. 在 `src/pages/` 中创建前端页面
5. 更新导航和路由配置

## 🐛 故障排除

### 常见问题

1. **端口冲突**
   - 前端默认端口: 3004
   - 后端默认端口: 3015
   - 可在配置文件中修改端口设置

2. **数据库连接问题**
   - 确保MySQL服务正在运行
   - 检查数据库配置信息是否正确
   - 验证用户权限和数据库是否存在
   - 查看连接池状态：`GET /api/database/health`

3. **模块导入错误**
   - 确保使用 `.js` 扩展名导入 ES 模块
   - 检查 `tsconfig.json` 配置
   - 运行 `npm run build` 编译TypeScript文件

4. **CORS 错误**
   - 后端已配置 CORS 支持
   - 确保前后端服务都在运行

5. **TypeScript 编译错误**
   - 检查类型定义是否正确
   - 运行 `npm run build` 查看详细错误信息
   - 确保所有必需字段都已定义

6. **数据库初始化问题**
   - 检查数据库表是否正确创建
   - 运行数据库初始化脚本
   - 验证外键约束和索引

### 性能优化建议

1. **数据库连接池**
   - 默认最大连接数：10
   - 根据并发需求调整 `connectionLimit`
   - 监控连接池使用情况

2. **查询优化**
   - 使用适当的索引
   - 避免N+1查询问题
   - 使用事务处理复杂操作

3. **缓存策略**
   - 静态数据可考虑内存缓存
   - 频繁查询的数据使用Redis缓存

### 版本更新

查看 [CHANGELOG.md](./CHANGELOG.md) 了解详细的版本更新信息和破坏性变更。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 创建 GitHub Issue
- 发送邮件至项目维护者

---

**享受修仙之旅！** 🧙‍♂️✨