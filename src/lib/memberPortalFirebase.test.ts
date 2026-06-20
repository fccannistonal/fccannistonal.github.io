import { createIcs, type GroupEvent } from './memberPortalFirebase';

describe('member portal data helpers', () => {
  it('generates an escaped downloadable calendar event', () => {
    const event: GroupEvent = {
      id: 'event-1',
      groupId: 'group-1',
      groupName: 'Worship Team',
      title: 'Practice, setup',
      description: 'Bring music; arrive early',
      location: 'Sanctuary',
      startsAt: new Date('2026-07-01T23:00:00.000Z'),
      endsAt: new Date('2026-07-02T00:00:00.000Z'),
      allDay: false,
      visibility: 'groupMembers',
      status: 'scheduled',
      createdBy: 'member',
    };

    const result = createIcs(event);

    expect(result).toContain('BEGIN:VCALENDAR');
    expect(result).toContain('DTSTART:20260701T230000Z');
    expect(result).toContain('SUMMARY:Practice\\, setup');
    expect(result).toContain('DESCRIPTION:Bring music\\; arrive early');
  });
});
