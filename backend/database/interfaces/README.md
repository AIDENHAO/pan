# 数据库接口定义层 (Database Interface Layer)

## 概述

本目录包含了游戏数据库系统的完整接口定义层，提供了类型安全、模块化和可扩展的接口规范。接口定义层采用分层架构设计，支持依赖注入、事件驱动和配置管理等现代软件开发模式。

## 架构结构

```
interfaces/
├── index.ts          # 统一导出入口
├── types.ts          # 基础数据类型定义
├── dal.ts            # 数据访问层接口
├── service.ts        # 业务服务层接口
├── errors.ts         # 错误处理接口
├── config.ts         # 配置管理接口
├── events.ts         # 事件系统接口
├── api.ts            # API接口定义
└── README.md         # 本文档
```

## 接口层次说明

### 1. 基础类型层 (`types.ts`)

定义数据库表对应的TypeScript接口和基础数据类型。

**主要接口：**
- `CharacterBaseInfo` - 人物基础信息
- `CharacterAffinities` - 人物五行亲和度
- `CharacterStrength` - 人物强度属性
- `CharacterItems` - 人物物品
- `RealmData` - 境界数据
- `ItemData` - 物品数据
- `ZongmenData` - 宗门数据

**使用示例：**
```typescript
import { CharacterBaseInfo, CharacterItems } from './interfaces';

const character: CharacterBaseInfo = {
  character_uuid: 'char_001',
  character_name: '张三',
  character_gender: '男',
  character_realm_Level: 5,
  // ... 其他属性
};
```

### 2. 数据访问层 (`dal.ts`)

定义数据库操作的抽象接口，提供CRUD操作、事务管理和查询功能。

**主要接口：**
- `IBaseDAL<T>` - 基础数据访问接口
- `ICharacterDAL` - 人物数据访问接口
- `IStaticDataDAL<T>` - 静态数据访问接口
- `IDALFactory` - DAL工厂接口
- `ITransaction` - 事务接口

**使用示例：**
```typescript
import { ICharacterDAL, IDALFactory } from './interfaces';

class CharacterService {
  private characterDAL: ICharacterDAL;
  
  constructor(dalFactory: IDALFactory) {
    this.characterDAL = dalFactory.getCharacterDAL();
  }
  
  async getCharacter(uuid: string) {
    return await this.characterDAL.findByPrimaryKey(uuid);
  }
}
```

### 3. 业务服务层 (`service.ts`)

定义高级业务逻辑操作接口，封装复杂的业务流程。

**主要接口：**
- `IDatabaseService` - 数据库服务接口
- `ICacheService` - 缓存服务接口
- `IValidationService` - 验证服务接口
- `IBusinessRuleEngine` - 业务规则引擎接口
- `IPerformanceService` - 性能监控服务接口

**使用示例：**
```typescript
import { IDatabaseService } from './interfaces';

class GameController {
  constructor(private databaseService: IDatabaseService) {}
  
  async createCharacter(data: Partial<CharacterBaseInfo>) {
    const characterUuid = await this.databaseService.createCharacter(data);
    return { success: true, characterUuid };
  }
}
```

### 4. 错误处理层 (`errors.ts`)

定义系统中所有错误类型和异常处理规范。

**主要接口：**
- `ApplicationError` - 应用错误联合类型
- `IDatabaseError` - 数据库错误接口
- `IValidationError` - 验证错误接口
- `IBusinessError` - 业务逻辑错误接口
- `IErrorHandler` - 错误处理器接口

**使用示例：**
```typescript
import { ApplicationError, ErrorCodes } from './interfaces';

try {
  await service.createCharacter(data);
} catch (error: ApplicationError) {
  if (error.code === ErrorCodes.BIZ_CHARACTER_ALREADY_EXISTS) {
    console.log('人物已存在');
  }
}
```

### 5. 配置管理层 (`config.ts`)

定义系统配置相关的接口和类型。

**主要接口：**
- `IApplicationConfig` - 应用配置接口
- `IDatabaseConfig` - 数据库配置接口
- `IConfigProvider` - 配置提供者接口
- `IConfigManager` - 配置管理器接口

**使用示例：**
```typescript
import { IConfigManager, IDatabaseConfig } from './interfaces';

class DatabaseConnection {
  constructor(private configManager: IConfigManager) {}
  
  connect() {
    const dbConfig = this.configManager.getConfig().database;
    // 使用配置连接数据库
  }
}
```

### 6. 事件系统层 (`events.ts`)

定义事件发布订阅、事件处理和事件流相关的接口。

**主要接口：**
- `IDomainEvent<T>` - 领域事件接口
- `IEventBus` - 事件总线接口
- `IEventHandler<T>` - 事件处理器接口
- `IEventStore` - 事件存储接口

**使用示例：**
```typescript
import { IEventBus, CharacterCreatedEvent } from './interfaces';

class CharacterService {
  constructor(private eventBus: IEventBus) {}
  
  async createCharacter(data: any) {
    const character = await this.dal.create(data);
    
    // 发布事件
    await this.eventBus.publish({
      type: 'character.created',
      data: { characterUuid: character.character_uuid }
    });
    
    return character;
  }
}
```

### 7. API接口层 (`api.ts`)

定义前后端交互的API接口规范。

**主要接口：**
- `ICharacterApi` - 人物管理API接口
- `IInventoryApi` - 背包管理API接口
- `ICultivationApi` - 修炼系统API接口
- `IZongmenApi` - 宗门系统API接口

**使用示例：**
```typescript
import { ICharacterApi, CreateCharacterRequest } from './interfaces';

class CharacterController implements ICharacterApi {
  async createCharacter(request: CreateCharacterRequest) {
    // 实现创建人物逻辑
    return {
      success: true,
      data: { characterUuid: 'new_uuid' },
      timestamp: new Date().toISOString()
    };
  }
}
```

## 设计原则

### 1. 单一职责原则
每个接口专注于特定的功能领域，避免接口过于庞大。

### 2. 开闭原则
接口对扩展开放，对修改封闭，支持新功能的添加而不影响现有代码。

### 3. 依赖倒置原则
高层模块不依赖低层模块，都依赖于抽象接口。

### 4. 接口隔离原则
客户端不应该依赖它不需要的接口方法。

### 5. 类型安全
充分利用TypeScript的类型系统，提供编译时类型检查。

## 最佳实践

### 1. 接口使用

```typescript
// ✅ 好的做法：依赖接口而非具体实现
class Service {
  constructor(private dal: ICharacterDAL) {}
}

// ❌ 不好的做法：直接依赖具体实现
class Service {
  constructor(private dal: CharacterDAL) {}
}
```

### 2. 错误处理

```typescript
// ✅ 好的做法：使用类型化错误
try {
  await service.operation();
} catch (error: ApplicationError) {
  switch (error.type) {
    case 'VALIDATION_ERROR':
      // 处理验证错误
      break;
    case 'BUSINESS_ERROR':
      // 处理业务错误
      break;
  }
}

// ❌ 不好的做法：捕获通用错误
try {
  await service.operation();
} catch (error: any) {
  console.log(error.message);
}
```

### 3. 事件使用

```typescript
// ✅ 好的做法：使用类型化事件
const event: CharacterCreatedEvent = {
  id: uuid(),
  type: 'character.created',
  timestamp: new Date(),
  source: 'character-service',
  version: '1.0',
  aggregateId: characterUuid,
  aggregateType: 'Character',
  aggregateVersion: 1,
  data: { characterUuid, characterName }
};

// ❌ 不好的做法：使用无类型事件
const event = {
  type: 'character.created',
  data: { uuid: characterUuid }
};
```

## 扩展指南

### 添加新接口

1. 在相应的文件中定义新接口
2. 更新 `index.ts` 中的导出
3. 添加相应的文档和示例
4. 更新版本信息

### 修改现有接口

1. 评估变更的影响范围
2. 考虑向后兼容性
3. 更新相关的实现类
4. 更新测试用例
5. 更新文档

### 版本管理

- 主版本号：不兼容的API修改
- 次版本号：向后兼容的功能性新增
- 修订号：向后兼容的问题修正

## 测试策略

### 1. 接口契约测试
确保实现类符合接口定义的契约。

### 2. 类型测试
验证TypeScript类型定义的正确性。

### 3. 集成测试
测试不同接口层之间的协作。

## 性能考虑

### 1. 接口设计
- 避免过度抽象
- 合理使用泛型
- 考虑方法调用开销

### 2. 类型检查
- 利用TypeScript编译时检查
- 避免运行时类型检查

### 3. 内存使用
- 合理设计接口继承层次
- 避免循环引用

## 工具支持

### 1. IDE支持
- VSCode TypeScript插件
- 自动补全和类型检查
- 重构支持

### 2. 文档生成
- TypeDoc自动生成API文档
- JSDoc注释支持

### 3. 代码质量
- ESLint规则检查
- Prettier代码格式化
- 类型覆盖率检查

## 版本历史

### v2.0.0 (2024-12-19)
- 新增服务层接口定义
- 新增错误处理接口
- 新增配置管理接口
- 新增事件系统接口
- 新增API接口定义
- 完善类型定义
- 增强接口文档

### v1.0.0 (2024-12-18)
- 初始版本
- 基础DAL接口定义
- 基础类型定义

## 贡献指南

1. 遵循现有的代码风格和命名约定
2. 为新接口添加完整的JSDoc注释
3. 提供使用示例和测试用例
4. 更新相关文档
5. 确保向后兼容性

## 联系方式

如有问题或建议，请通过以下方式联系：
- 项目Issue跟踪
- 代码审查
- 技术讨论

---

*本文档随接口定义的更新而持续维护，请确保使用最新版本。*