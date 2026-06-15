export type ServiceId = 'sundaySchool' | 'worship';
export type ContactMethodId = 'location' | 'email' | 'phone';
export type StaffId =
  | 'laura-hutchinson'
  | 'maria-zamarripa'
  | 'gerald-roberts'
  | 'judy-engelhart'
  | 'jason-wright';

export type PhotoAsset = {
  id: string;
  src: string;
  width: number;
  height: number;
  objectPosition?: string;
};

export type StaffAsset = {
  id: StaffId;
  name: string;
  imageSrc: string;
  width: number;
  height: number;
};

export type TheaterImage = PhotoAsset;
export type MinistryPageId =
  | 'worshipAndMusic'
  | 'wonderAndWorship'
  | 'hispanicMinistry'
  | 'serviceAndOutreach';

export type MinistryPageAssets = {
  hero: PhotoAsset;
  features: Record<string, PhotoAsset>;
};

const tithelyFormId = 'c23cd1bd-eeab-4311-a159-15b079e46baf';

export const siteConfig = {
  name: 'First Christian Church Anniston',
  shortName: 'FCC Anniston',
  denomination: 'Disciples of Christ',
  logoSrc: '/images/brand/fcc-logo.png',
  heroImageSrc: '/images/home/sanctuary-hero.jpg',
  heroImageWidth: 2400,
  heroImageHeight: 1800,
  exteriorImageSrc: '/images/home/fcc-exterior-sunset.jpg',
  exteriorImageWidth: 1800,
  exteriorImageHeight: 1800,
  addressLines: ['1327 Leighton Ave.', 'Anniston, AL 36207'],
  phoneDisplay: '(256) 236-1316',
  phoneHref: 'tel:+12562361316',
  email: 'fccannistonal@gmail.com',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=1327+Leighton+Ave%2C+Anniston%2C+AL+36207',
  mapEmbedUrl:
    'https://www.google.com/maps?q=1327+Leighton+Ave%2C+Anniston%2C+AL+36207&output=embed',
  sermonUrl: 'https://open.spotify.com/show/7BOIacUOhCI3jN6PcfLPUc',
  sermonEmbedUrl: 'https://open.spotify.com/embed/show/7BOIacUOhCI3jN6PcfLPUc?utm_source=generator',
  givingFormId: tithelyFormId,
  givingFormUrl: `https://give.tithe.ly/?formId=${tithelyFormId}`,
  facebookUrl: 'https://www.facebook.com/FCCAnniston',
  linktreeUrl: 'https://linktr.ee/fccanniston',
  diversityTheaterFacebookUrl: 'https://www.facebook.com/profile.php?id=61555989325768',
  serviceTimes: [
    { id: 'sundaySchool' as const, time: '10:30 AM' },
    { id: 'worship' as const, time: '11:30 AM' },
  ],
};

export const photoAssets: PhotoAsset[] = [
  {
    id: 'childrens-moment',
    src: '/images/gallery/childrens-moment.jpg',
    width: 1350,
    height: 1800,
    objectPosition: '50% 42%',
  },
  {
    id: 'communion-table',
    src: '/images/gallery/communion-table.jpg',
    width: 1350,
    height: 1800,
    objectPosition: '50% 54%',
  },
  {
    id: 'sanctuary-cross',
    src: '/images/gallery/sanctuary-cross.jpg',
    width: 1800,
    height: 1350,
    objectPosition: '50% 50%',
  },
  {
    id: 'staff',
    src: '/images/gallery/church-staff.jpg',
    width: 1800,
    height: 1200,
    objectPosition: '50% 48%',
  },
  {
    id: 'stained-glass',
    src: '/images/gallery/stained-glass.jpg',
    width: 1800,
    height: 1800,
    objectPosition: '52% 42%',
  },
  {
    id: 'tapestry',
    src: '/images/gallery/church-tapestry.jpg',
    width: 1800,
    height: 1800,
    objectPosition: '50% 45%',
  },
  {
    id: 'welcome-area',
    src: '/images/gallery/welcome-area.jpg',
    width: 1800,
    height: 1666,
    objectPosition: '50% 45%',
  },
];

export const staffAssets: StaffAsset[] = [
  {
    id: 'laura-hutchinson',
    name: 'Rev. Laura Hutchinson',
    imageSrc: '/images/staff/laura.jpg',
    width: 1856,
    height: 2639,
  },
  {
    id: 'maria-zamarripa',
    name: 'Rev. Maria Zamarripa',
    imageSrc: '/images/staff/maria.jpg',
    width: 1856,
    height: 2597,
  },
  {
    id: 'gerald-roberts',
    name: 'Gerald Roberts',
    imageSrc: '/images/staff/gerald.jpg',
    width: 1856,
    height: 2597,
  },
  {
    id: 'judy-engelhart',
    name: 'Judy Engelhart',
    imageSrc: '/images/staff/judy.jpg',
    width: 1845,
    height: 2582,
  },
  {
    id: 'jason-wright',
    name: 'Jason Wright',
    imageSrc: '/images/staff/jason.jpg',
    width: 1856,
    height: 2597,
  },
];

export const staffGroupImages = [
  {
    id: 'staff-formal',
    src: '/images/staff/staff.jpg',
    width: 2784,
    height: 1856,
    objectPosition: '50% 50%',
  },
  {
    id: 'staff-playful',
    src: '/images/staff/funny-staff.jpg',
    width: 2552,
    height: 1856,
    objectPosition: '50% 50%',
  },
] satisfies PhotoAsset[];

export const diversityTheaterAssets = {
  heroImage: {
    id: 'full-cast',
    src: '/images/community/diversity-theater/cast-1600.jpg',
    width: 1600,
    height: 1017,
    objectPosition: '50% 44%',
  },
  galleryImages: [
    {
      id: 'ensemble-scene',
      src: '/images/community/diversity-theater/ensemble-scene.jpg',
      width: 750,
      height: 500,
      objectPosition: '50% 42%',
    },
    {
      id: 'saloon-scene',
      src: '/images/community/diversity-theater/saloon-scene.jpg',
      width: 750,
      height: 500,
      objectPosition: '46% 50%',
    },
    {
      id: 'table-scene',
      src: '/images/community/diversity-theater/table-scene.jpg',
      width: 750,
      height: 500,
      objectPosition: '50% 44%',
    },
    {
      id: 'dramatic-scene',
      src: '/images/community/diversity-theater/dramatic-scene.jpg',
      width: 750,
      height: 500,
      objectPosition: '50% 46%',
    },
  ] satisfies TheaterImage[],
  founderPortrait: {
    id: 'maury-portrait',
    src: '/images/community/diversity-theater/maury-evans-portrait.jpg',
    width: 750,
    height: 500,
    objectPosition: '50% 42%',
  },
  founderActionImage: {
    id: 'maury-directing',
    src: '/images/community/diversity-theater/maury-evans-directing.jpg',
    width: 750,
    height: 500,
    objectPosition: '50% 38%',
  },
};

export const ministryPageAssets: Record<MinistryPageId, MinistryPageAssets> = {
  worshipAndMusic: {
    hero: {
      id: 'sanctuary-hero',
      src: '/images/home/sanctuary-hero.jpg',
      width: 2400,
      height: 1800,
      objectPosition: '50% 48%',
    },
    features: {
      communion: photoAssets.find((photo) => photo.id === 'communion-table')!,
      gerald: {
        id: 'gerald',
        src: '/images/staff/gerald.jpg',
        width: 1856,
        height: 2597,
      },
      jason: {
        id: 'jason',
        src: '/images/staff/jason.jpg',
        width: 1856,
        height: 2597,
      },
    },
  },
  wonderAndWorship: {
    hero: photoAssets.find((photo) => photo.id === 'childrens-moment')!,
    features: {
      participation: photoAssets.find((photo) => photo.id === 'childrens-moment')!,
      welcome: photoAssets.find((photo) => photo.id === 'welcome-area')!,
    },
  },
  hispanicMinistry: {
    hero: {
      id: 'maria',
      src: '/images/staff/maria.jpg',
      width: 1856,
      height: 2597,
      objectPosition: '50% 30%',
    },
    features: {
      maria: {
        id: 'maria',
        src: '/images/staff/maria.jpg',
        width: 1856,
        height: 2597,
      },
      welcome: photoAssets.find((photo) => photo.id === 'welcome-area')!,
    },
  },
  serviceAndOutreach: {
    hero: {
      id: 'church-exterior',
      src: '/images/home/fcc-exterior-sunset.jpg',
      width: 1800,
      height: 1800,
      objectPosition: '62% 52%',
    },
    features: {
      space: photoAssets.find((photo) => photo.id === 'welcome-area')!,
    },
  },
};
