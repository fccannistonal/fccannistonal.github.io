import { routeManifest } from '../lib/routing';
import { getPostByPath, getPostBySlug, getPublishedPostRoutes, publishedPosts } from './posts';

describe('published posts', () => {
  it('loads Markdown posts with localized alternates and rendered HTML', () => {
    const englishPost = getPostBySlug('en', 'welcome-to-first-christian-news');
    const spanishPost = getPostBySlug('es', 'bienvenidos-a-las-noticias-de-la-iglesia');

    expect(englishPost).toBeDefined();
    expect(spanishPost).toBeDefined();
    expect(englishPost?.alternatePath).toBe(
      '/es/novedades/bienvenidos-a-las-noticias-de-la-iglesia'
    );
    expect(spanishPost?.alternatePath).toBe('/updates/welcome-to-first-christian-news');
    expect(englishPost?.html).toContain('<h2>A place for church-owned updates</h2>');
    expect(englishPost?.html).not.toContain('<script');
  });

  it('keeps post slug and path combinations unique', () => {
    const slugKeys = new Set(publishedPosts.map((post) => `${post.locale}:${post.slug}`));
    const paths = new Set(publishedPosts.map((post) => post.path));

    expect(slugKeys.size).toBe(publishedPosts.length);
    expect(paths.size).toBe(publishedPosts.length);
  });

  it('creates route metadata for static generation', () => {
    const routes = getPublishedPostRoutes(routeManifest);
    const route = routes.find(
      (candidate) => candidate.path === '/updates/welcome-to-first-christian-news'
    );

    expect(route).toMatchObject({
      id: 'post',
      locale: 'en',
      alternatePath: '/es/novedades/bienvenidos-a-las-noticias-de-la-iglesia',
      title: 'Welcome to First Christian Church news | First Christian Church Anniston',
    });
    expect(getPostByPath('/updates/welcome-to-first-christian-news/')?.slug).toBe(
      'welcome-to-first-christian-news'
    );
  });
});
