import { englishContent } from './en';
import { tamilContent } from './ta';
import type { Language, MemorialContent } from './types';

export type { GalleryPhoto, Language, MemorialContent, TimelineEvent, Tribute, TributeMessage } from './types';

export const memorialContent: Record<Language, MemorialContent> = {
  en: englishContent,
  ta: tamilContent
};

export const defaultLanguage: Language = 'en';
export const defaultContent = memorialContent[defaultLanguage];

export const memorialProfile = defaultContent.memorialProfile;
export const timeline = defaultContent.timeline;
export const achievements = defaultContent.achievements;
export const galleryPhotos = defaultContent.galleryPhotos;
export const tributes = defaultContent.tributes;
export const events = defaultContent.events;
