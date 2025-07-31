import { dbManager } from './src/database/config/database.js';

async function checkRealmStructure() {
  try {
    await dbManager.connect();
    console.log('✅ 数据库连接成功');
    
    // 查询表结构
    const structure = await dbManager.all('DESCRIBE realm_data');
    console.log('\n📋 realm_data 表字段名:');
    const fieldNames = structure.map((field: any) => field.Field);
    console.log(fieldNames.join(', '));
    
    console.log('\n📋 详细字段信息:');
    structure.forEach((field: any, index: number) => {
      console.log(`${field.Field}: ${field.Type}`);
    });
    
  } catch (error) {
    console.error('❌ 错误:', error);
  } finally {
    await dbManager.close();
  }
}

checkRealmStructure();