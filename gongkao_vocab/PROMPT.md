# 项目：公考词语记忆卡 PWA 离线应用

## 项目背景
我正在备考公务员考试，需要一个离线可用的词语记忆卡片 App，部署到手机/平板上自用。
参考 App："墨墨记忆卡"的核心记忆逻辑。

## 技术栈要求
- 纯前端：HTML + CSS + JavaScript（不用任何框架如 React/Vue）
- 样式：使用 Tailwind CSS（通过 CDN 引入）
- 数据存储：IndexedDB（存储学习进度）
- 部署方式：PWA（Progressive Web App），支持离线使用，可安装到手机桌面
- 不需要任何后端服务器

## 项目文件结构
project/
├── index.html ← 单页应用主入口
├── manifest.json ← PWA 配置
├── sw.js ← Service Worker（离线缓存）
├── css/
│ └── style.css ← 自定义样式（补充 Tailwind）
├── js/
│ ├── app.js ← 主应用逻辑、路由、页面切换
│ ├── data.js ← 数据加载与管理
│ ├── spaced-repetition.js ← 艾宾浩斯间隔重复算法
│ ├── storage.js ← IndexedDB 封装（学习进度读写）
│ └── ui.js ← UI 交互（翻卡片、滑动、动画）
├── data/
│ └── words.json ← 词库数据（我已整理好，直接复制进来）
├── icons/
│ ├── icon-192.png(用 SVG/CSS 随便画一个)
│ └── icon-512.png(用 SVG/CSS 随便画一个)
└── README.md

text
text

## 数据结构（words.json）
我已经整理好数据
（请直接读取 data/words.json，不要硬编码数据）


核心功能

1. 首页（Dashboard）
顶部显示今日日期
显示今日待学习的新词数量
显示今日待复习的旧词数量
显示学习统计数据：已掌握 / 学习中 / 未学习 的词数（用环形进度图或数字卡片展示）
一个大按钮："开始今日学习"
底部导航栏：首页 | 词库 | 统计 | 设置

2. 学习页面（核心页面）
这是用户每天打开 App 后的主要使用页面。


流程：

1.先展示今日需要复习的词（根据艾宾浩斯算法计算出的到期词）
2.再展示今日需要新学的词（可设置每日新词数量，默认 80 个）
3.每个词以卡片形式展示

卡片交互：

卡片正面：只显示词语（大字居中）+ 拼音（小字在下方）
用户点击卡片 → 翻转动画（CSS 3D transform）→ 卡片背面显示：释义 + 分类标签
卡片背面下方有三个按钮：
"不认识"（红色）→ 间隔重置为 1 天，明天再复习
"模糊"（黄色）→ 间隔缩短，后天复习
"认识"（绿色）→ 间隔按算法递增
点击按钮后自动滑入下一张卡片
支持左右滑动手势（touch 事件）

卡片样式要求：

卡片占屏幕约 80% 宽度，居中
圆角、阴影
正面词语字号要大（至少 2rem），让人一眼看清
翻转动画流畅（0.4s ease）
背面释义左对齐，行间距舒适

3. 间隔重复算法（spaced-repetition.js）
实现 SM-2 算法的简化版：


每个词条在 IndexedDB 中存储以下字段：
{
  wordId: number,
  status: "new" | "learning" | "review" | "mastered",
  interval: number,          // 当前间隔天数
  easeFactor: number,        // 难度系数，初始 2.5
  nextReview: string,        // 下次复习日期 "YYYY-MM-DD"
  reviewCount: number,       // 已复习次数
  lastReview: string         // 上次复习日期
}

算法逻辑：
- 新词（status="new"）首次学习后变为 "learning"
- 用户反馈处理：
  - "不认识"：interval = 1, easeFactor = max(1.3, easeFactor - 0.2), nextReview = 明天
  - "模糊"：interval = max(1, Math.round(interval * 1.2)), nextReview = 今天 + interval
  - "认识"：interval = Math.round(interval * easeFactor), easeFactor += 0.1, nextReview = 今天 + interval
- 当 interval >= 21 且连续正确 >= 3 次时，status 变为 "mastered"
- 每天打开 App 时，计算 nextReview <= 今天 的词，加入今日复习队列

4. 词库浏览页面
按分组（第1组、第2组...）展示所有词语
列表形式，每行显示：词语 | 拼音 | 学习状态标签（未学习/学习中/已掌握）
支持搜索（按词语或释义模糊搜索）
点击某个词进入详情页（显示完整信息 + 该词的学习记录）
可以按状态筛选：全部 / 未学习 / 学习中 / 已掌握

5. 统计页面
总词汇掌握进度（环形图或进度条）
最近 7 天的学习曲线（每天学了多少词、复习了多少词）
分组完成度（每个分组的掌握百分比）
连续学习天数（打卡天数）
用简洁的 CSS 实现图表，不引入第三方图表库（用 CSS + SVG 或 Canvas 手绘即可）

6. 设置页面
每日新词数量设置（10 / 20 / 30 / 50）
数据管理：
导出学习进度（导出为 JSON 文件，可下载）
导入学习进度（上传 JSON 文件恢复）
重置所有进度（二次确认弹窗）
关于页面（版本号、说明）

7. PWA 配置
manifest.json：配置 App 名称、图标、主题色、启动 URL、显示模式为 standalone
sw.js：Service Worker 缓存所有静态资源，实现完全离线可用
注册 Service Worker
App 图标：生成一个简洁的图标（可以用 CSS/SVG 画一个书本或卡片样式的图标）

UI/UX 设计要求

整体风格
参考墨墨记忆卡的简洁风格
主色调：深蓝 + 白色，辅助色用绿色（认识）、黄色（模糊）、红色（不认识）
字体：中文使用系统默认字体即可，词语显示用 serif 字体增加书卷气
深色模式支持（默认浅色，设置中可切换）

交互细节
页面切换有平滑过渡动画
卡片翻转使用 CSS 3D transform（perspective + rotateY）
按钮有按压反馈（scale 缩放）
加载数据时显示 loading 动画
学习完成时显示鼓励动画/文案（如"今日任务完成！已连续学习 X 天"）
底部导航栏固定，当前页面高亮

响应式
主要适配手机（375px - 428px 宽度）
同时兼容平板（768px+）
不需要适配桌面端

实现顺序
请按以下顺序逐步实现，每完成一步确保可运行：


1.基础框架：index.html + 基本布局 + 底部导航 + 页面切换
2.数据加载：读取 words.json，渲染词库列表页
3.卡片组件：实现翻转卡片 + 滑动交互
4.间隔重复算法：实现 spaced-repetition.js + storage.js（IndexedDB）
5.学习页面：整合卡片 + 算法，完成学习流程
6.首页 Dashboard：显示统计数据 + 今日任务入口
7.统计页面：学习数据可视化
8.设置页面：导入导出 + 每日词数设置
9.PWA 配置：manifest.json + Service Worker + 离线缓存
10.深色模式：CSS 变量切换主题
11.打磨细节：动画、过渡、微交互

重要约束
所有代码必须完整可运行，不要用占位符或 TODO
不要使用任何需要 npm/node/构建工具的方案，纯静态文件即可
不要引入任何需要付费的第三方服务
数据文件路径：data/words.json（我会把整理好的 JSON 直接放进去）
所有 CSS 动画用 GPU 加速（transform + opacity），避免卡顿
IndexedDB 操作封装成 async/await 风格的 Promise

请开始实现，从第 1 步开始。