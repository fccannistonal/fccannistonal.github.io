import { render, screen, userEvent, waitFor } from '@/test-utils';
import { ContactPage } from './Contact.page';

describe('ContactPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
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

  it('submits successfully when the Formspree endpoint is configured', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn(),
    });

    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test');
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
    expect(await screen.findByText(/thanks for reaching out/i)).toBeInTheDocument();
  });

  it('surfaces a service error when submission fails', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({
        errors: [{ message: 'Formspree rejected the submission.' }],
      }),
    });

    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test');
    vi.stubGlobal('fetch', fetchMock);

    render(<ContactPage />);

    await user.type(screen.getByRole('textbox', { name: /^name$/i }), 'Jordan Visitor');
    await user.type(screen.getByRole('textbox', { name: /^email$/i }), 'jordan@example.com');
    await user.type(
      screen.getByRole('textbox', { name: /^message$/i }),
      'Looking forward to visiting soon.'
    );
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/formspree rejected the submission\./i)).toBeInTheDocument();
  });
});
