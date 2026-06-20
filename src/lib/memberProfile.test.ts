import {
  defaultDirectoryVisibility,
  emptyDirectoryProfile,
  formatAddress,
  formatBirthday,
  formatPhone,
  isValidMonthDay,
  normalizeDirectoryProfile,
  normalizePhone,
  normalizeRegion,
  projectDirectoryEntry,
} from './memberProfile';

describe('member profile helpers', () => {
  it('normalizes common US phone formats and preserves E.164 international numbers', () => {
    expect(normalizePhone('2565551234')).toBe('+12565551234');
    expect(normalizePhone('(256) 555-1234')).toBe('+12565551234');
    expect(normalizePhone('+44 20 7946 0958')).toBe('+442079460958');
    expect(formatPhone('+12565551234')).toBe('(256) 555-1234');
    expect(() => normalizePhone('555')).toThrow('invalid-phone');
  });

  it('validates and formats month/day birthdays without collecting a year', () => {
    expect(isValidMonthDay({ month: 2, day: 29 })).toBe(true);
    expect(isValidMonthDay({ month: 2, day: 30 })).toBe(false);
    expect(formatBirthday({ month: 4, day: 12 }, 'en')).toBe('April 12');
  });

  it('normalizes profile text, contact choices, address state, and duplicate interests', () => {
    const profile = emptyDirectoryProfile('member', 'member@example.com');
    const result = normalizeDirectoryProfile({
      ...profile,
      displayName: '  Zoë Rackley  ',
      alternateEmail: ' zoe@example.com ',
      phone: '256-555-1234',
      communicationChannels: ['email', 'sms'],
      preferredContactMethod: 'sms',
      address: { ...profile.address, city: ' Anniston ', region: 'Alabama' },
      ministryInterests: ['technology', 'technology'],
    });

    expect(result.displayName).toBe('Zoë Rackley');
    expect(result.phone).toBe('+12565551234');
    expect(result.address.region).toBe('AL');
    expect(result.ministryInterests).toEqual(['technology']);
  });

  it('uses conservative directory defaults with opt-out official metadata', () => {
    expect(defaultDirectoryVisibility()).toMatchObject({
      listed: false,
      email: false,
      address: false,
      birthday: false,
      churchStatus: true,
      churchRoles: true,
    });
  });

  it('projects only visible fields and prefers alternate email', () => {
    const profile = emptyDirectoryProfile('member', 'signin@example.com');
    profile.alternateEmail = 'contact@example.com';
    profile.visibility = {
      ...profile.visibility,
      listed: true,
      email: true,
      phone: false,
      churchStatus: true,
      churchRoles: false,
    };
    const entry = projectDirectoryEntry(profile, {
      uid: 'member',
      churchStatus: 'member',
      churchRoles: ['staff'],
      dateJoined: '',
    });

    expect(entry.email).toBe('contact@example.com');
    expect(entry.phone).toBe('');
    expect(entry.churchStatus).toBe('member');
    expect(entry.churchRoles).toEqual([]);
  });

  it('formats structured mailing addresses without empty rows', () => {
    expect(
      formatAddress({
        line1: '100 Main St',
        line2: '',
        city: 'Anniston',
        region: 'AL',
        postalCode: '36201',
        country: 'United States',
      })
    ).toEqual(['100 Main St', 'Anniston, AL 36201', 'United States']);
    expect(normalizeRegion('Alabama', 'United States')).toBe('AL');
  });
});
