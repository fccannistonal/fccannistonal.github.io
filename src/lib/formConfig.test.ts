import { notifyMemberAccessRequest } from './formConfig';

describe('member access request notifications', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('sends the request to the existing church inbox endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await notifyMemberAccessRequest({
      name: 'Alex Morgan',
      preferredName: 'Alex',
      email: 'alex@example.com',
      phone: '555-0100',
      connection: 'I regularly attend or participate',
      note: 'I help with worship.',
      locale: 'en',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://formsubmit.co/ajax/fccannistonal@gmail.com',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('member area access request'),
      })
    );
  });

  it('reports notification failure without changing the stored request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(
      notifyMemberAccessRequest({
        name: 'Alex Morgan',
        preferredName: '',
        email: 'alex@example.com',
        phone: '',
        connection: 'Other',
        note: '',
        locale: 'en',
      })
    ).rejects.toThrow(/could not be sent/i);
  });
});
