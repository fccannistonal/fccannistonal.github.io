import { act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe, render, screen } from '@/test-utils';
import { heroSentences } from '../../content/churchContent';
import { HERO_ROTATION_INTERVAL_MS, HomeHero } from './HomeHero';

function getSentenceText(index: number) {
  const sentence = heroSentences[index];

  return `${sentence.lead}${sentence.emphasis}${sentence.ending}`;
}

function renderHomeHero() {
  return render(
    <MemoryRouter>
      <HomeHero />
    </MemoryRouter>
  );
}

describe('HomeHero', () => {
  axe([
    <MemoryRouter key="router">
      <HomeHero />
    </MemoryRouter>,
  ]);

  afterEach(() => {
    vi.useRealTimers();
  });

  it('rotates hero messages when reduced motion is not requested', () => {
    vi.useFakeTimers();

    renderHomeHero();

    expect(screen.getByTestId('hero-current-sentence')).toHaveTextContent(getSentenceText(0));

    act(() => {
      vi.advanceTimersByTime(HERO_ROTATION_INTERVAL_MS + 100);
    });

    expect(screen.getByTestId('hero-current-sentence')).toHaveTextContent(getSentenceText(1));
  });

  it('keeps a stable semantic heading while the decorative text rotates', () => {
    vi.useFakeTimers();

    renderHomeHero();

    act(() => {
      vi.advanceTimersByTime(HERO_ROTATION_INTERVAL_MS + 100);
    });

    expect(screen.getByRole('heading', { name: getSentenceText(0) })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: getSentenceText(1) })).not.toBeInTheDocument();
  });

  it('can pause and resume automatic rotation', () => {
    vi.useFakeTimers();

    renderHomeHero();

    fireEvent.click(screen.getByRole('button', { name: /pause text animation/i }));

    act(() => {
      vi.advanceTimersByTime(HERO_ROTATION_INTERVAL_MS * 2);
    });

    expect(screen.getByTestId('hero-current-sentence')).toHaveTextContent(getSentenceText(0));

    fireEvent.click(screen.getByRole('button', { name: /resume text animation/i }));

    act(() => {
      vi.advanceTimersByTime(HERO_ROTATION_INTERVAL_MS + 100);
    });

    expect(screen.getByTestId('hero-current-sentence')).toHaveTextContent(getSentenceText(1));
  });

  it('keeps the first message visible when reduced motion is requested', () => {
    const originalMatchMedia = window.matchMedia;

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    vi.useFakeTimers();

    renderHomeHero();

    act(() => {
      vi.advanceTimersByTime(HERO_ROTATION_INTERVAL_MS * 2);
    });

    expect(screen.getByTestId('hero-current-sentence')).toHaveTextContent(getSentenceText(0));
    expect(screen.queryByRole('button', { name: /text animation/i })).not.toBeInTheDocument();

    window.matchMedia = originalMatchMedia;
  });
});
