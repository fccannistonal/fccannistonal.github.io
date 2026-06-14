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
  logoSrc: string;
  heroBackgroundSrc?: string;
  heroPrimaryAction: ActionLink;
  heroSecondaryAction: ActionLink;
  welcomeTitle: string;
  welcomeParagraphs: string[];
  visitHighlights: string[];
  serviceTimes: ServiceTime[];
  sermonEmbedUrl: string;
  givingFormId: string;
  givingFormUrl: string;
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
  objectPosition?: string;
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

export type TheaterImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
};

export type DiversityTheaterContent = {
  name: string;
  eyebrow: string;
  introduction: string[];
  missionStatement: string;
  founderName: string;
  founderRole: string;
  founderBio: string[];
  facebookUrl: string;
  heroImage: TheaterImage & {
    srcSet: string;
  };
  galleryImages: TheaterImage[];
  founderPortrait: TheaterImage;
  founderActionImage: TheaterImage;
};

const tithelyFormId = 'c23cd1bd-eeab-4311-a159-15b079e46baf';
const tithelyFormUrl = `https://give.tithe.ly/?formId=${tithelyFormId}`;

export const siteConfig: SiteConfig = {
  name: 'First Christian Church Anniston',
  shortName: 'FCC Anniston',
  denomination: 'Disciples of Christ',
  tagline:
    'Hi there! Welcome to First Christian Church, Anniston. Come as you are—we can’t wait to meet you!',
  logoSrc: '/images/brand/fcc-logo.png',
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
  givingFormId: tithelyFormId,
  givingFormUrl: tithelyFormUrl,
  givingCopy:
    'Your generous support helps us live out our love, service, and inclusion mission. By partnering with us financially, you become an essential part of our work—hosting community events like the Makers Market, supporting local outreach programs, or keeping our doors open to all who seek a spiritual home. No matter the size, every gift makes a difference and helps us continue sharing God’s love with our neighbors.',
  exteriorImageSrc: '/images/home/fcc-exterior-sunset.jpg',
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
    { label: 'Community', href: '/community' },
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
      href: tithelyFormUrl,
      cta: 'Give',
      external: true,
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
    id: 'childrens-moment',
    title: 'Children’s Moment',
    caption: 'Children are invited into worship through stories, questions, and hands-on moments.',
    imageSrc: '/images/gallery/childrens-moment.jpg',
    imageAlt: 'A church leader sharing a children’s moment with two children in the sanctuary',
    objectPosition: '50% 42%',
  },
  {
    id: 'communion-table',
    title: 'The Communion Table',
    caption: 'The table is prepared as a sign of welcome, remembrance, and shared faith.',
    imageSrc: '/images/gallery/communion-table.jpg',
    imageAlt:
      'A communion table arranged with breads, cups, candles, and serving vessels in the sanctuary',
    objectPosition: '50% 54%',
  },
  {
    id: 'sanctuary-cross',
    title: 'Centered in Christ',
    caption:
      'Symbols throughout the sanctuary point toward worship, reflection, and the life of Christ.',
    imageSrc: '/images/gallery/sanctuary-cross.jpg',
    imageAlt:
      'A brass processional cross in focus with the sanctuary cross and stained-glass windows behind it',
    objectPosition: '50% 50%',
  },
  {
    id: 'staff',
    title: 'Church Staff',
    caption: 'The people who serve and lead First Christian Church Anniston.',
    imageSrc: '/images/gallery/church-staff.jpg',
    imageAlt: 'Five First Christian Church staff members laughing together',
    objectPosition: '50% 48%',
  },
  {
    id: 'stained-glass',
    title: 'Sanctuary Stained Glass',
    caption: 'Historic stained glass fills the sanctuary with color and warm light.',
    imageSrc: '/images/gallery/stained-glass.jpg',
    imageAlt:
      'Tall stained-glass windows glowing above the chancel in the First Christian Church sanctuary',
    objectPosition: '52% 42%',
  },
  {
    id: 'tapestry',
    title: 'A Story in Tapestry',
    caption: 'A handmade tapestry preserves pieces of the congregation’s history and identity.',
    imageSrc: '/images/gallery/church-tapestry.jpg',
    imageAlt:
      'A handmade tapestry illustrating the history and symbols of First Christian Church Anniston',
    objectPosition: '50% 45%',
  },
  {
    id: 'welcome-area',
    title: 'A Place of Welcome',
    caption: 'Our welcome area reflects a congregation committed to hospitality and belonging.',
    imageSrc: '/images/gallery/welcome-area.jpg',
    imageAlt:
      'The church welcome area with artwork, visitor materials, a welcome sign, and rainbow flags',
    objectPosition: '50% 45%',
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

export const diversityTheater: DiversityTheaterContent = {
  name: 'Diversity Theater Company',
  eyebrow: 'First Christian Church presents',
  introduction: [
    'At First Christian Church, we proudly sponsor and host performances by the Diversity Theater Company, offering a unique space for storytelling that reflects the lived experiences of LGBTQ individuals.',
    'Our plays and musicals navigate the realities of life within the LGBTQ community, highlighting the prejudice and misunderstandings often encountered in the broader Christian context. These productions are poignant, funny, charming, and deeply rooted in Christian values, shining a light on Christ-like love in action.',
    'Through the arts, we extend a warm welcome to individuals who may not have felt fully embraced in other church settings. Each performance is an opportunity to show hospitality, live out God’s message of endless love, and strengthen our connections within the wider community.',
  ],
  missionStatement:
    'Theater brings people together. Through shared stories, we foster unity, compassion, and understanding.',
  founderName: 'Maury Evans',
  founderRole: 'Founder & Director',
  founderBio: [
    'Maury Evans, the visionary behind Diversity Theater Company, brings a wealth of experience and passion to his work. Having worked professionally in dinner theaters and toured with The Missoula Children’s Theatre, Maury has established multiple successful theater companies across the U.S., including Ravenwind Players and Jubilation Theatre Company in Portland, Oregon, and Celebration Theatre Company in Albuquerque, New Mexico.',
    'Before joining the First Christian Church family in Anniston, Maury was a member of the Metropolitan Community Church in Albuquerque, where he directed and produced numerous productions. We are honored to have Maury as part of our congregation and blessed to witness the impact of his artistry on our community.',
  ],
  facebookUrl: 'https://www.facebook.com/profile.php?id=61555989325768',
  heroImage: {
    id: 'full-cast',
    src: '/images/community/diversity-theater/cast-1600.jpg',
    srcSet:
      '/images/community/diversity-theater/cast-960.jpg 960w, /images/community/diversity-theater/cast-1600.jpg 1600w',
    alt: 'The cast of a Diversity Theater Company western production posing together on stage',
    width: 1600,
    height: 1017,
    objectPosition: '50% 44%',
  },
  galleryImages: [
    {
      id: 'ensemble-scene',
      src: '/images/community/diversity-theater/ensemble-scene.jpg',
      alt: 'Three actors in period costumes performing together on the Diversity Theater stage',
      width: 750,
      height: 500,
      objectPosition: '50% 42%',
    },
    {
      id: 'saloon-scene',
      src: '/images/community/diversity-theater/saloon-scene.jpg',
      alt: 'Actors performing a black-and-white saloon scene in a western stage production',
      width: 750,
      height: 500,
      objectPosition: '46% 50%',
    },
    {
      id: 'table-scene',
      src: '/images/community/diversity-theater/table-scene.jpg',
      alt: 'Two actors seated at a saloon table while another performer stands behind them',
      width: 750,
      height: 500,
      objectPosition: '50% 44%',
    },
    {
      id: 'dramatic-scene',
      src: '/images/community/diversity-theater/dramatic-scene.jpg',
      alt: 'Two actors sharing a serious moment at a table during a stage performance',
      width: 750,
      height: 500,
      objectPosition: '50% 46%',
    },
  ],
  founderPortrait: {
    id: 'maury-portrait',
    src: '/images/community/diversity-theater/maury-evans-portrait.jpg',
    alt: 'Maury Evans seated inside First Christian Church',
    width: 750,
    height: 500,
    objectPosition: '50% 42%',
  },
  founderActionImage: {
    id: 'maury-directing',
    src: '/images/community/diversity-theater/maury-evans-directing.jpg',
    alt: 'Maury Evans speaking on the Diversity Theater stage while holding a script',
    width: 750,
    height: 500,
    objectPosition: '50% 38%',
  },
};
