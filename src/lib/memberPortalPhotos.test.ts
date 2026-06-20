import { describe, expect, it } from 'vitest';
import { getAvatarCrop } from './memberPortalPhotos';

describe('member portal photo cropping', () => {
  it('maps horizontal positioning across a landscape photo', () => {
    expect(getAvatarCrop(1200, 800, { x: 0, y: 50 })).toEqual({
      size: 800,
      sourceX: 0,
      sourceY: 0,
    });
    expect(getAvatarCrop(1200, 800, { x: 100, y: 50 })).toEqual({
      size: 800,
      sourceX: 400,
      sourceY: 0,
    });
  });

  it('maps vertical positioning across a portrait photo and clamps invalid values', () => {
    expect(getAvatarCrop(600, 1000, { x: -20, y: 120 })).toEqual({
      size: 600,
      sourceX: 0,
      sourceY: 400,
    });
  });
});
