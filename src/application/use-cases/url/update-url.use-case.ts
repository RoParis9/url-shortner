import { Url } from '../../../domain/entities/url.entity';
import { UrlRepository } from '../../../domain/repositories/url.repository.interface';

export interface UpdateUrlRequest {
  urlId: string;
  userId: string;
  originalUrl?: string;
  customShortCode?: string;
}

export interface UpdateUrlResponse {
  url: Url;
  message: string;
}

export class UpdateUrlUseCase {
  constructor(private urlRepository: UrlRepository) {}

  async execute(request: UpdateUrlRequest): Promise<UpdateUrlResponse> {
    const { urlId, userId, originalUrl, customShortCode } = request;

    // Get existing URL
    const existingUrl = await this.urlRepository.findById(urlId);
    if (!existingUrl) {
      throw new Error('URL not found');
    }

    // Check ownership
    if (existingUrl.userId !== userId) {
      throw new Error('Unauthorized to update this URL');
    }

    // Check if custom short code is available
    if (customShortCode && customShortCode !== existingUrl.shortCode) {
      const urlWithSameCode = await this.urlRepository.findByShortCode(customShortCode);
      if (urlWithSameCode) {
        throw new Error('Custom short code is already taken');
      }
    }

    // Update URL
    let updatedUrl = existingUrl;

    if (originalUrl) {
      updatedUrl = updatedUrl.updateOriginalUrl(originalUrl);
    }

    if (customShortCode && customShortCode !== existingUrl.shortCode) {
      updatedUrl = new Url(
        updatedUrl.id,
        updatedUrl.originalUrl,
        customShortCode,
        updatedUrl.userId,
        updatedUrl.clicks,
        updatedUrl.createdAt,
        new Date()
      );
    }

    const savedUrl = await this.urlRepository.update(updatedUrl);

    return {
      url: savedUrl,
      message: 'URL updated successfully'
    };
  }
} 