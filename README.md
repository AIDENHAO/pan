# 修仙宗门管理系统

一个基于 React + TypeScript + Express 构建的现代化修仙宗门管理应用，提供完整的前后端分离架构和丰富的功能模块。

## 🌟 项目特色

- **现代化技术栈**: React 18 + TypeScript + Express + Vite
- **完整的前后端分离**: RESTful API 设计
- **类型安全**: 全面的 TypeScript 类型定义
- **模块化架构**: 控制器模式 + 服务层设计
- **响应式界面**: 现代化的修仙主题 UI
- **热模块替换**: 开发环境下的快速迭代

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
- **CORS**: 跨域资源共享支持
- **JSON**: 数据存储格式

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
│   ├── controllers/        # 后端控制器
│   │   ├── BaseController.ts   # 基础控制器
│   │   ├── LeaderController.ts # 掌门控制器
│   │   ├── ZongmenController.ts # 宗门控制器
│   │   └── MappingController.ts # 映射数据控制器
│   ├── routes/             # API 路由
│   ├── services/           # 业务逻辑层
│   ├── data/              # JSON 数据文件
│   ├── types/             # TypeScript 类型定义
│   ├── styles/            # 样式文件
│   └── server/            # 服务器配置
├── public/                # 静态资源
├── docs/                  # 项目文档
└── package.json          # 项目依赖配置
```

## 🛠️ 安装与运行

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

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
- **控制器层**: 处理 HTTP 请求和响应
- **服务层**: 业务逻辑处理
- **数据层**: JSON 文件数据管理
- **类型层**: TypeScript 类型定义

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

2. **模块导入错误**
   - 确保使用 `.js` 扩展名导入 ES 模块
   - 检查 `tsconfig.json` 配置

3. **CORS 错误**
   - 后端已配置 CORS 支持
   - 确保前后端服务都在运行

4. **TypeScript 编译错误**
   - 检查类型定义是否正确
   - 运行 `npm run build` 查看详细错误信息

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