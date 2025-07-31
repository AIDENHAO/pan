/**
 * Backend模块入口文件
 * 统一导出所有后端相关的模块和服务
 * @author React-TypeScript Backend Team
 * @version 1.0.0
 */

// 数据库相关
export * from './database';

// 控制器
export * from './controllers/BaseController';
export * from './controllers/DatabaseController';
export * from './controllers/LeaderController';
export * from './controllers/MappingController';
export * from './controllers/ZongmenController';

// 服务层 (暂时为空)

// 路由
export * from './routes';

// DAL接口 (暂时为空)

// 中间件
export * from './middleware/validation';

// 服务器启动
export * from './server/server';