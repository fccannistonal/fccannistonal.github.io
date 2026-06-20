import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof window !== 'undefined') {
  const { getComputedStyle } = window;
  window.getComputedStyle = (element) => getComputedStyle(element);
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.scrollTo = vi.fn();

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  window.ResizeObserver = ResizeObserver;
  window.IntersectionObserver = IntersectionObserver;
}
