# React-TypeScript Backend 后端模块

## 📁 目录结构

```
backend/
├── controllers/          # 控制器层 - 处理HTTP请求和响应
│   ├── BaseController.ts     # 基础控制器类
│   ├── DatabaseController.ts # 数据库操作控制器
│   ├── LeaderController.ts   # 掌门信息控制器
│   ├── MappingController.ts  # 映射数据控制器
│   └── ZongmenController.ts  # 宗门信息控制器
├── test-dal/             # DAL层测试 - 数据访问层测试
│   ├── baseDAL-manual-test.ts    # 基础DAL手动测试
│   ├── characterDALs-test.ts     # 角色DAL测试
│   ├── dal-crud-verification-test.ts # DAL CRUD验证测试
│   ├── dalFactory-test.ts        # DAL工厂测试
│   ├── realmDAL-test.ts          # 境界DAL测试
│   ├── run-baseDAL-test.ts       # 基础DAL测试运行器
│   ├── run-characterDALs-test.ts # 角色DAL测试运行器
│   ├── run-dalFactory-test.ts    # DAL工厂测试运行器
│   └── README.md                 # DAL测试说明文档
├── dal/                  # 数据访问层 - 数据库抽象接口
│   ├── implementations/     # DAL实现层
│   │   ├── BaseDAL.ts          # 基础DAL类
│   │   ├── CharacterDALs.ts    # 角色数据访问层
│   │   ├── DALFactory.ts       # DAL工厂类
│   │   └── DatabaseService.ts  # 数据库服务
│   └── interfaces/           # DAL接口定义
├── database/             # 数据库层 - 数据库连接和配置
│   ├── config/              # 数据库配置
│   ├── interfaces/          # 数据库接口
│   ├── scripts/             # 数据库脚本
│   ├── test/               # 数据库测试
│   └── testReport/         # 测试报告
├── middleware/           # 中间件层 - 请求处理中间件
│   └── validation/          # 数据验证中间件
├── routes/               # 路由层 - API路由定义
│   ├── index.ts            # 路由入口
│   └── v2/                 # API v2版本路由
├── server/               # 服务器层 - 服务器启动和配置
│   ├── server.js           # JavaScript服务器文件
│   └── server.ts           # TypeScript服务器文件
├── services/             # 服务层 - 业务逻辑处理
│   ├── leaderService.ts    # 掌门业务服务
│   └── peopleDataService.ts # 人员数据服务
├── test_api/             # API测试 - API接口测试
│   ├── api-crud-test.ts    # API CRUD操作测试
│   ├── character-crud-test.ts # 角色CRUD测试
│   ├── run-api-test.ts     # API测试运行器
│   └── simple-api-test.ts  # 简单API测试
├── test_controller/      # 控制器测试 - 控制器层测试
│   ├── controller-crud-test.ts # 控制器CRUD测试
│   ├── run-controller-test.ts  # 控制器测试运行器
│   ├── controller-test-report.md # 测试报告
│   └── README.md           # 测试说明文档
├── index.ts              # 后端模块入口文件
├── package.json          # 后端依赖配置
├── tsconfig.json         # TypeScript配置
└── README.md             # 本文档
```

## 🚀 快速开始

### 安装依赖
```bash
cd backend
npm install
```

### 开发模式启动
```bash
npm run dev
```

### 生产模式启动
```bash
npm run build
npm start
```

### 数据库测试
```bash
npm run db:test
```

### 数据库初始化
```bash
npm run db:init
```

## 🏗️ 架构设计

### 四层架构模式

1. **控制器层 (Controllers)**
   - 处理HTTP请求和响应
   - 参数验证和错误处理
   - 调用服务层处理业务逻辑

2. **服务层 (Services)**
   - 实现核心业务逻辑
   - 数据处理和转换
   - 调用数据访问层

3. **数据访问层 (DAL)**
   - 提供数据库操作的抽象接口
   - 封装SQL查询和事务处理
   - 数据模型映射

4. **数据库层 (Database)**
   - 数据库连接管理
   - 连接池配置
   - 数据库脚本和迁移

## 📝 代码规范

### 命名规范
- **文件名**: 使用PascalCase，如 `LeaderController.ts`
- **类名**: 使用PascalCase，如 `class LeaderController`
- **方法名**: 使用camelCase，如 `getLeaderInfo()`
- **变量名**: 使用camelCase，如 `leaderData`
- **常量名**: 使用UPPER_SNAKE_CASE，如 `MAX_RETRY_COUNT`

### 注释规范
- 使用JSDoc格式注释
- 每个类和公共方法都要有注释
- 注释要说明功能、参数、返回值

### 类型安全
- 严格使用TypeScript类型
- 定义接口和类型别名
- 避免使用any类型

## 🔧 配置说明

### 环境变量
在根目录的`.env`文件中配置：
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database

# 服务器配置
PORT=3000
NODE_ENV=development
```

### TypeScript配置
- 目标版本: ES2020
- 模块系统: ESNext
- 严格模式: 启用
- 路径映射: 支持@别名

## 🧪 测试

### 运行测试
```bash
# 运行所有测试
npm test

# 运行API测试
npm run test:api

# 运行控制器测试
npm run test:controller

# 运行DAL层测试
npm run test:dal

# 运行所有后端测试
npm run test:all
```

### 测试覆盖率
```bash
npm run test:coverage
```

## 📚 API文档

详细的API文档请参考各控制器文件中的注释，或访问开发服务器的API文档页面。

## 🤝 贡献指南

1. 遵循现有的代码风格和架构模式
2. 添加适当的单元测试
3. 更新相关文档
4. 提交前运行测试确保通过

## 📄 许可证

MIT License