import { parseMarkdownDocument, renderMarkdownToHtml } from '../lib/markdown';
import type { Locale, LocalizedRoute, RouteManifest } from '../lib/routing';

type PostFrontmatter = {
  slug: string;
  locale: Locale;
  alternateSlug: string;
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  tags: string[];
  draft?: boolean;
  socialImage?: string;
  socialImageAlt?: string;
};

export type PublishedPost = PostFrontmatter & {
  path: string;
  alternatePath: string;
  html: string;
  excerpt: string;
};

const postModules = import.meta.glob('./posts/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

function requireString(
  data: ReturnType<typeof parseMarkdownDocument>['data'],
  key: keyof PostFrontmatter,
  filePath: string
) {
  const value = data[key];

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${filePath}: frontmatter field "${key}" must be a non-empty string.`);
  }

  return value.trim();
}

function parseTags(data: ReturnType<typeof parseMarkdownDocument>['data'], filePath: string) {
  const value = data.tags;

  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${filePath}: frontmatter field "tags" must be a non-empty list.`);
  }

  return value.map((tag) => tag.trim()).filter(Boolean);
}

function createPostPath(locale: Locale, slug: string) {
  return locale === 'es' ? `/es/novedades/${slug}` : `/updates/${slug}`;
}

function parsePost(filePath: string, source: string) {
  const { data, body } = parseMarkdownDocument(source);
  const locale = requireString(data, 'locale', filePath);

  if (locale !== 'en' && locale !== 'es') {
    throw new Error(`${filePath}: frontmatter field "locale" must be "en" or "es".`);
  }

  const slug = requireString(data, 'slug', filePath);
  const parsedPost: Omit<PublishedPost, 'alternatePath'> & { alternateSlug: string } = {
    slug,
    locale,
    alternateSlug: requireString(data, 'alternateSlug', filePath),
    title: requireString(data, 'title', filePath),
    description: requireString(data, 'description', filePath),
    publishedAt: requireString(data, 'publishedAt', filePath),
    author: requireString(data, 'author', filePath),
    tags: parseTags(data, filePath),
    draft: data.draft === true,
    socialImage: typeof data.socialImage === 'string' ? data.socialImage : undefined,
    socialImageAlt: typeof data.socialImageAlt === 'string' ? data.socialImageAlt : undefined,
    path: createPostPath(locale, slug),
    html: renderMarkdownToHtml(body),
    excerpt: body
      .replace(/^#+\s+/gm, '')
      .replace(/[-*]\s+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 220),
  };

  return parsedPost;
}

const parsedPosts = Object.entries(postModules)
  .map(([filePath, source]) => parsePost(filePath, source))
  .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));

const pathSet = new Set<string>();
const slugLocaleSet = new Set<string>();

for (const post of parsedPosts) {
  const pathKey = post.path;
  const slugLocaleKey = `${post.locale}:${post.slug}`;

  if (pathSet.has(pathKey)) {
    throw new Error(`Duplicate post path: ${pathKey}`);
  }

  if (slugLocaleSet.has(slugLocaleKey)) {
    throw new Error(`Duplicate post slug for locale: ${slugLocaleKey}`);
  }

  pathSet.add(pathKey);
  slugLocaleSet.add(slugLocaleKey);
}

export const publishedPosts: PublishedPost[] = parsedPosts
  .filter((post) => !post.draft)
  .map((post) => {
    const alternateLocale: Locale = post.locale === 'en' ? 'es' : 'en';
    const alternatePost = parsedPosts.find(
      (candidate) => candidate.locale === alternateLocale && candidate.slug === post.alternateSlug
    );

    return {
      ...post,
      alternatePath: alternatePost?.path ?? (post.locale === 'en' ? '/es/novedades' : '/updates'),
    };
  });

export function getPostBySlug(locale: Locale, slug: string | undefined) {
  return publishedPosts.find((post) => post.locale === locale && post.slug === slug);
}

export function getPostByPath(pathname: string) {
  const normalizedPath = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');
  return publishedPosts.find((post) => post.path === normalizedPath);
}

export function getRecentPosts(locale: Locale, limit = 3) {
  return publishedPosts.filter((post) => post.locale === locale).slice(0, limit);
}

export function getPublishedPostRoutes(manifest: RouteManifest): LocalizedRoute[] {
  return publishedPosts.map((post) => ({
    id: 'post',
    locale: post.locale,
    path: post.path,
    alternatePath: post.alternatePath,
    title: `${post.title} | ${manifest.siteName}`,
    description: post.description,
    socialImage: post.socialImage,
    socialImageAlt: post.socialImageAlt,
    post,
  }));
}
