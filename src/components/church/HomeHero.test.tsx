import { act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe, render, screen } from '@/test-utils';
import { getContent } from '../../content/localizedContent';
import { HERO_ROTATION_INTERVAL_MS, HomeHero } from './HomeHero';

const heroSentences = getContent('en').home.heroSentences;

function getSentenceText(index: number) {
  const sentence = heroSentences[index];
  return `${sentence.lead}${sentence.emphasis}${sentence.ending}`;
}

function renderHomeHero(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
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

  it('renders Spanish visitor facts and routes', () => {
    renderHomeHero('/es');

    expect(screen.getByText(/adoración los domingos/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /planifique su visita/i })).toHaveAttribute(
      'href',
      '/es/visita'
    );
  });
});
