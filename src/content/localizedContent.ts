import type { EmbedProviderId } from '../lib/embedConsent';
import type { Locale, RouteId } from '../lib/routing';
import type { ContactMethodId, ServiceId, StaffId } from './churchContent';
import {
  localizedMinistryContent,
  type LocalizedMinistryContent,
} from './localizedMinistryContent';

type HeroSentence = {
  id: string;
  lead: string;
  emphasis: string;
  ending: string;
  color: string;
};

type LocalizedPhoto = {
  title: string;
  caption: string;
  alt: string;
};

type LocalizedStaff = {
  role: string;
  summary: string;
  biography: string[];
  focusAreas: string[];
  imageAlt: string;
  connections?: LocalizedStaffConnection[];
};

type LocalizedStaffConnection = {
  id: 'instagram' | 'book' | 'newspaper' | 'podcast';
  label: string;
  description: string;
  href: string;
};

type AboutLinkCard = {
  title: string;
  description: string;
  routeId: RouteId;
};

type AboutHeritageImage = {
  src: string;
  alt: string;
  title: string;
  caption: string;
  width: number;
  height: number;
  ratio: number;
  sizes: string;
};

type ReadingCategory = {
  title: string;
  books: Array<{ title: string; author: string }>;
};

type LocalizedContent = {
  common: {
    denomination: string;
    churchName: string;
    shortName: string;
    skipToContent: string;
    navigationLabel: string;
    openNavigation: string;
    closeNavigation: string;
    loadingPage: string;
    pauseTextAnimation: string;
    resumeTextAnimation: string;
    navigation: Record<RouteId, string>;
    languageName: string;
    switchLanguage: string;
    give: string;
    directions: string;
    contact: string;
    learnMore: string;
    opensNewTab: string;
    embedConnectionNote: (provider: string) => string;
    serviceLabels: Record<ServiceId, string>;
    footerSummary: string;
    footerExplore: string;
    footerOnline: string;
    footerConnect: string;
    social: {
      facebookTitle: string;
      facebookDescription: string;
      facebookCta: string;
      linktreeTitle: string;
      linktreeDescription: string;
      linktreeCta: string;
    };
    serviceAlert: {
      enabled: boolean;
      title: string;
      message: string;
    };
  };
  home: {
    heroEyebrow: string;
    heroSentences: HeroSentence[];
    heroDescription: string;
    serviceFactLabel: string;
    locationFactLabel: string;
    primaryAction: string;
    secondaryAction: string;
    welcomeEyebrow: string;
    welcomeTitle: string;
    welcomeParagraphs: string[];
    welcomeCta: string;
    churchImageAlt: string;
    churchImageLabel: string;
    churchImageCaption: string;
    sermonsEyebrow: string;
    sermonsTitle: string;
    sermonsDescription: string;
    loadSermons: string;
    givingTitle: string;
    givingCopy: string;
    galleryEyebrow: string;
    galleryTitle: string;
    galleryHint: string;
    previousPhotos: string;
    nextPhotos: string;
    photoStatus: (first: number, last: number, total: number) => string;
    galleryLabel: string;
    photos: Record<string, LocalizedPhoto>;
    connectEyebrow: string;
    connectTitle: string;
    connectCopy: string;
    visitEyebrow: string;
    visitTitle: string;
    visitCopy: string;
    visitNotes: string[];
    mapTitle: string;
    loadMap: string;
  };
  visit: {
    eyebrow: string;
    title: string;
    description: string;
    quickTitle: string;
    quickCopy: string;
    logisticsTitle: string;
    sections: Array<{ id: string; title: string; description: string }>;
    welcomeTitle: string;
    welcomeCopy: string;
    mapTitle: string;
    loadMap: string;
    contactCta: string;
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    greeting: string;
    welcomeTitle: string;
    welcomeParagraphs: string[];
    missionTitle: string;
    missionStatements: string[];
    denominationalTitle: string;
    denominationalParagraphs: string[];
    denominationalLink: {
      label: string;
      href: string;
    };
    heritageTitle: string;
    heritageIntro: string;
    heritageImages: AboutHeritageImage[];
    disciplesTitle: string;
    disciplesIntro: string;
    disciplesPractices: Array<{ title: string; description: string }>;
    nextStepsTitle: string;
    nextSteps: AboutLinkCard[];
    ctaTitle: string;
    ctaCopy: string;
    cta: string;
  };
  membership: {
    eyebrow: string;
    title: string;
    description: string;
    introTitle: string;
    introParagraphs: string[];
    sections: Array<{ title: string; paragraphs: string[] }>;
    ctaTitle: string;
    ctaCopy: string;
    cta: string;
  };
  reading: {
    eyebrow: string;
    title: string;
    description: string;
    byLabel: string;
    categories: ReadingCategory[];
    closingNote: string;
  };
  community: {
    eyebrow: string;
    title: string;
    description: string;
    cards: Array<{
      id: string;
      title: string;
      description: string;
      routeId?: RouteId;
      href?: string;
    }>;
    invitationTitle: string;
    invitationCopy: string;
    invitationCta: string;
  };
  ministries: LocalizedMinistryContent;
  theater: {
    eyebrow: string;
    titleLead: string;
    titleEmphasis: string;
    lead: string;
    follow: string;
    discover: string;
    storyEyebrow: string;
    storyTitle: string;
    introduction: string[];
    values: Array<{ title: string; description: string }>;
    galleryEyebrow: string;
    galleryTitle: string;
    mission: string;
    imageAlts: Record<string, string>;
    founderBadge: string;
    founderBio: string[];
    updatesEyebrow: string;
    updatesTitle: string;
    updatesCopy: string;
    updateBadges: string[];
    updatesCta: string;
  };
  updates: {
    eyebrow: string;
    title: string;
    description: string;
    alertTitle: string;
    alertCopy: string;
    facebookTitle: string;
    facebookCopy: string;
    facebookLanguageNote: string;
    privacyNote: string;
    loadFacebook: string;
    openFacebook: string;
    blogTitle: string;
    blogCopy: string;
    readPost: string;
    noPosts: string;
    fallbackTitle: string;
    fallbackCopy: string;
  };
  staff: {
    eyebrow: string;
    title: string;
    description: string;
    groupImageAlts: string[];
    detailsLabel: string;
    connectionsTitle: (name: string) => string;
    members: Record<StaffId, LocalizedStaff>;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    detailLabels: Record<ContactMethodId, string>;
    detailHelpers: Record<ContactMethodId, string>;
    detailActions: Record<ContactMethodId, string>;
    visitBadge: string;
    visitTitle: string;
    visitCopy: string;
    childrenNote: string;
    mapTitle: string;
    loadMap: string;
    form: {
      badge: string;
      title: string;
      description: string;
      name: string;
      email: string;
      phone: string;
      optional: string;
      topic: string;
      topics: string[];
      message: string;
      send: string;
      sending: string;
      deliveryPrefix: string;
      deliverySuffix: string;
      validationSummary: string;
      nameRequired: string;
      emailRequired: string;
      emailInvalid: string;
      messageRequired: string;
      successTitle: string;
      successMessage: string;
      errorTitle: string;
      genericError: string;
    };
  };
  privacy: {
    eyebrow: string;
    title: string;
    description: string;
    sections: Array<{ title: string; paragraphs: string[] }>;
    preferencesTitle: string;
    preferencesCopy: string;
    acceptAnalytics: string;
    declineAnalytics: string;
    currentAccepted: string;
    currentDeclined: string;
    currentUnset: string;
    embedPreferencesTitle: string;
    embedPreferencesCopy: string;
    embedProviderLabels: Record<EmbedProviderId, string>;
    clearEmbedPreference: string;
    clearAllEmbedPreferences: string;
    noEmbedPreferences: string;
  };
  consent: {
    title: string;
    description: string;
    accept: string;
    decline: string;
    privacyLink: string;
  };
  notFound: {
    title: string;
    description: string;
    action: string;
  };
};

const en: LocalizedContent = {
  common: {
    denomination: 'Disciples of Christ',
    churchName: 'First Christian Church Anniston',
    shortName: 'FCC Anniston',
    skipToContent: 'Skip to main content',
    navigationLabel: 'Main navigation',
    openNavigation: 'Open navigation',
    closeNavigation: 'Close navigation',
    loadingPage: 'Loading page',
    pauseTextAnimation: 'Pause text animation',
    resumeTextAnimation: 'Resume text animation',
    navigation: {
      home: 'Home',
      visit: 'Visit',
      about: 'About',
      membership: 'Membership and Baptism',
      recommendedReading: 'Recommended Reading',
      staff: 'Staff',
      community: 'Church Life',
      worshipAndMusic: 'Sunday Worship',
      wonderAndWorship: 'Children’s Ministry',
      hispanicMinistry: 'Hispanic Ministry',
      serviceAndOutreach: 'Service and Outreach',
      diversityTheater: 'Diversity Theater',
      updates: 'Updates',
      members: 'Members',
      memberProfile: 'Profile',
      memberDirectory: 'Member Directory',
      memberGroups: 'Groups',
      memberCalendar: 'Calendar',
      memberUpdates: 'Member Updates',
      memberAdmin: 'Portal Admin',
      memberGivingStatements: 'Giving Statements',
      contact: 'Contact',
      privacy: 'Privacy',
    },
    languageName: 'Español',
    switchLanguage: 'Ver el sitio en español',
    give: 'Give Online',
    directions: 'Get directions',
    contact: 'Contact us',
    learnMore: 'Learn more',
    opensNewTab: 'opens in a new tab',
    embedConnectionNote: (provider) =>
      `Loading connects your browser to ${provider}. This browser will remember that choice for ${provider}.`,
    serviceLabels: {
      sundaySchool: 'Sunday School',
      worship: 'Worship Service',
    },
    footerSummary:
      'An open and affirming Disciples of Christ congregation serving Anniston through worship, welcome, and community life.',
    footerExplore: 'Explore',
    footerOnline: 'Online',
    footerConnect: 'Connect',
    social: {
      facebookTitle: 'Facebook',
      facebookDescription: 'Follow church news, photos, events, and community updates.',
      facebookCta: 'Follow on Facebook',
      linktreeTitle: 'FCC Anniston Links',
      linktreeDescription: 'Find giving, sermons, resources, and current church links.',
      linktreeCta: 'Explore our Linktree',
    },
    serviceAlert: {
      enabled: false,
      title: 'Schedule update',
      message: 'Sunday services are following the regular schedule.',
    },
  },
  home: {
    heroEyebrow: 'Disciples of Christ',
    heroSentences: [
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
        color: '#8fa8ff',
      },
    ],
    heroDescription:
      'Come as you are. There is a place for you at First Christian Church Anniston.',
    serviceFactLabel: 'Worship Sundays at 11:30 AM',
    locationFactLabel: '1327 Leighton Ave., Anniston',
    primaryAction: 'Plan your visit',
    secondaryAction: 'Get directions',
    welcomeEyebrow: 'Welcome',
    welcomeTitle: 'All are welcome',
    welcomeParagraphs: [
      'Whether you are exploring faith, returning to church, or looking for a community where you can belong, you are welcome here.',
      'Our worship makes room for celebration, reflection, questions, communion, and connection. Children are welcomed as part of the worshiping community.',
    ],
    welcomeCta: 'What to expect on Sunday',
    churchImageAlt:
      'Stone exterior of First Christian Church Anniston framed by a large tree at sunset',
    churchImageLabel: 'First Christian Church Anniston',
    churchImageCaption: 'A welcoming spiritual home in Anniston, Alabama.',
    sermonsEyebrow: 'Listen online',
    sermonsTitle: 'Uplifting sermons by Pastor Laura Hutchinson',
    sermonsDescription:
      'Listen through Spotify when you are ready. The player only connects to Spotify after you choose to load it.',
    loadSermons: 'Load Spotify sermons',
    givingTitle: 'Partner with us financially',
    givingCopy:
      'Your support helps sustain worship, hospitality, community events, local outreach, and a spiritual home where all are welcome.',
    galleryEyebrow: 'Life at FCC Anniston',
    galleryTitle: 'See yourself here',
    galleryHint: 'Swipe or drag to explore',
    previousPhotos: 'Previous photos',
    nextPhotos: 'Next photos',
    photoStatus: (first, last, total) =>
      first === last ? `Photo ${first} of ${total}` : `Photos ${first}–${last} of ${total}`,
    galleryLabel: 'Life at First Christian Church photo gallery',
    photos: {
      'childrens-moment': {
        title: 'Children’s Moment',
        caption:
          'Children are welcomed into worship through stories, questions, and participation.',
        alt: 'A church leader sharing a children’s moment with two children in the sanctuary',
      },
      'communion-table': {
        title: 'The Communion Table',
        caption: 'The table is prepared as a sign of welcome, remembrance, and shared faith.',
        alt: 'A communion table arranged with breads, cups, candles, and serving vessels',
      },
      'sanctuary-cross': {
        title: 'Centered in Christ',
        caption: 'Our worship points toward the life, love, and way of Christ.',
        alt: 'A brass processional cross with the sanctuary cross and stained glass behind it',
      },
      staff: {
        title: 'Church Staff',
        caption: 'The people who serve and lead First Christian Church Anniston.',
        alt: 'Five First Christian Church staff members laughing together',
      },
      'stained-glass': {
        title: 'Sanctuary Stained Glass',
        caption: 'Historic stained glass fills the sanctuary with color and warm light.',
        alt: 'Tall stained-glass windows glowing above the chancel',
      },
      tapestry: {
        title: 'A Story in Tapestry',
        caption: 'A handmade tapestry preserves pieces of the congregation’s story.',
        alt: 'A handmade tapestry illustrating the history and symbols of the church',
      },
      'welcome-area': {
        title: 'A Place of Welcome',
        caption: 'Our welcome area reflects a congregation committed to hospitality and belonging.',
        alt: 'The church welcome area with visitor materials, artwork, and rainbow flags',
      },
    },
    connectEyebrow: 'Stay connected',
    connectTitle: 'Keep up with life at FCC Anniston',
    connectCopy: 'Find announcements, photos, sermons, giving, and helpful links between Sundays.',
    visitEyebrow: 'Find us',
    visitTitle: 'Your first Sunday can feel simple',
    visitCopy:
      'Start with the essentials, then visit our planning guide for details and personal help.',
    visitNotes: [
      'Sunday School begins at 10:30 AM.',
      'Worship begins at 11:30 AM.',
      'Children are welcome in worship, and nursery care may be available for infants and young children.',
    ],
    mapTitle: 'Map showing First Christian Church Anniston',
    loadMap: 'Load Google Map',
  },
  visit: {
    eyebrow: 'Plan your Sunday',
    title: 'Know what to expect before you arrive',
    description:
      'A first visit should not require guesswork. Here are the essentials, along with direct help if you have a question about your needs.',
    quickTitle: 'Sunday at a glance',
    quickCopy:
      'Sunday School begins at 10:30 AM and worship begins at 11:30 AM at 1327 Leighton Avenue.',
    logisticsTitle: 'Your visit, step by step',
    sections: [
      {
        id: 'arrival',
        title: 'Parking and entrances',
        description:
          'Contact the church for the best parking and entrance guidance for your needs. We are glad to arrange for someone to meet you when you arrive.',
      },
      {
        id: 'accessibility',
        title: 'Accessibility',
        description:
          'If mobility, seating, hearing, sensory, or other accommodations would help, call or message us before Sunday so we can plan with you.',
      },
      {
        id: 'dress',
        title: 'What to wear',
        description:
          'There is no dress code. Wear what helps you feel comfortable and able to participate.',
      },
      {
        id: 'worship',
        title: 'Worship and timing',
        description:
          'Worship includes prayer, music, scripture, preaching, and communion. Service length can vary; contact us if your schedule requires a more precise estimate.',
      },
      {
        id: 'communion',
        title: 'Communion',
        description:
          'Communion is central to our weekly worship and reflects Christ’s welcome at the table.',
      },
      {
        id: 'children',
        title: 'Children and families',
        description:
          'Families are welcome. Children may remain in worship, and families with infants and young children may use the nursery when available.',
      },
    ],
    welcomeTitle: 'Would a personal welcome help?',
    welcomeCopy:
      'Send a short note before Sunday and tell us what would make your visit easier. A church leader can follow up directly.',
    mapTitle: 'Map and directions to First Christian Church Anniston',
    loadMap: 'Load Google Map',
    contactCta: 'Ask about your visit',
  },
  about: {
    eyebrow: 'Who we are',
    title: 'Welcome to First Christian Church, Anniston',
    description:
      'An Open and Affirming Disciples of Christ congregation where people can worship, serve, grow, ask honest questions, and come to Christ’s table together.',
    greeting: 'Bienvenido a First Christian Church, Anniston.',
    welcomeTitle: 'You are welcome here',
    welcomeParagraphs: [
      'First Christian Church, Anniston is an Open and Affirming congregation rooted in the Christian Church (Disciples of Christ). We seek to be a welcoming, spiritually vibrant church where people can worship, serve, grow, ask honest questions, and come to Christ’s table together.',
      'As part of the Disciples tradition, we believe in unity without requiring uniformity. People come to this church from different backgrounds, cultures, life experiences, and points of view. We do not expect everyone to think exactly alike. Instead, we try to practice the kind of Christian community where people can belong, disagree with grace, serve together, and continue growing in faith.',
      'We are committed to reconciliation, anti-racism, inclusion, and the work of God’s love in the world. We believe faith should shape how we treat one another, how we welcome our neighbors, and how we respond to the needs of our community.',
      'More than anything, we want you to know that you are welcome here. You do not have to have everything figured out before you walk through the door. You are welcome in your joy, your questions, your doubts, your gifts, your struggles, your faith, and your whole humanity.',
    ],
    missionTitle: 'Our mission',
    missionStatements: [
      'We, the members of First Christian Church, commit to being a welcoming, open, affirming, and spiritually vibrant congregation.',
      'We seek to deepen our relationship with Christ and with one another through worship, prayer, study, stewardship, and fellowship.',
      'We seek to serve all of God’s people in Jesus’ name.',
      'We seek out all who may be transformed by the joy of life in Christ.',
    ],
    denominationalTitle: 'Our denominational home',
    denominationalParagraphs: [
      'First Christian Church is part of the Christian Church (Disciples of Christ), a movement that describes itself as “a movement for wholeness in a fragmented world.”',
      'The Disciples tradition grew out of a desire for Christian unity. In the early 1800s, leaders such as Barton W. Stone, Thomas Campbell, and Alexander Campbell challenged the divisions that kept Christians separated from one another, especially at the Lord’s Table. Their movements eventually came together in 1832 and helped form what became the Christian Church (Disciples of Christ).',
      'That history still shapes us today. We believe Christ’s table is larger than any one denomination, background, or human boundary. We seek to be a church where unity is practiced through welcome, shared worship, honest study, and service to the world.',
    ],
    denominationalLink: {
      label: 'Learn more from the Christian Church (Disciples of Christ)',
      href: 'https://disciples.org/our-identity/',
    },
    heritageTitle: 'A story carried through people',
    heritageIntro:
      'Our congregation’s story belongs to a larger stream of Disciples history and to the people in Anniston who gathered, worshiped, served, and passed the faith forward.',
    heritageImages: [
      {
        src: '/images/about/nineteenth-century-religious-reformers.jpg',
        alt: 'Historic print of nineteenth-century religious reformers including Thomas Campbell, Barton W. Stone, Walter Scott, and Alexander Campbell',
        title: 'Roots in the Stone-Campbell movement',
        caption:
          'The Christian Church (Disciples of Christ) grew from reform movements that emphasized Christian unity, scripture, and an open Lord’s Table.',
        width: 1560,
        height: 1817,
        ratio: 1560 / 1817,
        sizes: '(min-width: 62em) 38vw, 100vw',
      },
      {
        src: '/images/about/fcc-anniston-origins.jpg',
        alt: 'Historic photograph of an early First Christian Church Anniston congregation gathered outside a stone church building',
        title: 'An early FCC Anniston congregation',
        caption:
          'One of the original First Christian Church Anniston congregations gathered outside the church, a reminder that this community has always been formed by people.',
        width: 958,
        height: 340,
        ratio: 958 / 340,
        sizes: '(min-width: 62em) 54vw, 100vw',
      },
    ],
    disciplesTitle: 'What it means to be Disciples of Christ',
    disciplesIntro:
      'As Disciples of Christ, we welcome all to the Lord’s Table as God has welcomed us.',
    disciplesPractices: [
      {
        title: 'We gather around the Lord’s Table.',
        description:
          'Communion is central to our worship. We celebrate the Lord’s Supper every Sunday because we understand it as a sign of Christ’s welcome, grace, and unity.',
      },
      {
        title: 'We practice unity without requiring uniformity.',
        description:
          'We do not believe everyone has to agree on every question in order to worship, serve, or belong together. We seek to remain in covenant with one another even when we see some things differently.',
      },
      {
        title: 'We study scripture thoughtfully.',
        description:
          'We encourage people to read, question, study, and listen for God through scripture. Rather than relying on rigid tests of faith, we seek to understand scripture with care, humility, historical context, and openness to the Spirit.',
      },
      {
        title: 'We honor the priesthood of all believers.',
        description:
          'Every person has gifts to offer. Ministry does not belong only to clergy or church leaders. Each person is called to participate in the life and work of the church.',
      },
      {
        title: 'We work with others for healing and justice.',
        description:
          'The Disciples tradition has a strong commitment to cooperation with other Christians and people of faith. We seek to join in God’s work of wholeness through service, compassion, reconciliation, and justice.',
      },
    ],
    nextStepsTitle: 'Explore faith and belonging',
    nextSteps: [
      {
        title: 'Membership and baptism',
        description:
          'Learn what membership means, how baptism is practiced, and how to participate more fully in the life of the church.',
        routeId: 'membership',
      },
      {
        title: 'Recommended reading',
        description:
          'Find books for reflection, spiritual growth, justice, pastoral care, and the Christian Church (Disciples of Christ).',
        routeId: 'recommendedReading',
      },
    ],
    ctaTitle: 'The best way to understand us is to visit',
    ctaCopy:
      'Join us for worship, share communion, meet the people of the congregation, and bring your questions.',
    cta: 'Plan your visit',
  },
  membership: {
    eyebrow: 'Belonging and next steps',
    title: 'Membership and Baptism',
    description:
      'Membership is a way of saying, “This is my church community, and I want to share in its life, worship, service, and care.”',
    introTitle: 'Becoming part of the congregation',
    introParagraphs: [
      'Membership at First Christian Church, Anniston is a way of saying, “This is my church community, and I want to share in its life, worship, service, and care.”',
      'As part of the Christian Church (Disciples of Christ), we welcome people into membership through a confession of faith in Jesus Christ. For some, that may be a first public confession of faith. For others, it may be a reaffirmation of faith or a transfer of membership from another congregation.',
      'If you are interested in becoming a member, you are welcome to speak with the pastor. Some people choose to come forward during worship, while others prefer a quieter conversation first. We are glad to help you take the next step in a way that feels clear and meaningful.',
    ],
    sections: [
      {
        title: 'Baptism',
        paragraphs: [
          'In the Disciples tradition, baptism is an important sign of faith, belonging, and new life in Christ. First Christian Church practices baptism by immersion, while also honoring the baptisms of other Christian traditions.',
          'If you have already been baptized in another church or denomination, you do not need to be baptized again in order to become part of this congregation.',
          'If you have questions about baptism, membership, or what it means to follow Christ, we welcome those conversations.',
        ],
      },
      {
        title: 'Participating in the life of the church',
        paragraphs: [
          'The Christian journey is not meant to be traveled alone. Members are encouraged to worship regularly, grow spiritually, support the ministry of the congregation, serve others, and share in the care of the church community.',
          'Membership also allows a person to vote in congregational meetings and serve in leadership roles within the church.',
          'For students, seasonal residents, or others who remain connected to another home congregation, associate membership may also be available. This allows someone to participate fully in the life of First Christian Church while keeping membership in another church.',
        ],
      },
    ],
    ctaTitle: 'Ask about membership, baptism, or getting involved',
    ctaCopy:
      'To learn more about membership, baptism, or becoming more involved, please contact the church.',
    cta: 'Contact the church',
  },
  reading: {
    eyebrow: 'Study and reflection',
    title: 'Recommended Reading',
    description:
      'Books that may help people explore Christian faith, spiritual growth, justice, pastoral care, and the Christian Church (Disciples of Christ).',
    byLabel: 'by',
    categories: [
      {
        title: 'Spiritual Growth',
        books: [
          { title: 'An Altar in the World', author: 'Barbara Brown Taylor' },
          {
            title:
              'Half Truths: God Helps Those Who Help Themselves and Other Things the Bible Doesn’t Say',
            author: 'Adam Hamilton',
          },
          { title: 'The Sin of Certainty', author: 'Peter Enns' },
          { title: 'Sabbath as Resistance', author: 'Walter Brueggemann' },
          { title: 'Amazing Grace: A Vocabulary of Faith', author: 'Kathleen Norris' },
        ],
      },
      {
        title: 'Faith, Welcome, and Inclusion',
        books: [
          {
            title: 'Torn: Rescuing the Gospel from the Gays-vs.-Christians Debate',
            author: 'Justin Lee',
          },
          {
            title: 'What the Bible Really Says About Homosexuality',
            author: 'Daniel A. Helminiak',
          },
          { title: 'Transitions of the Heart', author: 'Rachel Pepper' },
        ],
      },
      {
        title: 'Justice and Social Awareness',
        books: [
          { title: 'Fear of the Other', author: 'William H. Willimon' },
          { title: 'The Black Friend', author: 'Frederick Joseph' },
          { title: 'Post Traumatic Slave Syndrome', author: 'Joy DeGruy' },
          { title: 'Love Over Fear', author: 'Dan White Jr.' },
        ],
      },
      {
        title: 'The Christian Church (Disciples of Christ)',
        books: [
          { title: 'The Stone-Campbell Movement', author: 'Leroy Garrett' },
          { title: 'The Disciples: A Struggle for Reformation', author: 'D. Duane Cummins' },
          { title: 'Freedom in Covenant', author: 'Robert D. Cornwall' },
        ],
      },
    ],
    closingNote:
      'This list is not a required reading list or a formal statement of belief. It is offered as a starting place for reflection, learning, and conversation.',
  },
  community: {
    eyebrow: 'Church life',
    title: 'Faith takes shape in community',
    description:
      'Worship is central to our life, and the welcome continues through children’s ministry, music, Hispanic ministry, the arts, and service.',
    cards: [
      {
        id: 'worship',
        title: 'Sunday worship',
        description:
          'Gather for liturgy, prayer, scripture, preaching, communion, music, and a regular Spanish presence in worship.',
        routeId: 'worshipAndMusic',
      },
      {
        id: 'children',
        title: 'Children’s ministry',
        description:
          'Children are welcomed as full members of the worshiping community, with flexibility and care for each family’s needs.',
        routeId: 'wonderAndWorship',
      },
      {
        id: 'hispanic',
        title: 'Hispanic ministry',
        description:
          'Rev. Maria Zamarripa offers spiritual care and ministry with Spanish-speaking individuals and families.',
        routeId: 'hispanicMinistry',
      },
      {
        id: 'theater',
        title: 'Diversity Theater Company',
        description:
          'Storytelling, LGBTQ inclusion, and Christian hospitality come together on the church stage.',
        routeId: 'diversityTheater',
      },
      {
        id: 'outreach',
        title: 'Service and outreach',
        description:
          'Financial gifts and volunteer participation help sustain community events and local care.',
        routeId: 'serviceAndOutreach',
      },
      {
        id: 'updates',
        title: 'Current announcements',
        description:
          'See recent church posts, schedule updates, event information, and community photos.',
        routeId: 'updates',
      },
    ],
    invitationTitle: 'You do not have to find your place alone',
    invitationCopy:
      'Tell us what you are looking for and someone from the church will help you take a practical next step.',
    invitationCta: 'Start a conversation',
  },
  ministries: localizedMinistryContent.en,
  theater: {
    eyebrow: 'First Christian Church presents',
    titleLead: 'Diversity',
    titleEmphasis: 'Theater Company',
    lead: 'Stories that make room for every voice and reveal Christ-like love in action.',
    follow: 'Follow on Facebook',
    discover: 'Discover our story',
    storyEyebrow: 'Storytelling with purpose',
    storyTitle: 'A stage where belonging takes center place',
    introduction: [
      'First Christian Church sponsors and hosts Diversity Theater Company productions that reflect the lived experiences of LGBTQ people.',
      'The plays and musicals explore prejudice, misunderstanding, joy, relationships, and faith with humor, poignancy, and Christian compassion.',
      'Each production is an opportunity to practice hospitality and strengthen connections across the wider community.',
    ],
    values: [
      {
        title: 'Honest stories',
        description: 'Productions reflect LGBTQ lives with humor, poignancy, and humanity.',
      },
      {
        title: 'Open hospitality',
        description:
          'Every production welcomes people who have not always felt embraced by church.',
      },
      {
        title: 'Stronger community',
        description:
          'Shared stories create space for unity, compassion, conversation, and understanding.',
      },
    ],
    galleryEyebrow: 'On stage',
    galleryTitle: 'Theater brings us together',
    mission:
      'Through shared stories, Diversity Theater Company fosters unity, compassion, and understanding.',
    imageAlts: {
      'full-cast':
        'The cast of a Diversity Theater Company western production posing together on stage',
      'ensemble-scene':
        'Three actors in period costumes performing together on the Diversity Theater stage',
      'saloon-scene':
        'Actors performing a black-and-white saloon scene in a western stage production',
      'table-scene':
        'Two actors seated at a saloon table while another performer stands behind them',
      'dramatic-scene': 'Two actors sharing a serious moment during a stage performance',
      'maury-portrait': 'Maury Evans seated inside First Christian Church',
      'maury-directing':
        'Maury Evans speaking on the Diversity Theater stage while holding a script',
    },
    founderBadge: 'Meet the Founder and Director',
    founderBio: [
      'Maury Evans brings professional theater experience and a long history of forming community theater companies across the United States.',
      'Before joining First Christian Church, he directed and produced numerous shows through Metropolitan Community Church in Albuquerque. His artistry now helps create meaningful connections in Anniston.',
    ],
    updatesEyebrow: 'The next act',
    updatesTitle: 'Stay tuned for what is coming',
    updatesCopy:
      'Production announcements, auditions, show dates, and ticket information are shared through the company’s public Facebook page.',
    updateBadges: ['Productions', 'Auditions and dates', 'Tickets'],
    updatesCta: 'Get theater updates',
  },
  updates: {
    eyebrow: 'Current information',
    title: 'Church news and announcements',
    description:
      'Facebook remains the church’s source for timely posts. You can choose whether to load the public timeline here or open it directly.',
    alertTitle: 'Essential schedule updates',
    alertCopy:
      'Any cancellation or important change to Sunday worship will also appear here in both English and Spanish.',
    facebookTitle: 'Public Facebook timeline',
    facebookCopy:
      'The timeline can include announcements, photos, events, and links published by First Christian Church Anniston.',
    facebookLanguageNote:
      'Facebook posts appear in the language in which they were originally published.',
    privacyNote:
      'Loading the timeline connects your browser to Meta. It remains blocked until you choose to load it.',
    loadFacebook: 'Load Facebook updates',
    openFacebook: 'Open Facebook directly',
    blogTitle: 'Latest church posts',
    blogCopy:
      'These first-party updates are published by the church and remain available without loading Facebook.',
    readPost: 'Read update',
    noPosts: 'No first-party updates have been published yet.',
    fallbackTitle: 'Prefer not to load Facebook?',
    fallbackCopy:
      'Use the direct link, call the church office, or send a message for current information.',
  },
  staff: {
    eyebrow: 'People who serve',
    title: 'Meet the staff',
    description:
      'Meet the ministers, musicians, and staff members who shape worship, offer care, and help people feel at home.',
    groupImageAlts: [
      'The First Christian Church staff standing together',
      'The First Christian Church staff sharing a playful moment',
    ],
    detailsLabel: 'Read full biography',
    connectionsTitle: (name) => `Connect with ${name}`,
    members: {
      'laura-hutchinson': {
        role: 'Senior Minister',
        summary:
          'Rev. Laura Hutchinson has served First Christian Church Anniston since 2012, leading with a focus on God’s fierce and unconditional love.',
        biography: [
          'After graduating with an MDiv from Candler School of Theology in Atlanta, GA, Reverend Laura Hutchinson was ordained in the Christian Church (Disciples of Christ) in Georgia on August 5, 2001. She has served in various capacities throughout her ministry, including youth ministry at several churches, college chaplaincy and adjunct professorship in the Religion Department at Barton College in Wilson, NC, associate ministry at First Christian Church (Disciples of Christ) in Florence, AL, and senior pastorship here at First Christian Church (Disciples of Christ) in Anniston, AL. She has been serving FCC in Anniston since 2012.',
          'Her primary focus as a pastor is to love people the way God loves them. Many in this world do not know they are loved, and that reality drives her passion for ministry. God’s fierce and unconditional love is at the heart of her preaching and pastoral care. Laura feels blessed to pastor a church that actively encourages reaching out to and welcoming all people, sharing the gospel message alongside her.',
          'Laura shares the light of Christ through preaching, interactive Bible study sessions where questions and thoughtful challenges to tradition are welcomed, pastoral care and counseling, community involvement, anti-racism and pro-reconciliation work through the Christian Church in Alabama & Northwest Florida, open and affirming ministries within the LGBTQ+ community, and co-hosting her podcast, “Untangling Faith,” with colleague Rev. Tammy Jackson of Anniston, AL.',
          'Rev. Hutchinson is deeply grateful for her calling to ministry in the name of Jesus Christ and warmly invites all to join her in this meaningful journey at First Christian Church (Disciples of Christ) in Anniston, AL.',
        ],
        focusAreas: ['Preaching', 'Pastoral care', 'Reconciliation', 'Open and affirming ministry'],
        imageAlt: 'Portrait of Rev. Laura Hutchinson',
        connections: [
          {
            id: 'instagram',
            label: 'Instagram',
            description: 'Follow Laura’s updates and reflections.',
            href: 'https://www.instagram.com/hutchinsonlaura/',
          },
          {
            id: 'book',
            label: 'Finding Jesus',
            description: 'Read Laura’s book, Finding Jesus: In a Christian Nation.',
            href: 'https://www.amazon.com/Finding-Jesus-Rev-Laura-Hutchinson/dp/B0G64NCBBH',
          },
          {
            id: 'newspaper',
            label: 'Anniston Star column',
            description: 'Read a recent Voices of Faith contribution.',
            href: 'https://www.annistonstar.com/features/faith/religion_roundtable/voices-of-faith-advice-for-21-year-old-me/article_f089c79b-e298-4222-a81d-de7079bfafe1.html',
          },
          {
            id: 'podcast',
            label: 'Untangling Faith podcast',
            description: 'Listen to Laura and Rev. Tammy Jackson on Spotify.',
            href: 'https://open.spotify.com/show/12RFx6M0ro8dj1r0q2j2ty',
          },
        ],
      },
      'maria-zamarripa': {
        role: 'Associate Minister for Hispanic Ministries',
        summary:
          'Rev. Maria Zamarripa serves Spanish-speaking individuals and families with spiritual guidance, compassion, and deep roots in the congregation.',
        biography: [
          'Rev. Maria Zamarripa has been an official member of First Christian Church since the early 1980s, following her affirmation of commitment to Christ. Throughout her long-standing relationship with the congregation, Maria has diligently served in nearly every leadership role the church offers.',
          'Recognizing a profound call to ministry, Maria formally responded by enrolling at Lexington Theological Seminary in 2016. She was ordained by the Christian Church in Alabama & Northwest Florida in 2020. Maria’s heart has always been with the growing Latin community in Calhoun County, where she faithfully ministers, serving as a spiritual guide and compassionate presence. She also extends her ministry as a chaplain at RMC Hospital and the County Jail.',
          'Today, in her role as Associate Minister for Hispanic Ministries, Rev. Zamarripa dedicates her ministry to serving Spanish-speaking individuals and families. Her steadfast commitment to God’s call is reflected daily through acts of love, compassion, and spiritual support.',
        ],
        focusAreas: ['Hispanic ministry', 'Chaplaincy', 'Spiritual care'],
        imageAlt: 'Portrait of Rev. Maria Zamarripa',
      },
      'gerald-roberts': {
        role: 'Organist, Pianist, Choral Director, and Musical Coordinator',
        summary:
          'Gerald Roberts has served the church through organ, piano, choir, and worship music since 1987.',
        biography: [
          'Gerald Roberts has had the honor and privilege of serving First Christian Church since August 1987 as organist, pianist, choral director, and musical coordinator. Gerald views music as a profound and sacred means of expressing faith, fostering community, and enhancing worship.',
          'His commitment to lifelong learning is evident in his continuous pursuit of new insights, both musical and spiritual, guided by the Holy Spirit. Gerald finds joy in activities that nurture his physical and spiritual health, including exercise classes, cycling, attending courses, exploring the outdoors, and traveling.',
          'Gerald remains dedicated to enriching worship experiences and contributing to the vibrant community at First Christian Church through his passion for music and faith-driven service.',
        ],
        focusAreas: ['Organ and piano', 'Choir', 'Worship music'],
        imageAlt: 'Portrait of Gerald Roberts',
      },
      'judy-engelhart': {
        role: 'Church Secretary',
        summary:
          'Judy Engelhart brings decades of church administration, education, and community experience to the church office.',
        biography: [
          'Judy Engelhart has faithfully served as the secretary of First Christian Church in Anniston for over 20 years. Prior to her tenure at FCC, she was a church secretary in a small Florida town, bringing significant administrative expertise to her role.',
          'Before joining First Christian Church, Judy had an impactful career as an educational counselor and test administrator at Gadsden State Community College. Additionally, she served as an educational counselor and later as Director of the Army Education Center at Fort McClellan until its closure in 1999.',
          'A lifelong resident of Calhoun County, Judy grew up in Saks and attended Saks School for 12 years. She pursued higher education at Jacksonville State University and later completed master’s degrees from both Georgia State University in Atlanta and Troy State University.',
          'Her life experiences include living in Okinawa for 1.5 years and a spiritually enriching visit to the Holy Land, where she walked in the footsteps of Jesus. Judy deeply loves her role at First Christian Church and values the supportive and caring community around her.',
        ],
        focusAreas: ['Church administration', 'Communication', 'Congregational support'],
        imageAlt: 'Portrait of Judy Engelhart',
      },
      'jason-wright': {
        role: 'Worship Leader',
        summary:
          'Jason Wright leads the congregation in joyful song and brings musical, theatrical, and visual creativity to church life.',
        biography: [
          'Jason Wright serves First Christian Church as our Worship Leader, guiding our congregation in vibrant song and joyful praise. He shares his musical leadership and creative talents with another local church, demonstrating his deep commitment to serving God through music and worship.',
          'Jason’s passion extends beyond worship leadership; he actively teaches and coaches children in drama, frequently directing theatrical productions in Jacksonville. As a man of many talents, he is not only a gifted musician but also a skilled visual artist whose creativity enriches our community.',
          'Jason’s presence is always uplifting and inviting, making worship experiences warm and meaningful. He is thrilled to welcome everyone to join him in celebrating faith and fellowship at First Christian Church.',
        ],
        focusAreas: ['Worship leadership', 'Music', 'Drama', 'Visual arts'],
        imageAlt: 'Portrait of Jason Wright',
      },
    },
  },
  contact: {
    eyebrow: 'Anniston, Alabama',
    title: 'We would love to hear from you',
    description:
      'Whether you are planning your first Sunday, seeking a church home, or asking for prayer, there is a place for your message here.',
    detailLabels: {
      location: 'Location',
      email: 'Email',
      phone: 'Phone',
    },
    detailHelpers: {
      location: 'Get turn-by-turn directions to the church.',
      email: 'Send a message any time.',
      phone: 'Call the church office.',
    },
    detailActions: {
      location: 'Get directions',
      email: 'Email the church',
      phone: 'Call now',
    },
    visitBadge: 'Plan your Sunday',
    visitTitle: 'Come worship with us',
    visitCopy:
      'You do not need to dress a certain way or know every detail in advance. Come as you are and know that you are welcome at the table.',
    childrenNote: 'Children are welcome in worship, and nursery care may be available.',
    mapTitle: 'Map showing First Christian Church at 1327 Leighton Avenue in Anniston',
    loadMap: 'Load Google Map',
    form: {
      badge: 'Start a conversation',
      title: 'Send us a message',
      description:
        'Have a question, prayer request, or note before your first visit? Send it here and someone from the church will follow up.',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      optional: 'Optional',
      topic: 'How can we help?',
      topics: [
        'Planning a visit',
        'Prayer request',
        'Church ministries',
        'Community events',
        'Giving',
        'Something else',
      ],
      message: 'Message',
      send: 'Send message',
      sending: 'Sending message',
      deliveryPrefix: 'Your message will be delivered to',
      deliverySuffix: 'We will only use your contact details to respond.',
      validationSummary: 'Please review the highlighted fields.',
      nameRequired: 'Please share your name.',
      emailRequired: 'Please share an email address.',
      emailInvalid: 'Please enter a valid email address.',
      messageRequired: 'Please add a message before sending.',
      successTitle: 'Message sent',
      successMessage: 'Thanks for reaching out. Your message has been sent.',
      errorTitle: 'Unable to send',
      genericError:
        'Unable to send your message right now. Please email or call the church instead.',
    },
  },
  privacy: {
    eyebrow: 'Your privacy',
    title: 'Clear choices about outside services',
    description:
      'The website uses only the services needed to communicate, measure basic site use, display optional media, and connect people with the church.',
    sections: [
      {
        title: 'Analytics',
        paragraphs: [
          'Google Analytics runs in advanced consent mode. Until you choose to allow analytics, the Google tag loads with analytics and advertising storage denied and sends only cookieless consent-mode pings.',
          'If you allow analytics, Google Analytics can use analytics cookies to record page visits and broad interactions such as planning a visit, contacting the church, or opening the giving link.',
          'The website does not send contact-form messages, prayer requests, names, email addresses, or phone numbers to analytics.',
        ],
      },
      {
        title: 'Contact form',
        paragraphs: [
          'The contact form uses FormSubmit to deliver your message to the church email inbox. The information you provide is used to read and respond to your message.',
        ],
      },
      {
        title: 'Maps, Spotify, and Facebook',
        paragraphs: [
          'Google Maps, Spotify, and Facebook content are blocked until you choose to load them. Loading an embed connects your browser to that provider, which may receive technical information such as your IP address and browser details.',
          'When you load an embed, this site saves that provider choice in this browser so the same provider can load more smoothly next time. You can clear saved embed choices below.',
        ],
      },
      {
        title: 'Online giving',
        paragraphs: [
          'Giving links open Tithe.ly in a new tab. Donations are processed by Tithe.ly under its own privacy and security practices; this website does not receive payment-card information.',
        ],
      },
      {
        title: 'Member portal',
        paragraphs: [
          'The member portal uses Firebase Authentication for email-link sign-in and Firestore for member access, private profiles, groups, events, announcements, and moderation history.',
          'Directory participation and profile photos are optional. Directory entries contain only the contact fields each approved member chose to share.',
          'Profile photos are cropped and compressed in your browser, stored in a private Cloudflare R2 bucket, and delivered through an authenticated Cloudflare Worker after administrator review. Original full-resolution images are not uploaded.',
          'The portal does not store pastoral care, medical, financial, prayer-request, tax-document, or giving-statement information.',
        ],
      },
      {
        title: 'Questions',
        paragraphs: [
          'Contact the church office if you have a question about this notice or want help using a direct email, phone, map, or giving option.',
        ],
      },
    ],
    preferencesTitle: 'Analytics preference',
    preferencesCopy:
      'You can change whether this browser allows Google Analytics cookies on the church website.',
    acceptAnalytics: 'Allow analytics',
    declineAnalytics: 'Keep analytics cookies off',
    currentAccepted: 'Analytics is currently allowed in this browser.',
    currentDeclined: 'Analytics cookies are currently denied in this browser.',
    currentUnset: 'No analytics cookie choice has been saved in this browser.',
    embedPreferencesTitle: 'Saved embed choices',
    embedPreferencesCopy:
      'These choices are stored only in this browser. Clearing one blocks that provider again until you choose to load it.',
    embedProviderLabels: {
      'google-maps': 'Google Maps',
      spotify: 'Spotify',
      facebook: 'Facebook',
    },
    clearEmbedPreference: 'Clear',
    clearAllEmbedPreferences: 'Clear all embed choices',
    noEmbedPreferences: 'No embed choices have been saved in this browser.',
  },
  consent: {
    title: 'Your privacy choices',
    description:
      'We use Google Analytics consent mode to understand which pages help visitors. Analytics cookies stay off unless you allow them.',
    accept: 'Allow analytics',
    decline: 'Keep analytics cookies off',
    privacyLink: 'Read the privacy notice',
  },
  notFound: {
    title: 'Page not found',
    description: 'The page may have moved, or the address may be incomplete.',
    action: 'Return home',
  },
};

const es: LocalizedContent = {
  common: {
    denomination: 'Discípulos de Cristo',
    churchName: 'Primera Iglesia Cristiana de Anniston',
    shortName: 'FCC Anniston',
    skipToContent: 'Saltar al contenido principal',
    navigationLabel: 'Navegación principal',
    openNavigation: 'Abrir navegación',
    closeNavigation: 'Cerrar navegación',
    loadingPage: 'Cargando página',
    pauseTextAnimation: 'Pausar animación de texto',
    resumeTextAnimation: 'Reanudar animación de texto',
    navigation: {
      home: 'Inicio',
      visit: 'Visita',
      about: 'Acerca',
      membership: 'Membresía y bautismo',
      recommendedReading: 'Lecturas recomendadas',
      staff: 'Personal',
      community: 'Vida de la iglesia',
      worshipAndMusic: 'Adoración dominical',
      wonderAndWorship: 'Ministerio infantil',
      hispanicMinistry: 'Ministerio hispano',
      serviceAndOutreach: 'Servicio comunitario',
      diversityTheater: 'Teatro Diversidad',
      updates: 'Novedades',
      members: 'Miembros',
      memberProfile: 'Perfil',
      memberDirectory: 'Directorio de miembros',
      memberGroups: 'Grupos',
      memberCalendar: 'Calendario',
      memberUpdates: 'Novedades de miembros',
      memberAdmin: 'Administración del portal',
      memberGivingStatements: 'Comprobantes de donaciones',
      contact: 'Contacto',
      privacy: 'Privacidad',
    },
    languageName: 'English',
    switchLanguage: 'View the site in English',
    give: 'Donar en línea',
    directions: 'Cómo llegar',
    contact: 'Contáctenos',
    learnMore: 'Más información',
    opensNewTab: 'se abre en una pestaña nueva',
    embedConnectionNote: (provider) =>
      `Al cargar, su navegador se conecta con ${provider}. Este navegador recordará esa opción para ${provider}.`,
    serviceLabels: {
      sundaySchool: 'Escuela dominical',
      worship: 'Servicio de adoración',
    },
    footerSummary:
      'Una congregación abierta y afirmativa de los Discípulos de Cristo que sirve a Anniston mediante la adoración, la bienvenida y la vida comunitaria.',
    footerExplore: 'Explorar',
    footerOnline: 'En línea',
    footerConnect: 'Conectar',
    social: {
      facebookTitle: 'Facebook',
      facebookDescription: 'Siga noticias, fotos, eventos y novedades de la comunidad.',
      facebookCta: 'Seguir en Facebook',
      linktreeTitle: 'Enlaces de FCC Anniston',
      linktreeDescription: 'Encuentre donaciones, sermones, recursos y enlaces actuales.',
      linktreeCta: 'Explorar Linktree',
    },
    serviceAlert: {
      enabled: false,
      title: 'Actualización del horario',
      message: 'Los servicios dominicales siguen el horario habitual.',
    },
  },
  home: {
    heroEyebrow: 'Discípulos de Cristo',
    heroSentences: [
      {
        id: 'disciples',
        lead: 'Somos ',
        emphasis: 'seguidores de Cristo',
        ending: '.',
        color: '#fab638',
      },
      {
        id: 'affirming',
        lead: 'Somos ',
        emphasis: 'la primera iglesia abierta y afirmativa de Anniston',
        ending: '.',
        color: '#f43e53',
      },
      {
        id: 'service',
        lead: 'Somos ',
        emphasis: 'las manos y los pies de Dios',
        ending: '.',
        color: '#76d65c',
      },
      {
        id: 'compassion',
        lead: 'Somos ',
        emphasis: 'compasivos y atentos',
        ending: '.',
        color: '#8fa8ff',
      },
    ],
    heroDescription:
      'Venga tal como es. Hay un lugar para usted en la Primera Iglesia Cristiana de Anniston.',
    serviceFactLabel: 'Adoración los domingos a las 11:30 AM',
    locationFactLabel: '1327 Leighton Ave., Anniston',
    primaryAction: 'Planifique su visita',
    secondaryAction: 'Cómo llegar',
    welcomeEyebrow: 'Bienvenida',
    welcomeTitle: 'Todas las personas son bienvenidas',
    welcomeParagraphs: [
      'Ya sea que esté explorando la fe, regresando a la iglesia o buscando una comunidad donde pertenecer, aquí es bienvenido.',
      'Nuestra adoración incluye celebración, reflexión, preguntas, comunión y conexión. Los niños son bienvenidos como parte de la comunidad de adoración.',
    ],
    welcomeCta: 'Qué esperar el domingo',
    churchImageAlt:
      'Exterior de piedra de la Primera Iglesia Cristiana de Anniston junto a un árbol al atardecer',
    churchImageLabel: 'Primera Iglesia Cristiana de Anniston',
    churchImageCaption: 'Un hogar espiritual acogedor en Anniston, Alabama.',
    sermonsEyebrow: 'Escuche en línea',
    sermonsTitle: 'Sermones alentadores de la pastora Laura Hutchinson',
    sermonsDescription:
      'Escuche por Spotify cuando lo desee. El reproductor solo se conecta a Spotify después de que usted decida cargarlo.',
    loadSermons: 'Cargar sermones de Spotify',
    givingTitle: 'Apoye nuestra misión',
    givingCopy:
      'Su apoyo ayuda a sostener la adoración, la hospitalidad, los eventos comunitarios, el servicio local y un hogar espiritual donde todas las personas son bienvenidas.',
    galleryEyebrow: 'La vida en FCC Anniston',
    galleryTitle: 'Imagínese aquí',
    galleryHint: 'Deslice o arrastre para explorar',
    previousPhotos: 'Fotos anteriores',
    nextPhotos: 'Fotos siguientes',
    photoStatus: (first, last, total) =>
      first === last ? `Foto ${first} de ${total}` : `Fotos ${first}–${last} de ${total}`,
    galleryLabel: 'Galería de la vida en la Primera Iglesia Cristiana',
    photos: {
      'childrens-moment': {
        title: 'Momento infantil',
        caption:
          'Los niños participan en la adoración mediante historias, preguntas y actividades.',
        alt: 'Una líder de la iglesia compartiendo un momento infantil con dos niños',
      },
      'communion-table': {
        title: 'La mesa de comunión',
        caption: 'La mesa es una señal de bienvenida, memoria y fe compartida.',
        alt: 'Mesa de comunión con panes, copas, velas y utensilios de servicio',
      },
      'sanctuary-cross': {
        title: 'Centrados en Cristo',
        caption: 'Nuestra adoración apunta a la vida, el amor y el camino de Cristo.',
        alt: 'Cruz procesional con la cruz del santuario y vitrales al fondo',
      },
      staff: {
        title: 'Personal de la iglesia',
        caption: 'Las personas que sirven y guían a la Primera Iglesia Cristiana de Anniston.',
        alt: 'Cinco miembros del personal de la iglesia riendo juntos',
      },
      'stained-glass': {
        title: 'Vitrales del santuario',
        caption: 'Los vitrales históricos llenan el santuario de color y luz cálida.',
        alt: 'Vitrales altos iluminados sobre el presbiterio',
      },
      tapestry: {
        title: 'Una historia en tapiz',
        caption: 'Un tapiz hecho a mano conserva partes de la historia de la congregación.',
        alt: 'Tapiz hecho a mano con la historia y los símbolos de la iglesia',
      },
      'welcome-area': {
        title: 'Un lugar de bienvenida',
        caption:
          'Nuestra área de bienvenida refleja una congregación comprometida con la hospitalidad.',
        alt: 'Área de bienvenida con materiales para visitantes, arte y banderas arcoíris',
      },
    },
    connectEyebrow: 'Manténgase en contacto',
    connectTitle: 'Siga la vida de FCC Anniston',
    connectCopy:
      'Encuentre anuncios, fotos, sermones, donaciones y enlaces útiles durante la semana.',
    visitEyebrow: 'Encuéntrenos',
    visitTitle: 'Su primer domingo puede ser sencillo',
    visitCopy:
      'Comience con la información esencial y consulte nuestra guía para recibir detalles y ayuda personal.',
    visitNotes: [
      'La escuela dominical comienza a las 10:30 AM.',
      'La adoración comienza a las 11:30 AM.',
      'Los niños son bienvenidos en la adoración, y puede haber guardería para bebés y niños pequeños.',
    ],
    mapTitle: 'Mapa de la Primera Iglesia Cristiana de Anniston',
    loadMap: 'Cargar Google Maps',
  },
  visit: {
    eyebrow: 'Planifique su domingo',
    title: 'Sepa qué esperar antes de llegar',
    description:
      'Una primera visita no debe requerir adivinanzas. Aquí encontrará lo esencial y ayuda directa para sus necesidades.',
    quickTitle: 'El domingo de un vistazo',
    quickCopy:
      'La escuela dominical comienza a las 10:30 AM y la adoración a las 11:30 AM en 1327 Leighton Avenue.',
    logisticsTitle: 'Su visita, paso a paso',
    sections: [
      {
        id: 'arrival',
        title: 'Estacionamiento y entradas',
        description:
          'Comuníquese con la iglesia para recibir orientación sobre el mejor lugar para estacionar y entrar según sus necesidades. Con gusto podemos coordinar que alguien lo reciba.',
      },
      {
        id: 'accessibility',
        title: 'Accesibilidad',
        description:
          'Si necesita adaptaciones de movilidad, asientos, audición, sensibilidad u otro tipo, llame o escríbanos antes del domingo para planificar juntos.',
      },
      {
        id: 'dress',
        title: 'Cómo vestirse',
        description:
          'No hay un código de vestimenta. Use lo que le permita sentirse cómodo y participar.',
      },
      {
        id: 'worship',
        title: 'Adoración y duración',
        description:
          'La adoración incluye oración, música, Escritura, predicación y comunión. La duración puede variar; comuníquese con nosotros si necesita una estimación más precisa.',
      },
      {
        id: 'communion',
        title: 'Comunión',
        description:
          'La comunión es central en nuestra adoración semanal y refleja la bienvenida de Cristo a la mesa.',
      },
      {
        id: 'children',
        title: 'Niños y familias',
        description:
          'Las familias son bienvenidas. Los niños pueden permanecer en la adoración, y las familias con bebés y niños pequeños pueden usar la guardería cuando esté disponible.',
      },
    ],
    welcomeTitle: '¿Le ayudaría una bienvenida personal?',
    welcomeCopy:
      'Envíenos una nota antes del domingo y díganos qué facilitaría su visita. Un líder de la iglesia puede responderle directamente.',
    mapTitle: 'Mapa y direcciones a la Primera Iglesia Cristiana de Anniston',
    loadMap: 'Cargar Google Maps',
    contactCta: 'Preguntar sobre su visita',
  },
  about: {
    eyebrow: 'Quiénes somos',
    title: 'Bienvenido a First Christian Church, Anniston',
    description:
      'Una congregación abierta y afirmativa de los Discípulos de Cristo donde las personas pueden adorar, servir, crecer, hacer preguntas honestas y reunirse en la mesa de Cristo.',
    greeting: 'Bienvenido a First Christian Church, Anniston.',
    welcomeTitle: 'Usted es bienvenido aquí',
    welcomeParagraphs: [
      'First Christian Church, Anniston es una congregación abierta y afirmativa arraigada en la Iglesia Cristiana (Discípulos de Cristo). Buscamos ser una iglesia acogedora y espiritualmente vibrante donde las personas puedan adorar, servir, crecer, hacer preguntas honestas y reunirse en la mesa de Cristo.',
      'Como parte de la tradición de los Discípulos, creemos en la unidad sin exigir uniformidad. Las personas llegan a esta iglesia desde diferentes trasfondos, culturas, experiencias de vida y puntos de vista. No esperamos que todos piensen exactamente igual. Más bien, tratamos de practicar una comunidad cristiana donde las personas puedan pertenecer, disentir con gracia, servir juntas y seguir creciendo en la fe.',
      'Estamos comprometidos con la reconciliación, el antirracismo, la inclusión y la obra del amor de Dios en el mundo. Creemos que la fe debe formar la manera en que nos tratamos, cómo recibimos a nuestros vecinos y cómo respondemos a las necesidades de nuestra comunidad.',
      'Más que nada, queremos que sepa que usted es bienvenido aquí. No tiene que tener todo resuelto antes de entrar por la puerta. Es bienvenido en su alegría, sus preguntas, sus dudas, sus dones, sus luchas, su fe y toda su humanidad.',
    ],
    missionTitle: 'Nuestra misión',
    missionStatements: [
      'Nosotros, los miembros de First Christian Church, nos comprometemos a ser una congregación acogedora, abierta, afirmativa y espiritualmente vibrante.',
      'Buscamos profundizar nuestra relación con Cristo y entre nosotros mediante la adoración, la oración, el estudio, la mayordomía y la comunión fraternal.',
      'Buscamos servir a todo el pueblo de Dios en el nombre de Jesús.',
      'Buscamos a todas las personas que puedan ser transformadas por el gozo de la vida en Cristo.',
    ],
    denominationalTitle: 'Nuestro hogar denominacional',
    denominationalParagraphs: [
      'First Christian Church forma parte de la Iglesia Cristiana (Discípulos de Cristo), un movimiento que se describe como “un movimiento por la plenitud en un mundo fragmentado”.',
      'La tradición de los Discípulos nació de un deseo de unidad cristiana. A comienzos del siglo XIX, líderes como Barton W. Stone, Thomas Campbell y Alexander Campbell desafiaron las divisiones que separaban a los cristianos, especialmente en la Mesa del Señor. Sus movimientos se unieron finalmente en 1832 y ayudaron a formar lo que llegó a ser la Iglesia Cristiana (Discípulos de Cristo).',
      'Esa historia todavía nos forma hoy. Creemos que la mesa de Cristo es más amplia que cualquier denominación, trasfondo o frontera humana. Buscamos ser una iglesia donde la unidad se practica mediante la bienvenida, la adoración compartida, el estudio honesto y el servicio al mundo.',
    ],
    denominationalLink: {
      label: 'Conozca más de la Iglesia Cristiana (Discípulos de Cristo)',
      href: 'https://disciples.org/our-identity/',
    },
    heritageTitle: 'Una historia llevada por personas',
    heritageIntro:
      'La historia de nuestra congregación pertenece a una corriente más amplia de la historia de los Discípulos y a las personas en Anniston que se reunieron, adoraron, sirvieron y transmitieron la fe.',
    heritageImages: [
      {
        src: '/images/about/nineteenth-century-religious-reformers.jpg',
        alt: 'Impresión histórica de reformadores religiosos del siglo XIX, incluidos Thomas Campbell, Barton W. Stone, Walter Scott y Alexander Campbell',
        title: 'Raíces en el movimiento Stone-Campbell',
        caption:
          'La Iglesia Cristiana (Discípulos de Cristo) creció de movimientos de reforma que enfatizaron la unidad cristiana, la Escritura y una Mesa del Señor abierta.',
        width: 1560,
        height: 1817,
        ratio: 1560 / 1817,
        sizes: '(min-width: 62em) 38vw, 100vw',
      },
      {
        src: '/images/about/fcc-anniston-origins.jpg',
        alt: 'Fotografía histórica de una congregación temprana de First Christian Church Anniston reunida afuera de un edificio de piedra',
        title: 'Una congregación temprana de FCC Anniston',
        caption:
          'Una de las congregaciones originales de First Christian Church Anniston reunida afuera de la iglesia, un recordatorio de que esta comunidad siempre ha sido formada por personas.',
        width: 958,
        height: 340,
        ratio: 958 / 340,
        sizes: '(min-width: 62em) 54vw, 100vw',
      },
    ],
    disciplesTitle: 'Qué significa ser Discípulos de Cristo',
    disciplesIntro:
      'Como Discípulos de Cristo, recibimos a todas las personas en la Mesa del Señor como Dios nos ha recibido.',
    disciplesPractices: [
      {
        title: 'Nos reunimos alrededor de la Mesa del Señor.',
        description:
          'La comunión es central en nuestra adoración. Celebramos la Cena del Señor todos los domingos porque la entendemos como señal de la bienvenida, la gracia y la unidad de Cristo.',
      },
      {
        title: 'Practicamos la unidad sin exigir uniformidad.',
        description:
          'No creemos que todos tengan que estar de acuerdo en cada pregunta para adorar, servir o pertenecer juntos. Buscamos permanecer en pacto unos con otros aun cuando vemos algunas cosas de manera diferente.',
      },
      {
        title: 'Estudiamos la Escritura con atención.',
        description:
          'Animamos a las personas a leer, preguntar, estudiar y escuchar a Dios por medio de la Escritura. En lugar de depender de pruebas rígidas de fe, buscamos entender la Escritura con cuidado, humildad, contexto histórico y apertura al Espíritu.',
      },
      {
        title: 'Honramos el sacerdocio de todos los creyentes.',
        description:
          'Cada persona tiene dones que ofrecer. El ministerio no pertenece solo al clero o a los líderes de la iglesia. Cada persona está llamada a participar en la vida y la obra de la iglesia.',
      },
      {
        title: 'Trabajamos con otros por sanidad y justicia.',
        description:
          'La tradición de los Discípulos tiene un fuerte compromiso de cooperación con otros cristianos y personas de fe. Buscamos unirnos a la obra de plenitud de Dios mediante el servicio, la compasión, la reconciliación y la justicia.',
      },
    ],
    nextStepsTitle: 'Explore la fe y la pertenencia',
    nextSteps: [
      {
        title: 'Membresía y bautismo',
        description:
          'Conozca qué significa la membresía, cómo se practica el bautismo y cómo participar más plenamente en la vida de la iglesia.',
        routeId: 'membership',
      },
      {
        title: 'Lecturas recomendadas',
        description:
          'Encuentre libros para la reflexión, el crecimiento espiritual, la justicia, el cuidado pastoral y la Iglesia Cristiana (Discípulos de Cristo).',
        routeId: 'recommendedReading',
      },
    ],
    ctaTitle: 'La mejor manera de conocernos es visitarnos',
    ctaCopy:
      'Acompáñenos en la adoración, comparta la comunión, conozca a la congregación y traiga sus preguntas.',
    cta: 'Planifique su visita',
  },
  membership: {
    eyebrow: 'Pertenencia y próximos pasos',
    title: 'Membresía y bautismo',
    description:
      'La membresía es una manera de decir: “Esta es mi comunidad de iglesia, y quiero compartir su vida, adoración, servicio y cuidado.”',
    introTitle: 'Llegar a formar parte de la congregación',
    introParagraphs: [
      'La membresía en First Christian Church, Anniston es una manera de decir: “Esta es mi comunidad de iglesia, y quiero compartir su vida, adoración, servicio y cuidado.”',
      'Como parte de la Iglesia Cristiana (Discípulos de Cristo), recibimos a las personas en la membresía mediante una confesión de fe en Jesucristo. Para algunas personas, esa puede ser una primera confesión pública de fe. Para otras, puede ser una reafirmación de fe o una transferencia de membresía desde otra congregación.',
      'Si está interesado en hacerse miembro, puede hablar con la pastora. Algunas personas eligen pasar al frente durante la adoración, mientras que otras prefieren primero una conversación más tranquila. Con gusto le ayudaremos a dar el siguiente paso de una manera clara y significativa.',
    ],
    sections: [
      {
        title: 'Bautismo',
        paragraphs: [
          'En la tradición de los Discípulos, el bautismo es una señal importante de fe, pertenencia y nueva vida en Cristo. First Christian Church practica el bautismo por inmersión, y también honra los bautismos de otras tradiciones cristianas.',
          'Si usted ya fue bautizado en otra iglesia o denominación, no necesita bautizarse de nuevo para formar parte de esta congregación.',
          'Si tiene preguntas sobre el bautismo, la membresía o lo que significa seguir a Cristo, esas conversaciones son bienvenidas.',
        ],
      },
      {
        title: 'Participar en la vida de la iglesia',
        paragraphs: [
          'El camino cristiano no está hecho para recorrerse a solas. Se anima a los miembros a adorar con regularidad, crecer espiritualmente, apoyar el ministerio de la congregación, servir a otros y compartir el cuidado de la comunidad de la iglesia.',
          'La membresía también permite votar en reuniones congregacionales y servir en roles de liderazgo dentro de la iglesia.',
          'Para estudiantes, residentes de temporada u otras personas que permanecen conectadas con otra congregación de origen, también puede estar disponible la membresía asociada. Esto permite participar plenamente en la vida de First Christian Church mientras se mantiene la membresía en otra iglesia.',
        ],
      },
    ],
    ctaTitle: 'Pregunte sobre membresía, bautismo o participación',
    ctaCopy:
      'Para saber más sobre membresía, bautismo o cómo involucrarse más, comuníquese con la iglesia.',
    cta: 'Contactar a la iglesia',
  },
  reading: {
    eyebrow: 'Estudio y reflexión',
    title: 'Lecturas recomendadas',
    description:
      'Libros que pueden ayudar a explorar la fe cristiana, el crecimiento espiritual, la justicia, el cuidado pastoral y la Iglesia Cristiana (Discípulos de Cristo).',
    byLabel: 'por',
    categories: [
      {
        title: 'Crecimiento espiritual',
        books: [
          { title: 'An Altar in the World', author: 'Barbara Brown Taylor' },
          {
            title:
              'Half Truths: God Helps Those Who Help Themselves and Other Things the Bible Doesn’t Say',
            author: 'Adam Hamilton',
          },
          { title: 'The Sin of Certainty', author: 'Peter Enns' },
          { title: 'Sabbath as Resistance', author: 'Walter Brueggemann' },
          { title: 'Amazing Grace: A Vocabulary of Faith', author: 'Kathleen Norris' },
        ],
      },
      {
        title: 'Fe, bienvenida e inclusión',
        books: [
          {
            title: 'Torn: Rescuing the Gospel from the Gays-vs.-Christians Debate',
            author: 'Justin Lee',
          },
          {
            title: 'What the Bible Really Says About Homosexuality',
            author: 'Daniel A. Helminiak',
          },
          { title: 'Transitions of the Heart', author: 'Rachel Pepper' },
        ],
      },
      {
        title: 'Justicia y conciencia social',
        books: [
          { title: 'Fear of the Other', author: 'William H. Willimon' },
          { title: 'The Black Friend', author: 'Frederick Joseph' },
          { title: 'Post Traumatic Slave Syndrome', author: 'Joy DeGruy' },
          { title: 'Love Over Fear', author: 'Dan White Jr.' },
        ],
      },
      {
        title: 'La Iglesia Cristiana (Discípulos de Cristo)',
        books: [
          { title: 'The Stone-Campbell Movement', author: 'Leroy Garrett' },
          { title: 'The Disciples: A Struggle for Reformation', author: 'D. Duane Cummins' },
          { title: 'Freedom in Covenant', author: 'Robert D. Cornwall' },
        ],
      },
    ],
    closingNote:
      'Esta lista no es una lectura obligatoria ni una declaración formal de creencias. Se ofrece como punto de partida para la reflexión, el aprendizaje y la conversación.',
  },
  community: {
    eyebrow: 'Vida de la iglesia',
    title: 'La fe toma forma en comunidad',
    description:
      'La adoración es central en nuestra vida, y la bienvenida continúa mediante el ministerio infantil, la música, el ministerio hispano, las artes y el servicio.',
    cards: [
      {
        id: 'worship',
        title: 'Adoración dominical',
        description:
          'Reúnase para liturgia, oración, Escritura, predicación, comunión, música y una presencia regular del español en la adoración.',
        routeId: 'worshipAndMusic',
      },
      {
        id: 'children',
        title: 'Ministerio infantil',
        description:
          'Los niños son recibidos como miembros plenos de la comunidad de adoración, con flexibilidad y cuidado para las necesidades de cada familia.',
        routeId: 'wonderAndWorship',
      },
      {
        id: 'hispanic',
        title: 'Ministerio hispano',
        description:
          'La Rev. Maria Zamarripa ofrece cuidado espiritual y ministerio con personas y familias de habla hispana.',
        routeId: 'hispanicMinistry',
      },
      {
        id: 'theater',
        title: 'Compañía de Teatro Diversidad',
        description:
          'Las historias, la inclusión LGBTQ y la hospitalidad cristiana se encuentran en el escenario de la iglesia.',
        routeId: 'diversityTheater',
      },
      {
        id: 'outreach',
        title: 'Servicio comunitario',
        description:
          'Las donaciones y el voluntariado ayudan a sostener eventos comunitarios y el cuidado local.',
        routeId: 'serviceAndOutreach',
      },
      {
        id: 'updates',
        title: 'Anuncios actuales',
        description:
          'Vea publicaciones recientes, cambios de horario, información de eventos y fotos.',
        routeId: 'updates',
      },
    ],
    invitationTitle: 'No tiene que encontrar su lugar a solas',
    invitationCopy:
      'Díganos qué está buscando y alguien de la iglesia le ayudará a dar un siguiente paso práctico.',
    invitationCta: 'Iniciar una conversación',
  },
  ministries: localizedMinistryContent.es,
  theater: {
    eyebrow: 'Presentado por la Primera Iglesia Cristiana',
    titleLead: 'Compañía de',
    titleEmphasis: 'Teatro Diversidad',
    lead: 'Historias que dan lugar a cada voz y revelan el amor de Cristo en acción.',
    follow: 'Seguir en Facebook',
    discover: 'Descubrir nuestra historia',
    storyEyebrow: 'Historias con propósito',
    storyTitle: 'Un escenario donde la pertenencia ocupa el centro',
    introduction: [
      'La Primera Iglesia Cristiana patrocina y recibe producciones de la Compañía de Teatro Diversidad que reflejan las experiencias de las personas LGBTQ.',
      'Las obras y musicales exploran el prejuicio, la incomprensión, la alegría, las relaciones y la fe con humor, sensibilidad y compasión cristiana.',
      'Cada producción es una oportunidad para practicar la hospitalidad y fortalecer los vínculos en la comunidad.',
    ],
    values: [
      {
        title: 'Historias honestas',
        description: 'Las producciones reflejan vidas LGBTQ con humor, sensibilidad y humanidad.',
      },
      {
        title: 'Hospitalidad abierta',
        description:
          'Cada producción recibe a personas que no siempre se han sentido aceptadas por la iglesia.',
      },
      {
        title: 'Una comunidad más fuerte',
        description:
          'Las historias compartidas crean espacio para la unidad, la compasión y la conversación.',
      },
    ],
    galleryEyebrow: 'En el escenario',
    galleryTitle: 'El teatro nos une',
    mission:
      'Mediante historias compartidas, la Compañía de Teatro Diversidad fomenta la unidad, la compasión y la comprensión.',
    imageAlts: {
      'full-cast':
        'El elenco de una producción del oeste de la Compañía de Teatro Diversidad en el escenario',
      'ensemble-scene':
        'Tres actores con vestuario de época actuando en el escenario del Teatro Diversidad',
      'saloon-scene':
        'Actores representando una escena de cantina en blanco y negro en una producción del oeste',
      'table-scene':
        'Dos actores sentados a una mesa mientras otro intérprete está detrás de ellos',
      'dramatic-scene': 'Dos actores compartiendo un momento serio durante una obra',
      'maury-portrait': 'Maury Evans sentado dentro de la Primera Iglesia Cristiana',
      'maury-directing':
        'Maury Evans hablando en el escenario del Teatro Diversidad con un libreto',
    },
    founderBadge: 'Conozca al fundador y director',
    founderBio: [
      'Maury Evans aporta experiencia profesional en teatro y una larga trayectoria formando compañías comunitarias en los Estados Unidos.',
      'Antes de llegar a la Primera Iglesia Cristiana, dirigió y produjo numerosas obras en la Iglesia de la Comunidad Metropolitana de Albuquerque. Su arte ahora crea conexiones significativas en Anniston.',
    ],
    updatesEyebrow: 'El próximo acto',
    updatesTitle: 'Manténgase al tanto de lo que viene',
    updatesCopy:
      'Los anuncios de producciones, audiciones, fechas y boletos se comparten en la página pública de Facebook de la compañía.',
    updateBadges: ['Producciones', 'Audiciones y fechas', 'Boletos'],
    updatesCta: 'Ver novedades del teatro',
  },
  updates: {
    eyebrow: 'Información actual',
    title: 'Noticias y anuncios de la iglesia',
    description:
      'Facebook sigue siendo la fuente de publicaciones oportunas de la iglesia. Puede elegir cargar aquí la cronología pública o abrirla directamente.',
    alertTitle: 'Cambios esenciales del horario',
    alertCopy:
      'Cualquier cancelación o cambio importante de la adoración dominical también aparecerá aquí en inglés y español.',
    facebookTitle: 'Cronología pública de Facebook',
    facebookCopy:
      'La cronología puede incluir anuncios, fotos, eventos y enlaces publicados por la Primera Iglesia Cristiana de Anniston.',
    facebookLanguageNote:
      'Las publicaciones aparecen en el idioma en que fueron publicadas originalmente.',
    privacyNote:
      'Cargar la cronología conecta su navegador con Meta. Permanece bloqueada hasta que usted decida cargarla.',
    loadFacebook: 'Cargar novedades de Facebook',
    openFacebook: 'Abrir Facebook directamente',
    blogTitle: 'Últimas publicaciones de la iglesia',
    blogCopy:
      'Estas novedades propias son publicadas por la iglesia y permanecen disponibles sin cargar Facebook.',
    readPost: 'Leer novedad',
    noPosts: 'Todavía no se han publicado novedades propias.',
    fallbackTitle: '¿Prefiere no cargar Facebook?',
    fallbackCopy:
      'Use el enlace directo, llame a la oficina de la iglesia o envíe un mensaje para obtener información actual.',
  },
  staff: {
    eyebrow: 'Personas que sirven',
    title: 'Conozca al personal',
    description:
      'Conozca a los ministros, músicos y miembros del personal que forman la adoración, ofrecen cuidado y ayudan a las personas a sentirse en casa.',
    groupImageAlts: [
      'El personal de la Primera Iglesia Cristiana reunido',
      'El personal de la Primera Iglesia Cristiana compartiendo un momento divertido',
    ],
    detailsLabel: 'Leer la biografía completa',
    connectionsTitle: (name) => `Conecte con ${name}`,
    members: {
      'laura-hutchinson': {
        role: 'Ministra principal',
        summary:
          'La Rev. Laura Hutchinson sirve a la Primera Iglesia Cristiana de Anniston desde 2012 y dirige con énfasis en el amor incondicional de Dios.',
        biography: [
          'Después de graduarse con una Maestría en Divinidad de la Escuela de Teología Candler en Atlanta, GA, la Reverenda Laura Hutchinson fue ordenada en la Iglesia Cristiana (Discípulos de Cristo) en Georgia el 5 de agosto de 2001. Ha servido en varias capacidades durante su ministerio, incluyendo ministerio juvenil en varias iglesias, capellanía universitaria y docencia adjunta en el Departamento de Religión de Barton College en Wilson, NC, ministerio asociado en First Christian Church (Disciples of Christ) en Florence, AL, y pastorado principal aquí en First Christian Church (Disciples of Christ) en Anniston, AL. Sirve a FCC en Anniston desde 2012.',
          'Su enfoque principal como pastora es amar a las personas como Dios las ama. Muchas personas en este mundo no saben que son amadas, y esa realidad impulsa su pasión por el ministerio. El amor feroz e incondicional de Dios está en el centro de su predicación y cuidado pastoral. Laura se siente bendecida de pastorear una iglesia que anima activamente a acercarse a todas las personas y darles la bienvenida, compartiendo junto a ella el mensaje del evangelio.',
          'Laura comparte la luz de Cristo por medio de la predicación, estudios bíblicos interactivos donde se reciben preguntas y desafíos reflexivos a la tradición, cuidado pastoral y consejería, participación comunitaria, trabajo antirracista y de reconciliación a través de la Christian Church in Alabama & Northwest Florida, ministerios abiertos y afirmativos dentro de la comunidad LGBTQ+, y como coanfitriona del podcast “Untangling Faith” con su colega, la Rev. Tammy Jackson de Anniston, AL.',
          'La Rev. Hutchinson está profundamente agradecida por su llamado al ministerio en el nombre de Jesucristo e invita cordialmente a todos a acompañarla en este camino significativo en First Christian Church (Disciples of Christ) en Anniston, AL.',
        ],
        focusAreas: ['Predicación', 'Cuidado pastoral', 'Reconciliación', 'Ministerio afirmativo'],
        imageAlt: 'Retrato de la Rev. Laura Hutchinson',
        connections: [
          {
            id: 'instagram',
            label: 'Instagram',
            description: 'Siga las novedades y reflexiones de Laura.',
            href: 'https://www.instagram.com/hutchinsonlaura/',
          },
          {
            id: 'book',
            label: 'Finding Jesus',
            description: 'Lea el libro de Laura, Finding Jesus: In a Christian Nation.',
            href: 'https://www.amazon.com/Finding-Jesus-Rev-Laura-Hutchinson/dp/B0G64NCBBH',
          },
          {
            id: 'newspaper',
            label: 'Columna en Anniston Star',
            description: 'Lea una contribución reciente en Voices of Faith.',
            href: 'https://www.annistonstar.com/features/faith/religion_roundtable/voices-of-faith-advice-for-21-year-old-me/article_f089c79b-e298-4222-a81d-de7079bfafe1.html',
          },
          {
            id: 'podcast',
            label: 'Podcast Untangling Faith',
            description: 'Escuche a Laura y a la Rev. Tammy Jackson en Spotify.',
            href: 'https://open.spotify.com/show/12RFx6M0ro8dj1r0q2j2ty',
          },
        ],
      },
      'maria-zamarripa': {
        role: 'Ministra asociada de Ministerios Hispanos',
        summary:
          'La Rev. Maria Zamarripa sirve a personas y familias de habla hispana con guía espiritual, compasión y profundas raíces en la congregación.',
        biography: [
          'La Rev. Maria Zamarripa ha sido miembro oficial de First Christian Church desde principios de la década de 1980, después de afirmar su compromiso con Cristo. A lo largo de su relación de muchos años con la congregación, Maria ha servido diligentemente en casi todos los roles de liderazgo que ofrece la iglesia.',
          'Al reconocer un profundo llamado al ministerio, Maria respondió formalmente al inscribirse en Lexington Theological Seminary en 2016. Fue ordenada por la Christian Church in Alabama & Northwest Florida en 2020. El corazón de Maria siempre ha estado con la creciente comunidad latina del condado de Calhoun, donde ministra fielmente como guía espiritual y presencia compasiva. También extiende su ministerio como capellana en RMC Hospital y en la cárcel del condado.',
          'Hoy, en su función como Ministra asociada de Ministerios Hispanos, la Rev. Zamarripa dedica su ministerio a servir a personas y familias de habla hispana. Su compromiso constante con el llamado de Dios se refleja cada día en actos de amor, compasión y apoyo espiritual.',
        ],
        focusAreas: ['Ministerio hispano', 'Capellanía', 'Cuidado espiritual'],
        imageAlt: 'Retrato de la Rev. Maria Zamarripa',
      },
      'gerald-roberts': {
        role: 'Organista, pianista, director coral y coordinador musical',
        summary:
          'Gerald Roberts sirve a la iglesia mediante el órgano, el piano, el coro y la música de adoración desde 1987.',
        biography: [
          'Gerald Roberts ha tenido el honor y el privilegio de servir a First Christian Church desde agosto de 1987 como organista, pianista, director coral y coordinador musical. Gerald ve la música como un medio profundo y sagrado para expresar la fe, fomentar la comunidad y enriquecer la adoración.',
          'Su compromiso con el aprendizaje permanente se nota en su búsqueda continua de nuevas perspectivas, tanto musicales como espirituales, guiado por el Espíritu Santo. Gerald encuentra alegría en actividades que nutren su salud física y espiritual, incluyendo clases de ejercicio, ciclismo, cursos, exploración de la naturaleza y viajes.',
          'Gerald permanece dedicado a enriquecer las experiencias de adoración y contribuir a la comunidad vibrante de First Christian Church a través de su pasión por la música y su servicio guiado por la fe.',
        ],
        focusAreas: ['Órgano y piano', 'Coro', 'Música de adoración'],
        imageAlt: 'Retrato de Gerald Roberts',
      },
      'judy-engelhart': {
        role: 'Secretaria de la iglesia',
        summary:
          'Judy Engelhart aporta décadas de experiencia en administración e instituciones educativas a la oficina de la iglesia.',
        biography: [
          'Judy Engelhart ha servido fielmente como secretaria de First Christian Church en Anniston por más de 20 años. Antes de su tiempo en FCC, fue secretaria de una iglesia en un pequeño pueblo de Florida, aportando una importante experiencia administrativa a su función.',
          'Antes de unirse a First Christian Church, Judy tuvo una carrera significativa como consejera educativa y administradora de pruebas en Gadsden State Community College. Además, sirvió como consejera educativa y luego como Directora del Army Education Center en Fort McClellan hasta su cierre en 1999.',
          'Residente de toda la vida del condado de Calhoun, Judy creció en Saks y asistió a Saks School durante 12 años. Continuó su educación en Jacksonville State University y luego completó maestrías en Georgia State University en Atlanta y Troy State University.',
          'Sus experiencias de vida incluyen haber vivido en Okinawa durante 1.5 años y una visita espiritualmente enriquecedora a Tierra Santa, donde caminó tras las huellas de Jesús. Judy ama profundamente su función en First Christian Church y valora la comunidad solidaria y atenta que la rodea.',
        ],
        focusAreas: ['Administración', 'Comunicación', 'Apoyo congregacional'],
        imageAlt: 'Retrato de Judy Engelhart',
      },
      'jason-wright': {
        role: 'Líder de adoración',
        summary:
          'Jason Wright guía a la congregación en el canto y aporta creatividad musical, teatral y visual a la vida de la iglesia.',
        biography: [
          'Jason Wright sirve a First Christian Church como nuestro Líder de adoración, guiando a la congregación en canto vibrante y alabanza gozosa. Comparte su liderazgo musical y sus talentos creativos con otra iglesia local, demostrando su profundo compromiso de servir a Dios por medio de la música y la adoración.',
          'La pasión de Jason va más allá del liderazgo de adoración; enseña y dirige a niños en teatro, y con frecuencia dirige producciones teatrales en Jacksonville. Como una persona de muchos talentos, no solo es un músico dotado, sino también un artista visual hábil cuya creatividad enriquece nuestra comunidad.',
          'La presencia de Jason siempre anima e invita, haciendo que las experiencias de adoración sean cálidas y significativas. Está encantado de dar la bienvenida a todos para unirse a él en la celebración de la fe y la comunidad en First Christian Church.',
        ],
        focusAreas: ['Liderazgo de adoración', 'Música', 'Teatro', 'Artes visuales'],
        imageAlt: 'Retrato de Jason Wright',
      },
    },
  },
  contact: {
    eyebrow: 'Anniston, Alabama',
    title: 'Nos encantaría saber de usted',
    description:
      'Ya sea que esté planeando su primer domingo, buscando una iglesia o pidiendo oración, aquí hay un lugar para su mensaje.',
    detailLabels: {
      location: 'Ubicación',
      email: 'Correo electrónico',
      phone: 'Teléfono',
    },
    detailHelpers: {
      location: 'Obtenga direcciones paso a paso a la iglesia.',
      email: 'Envíe un mensaje en cualquier momento.',
      phone: 'Llame a la oficina de la iglesia.',
    },
    detailActions: {
      location: 'Cómo llegar',
      email: 'Enviar correo a la iglesia',
      phone: 'Llamar ahora',
    },
    visitBadge: 'Planifique su domingo',
    visitTitle: 'Acompáñenos en la adoración',
    visitCopy:
      'No necesita vestirse de cierta manera ni conocer todos los detalles. Venga tal como es y sepa que es bienvenido a la mesa.',
    childrenNote: 'Los niños son bienvenidos en la adoración, y puede haber guardería.',
    mapTitle: 'Mapa de la Primera Iglesia Cristiana en 1327 Leighton Avenue en Anniston',
    loadMap: 'Cargar Google Maps',
    form: {
      badge: 'Inicie una conversación',
      title: 'Envíenos un mensaje',
      description:
        '¿Tiene una pregunta, una petición de oración o una nota antes de su primera visita? Envíela aquí y alguien de la iglesia responderá.',
      name: 'Nombre',
      email: 'Correo electrónico',
      phone: 'Teléfono',
      optional: 'Opcional',
      topic: '¿Cómo podemos ayudar?',
      topics: [
        'Planificar una visita',
        'Petición de oración',
        'Ministerios de la iglesia',
        'Eventos comunitarios',
        'Donaciones',
        'Otro asunto',
      ],
      message: 'Mensaje',
      send: 'Enviar mensaje',
      sending: 'Enviando mensaje',
      deliveryPrefix: 'Su mensaje será enviado a',
      deliverySuffix: 'Solo usaremos sus datos de contacto para responder.',
      validationSummary: 'Revise los campos señalados.',
      nameRequired: 'Comparta su nombre.',
      emailRequired: 'Comparta una dirección de correo electrónico.',
      emailInvalid: 'Ingrese una dirección de correo electrónico válida.',
      messageRequired: 'Agregue un mensaje antes de enviarlo.',
      successTitle: 'Mensaje enviado',
      successMessage: 'Gracias por comunicarse. Su mensaje ha sido enviado.',
      errorTitle: 'No se pudo enviar',
      genericError: 'No podemos enviar su mensaje en este momento. Escriba o llame a la iglesia.',
    },
  },
  privacy: {
    eyebrow: 'Su privacidad',
    title: 'Opciones claras sobre servicios externos',
    description:
      'El sitio usa solamente los servicios necesarios para comunicarse, medir el uso básico, mostrar contenido opcional y conectar a las personas con la iglesia.',
    sections: [
      {
        title: 'Analítica',
        paragraphs: [
          'Google Analytics usa el modo de consentimiento avanzado. Hasta que usted decida permitir la analítica, la etiqueta de Google se carga con almacenamiento de analítica y publicidad denegado y envía solo señales de consentimiento sin cookies.',
          'Si permite la analítica, Google Analytics puede usar cookies de analítica para registrar visitas a páginas e interacciones generales como planificar una visita, contactar a la iglesia o abrir el enlace de donaciones.',
          'El sitio no envía a la analítica mensajes del formulario, peticiones de oración, nombres, correos electrónicos ni teléfonos.',
        ],
      },
      {
        title: 'Formulario de contacto',
        paragraphs: [
          'El formulario usa FormSubmit para enviar su mensaje al correo de la iglesia. La información se utiliza para leer y responder a su mensaje.',
        ],
      },
      {
        title: 'Mapas, Spotify y Facebook',
        paragraphs: [
          'Google Maps, Spotify y Facebook permanecen bloqueados hasta que usted decida cargarlos. Al hacerlo, su navegador se conecta con el proveedor, que puede recibir datos técnicos como su dirección IP y detalles del navegador.',
          'Cuando carga contenido incrustado, este sitio guarda esa opción de proveedor en este navegador para que el mismo proveedor pueda cargarse con más facilidad la próxima vez. Puede borrar esas opciones guardadas abajo.',
        ],
      },
      {
        title: 'Donaciones en línea',
        paragraphs: [
          'Los enlaces de donación abren Tithe.ly en una pestaña nueva. Tithe.ly procesa las donaciones según sus propias prácticas; este sitio no recibe datos de tarjetas.',
        ],
      },
      {
        title: 'Portal de miembros',
        paragraphs: [
          'El portal usa Firebase Authentication para iniciar sesión y Firestore para acceso, perfiles privados, grupos, eventos, anuncios e historial de moderación.',
          'Participar en el directorio y usar una foto es opcional. El directorio contiene solamente los datos que cada miembro aprobado decidió compartir.',
          'Las fotos se recortan y comprimen en el navegador, se guardan en un depósito privado de Cloudflare R2 y se entregan mediante un Worker autenticado después de revisión. No se suben las imágenes originales.',
          'El portal no guarda información pastoral, médica, financiera, peticiones de oración, documentos fiscales ni comprobantes de donaciones.',
        ],
      },
      {
        title: 'Preguntas',
        paragraphs: [
          'Comuníquese con la oficina de la iglesia si tiene una pregunta sobre este aviso o necesita ayuda para usar una opción directa de correo, teléfono, mapa o donación.',
        ],
      },
    ],
    preferencesTitle: 'Preferencia de analítica',
    preferencesCopy:
      'Puede cambiar si este navegador permite cookies de Google Analytics en el sitio de la iglesia.',
    acceptAnalytics: 'Permitir analítica',
    declineAnalytics: 'No usar cookies analíticas',
    currentAccepted: 'La analítica está permitida actualmente en este navegador.',
    currentDeclined: 'Las cookies de analítica están denegadas actualmente en este navegador.',
    currentUnset: 'No se ha guardado una preferencia de cookies de analítica en este navegador.',
    embedPreferencesTitle: 'Opciones guardadas de contenido',
    embedPreferencesCopy:
      'Estas opciones se guardan solo en este navegador. Al borrar una, ese proveedor vuelve a quedar bloqueado hasta que usted decida cargarlo.',
    embedProviderLabels: {
      'google-maps': 'Google Maps',
      spotify: 'Spotify',
      facebook: 'Facebook',
    },
    clearEmbedPreference: 'Borrar',
    clearAllEmbedPreferences: 'Borrar todas las opciones de contenido',
    noEmbedPreferences: 'No se han guardado opciones de contenido en este navegador.',
  },
  consent: {
    title: 'Sus opciones de privacidad',
    description:
      'Usamos el modo de consentimiento de Google Analytics para saber qué páginas ayudan a los visitantes. Las cookies de analítica permanecen desactivadas hasta que usted las permita.',
    accept: 'Permitir analítica',
    decline: 'No usar cookies analíticas',
    privacyLink: 'Leer el aviso de privacidad',
  },
  notFound: {
    title: 'Página no encontrada',
    description: 'Es posible que la página se haya movido o que la dirección esté incompleta.',
    action: 'Volver al inicio',
  },
};

export const localizedContent: Record<Locale, LocalizedContent> = { en, es };

export function getContent(locale: Locale) {
  return localizedContent[locale];
}
