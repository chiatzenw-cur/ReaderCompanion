# Reader Companion App 📖

一个基于 Electron + React + PDF.js 构建的智能PDF阅读助手，支持AI对话分析。

[中文文档](./README_ZH.md) | [English](./README.md)

## 🌟 功能特性

### 📄 PDF阅读功能
- **现代PDF渲染器**: 基于PDF.js构建，支持可靠的PDF显示
- **智能文本选择**: 支持鼠标选择文本或OCR区域选择
- **跨平台支持**: Windows、macOS、Linux全平台支持
- **主题切换**: 支持浅色/深色/跟随系统主题

### 🤖 AI集成功能
- **多AI提供商**: 支持OpenAI GPT和DeepSeek模型
- **上下文分析**: AI分析PDF选中文本并提供洞察
- **智能对话**: 维护对话历史，提供上下文感知的回应
- **自定义提示词**: 为不同文档类型定制AI行为

### 💬 聊天界面
- **Markdown支持**: 富文本渲染，支持语法高亮
- **导出选项**: 导出对话记录为Markdown文件
- **复制功能**: 复制单条消息或整个对话
- **消息重新生成**: 需要时重新生成AI回应

### ⚙️ 配置管理
- **持久化设置**: 所有配置自动保存
- **API密钥管理**: 安全存储API密钥
- **自动保存**: 设置和API密钥自动保存
- **多语言支持**: 中英文界面切换

## 🚀 快速开始

### 环境要求
- Node.js (v16 或更高版本)
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/yourusername/reader-companion.git
   cd reader-companion
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

### 构建发布版本

```bash
# 为当前平台构建
npm run build

# 构建所有平台
npm run build:all

# 构建特定平台
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## 🔧 配置说明

### AI服务设置

1. **打开设置**: 点击聊天面板中的设置图标
2. **选择提供商**: 选择OpenAI或DeepSeek
3. **添加API密钥**: 输入您的API密钥（自动保存）
4. **选择模型**: 从可用模型中选择
5. **测试连接**: 验证配置是否正常工作

### 支持的AI模型

**OpenAI**
- GPT-4
- GPT-4 Turbo
- GPT-3.5 Turbo
- GPT-3.5 Turbo 16K

**DeepSeek**
- DeepSeek Chat
- DeepSeek Coder

### 自定义端点
支持配置自托管或第三方兼容API的自定义端点。

## 💡 使用方法

### 基本工作流程

1. **打开PDF**: 使用Ctrl+O或菜单打开PDF文件
2. **选择文本**: 点击并拖拽选择PDF中的文本
3. **AI分析**: 选中的文本自动发送给AI进行分析
4. **继续对话**: 通过后续问题继续对话
5. **导出记录**: 将对话保存为Markdown文件

### 文本选择方法

- **PDF文本层**: 从PDF直接选择文本（如果可用）
- **OCR选择**: 绘制矩形区域进行OCR文本识别
- **自动切换**: 当文本层失败时系统自动切换到OCR

### 键盘快捷键

- `Ctrl+O`: 打开PDF文件
- `Enter`: 在聊天中发送消息
- `Shift+Enter`: 在聊天输入框中换行

## 🏗️ 技术架构

### 技术栈
- **前端**: React 18 + TypeScript
- **桌面**: Electron跨平台桌面应用
- **PDF渲染**: PDF.js可靠PDF显示
- **OCR**: Tesseract.js光学字符识别
- **样式**: Tailwind CSS，支持深色模式
- **状态管理**: React Context API
- **构建**: Vite快速开发和构建

### 项目结构
```
src/
├── components/          # React组件
│   ├── ChatPanel.tsx   # 聊天界面
│   ├── PDFViewer.tsx   # PDF显示和选择
│   ├── SettingsPanel.tsx # 配置界面
│   └── MessageBubble.tsx # 聊天消息显示
├── contexts/           # React上下文
│   ├── AppContext.tsx  # 全局应用状态
│   ├── ChatContext.tsx # 聊天功能
│   └── PDFContext.tsx  # PDF状态管理
├── services/           # 业务逻辑
│   └── aiService.ts    # AI API集成
├── i18n/              # 国际化
│   ├── translations.ts # 翻译定义
│   └── useTranslation.ts # 翻译钩子
├── types/             # TypeScript定义
└── App.tsx           # 主应用组件
```

### 数据流
1. **PDF加载**: Electron主进程处理文件对话框和加载
2. **文本选择**: 组件捕获选择并存储在上下文中
3. **AI处理**: 服务层处理AI提供商的API请求
4. **UI更新**: React上下文触发新数据的重新渲染
5. **持久化**: 通过Electron API自动保存设置

## 🔒 隐私与安全

- **本地存储**: 所有设置和对话在本地存储
- **API密钥安全**: 密钥加密并存储在系统密钥链中
- **无数据收集**: 不向外发送遥测或使用数据
- **离线功能**: OCR处理可离线工作

## 🤝 贡献指南

欢迎贡献！请按以下步骤操作：

1. Fork此仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开Pull Request

### 开发指南
- 遵循TypeScript最佳实践
- 使用现有组件模式
- 编写清晰的提交信息
- 尽可能在多个平台上测试

## 📄 许可证

本项目基于MIT许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF渲染
- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR功能
- [Electron](https://www.electronjs.org/) - 桌面应用框架
- [React](https://reactjs.org/) - UI框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架


---

Vibe Coded with Claude code