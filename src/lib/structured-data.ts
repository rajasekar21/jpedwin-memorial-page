import { memorialProfile, events as memorialEvents } from '@/data/memorial';
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
    deathDate: '2025',
    url: BASE_URL,
    image: `${BASE_URL}/images/portrait.jpg`,
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

/** Returns one Schema.org Event schema object per remembrance event. */
export function eventsSchema() {
  return memorialEvents.map((event) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.details,
    startDate: event.date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode:
      event.location.toLowerCase() === 'online'
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
    location:
      event.location.toLowerCase() === 'online'
        ? { '@type': 'VirtualLocation', url: BASE_URL }
        : { '@type': 'Place', name: event.location },
    organizer: {
      '@type': 'Organization',
      name: 'Edwin Chelliah Family',
      url: BASE_URL
    }
  }));
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
    isPartOf: { '@type': 'WebSite', url: BASE_URL },
    about: { '@type': 'Person', name: memorialProfile.fullName },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL }
      ]
    }
  };
}
