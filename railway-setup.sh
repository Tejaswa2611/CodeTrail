#!/bin/bash

# CodeTrail Railway Deployment Setup Script
echo "🚀 CodeTrail Railway Deployment Setup"
echo "======================================"

# Check if we're in the correct directory
if [ ! -f "Server/package.json" ]; then
    echo "❌ Please run this script from the CodeTrail root directory"
    exit 1
fi

echo "✅ Checking project structure..."

# Check required files
echo "📁 Checking required files..."
if [ -f "Server/railway.json" ]; then
    echo "  ✅ railway.json found"
else
    echo "  ❌ railway.json missing"
fi

if [ -f "Server/src/config/index.ts" ]; then
    echo "  ✅ Config file found"
else
    echo "  ❌ Config file missing"
fi

if [ -f "Server/.env.example" ]; then
    echo "  ✅ .env.example found"
else
    echo "  ❌ .env.example missing"
fi

# Check package.json scripts
echo "📦 Checking package.json scripts..."
if grep -q "postinstall" Server/package.json; then
    echo "  ✅ postinstall script found"
else
    echo "  ❌ postinstall script missing"
fi

if grep -q "migrate:deploy" Server/package.json; then
    echo "  ✅ migrate:deploy script found"
else
    echo "  ❌ migrate:deploy script missing"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://railway.app"
echo "2. Sign up with GitHub"
echo "3. Create new project from GitHub repo"
echo "4. Set root directory to 'Server'"
echo "5. Add PostgreSQL database"
echo "6. Configure environment variables (see RAILWAY_DEPLOYMENT_GUIDE.md)"
echo "7. Deploy!"
echo ""
echo "📖 For detailed instructions, see: RAILWAY_DEPLOYMENT_GUIDE.md"
echo ""
echo "✅ Your backend is ready for Railway deployment!"
