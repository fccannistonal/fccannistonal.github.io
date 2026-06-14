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

export type HeroSentence = {
  id: string;
  lead: string;
  emphasis: string;
  ending: string;
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
  bio: string[];
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

export const heroSentences: HeroSentence[] = [
  {
    id: 'disciples',
    lead: 'We are ',
    emphasis: 'Disciples of Christ',
    ending: '.',
    color: '#f6d293',
  },
  {
    id: 'affirming',
    lead: 'We are ',
    emphasis: 'open and affirming',
    ending: '.',
    color: '#d7efcb',
  },
  {
    id: 'welcoming',
    lead: 'We are ',
    emphasis: 'excited to meet you',
    ending: '.',
    color: '#f3b878',
  },
  {
    id: 'community',
    lead: 'We are ',
    emphasis: 'rooted in community',
    ending: '.',
    color: '#d5e1ff',
  },
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
    id: 'laura-hutchinson',
    name: 'Rev. Laura Hutchinson',
    role: 'Senior Minister',
    bio: [
      'After graduating with an MDiv from Candler School of Theology in Atlanta, GA, Reverend Laura Hutchinson was ordained in the Christian Church (Disciples of Christ) in Georgia on August 5, 2001. She has served in various capacities throughout her ministry, including youth ministry at several churches, college chaplaincy and adjunct professorship in the Religion Department at Barton College (Wilson, NC), associate ministry at First Christian Church (Disciples of Christ) in Florence, AL, and senior pastorship here, at First Christian Church (Disciples of Christ) in Anniston, AL. She has been serving FCC in Anniston since 2012.',
      'Her primary focus as a pastor is to love people the way God loves them. Many in this world do not know they are loved, and that reality drives her passion for ministry. God’s fierce and unconditional love is at the heart of her preaching and pastoral care. Laura feels blessed to pastor a church that actively encourages reaching out to and welcoming all people, sharing the gospel message alongside her.',
      'Laura shares the light of Christ through preaching, interactive Bible study sessions where questions and thoughtful challenges to tradition are welcomed, pastoral care and counseling, community involvement, anti-racism and pro-reconciliation work through the Christian Church in Alabama & Northwest Florida, open and affirming ministries within the LGBTQ+ community, and co-hosting her podcast, “Untangling Faith,” with colleague Rev. Tammy Jackson of Anniston, AL.',
      'Rev. Hutchinson is deeply grateful for her calling to ministry in the name of Jesus Christ and warmly invites all to join her in this meaningful journey at First Christian Church (Disciples of Christ) in Anniston, AL.',
    ],
    focusAreas: ['Preaching', 'Pastoral care', 'Reconciliation', 'Open and affirming ministry'],
    imageSrc: '/images/staff/laura.jpg',
    imageAlt: 'Portrait of Rev. Laura Hutchinson',
  },
  {
    id: 'maria-zamarripa',
    name: 'Rev. Maria Zamarripa',
    role: 'Associate Minister for Hispanic Ministries',
    bio: [
      'Rev. Maria Zamarripa has been an official member of First Christian Church since the early 1980s, following her affirmation of commitment to Christ. Throughout her long-standing relationship with the congregation, Maria has diligently served in nearly every leadership role the church offers.',
      'Recognizing a profound call to ministry, Maria formally responded by enrolling at Lexington Theological Seminary in 2016. She was ordained by the Christian Church in Alabama & Northwest Florida in 2020. Maria’s heart has always been with the growing Latin community in Calhoun County, where she faithfully ministers, serving as a spiritual guide and compassionate presence. She also extends her ministry as a chaplain at RMC Hospital and the County Jail.',
      'Today, in her role as Associate Minister for Hispanic Ministries, Rev. Zamarripa dedicates her ministry to serving Spanish-speaking individuals and families. Her steadfast commitment to God’s call is reflected daily through acts of love, compassion, and spiritual support.',
    ],
    focusAreas: ['Hispanic ministries', 'Chaplaincy', 'Spiritual care'],
    imageSrc: '/images/staff/maria.jpg',
    imageAlt: 'Portrait of Rev. Maria Zamarripa',
  },
  {
    id: 'gerald-roberts',
    name: 'Gerald Roberts',
    role: 'Organist, Pianist, Choral Director, and Musical Coordinator',
    bio: [
      'Gerald Roberts has had the honor and privilege of serving First Christian Church since August 1987 as organist, pianist, choral director, and musical coordinator. Gerald views music as a profound and sacred means of expressing faith, fostering community, and enhancing worship.',
      'His commitment to lifelong learning is evident in his continuous pursuit of new insights, both musical and spiritual, guided by the Holy Spirit. Gerald finds joy in activities that nurture his physical and spiritual health, including exercise classes, cycling, attending courses, exploring the outdoors, and traveling.',
      'Gerald remains dedicated to enriching worship experiences and contributing to the vibrant community at First Christian Church through his passion for music and faith-driven service.',
    ],
    focusAreas: ['Organ and piano', 'Choir', 'Worship music'],
    imageSrc: '/images/staff/gerald.jpg',
    imageAlt: 'Portrait of Gerald Roberts',
  },
  {
    id: 'judy-engelhart',
    name: 'Judy Engelhart',
    role: 'Church Secretary',
    bio: [
      'Judy Engelhart has faithfully served as the secretary of First Christian Church in Anniston for over 20 years. Prior to her tenure at FCC, she was a church secretary in a small Florida town, bringing significant administrative expertise to her role.',
      'Before joining First Christian Church, Judy had an impactful career as an educational counselor and test administrator at Gadsden State Community College. Additionally, she served as an educational counselor and later as Director of the Army Education Center at Fort McClellan until its closure in 1999.',
      'A lifelong resident of Calhoun County, Judy grew up in Saks and attended Saks School for 12 years. She pursued higher education at Jacksonville State University and later completed master’s degrees from both Georgia State University in Atlanta and Troy State University.',
      'Her life experiences include living in Okinawa for 1.5 years and a spiritually enriching visit to the Holy Land, where she walked in the footsteps of Jesus. Judy deeply loves her role at First Christian Church and values the supportive and caring community around her.',
    ],
    focusAreas: ['Church administration', 'Communication', 'Congregational support'],
    imageSrc: '/images/staff/judy.jpg',
    imageAlt: 'Portrait of Judy Engelhart',
  },
  {
    id: 'jason-wright',
    name: 'Jason Wright',
    role: 'Worship Leader',
    bio: [
      'Jason Wright serves First Christian Church as our Worship Leader, guiding our congregation in vibrant song and joyful praise. He shares his musical leadership and creative talents with another local church, demonstrating his deep commitment to serving God through music and worship.',
      'Jason’s passion extends beyond worship leadership; he actively teaches and coaches children in drama, frequently directing theatrical productions in Jacksonville. As a man of many talents, he is not only a gifted musician but also a skilled visual artist whose creativity enriches our community.',
      'Jason’s presence is always uplifting and inviting, making worship experiences warm and meaningful. He is thrilled to welcome everyone to join him in celebrating faith and fellowship at First Christian Church.',
    ],
    focusAreas: ['Worship leadership', 'Music', 'Drama', 'Visual arts'],
    imageSrc: '/images/staff/jason.jpg',
    imageAlt: 'Portrait of Jason Wright',
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
