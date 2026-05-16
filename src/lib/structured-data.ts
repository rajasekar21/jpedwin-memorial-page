import { memorialProfile } from '@/data/memorial';
import { siteConfig } from '@/lib/site';

const BASE_URL = siteConfig.url;

/** Schema.org Person schema for the memorial subject. */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: memorialProfile.fullName,
    description: memorialProfile.biography[0],
    birthDate: '1955',
    deathDate: '2025-06-06',
    url: BASE_URL,
    image: `${BASE_URL}/images/portrait.svg`,
    familyName: 'Chelliah',
    givenName: 'J.P. Edwin',
    knowsAbout: memorialProfile.values
  };
}

/** Schema.org WebSite schema for the memorial site. */
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.title,
    description: siteConfig.description,
    url: BASE_URL,
    inLanguage: 'en',
    about: { '@type': 'Person', name: memorialProfile.fullName },
    publisher: {
      '@type': 'Organization',
      name: 'Edwin Chelliah Family',
      url: BASE_URL
    }
  };
}

/** Schema.org WebPage schema with breadcrumb for the memorial page. */
export function memorialPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${memorialProfile.fullName} — Memorial`,
    description: siteConfig.description,
    url: BASE_URL,
    inLanguage: 'en',
    datePublished: '2025-04-01',
    dateModified: '2026-05-01',
    isPartOf: { '@type': 'WebSite', url: BASE_URL },
    about: { '@type': 'Person', name: memorialProfile.fullName },
    author: { '@type': 'Organization', name: 'Edwin Chelliah Family', url: BASE_URL },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL }
      ]
    }
  };
}
