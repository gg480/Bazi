# 兴盛艺 - AI驱动的智能命理分析平台

## 项目概述

这是一个基于传统易学理论，结合现代技术的在线命理分析平台，提供八字命理、紫微斗数、易经占卜等专业分析服务。

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4

## 目录结构

```
├── src/
│   ├── app/                      # 页面路由与布局
│   │   ├── api/divination/       # 算命 API 路由
│   │   │   ├── bazi/            # 八字命理 API
│   │   │   ├── yijing/          # 易经占卜 API
│   │   │   └── ziwei/           # 紫微斗数 API
│   │   ├── bazi/                # 八字命理页面
│   │   ├── yijing/              # 易经占卜页面
│   │   ├── ziwei/               # 紫微斗数页面
│   │   └── page.tsx             # 首页
│   ├── lib/divination/           # 算命核心算法
│   │   ├── bazi/                # 八字分析器
│   │   ├── yijing/              # 易经分析器
│   │   ├── ziwei/               # 紫微斗数分析器
│   │   ├── common/              # 共享数据和工具
│   │   ├── utils/               # 辅助工具
│   │   └── calculators/         # 计算器
│   ├── components/ui/            # Shadcn UI 组件库
│   └── hooks/                    # 自定义 Hooks
├── public/                       # 静态资源
└── scripts/                      # 构建与启动脚本
```

## 核心功能

### 🔮 八字命理分析
- 四柱排盘（年柱、月柱、日柱、时柱）
- 五行生克关系分析
- 十神格局判断
- 大运流年推演
- 人生指导建议

### 🌟 紫微斗数分析
- 十二宫位排盘
- 主星辅星组合解读
- 四化飞星动态推演
- 性格特质分析

### 🔮 易经占卜分析
- 梅花易数起卦
- 六十四卦解读
- 变卦与未来趋势
- 人生决策建议

## API 接口

### 八字命理 API
```
POST /api/divination/bazi
Request: { birth_date: string, birth_time: string, gender: string, name?: string }
Response: { success: boolean, data: BaziAnalysisResult }
```

### 易经占卜 API
```
POST /api/divination/yijing
Request: { question: string }
Response: { success: boolean, data: YijingAnalysisResult }
```

### 紫微斗数 API
```
POST /api/divination/ziwei
Request: { birth_date: string, birth_time: string, gender: string, name?: string }
Response: { success: boolean, data: ZiweiAnalysisResult }
```

## 开发规范

### 包管理
- **仅允许使用 pnpm** 作为包管理器，严禁使用 npm 或 yarn
- 常用命令：
  - 安装依赖：`pnpm add <package>`
  - 安装开发依赖：`pnpm add -D <package>`
  - 安装所有依赖：`pnpm install`

### 代码规范
- 项目文件默认初始化到 `src/` 目录下
- UI 组件使用 shadcn/ui 规范
- Hydration 错误预防：避免在 JSX 中直接使用动态数据

### 核心算法文件
- 位于 `src/lib/divination/` 目录
- 使用 CommonJS 模块格式（.cjs 文件）
- 已在 ESLint 配置中忽略，避免类型检查错误

## 构建与部署

### 开发环境
```bash
pnpm dev
```

### 生产构建
```bash
pnpm build
pnpm start
```

### 类型检查
```bash
pnpm ts-check
```

### 代码检查
```bash
pnpm lint
```

## 免责声明

本平台仅供娱乐参考，不构成任何决策建议。算命结果应理性看待，不可迷信。
