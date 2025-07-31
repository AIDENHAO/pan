# API Core 模块

统一的前端API请求封装模块，提供标准化的HTTP请求接口和业务API方法。

## 📋 目录结构

```
src/api/
├── apiCore.ts          # 核心API类和业务方法
├── index.ts            # 统一导出文件
├── examples/
│   └── usage.ts        # 使用示例
└── README.md           # 文档说明
```

## 🚀 快速开始

### 基础导入

```typescript
import { 
  apiCore, 
  healthCheckApi, 
  leaderApi, 
  zongmenApi, 
  mappingApi, 
  databaseApi 
} from '@/api';
```

### 健康检查

```typescript
// 检查API服务状态
const healthStatus = await healthCheckApi.check();
console.log('服务状态:', healthStatus);
```

### 掌门相关API

```typescript
// 获取掌门信息
const leaderInfo = await leaderApi.getInfo();

// 更新修炼值
const cultivationResult = await leaderApi.updateCultivation({
  cultivationValue: 1000,
  cultivationType: 'qi_cultivation'
});

// 更新境界等级
const realmResult = await leaderApi.updateRealm({
  realmLevel: 5,
  realmName: '筑基期'
});
```

### 宗门信息

```typescript
// 获取宗门信息
const zongmenInfo = await zongmenApi.getInfo();
```

### 映射数据

```typescript
// 获取所有映射数据
const mappingData = await mappingApi.getAll();
```

### 数据库管理

```typescript
// 获取数据库统计
const stats = await databaseApi.getStats();

// 获取所有角色
const characters = await databaseApi.getCharacters();

// 获取所有境界
const realms = await databaseApi.getRealms();

// 获取所有技能
const skills = await databaseApi.getSkills();

// 获取所有武器
const weapons = await databaseApi.getWeapons();

// 获取所有物品
const items = await databaseApi.getItems();
```

## 🔧 高级用法

### 自定义请求配置

```typescript
import { apiCore, type IApiRequestConfig } from '@/api';

// 自定义请求配置
const config: IApiRequestConfig = {
  timeout: 10000,
  retries: 3,
  headers: {
    'Custom-Header': 'custom-value'
  }
};

// 使用自定义配置发送请求
const result = await apiCore.get('/api/custom-endpoint', config);
```

### 直接使用HTTP方法

```typescript
// GET 请求
const getData = await apiCore.get('/api/data');

// POST 请求
const postResult = await apiCore.post('/api/data', {
  name: '测试数据',
  value: 123
});

// PUT 请求
const putResult = await apiCore.put('/api/data/1', {
  name: '更新数据'
});

// DELETE 请求
const deleteResult = await apiCore.delete('/api/data/1');

// PATCH 请求
const patchResult = await apiCore.patch('/api/data/1', {
  status: 'active'
});
```

### 请求拦截器

```typescript
import { apiCore } from '@/api';

// 添加请求拦截器
apiCore.addRequestInterceptor((config) => {
  // 在请求发送前修改配置
  config.headers = {
    ...config.headers,
    'Authorization': `Bearer ${getToken()}`
  };
  return config;
});

// 添加响应拦截器
apiCore.addResponseInterceptor((response) => {
  // 处理响应数据
  console.log('响应数据:', response);
  return response;
});

// 添加错误拦截器
apiCore.addErrorInterceptor((error) => {
  // 处理错误
  if (error.status === 401) {
    // 处理未授权错误
    redirectToLogin();
  }
  return Promise.reject(error);
});
```

## 📊 API 端点配置

所有API端点都在 `API_ENDPOINTS` 常量中定义：

```typescript
export const API_ENDPOINTS = {
  // 健康检查
  HEALTH: '/api/health',
  
  // 掌门相关
  LEADER: {
    INFO: '/api/leader/info',
    UPDATE_CULTIVATION: '/api/leader/cultivation/update',
    UPDATE_REALM: '/api/leader/realm/update'
  },
  
  // 宗门相关
  ZONGMEN: {
    INFO: '/api/zongmen/info'
  },
  
  // 映射数据
  MAPPINGS: {
    ALL: '/api/mappings/all'
  },
  
  // 数据库管理
  DATABASE: {
    STATS: '/api/database/stats',
    CHARACTERS: '/api/database/characters',
    REALMS: '/api/database/realms',
    SKILLS: '/api/database/skills',
    WEAPONS: '/api/database/weapons',
    ITEMS: '/api/database/items'
  }
} as const;
```

## 🛠️ 配置选项

### API 配置

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
} as const;
```

### 请求配置接口

```typescript
interface IApiRequestConfig {
  timeout?: number;           // 请求超时时间（毫秒）
  retries?: number;          // 重试次数
  retryDelay?: number;       // 重试延迟（毫秒）
  headers?: Record<string, string>; // 自定义请求头
  params?: Record<string, any>;     // URL参数
  signal?: AbortSignal;      // 取消信号
}
```

## 🚨 错误处理

### 错误类型

```typescript
interface IApiError extends Error {
  code: string;              // 错误代码
  message: string;           // 错误消息
  status?: number;           // HTTP状态码
  details?: any;             // 错误详情
  requestId?: string;        // 请求ID
}
```

### 错误处理示例

```typescript
try {
  const result = await leaderApi.getInfo();
  console.log('成功:', result);
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    console.error('网络错误:', error.message);
  } else if (error.status === 404) {
    console.error('资源未找到:', error.message);
  } else {
    console.error('未知错误:', error);
  }
}
```

## 📝 最佳实践

### 1. 统一错误处理

```typescript
// 创建全局错误处理器
const handleApiError = (error: IApiError) => {
  switch (error.code) {
    case 'NETWORK_ERROR':
      showNotification('网络连接失败，请检查网络设置');
      break;
    case 'TIMEOUT_ERROR':
      showNotification('请求超时，请稍后重试');
      break;
    case 'VALIDATION_ERROR':
      showNotification('数据验证失败，请检查输入');
      break;
    default:
      showNotification('操作失败，请稍后重试');
  }
};

// 在组件中使用
try {
  const result = await leaderApi.getInfo();
  // 处理成功结果
} catch (error) {
  handleApiError(error);
}
```

### 2. 请求状态管理

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const result = await leaderApi.getInfo();
    // 处理成功结果
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### 3. 请求取消

```typescript
const controller = new AbortController();

try {
  const result = await apiCore.get('/api/data', {
    signal: controller.signal
  });
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('请求已取消');
  }
}

// 取消请求
controller.abort();
```

### 4. 缓存策略

```typescript
// 简单的内存缓存
const cache = new Map();

const getCachedData = async (key: string, fetcher: () => Promise<any>) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetcher();
  cache.set(key, data);
  return data;
};

// 使用缓存
const leaderInfo = await getCachedData('leader-info', () => 
  leaderApi.getInfo()
);
```

## 🧪 测试

运行使用示例：

```bash
# 运行API使用示例
npm run ts-node src/api/examples/usage.ts
```

## 📚 相关文档

- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Fetch API 文档](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [React 官方文档](https://reactjs.org/)

## 🤝 贡献指南

1. 遵循现有的代码风格和命名规范
2. 添加适当的 TypeScript 类型定义
3. 编写清晰的注释和文档
4. 确保错误处理的完整性
5. 添加相应的测试用例

## 📄 许可证

MIT License