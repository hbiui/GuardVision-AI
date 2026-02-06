#!/bin/bash

echo "🛡️ GuardVision AI 海报检查器 - 快速设置"
echo "=========================================="
echo ""

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到Node.js，请先安装Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo ""

# 安装依赖
echo "📦 正在安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo ""
echo "✅ 依赖安装完成"
echo ""

# 创建环境变量文件
if [ ! -f .env.local ]; then
    echo "📝 创建环境变量文件..."
    cp .env.example .env.local
    echo "⚠️  请编辑 .env.local 文件，填入您的API密钥"
    echo ""
fi

echo "=========================================="
echo "🎉 设置完成！"
echo ""
echo "下一步操作："
echo "1. 编辑 .env.local 文件，填入API密钥"
echo "2. 运行 'npm run dev' 启动开发服务器"
echo "3. 访问 http://localhost:3000"
echo ""
echo "部署到Vercel："
echo "1. 推送代码到GitHub"
echo "2. 在Vercel导入项目"
echo "3. 配置环境变量"
echo "4. 完成！"
echo ""
echo "详细说明请查看 DEPLOYMENT_GUIDE.md"
echo "=========================================="
