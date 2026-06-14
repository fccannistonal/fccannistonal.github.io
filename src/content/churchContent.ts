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

export type ServiceTime = {
  label: string;
  time: string;
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
  serviceTimes: ServiceTime[];
  sermonEmbedUrl: string;
  givingFormId: string;
  givingCopy: string;
  exteriorImageSrc?: string;
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
    'Hi there! Welcome to First Christian Church, Anniston. Come as you are—we can’t wait to meet you!',
  heroBackgroundSrc: '/images/home/sanctuary-hero.jpg',
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
  welcomeTitle: 'All Are Welcome',
  welcomeParagraphs: [
    "At First Christian Church of Anniston, we believe that everyone deserves a place to belong, a space to grow, and a community to support them. Whether you're exploring your faith or have been on this journey for years, we welcome you with open arms.",
    'Our Worship Service is the heart of our Sunday gatherings, where we come together to celebrate, reflect, and connect with God and each other. Families are especially welcome! During the Worship Service, children can participate in Wonder and Worship, a program designed to engage their imaginations and nurture their spiritual growth in fun and meaningful ways.',
    'Come as you are—we can’t wait to meet you!',
  ],
  visitHighlights: [
    'A place to belong, grow, and find community.',
    'Worship that makes room for celebration, reflection, and connection.',
    'Wonder and Worship for children during the Worship Service.',
    'An open and affirming congregation where all are welcome.',
  ],
  serviceTimes: [
    { label: 'Sunday School', time: '10:30 AM' },
    { label: 'Worship Service', time: '11:30 AM' },
  ],
  sermonEmbedUrl: 'https://open.spotify.com/embed/show/7BOIacUOhCI3jN6PcfLPUc?utm_source=generator',
  givingFormId: 'c23cd1bd-eeab-4311-a159-15b079e46baf',
  givingCopy:
    'Your generous support helps us live out our love, service, and inclusion mission. By partnering with us financially, you become an essential part of our work—hosting community events like the Makers Market, supporting local outreach programs, or keeping our doors open to all who seek a spiritual home. No matter the size, every gift makes a difference and helps us continue sharing God’s love with our neighbors.',
  addressLines: ['Full street address coming soon', 'Anniston, Alabama'],
  serviceNotes: [
    'Sunday School begins at 10:30 AM.',
    'Worship Service begins at 11:30 AM.',
    'Children are invited to participate in Wonder and Worship during the service.',
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
      title: 'Uplifting Sermons',
      description: 'Listen to sermons by Pastor Laura Hutchinson on Spotify.',
      href: 'https://open.spotify.com/show/7BOIacUOhCI3jN6PcfLPUc',
      cta: 'Listen on Spotify',
      external: true,
    },
    {
      id: 'give',
      title: 'Give Online',
      description: 'Partner with First Christian Church financially through Tithe.ly.',
      href: '/#give',
      cta: 'Give',
    },
  ],
};

export const heroSentences: HeroSentence[] = [
  {
    id: 'disciples',
    lead: 'We are ',
    emphasis: 'followers of Christ',
    ending: '.',
    color: '#fab638',
  },
  {
    id: 'affirming',
    lead: 'We are ',
    emphasis: 'Anniston’s first open and affirming church',
    ending: '.',
    color: '#f43e53',
  },
  {
    id: 'service',
    lead: 'We are ',
    emphasis: 'the hands and feet of God',
    ending: '.',
    color: '#76d65c',
  },
  {
    id: 'compassion',
    lead: 'We are ',
    emphasis: 'compassionate and caring',
    ending: '.',
    color: '#7694ff',
  },
];

export const photoSlides: PhotoSlide[] = [
  {
    id: 'staff',
    title: 'Church Staff',
    caption: 'The people who serve and lead First Christian Church Anniston.',
    imageAlt: 'First Christian Church Anniston staff',
  },
  {
    id: 'makers-market',
    title: 'Calhoun County Makers Market',
    caption: 'Community, creativity, and connection at the Calhoun County Makers Market.',
    imageAlt: 'Calhoun County Makers Market at First Christian Church',
  },
  {
    id: 'stained-glass',
    title: 'Sanctuary Stained Glass',
    caption: 'Stained glass in the First Christian Church sanctuary.',
    imageAlt: 'Stained glass in the church sanctuary',
  },
  {
    id: 'tom-hutchinson-art',
    title: 'Art by Tom Hutchinson',
    caption: 'Artwork by Tom Hutchinson displayed at the church.',
    imageAlt: 'Artwork by Tom Hutchinson',
  },
  {
    id: 'tapestry',
    title: 'FCC Tapestry',
    caption: 'A tapestry at First Christian Church Anniston.',
    imageAlt: 'First Christian Church tapestry',
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
