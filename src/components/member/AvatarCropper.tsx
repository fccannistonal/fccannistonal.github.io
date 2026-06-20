import { useEffect, useRef, useState } from 'react';
import { IconCamera, IconUpload } from '@tabler/icons-react';
import { Button, Group, Modal, Slider, Stack, Text } from '@mantine/core';
import {
  createAvatarSource,
  releaseAvatarSource,
  type AvatarPosition,
  type AvatarSource,
} from '../../lib/memberPortalPhotos';
import classes from './AvatarCropper.module.css';

type AvatarCropperCopy = {
  cancel: string;
  choosePhoto: string;
  cropHelp: string;
  cropHorizontal: string;
  cropTitle: string;
  cropVertical: string;
  photoFormats: string;
  uploadPhoto: string;
};

type AvatarCropperProps = {
  busy: boolean;
  copy: AvatarCropperCopy;
  disabled?: boolean;
  onError: (message: string) => void;
  onSubmit: (source: Blob, position: AvatarPosition) => Promise<boolean>;
  submitLabel?: string;
  triggerLabel?: string;
};

const acceptedPhotoTypes =
  'image/jpeg,image/png,image/webp,image/heic,image/heif,image/heic-sequence,image/heif-sequence,.jpg,.jpeg,.png,.webp,.heic,.heif';

export function AvatarCropper({
  busy,
  copy,
  disabled = false,
  onError,
  onSubmit,
  submitLabel = copy.uploadPhoto,
  triggerLabel = copy.choosePhoto,
}: AvatarCropperProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [opened, setOpened] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [source, setSource] = useState<AvatarSource | null>(null);
  const [position, setPosition] = useState<AvatarPosition>({ x: 50, y: 50 });

  useEffect(() => () => releaseAvatarSource(source), [source]);

  const close = () => {
    if (submitting || busy) {
      return;
    }
    setOpened(false);
    setSource(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const selectPhoto = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    setPreparing(true);
    try {
      const nextSource = await createAvatarSource(file);
      setSource(nextSource);
      setPosition({ x: 50, y: 50 });
      setOpened(true);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'This photo could not be opened.');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } finally {
      setPreparing(false);
    }
  };

  const submit = async () => {
    if (!source) {
      return;
    }
    setSubmitting(true);
    const succeeded = await onSubmit(source.blob, position);
    setSubmitting(false);
    if (succeeded) {
      setOpened(false);
      setSource(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        className={classes.fileInput}
        type="file"
        accept={acceptedPhotoTypes}
        onChange={(event) => void selectPhoto(event.currentTarget.files?.[0])}
      />
      <Button
        className={classes.trigger}
        variant="light"
        leftSection={<IconCamera size={18} />}
        loading={preparing}
        disabled={busy || disabled}
        onClick={() => inputRef.current?.click()}
      >
        {triggerLabel}
      </Button>
      <Text c="dimmed" size="xs">
        {copy.photoFormats}
      </Text>

      <Modal
        opened={opened}
        onClose={close}
        title={copy.cropTitle}
        centered
        size="md"
        closeOnClickOutside={!submitting && !busy}
        closeOnEscape={!submitting && !busy}
        withCloseButton={!submitting && !busy}
      >
        {source ? (
          <Stack gap="lg">
            <Text c="dimmed" size="sm">
              {copy.cropHelp}
            </Text>
            <div className={classes.preview}>
              <img
                src={source.url}
                alt=""
                style={{ objectPosition: `${position.x}% ${position.y}%` }}
              />
            </div>
            <Stack gap="xs">
              <Text size="sm" fw={600}>
                {copy.cropHorizontal}
              </Text>
              <Slider
                thumbLabel={copy.cropHorizontal}
                value={position.x}
                onChange={(x) => setPosition((current) => ({ ...current, x }))}
                label={(value) => `${value}%`}
                disabled={source.width <= source.height}
              />
            </Stack>
            <Stack gap="xs">
              <Text size="sm" fw={600}>
                {copy.cropVertical}
              </Text>
              <Slider
                thumbLabel={copy.cropVertical}
                value={position.y}
                onChange={(y) => setPosition((current) => ({ ...current, y }))}
                label={(value) => `${value}%`}
                disabled={source.height <= source.width}
              />
            </Stack>
            <Group justify="flex-end">
              <Button variant="default" disabled={submitting || busy} onClick={close}>
                {copy.cancel}
              </Button>
              <Button
                leftSection={<IconUpload size={18} />}
                loading={submitting || busy}
                disabled={disabled}
                onClick={() => void submit()}
              >
                {submitLabel}
              </Button>
            </Group>
          </Stack>
        ) : null}
      </Modal>
    </>
  );
}
