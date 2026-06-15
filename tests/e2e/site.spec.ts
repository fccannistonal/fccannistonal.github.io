import { expect, test } from '@playwright/test';
import routeManifest from '../../src/content/routeManifest.json' with { type: 'json' };

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('fccanniston.analytics-consent.v1', 'denied');
    window.localStorage.removeItem('fccanniston.embed-consent.v1');
  });
});

test('serves localized deep links with route metadata', async ({ page }) => {
  await page.goto('/es/visita');

  await expect(page).toHaveTitle(/Planifique su visita/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://fccanniston.com/es/visita'
  );
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Sepa qué esperar antes de llegar'
  );
});

test('language switching preserves the equivalent page', async ({ page }, testInfo) => {
  await page.goto('/contact');
  if (testInfo.project.name.startsWith('mobile')) {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.getByRole('dialog').getByRole('link', { name: 'Ver el sitio en español' }).click();
  } else {
    await page.getByRole('link', { name: 'Ver el sitio en español' }).first().click();
  }

  await expect(page).toHaveURL(/\/es\/contacto$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Nos encantaría saber de usted'
  );
});

test('route navigation resets scroll, focuses the heading, and closes the mobile drawer', async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), 'mobile navigation behavior');

  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Staff', exact: true }).click();

  await expect(page).toHaveURL(/\/staff$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('contact form reports required fields without sending content', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send message' }).click();

  await expect(page.getByText('Please review the highlighted fields.')).toBeVisible();
  await expect(page.getByText('Please share your name.')).toBeVisible();
  await expect(page.getByText('Please share an email address.')).toBeVisible();
});

test('third-party embeds are click-to-load with direct fallbacks', async ({ page }) => {
  await page.goto('/updates');

  await expect(page.locator('iframe[title="Public Facebook timeline"]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /open facebook/i })).toHaveAttribute(
    'href',
    'https://www.facebook.com/FCCAnniston'
  );
  await page.getByRole('button', { name: /load facebook updates/i }).click();
  const facebookIframe = page.locator('iframe');
  await expect(facebookIframe).toHaveAttribute('src', /facebook\.com\/plugins\/page\.php/);
  await expect(facebookIframe).toHaveAttribute('src', /height=760/);
  await expect(facebookIframe).toHaveAttribute('src', /small_header=false/);
});

test('remembered embed providers load without another click', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('fccanniston.embed-consent.v1', '["facebook"]');
  });

  await page.goto('/updates');

  await expect(page.locator('iframe[title="Public Facebook timeline"]')).toHaveAttribute(
    'src',
    /facebook\.com\/plugins\/page\.php/
  );
  await expect(page.getByRole('button', { name: /load facebook updates/i })).toHaveCount(0);
});

test('all localized routes have healthy images and valid links', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'run the route-health crawl once');

  const allowedInternalPaths = new Set([
    ...routeManifest.routes.map((route) => route.path),
    '/outreach',
    '/diversity-theater',
    '/es/outreach',
    '/es/teatro-diversidad',
  ]);

  for (const route of routeManifest.routes) {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((resolve) => window.setTimeout(resolve, 100));
    });

    const health = await page.evaluate(() => {
      const internalLinks = [...document.querySelectorAll<HTMLAnchorElement>('a[href]')]
        .map((link) => link.getAttribute('href') ?? '')
        .filter((href) => href.startsWith('/'))
        .map((href) => new URL(href, window.location.origin).pathname);
      const invalidExternalLinks = [...document.querySelectorAll<HTMLAnchorElement>('a[href]')]
        .map((link) => link.href)
        .filter((href) => href.startsWith('http'))
        .filter((href) => {
          try {
            return !['http:', 'https:'].includes(new URL(href).protocol);
          } catch {
            return true;
          }
        });
      const brokenImages = [...document.images]
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src);

      return { brokenImages, internalLinks, invalidExternalLinks };
    });

    expect(health.brokenImages, `${route.path} has broken images`).toEqual([]);
    expect(health.invalidExternalLinks, `${route.path} has invalid external links`).toEqual([]);
    expect(
      health.internalLinks.filter((path) => path !== '/' && !allowedInternalPaths.has(path)),
      `${route.path} has unknown internal links`
    ).toEqual([]);
  }
});
