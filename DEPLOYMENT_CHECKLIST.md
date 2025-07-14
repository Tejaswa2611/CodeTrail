# 🚀 CodeTrail Backend Deployment Checklist

## ✅ Pre-Deployment Fixes Applied

### 1. Environment Variables Configuration
- ✅ Added `SERVER_URL` environment variable to config
- ✅ Updated `.env.example` with all required variables
- ✅ Replaced hardcoded localhost URLs with environment variables

### 2. Production-Ready Configuration
- ✅ PORT is configurable via environment variable (defaults to 3000)
- ✅ All service URLs now use `SERVER_URL` environment variable
- ✅ CORS origin is configurable
- ✅ Database URL is configurable via `DATABASE_URL`

### 3. API Services Updated
- ✅ ChatbotService HTTP-Referer headers use `SERVER_URL`
- ✅ AICoachService internal API calls use `SERVER_URL`
- ✅ Health check endpoints available at `/api/health`

---

## 🔧 Environment Variables Required for Render

### Required Variables:
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<render-postgres-connection-string>
SERVER_URL=https://your-app-name.onrender.com
CORS_ORIGIN=https://your-amplify-domain.amplifyapp.com
JWT_SECRET=<secure-random-string>
JWT_REFRESH_SECRET=<different-secure-random-string>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```

### Optional Variables (for AI features):
```env
OPENROUTER_API_KEY=<your-openrouter-api-key>
```

---

## 📋 Render Deployment Steps

### 1. Create PostgreSQL Database
1. Go to Render Dashboard → New → PostgreSQL
2. Name: `codetrail-db`
3. Database: `codetrail`
4. User: `codetrail_user`
5. Region: Same as your web service
6. Plan: Free

### 2. Create Web Service
1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. **Root Directory**: `Server`
4. **Environment**: Node
5. **Build Command**: `npm install && npm run build`
6. **Start Command**: `npm start`
7. **Instance Type**: Free

### 3. Configure Environment Variables in Render
Copy all the environment variables listed above into your Render web service settings.

**Important**: 
- Use the Internal Database URL from your PostgreSQL service for `DATABASE_URL`
- Set `SERVER_URL` to your Render web service URL
- Update `CORS_ORIGIN` with your Amplify frontend URL

### 4. Deploy and Test
1. Deploy the service
2. Check logs for any errors
3. Test health endpoint: `https://your-app.onrender.com/api/health`
4. Test database connection and migrations

---

## 🧪 Testing Endpoints

### Health Checks:
- `GET /api/health` - Overall API health
- `GET /api/auth/health` - Auth service health
- `GET /api/chatbot/health` - AI chatbot health
- `GET /api/leetcode/health` - LeetCode API health

### Sample API Test:
```bash
# Test basic health
curl https://your-app.onrender.com/api/health

# Test CORS
curl -H "Origin: https://your-amplify-domain.amplifyapp.com" \
     https://your-app.onrender.com/api/health
```

---

## ⚠️ Known Limitations (Free Tier)

1. **Cold Starts**: Service sleeps after 15 minutes of inactivity
2. **Database**: 1GB storage limit
3. **Build Time**: 15 minutes build timeout
4. **Concurrent Connections**: Limited on free tier

---

## 🔄 Database Migrations

After deployment, your app will automatically run:
1. `npm run build` - Compile TypeScript
2. `npm start` - Start the server
3. Prisma will automatically run migrations on startup

If you need to run migrations manually:
```bash
# In Render console
npm run db:migrate
npm run db:seed  # If you have seed data
```

---

## 🚀 Ready for Deployment!

Your backend is now production-ready with:
- ✅ Configurable ports and URLs
- ✅ Environment-based configuration
- ✅ Production-ready database setup
- ✅ Health check endpoints
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Security middleware active

Deploy to Render and update the frontend's API URL to point to your new backend!
