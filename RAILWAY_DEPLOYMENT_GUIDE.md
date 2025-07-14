# 🚀 Complete Railway Deployment Guide for CodeTrail

## 🎯 Why Railway?
- ✅ **Better than Render**: More reliable, faster deployments
- ✅ **Generous Free Tier**: $5 credit monthly (usually enough for small apps)
- ✅ **Auto-scaling**: Handles traffic spikes better
- ✅ **Better Database**: More reliable PostgreSQL
- ✅ **No sleep**: Services don't go to sleep like Render
- ✅ **Easy deploys**: Git-based deployments

---

## 📋 Phase 1: Railway Backend Deployment

### Step 1: Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended)
3. Verify your account
4. You get **$5 free credit monthly** (enough for small apps)

### Step 2: Create New Project

1. **Click "New Project"**
2. **Select "Deploy from GitHub repo"**
3. **Connect your GitHub account** if not already connected
4. **Select your CodeTrail repository**
5. **Choose the `main` branch**

### Step 3: Configure the Backend Service

1. **Railway will auto-detect** it's a Node.js project
2. **Set Root Directory**: Click on the service → Settings → **Source** → Set to `Server`
3. **Build Command**: `npm install && npm run build && npx prisma generate`
4. **Start Command**: `npx prisma migrate deploy && npm start`

### Step 4: Add PostgreSQL Database

1. **In your project dashboard**, click **"+ New"**
2. **Select "Database" → "PostgreSQL"**
3. **Railway will automatically provision** a PostgreSQL database
4. **Note**: The database URL will be automatically available as `DATABASE_URL`

### Step 5: Configure Environment Variables

Click on your **backend service** → **Variables** tab, then add:

```env
# Production Environment
NODE_ENV=production
PORT=$PORT

# Database (Auto-provided by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Server URL (Update with your Railway domain)
SERVER_URL=https://your-service-name.up.railway.app

# CORS (Update with your Amplify domain)
CORS_ORIGIN=https://main.d1a2b3c4d5e6f7.amplifyapp.com

# JWT Secrets (Generate secure keys)
JWT_SECRET=your-super-secret-jwt-key-here-make-this-very-long-and-complex-32-chars
JWT_REFRESH_SECRET=your-different-super-secret-refresh-key-here-make-this-different
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Security & Rate Limiting
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: AI Features
OPENROUTER_API_KEY=your-openrouter-api-key-if-you-want-ai-chatbot
```

**Important Notes:**
- `$PORT` is Railway's dynamic port variable
- `${{Postgres.DATABASE_URL}}` automatically links to your PostgreSQL database
- Generate strong JWT secrets (32+ characters)

### Step 6: Deploy

1. **Click "Deploy"** or push to your GitHub repository
2. **Railway will automatically**:
   - Install dependencies
   - Build TypeScript
   - Generate Prisma client
   - Run database migrations
   - Start the server

### Step 7: Get Your Backend URL

1. **After deployment**, go to your service
2. **Click "Settings" → "Networking"**
3. **Click "Generate Domain"**
4. **Copy the domain** (e.g., `https://codetrail-backend.up.railway.app`)
5. **Update `SERVER_URL`** environment variable with this domain

---

## 📋 Phase 2: Frontend Deployment on AWS Amplify

### Step 1: Prepare Frontend Environment

Create `Client/.env.production`:
```env
VITE_API_URL=https://your-railway-backend.up.railway.app
```

### Step 2: Deploy to Amplify

1. **Go to AWS Amplify Console**
2. **Click "New app" → "Host web app"**
3. **Connect GitHub repository**
4. **Select `CodeTrail` repository**
5. **Branch**: `main`
6. **App name**: `CodeTrail`

### Step 3: Configure Build Settings

Amplify auto-detects React. Verify the build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd Client
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: Client/dist
    files:
      - '**/*'
  cache:
    paths:
      - Client/node_modules/**/*
```

### Step 4: Add Environment Variables

In Amplify → App settings → Environment variables:
```env
VITE_API_URL=https://your-railway-backend.up.railway.app
```

### Step 5: Configure SPA Routing

Go to App settings → Rewrites and redirects:
- **Source**: `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>`
- **Target**: `/index.html`
- **Type**: `200 (Rewrite)`

### Step 6: Update Backend CORS

1. **Get your Amplify URL** (e.g., `https://main.d1a2b3c4d5e6f7.amplifyapp.com`)
2. **Update Railway environment variable**:
   - `CORS_ORIGIN=https://main.d1a2b3c4d5e6f7.amplifyapp.com`
3. **Redeploy Railway service**

---

## 🧪 Testing Your Deployment

### Backend Health Checks:
```bash
# Test overall API health
curl https://your-railway-backend.up.railway.app/api/health

# Test auth service
curl https://your-railway-backend.up.railway.app/api/auth/health

# Test LeetCode API
curl https://your-railway-backend.up.railway.app/api/leetcode/health
```

### Frontend Testing:
1. **Visit your Amplify URL**
2. **Check browser console** for errors
3. **Test API connectivity** (login, data fetching)
4. **Verify all features work**

---

## 💰 Cost Breakdown

### Railway (Free Tier):
- ✅ **$5 credit monthly** (usually sufficient)
- ✅ **PostgreSQL database** included
- ✅ **No sleep** - always available
- ✅ **512MB RAM, 1 vCPU**
- ✅ **Automatic scaling**

### AWS Amplify (Free Tier):
- ✅ **Build minutes**: 1,000/month
- ✅ **Storage**: 15 GB
- ✅ **Data transfer**: 15 GB/month
- ✅ **SSL certificate**: Free

**Total Monthly Cost**: $0 (within free tiers)

---

## 🔧 Railway-Specific Features

### 1. Automatic Database Backups
- **Daily automated backups**
- **Point-in-time recovery**
- **Easy database management**

### 2. Environment Linking
```env
# Automatically links to your PostgreSQL service
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Railway's dynamic port
PORT=$PORT
```

### 3. Easy Scaling
```bash
# If you exceed free tier, easy to upgrade
railway scale --memory 1GB --cpu 2
```

### 4. Built-in Monitoring
- **Real-time logs**
- **Performance metrics**
- **Error tracking**
- **Usage analytics**

---

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails**:
   ```bash
   # Check build logs in Railway dashboard
   # Ensure all dependencies are in package.json
   ```

2. **Database Connection Error**:
   ```bash
   # Verify DATABASE_URL is set correctly
   # Check if migrations ran successfully
   ```

3. **CORS Errors**:
   ```bash
   # Ensure CORS_ORIGIN matches your Amplify URL exactly
   # Include https:// prefix
   ```

4. **Environment Variables Not Working**:
   ```bash
   # Variables are case-sensitive
   # Redeploy after changing variables
   ```

---

## 🎯 Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   AWS Amplify   │────│  Railway Backend │────│Railway Postgres │
│   (Frontend)    │    │   (Node.js API)  │    │   (Database)    │
│                 │    │                  │    │                 │
│ • React App     │    │ • Express API    │    │ • PostgreSQL    │
│ • Auto CI/CD    │    │ • Prisma ORM     │    │ • Auto backups  │
│ • Global CDN    │    │ • JWT Auth       │    │ • No sleep      │
│ • Free SSL      │    │ • Always-on      │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## ✅ Deployment Checklist

### Pre-Deployment:
- ✅ All hardcoded URLs replaced with environment variables
- ✅ Railway configuration files created
- ✅ Package.json scripts updated
- ✅ Environment variables documented

### Railway Setup:
- ✅ Project created and GitHub connected
- ✅ PostgreSQL database provisioned
- ✅ Environment variables configured
- ✅ Custom domain generated
- ✅ Backend deployed and tested

### Amplify Setup:
- ✅ Frontend environment variables configured
- ✅ Build settings verified
- ✅ SPA routing configured
- ✅ CORS updated in backend

### Testing:
- ✅ Health checks pass
- ✅ Database connectivity verified
- ✅ Frontend-backend communication working
- ✅ All features functional

---

## 🚀 Ready to Deploy!

Your CodeTrail project is now **100% ready for Railway deployment**! The Railway setup provides:

- **Better reliability** than free alternatives
- **No cold starts** or sleeping services
- **Professional PostgreSQL** database
- **Easy scaling** when needed
- **Comprehensive monitoring**

Follow the steps above and you'll have a production-ready application running in about 15 minutes!

Need help with any specific step? Let me know!
