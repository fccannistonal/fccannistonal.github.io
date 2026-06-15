import { render, screen, userEvent, waitFor } from '@/test-utils';
import { ContactPage } from './Contact.page';

const { trackContactFormSubmission } = vi.hoisted(() => ({
  trackContactFormSubmission: vi.fn(),
}));

vi.mock('../lib/googleAnalytics', () => ({
  trackContactFormSubmission,
  trackContactIntent: vi.fn(),
}));

describe('ContactPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    trackContactFormSubmission.mockClear();
  });

  it('shows direct ways to contact and visit the church', () => {
    render(<ContactPage />);

    expect(
      screen.getByRole('link', {
        name: /email the church: fccannistonal@gmail\.com/i,
      })
    ).toHaveAttribute('href', 'mailto:fccannistonal@gmail.com');
    expect(
      screen.getByRole('link', {
        name: /call now: \(256\) 236-1316/i,
      })
    ).toHaveAttribute('href', 'tel:+12562361316');
    expect(screen.getAllByText(/1327 leighton ave\./i)).toHaveLength(2);
    expect(screen.getByText(/sunday school/i)).toBeInTheDocument();
    expect(screen.getByText(/worship service/i)).toBeInTheDocument();
  });

  it('validates required fields before submission', async () => {
    const user = userEvent.setup();

    render(<ContactPage />);

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(screen.getByText(/please review the highlighted fields/i)).toBeInTheDocument();
    expect(screen.getByText(/please share your name\./i)).toBeInTheDocument();
    expect(screen.getByText(/please share an email address\./i)).toBeInTheDocument();
    expect(screen.getByText(/please add a message before sending\./i)).toBeInTheDocument();
  });

  it('submits successfully to the church email endpoint', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn(),
    });

    vi.stubGlobal('fetch', fetchMock);

    render(<ContactPage />);

    await user.type(screen.getByRole('textbox', { name: /^name$/i }), 'Jordan Visitor');
    await user.type(screen.getByRole('textbox', { name: /^email$/i }), 'jordan@example.com');
    await user.type(
      screen.getByRole('textbox', { name: /^message$/i }),
      'Looking forward to visiting soon.'
    );
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      'https://formsubmit.co/ajax/fccannistonal@gmail.com',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"email":"jordan@example.com"'),
      })
    );
    expect(await screen.findByText(/thanks for reaching out/i)).toBeInTheDocument();
    expect(trackContactFormSubmission).toHaveBeenCalledTimes(1);
  });

  it('surfaces a service error when submission fails', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({
        errors: [{ message: 'The message service rejected the submission.' }],
      }),
    });

    vi.stubGlobal('fetch', fetchMock);

    render(<ContactPage />);

    await user.type(screen.getByRole('textbox', { name: /^name$/i }), 'Jordan Visitor');
    await user.type(screen.getByRole('textbox', { name: /^email$/i }), 'jordan@example.com');
    await user.type(
      screen.getByRole('textbox', { name: /^message$/i }),
      'Looking forward to visiting soon.'
    );
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(
      await screen.findByText(/the message service rejected the submission\./i)
    ).toBeInTheDocument();
  });
});
