import type { LucideIcon } from 'lucide-react';
import { Award, BookOpen, Briefcase, GraduationCap, Heart, Home, Sparkles, Users } from 'lucide-react';

export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type GalleryPhoto = {
  src: string;
  alt: string;
  album: 'Family' | 'Career' | 'Celebrations' | 'Legacy';
  caption: string;
};

export type Tribute = {
  name: string;
  relationship: string;
  message: string;
  date: string;
};

export const memorialProfile = {
  fullName: 'J.P.Edwin Chelliah',
  birthYear: '1955',
  deathYear: '2025',
  dates: '1955 to 2025',
  portrait: '/images/edwinchelliah.jpg',
  quote: [
    'A man of Honesty, Simplicity, and Faithfulness. Known for his sincerity, and concern for others.',
    'A blessing to everyone around him.',
    ' His compassion and helping nature will forever be remembered with gratitude and love.'
  ],
  shortDedication: 'Dedicated by family and friends to preserve his kindness, wisdom, and enduring presence.',
  biography: [
    'My father Mr. J. P. Edwin Chelliah was born in the year 1955. He was the heart of our family, a man whose presence brought comfort and strength to all of us. He was deeply caring and always placed the needs of his loved ones before his own. His love was expressed through patience, understanding, and constant support in every stage of our lives.',
    'One of his most remarkable qualities was his simplicity. He lived a humble and contented life, never seeking attention or material wealth. He believed in simple living and meaningful values, and his actions reflected this every day.',
    'He was also sincere and dedicated in his work. Being an officer in Canara Bank, he carried out his responsibilities with honesty and a strong sense of duty, earning the respect of everyone around him. For him, true success meant doing one’s work with integrity.',
    'Beyond family and work, he was always ready to help others. His kindness, generosity, and willingness to support those in need touched many lives. Anyone in need dint hesitate to approach him at any time for their needs.',
    'Though he is no longer with us, his love and values continue to guide us. We miss him deeply and will always remember him as a caring, sincere, and humble human being.'
  ],
  values: ['Kindness', 'Integrity', 'Family', 'Service', 'Resilience', 'Faith'],
  familyMessage:
    'We remember him in everyday gestures: a patient word, a thoughtful call, a shared meal, a lesson passed on without ceremony. His love remains part of our home.'
};

export const timeline: TimelineEvent[] = [
  {
    year: '1955',
    title: 'A Life Begins',
    description: 'Born into a loving family, surrounded by traditions, stories, and the care that shaped his earliest years.',
    icon: Sparkles
  },
  {
    year: '1976',
    title: 'Education & Character',
    description: 'Developed a lifelong respect for learning, discipline, and the practical wisdom of showing up for others.',
    icon: GraduationCap
  },
  {
    year: '1984',
    title: 'Career of Service',
    description: 'Built a respected professional life through reliability, clear judgment, and a deep sense of responsibility.',
    icon: Briefcase
  },
  {
    year: '1990',
    title: 'Family Foundation',
    description: 'Created a home defined by care, encouragement, celebration, and the steady rituals that make family strong.',
    icon: Home
  },
  {
    year: '2005',
    title: 'Guiding Others',
    description: 'Became a mentor and trusted voice for relatives, colleagues, neighbors, and younger generations.',
    icon: Users
  },
  {
    year: '2025',
    title: 'A Continuing Legacy',
    description: 'His memory continues through stories, photographs, values, and the many lives shaped by his presence.',
    icon: Heart
  }
];

export const achievements = [
  { title: 'Beloved Family Elder', text: 'A source of steadiness, advice, humor, and unconditional care.', icon: Heart },
  { title: 'Respected Professional', text: 'Known for commitment, integrity, and thoughtful leadership.', icon: Award },
  { title: 'Keeper of Stories', text: 'Preserved family history through memories, traditions, and lived example.', icon: BookOpen }
];

export const galleryPhotos: GalleryPhoto[] = [
  {
    src: '/images/gallery-family.svg',
    alt: 'J.P. Edwin Chelliah with family — warm gatherings and shared moments at home',
    album: 'Family',
    caption: 'Family gatherings and the comfort of being together'
  },
  {
    src: '/images/gallery-career.svg',
    alt: 'J.P. Edwin Chelliah at work — a career built on commitment and trusted responsibility',
    album: 'Career',
    caption: 'Years of dedicated work and trusted responsibility'
  },
  {
    src: '/images/gallery-celebration.svg',
    alt: 'J.P. Edwin Chelliah celebrating milestones — festivals, birthdays, and shared joy with loved ones',
    album: 'Celebrations',
    caption: 'Milestones, festivals, and shared joy'
  },
  {
    src: '/images/gallery-legacy.svg',
    alt: 'Objects, letters and mementos preserving the legacy and memory of J.P. Edwin Chelliah',
    album: 'Legacy',
    caption: 'Objects, letters, places, and memories preserved'
  }
];

export const tributes: Tribute[] = [
  {
    name: 'Family',
    relationship: 'Children and grandchildren',
    message:
      'Thank you for teaching us how to live with patience, dignity, and love. We carry your words with us in every season.',
    date: 'April 2024'
  },
  {
    name: 'A Dear Friend',
    relationship: 'Lifelong companion',
    message:
      'He had a rare way of making people feel heard. His friendship was steady, honest, and full of quiet kindness.',
    date: 'May 2024'
  },
  {
    name: 'Colleagues',
    relationship: 'Work community',
    message:
      'His professionalism came from character. He led by example and left behind a standard we still look up to.',
    date: 'June 2024'
  }
];

export const events = [
  {
    title: 'Annual Remembrance Gathering',
    date: 'Every April',
    location: 'Family residence',
    details: 'A quiet evening of prayer, stories, and shared food with close family and friends.'
  },
  {
    title: 'Digital Tribute Collection',
    date: 'Open year-round',
    location: 'Online',
    details: 'Family members can send photographs, letters, and memories to be added to this archive.'
  }
];
