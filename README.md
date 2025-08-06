# 📚 Reader Companion

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-47848F?style=flat&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![PDF.js](https://img.shields.io/badge/PDF.js-FF6B35?style=flat&logo=mozilla&logoColor=white)](https://mozilla.github.io/pdf.js/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern desktop PDF reader with AI-powered analysis capabilities. Built with TypeScript, Electron, React, and PDF.js.

[中文文档](./README_ZH.md) | [English](./README.md)

## ✨ Features

### 📖 PDF Reading
- **Modern PDF Viewer**: Built with PDF.js for reliable PDF rendering
- **Text Selection**: Select text with mouse or OCR-based area selection
- **Cross-Platform**: Windows, macOS, and Linux support
- **Dark/Light Theme**: Automatic system theme detection with manual override

### 🤖 AI Integration
- **Multiple AI Providers**: Support for OpenAI GPT and DeepSeek models
- **Contextual Analysis**: AI analyzes selected PDF text and provides insights
- **Smart Conversations**: Maintains conversation history for context-aware responses
- **Custom System Prompts**: Customize AI behavior for different document types

### 💬 Chat Interface
- **Markdown Support**: Rich text rendering with syntax highlighting
- **Export Options**: Export conversations as Markdown files
- **Copy Functionality**: Copy individual messages or entire conversations
- **Message Regeneration**: Regenerate AI responses if needed

### ⚙️ Configuration
- **Persistent Settings**: All configurations saved automatically
- **API Key Management**: Secure storage of API keys
- **Auto-save**: Settings and API keys saved automatically
- **Language Support**: Chinese and English interface

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/reader-companion.git
   cd reader-companion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Building for Production

```bash
# Build for current platform
npm run build

# Build for all platforms
npm run build:all

# Build for specific platform
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## 🔧 Configuration

### AI Provider Setup

1. **Open Settings**: Click the settings icon in the chat panel
2. **Choose Provider**: Select OpenAI or DeepSeek
3. **Add API Key**: Enter your API key (auto-saved)
4. **Select Model**: Choose from available models
5. **Test Connection**: Verify your configuration works

### Supported AI Models

**OpenAI**
- GPT-4
- GPT-4 Turbo
- GPT-3.5 Turbo
- GPT-3.5 Turbo 16K

**DeepSeek**
- DeepSeek Chat
- DeepSeek Coder

### Custom Endpoints
You can configure custom API endpoints for self-hosted or third-party compatible APIs.

## 💡 Usage

### Basic Workflow

1. **Open PDF**: Use Ctrl+O or menu to open a PDF file
2. **Select Text**: Click and drag to select text in the PDF
3. **AI Analysis**: Selected text is automatically sent to AI for analysis
4. **Chat**: Continue the conversation with follow-up questions
5. **Export**: Save your conversation as a Markdown file

### Text Selection Methods

- **PDF Text Layer**: Direct text selection from PDF (when available)
- **OCR Selection**: Draw rectangles to select areas for OCR text recognition
- **Automatic Fallback**: System automatically switches to OCR if text layer fails

### Keyboard Shortcuts

- `Ctrl+O`: Open PDF file
- `Enter`: Send message in chat
- `Shift+Enter`: New line in chat input

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Desktop**: Electron for cross-platform desktop app
- **PDF Rendering**: PDF.js for reliable PDF display
- **OCR**: Tesseract.js for optical character recognition
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: React Context API
- **Build**: Vite for fast development and building

### Project Structure
```
src/
├── components/          # React components
│   ├── ChatPanel.tsx   # Chat interface
│   ├── PDFViewer.tsx   # PDF display and selection
│   ├── SettingsPanel.tsx # Configuration UI
│   └── MessageBubble.tsx # Chat message display
├── contexts/           # React contexts
│   ├── AppContext.tsx  # Global app state
│   ├── ChatContext.tsx # Chat functionality
│   └── PDFContext.tsx  # PDF state management
├── services/           # Business logic
│   └── aiService.ts    # AI API integration
├── i18n/              # Internationalization
│   ├── translations.ts # Translation definitions
│   └── useTranslation.ts # Translation hook
├── types/             # TypeScript definitions
└── App.tsx           # Main application component
```

### Data Flow
1. **PDF Loading**: Electron main process handles file dialogs and loading
2. **Text Selection**: Component captures selection and stores in context
3. **AI Processing**: Service layer handles API requests to AI providers
4. **UI Updates**: React contexts trigger re-renders with new data
5. **Persistence**: Settings automatically saved via Electron APIs

## 🔒 Privacy & Security

- **Local Storage**: All settings and conversations stored locally
- **API Key Security**: Keys encrypted and stored in system keychain
- **No Data Collection**: No telemetry or usage data sent externally
- **Offline Capable**: OCR processing works offline

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use existing component patterns
- Write clear commit messages
- Test on multiple platforms when possible

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF rendering
- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR functionality
- [Electron](https://www.electronjs.org/) - Desktop app framework
- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

## 📞 Support

If you encounter any issues or have questions:

1. Check existing [Issues](https://github.com/yourusername/reader-companion/issues)
2. Create a new issue with detailed information
3. Join our community discussions

## 🚧 Roadmap

- [ ] Plugin system for custom AI providers
- [ ] PDF annotation support
- [ ] Multiple document tabs
- [ ] Advanced search functionality
- [ ] Collaborative features
- [ ] Mobile companion app

---

Made with ❤️ by developers who love reading and AI
