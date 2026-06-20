import {
  clearAllPortalCaches,
  getOrLoadPortalCache,
  invalidatePortalCache,
  readPortalCache,
  writePortalCache,
} from './memberPortalCache';

describe('member portal cache', () => {
  beforeEach(() => {
    clearAllPortalCaches();
    vi.useRealTimers();
  });

  it('persists user-scoped data and restores Date values', () => {
    const value = { title: 'Practice', startsAt: new Date('2026-07-01T23:00:00.000Z') };

    writePortalCache('member-one', 'events:next', value, 60_000);

    expect(readPortalCache<typeof value>('member-one', 'events:next')).toEqual(value);
    expect(readPortalCache('member-two', 'events:next')).toBeNull();
  });

  it('deduplicates concurrent backend loads and reuses the fresh result', async () => {
    const loader = vi.fn(async () => [{ id: 'group-one' }]);

    const [first, second] = await Promise.all([
      getOrLoadPortalCache('member', 'groups:member', 60_000, loader),
      getOrLoadPortalCache('member', 'groups:member', 60_000, loader),
    ]);
    const third = await getOrLoadPortalCache('member', 'groups:member', 60_000, loader);

    expect(first).toEqual(second);
    expect(third).toEqual(first);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('invalidates only matching keys for the selected user', () => {
    writePortalCache('member', 'groups:list', ['group'], 60_000);
    writePortalCache('member', 'profile:member', { name: 'Member' }, 60_000);
    writePortalCache('other', 'groups:list', ['other-group'], 60_000);

    invalidatePortalCache('member', ['groups:']);

    expect(readPortalCache('member', 'groups:list')).toBeNull();
    expect(readPortalCache('member', 'profile:member')).toEqual({ name: 'Member' });
    expect(readPortalCache('other', 'groups:list')).toEqual(['other-group']);
  });

  it('can fail closed instead of returning stale access data', async () => {
    vi.useFakeTimers();
    writePortalCache('member', 'access:member', { status: 'approved' }, 1_000);
    vi.advanceTimersByTime(1_001);

    await expect(
      getOrLoadPortalCache(
        'member',
        'access:member',
        1_000,
        async () => Promise.reject(new Error('offline')),
        false,
        0
      )
    ).rejects.toThrow('offline');
  });
});
