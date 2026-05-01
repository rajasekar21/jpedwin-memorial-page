import { withBasePath, siteConfig } from '../site';

describe('withBasePath', () => {
  const originalEnv = process.env.NEXT_PUBLIC_BASE_PATH;

  afterEach(() => {
    process.env.NEXT_PUBLIC_BASE_PATH = originalEnv;
  });

  it('returns absolute URLs unchanged', () => {
    expect(withBasePath('https://example.com/image.jpg')).toBe('https://example.com/image.jpg');
    expect(withBasePath('http://cdn.example.com/file')).toBe('http://cdn.example.com/file');
  });

  it('prepends basePath to relative paths', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '/my-repo';
    expect(withBasePath('/images/portrait.jpg')).toBe('/my-repo/images/portrait.jpg');
  });

  it('returns path unchanged when basePath is empty', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '';
    expect(withBasePath('/images/portrait.jpg')).toBe('/images/portrait.jpg');
  });

  it('handles paths without leading slash', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '/repo';
    expect(withBasePath('images/portrait.jpg')).toBe('/repoimages/portrait.jpg');
  });
});

describe('siteConfig', () => {
  it('has required fields', () => {
    expect(siteConfig.title).toBeTruthy();
    expect(siteConfig.description).toBeTruthy();
    expect(siteConfig.url).toBeTruthy();
  });

  it('url is a valid URL', () => {
    expect(() => new URL(siteConfig.url)).not.toThrow();
  });

  it('description is meaningful length', () => {
    expect(siteConfig.description.length).toBeGreaterThan(20);
  });
});
