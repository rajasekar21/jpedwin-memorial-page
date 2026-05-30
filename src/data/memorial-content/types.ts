import type { LucideIcon } from 'lucide-react';

export type Language = 'en' | 'ta';

export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type GalleryPhoto = {
  src: string;
  alt: string;
  album: string;
  caption: string;
};

export type TributeMessage = string | string[];

export type Tribute = {
  name: string;
  relationship: string;
  message: TributeMessage;
  date: string;
};

export type MemorialContent = {
  language: Language;
  nav: {
    items: { label: string; href: string }[];
    ariaLabel: string;
    skipToMain: string;
    openMenu: string;
    closeMenu: string;
    toggleTheme: string;
    scrollProgress: string;
    languageLabel: string;
  };
  hero: {
    eyebrow: string;
    primaryCta: string;
    secondaryCta: string;
    portraitAlt: string;
  };
  sections: {
    about: { eyebrow: string; title: string };
    timeline: { eyebrow: string; title: string };
    gallery: { eyebrow: string; title: string };
    tributes: { eyebrow: string; title: string; formTitle: string; formIntro: string };
    family: { eyebrow: string; title: string };
    events: { eyebrow: string; title: string };
  };
  gallery: {
    all: string;
    ariaLabel: string;
    viewPhoto: string;
    dialogLabel: string;
    closePreview: string;
    photoCount: string;
    albumNames?: Record<string, string>;
    previousPhoto?: string;
    nextPhoto?: string;
    pauseSlideshow?: string;
    playSlideshow?: string;
  };
  upload: {
    pageTitle: string;
    pageIntro: string;
    signIn: string;
    signOut: string;
    signInError: string;
    notAuthorised: string;
    titleLabel: string;
    captionLabel: string;
    albumLabel: string;
    photoLabel: string;
    photoHint: string;
    choosePhoto: string;
    noPhoto: string;
    removePhoto: string;
    submit: string;
    submitting: string;
    successMessage: string;
    uploadError: string;
    saveError: string;
    validationError: string;
    myUploadsTitle: string;
    noUploads: string;
    statusPending: string;
    statusApproved: string;
    statusRemoved: string;
  };
  qr: {
    eyebrow: string;
    pageTitle: string;
    pageIntro: string;
    subtitle: string;
    scanPrompt: string;
    downloadPng: string;
    print: string;
    printedBy: string;
  };
  form: {
    honeypotSuccess: string;
    rateLimitError: string;
    validationError: string;
    invalidPhotoFallback: string;
    phaseOneSuccess: string;
    uploadError: string;
    saveError: string;
    submittedSuccess: string;
    nameLabel: string;
    relationshipLabel: string;
    messageLabel: string;
    photoLabel: string;
    photoHint: string;
    choosePhoto: string;
    noPhoto: string;
    removePhoto: string;
    sending: string;
    submit: string;
  };
  tributeLabels: {
    photoOf: string;
    dateLocale: string;
    readMore: string;
    showLess: string;
  };
  rsvp: {
    formTitle: string;
    nameLabel: string;
    emailLabel: string;
    emailHint: string;
    guestCountLabel: string;
    messageLabel: string;
    messageHint: string;
    submit: string;
    submitting: string;
    successMessage: string;
    phaseOneMessage: string;
    errorMessage: string;
  };
  footer: {
    familyContact: string;
    preserved: string;
    visitorCount: string;
    qrCode: string;
  };
  memorialProfile: {
    fullName: string;
    birthYear: string;
    deathYear: string;
    deathDate: string;
    dates: string;
    portrait: string;
    quote: string[];
    shortDedication: string;
    biography: string[];
    values: string[];
    familyMessage: string;
  };
  timeline: TimelineEvent[];
  achievements: { title: string; text: string; icon: LucideIcon }[];
  galleryPhotos: GalleryPhoto[];
  tributes: Tribute[];
  events: { title: string; date: string; location: string; details: string }[];
};
