import { Request, Response } from 'express';
import { CreateUrlUseCase } from '../../application/use-cases/url/create-url.use-case';
import { GetUserUrlsUseCase } from '../../application/use-cases/url/get-user-urls.use-case';
import { UpdateUrlUseCase } from '../../application/use-cases/url/update-url.use-case';
import { DeleteUrlUseCase } from '../../application/use-cases/url/delete-url.use-case';
import { RedirectUrlUseCase } from '../../application/use-cases/url/redirect-url.use-case';
import { BulkCreateUrlsUseCase } from '../../application/use-cases/bulk/bulk-create-urls.use-case';
import { AuthenticatedRequest } from '../../infrastructure/middleware/auth.middleware';

export class UrlController {
  constructor(
    private createUrlUseCase: CreateUrlUseCase,
    private getUserUrlsUseCase: GetUserUrlsUseCase, 
    private updateUrlUseCase: UpdateUrlUseCase,
    private deleteUrlUseCase: DeleteUrlUseCase,
    private redirectUrlUseCase: RedirectUrlUseCase,
    private bulkCreateUrlsUseCase: BulkCreateUrlsUseCase
  ) {}

  /**
   * @swagger
   * /api/v1/urls:
   *   post:
   *     summary: Create a shortened URL (authenticated)
   *     tags: [URLs]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - originalUrl
   *             properties:
   *               originalUrl:
   *                 type: string
   *                 format: uri
   *                 example: https://example.com/very-long-url
   *               customShortCode:
   *                 type: string
   *                 example: custom123
   *     responses:
   *       201:
   *         description: URL shortened successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: URL shortened successfully
   *                 url:
   *                   $ref: '#/components/schemas/Url'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  createUrl = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { originalUrl, customShortCode } = req.body;
      const userId = req.user?.userId;

      if (!originalUrl) {
        res.status(400).json({ error: 'Original URL is required' });
        return;
      }

      const result = await this.createUrlUseCase.execute({
        originalUrl,
        userId,
        customShortCode
      });

      res.status(201).json({
        message: 'URL shortened successfully',
        url: {
          id: result.url.id,
          originalUrl: result.url.originalUrl,
          shortCode: result.url.shortCode,
          shortUrl: result.shortUrl,
          clicks: result.url.clicks,
          createdAt: result.url.createdAt
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  /**
   * @swagger
   * /api/v1/urls:
   *   get:
   *     summary: Get user's URLs with pagination
   *     tags: [URLs]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of items per page
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [createdAt, clicks, updatedAt]
   *           default: createdAt
   *         description: Sort field
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: desc
   *         description: Sort order
   *     responses:
   *       200:
   *         description: URLs retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: URLs retrieved successfully
   *                 urls:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Url'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  getUserUrls = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const result = await this.getUserUrlsUseCase.execute({
        userId,
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as 'createdAt' | 'clicks' | 'updatedAt',
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      res.status(200).json({
        message: 'URLs retrieved successfully',
        urls: result.urls.map(url => ({
          id: url.id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl: url.getFullShortUrl(req.get('host') || 'localhost:3000'),
          clicks: url.clicks,
          createdAt: url.createdAt,
          updatedAt: url.updatedAt
        })),
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  /**
   * @swagger
   * /api/v1/urls/{urlId}:
   *   put:
   *     summary: Update a URL
   *     tags: [URLs]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: urlId
   *         required: true
   *         schema:
   *           type: string
   *         description: URL ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               originalUrl:
   *                 type: string
   *                 format: uri
   *                 example: https://newexample.com/updated-url
   *               customShortCode:
   *                 type: string
   *                 example: newcustom123
   *     responses:
   *       200:
   *         description: URL updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: URL updated successfully
   *                 url:
   *                   $ref: '#/components/schemas/Url'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: URL not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  updateUrl = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { urlId } = req.params;
      const { originalUrl, customShortCode } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const result = await this.updateUrlUseCase.execute({
        urlId,
        userId,
        originalUrl,
        customShortCode
      });

      res.status(200).json({
        message: result.message,
        url: {
          id: result.url.id,
          originalUrl: result.url.originalUrl,
          shortCode: result.url.shortCode,
          shortUrl: result.url.getFullShortUrl(req.get('host') || 'localhost:3000'),
          clicks: result.url.clicks,
          createdAt: result.url.createdAt,
          updatedAt: result.url.updatedAt
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  /**
   * @swagger
   * /api/v1/urls/{urlId}:
   *   delete:
   *     summary: Delete a URL
   *     tags: [URLs]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: urlId
   *         required: true
   *         schema:
   *           type: string
   *         description: URL ID
   *     responses:
   *       200:
   *         description: URL deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: URL deleted successfully
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: URL not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  deleteUrl = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { urlId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const result = await this.deleteUrlUseCase.execute({
        urlId,
        userId
      });

      res.status(200).json({
        message: result.message
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  /**
   * @swagger
   * /{shortCode}:
   *   get:
   *     summary: Redirect to original URL
   *     tags: [URLs]
   *     parameters:
   *       - in: path
   *         name: shortCode
   *         required: true
   *         schema:
   *           type: string
   *         description: Short code for the URL
   *     responses:
   *       302:
   *         description: Redirect to original URL
   *       404:
   *         description: URL not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  redirect = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shortCode } = req.params;

      if (!shortCode) {
        res.status(400).json({ error: 'Short code is required' });
        return;
      }

      const result = await this.redirectUrlUseCase.execute({
        shortCode,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer')
      });

      res.redirect(result.originalUrl);
    } catch (error) {
      if (error instanceof Error && error.message === 'URL not found') {
        res.status(404).json({ error: 'URL not found' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  /**
   * @swagger
   * /api/v1/urls/public:
   *   post:
   *     summary: Create a shortened URL (public, no authentication)
   *     tags: [URLs]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - originalUrl
   *             properties:
   *               originalUrl:
   *                 type: string
   *                 format: uri
   *                 example: https://example.com/very-long-url
   *               customShortCode:
   *                 type: string
   *                 example: custom123
   *     responses:
   *       201:
   *         description: URL shortened successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: URL shortened successfully
   *                 url:
   *                   $ref: '#/components/schemas/Url'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  createPublicUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      const { originalUrl, customShortCode } = req.body;

      if (!originalUrl) {
        res.status(400).json({ error: 'Original URL is required' });
        return;
      }

      const result = await this.createUrlUseCase.execute({
        originalUrl,
        customShortCode
      });

      res.status(201).json({
        message: 'URL shortened successfully',
        url: {
          id: result.url.id,
          originalUrl: result.url.originalUrl,
          shortCode: result.url.shortCode,
          shortUrl: result.shortUrl,
          clicks: result.url.clicks,
          createdAt: result.url.createdAt
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  /**
   * @swagger
   * /api/v1/urls/bulk:
   *   post:
   *     summary: Create multiple URLs in bulk
   *     tags: [URLs]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - urls
   *             properties:
   *               urls:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     originalUrl:
   *                       type: string
   *                       format: uri
   *                       example: https://example1.com
   *                     customShortCode:
   *                       type: string
   *                       example: custom1
   *     responses:
   *       201:
   *         description: URLs created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Successfully created 2 URLs
   *                 urls:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Url'
   *                 shortUrls:
   *                   type: array
   *                   items:
   *                     type: string
   *                 failedUrls:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       url:
   *                         type: string
   *                       error:
   *                         type: string
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  bulkCreateUrls = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { urls } = req.body;
      const userId = req.user?.userId;

      if (!urls || !Array.isArray(urls)) {
        res.status(400).json({ error: 'URLs array is required' });
        return;
      }

      const result = await this.bulkCreateUrlsUseCase.execute({
        urls,
        userId
      });

      res.status(201).json({
        message: result.message,
        urls: result.urls.map(url => ({
          id: url.id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl: url.getFullShortUrl(req.get('host') || 'localhost:3000'),
          clicks: url.clicks,
          createdAt: url.createdAt
        })),
        shortUrls: result.shortUrls,
        failedUrls: result.failedUrls
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
} 