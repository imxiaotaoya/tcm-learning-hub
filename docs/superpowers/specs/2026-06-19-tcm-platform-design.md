# 中医方证互动传习系统 — 改造设计说明书

> 状态：已确认 | 日期：2026-06-19

## 一、架构决策

**选择：方案 A（单体仓库 · 全栈合一），分两步走。**

| 阶段 | 策略 | 说明 |
|------|------|------|
| **当前 P0** | 数据静态 import 进 React | nihaisha Markdown 通过构建脚本解析成 TS 数据文件，前端直接 import |
| **未来 P1-P2** | 切方案 B（前后分离 + API 层） | 写轻量脚本把 MD 转 JSON，加 Express/FastAPI 服务，前端 fetch |

**核心原则：**
- 截图（2986 张 WebP，78MB）只存**索引数据**（路径+描述+课次+时间戳），不打包原图
- 前端显示占位卡片，图片可访问时懒加载，不可访问时显示路径文本
- nihaisha-nishi-tcm 保持独立仓库，作为上游数据源

## 二、数据管道

### 2.1 构建脚本

新文件 `scripts/buildData.ts`，在 `npm run build` 前执行。从 nihaisha 的 46 个 Markdown 文件中解析结构化数据。

### 2.2 解析映射

| 源文件 | 格式 | 产出 |
|--------|------|------|
| `nihaisha/references/formula-patterns.md` | Markdown 表格（方名/方证/鉴别点/课次） | `src/data/formulas.ts` — `Formula[]` |
| `nihaisha/references/symptom-index.md` | 症状→分水岭→方证映射表 | `src/data/symptomRoutes.ts` — `SymptomRoute[]` |
| `nihaisha/references/six-channel.md` | 六经→病位/主症/代表方/禁忌表格 | 增强 `SixMeridianStage[]` |
| `nihaisha/references/lesson-map.md` | 课次/时长/主题/关键词表格 + 逐课摘要 | `src/data/lessons.ts` — `Lesson[]` |
| `nihaisha/references/screenshot-evidence.md` 等 11 个文件 | `` `timestamp` [category] desc + 截图路径 `` | `src/data/screenshots.ts` — `Screenshot[]` (6726 条) |
| `nihaisha/references/bencao.md` | 药性/归经/功效表格 | `src/data/herbs.ts` — `Herb[]` |
| `nihaisha/references/acupuncture.md` | 穴位/经络/主治 | `src/data/acupoints.ts` — `Acupoint[]` |
| `nihaisha/references/lesson-map.md` 模块分布 | 模块→课次映射 | `src/data/chapters.ts` — `Chapter[]` |

### 2.3 解析策略

- 正则匹配 Markdown 表格行（`| ... | ... |`）
- 方名用 `FORMULA_RE` 正则提取复合名（`桂枝汤`/`小柴胡汤`）避免误拆
- 截图证据行格式：`` - `12:34` [category] description `` 后跟 `- 截图路径：...`
- 构建脚本读取 nihaisha 的相对路径引用

## 三、前端组件改造（11 个文件）

### 3.1 新增组件

**ScreenshotBrowser.tsx**
- 左侧：课程模块 Tab（伤寒/金匮/针灸/天纪/内经/本草/仲景心法/临床案例/八纲/扶阳/易筋经）
- 右侧：网格展示截图索引卡片（路径+描述+时间戳+标签）
- 按标签筛选（方名/穴位/病机/六经）
- Lightbox 弹窗（懒加载 WebP，不可访问时显示占位）
- 数据源：`screenshots.ts`（6726 条索引）

**SafetyBanner.tsx**
- Props：`riskLevel: 'low' | 'medium' | 'high'`、`message: string`
- `high` → 红色横幅 + ⚠️ 图标
- `medium` → 黄色横幅
- 集成到 FormulaDetail / HerbComparison / SixMeridians / Classroom

**LearningPathSelector.tsx**
- 在 Dashboard 顶部渲染，三张横排卡片：
  - 📖 按课程顺序学 → 章节时间线（现有）
  - 🧭 按六经体系学 → 六经辨证 Tab
  - 🎯 按症状问题学 → 白话问题→方证路由
- 点击触发 `onNavigate` 跳转对应 Tab

### 3.2 增强组件

**StatsDashboard.tsx**
- 搜索引擎升级：支持中文分词（方名正则 + TCM 术语词典）、白话翻译映射（20+ 条）、加权评分排序、搜索自动补全
- 学习热力图：`Progress.streak` 驱动，CSS Grid 迷你热力格（30 天）
- 集成 LearningPathSelector

**FormulaDetail.tsx**
- `Formula` 类型加 `riskLevel` 字段
- 高风险方顶部渲染 SafetyBanner
- "关联方"横向滚动区：加减方/鉴别方
- "本课引用"模块：列出提到本方的课次，可跳转

**SixMeridians.tsx**
- 保留现有 SVG 传变图
- 新增症状分水岭决策树交互（逐步追问→六经定位→建议方证）
- 数据源：`symptomRoutes.ts`

**Classroom.tsx**
- 接入真实课程数据（lesson-map 的逐课摘要填充 Lesson.content）
- 新增"复习问题"区域
- 黑板区：数据驱动（`imageUrl` 有值则懒加载图片，无值则占位）
- 笔记锚定+双向跳转保留不变

**HerbComparison.tsx**
- 现有药性/归经筛选保留
- 加"五味"筛选（酸苦甘辛咸涩淡）
- 加"功效关键词"模糊搜索
- 配伍沙盒保留不变

**NotesManager.tsx**
- 加"导出 Markdown"按钮
- 其余不变

### 3.3 修改文件

**types.ts**
- `Formula` 加 `riskLevel?: 'low' | 'medium' | 'high'`
- `Progress` 加 `studyStreak: { lastStudyDate: string; consecutiveDays: number }`
- 新增 `SymptomRoute` 类型

**App.tsx**
- `progress` 初始值从 `localStorage` 读取
- 每次更新 `progress` 时写回 `localStorage`
- `Progress` 默认值含 `studyStreak`

## 四、基础设施

### 4.1 searchEngine.ts

搬入 nihaisha `search_screenshots.py` 的核心逻辑：
- 中文标点/空白分词（`,` `，` `;` `：` 等 10+ 种分隔符）
- 方名正则匹配（桂枝/麻黄/柴胡/承气/白虎/真武/五苓/半夏/甘草/黄连/黄芩/附子/茯苓/当归/吴茱萸/白通/建中/乌梅/苓桂/桃核/抵当/陷胸 + 汤散丸饮膏丹方）
- 68+ TCM 领域术语词典（六经名 + 病机术语 + 常见症状名 + 穴位名）
- 复合词拆分（"小柴胡汤加减" → "小柴胡汤" + "加减"）
- 加权评分：描述匹配 10、分类 4、课次/路径 3
- 白话翻译映射表（提取自 `beginner-questions.md`）

### 4.2 SafetyBanner 触发规则

常量 `RISK_RULES`，匹配方名/药名/症状关键词：
- 含附子类/四逆汤辈/大承气汤/抵当汤/大陷胸汤 → `high`
- 含癌症/肿瘤/阴实/妊娠/儿童 → `high`
- 含麻黄/大黄/芒硝 → `medium`

### 4.3 localStorage 持久化

- 键名：`tcm-learning-hub-progress`
- 内容：`Progress` 完整 JSON
- App 启动时读取，每次 mutation 后写入
- 不做版本迁移，格式变化时重置

## 五、实施顺序（10 个 Task）

```
Task 1: 数据管道 scripts/buildData.ts     ← 先做，所有组件依赖真实数据
Task 2: types.ts 扩展 + SafetyBanner       ← 基础设施
Task 3: searchEngine.ts                    ← 基础设施
Task 4: StatsDashboard 搜索升级 + 热力图    ← 入口页
Task 5: FormulaDetail 增强                 ← 核心学习页
Task 6: Classroom 真实数据接入             ← 核心学习页
Task 7: SixMeridians 决策树                ← 核心学习页
Task 8: ScreenshotBrowser 新建             ← 独立组件
Task 9: HerbComparison 筛选增强 + NotesManager 导出
Task 10: Sidebar + App 状态持久化 + LearningPathSelector
```

## 六、不变的部分

- Bento 配色体系（bento-paper/bento-bg/bento-accent/bento-border）
- 7 个 Tab 导航结构
- Sidebar 深绿色侧边栏（bg-[#1A261F]）
- 古雅字体体系（font-serif 中文 + font-sans 辅助）
- React 19 + Vite 6 + TypeScript 5.8 + Tailwind CSS 4
- 现有动画（motion/react）全部保留
- Bento 卡片圆角、阴影、边框样式
