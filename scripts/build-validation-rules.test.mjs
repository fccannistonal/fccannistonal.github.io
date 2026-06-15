import { describe, expect, it } from 'vitest';
import { isConflictCopyArtifactPath } from './build-validation-rules.mjs';

describe('build validation rules', () => {
  it('detects duplicate conflict-copy artifact names', () => {
    expect(isConflictCopyArtifactPath('community/index 2.html')).toBe(true);
    expect(isConflictCopyArtifactPath('es/acerca 2/index.html')).toBe(true);
    expect(isConflictCopyArtifactPath('images/staff 3/photo.jpg')).toBe(true);
  });

  it('allows normal generated asset names', () => {
    expect(isConflictCopyArtifactPath('images/social/fcc-anniston.jpg')).toBe(false);
    expect(isConflictCopyArtifactPath('images/home/sanctuary-hero-1600.webp')).toBe(false);
    expect(isConflictCopyArtifactPath('reports 2026/index.html')).toBe(false);
    expect(isConflictCopyArtifactPath('ministry 20/index.html')).toBe(false);
  });
});
