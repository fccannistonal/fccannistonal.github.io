import { readdir, readFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

const frontmatterPattern = /^---\n([\s\S]*?)\n---\n?/;

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const normalizeFrontmatterString = (value) => {
  const trimmed = value.trim();
  const quoted = trimmed.match(/^['"]([\s\S]*)['"]$/);

  return quoted ? quoted[1] : trimmed;
};

function parseFrontmatter(source) {
  const data = {};
  const lines = source.split('\n');
  let currentArrayKey = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      continue;
    }

    const arrayItem = line.match(/^\s*-\s+(.+)$/);
    if (arrayItem && currentArrayKey) {
      data[currentArrayKey] = [
        ...(Array.isArray(data[currentArrayKey]) ? data[currentArrayKey] : []),
        normalizeFrontmatterString(arrayItem[1]),
      ];
      continue;
    }

    const field = line.match(/^([A-Za-z][A-Za-z0-9_-]*):(?:\s*(.*))?$/);
    if (!field) {
      throw new Error(`Unsupported frontmatter line: ${line}`);
    }

    const [, key, rawValue = ''] = field;
    currentArrayKey = null;

    if (!rawValue.trim()) {
      data[key] = [];
      currentArrayKey = key;
    } else if (rawValue === 'true' || rawValue === 'false') {
      data[key] = rawValue === 'true';
    } else {
      data[key] = normalizeFrontmatterString(rawValue);
    }
  }

  return data;
}

function parseMarkdownDocument(source) {
  const match = source.match(frontmatterPattern);

  if (!match) {
    throw new Error('Markdown document is missing frontmatter.');
  }

  return {
    data: parseFrontmatter(match[1]),
    body: source.slice(match[0].length).trim(),
  };
}

function isSafeHref(href) {
  if (href.startsWith('/') || href.startsWith('#')) {
    return true;
  }

  try {
    const url = new URL(href);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function renderBasicInline(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function renderInline(value) {
  const linkPattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let html = '';
  let lastIndex = 0;

  for (const match of value.matchAll(linkPattern)) {
    const [raw, label, href] = match;
    const index = match.index ?? 0;
    html += renderBasicInline(value.slice(lastIndex, index));
    html += isSafeHref(href)
      ? `<a href="${escapeHtml(href)}">${renderBasicInline(label)}</a>`
      : renderBasicInline(label);
    lastIndex = index + raw.length;
  }

  html += renderBasicInline(value.slice(lastIndex));
  return html;
}

function flushParagraph(paragraph, blocks) {
  if (paragraph.length > 0) {
    blocks.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
    paragraph.length = 0;
  }
}

function flushList(listItems, blocks) {
  if (listItems.length > 0) {
    blocks.push(`<ul>${listItems.map((item) => `<li>${renderInline(item)}</li>`).join('')}</ul>`);
    listItems.length = 0;
  }
}

function renderMarkdownToHtml(markdown) {
  const blocks = [];
  const paragraph = [];
  const listItems = [];

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph(paragraph, blocks);
      flushList(listItems, blocks);
      continue;
    }

    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      flushParagraph(paragraph, blocks);
      flushList(listItems, blocks);
      const level = heading[1].length;
      blocks.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    const listItem = line.match(/^[-*]\s+(.+)$/);
    if (listItem) {
      flushParagraph(paragraph, blocks);
      listItems.push(listItem[1]);
      continue;
    }

    flushList(listItems, blocks);
    paragraph.push(line);
  }

  flushParagraph(paragraph, blocks);
  flushList(listItems, blocks);

  return blocks.join('\n');
}

function requireString(data, key, filePath) {
  if (typeof data[key] !== 'string' || data[key].trim().length === 0) {
    throw new Error(`${filePath}: frontmatter field "${key}" must be a non-empty string.`);
  }

  return data[key].trim();
}

function createPostPath(locale, slug) {
  return locale === 'es' ? `/es/novedades/${slug}` : `/updates/${slug}`;
}

export async function readPublishedPosts(rootDir) {
  const postsDir = resolve(rootDir, 'src', 'content', 'posts');
  const entries = (await readdir(postsDir, { withFileTypes: true })).filter(
    (entry) => entry.isFile() && entry.name.endsWith('.md')
  );
  const parsedPosts = await Promise.all(
    entries.map(async (entry) => {
      const filePath = resolve(postsDir, entry.name);
      const { data, body } = parseMarkdownDocument(await readFile(filePath, 'utf8'));
      const locale = requireString(data, 'locale', filePath);

      if (locale !== 'en' && locale !== 'es') {
        throw new Error(`${filePath}: frontmatter field "locale" must be "en" or "es".`);
      }

      const slug = requireString(data, 'slug', filePath);

      return {
        sourceFile: basename(filePath),
        slug,
        locale,
        alternateSlug: requireString(data, 'alternateSlug', filePath),
        title: requireString(data, 'title', filePath),
        description: requireString(data, 'description', filePath),
        publishedAt: requireString(data, 'publishedAt', filePath),
        author: requireString(data, 'author', filePath),
        tags: Array.isArray(data.tags) ? data.tags : [],
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
    })
  );

  return parsedPosts
    .filter((post) => !post.draft)
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
    .map((post, _index, posts) => {
      const alternateLocale = post.locale === 'en' ? 'es' : 'en';
      const alternatePost = posts.find(
        (candidate) => candidate.locale === alternateLocale && candidate.slug === post.alternateSlug
      );

      return {
        ...post,
        alternatePath: alternatePost?.path ?? (post.locale === 'en' ? '/es/novedades' : '/updates'),
      };
    });
}

export function createPostRoutes(posts, manifest) {
  return posts.map((post) => ({
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
