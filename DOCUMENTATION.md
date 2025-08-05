# URL Shortener API Documentation

## 📚 Documentation Overview

This API provides comprehensive documentation through multiple interfaces:

### 🔗 Documentation URLs

- **Swagger UI**: `/api-docs` - Interactive API documentation with testing capabilities
- **Scalar Docs**: `/docs` - Modern, beautiful API documentation interface
- **OpenAPI JSON**: `/api-docs/swagger.json` - Raw OpenAPI specification
- **Health Check**: `/health` - API health status

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd url-shortner
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start the Server**
   ```bash
   npm run dev
   ```

5. **Access Documentation**
   - Swagger UI: http://localhost:3000/api-docs
   - Scalar Docs: http://localhost:3000/docs
   - API Root: http://localhost:3000

## 📖 API Documentation Features

### Swagger UI (`/api-docs`)

**Features:**
- ✅ Interactive API testing
- ✅ Request/response examples
- ✅ Authentication support
- ✅ Schema validation
- ✅ Try-it-out functionality
- ✅ Request/response logging
- ✅ Filtering and search

**Customization:**
- Custom CSS styling
- Persistent authorization
- Request duration display
- Advanced filtering options

### Scalar Documentation (`/docs`)

**Features:**
- 🎨 Modern, beautiful interface
- 📱 Mobile-responsive design
- 🔍 Advanced search capabilities
- 📊 Interactive examples
- 🎯 Better developer experience
- 🌙 Dark/light mode support

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

### Token Types
- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for token renewal

### Authentication Flow

1. **Register** → Get user account
2. **Login** → Get access + refresh tokens
3. **Use Access Token** → Make authenticated requests
4. **Refresh Token** → Get new access token when expired
5. **Logout** → Invalidate refresh token

### Usage in Requests

```bash
# Add to request headers
Authorization: Bearer <access_token>
```

## 📋 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | ❌ |
| POST | `/api/v1/auth/login` | Login user | ❌ |
| POST | `/api/v1/auth/refresh` | Refresh access token | ❌ |
| POST | `/api/v1/auth/logout` | Logout user | ❌ |

### User Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users/profile` | Get user profile | ✅ |
| PUT | `/api/v1/users/profile` | Update user profile | ✅ |
| DELETE | `/api/v1/users/account` | Delete user account | ✅ |

### URL Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/urls` | Create URL (authenticated) | ✅ |
| POST | `/api/v1/urls/public` | Create URL (public) | ❌ |
| GET | `/api/v1/urls` | Get user URLs | ✅ |
| PUT | `/api/v1/urls/:urlId` | Update URL | ✅ |
| DELETE | `/api/v1/urls/:urlId` | Delete URL | ✅ |
| POST | `/api/v1/urls/bulk` | Bulk create URLs | ✅ |
| GET | `/:shortCode` | Redirect to original URL | ❌ |

### Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/analytics/urls/:urlId` | Get URL analytics | ✅ |
| GET | `/api/v1/analytics/dashboard` | Get dashboard stats | ✅ |

### System Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | ❌ |
| GET | `/` | API information | ❌ |

## 🏗️ Architecture

### Clean Architecture Layers

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

### Key Components

- **Domain Entities**: Pure business objects
- **Use Cases**: Application business logic
- **Controllers**: HTTP request handling
- **Repositories**: Data access abstraction
- **Services**: External integrations

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://urluser:urlpass@localhost:5432/urldb"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# Server
PORT=3000
NODE_ENV=development
BASE_URL="http://localhost:3000"
```

### Docker Configuration

```bash
# Start with Docker
docker-compose up -d

# Access services
API: http://localhost:3000
Database: localhost:5432
```

## 🧪 Testing

### Test Commands

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

### Test Structure

```
📁 tests/
├── 📁 unit/           # Unit tests
│   └── 📁 domain/     # Domain entity tests
├── 📁 integration/    # Integration tests
└── 📁 e2e/           # End-to-end tests
```

## 📊 Database Schema

### Core Tables

- **users**: User accounts and authentication
- **urls**: Shortened URLs and metadata
- **clicks**: Click tracking and analytics
- **sessions**: User session management
- **analytics**: Aggregated analytics data
- **rate_limits**: API rate limiting
- **custom_domains**: Premium custom domains

## 🚀 Deployment

### Production Checklist

- [ ] Set production environment variables
- [ ] Configure database connection
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

### Docker Deployment

```bash
# Build and run
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale api=3
```

## 🔒 Security

### Security Features

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Rate limiting protection
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection

### Best Practices

- Use HTTPS in production
- Rotate JWT secrets regularly
- Implement proper error handling
- Log security events
- Regular dependency updates
- Security headers configuration

## 📈 Monitoring & Analytics

### Built-in Analytics

- Click tracking per URL
- User agent analysis
- Referrer tracking
- Geographic data (IP-based)
- Time-based analytics
- Custom domain usage

### Monitoring Endpoints

- `/health` - Service health
- `/metrics` - Performance metrics (planned)
- `/status` - System status (planned)

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create feature branch
3. Follow coding standards
4. Write tests
5. Submit pull request

### Code Standards

- TypeScript strict mode
- ESLint + Prettier
- Jest for testing
- Clean Architecture principles
- Comprehensive documentation

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: `/api-docs` or `/docs`
- **Issues**: GitHub Issues
- **Email**: support@urlshortener.com
- **Discord**: [Community Server]

---

**Built with ❤️ using Clean Architecture principles** 