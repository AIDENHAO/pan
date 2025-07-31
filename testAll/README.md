# 项目测试规范文档

## 目录结构

```
testAll/
├── testData/          # 测试数据目录
├── testScript/        # 测试脚本目录
├── testReport/        # 测试报告目录
└── README.md          # 本文档
```

## 测试规范约束

### 1. 命名规范

#### 测试脚本命名
- **格式**: `{功能描述}_{测试类型}_testAll.{扩展名}`
- **示例**: 
  - `database_connection_testAll.ts`
  - `api_validation_testAll.js`
  - `user_authentication_testAll.ts`

#### 测试报告命名
- **格式**: `{功能描述}_{测试类型}_testAll_report.{扩展名}`
- **示例**:
  - `database_connection_testAll_report.md`
  - `api_validation_testAll_report.json`
  - `user_authentication_testAll_report.html`

#### 测试数据命名
- **格式**: `{功能描述}_{数据类型}_testAll_data.{扩展名}`
- **示例**:
  - `database_connection_testAll_data.json`
  - `api_validation_testAll_data.sql`
  - `user_authentication_testAll_data.csv`

### 2. 测试脚本要求

#### 2.1 数据一致性检查
- 测试脚本必须验证测试数据与目标功能的一致性
- 在测试开始前检查数据格式、类型、范围等
- 确保测试数据符合业务逻辑要求

```typescript
// 示例：数据一致性检查
function validateTestData(testData: any): boolean {
  // 检查数据格式
  if (!testData || typeof testData !== 'object') {
    throw new Error('测试数据格式不正确');
  }
  
  // 检查必要字段
  const requiredFields = ['id', 'name', 'type'];
  for (const field of requiredFields) {
    if (!(field in testData)) {
      throw new Error(`缺少必要字段: ${field}`);
    }
  }
  
  return true;
}
```

#### 2.2 测试退出机制
- 所有测试脚本必须包含明确的退出机制
- 测试完成后必须调用 `process.exit()` 或等效方法
- 异常情况下也要确保程序正常退出

```typescript
// 示例：测试退出机制
async function runTest() {
  try {
    // 执行测试逻辑
    await performTests();
    console.log('测试完成');
    process.exit(0);
  } catch (error) {
    console.error('测试失败:', error);
    process.exit(1);
  }
}
```

#### 2.3 现场恢复机制
- 测试结束后必须恢复测试前的环境状态
- 清理测试过程中创建的临时数据
- 恢复被修改的配置文件或数据库状态

```typescript
// 示例：现场恢复机制
class TestEnvironment {
  private originalState: any;
  
  async setup() {
    // 保存原始状态
    this.originalState = await this.captureCurrentState();
    // 设置测试环境
    await this.setupTestEnvironment();
  }
  
  async cleanup() {
    // 恢复原始状态
    await this.restoreState(this.originalState);
    // 清理临时文件
    await this.cleanupTempFiles();
  }
}
```

### 3. 测试报告要求

#### 3.1 报告内容
- **测试概述**: 测试目的、范围、环境、逻辑
- **测试用例**: 测试用的数据文件(文件)
- **测试结果**: 通过/失败的测试用例统计
- **详细日志**: 每个测试步骤的执行结果
- **问题记录**: 发现的问题及其严重程度
- **建议**: 改进建议和后续行动

#### 3.2 报告格式
```markdown
# {功能描述}_{测试类型}_testAll 测试报告

## 测试概述
- **测试时间**: YYYY-MM-DD HH:mm:ss
- **测试环境**: 开发/测试/生产
- **测试目的**: 描述测试目标
- **测试范围**: 描述测试覆盖范围

## 测试结果统计
- **总测试用例**: X个
- **通过**: X个
- **失败**: X个
- **跳过**: X个
- **成功率**: X%

## 详细测试结果
### 测试用例1: {用例名称}
- **状态**: 通过/失败
- **执行时间**: X秒
- **详细信息**: 具体执行过程和结果

## 问题记录
### 问题1: {问题描述}
- **严重程度**: 高/中/低
- **影响范围**: 描述影响
- **建议解决方案**: 具体建议

## 环境恢复状态
- **数据库状态**: 已恢复/未恢复
- **文件系统**: 已清理/未清理
- **配置文件**: 已恢复/未恢复

## 总结与建议
- 测试总结
- 改进建议
- 后续行动计划
```

### 4. 目录使用说明

#### testData/
- 存放所有测试相关的数据文件
- 按功能模块分类存放
- 数据文件必须包含完整的测试场景数据

#### testScript/
- 存放所有测试脚本文件
- 脚本必须是可独立执行的
- 包含单元测试、集成测试、端到端测试等

#### testReport/
- 存放所有测试报告文件
- 报告必须与对应的测试脚本一一对应
- 支持多种格式：Markdown、HTML、JSON等

### 5. 执行流程

1. **准备阶段**
   - 检查测试数据一致性
   - 备份当前环境状态
   - 设置测试环境

2. **执行阶段**
   - 按顺序执行测试用例
   - 记录详细的执行日志
   - 捕获异常和错误信息

3. **清理阶段**
   - 恢复环境状态
   - 清理临时数据
   - 生成测试报告
   - 确保程序正常退出

### 6. 最佳实践

- 测试脚本应该是幂等的，可重复执行
- 使用断言库进行结果验证
- 合理使用 Mock 和 Stub 技术
- 测试用例应该相互独立
- 定期更新测试数据和脚本
- 保持测试报告的时效性

---

**注意**: 所有测试相关文件都必须严格遵循本文档的规范，确保项目测试的标准化和可维护性。