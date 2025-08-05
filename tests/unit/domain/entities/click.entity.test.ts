import { Click } from "@/domain/entities/click.entity";

describe('Click Entity', () => {
  describe('create', () => {
    it('should create a click with required parameters', () => {
      const urlId = 'url123';
      const ipAddress = '192.168.1.1';
      const userAgent = 'Mozilla/5.0';
      const referer = 'https://google.com';

      const click = Click.create(urlId, ipAddress, userAgent, referer);

      expect(click.urlId).toBe(urlId);
      expect(click.ipAddress).toBe(ipAddress);
      expect(click.userAgent).toBe(userAgent);
      expect(click.referer).toBe(referer);
      expect(click.id).toBeDefined();
      expect(click.timestamp).toBeInstanceOf(Date);
    });

    it('should create a click with minimal parameters', () => {
      const urlId = 'url123';

      const click = Click.create(urlId);

      expect(click.urlId).toBe(urlId);
      expect(click.ipAddress).toBeNull();
      expect(click.userAgent).toBeNull();
      expect(click.referer).toBeNull();
      expect(click.id).toBeDefined();
      expect(click.timestamp).toBeInstanceOf(Date);
    });

    it('should create a click with partial parameters', () => {
      const urlId = 'url123';
      const ipAddress = '192.168.1.1';

      const click = Click.create(urlId, ipAddress);

      expect(click.urlId).toBe(urlId);
      expect(click.ipAddress).toBe(ipAddress);
      expect(click.userAgent).toBeNull();
      expect(click.referer).toBeNull();
    });
  });

  describe('getClickData', () => {
    it('should return click data object', () => {
      const urlId = 'url123';
      const ipAddress = '192.168.1.1';
      const userAgent = 'Mozilla/5.0';
      const referer = 'https://google.com';

      const click = Click.create(urlId, ipAddress, userAgent, referer);
      const clickData = click.getClickData();

      expect(clickData).toEqual({
        id: click.id,
        urlId: click.urlId,
        ipAddress: click.ipAddress,
        userAgent: click.userAgent,
        referer: click.referer,
        timestamp: click.timestamp
      });
    });
  });
}); 