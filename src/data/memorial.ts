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
  dates: '1955 to 2025',
  portrait: '/images/portrait.svg',
  quote: 'A life remembered with gratitude, a legacy carried with love.',
  shortDedication: 'Dedicated by family and friends to preserve his kindness, wisdom, and enduring presence.',
  biography: [
    'He lived with quiet strength, generous attention, and a steady devotion to the people around him. His story is one of family, service, discipline, and warmth.',
    'This memorial gathers the moments that shaped him: the places he loved, the work he gave himself to, the values he practiced, and the memories carried by everyone whose life he touched.'
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
    alt: 'Warm family gathering illustration',
    album: 'Family',
    caption: 'Family gatherings and the comfort of being together'
  },
  {
    src: '/images/gallery-career.svg',
    alt: 'Archive desk and career memories illustration',
    album: 'Career',
    caption: 'Years of dedicated work and trusted responsibility'
  },
  {
    src: '/images/gallery-celebration.svg',
    alt: 'Celebration lights and flowers illustration',
    album: 'Celebrations',
    caption: 'Milestones, festivals, and shared joy'
  },
  {
    src: '/images/gallery-legacy.svg',
    alt: 'Legacy archive illustration',
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
