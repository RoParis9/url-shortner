import { UrlRepository } from '../../../domain/repositories/url.repository.interface';

export interface DeleteUrlRequest {
  urlId: string;
  userId: string;
}

export interface DeleteUrlResponse {
  message: string;
}

export class DeleteUrlUseCase {
  constructor(private urlRepository: UrlRepository) {}

  async execute(request: DeleteUrlRequest): Promise<DeleteUrlResponse> {
    const { urlId, userId } = request;

    // Get existing URL
    const existingUrl = await this.urlRepository.findById(urlId);
    if (!existingUrl) {
      throw new Error('URL not found');
    }

    // Check ownership
    if (existingUrl.userId !== userId) {
      throw new Error('Unauthorized to delete this URL');
    }

    // Delete URL
    await this.urlRepository.delete(urlId);

    return {
      message: 'URL deleted successfully'
    };
  }
} 