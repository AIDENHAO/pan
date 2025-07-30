/**
 * 数据库重置和初始化脚本
 * 用于应用新的数据库结构
 */

import { dbInitializer } from './src/database/config/init.ts';
import { dbManager } from './src/database/config/database.ts';

async function resetAndInitializeDatabase() {
  try {
    console.log('开始重置数据库...');
    
    // 重置数据库（删除所有表）
    await dbInitializer.reset();
    console.log('数据库重置完成');
    
    // 重新初始化数据库（创建新表结构）
    await dbInitializer.initialize();
    console.log('数据库初始化完成');
    
    // 关闭数据库连接
    await dbManager.close();
    console.log('数据库连接已关闭');
    
    console.log('\n✅ 数据库结构更新成功！');
    console.log('新的表结构已应用，包括：');
    console.log('- 修正了 character_base_info 表中的 zongMenId 字段');
    console.log('- 应用了所有外键约束');
    console.log('- 创建了完整的修仙游戏数据库结构');
    
  } catch (error) {
    console.error('❌ 数据库重置失败:', error);
    process.exit(1);
  }
}

// 执行重置
resetAndInitializeDatabase();