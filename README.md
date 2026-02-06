# 🛡️ GuardVision AI 海报检查器

专业的安防行业文案诊断工具，支持图片OCR识别和AI智能分析。

## ✨ 功能特点

### 📷 图片分析模式
- 上传海报图片
- 自动OCR文字提取
- AI智能诊断分析
- 错误定位与修正建议

### 📝 文本分析模式
- 直接输入文案
- 实时AI分析
- 术语规范检查
- 专业度评分

### 🤖 多厂商AI支持
- **OCR识别服务**:
  - Google Gemini Vision
  - 字节豆包 Vision
  - 百度OCR
  - 阿里云OCR
  - OpenAI Vision

- **AI分析服务**:
  - Google Gemini
  - 字节豆包（Doubao）
  - OpenAI GPT-4
  - Anthropic Claude
  - 阿里通义千问（Qwen）
  - DeepSeek

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd guardvision-vercel
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env.local`:

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入您的API密钥：

```env
# 至少配置一个OCR服务和一个AI分析服务
GEMINI_API_KEY=your_gemini_api_key_here
DOUBAO_API_KEY=your_doubao_api_key_here
# ... 其他API密钥
```

### 4. 本地运行

```bash
npm run dev
```

访问 http://localhost:3000

### 5. 构建生产版本

```bash
npm run build
```

## 📦 部署到Vercel

### 方式一：通过Vercel CLI

1. 安装Vercel CLI:
```bash
npm i -g vercel
```

2. 登录Vercel:
```bash
vercel login
```

3. 部署:
```bash
vercel
```

4. 在Vercel Dashboard中配置环境变量:
   - 进入项目设置 → Environment Variables
   - 添加所有需要的API密钥

### 方式二：通过GitHub自动部署

1. 将代码推送到GitHub
2. 在 [Vercel](https://vercel.com) 登录
3. 点击 "New Project"
4. 导入您的GitHub仓库
5. 配置环境变量
6. 点击 "Deploy"

## 🔑 获取API密钥

### Google Gemini
1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 创建API密钥
3. 复制密钥到 `GEMINI_API_KEY`

### 字节豆包（火山引擎）
1. 访问 [火山引擎控制台](https://console.volcengine.com/ark)
2. 创建应用获取API Key
3. 复制密钥到 `DOUBAO_API_KEY`

### OpenAI
1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 创建API密钥
3. 复制密钥到 `OPENAI_API_KEY`

### Anthropic Claude
1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 创建API密钥
3. 复制密钥到 `ANTHROPIC_API_KEY`

### 通义千问
1. 访问 [阿里云DashScope](https://dashscope.console.aliyun.com/)
2. 创建API Key
3. 复制密钥到 `QWEN_API_KEY`

### DeepSeek
1. 访问 [DeepSeek Platform](https://platform.deepseek.com/)
2. 创建API密钥
3. 复制密钥到 `DEEPSEEK_API_KEY`

### 百度OCR
1. 访问 [百度AI开放平台](https://ai.baidu.com/)
2. 创建应用获取API Key和Secret Key
3. 分别复制到 `BAIDU_API_KEY` 和 `BAIDU_SECRET_KEY`

### 阿里云OCR
1. 访问 [阿里云OCR](https://www.aliyun.com/product/ocr)
2. 开通服务获取AppCode
3. 复制到 `ALIBABA_API_KEY`

## 📖 使用说明

### 图片分析流程

1. **选择服务提供商**
   - OCR服务：选择您配置了密钥的OCR服务
   - AI分析：选择您配置了密钥的AI服务

2. **上传图片**
   - 点击"选择图片"按钮
   - 可同时上传多张图片
   - 支持 JPG、PNG 等格式

3. **开始分析**
   - 点击"开始分析"按钮
   - 系统自动进行：
     - OCR文字识别
     - AI智能分析
     - 错误诊断
     - 生成报告

4. **查看结果**
   - 专业度评分
   - 错误类型分类
   - 修改建议
   - 替代方案

### 文本分析流程

1. **选择AI服务**
   - 选择您配置了密钥的AI分析服务

2. **输入文本**
   - 在文本框中输入要分析的内容

3. **开始分析**
   - 点击"开始分析"按钮

4. **查看结果**
   - 查看诊断报告
   - 获取修改建议

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: CSS3
- **HTTP客户端**: Axios
- **部署平台**: Vercel
- **运行时**: Vercel Edge Functions

## 📁 项目结构

```
guardvision-vercel/
├── api/                      # Vercel Serverless Functions
│   ├── ocr.ts               # OCR识别API
│   └── analyze.ts           # AI分析API
├── src/
│   ├── components/          # React组件（可扩展）
│   ├── services/            # 前端服务
│   │   └── apiService.ts   # API调用服务
│   ├── types.ts            # TypeScript类型定义
│   ├── constants.ts        # 常量和术语库
│   ├── App.tsx             # 主应用组件
│   ├── App.css             # 样式文件
│   └── index.tsx           # 入口文件
├── public/                  # 静态资源
├── index.html              # HTML模板
├── vite.config.ts          # Vite配置
├── vercel.json             # Vercel配置
├── tsconfig.json           # TypeScript配置
├── package.json            # 项目依赖
├── .env.example            # 环境变量示例
└── README.md               # 项目文档
```

## 🔐 安全说明

- ✅ API密钥存储在Vercel环境变量中，不会暴露给前端
- ✅ 所有API调用通过Vercel Serverless Functions中转
- ✅ 避免了浏览器CORS限制问题
- ✅ 前端无需配置API密钥，安全可靠

## 🌟 特色功能

1. **无服务器架构**: 完全基于Vercel Edge Functions，无需维护服务器
2. **多厂商支持**: 灵活切换不同AI服务商，避免单一依赖
3. **智能诊断**: 结合行业术语库进行专业分析
4. **实时反馈**: 流畅的用户体验，即时获取分析结果
5. **安全可靠**: API密钥服务端管理，前端调用安全

## 📝 开发者注意事项

### 添加新的AI服务商

1. 在 `api/ocr.ts` 或 `api/analyze.ts` 中添加新的服务商函数
2. 在 `src/types.ts` 中添加新的枚举值
3. 在 `.env.example` 中添加新的环境变量说明
4. 更新 `src/App.tsx` 中的选择器选项

### 自定义术语库

编辑 `src/constants.ts` 中的 `INITIAL_TERMINOLOGY` 数组，添加您的行业术语。

## 🐛 故障排除

### API调用失败
- 检查环境变量是否正确配置
- 确认API密钥是否有效
- 查看Vercel部署日志

### 部署失败
- 确保 `package.json` 中的依赖正确
- 检查 `vercel.json` 配置
- 查看构建日志

### CORS错误
- 确保使用 `/api/*` 路径调用API
- 检查 `vercel.json` 中的headers配置

## 📄 License

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 💬 联系方式

如有问题，请提交Issue或联系开发者。

---

**注意**: 使用本工具需要自行申请相应AI服务商的API密钥。部分服务可能需要付费。
