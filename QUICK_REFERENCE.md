# 🚀 GuardVision AI - 快速参考卡片

## 📁 项目结构

```
guardvision-vercel/
├── api/                    # 后端API (Serverless)
│   ├── ocr.ts             # OCR识别接口
│   ├── analyze.ts         # AI分析接口
│   └── test.ts            # 连接测试接口
├── src/                   # 前端源码
│   ├── App.tsx            # 主应用
│   ├── App.css            # 样式
│   ├── types.ts           # 类型定义
│   ├── constants.ts       # 术语库
│   └── services/
│       └── apiService.ts  # API调用服务
├── DEPLOYMENT_GUIDE.md    # 🎯 小白部署指南 (必读!)
├── README.md              # 详细文档
├── setup.sh / setup.bat   # 快速设置脚本
└── .env.example           # 环境变量模板
```

## ⚡ 快速开始

### Windows用户
```bash
双击运行 setup.bat
```

### Mac/Linux用户
```bash
chmod +x setup.sh
./setup.sh
```

## 🔑 必需的环境变量

**至少配置一个OCR服务 + 一个AI服务**

### OCR服务（选一个）
```
GEMINI_API_KEY=xxx          # Google Gemini (推荐)
DOUBAO_API_KEY=xxx          # 字节豆包
BAIDU_API_KEY=xxx           # 百度OCR
BAIDU_SECRET_KEY=xxx
ALIBABA_API_KEY=xxx         # 阿里云OCR
OPENAI_API_KEY=xxx          # OpenAI Vision
```

### AI分析服务（选一个）
```
GEMINI_API_KEY=xxx          # Google Gemini (推荐)
DOUBAO_API_KEY=xxx          # 字节豆包
OPENAI_API_KEY=xxx          # OpenAI GPT-4
ANTHROPIC_API_KEY=xxx       # Claude
QWEN_API_KEY=xxx            # 通义千问
DEEPSEEK_API_KEY=xxx        # DeepSeek
```

## 📝 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入API密钥

# 3. 启动开发服务器
npm run dev

# 4. 访问
http://localhost:3000
```

## 🚀 部署到Vercel

### 方式1: 通过GitHub (推荐)

1. 上传代码到GitHub
2. Vercel → New Project → 导入GitHub仓库
3. Framework: Vite (自动识别)
4. 点击 Deploy
5. Settings → Environment Variables → 添加API密钥
6. Deployments → Redeploy

### 方式2: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
# 在Vercel Dashboard配置环境变量
```

## 🧪 测试API配置

访问: `https://你的域名.vercel.app/api/test`

返回示例:
```json
{
  "timestamp": "2026-02-06T...",
  "services": {
    "gemini": { "configured": true, "working": true },
    "doubao": { "configured": false },
    ...
  }
}
```

## 🎯 支持的服务商

### OCR识别
| 服务商 | 免费额度 | 速度 | 准确度 |
|--------|---------|------|--------|
| Gemini | 60次/月 | 快 | ⭐⭐⭐⭐⭐ |
| 豆包 | 有额度 | 很快 | ⭐⭐⭐⭐ |
| 百度 | 500次/天 | 中等 | ⭐⭐⭐⭐ |
| 阿里云 | 500次/月 | 快 | ⭐⭐⭐⭐ |
| OpenAI | 付费 | 慢 | ⭐⭐⭐⭐⭐ |

### AI分析
| 服务商 | 免费额度 | 质量 | 推荐度 |
|--------|---------|------|--------|
| Gemini | 60次/月 | ⭐⭐⭐⭐⭐ | 🌟🌟🌟🌟🌟 |
| 豆包 | 有额度 | ⭐⭐⭐⭐ | 🌟🌟🌟🌟 |
| GPT-4 | 付费 | ⭐⭐⭐⭐⭐ | 🌟🌟🌟 |
| Claude | 付费 | ⭐⭐⭐⭐⭐ | 🌟🌟🌟🌟 |
| 通义千问 | 有额度 | ⭐⭐⭐⭐ | 🌟🌟🌟 |
| DeepSeek | 便宜 | ⭐⭐⭐ | 🌟🌟🌟 |

## 💡 使用技巧

### 图片分析最佳实践
1. 图片清晰，分辨率≥1000px
2. 文字对比度高
3. 避免过度压缩
4. 推荐PNG或高质量JPG

### 成本优化
1. 开发测试用Gemini免费额度
2. 生产环境可选豆包（国内快）
3. 关键项目用GPT-4/Claude

### 性能优化
1. 批量处理时分批上传
2. 使用CDN加速图片
3. 合理设置并发数

## ⚠️ 常见错误

### "API Key无效"
→ 检查环境变量名称拼写
→ 确认已重新部署

### "CORS错误"
→ 确保使用 `/api/*` 路径
→ 检查 vercel.json 配置

### "分析失败"
→ 检查图片大小 <10MB
→ 确认选择了配置好的服务
→ 查看 /api/test 测试结果

### "部署失败"
→ 检查 package.json 语法
→ 确认Node版本 ≥18
→ 查看Vercel部署日志

## 📞 获取帮助

1. **新手**: 先看 `DEPLOYMENT_GUIDE.md`
2. **详细文档**: 查看 `README.md`
3. **API测试**: 访问 `/api/test`
4. **问题反馈**: GitHub Issues

## 🔒 安全提示

✅ API密钥仅存储在Vercel后端
✅ 前端无法访问密钥
✅ 所有调用通过Serverless中转
✅ 避免了CORS和密钥泄露问题

## 🎓 学习资源

- Vercel文档: https://vercel.com/docs
- React文档: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Vite: https://vitejs.dev

---

**祝您使用愉快！有问题查看文档或提Issue。**

最后更新: 2026-02-06
