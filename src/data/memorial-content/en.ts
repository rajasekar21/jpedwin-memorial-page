import { Award, BookOpen, Briefcase, GraduationCap, Heart, Home, Sparkles, Users } from 'lucide-react';
import type { MemorialContent } from './types';

export const englishContent: MemorialContent = {
  language: 'en',
  nav: {
    ariaLabel: 'Main navigation',
    skipToMain: 'Skip to main content',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    toggleTheme: 'Toggle color theme',
    scrollProgress: 'Page scroll progress',
    languageLabel: 'Choose site language',
    items: [
      { label: 'About', href: '#about' },
      { label: 'Timeline', href: '#timeline' },
      { label: 'Gallery', href: '#gallery' },
      { label: 'Tributes', href: '#tributes' },
      { label: 'Family', href: '#family' },
      { label: 'Events', href: '#events' }
    ]
  },
  hero: {
    eyebrow: 'Digital memorial preserving the life and legacy of J.P. Edwin Chelliah',
    primaryCta: 'Begin the story',
    secondaryCta: 'Leave a memory',
    portraitAlt: 'Portrait of J.P. Edwin Chelliah'
  },
  sections: {
    about: { eyebrow: 'About him', title: 'A life that inspires everyone!' },
    timeline: { eyebrow: 'Life journey', title: 'Milestones preserved as a family archive.' },
    gallery: { eyebrow: 'Photo gallery', title: 'A visual archive of the moments that remain close.' },
    tributes: {
      eyebrow: 'Memories and tributes',
      title: 'Words from the people whose lives he touched.',
      formTitle: 'Submit a memory',
      formIntro: 'Phase 1 keeps submissions offline for family review. When Supabase is enabled, this form sends memories into a moderated queue.'
    },
    family: { eyebrow: 'Family tribute', title: 'Remembered at home, carried forward in love.' },
    events: { eyebrow: 'Remembrance events', title: 'Gatherings and moments of shared remembrance.' }
  },
  gallery: {
    all: 'All',
    ariaLabel: 'Photo albums',
    viewPhoto: 'View photo',
    dialogLabel: 'Photo',
    closePreview: 'Close photo preview'
  },
  form: {
    honeypotSuccess: 'Your memory has been received. Thank you.',
    rateLimitError: 'Too many submissions. Please wait an hour before submitting again.',
    validationError: 'Please complete every field with a respectful memory before submitting.',
    invalidPhotoFallback: 'Please choose a valid photo.',
    phaseOneSuccess: 'Your message is ready. In Phase 1, please send it to the family contact so it can be added to the static tribute list.',
    uploadError: 'We could not upload the photo right now. Please try again or submit without a photo.',
    saveError: 'We could not save this memory right now. Please try again later.',
    submittedSuccess: 'Thank you. Your memory was submitted and will appear after family moderation.',
    nameLabel: 'Your name',
    relationshipLabel: 'Relationship',
    messageLabel: 'Memory or tribute',
    photoLabel: 'Your photo',
    photoHint: 'Optional JPG, PNG, or WebP up to 5 MB',
    choosePhoto: 'Choose photo',
    noPhoto: 'No photo selected',
    removePhoto: 'Remove selected photo',
    sending: 'Sending...',
    submit: 'Submit memory'
  },
  tributeLabels: {
    photoOf: 'Photo of',
    dateLocale: 'en'
  },
  upload: {
    pageTitle: 'Family Photo Upload',
    pageIntro: 'Share your photographs with the family archive. Each upload is reviewed before it appears in the gallery.',
    signIn: 'Sign in',
    signOut: 'Sign out',
    signInError: 'Sign-in failed. Please check your credentials.',
    notAuthorised: 'Your account has not been added to the family members list. Please contact the family admin.',
    titleLabel: 'Photo title',
    captionLabel: 'Caption',
    albumLabel: 'Album',
    photoLabel: 'Photo',
    photoHint: 'JPG, PNG, or WebP up to 20 MB',
    choosePhoto: 'Choose photo',
    noPhoto: 'No photo selected',
    removePhoto: 'Remove selected photo',
    submit: 'Submit for review',
    submitting: 'Uploading…',
    successMessage: 'Photo submitted. It will appear in the gallery once the family admin approves it.',
    uploadError: 'Could not upload the photo. Please try again.',
    saveError: 'Could not save the photo details. Please try again.',
    validationError: 'Please fill in the title, caption, album, and choose a photo.',
    myUploadsTitle: 'My submissions',
    noUploads: 'You have not submitted any photos yet.',
    statusPending: 'Pending review',
    statusApproved: 'Approved',
    statusRemoved: 'Removed'
  },
  qr: {
    eyebrow: 'Digital memorial',
    pageTitle: 'QR Code for Printed Programmes',
    pageIntro: 'Download or print this QR card to include in funeral booklets, remembrance programmes, or order-of-service sheets. Scanning it opens the full memorial website.',
    subtitle: 'Digital memorial',
    scanPrompt: 'Scan to visit the digital memorial — biography, photographs, timeline, and family tributes.',
    downloadPng: 'Download PNG',
    print: 'Print card',
    printedBy: 'Preserved with love by family and friends'
  },
  footer: {
    familyContact: 'Family contact',
    preserved: 'Preserved with care',
    visitorCount: 'Visitors',
    qrCode: 'Print QR code'
  },
  memorialProfile: {
    fullName: 'J.P. Edwin Chelliah',
    birthYear: '1955',
    deathYear: '2025',
    deathDate: '6 June 2025',
    dates: '1955 to 2025',
    portrait: '/images/edwinchelliah.jpg',
    quote: [
      'A man of Honesty, Simplicity, and Faithfulness. Known for his sincerity, and concern for others.',
      'A blessing to everyone around him.',
      'His compassion and helping nature will forever be remembered with gratitude and love.'
    ],
    shortDedication: 'Dedicated by family and friends to preserve his kindness, wisdom, and enduring presence.',
    biography: [
      'My father Mr. J. P. Edwin Chelliah was born in the year 1955. He was the heart of our family, a man whose presence brought comfort and strength to all of us. He was deeply caring and always placed the needs of his loved ones before his own. His love was expressed through patience, understanding, and constant support in every stage of our lives.',
      'One of his most remarkable qualities was his simplicity. He lived a humble and contented life, never seeking attention or material wealth. He believed in simple living and meaningful values, and his actions reflected this every day.',
      'He was also sincere and dedicated in his work. Being an officer in Canara Bank, he carried out his responsibilities with honesty and a strong sense of duty, earning the respect of everyone around him. For him, true success meant doing one\'s work with integrity.',
      'Beyond family and work, he was always ready to help others. His kindness, generosity, and willingness to support those in need touched many lives. Anyone in need did not hesitate to approach him at any time for their needs.',
      'Though he is no longer with us, his love and values continue to guide us. We miss him deeply and will always remember him as a caring, sincere, and humble human being.'
    ],
    values: ['Kindness', 'Integrity', 'Family', 'Service', 'Resilience', 'Faith'],
    familyMessage: 'We remember him in everyday gestures: a patient word, a thoughtful call, a shared meal, a lesson passed on without ceremony. His love remains part of our home.'
  },
  timeline: [
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
      year: 'June 2025',
      title: 'A Continuing Legacy',
      description: 'He passed on 6 June 2025. His memory continues through stories, photographs, values, and the many lives shaped by his presence.',
      icon: Heart
    }
  ],
  achievements: [
    { title: 'Beloved Family Elder', text: 'A source of steadiness, advice, humor, and unconditional care.', icon: Heart },
    { title: 'Respected Professional', text: 'Known for commitment, integrity, and thoughtful leadership.', icon: Award },
    { title: 'Keeper of Stories', text: 'Preserved family history through memories, traditions, and lived example.', icon: BookOpen }
  ],
  galleryPhotos: [
    {
      src: '/images/gallery-family.svg',
      alt: 'J.P. Edwin Chelliah with family, warm gatherings and shared moments at home',
      album: 'Family',
      caption: 'Family gatherings and the comfort of being together'
    },
    {
      src: '/images/gallery-career.svg',
      alt: 'J.P. Edwin Chelliah at work, a career built on commitment and trusted responsibility',
      album: 'Career',
      caption: 'Years of dedicated work and trusted responsibility'
    },
    {
      src: '/images/gallery-celebration.svg',
      alt: 'J.P. Edwin Chelliah celebrating milestones, festivals, birthdays, and shared joy with loved ones',
      album: 'Celebrations',
      caption: 'Milestones, festivals, and shared joy'
    },
    {
      src: '/images/gallery-legacy.svg',
      alt: 'Objects, letters and mementos preserving the legacy and memory of J.P. Edwin Chelliah',
      album: 'Legacy',
      caption: 'Objects, letters, places, and memories preserved'
    }
  ],
  tributes: [
    {
      name: 'Family',
      relationship: 'Children and grandchildren',
      message: 'Thank you for teaching us how to live with patience, dignity, and love. We carry your words with us in every season.',
      date: 'April 2024'
    },
    {
      name: 'A Dear Friend',
      relationship: 'Lifelong companion',
      message: 'He had a rare way of making people feel heard. His friendship was steady, honest, and full of quiet kindness.',
      date: 'May 2024'
    },
    {
      name: 'Colleagues',
      relationship: 'Work community',
      message: 'His professionalism came from character. He led by example and left behind a standard we still look up to.',
      date: 'June 2024'
    }
  ],
  events: [
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
  ]
};
