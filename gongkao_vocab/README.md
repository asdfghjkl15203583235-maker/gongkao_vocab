# 公考词语记忆卡

一个基于艾宾浩斯间隔重复算法的公务员考试词语记忆应用，支持离线使用（PWA）。

## 📱 在线体验

访问 [gongkao-vocab.netlify.app](https://gongkao-vocab.netlify.app) 在线体验应用

## 🎯 项目简介

这是一个专门为公务员考试备考打造的词语记忆工具，采用科学的间隔重复算法（基于 SM-2 算法的简化版），帮助用户高效记忆考试重点词汇。

### 核心特点

- 🧠 **科学记忆**：基于艾宾浩斯遗忘曲线，智能安排复习时间
- 📱 **PWA 离线**：支持离线使用，可安装到桌面
- 💾 **本地存储**：所有数据保存在本地，保护隐私
- 🎯 **精准推送**：根据掌握程度推送需要复习的词语
- 📊 **可视化统计**：学习进度一目了然
- 🔍 **便捷搜索**：快速查找词语

## 🚀 快速开始

### 在线使用

1. 打开浏览器访问：[gongkao-vocab.netlify.app](https://gongkao-vocab.netlify.app)
2. 无需安装，直接使用

### 本地部署

1. 克隆项目
```bash
git clone https://github.com/yourusername/gongkao-vocab.git
cd gongkao-vocab
```

2. 使用本地服务器运行（推荐）
```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx serve

# 或使用 PHP
php -S localhost:8000
```

3. 访问 `http://localhost:8000`

### 安装到设备

1. 在浏览器中打开应用
2. 浏览器会提示"安装到桌面"
3. 点击安装即可将应用添加到桌面

## 📁 项目结构

```
gongkao-vocab/
├── index.html          # 单页应用主入口
├── manifest.json        # PWA 配置文件
├── sw.js               # Service Worker（离线缓存）
├── css/
│   └── style.css       # 自定义样式（补充 Tailwind）
├── js/
│   ├── app.js         # 主应用逻辑、路由、页面切换
│   ├── data.js        # 数据加载与管理
│   ├── spaced-repetition.js  # 艾宾浩斯间隔重复算法
│   ├── storage.js     # IndexedDB 封装（学习进度读写）
│   ├── ui.js          # UI 交互（翻卡片、滑动、动画）
│   ├── stats.js       # 统计管理
│   └── settings.js    # 设置管理
├── data/
│   ├── words.json     # 词库数据（包含 2000+ 公考词汇）
│   └── words_mineru.json  # MinerU 原始数据
├── icons/
│   ├── icon-192.png   # 192x192 应用图标
│   ├── icon-512.png   # 512x512 应用图标
│   └── icon-192.svg   # SVG 源图标
├── convert_words.py   # 数据转换脚本（将 MinerU JSON 转换为可用格式）
├── enrich_examples.py # 例句丰富脚本
└── README.md          # 项目说明
```

## 🛠️ 技术栈

- **前端**：HTML5 + CSS3 + JavaScript (ES6+)
- **样式框架**：Tailwind CSS (CDN)
- **数据存储**：IndexedDB
- **应用类型**：Progressive Web App (PWA)
- **构建工具**：无纯静态部署

## 🎨 核心功能

### 1. 智能学习系统

- **间隔重复算法**：根据 SM-2 算法，自动调整复习间隔
  - "不认识"：间隔 1 天
  - "模糊"：间隔缩短 20%
  - "认识"：间隔按难度系数递增

- **学习状态管理**：
  - 🆕 未学习
  - 🔄 学习中
  - ✅ 已掌握（间隔 ≥ 21 天且连续正确 ≥ 3 次）

### 2. 卡片式学习

- **翻转卡片**：点击卡片查看释义
- **手势支持**：支持左右滑动
- **反馈按钮**：三种掌握程度选择
- **进度显示**：实时学习进度

### 3. 词库管理

- **分组展示**：按中华文明传统文化等分组
- **快速搜索**：支持词语和释义搜索
- **状态筛选**：可按学习状态筛选
- **详细信息**：显示释义、例句、分类

### 4. 数据统计

- **学习进度**：环形图展示掌握进度
- **连续学习**：打卡天数统计
- **学习曲线**：7 天学习量图表
- **分组完成度**：各小组掌握情况

### 5. 数据管理

- **导入导出**：备份和恢复学习进度
- **每日词数**：可设置每日新学词语数量（10/20/30/50）
- **重置功能**：清空所有学习记录

## 📊 词库数据

- **总词汇量**：2000+ 公考重点词汇
- **数据来源**：MinerU PDF 提取 + 人工整理
- **数据格式**：
  ```json
  {
    "id": "w001",
    "word": "源远流长",
    "pinyin": "",
    "meaning": "源头远，水流长。也比喻历史悠久。",
    "group": "第一组中华文明传统文化",
    "type": "成语",
    "examples": ["例句1", "例句2"]
  }
  ```

## 🔧 数据处理工具

### 转换 MinerU 数据

如果需要处理 MinerU 导出的 PDF JSON：

```bash
# 安装依赖
pip install beautifulsoup4

# 运行转换脚本
python convert_words.py
```

### 添加新词汇

1. 编辑 `data/words.json`
2. 按照 JSON 格式添加新词条
3. 刷新应用即可看到新词汇

## 🎯 使用指南

### 日常学习流程

1. 打开应用查看今日任务
2. 点击"开始今日学习"
3. 先复习需要复习的词语
4. 再学习新的词语
5. 根据掌握程度点击相应按钮

### 最佳实践

- **每日坚持**：每天至少学习 20 个新词
- **及时复习**：每天查看提醒，按时复习
- **定期回顾**：定期查看统计页面了解进度

### 数据备份

1. 进入"设置"页面
2. 点击"导出学习进度"
3. 保存 JSON 文件到安全位置
4. 需要时可以导入恢复

## 📱 兼容性

- **浏览器**：Chrome 60+, Firefox 60+, Safari 11+
- **设备**：手机、平板、桌面
- **网络**：支持离线使用

## 🚀 部署指南

### 静态托管平台

- **Netlify**：直接拖拽文件夹上传
- **Vercel**：通过 GitHub 部署
- **GitHub Pages**：启用 GitHub Actions 部署
- **CDN**：通过 CDN 加速访问

### 自建服务器

1. 配置 Web 服务器（Nginx/Apache）
2. 启用 gzip 压缩
3. 配置缓存策略
4. 设置 HTTPS

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 项目
2. 创建功能分支
3. 提交变更
4. 创建 Pull Request

### 贡献方向

- 新增词汇
- 优化算法
- 改进 UI/UX
- 修复 Bug

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

- [Your Name](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 致谢

- 参考 [墨墨记忆卡](https://www.momocards.cn/) 的学习算法
- 感谢 [MinerU](https://github.com/xfangfang/MinerU) PDF 提取工具
- 使用 [Tailwind CSS](https://tailwindcss.com/) 框架

## 📈 版本历史

### v1.0.0 (2026-05-03)
- 初始版本发布
- 基础学习功能
- 间隔重复算法
- PWA 支持
- 数据统计

---

**记住：坚持是成功的关键！每天学习，不断重复，你一定能掌握这些词汇！** 🎓✨