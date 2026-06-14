import { act } from '@testing-library/react';
import { render, screen } from '@/test-utils';
import { heroMessages } from '../../content/churchContent';
import { HERO_ROTATION_INTERVAL_MS, HomeHero } from './HomeHero';

describe('HomeHero', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('rotates hero messages when reduced motion is not requested', () => {
    vi.useFakeTimers();

    render(<HomeHero />);

    expect(
      screen.getByRole('heading', { name: new RegExp(`We are ${heroMessages[0].text}`, 'i') })
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(HERO_ROTATION_INTERVAL_MS + 100);
    });

    expect(
      screen.getByRole('heading', { name: new RegExp(`We are ${heroMessages[1].text}`, 'i') })
    ).toBeInTheDocument();
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

    render(<HomeHero />);

    act(() => {
      vi.advanceTimersByTime(HERO_ROTATION_INTERVAL_MS * 2);
    });

    expect(
      screen.getByRole('heading', { name: new RegExp(`We are ${heroMessages[0].text}`, 'i') })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: new RegExp(`We are ${heroMessages[1].text}`, 'i') })
    ).not.toBeInTheDocument();

    window.matchMedia = originalMatchMedia;
  });
});
