# CodeTrail - AI-Powered Coding Tracker

Track your coding journey across multiple platforms with AI-powered insights and personalized recommendations.

## 🚀 Features

- **Multi-Platform Integration**: Connect LeetCode, Codeforces, and other coding platforms
- **AI-Powered Coaching**: Get personalized recommendations based on your coding patterns
- **Unified Analytics**: View your progress across all platforms in one dashboard
- **Smart Caching**: Optimized performance with Redis-powered caching
- **Real-time Insights**: Track contest ratings, submission patterns, and topic mastery
- **Dark/Light Theme**: Adaptive theming with system preference detection

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** + **shadcn/ui** for styling
- **Recharts** for data visualization
- **React Context** for state management

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** with **Prisma ORM**
- **Redis** for caching
- **JWT** authentication
- **Deepseek LLM** for AI coaching

## 🏗️ Architecture

- **Client-Server Architecture** with REST APIs
- **Reverse-engineered GraphQL** integration for LeetCode data
- **Intelligent caching strategy** with different TTL for various data types
- **Microservices-style organization** with dedicated controllers and services

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tejaswa2611/CodeTrail.git
   cd CodeTrail
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd Client
   npm install
   
   # Backend
   cd ../Server
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp Client/.env.example Client/.env
   cp Server/.env.example Server/.env
   ```

4. **Database Setup**
   ```bash
   cd Server
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start Development Servers**
   ```bash
   # Backend (Terminal 1)
   cd Server
   npm run dev
   
   # Frontend (Terminal 2)
   cd Client
   npm run dev
   ```

## 📦 Deployment

### Frontend (AWS Amplify)
- Deployed on AWS Amplify with automatic CI/CD
- Environment variables configured in Amplify console

### Backend (Railway)
- Deployed on Railway with PostgreSQL and Redis add-ons
- Automatic deployments from main branch

## 🔧 Key Features Implementation

### LeetCode Integration
- Reverse-engineered GraphQL API for data access
- Smart rate limiting and error handling
- Comprehensive user profile and submission data

### AI Coaching System
- Powered by Deepseek LLM
- Context-aware recommendations
- Personalized problem suggestions based on weak areas

### Caching Strategy
- **User Profiles**: 5min TTL
- **Calendar Data**: 1hr TTL  
- **Contest Rankings**: 15min TTL
- **Static Problems**: 24hr TTL
- **AI Context**: 30min TTL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Tejaswa**
- GitHub: [@Tejaswa2611](https://github.com/Tejaswa2611)
- Twitter: [@tejaswa2611](https://twitter.com/tejaswa2611)

## 🙏 Acknowledgments

- Thanks to the competitive programming community for inspiration
- shadcn/ui for the amazing component library
- All the open-source libraries that made this project possible

---

Built with ❤️ for the competitive programming community
