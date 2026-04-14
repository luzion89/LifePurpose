# Life Purpose — 实现文档

基于八木仁平《如何找到想做的事》，帮助用户通过三步选择找到人生方向的 PWA 应用。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite 6
- **部署**: GitHub Pages（GitHub Actions 自动部署）
- **AI**: 多模型流式对话（OpenAI / DeepSeek / Claude）

## 项目结构

```
Main/
├─ public/
│  ├─ manifest.json      # PWA 配置
│  ├─ sw.js              # Service Worker
│  ├─ favicon.svg        # 图标
│  ├─ icon-192.svg
│  └─ icon-512.svg
├─ src/
│  ├─ components/
│  │  ├─ Layout.tsx          # 应用外壳
│  │  ├─ StepIndicator.tsx   # 三步进度指示器
│  │  ├─ ChecklistPage.tsx   # 核心选择页面（支持三种列表类型）
│  │  └─ ResultPage.tsx      # 结果汇总 + AI 对话
│  ├─ data/
│  │  └─ lists.ts            # 300 条数据（重要的事·擅长的事·喜欢的事各 100 条）
│  ├─ hooks/
│  │  ├─ useLocalStorage.ts  # 持久化 + 跨标签同步
│  │  └─ useAIChat.ts        # AI 聊天状态管理
│  ├─ services/
│  │  └─ ai.ts               # 多 Provider 流式 API 封装
│  ├─ styles/
│  │  └─ globals.css         # 设计系统（日式极简）
│  ├─ utils/
│  │  └─ prompt.ts           # Prompt 模板生成器
│  ├─ App.tsx                # 路由 + 状态协调器
│  └─ main.tsx               # React 入口 + SW 注册
├─ index.html
├─ vite.config.ts
├─ tsconfig.json
└─ package.json
```

## 本地开发

```bash
cd Main
npm install
npm run dev
```

## 构建部署

```bash
npm run build    # 输出到 Main/dist/
```

推送 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages。

## 设计系统

| Token | 值 |
|-------|-----|
| 背景色 | `#FAF8F5`（米白） |
| 文字色 | `#2D2D2D` |
| 强调色 | `#C4A265`（淡金） |
| 标题字体 | Shippori Mincho |
| 正文字体 | Zen Kaku Gothic New |

## 用户流程

1. **重要的事** → 从 100 项价值观中选择
2. **擅长的事** → 从 100 项才能中选择（可展开查看：优势 / 才能 / 弱点）
3. **喜欢的事** → 从 100 个兴趣领域中选择（标签式布局）
4. **结果页** → 汇总选择 + 生成 Prompt → 复制到剪贴板或直接 AI 对话

## 下一步迭代方向

- [ ] 添加动画过渡效果（页面切换、选中反馈）
- [ ] 深色模式
- [ ] 导出 PDF 报告
- [ ] 多语言支持（日文 / 英文）
- [ ] 分享结果（生成海报图片）
