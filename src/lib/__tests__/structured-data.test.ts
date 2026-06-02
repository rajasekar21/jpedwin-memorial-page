import { memorialPageSchema, personSchema, webSiteSchema } from '../structured-data';

describe('personSchema', () => {
  const schema = personSchema();

  it('declares schema.org context and Person type', () => {
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Person');
  });

  it('has a non-empty name string', () => {
    expect(typeof schema.name).toBe('string');
    expect(schema.name.length).toBeGreaterThan(0);
  });

  it('has birthDate and deathDate fields', () => {
    expect(schema.birthDate).toBeTruthy();
    expect(schema.deathDate).toBeTruthy();
  });

  it('has a parseable canonical URL', () => {
    expect(() => new URL(schema.url)).not.toThrow();
  });

  it('has a non-empty values array for knowsAbout', () => {
    expect(Array.isArray(schema.knowsAbout)).toBe(true);
    expect((schema.knowsAbout as string[]).length).toBeGreaterThan(0);
  });
});

describe('webSiteSchema', () => {
  const schema = webSiteSchema();

  it('declares schema.org context and WebSite type', () => {
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebSite');
  });

  it('has a non-empty name and description', () => {
    expect(schema.name.length).toBeGreaterThan(0);
    expect(schema.description.length).toBeGreaterThan(0);
  });

  it('has a parseable canonical URL', () => {
    expect(() => new URL(schema.url)).not.toThrow();
  });

  it('has a publisher with name and url', () => {
    expect(schema.publisher.name.length).toBeGreaterThan(0);
    expect(() => new URL(schema.publisher.url)).not.toThrow();
  });
});

describe('memorialPageSchema', () => {
  const schema = memorialPageSchema();

  it('declares schema.org context and WebPage type', () => {
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebPage');
  });

  it('has datePublished and dateModified as valid date strings', () => {
    expect(new Date(schema.datePublished).getFullYear()).toBeGreaterThan(2000);
    expect(new Date(schema.dateModified).getFullYear()).toBeGreaterThan(2000);
  });

  it('has a BreadcrumbList with at least one item', () => {
    expect(schema.breadcrumb['@type']).toBe('BreadcrumbList');
    expect(schema.breadcrumb.itemListElement.length).toBeGreaterThan(0);
    expect(schema.breadcrumb.itemListElement[0]['@type']).toBe('ListItem');
  });

  it('has a parseable canonical URL', () => {
    expect(() => new URL(schema.url)).not.toThrow();
  });
});
