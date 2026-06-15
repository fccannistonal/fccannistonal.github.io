#!/usr/bin/env node
import { mkdir, readdir, stat } from 'node:fs/promises';
import { extname, join, parse, relative, resolve } from 'node:path';
import sharp from 'sharp';

const rootDir = resolve(import.meta.dirname, '..');
const sourceDir = resolve(rootDir, 'source-images', 'images');
const outputDir = resolve(rootDir, 'public', 'images');
const responsiveWidths = [480, 768, 1200, 1600];
let generatedCount = 0;
let skippedCount = 0;

async function listImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await listImages(path)));
    } else if (['.jpg', '.jpeg', '.png'].includes(extname(entry.name).toLowerCase())) {
      results.push(path);
    }
  }

  return results;
}

async function generateImage(sourcePath) {
  const sourceRelativePath = relative(sourceDir, sourcePath);
  const destinationPath = join(outputDir, sourceRelativePath);
  const parsed = parse(destinationPath);
  const metadata = await sharp(sourcePath).metadata();
  const sourceWidth = metadata.width ?? 1600;
  const fallbackWidth = Math.min(sourceWidth, 1600);
  const widths = [
    ...new Set([...responsiveWidths.filter((width) => width < sourceWidth), fallbackWidth]),
  ].sort((a, b) => a - b);
  const outputPaths = [
    destinationPath,
    ...widths.flatMap((width) => [
      join(parsed.dir, `${parsed.name}-${width}.avif`),
      join(parsed.dir, `${parsed.name}-${width}.webp`),
    ]),
  ];

  await mkdir(parsed.dir, { recursive: true });

  if (await outputsAreCurrent(sourcePath, outputPaths)) {
    skippedCount += 1;
    return;
  }

  await sharp(sourcePath)
    .rotate()
    .resize({ width: fallbackWidth, withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(destinationPath);

  await Promise.all(
    widths.flatMap((width) => [
      sharp(sourcePath)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: 55, effort: 4 })
        .toFile(join(parsed.dir, `${parsed.name}-${width}.avif`)),
      sharp(sourcePath)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78, effort: 4 })
        .toFile(join(parsed.dir, `${parsed.name}-${width}.webp`)),
    ])
  );
  generatedCount += 1;
}

async function outputsAreCurrent(sourcePath, outputPaths) {
  const sourceModified = (await stat(sourcePath)).mtimeMs;
  const outputStats = await Promise.all(outputPaths.map((path) => stat(path).catch(() => null)));

  return outputStats.every((outputStat) => outputStat && outputStat.mtimeMs >= sourceModified);
}

async function generateBrandAssets() {
  const sourcePath = resolve(outputDir, 'brand', 'fcc-logo.png');
  const brandOutputDir = resolve(outputDir, 'brand');
  const avifPath = resolve(brandOutputDir, 'fcc-logo-128.avif');
  const webpPath = resolve(brandOutputDir, 'fcc-logo-128.webp');

  if (await outputsAreCurrent(sourcePath, [avifPath, webpPath])) {
    skippedCount += 1;
    return;
  }

  await Promise.all([
    sharp(sourcePath)
      .resize({ width: 128, withoutEnlargement: true })
      .avif({ quality: 65, effort: 4 })
      .toFile(avifPath),
    sharp(sourcePath)
      .resize({ width: 128, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(webpPath),
  ]);
  generatedCount += 1;
}

const sourceStats = await stat(sourceDir).catch(() => null);

if (!sourceStats?.isDirectory()) {
  throw new Error(`Source image directory not found: ${sourceDir}`);
}

const imagePaths = await listImages(sourceDir);
await Promise.all(imagePaths.map(generateImage));

const socialSource = resolve(sourceDir, 'home', 'sanctuary-hero.jpg');
const socialOutputDir = resolve(outputDir, 'social');
const socialOutput = resolve(socialOutputDir, 'fcc-anniston.jpg');
await mkdir(socialOutputDir, { recursive: true });
if (await outputsAreCurrent(socialSource, [socialOutput])) {
  skippedCount += 1;
} else {
  await sharp(socialSource)
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 84, progressive: true, mozjpeg: true })
    .toFile(socialOutput);
  generatedCount += 1;
}

await generateBrandAssets();

console.log(`Image assets ready: ${generatedCount} generated, ${skippedCount} unchanged.`);
