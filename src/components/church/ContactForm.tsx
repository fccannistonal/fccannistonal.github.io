import { useState, type FormEvent } from 'react';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import { Alert, Button, Paper, Stack, Text, Textarea, TextInput, Title } from '@mantine/core';
import { getFormspreeEndpoint } from '../../lib/formConfig';

type FormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const INITIAL_VALUES: FormValues = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

function validateForm(values: FormValues) {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Please share your name.';
  }

  if (!values.email.trim()) {
    errors.email = 'Please share an email address.';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!values.message.trim()) {
    errors.message = 'Please add a message before sending.';
  }

  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus({ type: 'error', message: 'Please review the highlighted fields.' });
      return;
    }

    const endpoint = getFormspreeEndpoint();

    if (!endpoint) {
      setStatus({
        type: 'error',
        message: 'Set VITE_FORMSPREE_ENDPOINT before launching the contact form.',
      });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          errors?: Array<{ message?: string }>;
        } | null;
        throw new Error(payload?.errors?.[0]?.message ?? 'Unable to send your message right now.');
      }

      setValues(INITIAL_VALUES);
      setErrors({});
      setStatus({
        type: 'success',
        message: 'Thanks for reaching out. Your message has been sent.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to send your message right now.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  return (
    <Paper withBorder p={{ base: 'lg', md: 'xl' }} radius="xl">
      <Title order={2}>Send us a message</Title>
      <Text c="dimmed" mt="sm">
        Share a question, prayer request, or first-visit note and route it to the church inbox
        through Formspree.
      </Text>

      <form onSubmit={handleSubmit} noValidate>
        <Stack gap="md" mt="lg">
          {status ? (
            <Alert
              color={status.type === 'success' ? 'green' : 'red'}
              icon={
                status.type === 'success' ? (
                  <IconCircleCheck size={18} />
                ) : (
                  <IconAlertCircle size={18} />
                )
              }
              title={status.type === 'success' ? 'Message sent' : 'Unable to send'}
              radius="lg"
            >
              {status.message}
            </Alert>
          ) : null}

          <TextInput
            label="Name"
            name="name"
            value={values.name}
            onChange={(event) => updateValue('name', event.currentTarget.value)}
            error={errors.name}
            required
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => updateValue('email', event.currentTarget.value)}
            error={errors.email}
            required
          />
          <TextInput
            label="Phone"
            name="phone"
            value={values.phone}
            onChange={(event) => updateValue('phone', event.currentTarget.value)}
            description="Optional"
          />
          <Textarea
            label="Message"
            name="message"
            value={values.message}
            onChange={(event) => updateValue('message', event.currentTarget.value)}
            error={errors.message}
            minRows={6}
            required
          />

          <Button type="submit" loading={isSubmitting} size="md">
            Send message
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
