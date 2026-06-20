import { fireEvent, render, screen, userEvent, waitFor } from '@/test-utils';
import { AvatarCropper } from './AvatarCropper';

const photoMocks = vi.hoisted(() => ({
  createAvatarSource: vi.fn(),
  releaseAvatarSource: vi.fn(),
}));

vi.mock('../../lib/memberPortalPhotos', () => ({
  createAvatarSource: photoMocks.createAvatarSource,
  releaseAvatarSource: photoMocks.releaseAvatarSource,
}));

const copy = {
  cancel: 'Cancel',
  choosePhoto: 'Choose and position photo',
  cropHelp: 'Choose the center.',
  cropHorizontal: 'Move photo left or right',
  cropTitle: 'Position your profile photo',
  cropVertical: 'Move photo up or down',
  photoFormats: 'JPG, PNG, WebP, HEIC, or HEIF up to 25 MB.',
  uploadPhoto: 'Submit photo for review',
};

describe('AvatarCropper', () => {
  beforeEach(() => {
    photoMocks.createAvatarSource.mockReset();
    photoMocks.releaseAvatarSource.mockReset();
  });

  it('opens from a clearly labeled chooser and submits the selected position', async () => {
    const sourceBlob = new Blob(['photo'], { type: 'image/jpeg' });
    photoMocks.createAvatarSource.mockResolvedValue({
      blob: sourceBlob,
      height: 800,
      url: 'blob:preview',
      width: 1200,
    });
    const onSubmit = vi.fn().mockResolvedValue(true);
    const user = userEvent.setup();
    const { container } = render(
      <AvatarCropper busy={false} copy={copy} onError={vi.fn()} onSubmit={onSubmit} />
    );

    expect(screen.getByRole('button', { name: copy.choosePhoto })).toBeInTheDocument();
    await user.upload(
      container.querySelector('input[type="file"]') as HTMLInputElement,
      new File(['photo'], 'portrait.jpg', { type: 'image/jpeg' })
    );

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    const horizontal = screen.getByRole('slider', { name: copy.cropHorizontal });
    fireEvent.keyDown(horizontal, { key: 'Home' });
    await user.click(screen.getByRole('button', { name: copy.uploadPhoto }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(sourceBlob, expect.objectContaining({ x: 0, y: 50 }))
    );
  });
});
