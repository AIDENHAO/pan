# 样式文件说明

## 文件结构

### themes.css
主题颜色变量定义文件，包含所有主题的CSS变量配置。

#### 包含的主题：
1. **默认主题** (`:root`) - 温润古典，金色典雅
2. **深色主题** (`[data-theme="dark"]`) - 神秘深邃，金辉夜色
3. **蓝色主题** (`[data-theme="blue"]`) - 清新理性，科技现代
4. **绿色主题** (`[data-theme="green"]`) - 自然生机，清新活力
5. **紫色主题** (`[data-theme="purple"]`) - 神秘优雅，贵族气质
6. **蔚蓝圣洁主题** (`[data-theme="azure-holy"]`) - 天空般的纯净与宁静
7. **白金圣洁主题** (`[data-theme="platinum-holy"]`) - 纯洁高贵，白金光辉
8. **炙热火焰主题** (`[data-theme="blazing-flame"]`) - 烈火般的激情与力量
9. **苍林生机主题** (`[data-theme="forest-vitality"]`) - 森林般的生机与活力
10. **深蓝大海主题** (`[data-theme="deep-ocean"]`) - 深海般的神秘与深邃
11. **黑金土壤主题** (`[data-theme="black-gold-soil"]`) - 大地般的厚重与金色光辉

#### CSS变量分类：
- **主色调变量**：`--primary-color`, `--primary-hover`, `--primary-light` 等
- **侧边栏变量**：`--sidebar-bg`, `--sidebar-text`, `--sidebar-border` 等
- **背景变量**：`--bg-primary`, `--bg-secondary`, `--bg-white` 等
- **文字变量**：`--text-primary`, `--text-secondary`, `--text-light` 等
- **边框变量**：`--border-light`, `--border-default`, `--border-input` 等
- **阴影变量**：`--shadow-light`, `--shadow-medium`, `--shadow-dark` 等
- **状态变量**：`--success-color`, `--info-color`, `--warning-color` 等

## 使用方式

### 引入方式
在 `src/index.tsx` 中引入：
```typescript
import './styles/themes.css'
```

### 主题切换
通过设置 `document.documentElement.setAttribute('data-theme', themeName)` 来切换主题。

### 在组件中使用
在CSS中直接使用CSS变量：
```css
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}
```

## 维护指南

### 添加新主题
1. 在 `themes.css` 中添加新的 `[data-theme="theme-name"]` 选择器
2. 定义所有必要的CSS变量
3. 在 `ThemePreview.tsx` 中添加主题配置
4. 在 `SettingsPage.tsx` 中添加主题选项

### 添加新的CSS变量
1. 在所有主题中添加相同的变量名
2. 确保变量命名遵循现有规范
3. 更新此README文档

### 代码规范
- 使用语义化的变量命名
- 保持所有主题变量的一致性
- 添加适当的注释说明
- 按功能分组组织变量