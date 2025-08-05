import { Url } from '../../../domain/entities/url.entity';
import { UrlRepository } from '../../../domain/repositories/url.repository.interface';

export interface CreateUrlRequest {
  originalUrl: string;
  userId?: string;
  customShortCode?: string;
}

export interface CreateUrlResponse {
  url: Url;
  shortUrl: string;
}

export class CreateUrlUseCase {
  constructor(
    private urlRepository: UrlRepository,
    private baseUrl: string
  ) {}

  async execute(request: CreateUrlRequest): Promise<CreateUrlResponse> {
    const { originalUrl, userId, customShortCode } = request;

    // Check if custom short code is provided and available
    if (customShortCode) {
      const existingUrl = await this.urlRepository.findByShortCode(customShortCode);
      if (existingUrl) {
        throw new Error('Custom short code is already taken');
      }
    }

    // Create URL entity
    const url = Url.create(originalUrl, userId);

    // If custom short code is provided, override the generated one
    let finalUrl = url;
    if (customShortCode) {
      finalUrl = new Url(
        url.id,
        url.originalUrl,
        customShortCode,
        url.userId,
        url.clicks,
        url.createdAt,
        url.updatedAt
      );
    }

    // Check if generated short code is unique (retry if needed)
    let attempts = 0;
    let savedUrl = finalUrl;
    while (attempts < 5) {
      try {
        savedUrl = await this.urlRepository.create(finalUrl);
        break;
      } catch (error) {
        if (error instanceof Error && error.message.includes('unique constraint')) {
          // Regenerate short code and try again
          finalUrl = Url.create(originalUrl, userId);
          attempts++;
        } else {
          throw error;
        }
      }
    }

    if (attempts >= 5) {
      throw new Error('Unable to generate unique short code');
    }

    return {
      url: savedUrl,
      shortUrl: savedUrl.getFullShortUrl(this.baseUrl)
    };
  }
} 