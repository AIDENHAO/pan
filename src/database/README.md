# 数据库模块

这是一个基于MySQL的数据库访问层（DAL），专为修仙游戏设计，提供完整的人物管理、物品系统、宗门系统等功能。

## 目录结构

```
src/database/
├── config/           # 数据库配置和初始化
│   ├── database.ts   # 数据库连接管理
│   └── init.ts       # 数据库初始化脚本
├── interfaces/       # 接口定义
│   ├── types.ts      # 数据类型定义
│   └── dal.ts        # DAL接口定义
├── implementations/  # 具体实现
│   ├── BaseDAL.ts    # 基础DAL类
│   ├── CharacterDALs.ts # 人物相关DAL实现
│   ├── DALFactory.ts # DAL工厂和事务管理
│   └── DatabaseService.ts # 高级服务层
├── examples/         # 使用示例
│   └── usage.ts      # 完整使用示例
├── index.ts          # 模块入口
└── README.md         # 本文档
```

## 快速开始

### 1. 安装依赖

```bash
npm install mysql2 @types/mysql2 dotenv
```

### 2. 初始化数据库

```typescript
import { databaseService } from './src/database';

// 初始化数据库（会自动创建表结构）
await databaseService.initialize();
```

### 3. 创建人物

```typescript
import { databaseService, CreateCharacterData } from './src/database';

const characterData: CreateCharacterData = {
  baseInfo: {
    name: '张三',
    realmLevel: 1,
    cultivatingState: '未修练',
    cultivationLimitBase: 1000,
    cultivationLimitAdd: 0,
    cultivationValue: 0,
    cultivationOverLimit: false,
    cultivationSpeedBase: 10,
    cultivationSpeedAdd: 0,
    breakThroughEnabled: false,
    breakThroughItemsEnabled: false,
    breakThroughState: false,
    breakThroughFailNumb: 0,
    physicalAttributes: '金',
    zongMenJoinBool: false
  },
  affinities: {
    total_affinity: 100,
    metal_affinity: 20,
    wood_affinity: 15,
    water_affinity: 25,
    fire_affinity: 10,
    earth_affinity: 30
  }
  // ... 其他可选属性
};

const character = await databaseService.createCharacter(characterData);
console.log('创建的人物:', character);
```

### 4. 查询人物

```typescript
// 获取完整人物信息
const character = await databaseService.getCompleteCharacterInfo(characterId);

// 搜索人物
const characters = await databaseService.searchCharacters('张', 'name');

// 分页获取人物列表
const result = await databaseService.getCharacterList(1, 10);
```

### 5. 修炼和突破

```typescript
// 更新修炼值
await databaseService.updateCultivation(characterId, 500);

// 突破境界
await databaseService.breakthrough(characterId);
```

## 核心概念

### 1. 数据库架构

数据库采用三层架构设计：

- **人物核心系统**：管理人物基础信息、属性、技能等
- **静态配置数据**：境界、技能、武器、宗门等配置数据
- **物品分类系统**：物品管理和分类体系

### 2. DAL层次结构

```
IBaseDAL<T, K>           # 基础DAL接口
├── ICharacterDAL<T>     # 人物相关DAL接口
└── IStaticDataDAL<T>    # 静态数据DAL接口

BaseDAL<T, K>            # 基础DAL实现
├── CharacterDAL<T>      # 人物DAL基类
└── StaticDataDAL<T>     # 静态数据DAL基类
```

### 3. 事务管理

```typescript
import { dalFactory } from './src/database';

const transaction = dalFactory.createTransaction();

try {
  const result = await transaction.execute(async () => {
    // 在事务中执行多个操作
    const character = await dalFactory.getCharacterBaseInfoDAL().create(data);
    await dalFactory.getCharacterAffinitiesDAL().create(affinityData);
    return character;
  });
} catch (error) {
  // 事务会自动回滚
  console.error('事务执行失败:', error);
}
```

## 主要功能

### 人物管理

- ✅ 创建完整人物信息
- ✅ 查询人物详细信息
- ✅ 更新人物属性
- ✅ 删除人物（级联删除相关数据）
- ✅ 人物搜索和分页

### 修炼系统

- ✅ 修炼值管理
- ✅ 境界突破
- ✅ 五行亲和度
- ✅ 体质系统

### 物品系统

- ✅ 物品添加到背包
- ✅ 装备管理
- ✅ 物品分类
- ✅ 堆叠物品处理

### 宗门系统

- ✅ 宗门信息管理
- ✅ 宗门成员关系
- ✅ 宗门贡献系统

### 技能和武器

- ✅ 技能装备系统
- ✅ 武器管理
- ✅ 等级和经验系统

## API 参考

### DatabaseService

主要的服务类，提供高级业务逻辑操作。

#### 方法

- `initialize()`: 初始化数据库
- `createCharacter(data)`: 创建人物
- `getCompleteCharacterInfo(id)`: 获取完整人物信息
- `deleteCharacter(id)`: 删除人物
- `searchCharacters(term, type)`: 搜索人物
- `updateCultivation(id, value)`: 更新修炼值
- `breakthrough(id)`: 突破境界
- `addItemToCharacter(characterId, itemId, count)`: 添加物品
- `equipItem(characterId, itemInstanceId, slot)`: 装备物品
- `getStatistics()`: 获取统计信息

### DAL Factory

提供各种DAL实例的工厂类。

```typescript
import { dalFactory } from './src/database';

// 获取人物基础信息DAL
const characterDAL = dalFactory.getCharacterBaseInfoDAL();

// 获取物品DAL
const itemDAL = dalFactory.getItemDataDAL();

// 创建事务
const transaction = dalFactory.createTransaction();
```

## 数据类型

### 主要接口

- `CharacterBaseInfo`: 人物基础信息
- `CharacterAffinities`: 五行亲和度
- `CharacterStrength`: 强度属性
- `CharacterItems`: 人物物品
- `ItemData`: 物品数据
- `RealmData`: 境界数据
- `SkillData`: 技能数据
- `WeaponData`: 武器数据

### 查询选项

```typescript
interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

## 配置

### 数据库配置

```typescript
interface DatabaseConfig {
  host: string;         // 数据库主机
  port: number;         // 端口号
  user: string;         // 用户名
  password: string;     // 密码
  database: string;     // 数据库名
  charset?: string;     // 字符集
}

// 默认配置
const defaultConfig: DatabaseConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'your_password',
  database: 'cultivation_db',
  charset: 'utf8mb4'
};
```

### 自定义配置

```typescript
import { dbManager } from './src/database';

// 使用自定义配置
const customConfig = {
  host: 'localhost',
  port: 3306,
  user: 'game_user',
  password: 'secure_password',
  database: 'custom_game_db'
};

await dbManager.connect(customConfig);
```

## 错误处理

所有数据库操作都包含适当的错误处理：

```typescript
try {
  const character = await databaseService.createCharacter(data);
} catch (error) {
  if (error.message.includes('UNIQUE constraint failed')) {
    console.error('人物名称已存在');
  } else {
    console.error('创建人物失败:', error);
  }
}
```

## 性能优化

1. **连接池管理**：使用单例模式管理数据库连接
2. **事务支持**：批量操作使用事务提高性能
3. **索引优化**：关键字段建立索引
4. **分页查询**：大数据量查询支持分页
5. **缓存机制**：DAL实例缓存减少创建开销

## 注意事项

1. **外键约束**：删除人物会级联删除相关数据
2. **数据完整性**：所有写操作都有数据验证
3. **并发安全**：使用事务保证数据一致性
4. **资源管理**：记得在应用结束时关闭数据库连接

```typescript
// 应用结束时关闭连接
process.on('exit', async () => {
  await databaseService.close();
});
```

## 示例代码

完整的使用示例请参考 `examples/usage.ts` 文件，包含：

- 数据库初始化
- 人物创建和管理
- 修炼系统使用
- 物品管理
- 搜索和分页
- 统计信息获取

运行示例：

```bash
npx tsx src/database/examples/usage.ts
```

## 扩展开发

### 添加新的DAL

1. 在 `interfaces/types.ts` 中定义数据类型
2. 在 `implementations/CharacterDALs.ts` 中实现DAL类
3. 在 `DALFactory.ts` 中添加工厂方法
4. 在 `DatabaseService.ts` 中添加业务逻辑

### 添加新的业务逻辑

在 `DatabaseService.ts` 中添加新的方法，利用现有的DAL实现复杂的业务逻辑。

## 许可证

本项目采用 MIT 许可证。