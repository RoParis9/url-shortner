# URL Shortener API

A comprehensive URL shortening service built with Node.js, Express, TypeScript, PostgreSQL, and Prisma, following Clean Architecture principles.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### Setup Options

#### **Option 1: Basic Development (Minimal)**
```bash
# 1. Install dependencies
npm install

# 2. Start database only
docker-compose up -d db

# 3. Generate Prisma client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev

# 5. Start the application
npm start
```

#### **Option 2: Development with Tracing (Recommended)**
```bash
# 1. Install dependencies
npm install

# 2. Start database and Jaeger
docker-compose -f docker-compose.dev.yml up -d

# 3. Generate Prisma client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev

# 5. Start the application
npm start
```

#### **Option 3: Full Monitoring Stack (Production-like)**
```bash
# 1. Install dependencies
npm install

# 2. Start all services (Database + API + Jaeger)
docker-compose -f docker-compose.monitoring.yml up -d

# 3. Generate Prisma client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev

# 5. Start the application
npm start
```

## 📊 Available Services

| Service | URL | Description | Required |
|---------|-----|-------------|----------|
| API | http://localhost:3000 | Main application | ✅ |
| Health Check | http://localhost:3000/health | API health status | ✅ |
| API Docs | http://localhost:3000/api-docs | Swagger documentation | ✅ |
| Scalar Docs | http://localhost:3000/docs | Alternative docs | ✅ |
| Jaeger UI | http://localhost:16686 | Distributed tracing | 🔍 |

## 🔧 Environment Configuration

Copy the environment file and configure as needed:

```bash
cp env.example .env
```

### Required Environment Variables
```env
# Database
DATABASE_URL="postgresql://urluser:urlpass@localhost:5432/urldb"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# Server
PORT=3000
NODE_ENV=development
```

### Optional Environment Variables
```env
# Axiom (Log Aggregation)
AXIOM_TOKEN="your-axiom-token"
AXIOM_ORG_ID="your-axiom-org-id"
AXIOM_DATASET="url-shortener-logs"

# Jaeger (Distributed Tracing)
JAEGER_SERVICE_NAME="url-shortener-api"
JAEGER_HOST="localhost"
JAEGER_PORT="6832"
```

## 📚 Documentation

- [API Documentation](API_DOCUMENTATION.md) - Complete API reference
- [Monitoring Guide](MONITORING.md) - Monitoring setup and usage
- [Architecture Overview](ARCHITECTURE.md) - Clean Architecture details

## 🏗️ Architecture

This application follows **Clean Architecture** principles:

```
📁 src/
├── 📁 domain/           # Business logic & entities
│   ├── 📁 entities/     # Domain entities
│   ├── 📁 repositories/ # Repository interfaces
│   └── 📁 services/     # Domain services
├── 📁 application/      # Use cases & business rules
│   └── 📁 use-cases/    # Application use cases
├── 📁 infrastructure/   # External concerns
│   ├── 📁 repositories/ # Repository implementations
│   ├── 📁 services/     # External services
│   └── 📁 middleware/   # Express middleware
└── 📁 interfaces/       # Controllers & routes
    ├── 📁 controllers/  # HTTP controllers
    └── 📁 routes/       # Route definitions
```

## 🧪 Testing

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📦 Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server
npm run build      # Build TypeScript
npm run test       # Run tests
npm run test:watch # Run tests in watch mode
npm run test:e2e   # Run E2E tests
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## 🔍 Monitoring

The application includes comprehensive monitoring:

- **Axiom**: Log aggregation and analysis
- **Jaeger**: Distributed tracing
- **Custom Metrics**: Application-specific metrics
- **Health Checks**: System health monitoring

See [MONITORING.md](MONITORING.md) for detailed setup instructions.

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker
docker-compose -f docker-compose.monitoring.yml up -d
```

### Manual Deployment
```bash
# Install dependencies
npm install

# Build application
npm run build

# Set environment variables
export NODE_ENV=production

# Start application
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ using Clean Architecture principles** 