import { Url } from '../../../domain/entities/url.entity';
import { UrlRepository } from '../../../domain/repositories/url.repository.interface';

export interface BulkUrlRequest {
  originalUrl: string;
  customShortCode?: string;
}

export interface BulkCreateUrlsRequest {
  urls: BulkUrlRequest[];
  userId?: string;
}

export interface BulkCreateUrlsResponse {
  urls: Url[];
  shortUrls: string[];
  failedUrls: Array<{ url: string; error: string }>;
  message: string;
}

export class BulkCreateUrlsUseCase {
  constructor(
    private urlRepository: UrlRepository,
    private baseUrl: string
  ) {}

  async execute(request: BulkCreateUrlsRequest): Promise<BulkCreateUrlsResponse> {
    const { urls, userId } = request;

    if (urls.length === 0) {
      throw new Error('No URLs provided');
    }

    if (urls.length > 100) {
      throw new Error('Maximum 100 URLs allowed per bulk operation');
    }

    const createdUrls: Url[] = [];
    const shortUrls: string[] = [];
    const failedUrls: Array<{ url: string; error: string }> = [];

    // Process URLs in parallel with error handling
    const results = await Promise.allSettled(
      urls.map(async (urlRequest) => {
        try {
          // Check if custom short code is available
          if (urlRequest.customShortCode) {
            const existingUrl = await this.urlRepository.findByShortCode(urlRequest.customShortCode);
            if (existingUrl) {
              throw new Error(`Custom short code '${urlRequest.customShortCode}' is already taken`);
            }
          }

          // Create URL entity
          const url = Url.create(urlRequest.originalUrl, userId);

          // If custom short code is provided, override the generated one
          let finalUrl = url;
          if (urlRequest.customShortCode) {
            finalUrl = new Url(
              url.id,
              url.originalUrl,
              urlRequest.customShortCode,
              url.userId,
              url.clicks,
              url.createdAt,
              url.updatedAt
            );
          }

          // Save URL
          const savedUrl = await this.urlRepository.create(finalUrl);
          return savedUrl;
        } catch (error) {
          throw new Error(`Failed to create URL '${urlRequest.originalUrl}': ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      })
    );

    // Process results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const url = result.value;
        createdUrls.push(url);
        shortUrls.push(url.getFullShortUrl(this.baseUrl));
      } else {
        failedUrls.push({
          url: urls[index].originalUrl,
          error: result.reason.message
        });
      }
    });

    return {
      urls: createdUrls,
      shortUrls,
      failedUrls,
      message: `Successfully created ${createdUrls.length} URLs${failedUrls.length > 0 ? `, ${failedUrls.length} failed` : ''}`
    };
  }
} 