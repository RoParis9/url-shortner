import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Url } from '@/domain/entities/url.entity';

// Mock Prisma for integration tests
jest.mock('@prisma/client');

const mockPrisma = {
  url: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  click: {
    create: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

(PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(() => mockPrisma as any);

// Create a simple Express app for testing
const app = express();
app.use(express.json());

// Mock URL shortening endpoint
app.post('/api/urls', async (req, res) => {
  try {
    const { originalUrl, userId } = req.body;
    
    // Create URL entity
    const url = Url.create(originalUrl, userId);
    
    // Mock database save
    const savedUrl = await mockPrisma.url.create({
      data: {
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        userId: url.userId,
        clicks: url.clicks,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      },
    });

    res.json({
      id: savedUrl.id,
      originalUrl: savedUrl.originalUrl,
      shortCode: savedUrl.shortCode,
      shortUrl: url.getFullShortUrl('http://localhost:3000'),
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Mock redirect endpoint
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    
    // Mock database find
    const url = await mockPrisma.url.findUnique({
      where: { shortCode },
    });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Mock click tracking
    await mockPrisma.click.create({
      data: {
        urlId: url.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer'),
      },
    });

    // Mock click increment
    await mockPrisma.url.update({
      where: { id: url.id },
      data: { clicks: { increment: 1 } },
    });

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

describe('URL Shortener Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/urls', () => {
    it('should create a shortened URL', async () => {
      const originalUrl = 'https://example.com';
      const userId = 'user123';

      mockPrisma.url.create.mockResolvedValue({
        id: 'url123',
        originalUrl,
        shortCode: 'abc123',
        userId,
        clicks: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/urls')
        .send({ originalUrl, userId })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('originalUrl', originalUrl);
      expect(response.body).toHaveProperty('shortCode');
      expect(response.body).toHaveProperty('shortUrl');
      expect(response.body.shortUrl).toContain(response.body.shortCode);
    });

    it('should return error for invalid URL', async () => {
      const invalidUrl = 'not-a-url';

      const response = await request(app)
        .post('/api/urls')
        .send({ originalUrl: invalidUrl })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid URL format');
    });
  });

  describe('GET /:shortCode', () => {
    it('should redirect to original URL', async () => {
      const shortCode = 'abc123';
      const originalUrl = 'https://example.com';

      mockPrisma.url.findUnique.mockResolvedValue({
        id: 'url123',
        originalUrl,
        shortCode,
        userId: null,
        clicks: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockPrisma.click.create.mockResolvedValue({});
      mockPrisma.url.update.mockResolvedValue({});

      const response = await request(app)
        .get(`/${shortCode}`)
        .expect(302);

      expect(response.headers.location).toBe(originalUrl);
    });

    it('should return 404 for non-existent short code', async () => {
      mockPrisma.url.findUnique.mockResolvedValue(null);

      await request(app)
        .get('/nonexistent')
        .expect(404);
    });
  });
}); 