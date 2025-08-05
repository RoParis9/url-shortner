# API Testing Guide - URL Shortener

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User
**Method:** `POST`  
**URL:** `/api/v1/auth/register`  
**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Example Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "createdAt": "2025-08-05T01:00:00.000Z"
  }
}
```

---

### 2. Login User
**Method:** `POST`  
**URL:** `/api/v1/auth/login`  
**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Example Response:**
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

---

### 3. Refresh Token
**Method:** `POST`  
**URL:** `/api/v1/auth/refresh`  
**Authentication:** Not required

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Example Response:**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

---

### 4. Logout User
**Method:** `POST`  
**URL:** `/api/v1/auth/logout`  
**Authentication:** Required

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Example Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## 👤 User Management Endpoints

### 5. Get User Profile
**Method:** `GET`  
**URL:** `/api/v1/users/profile`  
**Authentication:** Required

**Request Body:** None

**Example Response:**
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "id": "user123",
    "email": "user@example.com"
  }
}
```

---

### 6. Update User Profile
**Method:** `PUT`  
**URL:** `/api/v1/users/profile`  
**Authentication:** Required

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

**Example Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user123",
    "email": "newemail@example.com",
    "createdAt": "2025-08-05T01:00:00.000Z",
    "updatedAt": "2025-08-05T02:00:00.000Z"
  }
}
```

---

### 7. Delete User Account
**Method:** `DELETE`  
**URL:** `/api/v1/users/account`  
**Authentication:** Required

**Request Body:**
```json
{
  "password": "password123"
}
```

**Example Response:**
```json
{
  "message": "Account deleted successfully"
}
```

---

## 🔗 URL Management Endpoints

### 8. Create URL (Authenticated)
**Method:** `POST`  
**URL:** `/api/v1/urls`  
**Authentication:** Required

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very-long-url-that-needs-shortening",
  "customShortCode": "custom123"
}
```

**Example Response:**
```json
{
  "message": "URL shortened successfully",
  "url": {
    "id": "url123",
    "originalUrl": "https://example.com/very-long-url-that-needs-shortening",
    "shortCode": "custom123",
    "shortUrl": "http://localhost:3000/custom123",
    "clicks": 0,
    "createdAt": "2025-08-05T01:00:00.000Z"
  }
}
```

---

### 9. Get User URLs
**Method:** `GET`  
**URL:** `/api/v1/urls?page=1&limit=10&sortBy=createdAt&sortOrder=desc`  
**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Sort field - `createdAt`, `clicks`, `updatedAt` (default: createdAt)
- `sortOrder` (optional): Sort order - `asc`, `desc` (default: desc)

**Request Body:** None

**Example Response:**
```json
{
  "message": "URLs retrieved successfully",
  "urls": [
    {
      "id": "url123",
      "originalUrl": "https://example.com/very-long-url",
      "shortCode": "abc123",
      "shortUrl": "http://localhost:3000/abc123",
      "clicks": 5,
      "createdAt": "2025-08-05T01:00:00.000Z",
      "updatedAt": "2025-08-05T02:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 10. Update URL
**Method:** `PUT`  
**URL:** `/api/v1/urls/:urlId`  
**Authentication:** Required

**Request Body:**
```json
{
  "originalUrl": "https://newexample.com/updated-url",
  "customShortCode": "newcustom123"
}
```

**Example Response:**
```json
{
  "message": "URL updated successfully",
  "url": {
    "id": "url123",
    "originalUrl": "https://newexample.com/updated-url",
    "shortCode": "newcustom123",
    "shortUrl": "http://localhost:3000/newcustom123",
    "clicks": 5,
    "createdAt": "2025-08-05T01:00:00.000Z",
    "updatedAt": "2025-08-05T03:00:00.000Z"
  }
}
```

---

### 11. Delete URL
**Method:** `DELETE`  
**URL:** `/api/v1/urls/:urlId`  
**Authentication:** Required

**Request Body:** None

**Example Response:**
```json
{
  "message": "URL deleted successfully"
}
```

---

### 12. Create Public URL
**Method:** `POST`  
**URL:** `/api/v1/urls/public`  
**Authentication:** Not required

**Request Body:**
```json
{
  "originalUrl": "https://example.com/public-url",
  "customShortCode": "public123"
}
```

**Example Response:**
```json
{
  "message": "URL shortened successfully",
  "url": {
    "id": "url456",
    "originalUrl": "https://example.com/public-url",
    "shortCode": "public123",
    "shortUrl": "http://localhost:3000/public123",
    "clicks": 0,
    "createdAt": "2025-08-05T01:00:00.000Z"
  }
}
```

---

### 13. Bulk Create URLs
**Method:** `POST`  
**URL:** `/api/v1/urls/bulk`  
**Authentication:** Required

**Request Body:**
```json
{
  "urls": [
    {
      "originalUrl": "https://example1.com",
      "customShortCode": "bulk1"
    },
    {
      "originalUrl": "https://example2.com",
      "customShortCode": "bulk2"
    }
  ]
}
```

**Example Response:**
```json
{
  "message": "Successfully created 2 URLs",
  "urls": [
    {
      "id": "url789",
      "originalUrl": "https://example1.com",
      "shortCode": "bulk1",
      "shortUrl": "http://localhost:3000/bulk1",
      "clicks": 0,
      "createdAt": "2025-08-05T01:00:00.000Z"
    }
  ],
  "shortUrls": [
    "http://localhost:3000/bulk1",
    "http://localhost:3000/bulk2"
  ],
  "failedUrls": []
}
```

---

### 14. Redirect to Original URL
**Method:** `GET`  
**URL:** `/:shortCode`  
**Authentication:** Not required

**Request Body:** None

**Response:** HTTP 302 Redirect to the original URL

---

## 📊 Analytics Endpoints

### 15. Get URL Analytics
**Method:** `GET`  
**URL:** `/api/v1/analytics/urls/:urlId?startDate=2025-08-01&endDate=2025-08-05&groupBy=day`  
**Authentication:** Required

**Query Parameters:**
- `startDate` (optional): Start date in ISO format
- `endDate` (optional): End date in ISO format
- `groupBy` (optional): Grouping - `day`, `hour`, `month` (default: day)

**Request Body:** None

**Example Response:**
```json
{
  "message": "Analytics retrieved successfully",
  "url": {
    "id": "url123",
    "originalUrl": "https://example.com",
    "shortCode": "abc123",
    "clicks": 10,
    "createdAt": "2025-08-01T00:00:00.000Z"
  },
  "analytics": {
    "id": "analytics123",
    "urlId": "url123",
    "totalClicks": 10,
    "uniqueVisitors": 8,
    "topReferrers": ["google.com", "twitter.com"],
    "topUserAgents": ["Mozilla/5.0...", "Chrome/91.0..."],
    "clicksByDate": {
      "2025-08-01": 3,
      "2025-08-02": 4,
      "2025-08-03": 3
    },
    "lastUpdated": "2025-08-05T01:00:00.000Z"
  },
  "summary": {
    "totalClicks": 10,
    "uniqueVisitors": 8,
    "averageClicksPerDay": 2.5,
    "topReferrers": ["google.com", "twitter.com"],
    "topUserAgents": ["Mozilla/5.0...", "Chrome/91.0..."],
    "clicksByDate": {
      "2025-08-01": 3,
      "2025-08-02": 4,
      "2025-08-03": 3
    }
  },
  "clicks": [
    {
      "id": "click123",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "referer": "google.com",
      "timestamp": "2025-08-01T10:00:00.000Z"
    }
  ]
}
```

---

### 16. Get Dashboard Stats
**Method:** `GET`  
**URL:** `/api/v1/analytics/dashboard`  
**Authentication:** Required

**Request Body:** None

**Example Response:**
```json
{
  "message": "Dashboard stats retrieved successfully",
  "stats": {
    "totalUrls": 5,
    "totalClicks": 25,
    "uniqueVisitors": 15,
    "topPerformingUrls": [
      {
        "id": "url123",
        "originalUrl": "https://example.com",
        "shortCode": "abc123",
        "clicks": 10
      }
    ]
  }
}
```

---

## 🏥 System Endpoints

### 17. Health Check
**Method:** `GET`  
**URL:** `/health`  
**Authentication:** Not required

**Request Body:** None

**Example Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-08-05T01:00:00.000Z",
  "version": "1.0.0"
}
```

---

### 18. API Information
**Method:** `GET`  
**URL:** `/`  
**Authentication:** Not required

**Request Body:** None

**Example Response:**
```json
{
  "message": "URL Shortener API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/v1/auth",
    "users": "/api/v1/users",
    "urls": "/api/v1/urls",
    "analytics": "/api/v1/analytics",
    "health": "/health"
  },
  "documentation": {
    "swagger": "http://localhost:3000/api-docs",
    "scalar": "http://localhost:3000/docs",
    "openapi": "http://localhost:3000/api-docs/swagger.json"
  }
}
```

---

## 🧪 Testing with cURL

### Example: Register a new user
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Example: Login and get token
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Example: Create URL with authentication
```bash
curl -X POST http://localhost:3000/api/v1/urls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "originalUrl": "https://example.com/very-long-url",
    "customShortCode": "test123"
  }'
```

### Example: Get user URLs
```bash
curl -X GET http://localhost:3000/api/v1/urls \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📝 Notes

1. **Authentication**: Most endpoints require a valid JWT token in the Authorization header
2. **Error Responses**: All endpoints return error responses in the format:
   ```json
   {
     "error": "Error message description"
   }
   ```
3. **Status Codes**: 
   - 200: Success
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 404: Not Found
   - 500: Internal Server Error
4. **Pagination**: List endpoints support pagination with `page` and `limit` parameters
5. **Custom Short Codes**: Optional custom short codes can be provided when creating URLs
6. **Analytics**: Click tracking is automatic when URLs are accessed via the redirect endpoint 