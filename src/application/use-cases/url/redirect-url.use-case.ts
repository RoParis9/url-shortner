import { Url } from '../../../domain/entities/url.entity';
import { Click } from '../../../domain/entities/click.entity';
import { UrlRepository } from '../../../domain/repositories/url.repository.interface';
import { ClickRepository } from '../../../domain/repositories/click.repository.interface';

export interface RedirectUrlRequest {
  shortCode: string;
  ipAddress?: string;
  userAgent?: string;
  referer?: string;
}

export interface RedirectUrlResponse {
  originalUrl: string;
  url: Url;
}

export class RedirectUrlUseCase {
  constructor(
    private urlRepository: UrlRepository,
    private clickRepository: ClickRepository
  ) {}

  async execute(request: RedirectUrlRequest): Promise<RedirectUrlResponse> {
    const { shortCode, ipAddress, userAgent, referer } = request;

    // Find URL by short code
    const url = await this.urlRepository.findByShortCode(shortCode);
    if (!url) {
      throw new Error('URL not found');
    }

    // Create click tracking
    const click = Click.create(url.id, ipAddress, userAgent, referer);
    await this.clickRepository.create(click);

    // Increment click count
    const updatedUrl = url.incrementClicks();
    await this.urlRepository.update(updatedUrl);

    return {
      originalUrl: updatedUrl.originalUrl,
      url: updatedUrl
    };
  }
} 