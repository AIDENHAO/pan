/**
 * 验证中间件使用示例
 * 展示如何在实际路由中正确使用验证器
 */
import { Router, Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import {
  createValidationMiddleware,
  handleValidationErrors,
  validateUUID,
  createDynamicValidators
} from './index.js';

// ==================== 基础使用示例 ====================

/**
 * 示例1：简单的参数验证
 */
const exampleRouter1 = Router();

// 单个验证器
const validateUserId = [
  param('user_id')
    .isUUID()
    .withMessage('用户ID必须是有效的UUID')
];

exampleRouter1.get('/users/:user_id', 
  validateUserId,
  handleValidationErrors,
  (req: Request, res: Response) => {
    res.json({ message: '获取用户信息成功', userId: req.params.user_id });
  }
);

/**
 * 示例2：复杂的请求体验证
 */
const validateCreateUser = createValidationMiddleware([
  body('username')
    .notEmpty()
    .withMessage('用户名不能为空')
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名长度必须在3-20个字符之间')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('用户名只能包含字母、数字和下划线'),
    
  body('email')
    .isEmail()
    .withMessage('邮箱格式无效')
    .normalizeEmail(),
    
  body('age')
    .optional()
    .isInt({ min: 18, max: 120 })
    .withMessage('年龄必须是18-120之间的整数'),
    
  body('profile')
    .optional()
    .isObject()
    .withMessage('个人资料必须是对象格式'),
    
  body('profile.bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('个人简介不能超过500个字符'),
    
  body('tags')
    .optional()
    .isArray()
    .withMessage('标签必须是数组格式')
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error('标签数量不能超过10个');
      }
      return true;
    })
]);

exampleRouter1.post('/users', 
  validateCreateUser,
  (req: Request, res: Response) => {
    res.json({ message: '用户创建成功', data: req.body });
  }
);

/**
 * 示例3：查询参数验证
 */
const validateUserQuery = createValidationMiddleware([
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('页码必须是正整数'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('每页数量必须是1-100之间的整数'),
    
  query('sort')
    .optional()
    .isIn(['name', 'email', 'created_at', 'updated_at'])
    .withMessage('排序字段无效'),
    
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('排序方向必须是asc或desc'),
    
  query('search')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('搜索关键词长度必须在1-50个字符之间'),
    
  query('status')
    .optional()
    .isIn(['active', 'inactive', 'pending'])
    .withMessage('状态必须是active、inactive或pending')
]);

exampleRouter1.get('/users', 
  validateUserQuery,
  (req: Request, res: Response) => {
    res.json({ 
      message: '获取用户列表成功', 
      query: req.query,
      pagination: {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10
      }
    });
  }
);

// ==================== 高级使用示例 ====================

/**
 * 示例4：条件验证
 */
const conditionalValidation = (req: Request, res: Response, next: NextFunction) => {
  const userType = req.body.type;
  
  // 根据用户类型应用不同的验证规则
  if (userType === 'admin') {
    const adminValidation = createValidationMiddleware([
      body('permissions')
        .isArray()
        .withMessage('管理员权限必须是数组格式'),
      body('department')
        .notEmpty()
        .withMessage('管理员必须指定部门')
    ]);
    return adminValidation(req, res, next);
  } else if (userType === 'customer') {
    const customerValidation = createValidationMiddleware([
      body('company')
        .optional()
        .isString()
        .withMessage('公司名称必须是字符串'),
      body('phone')
        .isMobilePhone('zh-CN')
        .withMessage('手机号格式无效')
    ]);
    return customerValidation(req, res, next);
  }
  
  next();
};

exampleRouter1.post('/users/conditional', 
  body('type').isIn(['admin', 'customer']).withMessage('用户类型无效'),
  handleValidationErrors,
  conditionalValidation,
  (req: Request, res: Response) => {
    res.json({ message: '条件验证成功', data: req.body });
  }
);

/**
 * 示例5：异步验证
 */
const asyncValidation = createValidationMiddleware([
  body('email')
    .isEmail()
    .withMessage('邮箱格式无效')
    .custom(async (email) => {
      // 模拟数据库查询
      const existingUser = await new Promise(resolve => 
        setTimeout(() => resolve(email === 'test@example.com'), 100)
      );
      
      if (existingUser) {
        throw new Error('邮箱已被使用');
      }
      return true;
    }),
    
  body('username')
    .notEmpty()
    .withMessage('用户名不能为空')
    .custom(async (username) => {
      // 模拟用户名唯一性检查
      const isUnique = await new Promise(resolve => 
        setTimeout(() => resolve(username !== 'admin'), 100)
      );
      
      if (!isUnique) {
        throw new Error('用户名已被使用');
      }
      return true;
    })
]);

exampleRouter1.post('/users/async', 
  asyncValidation,
  (req: Request, res: Response) => {
    res.json({ message: '异步验证成功', data: req.body });
  }
);

/**
 * 示例6：动态验证器生成
 */
const dynamicValidationExample = () => {
  // 根据配置动态生成验证器
  const config = {
    requiredFields: ['name', 'email'],
    optionalFields: ['phone', 'address'],
    numericFields: ['age'],
    stringFields: ['name', 'email', 'phone', 'address'],
    emailFields: ['email'],
    phoneFields: ['phone']
  };
  
  return createDynamicValidators(config);
};

exampleRouter1.post('/users/dynamic', 
  dynamicValidationExample(),
  (req: Request, res: Response) => {
    res.json({ message: '动态验证成功', data: req.body });
  }
);

/**
 * 示例7：文件上传验证
 */
const validateFileUpload = createValidationMiddleware([
  body('title')
    .notEmpty()
    .withMessage('文件标题不能为空')
    .isLength({ max: 100 })
    .withMessage('文件标题不能超过100个字符'),
    
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('文件描述不能超过500个字符'),
    
  body('category')
    .isIn(['image', 'document', 'video', 'audio', 'other'])
    .withMessage('文件类别无效'),
    
  body('tags')
    .optional()
    .isArray()
    .withMessage('标签必须是数组格式')
    .custom((tags) => {
      if (tags && tags.some((tag: any) => typeof tag !== 'string')) {
        throw new Error('所有标签必须是字符串');
      }
      return true;
    }),
    
  // 自定义文件验证
  body('file_info')
    .isObject()
    .withMessage('文件信息必须是对象格式')
    .custom((fileInfo) => {
      const { size, type, name } = fileInfo;
      
      // 文件大小限制（10MB）
      if (size > 10 * 1024 * 1024) {
        throw new Error('文件大小不能超过10MB');
      }
      
      // 文件类型限制
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif',
        'application/pdf', 'text/plain',
        'video/mp4', 'audio/mp3'
      ];
      
      if (!allowedTypes.includes(type)) {
        throw new Error('不支持的文件类型');
      }
      
      // 文件名验证
      if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
        throw new Error('文件名只能包含字母、数字、点号、下划线和连字符');
      }
      
      return true;
    })
]);

exampleRouter1.post('/files/upload', 
  validateFileUpload,
  (req: Request, res: Response) => {
    res.json({ message: '文件上传验证成功', data: req.body });
  }
);

/**
 * 示例8：批量操作验证
 */
const validateBatchOperation = createValidationMiddleware([
  body('operation')
    .isIn(['create', 'update', 'delete'])
    .withMessage('操作类型必须是create、update或delete'),
    
  body('items')
    .isArray({ min: 1, max: 100 })
    .withMessage('操作项目必须是数组，且数量在1-100之间'),
    
  body('items.*')
    .isObject()
    .withMessage('每个操作项目必须是对象'),
    
  body('items.*.id')
    .optional()
    .custom((value, { req, path }) => {
      const operation = req.body.operation;
      if ((operation === 'update' || operation === 'delete') && !value) {
        throw new Error('更新和删除操作必须提供ID');
      }
      if (value && !validateUUID(value)) {
        throw new Error('ID必须是有效的UUID');
      }
      return true;
    }),
    
  body('items.*.data')
    .optional()
    .isObject()
    .withMessage('操作数据必须是对象'),
    
  body('options')
    .optional()
    .isObject()
    .withMessage('操作选项必须是对象'),
    
  body('options.validate_all')
    .optional()
    .isBoolean()
    .withMessage('全部验证标志必须是布尔值'),
    
  body('options.stop_on_error')
    .optional()
    .isBoolean()
    .withMessage('遇错停止标志必须是布尔值')
]);

exampleRouter1.post('/batch', 
  validateBatchOperation,
  (req: Request, res: Response) => {
    res.json({ message: '批量操作验证成功', data: req.body });
  }
);

/**
 * 示例9：嵌套对象验证
 */
const validateNestedObject = createValidationMiddleware([
  body('user')
    .isObject()
    .withMessage('用户信息必须是对象'),
    
  body('user.profile')
    .isObject()
    .withMessage('用户资料必须是对象'),
    
  body('user.profile.personal')
    .isObject()
    .withMessage('个人信息必须是对象'),
    
  body('user.profile.personal.name')
    .notEmpty()
    .withMessage('姓名不能为空')
    .isLength({ min: 2, max: 50 })
    .withMessage('姓名长度必须在2-50个字符之间'),
    
  body('user.profile.personal.age')
    .isInt({ min: 1, max: 150 })
    .withMessage('年龄必须是1-150之间的整数'),
    
  body('user.profile.contact')
    .isObject()
    .withMessage('联系信息必须是对象'),
    
  body('user.profile.contact.email')
    .isEmail()
    .withMessage('邮箱格式无效'),
    
  body('user.profile.contact.phones')
    .isArray()
    .withMessage('电话号码必须是数组'),
    
  body('user.profile.contact.phones.*')
    .isMobilePhone('any')
    .withMessage('电话号码格式无效'),
    
  body('user.preferences')
    .optional()
    .isObject()
    .withMessage('用户偏好必须是对象'),
    
  body('user.preferences.language')
    .optional()
    .isIn(['zh-CN', 'en-US', 'ja-JP'])
    .withMessage('语言必须是zh-CN、en-US或ja-JP'),
    
  body('user.preferences.theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('主题必须是light、dark或auto')
]);

exampleRouter1.post('/users/nested', 
  validateNestedObject,
  (req: Request, res: Response) => {
    res.json({ message: '嵌套对象验证成功', data: req.body });
  }
);

/**
 * 示例10：自定义错误处理
 */
const customErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value,
      location: error.location
    }));
    
    return res.status(400).json({
      success: false,
      message: '数据验证失败',
      errors: formattedErrors,
      errorCount: formattedErrors.length,
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || 'unknown'
    });
  }
  next();
};

exampleRouter1.post('/users/custom-error', 
  body('name').notEmpty().withMessage('姓名不能为空'),
  body('email').isEmail().withMessage('邮箱格式无效'),
  customErrorHandler,
  (req: Request, res: Response) => {
    res.json({ message: '自定义错误处理验证成功', data: req.body });
  }
);

export default exampleRouter1;

// ==================== 使用说明 ====================

/*
使用这些示例的方法：

1. 在你的主应用中导入示例路由：
   import exampleRoutes from './middleware/validation/examples.js';
   app.use('/api/examples', exampleRoutes);

2. 测试不同的验证场景：
   - GET /api/examples/users?page=1&limit=10&sort=name&order=asc
   - POST /api/examples/users { "username": "test", "email": "test@example.com" }
   - POST /api/examples/users/conditional { "type": "admin", "permissions": ["read", "write"] }
   - POST /api/examples/users/async { "email": "unique@example.com", "username": "unique" }
   - POST /api/examples/files/upload { "title": "测试文件", "category": "image", "file_info": {...} }
   - POST /api/examples/batch { "operation": "create", "items": [...] }
   - POST /api/examples/users/nested { "user": { "profile": {...} } }

3. 观察不同的错误响应格式和验证行为

4. 根据你的需求修改和扩展这些示例
*/

// ==================== 性能优化提示 ====================

/*
性能优化建议：

1. 缓存验证器：
   const validatorCache = new Map();
   const getCachedValidator = (key, factory) => {
     if (!validatorCache.has(key)) {
       validatorCache.set(key, factory());
     }
     return validatorCache.get(key);
   };

2. 避免过度验证：
   - 只验证必要的字段
   - 使用 optional() 对可选字段进行验证
   - 合理设置字符串长度限制

3. 异步验证优化：
   - 使用数据库连接池
   - 实现验证结果缓存
   - 设置合理的超时时间

4. 错误处理优化：
   - 使用统一的错误格式
   - 避免暴露敏感信息
   - 提供用户友好的错误消息
*/