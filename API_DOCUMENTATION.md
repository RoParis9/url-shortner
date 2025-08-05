# URL Shortener API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require authentication using JWT Bearer tokens.

**Header Format:**
```
Authorization: Bearer <access_token>
```

## Endpoints

### 🔐 Authentication

#### Register User
```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Login User
```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user123",
    "email": "user@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

#### Logout User
```http
POST /api/v1/auth/logout
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### 👤 User Management

#### Get User Profile
```http
GET /api/v1/users/profile
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "id": "user123",
    "email": "user@example.com"
  }
}
```

#### Update User Profile
```http
PUT /api/v1/users/profile
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user123",
    "email": "newemail@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### Delete User Account
```http
DELETE /api/v1/users/account
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Account deleted successfully"
}
```

### 🔗 URL Management

#### Create URL (Authenticated)
```http
POST /api/v1/urls
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very-long-url",
  "customShortCode": "custom123"
}
```

**Response:**
```json
{
  "message": "URL shortened successfully",
  "url": {
    "id": "url123",
    "originalUrl": "https://example.com/very-long-url",
    "shortCode": "custom123",
    "shortUrl": "http://localhost:3000/custom123",
    "clicks": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Create URL (Public)
```http
POST /api/v1/urls/public
```

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very-long-url",
  "customShortCode": "custom123"
}
```

**Response:**
```json
{
  "message": "URL shortened successfully",
  "url": {
    "id": "url123",
    "originalUrl": "https://example.com/very-long-url",
    "shortCode": "custom123",
    "shortUrl": "http://localhost:3000/custom123",
    "clicks": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get User URLs
```http
GET /api/v1/urls?page=1&limit=10&sortBy=createdAt&sortOrder=desc
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "URLs retrieved successfully",
  "urls": [
    {
      "id": "url123",
      "originalUrl": "https://example.com/very-long-url",
      "shortCode": "custom123",
      "shortUrl": "http://localhost:3000/custom123",
      "clicks": 5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

#### Update URL
```http
PUT /api/v1/urls/:urlId
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "originalUrl": "https://newexample.com/updated-url",
  "customShortCode": "newcustom123"
}
```

**Response:**
```json
{
  "message": "URL updated successfully",
  "url": {
    "id": "url123",
    "originalUrl": "https://newexample.com/updated-url",
    "shortCode": "newcustom123",
    "shortUrl": "http://localhost:3000/newcustom123",
    "clicks": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### Delete URL
```http
DELETE /api/v1/urls/:urlId
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "URL deleted successfully"
}
```

#### Bulk Create URLs
```http
POST /api/v1/urls/bulk
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "urls": [
    {
      "originalUrl": "https://example1.com",
      "customShortCode": "custom1"
    },
    {
      "originalUrl": "https://example2.com",
      "customShortCode": "custom2"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Successfully created 2 URLs",
  "urls": [
    {
      "id": "url123",
      "originalUrl": "https://example1.com",
      "shortCode": "custom1",
      "shortUrl": "http://localhost:3000/custom1",
      "clicks": 0,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "shortUrls": [
    "http://localhost:3000/custom1",
    "http://localhost:3000/custom2"
  ],
  "failedUrls": []
}
```

#### Redirect to Original URL
```http
GET /:shortCode
```

**Response:** Redirects to the original URL

### 📊 Analytics

#### Get URL Analytics
```http
GET /api/v1/analytics/urls/:urlId?startDate=2024-01-01&endDate=2024-01-31&groupBy=day
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Analytics retrieved successfully",
  "url": {
    "id": "url123",
    "originalUrl": "https://example.com/very-long-url",
    "shortCode": "custom123",
    "clicks": 150,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "analytics": {
    "totalClicks": 150,
    "uniqueVisitors": 120,
    "topReferrers": ["google.com", "facebook.com", "twitter.com"],
    "topUserAgents": ["Mozilla/5.0", "Chrome/91.0", "Safari/14.0"],
    "clicksByDate": {
      "2024-01-01": 10,
      "2024-01-02": 15,
      "2024-01-03": 20
    },
    "lastUpdated": "2024-01-31T23:59:59.000Z"
  },
  "summary": {
    "totalClicks": 150,
    "uniqueVisitors": 120,
    "averageClicksPerDay": 5.0,
    "topReferrers": ["google.com", "facebook.com", "twitter.com"],
    "topUserAgents": ["Mozilla/5.0", "Chrome/91.0", "Safari/14.0"],
    "clicksByDate": {
      "2024-01-01": 10,
      "2024-01-02": 15,
      "2024-01-03": 20
    }
  },
  "clicks": [
    {
      "id": "click123",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0",
      "referer": "google.com",
      "timestamp": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

#### Get Dashboard Stats
```http
GET /api/v1/analytics/dashboard
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Dashboard stats retrieved successfully",
  "stats": {
    "totalUrls": 25,
    "totalClicks": 1500,
    "uniqueVisitors": 1200,
    "topPerformingUrls": [
      {
        "id": "url123",
        "originalUrl": "https://example.com",
        "shortCode": "custom123",
        "clicks": 500
      }
    ]
  }
}
```

### 🏥 Health Check

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Original URL is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 404 Not Found
```json
{
  "error": "URL not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

- **Public endpoints:** 100 requests per 15 minutes per IP
- **Authenticated endpoints:** 1000 requests per 15 minutes per user
- **Bulk operations:** 10 requests per hour per user

## Environment Variables

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