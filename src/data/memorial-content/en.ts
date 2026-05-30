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
      { label: 'Family', href: '#family' }
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
      formIntro: 'Submit your memory here!!'
     // formIntro: 'Phase 1 keeps submissions offline for family review. When Supabase is enabled, this form sends memories into a moderated queue.'
    },
    family: { eyebrow: 'Family tribute', title: 'Remembered at home, carried forward in love.' },
    events: { eyebrow: 'Remembrance events', title: 'Gatherings and moments of shared remembrance.' }
  },
  gallery: {
    all: 'All',
    ariaLabel: 'Photo albums',
    viewPhoto: 'View photo',
    dialogLabel: 'Photo',
    closePreview: 'Close photo preview',
    photoCount: 'photos',
    previousPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
    pauseSlideshow: 'Pause slideshow',
    playSlideshow: 'Play slideshow'
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
  rsvp: {
    formTitle: 'RSVP for this gathering',
    nameLabel: 'Your name',
    emailLabel: 'Email',
    emailHint: '(optional)',
    guestCountLabel: 'Number of guests',
    messageLabel: 'Message',
    messageHint: '(optional)',
    submit: 'Confirm attendance',
    submitting: 'Sending…',
    successMessage: 'Thank you — your attendance has been noted. We look forward to seeing you.',
    phaseOneMessage: 'To confirm your attendance, please email the family at {email}.',
    errorMessage: 'Could not save your RSVP right now. Please try again or email the family.'
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
      'A man of Unwavering Faith, Honesty and Simplicity. Known for his sincerity, and concern for others.',
      'A blessing to everyone around him.',
      'His compassion and helping nature will forever be remembered and loved with gratitude.'
    ],
    shortDedication: 'Dedicated by family and friends to preserve his kindness, wisdom, and enduring presence.',
    biography: [
      'My father Mr. J. P. Edwin Chelliah was born in the year 1955. He was a man of steadfast faith, who trusted God in every season of life and reflected Christ’s love through his humility, prayer, and kindness. He was the heart of our family, a man whose presence brought comfort and strength to all of us. He was deeply caring and always placed the needs of his loved ones before his own. His love was expressed through patience, understanding, and constant support in every stage of our lives.',
      'One of his most remarkable qualities was his simplicity. He lived a humble and contented life, never seeking attention or material wealth. He believed in simple living and meaningful values, and his actions reflected this every day.',
      'He was also sincere and dedicated in his work. Being an officer in Canara Bank, he carried out his responsibilities with honesty and a strong sense of duty, earning the respect of everyone around him. For him, true success meant doing one\'s work with integrity.',
      'He was a dedicated and an active member of C.S.I. Christ Church, Visuvasapuri, Madurai, known for his commitment, punctuality, and warm fellowship with everyone in the congregation. He faithfully participated in church activities and maintained cordial relationships with all members of the church community.',
       'He was also generous in supporting causes related to God’s ministry and the church. In particular, he contributed wholeheartedly toward church construction projects and initiatives aimed at helping the poor and the needy through the church. His spirit of service, generosity, and compassion left a lasting impact on many lives.',
      'Beyond family, work, and church, he was always ready to help anyone in need. His kindness, generosity, and willingness to support those in need touched many lives. He was always approachable to those who sought help, guidance, or encouragement.',
      'The Bible says',
      '"Whoever is kind to the poor lends to the Lord, and he will reward them for what they have done." — Proverbs 19:17',
      '"Show proper respect to everyone, love the family of believers, fear God, honor the emperor." — 1 Peter 2:17',
      '"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters, since you know that you will receive an inheritance from the Lord as a reward." — Colossians 3:23–24',
      '"Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you." — Ephesians 4:32',
      'My father was a man who lived according to the Scriptures, showing kindness, compassion, and grace to everyone he met."',  
      'Though he is no longer with us, his love and values continue to guide us. We miss him deeply and will always remember him as a caring, sincere, and humble human being.'
    ],
    values: ['Kindness', 'Integrity', 'Family', 'Service', 'Resilience', 'Faith'],
    familyMessage: 'We remember him in everyday gestures: a patient word, a thoughtful call, a shared meal, and a lesson passed on without ceremony. His love remains forever woven into our home and hearts. With the blessed assurance that we shall see him face to face at the second coming of Jesus Christ, we continue this earthly race with faith and hope…'
  },
  timeline: [
    {
      year: '1955',
      title: 'A Life Begins',
      description: 'Born into a loving family to Mr. John Palanimuthu and Mrs. Annal, alongside his beloved siblings Mrs. Kamala Jansi Rani, Mr. Johnson Chandrasekar and Mr. Immunuel Jeyaprakash, he grew up rooted in Christ, nurtured in faith, and surrounded by stories, warmth, and the loving care that shaped his earliest years.',
      icon: Sparkles
    },
    {
      year: '1976',
      title: 'Education & Character',
      description: 'With a deep respect for learning, discipline and dedication, he pursued his post-graduation in Commerce with determination, earning First Class with Merit through hard work and perseverance.',
      icon: GraduationCap
    },
    {
      year: '1977',
      title: 'Career of Service',
      description: 'Beginning his career as a Clerk in Canara Bank, he served society with honesty, sincerity, and unwavering dedication to his work. After being promoted as an Officer in 2001, he continued to serve the organisation faithfully until his retirement in 2015. Known for his humble nature and willingness to help others, he became someone people could approach with ease and trust.',
      icon: Briefcase
    },
    {
      year: '1981',
      title: 'Family Foundation',
      description: 'He married Mrs. Gunaseeli Selvarani in 1981 and was blessed with two daughters, Mrs. E. Angelin Gunavathy and Mrs. E. Sweetline Priya, who brought immense joy and pride to his life. Grounding his home in Christ, he led his family with faith, prayer, love, and strong godly values. The well-being and care of his family were always close to his heart. Through his constant efforts to stay connected with brothers, sisters, and extended in-law families by regularly visiting and spending time with them, he nurtured deep and lasting relationships. His warmth and affection strengthened the bond among family members and created a legacy of unity that continues even among the next generation today.',
      icon: Home
    },
    {
      year: '2018',
      title: 'Leading Others',
      description: 'As the Registrar of the C.S.I. Madurai–Ramanad Diocese (2018-2021), he faithfully carried out his ministry in a way that proclaimed the glory of the Lord. During his time as Registrar and even afterward, he helped many people in need through the Diocese by providing financial assistance and support. During the time of the COVID pandemic, he spent from his own resources to provide rice and groceries to people in villages. Through the Diocese, he identified those in need and continued to extend whatever help he could. Whoever called him on the phone would always receive a proper response from him. He was a man who would guide and support people until their needs were fulfilled.',
      icon: Users
    },
    {
      year: 'June 2025',
      title: 'Mentoring & Legacy',
      description: 'He assumed charge as the Correspondent of C.S.I. Higher Secondary School, Batlagundu, in 2018. With great enthusiasm and dedication, he actively participated in all school-related activities. His foremost concern was always the welfare of the staff members and students. During his tenure, he introduced several significant developments to the school, including improving the overall standards of the institution, constructing new buildings, upgrading the high school into a Higher Secondary School, and establishing a new computer laboratory. Because of his hard work and dedicated efforts, the school also received recognition as an examination centre for conducting public examinations. Until his final days, his constant vision and concern were to develop the school into a high-quality educational institution. On 3rd June 2025, after realizing that his health condition was deteriorating, he resigned from his responsibilities. He passed on 6 June 2025. His memory continues through stories, photographs, values, and the many lives shaped by his presence.',
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
      src: '/images/memories/memories-1.webp',
      alt: 'J.P. Edwin Chelliah remembered through meaningful life moments',
      album: 'Memories',
      caption: ''
    },
     {
      src: '/images/memories/memories-2.webp',
      alt: 'J.P. Edwin Chelliah remembered through meaningful life moments',
      album: 'Memories',
      caption: ''
    },
     {
      src: '/images/memories/memories-3.webp',
      alt: 'J.P. Edwin Chelliah remembered through meaningful life moments',
      album: 'Memories',
      caption: ''
    },
     {
      src: '/images/memories/memories-4.webp',
      alt: 'J.P. Edwin Chelliah remembered through meaningful life moments',
      album: 'Memories',
      caption: ''
    },
     {
      src: '/images/memories/memories-5.webp',
      alt: 'J.P. Edwin Chelliah remembered through meaningful life moments',
      album: 'Memories',
      caption: ''
    },
     {
      src: '/images/memories/memories-6.webp',
      alt: 'J.P. Edwin Chelliah remembered through meaningful life moments',
      album: 'Memories',
      caption: ''
    },
     {
      src: '/images/memories/memories-7.webp',
      alt: 'J.P. Edwin Chelliah remembered through meaningful life moments',
      album: 'Memories',
      caption: ''
    },
     {
      src: '/images/memories/memories-8.webp',
      alt: 'J.P. Edwin Chelliah remembered through meaningful life moments',
      album: 'Memories',
      caption: ''
    },
     {
      src: '/images/memories/memories-9.webp',
      alt: 'J.P. Edwin Chelliah remembered through meaningful life moments',
      album: 'Memories',
      caption: ''
    },
     {
      src: '/images/memories/memories-10.webp',
      alt: 'J.P. Edwin Chelliah remembered through meaningful life moments',
      album: 'Memories',
      caption: ''
    },
      {
      src: '/images/memories/memories-11.webp',
      alt: 'J.P. Edwin Chelliah remembered through meaningful life moments',
      album: 'Memories',
      caption: ''
    },
    {
      src: '/images/recent/recent-1.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
     {
      src: '/images/recent/recent-2.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
     {
      src: '/images/recent/recent-3.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
    {
      src: '/images/recent/recent-4.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
     {
      src: '/images/recent/recent-5.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
     {
      src: '/images/recent/recent-6.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
    {
      src: '/images/recent/recent-7.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
     {
      src: '/images/recent/recent-8.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
     {
      src: '/images/recent/recent-9.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
    {
      src: '/images/recent/recent-10.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
     {
      src: '/images/recent/recent-11.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
     {
      src: '/images/recent/recent-12.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
    {
      src: '/images/recent/recent-13.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
     {
      src: '/images/recent/recent-14.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
     {
      src: '/images/recent/recent-15.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
    {
      src: '/images/recent/recent-16.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
     {
      src: '/images/recent/recent-17.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
     {
      src: '/images/recent/recent-18.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
        {
      src: '/images/recent/recent-19.webp',
      alt: 'Recent photographs and remembrance moments of J.P. Edwin Chelliah',
      album: 'Recent',
      caption: ''
    },
    {
      src: '/images/retirement/retirement-1.webp',
      alt: 'J.P. Edwin Chelliah during retirement and later years',
      album: 'Retirement',
      caption: ''
    },
     {
      src: '/images/retirement/retirement-2.webp',
      alt: 'J.P. Edwin Chelliah during retirement and later years',
      album: 'Retirement',
      caption: ''
    },
     {
      src: '/images/retirement/retirement-3.webp',
      alt: 'J.P. Edwin Chelliah during retirement and later years',
      album: 'Retirement',
      caption: ''
    },
    {
      src: '/images/mentor/mentor-1.webp',
      alt: 'J.P. Edwin Chelliah remembered as a mentor and guide',
      album: 'Mentor',
      caption: ''
    },
       {
      src: '/images/mentor/mentor-2.webp',
      alt: 'J.P. Edwin Chelliah remembered as a mentor and guide',
      album: 'Mentor',
      caption: ''
    },
     {
      src: '/images/mentor/mentor-3.webp',
      alt: 'J.P. Edwin Chelliah remembered as a mentor and guide',
      album: 'Mentor',
      caption: ''
    },
     {
      src: '/images/mentor/mentor-4.webp',
      alt: 'J.P. Edwin Chelliah remembered as a mentor and guide',
      album: 'Mentor',
      caption: ''
    },
     {
      src: '/images/mentor/mentor-5.webp',
      alt: 'J.P. Edwin Chelliah remembered as a mentor and guide',
      album: 'Mentor',
      caption: ''
    },
     {
      src: '/images/mentor/mentor-6.webp',
      alt: 'J.P. Edwin Chelliah remembered as a mentor and guide',
      album: 'Mentor',
      caption: ''
    },
     {
      src: '/images/mentor/mentor-7.webp',
      alt: 'J.P. Edwin Chelliah remembered as a mentor and guide',
      album: 'Mentor',
      caption: ''
    },
    {
      src: '/images/mentor/mentor-8.webp',
      alt: 'J.P. Edwin Chelliah remembered as a mentor and guide',
      album: 'Mentor',
      caption: ''
    },
    {
      src: '/images/mentor/mentor-9.webp',
      alt: 'J.P. Edwin Chelliah remembered as a mentor and guide',
      album: 'Mentor',
      caption: ''
    }
    
  ],
  tributes: [
    {
      name: 'J.P. Johnson Chandrasekar',
      relationship: 'Elder Brother',
      message: 'எனது தம்பி "செல்லப்பா" என அழைக்கப்படும் திரு.J.P எட்வின் செல்லையா அவர்களைப் பற்றி அவரது மூத்த சகோதரன் ஜான்ஸனின் நினைவலைகள். எனக்கும் அவருக்கும் வயது வித்தியாசம் 2.5 ஆண்டுகள், ஆனால் எண்ணங்களிலும் செயல்பாடுகளிலும் வித்தியாசம் 2.5% -க்கும் குறைவே!     முதலாவது அவரிடம் காணப்பட்ட பண்பு இறை பக்தி. சிறுவயதிலேயே ஆலயத்திலும் குடும்ப ஜெபவேளையில் அம்மா, அப்பா, அக்காள்.கமலா ஜான்ஸி ராணி, தம்பி. இம்மானுவேல் ஜெயப்பிரகாஷ் உடன் உரத்த குரலில் பாடி கர்த்தரைத் துதித்தது குறிப்படத்தக்கது. பெற்றோருக்கும், பெரியவர்களுக்கும், அவர் பாராட்டின மரியாதை, அரவணைப்பு, அன்பு அளவிடற்கரியது. கர்த்தருடைய கிருபையால் அவர்களது அறிவுறை, வழிகாட்டுதல்களைப் பெற்றும், தனது விருப்பங்கள், ஆலோசனைகள் தந்தும் வந்தார். சிறு வயது முதல் நண்பர்களிடம் நல் உறவு, விளையாட்டுகளில் ஆர்வம் அதிகம். சிறுவயதில் தூரத்திலிருந்த  நண்பன் "காமனன்" வீட்டு விசேஷத்திற்கு சென்றுவிட்டு  [எல்லோரும் பதறி தேடிக்கொண்டிருந்த போது] தாமதமாக வீட்டிற்கு வந்தது நினைவிற்கு வருகிறது. பின்நாட்களில் படிப்பிலும் கடின உழைப்பிலும் நற்குணங்களில் சிறந்த வாழ்க்கையை தொடர்ந்தார். பிறருக்கும் கர்த்தர் அருளிய தனது திறமை  மற்றும் ஆசீர்வாதங்களை பகிர்ந்து மகிழ்ந்தவர். ஆலய  சமுதாய காரியங்களில் குறிப்பாக சி.எஸ்.ஐ. மதுரை ராம்நாட் பேராயத்தில் பதிவாளராகவும் சி.எஸ்.ஐ. மேல்நிலைப் பள்ளியின் தாளாளராகவும் ஆலய பொருப்பாளர்களில் ஒருவராகவும் அனைவராலும்  பாராட்டும்படியாக செயல்பட்டவர். ஆலய குருமார்கள்,  மூப்பர்கள், மற்றும் குடும்ப மூத்த உறுப்பினர்களைக் கெளரவிப்பதிலும் முன்மாதிரியாக திகழ்ந்தார்.  தனது  விளையாட்டு ஆர்வத்தை பின்னாட்களில் எங்களது ஊர்  நிலக்கோட்டையில் நடைபெறும் தேசிய, மாநில அளவு கால்பந்து போட்டிகள் நடத்துவதில் தன்னை இணைத்துக்கொண்டதும், பிள்ளைகள் ஏஞ்சலின் குணவதி, ஸ்வீட்லின் பிரியா இருவரையும்  விளையாட்டில் ஆர்வம் காட்ட ஊக்கமளித்ததும், படிப்பிலும், நற்குணத்திலும் சிறந்துவிளங்கவும், அவர்களுக்கு நல்ல வாழ்க்கையை தனது துணைவியார் திருமதி .குணசீலி செல்வராணி அவர்களோடு சேர்ந்து   அமைத்துக் கொடுத்ததும் விஷேசமானவைகளாகும். எந்தக் காரியத்தையும் கவனமாக, நிதானத்தோடு செய்வது முடித்தவர்.  கபடமில்லாமல், எதையும் ஒதுக்காமல் சாப்பிடுவது. அம்மா சொல்வார்கள் "செல்லும், செல்லாததும் செட்டியாரிடம் செல்லும்"  என்று. அதாவது செல்லாது என மற்றவர்கள் வாங்க மறுக்கும் ரூபாய் நோட்டு செட்டியாரிடம் [வட்டிக்குக் கடனளிடப்பவர்] செல்லுபடியாகும். அதேபோல "வல்லவனுக்குப் புல்லும் ஆயுதம்" எனக் கூறுவார்கள். அதாவது சிறிய ஸ்லேட்டுக் குச்சியை கொண்டு எழுதி நல்ல மதிப்பெண்கள் பெற்று வருவதை பாராட்டுவார்கள். [சில நேரங்களில் அவரது ஸ்லேட்டுக் குச்சியை இரண்டாக உடைத்து இல்லாத பையனுக்கு அம்மா கொடுப்பார்கள்] . தான் மட்டுமல்ல மற்றவர்ளும் படிக்க கற்றுக்கொடுத்து  ஊக்கப்படுத்துவது, பணி செய்யும் போது அர்ப்பணிப்போடு,  உண்மையாகவும், வேலைகளை நிறைவேற்றி, சக பணியாளர்களுக்கும் தகுந்த ஆலோசனைகளை கொடுப்பது , [ அதனால் தானோ அவருக்கு படுத்தவுடன் கண்ணயர்ந்து தூக்கம் வந்ததோ!] பணி மூப்பிற்குப் பிறகும் தொய்வில்லாமல் கர்த்தருடைய கிருபையால் நிறைவாக பணிகளை சிறப்பாக செய்து இப்போது  நித்திய இளைப்பாறுதலுக்குள் உள்ளார் என்பதால் கர்த்தரை ஸ்தோத்திரிக்கிறேன். அவரது உலகப்பிரகாரமான பிரிவு குடும்பத்தார், உறவினர், மற்றும் பழகிய அனைத்து தரப்பட்டவர்களுக்கும் பேரிழப்பாகும். அவரது உலக பரிபூரண வாழ்க்கைக்காக கர்த்தருக்கு ஸ்தோத்திரம். அவர் விட்டுச் சென்றவர்கள் அவரது பணிகளை  தொடர்ந்து செய்ய பிரார்த்திக்கிறேன்.',
      date: 'May 2026'
    },
     {
      name: 'Dr. S. Jeyakumar',
      relationship: 'Brother-in-law',
      message: ['We remember Edwin, a humble and God fearing soul who lived a life of simplicity, kindness and quiet sacrifice. In a world full of noise, his quiet strength shines like a gentle light. He helped many people generously without seeking any praise or return, always lending a helping hand with a warm heart. Though he carried his own sufferings silently, he never allowed his pain to stop him from caring for others. He reflected the love and compassion of God through simple acts of goodness, humility and prayers. He walked in faith, remained calm even in difficult times and touched many hearts without making his deeds known.',
      'The Bible says:',
      '"When you give to the needy, do not let your left hand know what your right hand is doing." (Mathew 25:23)',
      '"The righteous will be remembered for ever." (Psalm 112:6)',
      '"Well done, good and faithful servant enter into the joy of your Lord." (Mathew 6:3)',
      'We pray that Lord grants him eternal rest and welcomes him into His heavenly kingdom where there is no pain, sorrow or suffering. May his soul rest in peace in the loving presence of God. We thank God for his beautiful example of faith and kindness, he left behind.',
      ],
      date: 'May 2026'
    },
    {
      name: 'Rev. Jacob Wincilin',
      relationship: 'Presbyter & PC Chairman, CSI Christ Church, Visuvasapuri, Madurai',
     message: ['வையகமும் வானவரும், உமதகம் நிறை காண',
      'வைத்தனர், எம் கால, கடையேழு வள்ளலராய்',   
'மெய் சிலிர்க்கும், புகழ் மணக்கும் விந்தை நீரன்றோ',  
'பை நகரும் காலக் கண்ணாடியின்  காவியத்தை', 
'மெய்யால் நினை, மையால் வரை, கவி ஓவியமாய்',  
'பைந்தமிழ், கற்கண்டு சொல் கொண்டு தான் விண்டு', 
'கை மாறு வேறில்லை, இல்லையேல் பழிக்கும் காலம்',
'கை நீர் நீட்ட,  கண்ணீர்  காய, வழியும் காண', 
'தைத்தன கிழிசல்  ஆடை உம் வெள்ளை  உள்ள நூலால்', 
'வைத்தனர் பலர் வீட்டில்  உணவின் உலை', 
 'வரலாறு படைத்தீர் சுவடுகள் பதித்தீர்', 
 'பிறர் துன்பம் தன் துன்பம் போல்  கண்டு', 
'உம் துன்பம் நீர் மறந்தே வாழ்ந்தீர்', 
'உமக்காக வாழ மறுத்து பிறருக்காக மட்டுமே வாழ்ந்தீர்', 
'உலகில் உமை தந்த கடவுளுக்கு பல நன்றி',  
'உண்மையில் உமை பிரிந்த வேதனையின்  தாக்கம்',
'உணரும் உயிர்களில் ஒருவனாய் நானும்',
'உறைந்தே உதிர்க்கிறேன் புகழ் பா',],
      date: 'May 2026'
    },
    {
      name: 'M. Ravichandran',
      relationship: 'Co-Employee, Telephone Operator (Retired), Madurai',
      message: 'எட்வின் அண்ணா அவர்கள் கனரா வங்கி வட்ட அலுவலகத்தில்  என்னோடு பணியாற்றியவர். அவர் சிரித்த முகத்துடன் அனைவருடன் பழகும் விதம் மற்றும் அனைவருக்கும் உதவி செய்யும் குணமுமே என்னை, அண்ணாவை போல நாமும் இருக்க வேண்டும் என்ற எண்ணத்தை ஏற்படுத்தியது. அவருடைய இழப்பு எனது நட்பு வட்டாரத்தில் ஒரு பேரிழப்பு என எண்ணுகிறேன். அவருடன் இணைந்து பணியாற்றிய நாட்கள் மறக்க முடியாதவை. அத்தகைய அனுபவத்தை கொடுத்த இறைவனுக்கு கோடானு கோடி நன்றிகள். அண்ணாவின் ஆசீர்வாதம் என்றென்றும் அவரது குடும்பத்தாருக்கு கிடைத்திட இறைவனை வேண்டிக் கொள்கிறேன்.',
      date: 'May 2026'
    },
    {
      name: 'Mrs. Helen Priscilla Bai',
      relationship: 'Niece',
      message: 'My Chithappa is one of the kindest person I know, always ready to lend a hand to anyone in need. I’ve known him for almost 50 years, since my childhood. He makes time to visit those who are hospitalized offering them comfort and care. He’s also a frequent blood donor, stepping up without hesitation whenever someone needs help. He was a lover of music and I have preserved some of his best melodies. He has made a remarkable place in everyones heart.',
      date: 'May 2026'
    },
    {
      name: 'R. Irene Cynthia',
      relationship: 'Grand daughter',
      message: 'I love my Grandpa and I miss my Grandpa a lot. I hope he is in the heaven with his family. The day that God called your name, it broke my heart into two but heaven needed an Angel and the one He picked was you. I wish He could have waited and let you stay with me.',
      date: 'May 2026'
    }
  ],
  events: [
    {
      title: 'Annual Remembrance Gathering',
      date: 'Every June',
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
