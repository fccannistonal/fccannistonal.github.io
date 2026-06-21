export type Locale = 'en' | 'es';

export type MonthDay = { month: number; day: number };
export type ContactChannel = 'email' | 'phone' | 'sms';
export type PreferredContactMethod = ContactChannel | 'none';
export type ChurchStatus = 'member' | 'regularAttender' | 'visitor' | 'inactive' | 'archived';
export type ChurchRole = 'staff' | 'leadershipTeam' | 'elder';
export type MinistryInterestId =
  | 'worship'
  | 'children'
  | 'youth'
  | 'outreach'
  | 'hospitality'
  | 'foodMeals'
  | 'prayer'
  | 'music'
  | 'teaching'
  | 'technology'
  | 'communications'
  | 'events'
  | 'facilities'
  | 'smallGroups'
  | 'pastoralCare'
  | 'other';

export type MailingAddress = {
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

export type DirectoryVisibility = {
  listed: boolean;
  preferredName: boolean;
  email: boolean;
  phone: boolean;
  pronouns: boolean;
  address: boolean;
  birthday: boolean;
  household: boolean;
  relationships: boolean;
  anniversary: boolean;
  ministryInterests: boolean;
  photo: boolean;
  churchStatus: boolean;
  churchRoles: boolean;
};

export type DirectoryProfile = {
  uid: string;
  displayName: string;
  preferredName: string;
  pronouns: string;
  addressingNote: string;
  birthday: MonthDay | null;
  email: string;
  alternateEmail: string;
  phone: string;
  communicationChannels: ContactChannel[];
  preferredContactMethod: PreferredContactMethod;
  address: MailingAddress;
  household: string;
  ministryInterests: MinistryInterestId[];
  otherMinistryInterest: string;
  visibility: DirectoryVisibility;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ChurchMetadata = {
  uid: string;
  churchStatus: ChurchStatus | null;
  churchRoles: ChurchRole[];
  dateJoined: string;
  updatedAt?: Date;
};

export type MemberAdminNotes = {
  uid: string;
  membershipNotes: string;
  internalNotes: string;
  lastReviewedAt?: Date;
  lastReviewedByUid: string;
  lastReviewedByName: string;
  updatedAt?: Date;
};

export type DirectoryEntry = {
  uid: string;
  displayName: string;
  preferredName: string;
  email: string;
  phone: string;
  pronouns: string;
  birthday: MonthDay | null;
  address: MailingAddress | null;
  household: string;
  shareHousehold: boolean;
  shareRelationships: boolean;
  shareAnniversary: boolean;
  ministryInterests: MinistryInterestId[];
  otherMinistryInterest: string;
  churchStatus: ChurchStatus | null;
  churchRoles: ChurchRole[];
  showPhoto: boolean;
};

type LocalizedOption<T extends string> = {
  value: T;
  label: Record<Locale, string>;
};

export const CHURCH_STATUS_OPTIONS: LocalizedOption<ChurchStatus>[] = [
  { value: 'member', label: { en: 'Member', es: 'Miembro' } },
  { value: 'regularAttender', label: { en: 'Regular attender', es: 'Asistente habitual' } },
  { value: 'visitor', label: { en: 'Visitor', es: 'Visitante' } },
  { value: 'inactive', label: { en: 'Inactive', es: 'Inactivo' } },
  { value: 'archived', label: { en: 'Archived', es: 'Archivado' } },
];

export const CHURCH_ROLE_OPTIONS: LocalizedOption<ChurchRole>[] = [
  { value: 'staff', label: { en: 'Staff', es: 'Personal' } },
  { value: 'leadershipTeam', label: { en: 'Leadership team', es: 'Equipo de liderazgo' } },
  { value: 'elder', label: { en: 'Elder', es: 'Anciano' } },
];

export const MINISTRY_INTEREST_OPTIONS: LocalizedOption<MinistryInterestId>[] = [
  { value: 'worship', label: { en: 'Worship', es: 'Adoración' } },
  { value: 'children', label: { en: 'Children’s ministry', es: 'Ministerio infantil' } },
  { value: 'youth', label: { en: 'Youth ministry', es: 'Ministerio juvenil' } },
  { value: 'outreach', label: { en: 'Outreach', es: 'Alcance comunitario' } },
  { value: 'hospitality', label: { en: 'Hospitality', es: 'Hospitalidad' } },
  { value: 'foodMeals', label: { en: 'Food or meals', es: 'Comida o comidas' } },
  { value: 'prayer', label: { en: 'Prayer', es: 'Oración' } },
  { value: 'music', label: { en: 'Music', es: 'Música' } },
  { value: 'teaching', label: { en: 'Teaching', es: 'Enseñanza' } },
  { value: 'technology', label: { en: 'Technology', es: 'Tecnología' } },
  { value: 'communications', label: { en: 'Communications', es: 'Comunicaciones' } },
  { value: 'events', label: { en: 'Events', es: 'Eventos' } },
  { value: 'facilities', label: { en: 'Facilities', es: 'Instalaciones' } },
  { value: 'smallGroups', label: { en: 'Small groups', es: 'Grupos pequeños' } },
  { value: 'pastoralCare', label: { en: 'Pastoral care', es: 'Cuidado pastoral' } },
  { value: 'other', label: { en: 'Other', es: 'Otro' } },
];

export const CONTACT_CHANNEL_OPTIONS: LocalizedOption<ContactChannel>[] = [
  { value: 'email', label: { en: 'Email', es: 'Correo electrónico' } },
  { value: 'phone', label: { en: 'Phone call', es: 'Llamada telefónica' } },
  { value: 'sms', label: { en: 'Text message (SMS)', es: 'Mensaje de texto (SMS)' } },
];

export const emptyAddress = (): MailingAddress => ({
  line1: '',
  line2: '',
  city: '',
  region: '',
  postalCode: '',
  country: 'United States',
});

export const defaultDirectoryVisibility = (): DirectoryVisibility => ({
  listed: false,
  preferredName: true,
  email: false,
  phone: false,
  pronouns: false,
  address: false,
  birthday: false,
  household: false,
  relationships: false,
  anniversary: false,
  ministryInterests: false,
  photo: false,
  churchStatus: true,
  churchRoles: true,
});

export function emptyDirectoryProfile(uid: string, email: string): DirectoryProfile {
  return {
    uid,
    displayName: '',
    preferredName: '',
    pronouns: '',
    addressingNote: '',
    birthday: null,
    email,
    alternateEmail: '',
    phone: '',
    communicationChannels: [],
    preferredContactMethod: 'none',
    address: emptyAddress(),
    household: '',
    ministryInterests: [],
    otherMinistryInterest: '',
    visibility: defaultDirectoryVisibility(),
  };
}

export function emptyChurchMetadata(uid: string): ChurchMetadata {
  return { uid, churchStatus: null, churchRoles: [], dateJoined: '' };
}

export function emptyMemberAdminNotes(uid: string): MemberAdminNotes {
  return {
    uid,
    membershipNotes: '',
    internalNotes: '',
    lastReviewedByUid: '',
    lastReviewedByName: '',
  };
}

export const optionLabel = <T extends string>(
  options: LocalizedOption<T>[],
  value: T | null | undefined,
  locale: Locale
) => options.find((option) => option.value === value)?.label[locale] ?? '';

export const optionData = <T extends string>(options: LocalizedOption<T>[], locale: Locale) =>
  options.map((option) => ({ value: option.value, label: option.label[locale] }));

export function isValidMonthDay(value: MonthDay | null) {
  if (!value || !Number.isInteger(value.month) || !Number.isInteger(value.day)) {
    return false;
  }
  const days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return (
    value.month >= 1 && value.month <= 12 && value.day >= 1 && value.day <= days[value.month - 1]
  );
}

export function formatBirthday(value: MonthDay | null, locale: Locale) {
  if (!value || !isValidMonthDay(value)) {
    return '';
  }
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-US' : 'en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(2024, value.month - 1, value.day)));
}

export function normalizePhone(input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    return '';
  }
  const extensionless = trimmed.replace(/\s*(?:ext\.?|x)\s*\d+$/i, '');
  const digits = extensionless.replace(/\D/g, '');
  if (/^\d{10}$/.test(digits)) {
    return `+1${digits}`;
  }
  if (/^1\d{10}$/.test(digits)) {
    return `+${digits}`;
  }
  if (trimmed.startsWith('+') && /^\d{8,15}$/.test(digits)) {
    return `+${digits}`;
  }
  throw new Error('invalid-phone');
}

export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (/^1\d{10}$/.test(digits)) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return value;
}

export function isValidEmail(value: string) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

const US_STATES: Record<string, string> = {
  alabama: 'AL',
  alaska: 'AK',
  arizona: 'AZ',
  arkansas: 'AR',
  california: 'CA',
  colorado: 'CO',
  connecticut: 'CT',
  delaware: 'DE',
  florida: 'FL',
  georgia: 'GA',
  hawaii: 'HI',
  idaho: 'ID',
  illinois: 'IL',
  indiana: 'IN',
  iowa: 'IA',
  kansas: 'KS',
  kentucky: 'KY',
  louisiana: 'LA',
  maine: 'ME',
  maryland: 'MD',
  massachusetts: 'MA',
  michigan: 'MI',
  minnesota: 'MN',
  mississippi: 'MS',
  missouri: 'MO',
  montana: 'MT',
  nebraska: 'NE',
  nevada: 'NV',
  'new hampshire': 'NH',
  'new jersey': 'NJ',
  'new mexico': 'NM',
  'new york': 'NY',
  'north carolina': 'NC',
  'north dakota': 'ND',
  ohio: 'OH',
  oklahoma: 'OK',
  oregon: 'OR',
  pennsylvania: 'PA',
  'rhode island': 'RI',
  'south carolina': 'SC',
  'south dakota': 'SD',
  tennessee: 'TN',
  texas: 'TX',
  utah: 'UT',
  vermont: 'VT',
  virginia: 'VA',
  washington: 'WA',
  'west virginia': 'WV',
  wisconsin: 'WI',
  wyoming: 'WY',
  'district of columbia': 'DC',
};

export function normalizeRegion(region: string, country: string) {
  const trimmed = region.trim();
  if (!/^(us|usa|united states|united states of america)$/i.test(country.trim())) {
    return trimmed;
  }
  const upper = trimmed.toUpperCase();
  if (Object.values(US_STATES).includes(upper)) {
    return upper;
  }
  return US_STATES[trimmed.toLowerCase()] ?? trimmed;
}

export function formatAddress(address: MailingAddress | null) {
  if (!address) {
    return [];
  }
  if (
    ![address.line1, address.line2, address.city, address.region, address.postalCode].some(Boolean)
  ) {
    return [];
  }
  const locality = `${address.city}${address.city && address.region ? ', ' : ''}${address.region}${
    address.postalCode ? ` ${address.postalCode}` : ''
  }`.trim();
  return [address.line1, address.line2, locality, address.country].filter(Boolean);
}

export function normalizeDirectoryProfile(profile: DirectoryProfile): DirectoryProfile {
  const phone = normalizePhone(profile.phone);
  const alternateEmail = profile.alternateEmail.trim();
  if (!isValidEmail(alternateEmail)) {
    throw new Error('invalid-email');
  }
  if (
    (profile.communicationChannels.includes('phone') ||
      profile.communicationChannels.includes('sms')) &&
    !phone
  ) {
    throw new Error('phone-required');
  }
  if (profile.birthday && !isValidMonthDay(profile.birthday)) {
    throw new Error('invalid-birthday');
  }
  const channels = [...new Set(profile.communicationChannels)];
  const preferredContactMethod = channels.includes(profile.preferredContactMethod as ContactChannel)
    ? profile.preferredContactMethod
    : (channels[0] ?? 'none');
  const country = profile.address.country.trim() || 'United States';
  return {
    ...profile,
    displayName: profile.displayName.trim(),
    preferredName: profile.preferredName.trim(),
    pronouns: profile.pronouns.trim(),
    addressingNote: profile.addressingNote.trim(),
    email: profile.email.trim(),
    alternateEmail,
    phone,
    communicationChannels: channels,
    preferredContactMethod,
    address: {
      line1: profile.address.line1.trim(),
      line2: profile.address.line2.trim(),
      city: profile.address.city.trim(),
      region: normalizeRegion(profile.address.region, country),
      postalCode: profile.address.postalCode.trim(),
      country,
    },
    household: profile.household.trim(),
    ministryInterests: [...new Set(profile.ministryInterests)],
    otherMinistryInterest: profile.otherMinistryInterest.trim(),
  };
}

export function projectDirectoryEntry(profile: DirectoryProfile, church: ChurchMetadata) {
  return {
    uid: profile.uid,
    displayName: profile.displayName,
    preferredName: profile.visibility.preferredName ? profile.preferredName : '',
    email: profile.visibility.email ? profile.alternateEmail || profile.email : '',
    phone: profile.visibility.phone ? profile.phone : '',
    pronouns: profile.visibility.pronouns ? profile.pronouns : '',
    birthday: profile.visibility.birthday ? profile.birthday : null,
    address: profile.visibility.address ? profile.address : null,
    household: profile.visibility.household ? profile.household : '',
    shareHousehold: profile.visibility.household,
    shareRelationships: profile.visibility.relationships,
    shareAnniversary: profile.visibility.anniversary,
    ministryInterests: profile.visibility.ministryInterests ? profile.ministryInterests : [],
    otherMinistryInterest: profile.visibility.ministryInterests
      ? profile.otherMinistryInterest
      : '',
    churchStatus: profile.visibility.churchStatus ? church.churchStatus : null,
    churchRoles: profile.visibility.churchRoles ? church.churchRoles : [],
    showPhoto: profile.visibility.photo,
    listed: true as const,
    schemaVersion: 3 as const,
  };
}

export function searchableMemberText(
  profile: DirectoryProfile,
  metadata: ChurchMetadata,
  locale: Locale
) {
  return [
    profile.displayName,
    profile.preferredName,
    profile.email,
    profile.alternateEmail,
    profile.phone.replace(/\D/g, ''),
    profile.address.city,
    profile.household,
    optionLabel(CHURCH_STATUS_OPTIONS, metadata.churchStatus, locale),
    ...metadata.churchRoles.map((role) => optionLabel(CHURCH_ROLE_OPTIONS, role, locale)),
    ...profile.ministryInterests.map((interest) =>
      optionLabel(MINISTRY_INTEREST_OPTIONS, interest, locale)
    ),
    profile.otherMinistryInterest,
  ]
    .join(' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
