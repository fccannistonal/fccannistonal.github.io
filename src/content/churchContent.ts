export type NavItem = {
  label: string;
  href: string;
};

export type ActionLink = {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  external?: boolean;
};

export type ContactDetail = {
  label: string;
  value: string;
  helper?: string;
};

export type SiteConfig = {
  name: string;
  shortName: string;
  denomination: string;
  tagline: string;
  heroBackgroundSrc?: string;
  heroPrimaryAction: ActionLink;
  heroSecondaryAction: ActionLink;
  welcomeTitle: string;
  welcomeParagraphs: string[];
  visitHighlights: string[];
  addressLines: string[];
  serviceNotes: string[];
  mapEmbedUrl: string;
  contactSummary: string;
  contactDetails: ContactDetail[];
  navigation: NavItem[];
  homeActions: ActionLink[];
};

export type HeroMessage = {
  id: string;
  text: string;
  color: string;
};

export type PhotoSlide = {
  id: string;
  title: string;
  caption: string;
  imageSrc?: string;
  imageAlt: string;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  focusAreas: string[];
  imageSrc?: string;
  imageAlt: string;
};

export type OutreachItem = {
  id: string;
  title: string;
  summary: string;
  highlights: string[];
  imageSrc?: string;
  imageAlt: string;
};

export const siteConfig: SiteConfig = {
  name: 'First Christian Church Anniston',
  shortName: 'FCC Anniston',
  denomination: 'Disciples of Christ',
  tagline:
    'A welcoming church in Anniston shaped by worship, hospitality, and practical care for our neighbors.',
  heroBackgroundSrc:
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1800&q=80',
  heroPrimaryAction: {
    id: 'plan-visit',
    title: 'Plan a Visit',
    description: 'Learn more about worship, location, and how to get in touch.',
    href: '/contact',
    cta: 'Plan a visit',
  },
  heroSecondaryAction: {
    id: 'staff',
    title: 'Meet the Staff',
    description: 'Get to know the people serving and leading in this community.',
    href: '/staff',
    cta: 'Meet the staff',
  },
  welcomeTitle: 'Welcome to First Christian Church Anniston',
  welcomeParagraphs: [
    'This first pass of the site is designed to feel warm, approachable, and rooted in community while leaving room for your final stories, ministry details, and photography.',
    'The structure is ready for worship information, pastoral introductions, outreach updates, giving links, and the everyday moments that help visitors understand who your congregation is.',
  ],
  visitHighlights: [
    'A friendly, no-pressure welcome for visitors and longtime members alike.',
    'Thoughtful worship, prayer, and opportunities to learn together.',
    'Visible pathways into outreach, service, and community life.',
    'Online touchpoints for listening, joining worship remotely, and giving.',
  ],
  addressLines: ['Full street address coming soon', 'Anniston, Alabama'],
  serviceNotes: [
    'Sunday worship details can be updated here once the final schedule is confirmed.',
    'Zoom access is already wired into the layout so the church link can be swapped in quickly.',
    'The contact form supports a Formspree endpoint for launch on GitHub Pages.',
  ],
  mapEmbedUrl: 'https://www.google.com/maps?q=First+Christian+Church+Anniston+Alabama&output=embed',
  contactSummary:
    'A Disciples of Christ congregation serving Anniston with worship, welcome, and community outreach.',
  contactDetails: [
    {
      label: 'Location',
      value: 'Anniston, Alabama',
      helper: 'Update the street address in the content file when it is ready.',
    },
    {
      label: 'Email',
      value: 'Church email link coming soon',
      helper: 'The contact form can handle messages in the meantime.',
    },
    {
      label: 'Phone',
      value: 'Church phone number coming soon',
    },
  ],
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Staff', href: '/staff' },
    { label: 'Outreach', href: '/outreach' },
    { label: 'Contact', href: '/contact' },
  ],
  homeActions: [
    {
      id: 'podcast',
      title: 'Church Podcast',
      description: 'Connect your published sermon or podcast feed here for weekly listening.',
      href: 'https://podcasts.apple.com/',
      cta: 'Listen to the podcast',
      external: true,
    },
    {
      id: 'zoom',
      title: 'Zoom Worship',
      description: 'Keep a ready path for remote worshippers, travelers, and homebound members.',
      href: 'https://zoom.us/',
      cta: 'Join on Zoom',
      external: true,
    },
    {
      id: 'give',
      title: 'Give Online',
      description:
        'Swap in the church’s final Tithe.ly giving URL without changing the page layout.',
      href: 'https://tithe.ly/',
      cta: 'Give through Tithe.ly',
      external: true,
    },
  ],
};

export const heroMessages: HeroMessage[] = [
  { id: 'disciples', text: 'Disciples of Christ', color: '#f6d293' },
  { id: 'affirming', text: 'open and affirming', color: '#d7efcb' },
  { id: 'welcoming', text: 'excited to meet you', color: '#f3b878' },
  { id: 'community', text: 'rooted in community', color: '#d5e1ff' },
];

export const photoSlides: PhotoSlide[] = [
  {
    id: 'worship',
    title: 'Worship that gathers people in',
    caption:
      'Use this space for images of Sunday worship, prayer, music, and the rhythms of congregational life.',
    imageSrc: 'https://picsum.photos/seed/fccanniston-worship/1200/900',
    imageAlt: 'Placeholder photo for a worship gathering',
  },
  {
    id: 'staff',
    title: 'Leaders people can recognize',
    caption:
      'A simple carousel helps visitors connect names and faces before they ever step through the door.',
    imageSrc: 'https://picsum.photos/seed/fccanniston-staff/1200/900',
    imageAlt: 'Placeholder photo for church staff',
  },
  {
    id: 'community',
    title: 'Everyday community moments',
    caption:
      'Photos of shared meals, conversation, and care make the church feel present and human online.',
    imageSrc: 'https://picsum.photos/seed/fccanniston-community/1200/900',
    imageAlt: 'Placeholder photo for community life',
  },
  {
    id: 'outreach',
    title: 'Outreach that shows up',
    caption:
      'This slot can hold ministry events, volunteer work, and the practical ways your church serves Anniston.',
    imageSrc: 'https://picsum.photos/seed/fccanniston-outreach/1200/900',
    imageAlt: 'Placeholder photo for outreach work',
  },
];

export const staffMembers: StaffMember[] = [
  {
    id: 'lead-pastor',
    name: 'Lead Pastor Name',
    role: 'Senior Minister',
    bio: 'Use this profile for the pastor’s welcome, ministry background, and the tone they set for worship, care, and congregational life.',
    focusAreas: ['Preaching', 'Pastoral care', 'Vision and leadership'],
    imageSrc: 'https://picsum.photos/seed/fccanniston-pastor/900/1100',
    imageAlt: 'Placeholder portrait for the lead pastor',
  },
  {
    id: 'music',
    name: 'Music Director Name',
    role: 'Music and Worship',
    bio: 'This section can introduce the person who shapes music, worship flow, choir leadership, or instrumental ministry across the week.',
    focusAreas: ['Worship planning', 'Choir', 'Special services'],
    imageSrc: 'https://picsum.photos/seed/fccanniston-music/900/1100',
    imageAlt: 'Placeholder portrait for the music director',
  },
  {
    id: 'children',
    name: 'Children’s Ministry Name',
    role: 'Children and Families',
    bio: 'A short bio here can explain how children, youth, and families are welcomed, supported, and invited into the life of the church.',
    focusAreas: ['Family ministry', 'Education', 'Volunteer coordination'],
    imageSrc: 'https://picsum.photos/seed/fccanniston-children/900/1100',
    imageAlt: 'Placeholder portrait for the children’s ministry leader',
  },
  {
    id: 'office',
    name: 'Office Administrator Name',
    role: 'Administration and Care',
    bio: 'Use this profile for the person who helps visitors find answers, coordinates communication, and keeps the day-to-day rhythms of the church moving.',
    focusAreas: ['Scheduling', 'Communication', 'Congregational support'],
    imageSrc: 'https://picsum.photos/seed/fccanniston-office/900/1100',
    imageAlt: 'Placeholder portrait for the office administrator',
  },
];

export const outreachItems: OutreachItem[] = [
  {
    id: 'food',
    title: 'Meals, pantry support, and practical care',
    summary:
      'This section is ready for the kinds of ministries that meet immediate needs through meals, pantry partnerships, and everyday acts of care.',
    highlights: ['Food drives', 'Meal support', 'Partnerships with local organizations'],
    imageSrc: 'https://picsum.photos/seed/fccanniston-food/1200/900',
    imageAlt: 'Placeholder photo for meal and pantry outreach',
  },
  {
    id: 'neighbors',
    title: 'Neighbor-centered service projects',
    summary:
      'Use these cards to show how the congregation serves schools, shelters, neighborhood initiatives, and other community efforts across Anniston.',
    highlights: ['Volunteer days', 'School support', 'Seasonal community projects'],
    imageSrc: 'https://picsum.photos/seed/fccanniston-neighbors/1200/900',
    imageAlt: 'Placeholder photo for neighborhood service',
  },
  {
    id: 'fellowship',
    title: 'Shared tables and hospitality',
    summary:
      'Not every outreach moment needs to be formal. Highlight gatherings, hospitality events, and open-door community meals that help people belong.',
    highlights: ['Community meals', 'Conversation spaces', 'Hospitality events'],
    imageSrc: 'https://picsum.photos/seed/fccanniston-fellowship/1200/900',
    imageAlt: 'Placeholder photo for fellowship and hospitality',
  },
  {
    id: 'seasonal',
    title: 'Seasonal drives and special events',
    summary:
      'Reserve space for back-to-school support, holiday giving, fundraisers, and other annual moments that matter to the congregation and its neighbors.',
    highlights: ['Holiday drives', 'Back-to-school support', 'Community celebrations'],
    imageSrc: 'https://picsum.photos/seed/fccanniston-seasonal/1200/900',
    imageAlt: 'Placeholder photo for seasonal outreach',
  },
];
