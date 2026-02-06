# 🎯 小白部署指南 - 零基础也能轻松部署

本指南专为完全没有编程基础的用户编写，按照步骤操作即可成功部署。

## 📋 准备工作清单

在开始之前，您需要：

- [ ] 一个邮箱账号
- [ ] 一个GitHub账号（免费）
- [ ] 一个Vercel账号（免费）
- [ ] 至少一个AI服务的API密钥（下面会教您如何获取）

---

## 第一步：注册必要账号

### 1.1 注册GitHub账号

1. 访问 https://github.com
2. 点击右上角 "Sign up"（注册）
3. 输入邮箱、密码，完成注册
4. 验证邮箱

### 1.2 注册Vercel账号

1. 访问 https://vercel.com
2. 点击 "Sign Up"
3. **推荐**：选择 "Continue with GitHub" 用GitHub账号登录
4. 授权Vercel访问您的GitHub

---

## 第二步：获取AI API密钥（至少选一个）

### 方案A：Google Gemini（推荐，免费额度大）

1. 访问：https://aistudio.google.com/app/apikey
2. 如果需要，用Google账号登录
3. 点击 "Create API Key"（创建API密钥）
4. 选择 "Create API key in new project"
5. 复制生成的密钥，保存到记事本

**密钥格式示例**: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

### 方案B：字节豆包（国内访问快）

1. 访问：https://console.volcengine.com/ark
2. 注册/登录火山引擎账号
3. 创建推理接入点
4. 获取API Key
5. 复制保存

### 方案C：其他AI服务

参考README.md中的"获取API密钥"章节。

---

## 第三步：上传代码到GitHub

### 3.1 下载本项目代码

将项目文件下载到您的电脑。

### 3.2 创建GitHub仓库

1. 登录GitHub
2. 点击右上角 "+" → "New repository"（新仓库）
3. 填写：
   - Repository name（仓库名）: `guardvision-ai`
   - Description（描述）: `海报检查工具`
   - 选择 "Public"（公开）
4. 点击 "Create repository"（创建仓库）

### 3.3 上传代码

**方式一：使用GitHub网页上传**

1. 在刚创建的仓库页面
2. 点击 "uploading an existing file"
3. 将项目所有文件拖入上传区
4. 点击 "Commit changes"（提交更改）

**方式二：使用GitHub Desktop（更简单）**

1. 下载安装 GitHub Desktop：https://desktop.github.com
2. 打开GitHub Desktop，登录
3. 点击 "File" → "Add Local Repository"
4. 选择项目文件夹
5. 点击 "Publish repository"

---

## 第四步：部署到Vercel

### 4.1 导入项目

1. 登录 https://vercel.com
2. 点击 "Add New..." → "Project"
3. 找到您的 `guardvision-ai` 仓库
4. 点击 "Import"（导入）

### 4.2 配置项目

1. **Framework Preset**: 自动检测为 "Vite"（不用改）
2. **Root Directory**: `.`（默认，不用改）
3. **Build Command**: `npm run build`（自动填写）
4. **Output Directory**: `dist`（自动填写）

直接点击 "Deploy"（部署）按钮。

**等待2-3分钟，首次部署完成！**

---

## 第五步：配置API密钥（最重要！）

### 5.1 进入项目设置

1. 部署完成后，点击项目名称
2. 点击顶部 "Settings"（设置）
3. 左侧菜单点击 "Environment Variables"（环境变量）

### 5.2 添加API密钥

根据您在第二步获取的API密钥，添加对应的环境变量：

#### 如果您使用Google Gemini:

| Name（名称） | Value（值） |
|-------------|-----------|
| `GEMINI_API_KEY` | 粘贴您的Gemini API密钥 |

#### 如果您使用字节豆包:

| Name（名称） | Value（值） |
|-------------|-----------|
| `DOUBAO_API_KEY` | 粘贴您的豆包API密钥 |

#### 如果您使用百度OCR:

| Name（名称） | Value（值） |
|-------------|-----------|
| `BAIDU_API_KEY` | 粘贴您的百度API Key |
| `BAIDU_SECRET_KEY` | 粘贴您的百度Secret Key |

**添加步骤**:
1. 点击 "Add"（添加）
2. Name 输入变量名（如 `GEMINI_API_KEY`）
3. Value 输入密钥值
4. 选择所有环境：Production、Preview、Development
5. 点击 "Save"（保存）

### 5.3 重新部署

添加完所有环境变量后：

1. 点击顶部 "Deployments"（部署）
2. 找到最新的部署
3. 点击右侧三个点 "..."
4. 选择 "Redeploy"（重新部署）
5. 点击 "Redeploy" 确认

**等待1-2分钟，重新部署完成！**

---

## 第六步：访问您的网站

1. 回到项目首页
2. 找到 "Domains"（域名）下方的网址
3. 格式类似：`https://guardvision-ai-xxx.vercel.app`
4. 点击访问

**🎉 恭喜！您的AI海报检查工具已经成功部署！**

---

## 📱 如何使用

### 使用图片分析功能

1. 打开网站
2. 确保在"图片分析"标签
3. 选择OCR服务和AI分析服务（选择您配置了密钥的服务）
4. 点击"选择图片"上传海报
5. 点击"开始分析"
6. 等待分析完成，查看结果

### 使用文本分析功能

1. 切换到"文本分析"标签
2. 选择AI分析服务
3. 在文本框输入要分析的文案
4. 点击"开始分析"
5. 查看诊断结果

---

## ❓ 常见问题

### Q1: 分析失败，提示API错误

**解决方案**:
- 检查环境变量是否正确添加
- 确认API密钥是否有效
- 确认已重新部署
- 检查所选服务是否配置了对应的密钥

### Q2: 上传图片后没反应

**解决方案**:
- 检查图片格式（支持JPG、PNG）
- 图片大小不要超过10MB
- 确保选择了正确的服务提供商

### Q3: 显示"未配置API密钥"

**解决方案**:
- 回到Vercel设置页面
- 检查环境变量是否添加
- 确认变量名拼写正确
- 重新部署项目

### Q4: 想更换AI服务商

**操作**:
1. 获取新服务商的API密钥
2. 在Vercel环境变量中添加
3. 重新部署
4. 在网站上选择新服务商

---

## 💰 费用说明

### Vercel
- ✅ 免费套餐完全够用
- ✅ 每月100GB带宽
- ✅ 无限项目

### AI API
- **Google Gemini**: 每月60次免费请求，之后付费
- **字节豆包**: 有免费额度，具体看官方政策
- **百度OCR**: 每天免费500次
- **其他**: 各有免费额度

**建议**: 开始使用免费额度，需要时再升级。

---

## 🔄 更新项目

如果项目代码有更新：

1. 下载新版本代码
2. 在GitHub仓库中上传替换
3. Vercel会自动重新部署

或者使用GitHub Desktop同步更新。

---

## 🆘 需要帮助？

如果遇到问题：

1. 仔细检查每一步是否正确执行
2. 查看Vercel部署日志（Deployments → 点击部署 → Runtime Logs）
3. 在GitHub项目页面提交Issue
4. 附上错误截图和描述

---

## ✅ 部署成功检查清单

- [ ] GitHub账号已注册
- [ ] Vercel账号已注册
- [ ] 至少获取了一个AI服务的API密钥
- [ ] 代码已上传到GitHub
- [ ] Vercel项目已创建并部署
- [ ] 环境变量已正确添加
- [ ] 项目已重新部署
- [ ] 能够成功访问网站
- [ ] 上传图片能正常分析

**全部打勾？恭喜您，部署成功！🎉**

---

**祝您使用愉快！有问题随时查阅本指南。**
